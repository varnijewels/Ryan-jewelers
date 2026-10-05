import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { tmpdir } from 'node:os'

export type PopularProduct = { id: string; title: string; slug: string; thumbnail?: string }
type PopularityState = { products: Record<string, PopularProduct>; scores: Record<string, Record<string, number>>; seen: Record<string, number> }
type PopularityOptions = { env?: Record<string, string | undefined>; production?: boolean; fetch?: typeof fetch }

const emptyState = (): PopularityState => ({ products: {}, scores: {}, seen: {} })
const dedupeSeconds = 86_400
const localWrites = new Map<string, Promise<unknown>>()
export const popularityValuePattern = /^(?!__proto__$|prototype$|constructor$)[\w-]+$/

const visitorHash = (visitorId: string) => createHash('sha256').update(visitorId).digest('hex')
const scoreKey = (category?: string) => `rj:popularity:${category || 'all'}`

function storage(options: PopularityOptions) {
	const env = options.env || process.env
	const production = options.production ?? process.env.NODE_ENV === 'production'
	const redisUrl = (env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL || '').trim().replace(/\/+$/, '')
	const redisToken = (env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN || '').trim()
	if (redisUrl || redisToken) {
		if (!redisUrl || !redisToken) throw new Error('Popularity Redis URL and token must both be configured')
		const url = new URL(redisUrl)
		if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Popularity Redis requires an HTTPS REST URL')
		return { redisUrl, redisToken, localFile: '' }
	}
	// Explicit file storage is for a single Node process on a persistent disk only.
	// Production must never silently use an ephemeral /tmp file.
	if (production && !env.POPULARITY_DATA_FILE) throw new Error('Configure persistent popularity storage: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
	return { redisUrl: '', redisToken: '', localFile: env.POPULARITY_DATA_FILE || `${tmpdir()}/ryan-jewels-product-popularity.json` }
}

async function redis(command: Array<string | number>, config: ReturnType<typeof storage>, options: PopularityOptions) {
	const response = await (options.fetch || fetch)(config.redisUrl, {
		method: 'POST',
		headers: { authorization: `Bearer ${config.redisToken}`, 'content-type': 'application/json' },
		body: JSON.stringify(command),
		signal: AbortSignal.timeout(5000)
	})
	const body = await response.json()
	// Redis command errors can arrive inside an HTTP 200 response.
	if (!response.ok || body.error || !Object.hasOwn(body, 'result')) throw new Error(`Popularity storage command failed (HTTP ${response.status})`)
	return body.result
}

// One atomic operation prevents lost clicks when a request fails after deduplication.
// Check key types before writing because Redis scripts do not roll back runtime errors.
const recordClickScript = `
for i = 2, #KEYS do
  local actual = redis.call('TYPE', KEYS[i]).ok
  local expected = i == 2 and 'hash' or 'zset'
  if actual ~= 'none' and actual ~= expected then
    return redis.error_reply('Invalid popularity storage key type')
  end
end
redis.call('HSET', KEYS[2], ARGV[1], ARGV[2])
if redis.call('EXISTS', KEYS[1]) == 1 then return 0 end
for i = 3, #KEYS do redis.call('ZINCRBY', KEYS[i], 1, ARGV[1]) end
redis.call('SET', KEYS[1], '1', 'EX', ARGV[3])
return 1
`

function categoryKeys(categories: string[]) {
	return [...new Set(['all', ...categories.filter((value) => value.length <= 120 && popularityValuePattern.test(value))])]
}

async function readLocal(localFile: string) {
	try { return JSON.parse(await readFile(localFile, 'utf8')) as PopularityState }
	catch (error: any) { if (error?.code === 'ENOENT') return emptyState(); throw error }
}

async function writeLocal(state: PopularityState, localFile: string) {
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
	for (const category of categoryKeys(categories)) {
		state.scores[category] ||= {}
		state.scores[category][product.id] = (state.scores[category][product.id] || 0) + 1
	}
	return true
}

export function localTop(state: PopularityState, category: string, limit: number) {
	return Object.entries(state.scores[category] || {}).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([id, clicks]) => ({ ...state.products[id], clicks }))
}

export async function recordProductClick(product: PopularProduct, categories: string[], visitorId: string, options: PopularityOptions = {}) {
	const config = storage(options)
	if (config.redisUrl) {
		const keys = [`rj:popularity:seen:${product.id}:${visitorHash(visitorId)}`, 'rj:popularity:products', ...categoryKeys(categories).map(scoreKey)]
		const recorded = await redis(['EVAL', recordClickScript, keys.length, ...keys, product.id, JSON.stringify(product), dedupeSeconds], config, options)
		if (recorded !== 0 && recorded !== 1) throw new Error('Popularity storage returned an invalid result')
		return recorded === 1
	}
	// ponytail: one process-wide queue is enough for local dev; Redis handles production concurrency.
	let recorded = false
	const write = (localWrites.get(config.localFile) || Promise.resolve()).catch(() => {}).then(async () => {
		const state = await readLocal(config.localFile)
		const now = Date.now()
		for (const [key, timestamp] of Object.entries(state.seen)) if (timestamp <= now - dedupeSeconds * 1000) delete state.seen[key]
		recorded = applyLocalClick(state, product, categories, visitorId, now)
		await writeLocal(state, config.localFile)
	})
	localWrites.set(config.localFile, write)
	try { await write }
	finally { if (localWrites.get(config.localFile) === write) localWrites.delete(config.localFile) }
	return recorded
}

export async function getPopularProducts(category: string, limit: number, options: PopularityOptions = {}) {
	const config = storage(options)
	if (config.redisUrl) {
		const rows = (await redis(['ZREVRANGE', scoreKey(category), 0, limit - 1, 'WITHSCORES'], config, options)) as string[]
		if (!Array.isArray(rows)) throw new Error('Popularity storage returned invalid rankings')
		const ids = rows.filter((_, index) => index % 2 === 0)
		if (!ids.length) return []
		const products = (await redis(['HMGET', 'rj:popularity:products', ...ids], config, options)) as Array<string | null>
		if (!Array.isArray(products)) throw new Error('Popularity storage returned invalid products')
		return ids.flatMap((id, index) => products[index] ? [{ ...JSON.parse(products[index] as string), clicks: Number(rows[index * 2 + 1]) }] : [])
	}
	await localWrites.get(config.localFile)
	return localTop(await readLocal(config.localFile), category, limit)
}
