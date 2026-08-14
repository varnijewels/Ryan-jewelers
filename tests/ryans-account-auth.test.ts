import { describe, expect, it, vi } from 'vitest'
import { load } from '../src/routes/(my)/+layout.server.js'

describe('Ryan account auth guard', () => {
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
})
