import { describe, expect, it } from 'vitest'
import { applyClientFilters, facetOptions, filterProductsByCategory, productRating, realCatalogUrl, withoutDemoProducts } from '../src/lib/theme/ryans-jewels/product-filters.js'
import { diamondShapes } from '../src/lib/theme/ryans-jewels/home-content.js'

const products = [
	{ id: 'a', title: 'Z Ring', stock: 2, popularity: 5, rating: 3, tags: [{ name: '10k Gold' }], attributes: [{ name: 'Color', value: 'Rose' }] },
	{ id: 'b', title: 'A Ring', stock: 0, popularity: 0, rating: 5, attributes: [{ name: 'Stone Shape', value: 'Oval' }] }
]

describe('Ryan product filters', () => {
	it('filters status and metadata and applies local sorts', () => {
		expect(applyClientFilters(products, new URL('https://shop.test/products?uiStatus=In%2520Stock')).map((p: any) => p.id)).toEqual(['a'])
		expect(applyClientFilters(products, new URL('https://shop.test/products?uiMaterial=10k%2520Rose%2520gold')).map((p: any) => p.id)).toEqual(['a'])
		expect(applyClientFilters(products, new URL('https://shop.test/products?uiShape=Oval')).map((p: any) => p.id)).toEqual(['b'])
		expect(applyClientFilters(products, new URL('https://shop.test/products?uiSort=title%3Aasc')).map((p: any) => p.id)).toEqual(['b', 'a'])
		expect(applyClientFilters(products, new URL('https://shop.test/products?uiSort=rating%3Adesc')).map((p: any) => p.id)).toEqual(['b', 'a'])
	})

	it('builds filter options from admin facets', () => {
		const facets = { 'options.Material': { Gold: 3 }, 'attributes.Metal_Type': { Gold: 2, Platinum: 1 }, 'tags.name': { Rings: 4 } }
		expect(facetOptions(facets, ['options.Material', 'attributes.Metal_Type'])).toEqual([
			{ name: 'Gold', count: 3 },
			{ name: 'Platinum', count: 1 }
		])
		expect(facetOptions(facets, ['missing'], /ring/i)).toEqual([{ name: 'Rings', count: 4 }])
	})

	it('shows only real ratings and keeps them inside the five-star scale', () => {
		expect(productRating({ ratings: [{ rating: 4 }, { rating: 5 }] })).toBe(4.5)
		expect(productRating({ averageRating: 7 })).toBe(5)
		expect(productRating({})).toBe(0)
	})

	it('links every homepage cut to the working shape filter', () => {
		expect(diamondShapes.map(({ label, href }: any) => [label, href])).toContainEqual(['Round', '/products?uiShape=Round'])
		expect(diamondShapes.every(({ label, href }: any) => href === `/products?uiShape=${label}`)).toBe(true)
	})

	it('keeps real catalogue products and excludes every verified demo signature', () => {
		const real = { sku: 'JWS-HALO-RD', tags: [{ name: 'JewelWeSell' }], thumbnail: 'https://media.jewelwesell.com/products/ring.png' }
		const productsWithDemo = [
			real,
			{ sku: 'DMY-STUD-001' },
			{ sku: 'OTHER', tags: [{ name: 'Dummy Data' }] },
			{ sku: 'OTHER-2', variants: [{ img: 'https://media.jewelwesell.com/dummy/grid/ring.webp' }] }
		]
		expect(withoutDemoProducts(productsWithDemo)).toEqual([real])
		expect(realCatalogUrl(new URL('https://shop.test/products?uiShape=Round')).searchParams.get('tags')).toBe('JewelWeSell')
	})

	it('filters the homepage row by jewellery category without matching earring as ring', () => {
		const catalogue = [
			{ title: 'Round Diamond Ring' },
			{ title: 'Pear Diamond Pendant', description: 'A matching ring is also available.' },
			{ title: 'Diamond Earrings' }
		]
		expect(filterProductsByCategory(catalogue, 'All')).toHaveLength(3)
		expect(filterProductsByCategory(catalogue, 'Rings').map((product) => product.title)).toEqual(['Round Diamond Ring'])
		expect(filterProductsByCategory(catalogue, 'Pendants').map((product) => product.title)).toEqual(['Pear Diamond Pendant'])
		expect(filterProductsByCategory(catalogue, 'Earrings').map((product) => product.title)).toEqual(['Diamond Earrings'])
	})
})
