import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { tmpdir } from 'node:os'

export type PopularProduct = { id: string; title: string; slug: string; thumbnail?: string }
type PopularityState = { products: Record<string, PopularProduct>; scores: Record<string, Record<string, number>>; seen: Record<string, number> }

const emptyState = (): PopularityState => ({ products: {}, scores: {}, seen: {} })
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
const localFile = process.env.POPULARITY_DATA_FILE || `${tmpdir()}/ryan-jewels-product-popularity.json`
const dedupeSeconds = 86_400
let localWrite = Promise.resolve<unknown>(undefined)

const visitorHash = (visitorId: string) => createHash('sha256').update(visitorId).digest('hex')
const scoreKey = (category?: string) => `rj:popularity:${category || 'all'}`

async function redis(command: Array<string | number>) {
	if (!redisUrl || !redisToken) throw new Error('Redis is not configured')
	const response = await fetch(redisUrl, { method: 'POST', headers: { authorization: `Bearer ${redisToken}`, 'content-type': 'application/json' }, body: JSON.stringify(command) })
	const body = await response.json()
	if (!response.ok || body.error) throw new Error(body.error || `Redis request failed (${response.status})`)
	return body.result
}

async function redisPipeline(commands: Array<Array<string | number>>) {
	if (!redisUrl || !redisToken) throw new Error('Redis is not configured')
	const response = await fetch(`${redisUrl}/pipeline`, { method: 'POST', headers: { authorization: `Bearer ${redisToken}`, 'content-type': 'application/json' }, body: JSON.stringify(commands) })
	if (!response.ok) throw new Error(`Redis pipeline failed (${response.status})`)
}

async function readLocal() {
	try { return JSON.parse(await readFile(localFile, 'utf8')) as PopularityState }
	catch (error: any) { if (error?.code === 'ENOENT') return emptyState(); throw error }
}

async function writeLocal(state: PopularityState) {
	await mkdir(dirname(localFile), { recursive: true })
	const temporaryFile = `${localFile}.${process.pid}.tmp`
	await writeFile(temporaryFile, JSON.stringify(state), 'utf8')
	await rename(temporaryFile, localFile)
}

export function applyLocalClick(state: PopularityState, product: PopularProduct, categories: string[], visitorId: string, now = Date.now()) {
	const seenKey = `${product.id}:${visitorHash(visitorId)}`
	state.products[product.id] = product
	if (state.seen[seenKey] !== undefined && state.seen[seenKey] > now - dedupeSeconds * 1000) return false
	state.seen[seenKey] = now
	for (const category of ['all', ...categories]) {
		state.scores[category] ||= {}
		state.scores[category][product.id] = (state.scores[category][product.id] || 0) + 1
	}
	return true
}

export function localTop(state: PopularityState, category: string, limit: number) {
	return Object.entries(state.scores[category] || {}).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([id, clicks]) => ({ ...state.products[id], clicks }))
}

export async function recordProductClick(product: PopularProduct, categories: string[], visitorId: string) {
	if (redisUrl && redisToken) {
		const seen = await redis(['SET', `rj:popularity:seen:${product.id}:${visitorHash(visitorId)}`, '1', 'NX', 'EX', dedupeSeconds])
		await redis(['HSET', 'rj:popularity:products', product.id, JSON.stringify(product)])
		if (seen !== 'OK') return false
		await redisPipeline(['all', ...categories].map((category) => ['ZINCRBY', scoreKey(category), 1, product.id]))
		return true
	}
	if (process.env.NODE_ENV === 'production') throw new Error('Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
	// ponytail: one process-wide queue is enough for local dev; Redis handles production concurrency.
	let recorded = false
	localWrite = localWrite.catch(() => {}).then(async () => { const state = await readLocal(); recorded = applyLocalClick(state, product, categories, visitorId); await writeLocal(state) })
	await localWrite
	return recorded
}

export async function getPopularProducts(category: string, limit: number) {
	if (redisUrl && redisToken) {
		const rows = (await redis(['ZREVRANGE', scoreKey(category), 0, limit - 1, 'WITHSCORES'])) as string[]
		const ids = rows.filter((_, index) => index % 2 === 0)
		if (!ids.length) return []
		const products = (await redis(['HMGET', 'rj:popularity:products', ...ids])) as Array<string | null>
		return ids.flatMap((id, index) => products[index] ? [{ ...JSON.parse(products[index] as string), clicks: Number(rows[index * 2 + 1]) }] : [])
	}
	return localTop(await readLocal(), category, limit)
}
