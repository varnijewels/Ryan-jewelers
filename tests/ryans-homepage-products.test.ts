import { expect, it, vi } from 'vitest'

vi.mock('$lib/core/load-functions/index.js', () => ({
	wwwLoad: vi.fn(),
	wwwProductsLoad: vi.fn()
}))

import { load } from '../src/routes/(www)/+page.js'

it('does not block Ryan homepage HTML on the below-fold product catalog', async () => {
	const fetch = vi.fn()

	const result = await load({
		parent: async () => ({ theme: { name: 'ryans-jewels' }, store: { id: 'ryan-store' } }),
		fetch
	} as any)

	expect(fetch).not.toHaveBeenCalled()
	expect(result.storefrontProducts).toEqual([])
})
