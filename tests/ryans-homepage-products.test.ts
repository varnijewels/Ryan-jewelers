import { expect, it, vi } from 'vitest'

vi.mock('$lib/core/load-functions/index.js', () => ({
	wwwLoad: vi.fn(),
	wwwProductsLoad: vi.fn()
}))

import { load } from '../src/routes/(www)/+page.js'

it('loads Ryan homepage products from the primary catalog', async () => {
	const fetch = vi.fn(async () => ({
		ok: true,
		json: async () => ({
			data: [
				{ id: 'real-ring', sku: 'JWS-RING', attributes: [{ id: 'metadata', name: 'Metal Type', value: '14K Gold', storeId: 'store' }] },
				{ id: 'demo-ring', sku: 'DMY-RING' }
			]
		})
	}))

	const result = await load({
		parent: async () => ({ theme: { name: 'ryans-jewels' }, store: { id: 'ryan-store' } }),
		fetch
	} as any)

	expect(fetch).toHaveBeenCalledWith('/api/products?page=1&sort=-createdAt', {
		headers: { 'x-litekart-store': 'ryan-store' }
	})
	expect(result.storefrontProducts).toEqual([{ id: 'real-ring', sku: 'JWS-RING', attributes: [{ name: 'Metal Type', value: '14K Gold' }] }])
})
