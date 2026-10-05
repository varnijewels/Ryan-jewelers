import { beforeEach, describe, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ record: vi.fn(), read: vi.fn(), env: { UPSTASH_REDIS_REST_URL: 'https://redis.example.test', UPSTASH_REDIS_REST_TOKEN: 'test-placeholder' } }))
vi.mock('$env/dynamic/private', () => ({ env: mocks.env }))
vi.mock('$app/environment', () => ({ dev: false }))
vi.mock('$lib/server/product-popularity.js', async (importOriginal) => ({ ...(await importOriginal<any>()), recordProductClick: mocks.record, getPopularProducts: mocks.read }))
import { POST } from '../src/routes/api/popularity/update/+server.js'
import { GET } from '../src/routes/api/popularity/+server.js'

const product = { id: 'p1', title: 'Ring', slug: 'ring' }
const post = (body: any) => ({ request: new Request('https://shop.test/api/popularity/update', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }), cookies: { get: vi.fn().mockReturnValue('visitor-cookie'), set: vi.fn() }, url: new URL('https://shop.test/api/popularity/update') })

describe('popularity HTTP handlers', () => {
	beforeEach(() => { mocks.record.mockReset().mockResolvedValue(true); mocks.read.mockReset().mockResolvedValue([]) })
	it('returns 400 for null/malformed/unsafe product bodies rather than crashing', async () => {
		for (const body of [null, {}, { product: { ...product, id: '__proto__' } }, { product: { ...product, title: ' ' } }]) expect((await POST(post(body))).status).toBe(400)
		expect(mocks.record).not.toHaveBeenCalled()
	})
	it('rejects invalid JSON', async () => {
		const event = post({})
		event.request = new Request(event.url, { method: 'POST', body: '{' })
		expect((await POST(event)).status).toBe(400)
	})
	it('passes SvelteKit runtime private env to storage and sanitizes categories', async () => {
		const event = post({ product, categories: ['rings', 'rings', '__proto__', 'x'.repeat(121), 7] })
		const response = await POST(event)
		expect(await response.json()).toEqual({ recorded: true })
		expect(mocks.record).toHaveBeenCalledWith(product, ['rings'], 'visitor-cookie', { env: mocks.env, production: true })
		expect(event.cookies.set).toHaveBeenCalledWith('rj_popularity_sid', 'visitor-cookie', expect.objectContaining({ httpOnly: true, secure: true, sameSite: 'lax' }))
		expect(response.headers.get('cache-control')).toBe('no-store')
	})
	it('returns a truthful duplicate result', async () => {
		mocks.record.mockResolvedValue(false)
		expect(await (await POST(post({ product }))).json()).toEqual({ recorded: false })
	})
	it('returns non-cacheable 503 with retry guidance on storage failure', async () => {
		const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
		try {
			mocks.record.mockRejectedValue(new Error('private-storage-details'))
			const response = await POST(post({ product }))
			expect(response.status).toBe(503)
			expect(response.headers.get('retry-after')).toBe('30')
			expect(response.headers.get('cache-control')).toBe('no-store')
			expect(JSON.stringify(await response.json())).not.toContain('private-storage-details')
		} finally { errorLog.mockRestore() }
	})
	it('rejects unsafe category keys', async () => {
		expect((await GET({ url: new URL('https://shop.test/api/popularity?category=__proto__') })).status).toBe(400)
		expect(mocks.read).not.toHaveBeenCalled()
	})
	it('clamps/floors limits and passes runtime env on reads', async () => {
		for (const [input, limit] of [['Infinity', 2], ['8.9', 8], ['999', 20]]) {
			const response = await GET({ url: new URL(`https://shop.test/api/popularity?category=rings&limit=${input}`) })
			expect(response.status).toBe(200)
			expect(mocks.read).toHaveBeenLastCalledWith('rings', limit, { env: mocks.env, production: true })
		}
	})
	it('does not return fake empty success when storage reads fail', async () => {
		const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
		try {
			mocks.read.mockRejectedValue(new Error('Unavailable'))
			expect((await GET({ url: new URL('https://shop.test/api/popularity?category=rings') })).status).toBe(503)
		} finally { errorLog.mockRestore() }
	})
})
