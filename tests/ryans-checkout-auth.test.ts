import { describe, expect, it, vi } from 'vitest'

vi.mock('$lib/core/services/index.js', () => ({
	UserService: class {
		constructor(private fetch: typeof globalThis.fetch) {}

		async getMe() {
			const response = await this.fetch('/api/users/me')
			if (!response.ok) throw new Error('Invalid session')
			return response.json()
		}
	}
}))

import { load } from '../src/routes/(www)/checkout/+layout.server.js'

function event(path: string, sid?: string, response = new Response('{}', { status: 401 })) {
	return {
		cookies: { get: (name: string) => (name === 'connect.sid' ? sid : undefined) },
		fetch: vi.fn().mockResolvedValue(response),
		url: new URL(`https://shop.test${path}`)
	} as any
}

describe('Ryan checkout authentication', () => {
	it('keeps the cart available to signed-out visitors', async () => {
		await expect(load(event('/checkout/cart'))).resolves.toEqual({})
	})

	it('requires login before address and payment pages', async () => {
		for (const path of ['/checkout/address', '/checkout/payment']) {
			await expect(load(event(path))).rejects.toMatchObject({
				status: 307,
				location: `/checkout/cart?show_auth=true&login=true&redirect=${encodeURIComponent(path)}`
			})
		}
	})

	it('allows an authenticated customer to continue', async () => {
		const response = new Response(JSON.stringify({ id: 'user_1' }), {
			status: 200,
			headers: { 'content-type': 'application/json' }
		})
		await expect(load(event('/checkout/payment', 'valid-session', response))).resolves.toEqual({})
	})
})
