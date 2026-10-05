import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { applyLocalClick, getPopularProducts, localTop, recordProductClick } from '../src/lib/server/product-popularity.js'

const product = { id: 'p1', title: 'Ring', slug: 'ring' }
const configured = { UPSTASH_REDIS_REST_URL: 'https://redis.example.test/', UPSTASH_REDIS_REST_TOKEN: 'test-placeholder' }
const response = (body: any, status = 200) => new Response(JSON.stringify(body), { status })

describe('persistent product popularity', () => {
	it('fails both reads and writes in production without durable storage', async () => {
		const options = { env: {}, production: true }
		await expect(recordProductClick(product, [], 'visitor', options)).rejects.toThrow('Configure persistent popularity storage')
		await expect(getPopularProducts('rings', 2, options)).rejects.toThrow('Configure persistent popularity storage')
	})

	it('rejects partial Redis configuration rather than falling back to a file', async () => {
		await expect(getPopularProducts('rings', 2, { env: { UPSTASH_REDIS_REST_URL: configured.UPSTASH_REDIS_REST_URL }, production: false })).rejects.toThrow('both be configured')
	})

	it('uses supplied runtime env and one atomic command with unique category keys', async () => {
		const fetch = vi.fn().mockResolvedValue(response({ result: 1 }))
		expect(await recordProductClick(product, ['rings', 'rings', 'all', '__proto__'], 'private-visitor', { env: configured, production: true, fetch })).toBe(true)
		expect(fetch).toHaveBeenCalledTimes(1)
		const [url, request] = fetch.mock.calls[0]
		expect(url).toBe('https://redis.example.test')
		const command = JSON.parse(request.body)
		expect(command[0]).toBe('EVAL')
		expect(command[1]).toContain("redis.call('TYPE'")
		expect(command[1].indexOf("redis.call('ZINCRBY'")).toBeLessThan(command[1].indexOf("redis.call('SET'"))
		expect(command[2]).toBe(4)
		expect(command.slice(4, 7)).toEqual(['rj:popularity:products', 'rj:popularity:all', 'rj:popularity:rings'])
		expect(request.body).not.toContain('private-visitor')
		expect(request.signal).toBeDefined()
	})

	it('returns false for an already counted visitor', async () => {
		const fetch = vi.fn().mockResolvedValue(response({ result: 0 }))
		expect(await recordProductClick(product, [], 'visitor', { env: configured, fetch })).toBe(false)
	})

	it('recognizes command errors inside HTTP 200 and does not report a saved click', async () => {
		const fetch = vi.fn().mockResolvedValue(response({ error: 'WRONGTYPE' }))
		await expect(recordProductClick(product, [], 'visitor', { env: configured, fetch })).rejects.toThrow('command failed')
	})

	it('fails on unauthorized storage and malformed results', async () => {
		for (const result of [response({ error: 'unauthorized' }, 401), response({ result: null }), response({})]) {
			await expect(recordProductClick(product, [], 'visitor', { env: configured, fetch: vi.fn().mockResolvedValue(result) })).rejects.toThrow()
		}
	})

	it('reads ranked metadata from Redis and omits missing products', async () => {
		const fetch = vi.fn().mockResolvedValueOnce(response({ result: ['p1', '3', 'p2', '2'] })).mockResolvedValueOnce(response({ result: [JSON.stringify(product), null] }))
		expect(await getPopularProducts('rings', 2, { env: configured, fetch })).toEqual([{ ...product, clicks: 3 }])
		expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(['ZREVRANGE', 'rj:popularity:rings', 0, 1, 'WITHSCORES'])
	})

	it('counts duplicate/all categories once and expires daily visitor dedupe', () => {
		const state: any = { products: {}, scores: {}, seen: {} }
		applyLocalClick(state, product, ['rings', 'rings', 'all', '__proto__'], 'visitor', 0)
		expect(localTop(state, 'all', 2)[0].clicks).toBe(1)
		expect(localTop(state, 'rings', 2)[0].clicks).toBe(1)
		expect(applyLocalClick(state, product, ['rings'], 'visitor', 86400000)).toBe(true)
	})

	it('persists concurrent local writes and deduplicates visitors across requests', async () => {
		const directory = await mkdtemp(join(tmpdir(), 'ryan-popularity-test-'))
		try {
			const options = { env: { POPULARITY_DATA_FILE: join(directory, 'clicks.json') }, production: true }
			const results = await Promise.all(Array.from({ length: 12 }, (_, index) => recordProductClick(product, ['rings'], `visitor-${index % 6}`, options)))
			expect(results.filter(Boolean)).toHaveLength(6)
			expect(await getPopularProducts('rings', 2, options)).toEqual([{ ...product, clicks: 6 }])
		} finally { await rm(directory, { recursive: true, force: true }) }
	})
})
