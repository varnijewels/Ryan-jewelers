import { describe, expect, it } from 'vitest'
import { applyClientFilters, facetOptions } from '../src/lib/theme/ryans-jewels/product-filters'

const products = [
	{ id: 'a', title: 'Z Ring', stock: 2, popularity: 5, rating: 3, tags: [{ name: '10k Gold' }], attributes: [{ name: 'Color', value: 'Rose' }] },
	{ id: 'b', title: 'A Ring', stock: 0, popularity: 0, rating: 5, attributes: [{ name: 'Stone Shape', value: 'Oval' }] }
]

describe('Ryan product filters', () => {
	it('filters status and metadata and applies local sorts', () => {
		expect(applyClientFilters(products, new URL('https://shop.test/products?uiStatus=In%2520Stock')).map((p) => p.id)).toEqual(['a'])
		expect(applyClientFilters(products, new URL('https://shop.test/products?uiMaterial=10k%2520Rose%2520gold')).map((p) => p.id)).toEqual(['a'])
		expect(applyClientFilters(products, new URL('https://shop.test/products?uiShape=Oval')).map((p) => p.id)).toEqual(['b'])
		expect(applyClientFilters(products, new URL('https://shop.test/products?uiSort=title%3Aasc')).map((p) => p.id)).toEqual(['b', 'a'])
	})

	it('builds filter options from admin facets', () => {
		const facets = { 'options.Material': { Gold: 3 }, 'attributes.Metal_Type': { Gold: 2, Platinum: 1 }, 'tags.name': { Rings: 4 } }
		expect(facetOptions(facets, ['options.Material', 'attributes.Metal_Type'])).toEqual([{ name: 'Gold', count: 3 }, { name: 'Platinum', count: 1 }])
		expect(facetOptions(facets, ['missing'], /ring/i)).toEqual([{ name: 'Rings', count: 4 }])
	})
})
