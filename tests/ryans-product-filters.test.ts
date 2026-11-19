import { describe, expect, it } from 'vitest'
import {
	applyClientFilters,
	facetOptions,
	filterProductsByCategory,
	interleaveProductCategories,
	isRyanCategoryVisible,
	productRating,
	realCatalogUrl,
	withoutDemoProducts
} from '../src/lib/theme/ryans-jewels/product-filters.js'
import { diamondShapes } from '../src/lib/theme/ryans-jewels/home-content.js'

const products = [
	{ id: 'a', title: 'Z Ring', stock: 2, popularity: 5, rating: 3, tags: [{ name: '10k Gold' }], attributes: [{ name: 'Color', value: 'Rose' }] },
	{ id: 'b', title: 'A Ring', stock: 0, popularity: 0, rating: 5, attributes: [{ name: 'Stone Shape', value: 'Oval' }] }
]

describe('Ryan product filters', () => {
	it('alternates product categories without dropping products or changing their order within a category', () => {
		const catalogue = ['Ring', 'Ring', 'Ring', 'Pendant', 'Pendant', 'Earrings', 'Earrings', 'Bracelet', 'Necklace'].map((title, id) => ({ id, title }))
		expect(interleaveProductCategories(catalogue).map((product) => product.id)).toEqual([0, 3, 5, 7, 8, 1, 4, 6, 2])
		expect(catalogue.map((product) => product.id)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
	})

	it('recognizes admin categories on bridal sets and preserves uncategorized products', () => {
		const catalogue = [
			{ id: 'set-1', title: 'Bridal Set', categories: [{ category: { name: 'Rings' } }] },
			{ id: 'set-2', title: 'Bridal Set', categories: [{ category: { name: 'Rings' } }] },
			{ id: 'pendant', title: 'Custom piece', tags: [{ name: 'Pendants' }] },
			{ id: 'other', title: 'Jewelry accessory' }
		]
		expect(interleaveProductCategories(catalogue).map((product) => product.id)).toEqual(['set-1', 'pendant', 'other', 'set-2'])
		expect(interleaveProductCategories([])).toEqual([])
		expect(interleaveProductCategories(catalogue.slice(0, 2))).toEqual(catalogue.slice(0, 2))
	})

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
		const url = realCatalogUrl(new URL('https://shop.test/products?uiShape=Round&catalog=Round%20Rings'))
		expect(url.searchParams.has('tags')).toBe(false)
		expect(url.searchParams.has('catalog')).toBe(false)
	})

	it('includes new Ryan uploads without requiring the legacy supplier tag', () => {
		const pendant = { sku: 'RJ-P-3853-0.8CT-WG-14K', tags: [{ name: 'Ryan Jewellers' }, { name: 'Solitaire Pendants' }] }
		expect(withoutDemoProducts([pendant])).toEqual([pendant])
		const url = realCatalogUrl(new URL('https://shop.test/categories/pendants?page=2'))
		expect(url.pathname).toBe('/products')
		expect(url.searchParams.get('categories')).toBe('pendants')
		expect(url.searchParams.get('page')).toBe('2')
		expect(url.searchParams.has('tags')).toBe(false)
	})

	it('preserves explicit shopper tag and category filters', () => {
		const url = realCatalogUrl(new URL('https://shop.test/products?tags=Solitaire%20Pendants&categories=pendants'))
		expect(url.searchParams.get('tags')).toBe('Solitaire Pendants')
		expect(url.searchParams.get('categories')).toBe('pendants')
	})

	it('removes kids and saree without hiding valid jewelry categories', () => {
		expect(['Kids Jewellery', 'kid-jewellery', 'Sarees', 'saree'].map((name) => isRyanCategoryVisible({ name }))).toEqual([
			false,
			false,
			false,
			false
		])
		expect(['Rings', 'Men’s Rings', 'Earrings'].every((name) => isRyanCategoryVisible({ name }))).toBe(true)
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
