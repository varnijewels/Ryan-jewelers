import { describe, expect, it } from 'vitest'
import { applyClientFilters, listingFilterOptions } from '../src/lib/theme/ryans-jewels/product-filters.js'
import { mainCategoryForUrl } from '../src/lib/theme/ryans-jewels/listing-content.js'
import { catalogNavigation } from '../src/lib/theme/ryans-jewels/catalog-navigation.js'

describe('category listing filters', () => {
	it('matches the center shape rather than an unrelated side-stone tag', () => {
		const products = [{ id: 'emerald', tags: [{ name: 'Round' }], attributes: [{ name: 'Diamond Shape', value: 'Emerald' }] }]
		expect(applyClientFilters(products, new URL('https://test/products?uiShape=Round'))).toHaveLength(0)
		expect(applyClientFilters(products, new URL('https://test/products?uiShape=Emerald'))).toHaveLength(1)
	})
	it('uses exact carat values, combining dimensions with AND', () => {
		const products = [1, 10].map(weight => ({ attributes: [{ name: 'Total Carat Weight', value: `${weight} ct` }, { name: 'Metal Type', value: 'White Gold' }, { name: 'Metal Stamp', value: '14K' }] }))
		expect(applyClientFilters(products, new URL('https://test/products?uiWeight=1%20ct&uiMaterial=White%20Gold&uiKarat=14K'))).toEqual([products[0]])
		expect(applyClientFilters(products, new URL('https://test/products?uiMaterial=Rose%20Gold&uiKarat=14K'))).toHaveLength(0)
	})
	it('separates purity from metal color and includes new diamond-color attributes', () => {
		const groups = listingFilterOptions([{ attributes: [{ name: 'Metal Stamp', value: '14K' }, { name: 'Diamond Color', value: 'E-F' }] }], { 'attributes.Metal_Type': { '14K Gold': 3, 'White Gold': 2 }, 'tags.name': { '14K Gold': 3, '10K Gold': 2 } })
		expect(groups.find(group => group.key === 'uiMaterial')?.values).toEqual(['White Gold'])
		expect(groups.find(group => group.key === 'uiKarat')?.values).toEqual(['10K', '14K'])
		expect(groups.find(group => group.key === 'uiColor')?.values).toEqual(['E-F'])
	})
	it('does not treat inventory-unmanaged products as out of stock', () => {
		const product = { manageInventory: false, stock: 0 }
		expect(applyClientFilters([product], new URL('https://test/products?uiStatus=In%20Stock'))).toEqual([product])
		expect(applyClientFilters([product], new URL('https://test/products?uiStatus=Out%20of%20stock'))).toEqual([])
	})
	it('shows new banners on every main category but never on a subcategory', () => {
		for (const category of catalogNavigation) {
			expect(mainCategoryForUrl(new URL(category.href, 'https://test'))?.name).toBe(category.name)
			for (const child of category.children) expect(mainCategoryForUrl(new URL(child.href, 'https://test'))).toBeUndefined()
		}
		expect(mainCategoryForUrl(new URL('https://test/categories/rings?uiMaterial=White%20Gold'))?.name).toBe('Rings')
	})
})
