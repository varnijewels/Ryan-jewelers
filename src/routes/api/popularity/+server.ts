import { json } from '@sveltejs/kit'
import { dev } from '$app/environment'
import { env } from '$env/dynamic/private'
import { getPopularProducts, popularityValuePattern } from '$lib/server/product-popularity.js'

export async function GET({ url }) {
	const category = url.searchParams.get('category')?.trim()
	const requestedLimit = Number(url.searchParams.get('limit'))
	const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(Math.max(Math.floor(requestedLimit), 1), 20) : 2
	if (!category || category.length > 120 || !popularityValuePattern.test(category)) return json({ message: 'Valid category is required' }, { status: 400 })
	try { return json({ products: await getPopularProducts(category, limit, { env, production: !dev }) }, { headers: { 'cache-control': 'no-store' } }) }
	catch { console.error('Unable to read product popularity; check persistent storage configuration and connectivity'); return json({ message: 'Popularity service is unavailable' }, { status: 503, headers: { 'cache-control': 'no-store', 'retry-after': '30' } }) }
}
