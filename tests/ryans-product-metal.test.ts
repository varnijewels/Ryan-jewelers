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
