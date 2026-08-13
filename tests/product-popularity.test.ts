import { describe, expect, it } from 'vitest'
import { applyLocalClick, localTop } from '../src/lib/server/product-popularity.js'

describe('product popularity', () => {
	it('deduplicates daily clicks and ranks products by category', () => {
		const state: any = { products: {}, scores: {}, seen: {} }
		const first = { id: 'p1', title: 'First', slug: 'first' }
		const second = { id: 'p2', title: 'Second', slug: 'second' }
		expect(applyLocalClick(state, first, ['rings'], 'visitor-a', 1)).toBe(true)
		expect(applyLocalClick(state, first, ['rings'], 'visitor-a', 2)).toBe(false)
		expect(applyLocalClick(state, second, ['rings'], 'visitor-b', 3)).toBe(true)
		expect(applyLocalClick(state, second, ['rings'], 'visitor-c', 4)).toBe(true)
		expect(localTop(state, 'rings', 2).map(({ id, clicks }) => [id, clicks])).toEqual([['p2', 2], ['p1', 1]])
	})
})
