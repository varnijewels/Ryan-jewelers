import { expect, it } from 'vitest'

import { metalVariantChoices } from '../src/lib/theme/ryans-jewels/product-details.logic.js'

it('matches a card metal swatch to the same or closest grouped product configuration', () => {
	const product = {
		id: 'yellow-5-12',
		slug: 'yellow-5-12',
		ag: { 'Metal Color': ['Yellow Gold', 'Rose Gold', 'White Gold'] },
		pg: [
			{ id: 'yellow-5-12', slug: 'yellow-5-12', variantId: 'yellow', 'Metal Color': 'Yellow Gold', 'Carat Weight': '5 ct', 'Ring Size': '12' },
			{ id: 'rose-1-12', slug: 'rose-1-12', variantId: 'rose-small', 'Metal Color': 'Rose Gold', 'Carat Weight': '1 ct', 'Ring Size': '12' },
			{ id: 'rose-3-11', slug: 'rose-3-11', variantId: 'rose-wrong-size', 'Metal Color': 'Rose Gold', 'Carat Weight': '3 ct', 'Ring Size': '11' },
			{ id: 'rose-3-12', slug: 'rose-3-12', variantId: 'rose-closest', 'Metal Color': 'Rose Gold', 'Carat Weight': '3 ct', 'Ring Size': '12' },
			{ id: 'white-5-12', slug: 'white-5-12', variantId: 'white', 'Metal Color': 'White Gold', 'Carat Weight': '5 ct', 'Ring Size': '12' }
		]
	}

	const choices = metalVariantChoices(product)

	expect(choices.find((choice) => choice.key === 'rose')?.product?.slug).toBe('rose-3-12')
	expect(choices.find((choice) => choice.key === 'silver')?.product?.slug).toBe('white-5-12')
})

it('uses the real catalog Metal Type field for color choices and grouped products', () => {
	const choices = metalVariantChoices({
		id: 'white', slug: 'white', ag: { 'Metal Type': ['White Gold', 'Rose Gold', 'Yellow Gold'] },
		pg: [
			{ id: 'white', slug: 'white', 'Metal Type': 'White Gold', 'Ring Size': '7' },
			{ id: 'rose', slug: 'rose', 'Metal Type': 'Rose Gold', 'Ring Size': '7' },
			{ id: 'yellow', slug: 'yellow', 'Metal Type': 'Yellow Gold', 'Ring Size': '7' }
		]
	})
	expect(choices.map((choice) => choice.key)).toEqual(['silver', 'rose', 'gold'])
	expect(choices.find((choice) => choice.key === 'rose')?.product?.slug).toBe('rose')
})

it('prefers explicit Metal Color to a separate Metal Type field', () => {
	const choices = metalVariantChoices({ ag: { 'Metal Color': ['White Gold', 'Rose Gold'], 'Metal Type': ['14K Gold'] } })
	expect(choices.map((choice) => choice.value)).toEqual(['White Gold', 'Rose Gold'])
})
