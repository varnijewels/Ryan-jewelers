import { describe, expect, it } from 'vitest'
import { applyClientFilters, facetOptions, realCatalogUrl, withoutDemoProducts } from '../src/lib/theme/ryans-jewels/product-filters.js'
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
	})

	it('builds filter options from admin facets', () => {
		const facets = { 'options.Material': { Gold: 3 }, 'attributes.Metal_Type': { Gold: 2, Platinum: 1 }, 'tags.name': { Rings: 4 } }
		expect(facetOptions(facets, ['options.Material', 'attributes.Metal_Type'])).toEqual([
			{ name: 'Gold', count: 3 },
			{ name: 'Platinum', count: 1 }
		])
		expect(facetOptions(facets, ['missing'], /ring/i)).toEqual([{ name: 'Rings', count: 4 }])
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
})
