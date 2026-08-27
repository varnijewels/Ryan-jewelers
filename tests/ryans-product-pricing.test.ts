import { expect, it } from 'vitest'

import { discountPercent } from '../src/lib/theme/ryans-jewels/product-details.logic.js'

it('shows each product real price gap as its discount percentage', () => {
	expect(discountPercent(995.99, 1493.99)).toBe(33)
	expect(discountPercent(800, 1000)).toBe(20)
	expect(discountPercent(1000, 1000)).toBe(0)
})
