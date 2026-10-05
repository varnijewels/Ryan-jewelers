import { expect, it } from 'vitest'
import { variationControls, nonVariationAttributes, variantForOption, groupedProductForAttribute } from '../src/lib/theme/ryans-jewels/product-details.logic.js'

it('keeps only real choices above and moves singleton grouped attributes below', () => {
	const product = {
		options: [], variants: [{ id: 'default', options: [] }],
		ag: { 'Metal Type': ['Yellow Gold', 'White Gold', 'Rose Gold'], 'Metal Stamp': ['10K', '14K'], 'Total Carat Weight': ['0.6 ct'], 'Diamond Shape': ['Round'] },
		attributes: [{ name: 'Metal Type', value: 'Yellow Gold', isGrouped: true }, { name: 'Subtitle', value: 'Halo studs', isGrouped: false }, { name: 'Diamond Shape', value: 'Round', isGrouped: true }]
	}
	expect(variationControls(product).map((item) => item.title)).toEqual(['Metal Type', 'Metal Stamp'])
	expect(variationControls(product)[0].values.map((item) => item.value)).toEqual(['Yellow Gold', 'White Gold', 'Rose Gold'])
	expect(nonVariationAttributes(product)).toEqual([{ name: 'Subtitle', value: 'Halo studs', isGrouped: false }, { name: 'Diamond Shape', value: 'Round', isGrouped: true }, { name: 'Total Carat Weight', value: '0.6 ct' }])
})

it('keeps all native options and finds values stored only on variants', () => {
	const product = { options: ['Color', 'Purity', 'Shape', 'Size'].map((title) => ({ id: title, title, values: [] })), variants: ['first', 'second'].map((value) => ({ options: ['Color', 'Purity', 'Shape', 'Size'].map((optionId) => ({ optionId, value })) })) }
	expect(variationControls(product)).toHaveLength(4)
})

it('does not select an empty default variant when another option was requested', () => {
	const variants = [{ id: 'default', options: [] }, { id: 'white', options: [{ optionId: 'metal', value: 'White Gold' }] }]
	expect(variantForOption(variants, variants[0], 'metal', 'White Gold')?.id).toBe('white')
})

it('preserves purity when changing grouped metal color', () => {
	const products = [{ id: 'yellow', slug: 'yellow', Metal: 'Yellow', Purity: '14K' }, { id: 'white10', slug: 'white10', Metal: 'White', Purity: '10K' }, { id: 'white14', slug: 'white14', Metal: 'White', Purity: '14K' }]
	expect(groupedProductForAttribute(products, products[0], 'Metal', 'White')?.id).toBe('white14')
})
