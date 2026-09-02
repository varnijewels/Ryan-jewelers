import { describe, expect, it, vi } from 'vitest'

vi.mock('$lib/core/load-functions/index.js', () => ({
	layoutServer: ({ locals }: any) => ({ store: locals.storeDetails })
}))

vi.mock('$lib/core/services/index.js', () => ({
	CategoryService: class {
		async getMegamenu() {
			return [{ name: 'Bracelets', slug: 'bracelets' }]
		}
	},
	UserService: class {
		constructor(private fetch: typeof globalThis.fetch) {}

		async getMe() {
			const response = await this.fetch('/api/users/me', undefined)
			if (!response.ok) throw new Error('Invalid session')
			return response.json()
		}
	}
}))

vi.mock('$lib/theme/index.js', () => ({
	resolveStorefrontTheme: () => ({ name: 'ryans-jewels', source: 'default', available: [] })
}))

import { load } from '../src/routes/(my)/+layout.server.js'
import { load as loadRoot } from '../src/routes/+layout.server.js'
import { load as loadMessages } from '../src/routes/(www)/messages/+page.server.js'

describe('Ryan account auth guard', () => {
	it('restores the logged-in user from the server session on refresh', async () => {
		const user = { id: 'user-1', role: 'USER' }
		const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(user), { status: 200, headers: { 'content-type': 'application/json' } }))
		const result = await loadRoot({
			cookies: { get: (name: string) => (name === 'connect.sid' ? 'valid-session' : undefined) },
			fetch,
			locals: { storeDetails: { id: 'store-1', countries: ['US'] } },
			request: { headers: new Headers() },
			url: new URL('https://shop.test/my')
		} as any)

		expect(fetch).toHaveBeenCalledWith('/api/users/me', undefined)
		expect(result.user).toEqual(user)
		expect(result.store.countries).toEqual(['US'])
	})

	it('keeps the cacheable homepage free of session-specific user data', async () => {
		const fetch = vi.fn()
		const result = await loadRoot({
			cookies: { get: (name: string) => (name === 'connect.sid' ? 'valid-session' : undefined) },
			fetch,
			locals: { storeDetails: { id: 'store-1', countries: ['US'] } },
			request: { headers: new Headers({ 'user-agent': 'Mobile Safari' }) },
			url: new URL('https://shop.test/')
		} as any)

		expect(fetch).not.toHaveBeenCalled()
		expect(result.user).toBeNull()
		expect(result.isPublicHomepage).toBe(true)
		expect(result.store).toMatchObject({ id: 'store-1', countries: [] })
		expect(result.navigation.megaMenu).toEqual([{ name: 'Bracelets', slug: 'bracelets' }])
	})

	it('rejects a stale session and keeps the requested account return URL', async () => {
		const fetch = vi.fn().mockResolvedValue(new Response('{}', { status: 401, headers: { 'content-type': 'application/json' } }))
		const request = load({
			cookies: { get: () => 'stale-session' },
			fetch,
			url: new URL('https://shop.test/my/orders?status=open')
		} as any)

		await expect(request).rejects.toMatchObject({
			status: 307,
			location: '/?show_auth=true&login=true&redirect=%2Fmy%2Forders%3Fstatus%3Dopen'
		})
	})

	it('does not accept the removed local dev-session as a customer login', async () => {
		const request = load({
			cookies: { get: (name: string) => (name === 'connect.sid' ? 'dev-session' : encodeURIComponent(JSON.stringify({ id: 'dev_user' }))) },
			fetch: vi.fn(),
			url: new URL('https://shop.test/my')
		} as any)

		await expect(request).rejects.toMatchObject({
			status: 307,
			location: '/?show_auth=true&login=true&redirect=%2Fmy'
		})
	})

	it('requires login before serving the messages page', async () => {
		const request = loadMessages({
			cookies: { get: () => undefined },
			fetch: vi.fn(),
			url: new URL('https://shop.test/messages?conversation=123')
		} as any)

		await expect(request).rejects.toMatchObject({
			status: 307,
			location: '/?show_auth=true&login=true&redirect=%2Fmessages%3Fconversation%3D123'
		})
	})
})
