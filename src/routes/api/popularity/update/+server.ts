import { randomUUID } from 'node:crypto'
import { json } from '@sveltejs/kit'
import { recordProductClick, type PopularProduct } from '$lib/server/product-popularity.js'

const valuePattern = /^(?!__proto__$|prototype$|constructor$)[\w-]+$/

export async function POST({ request, cookies, url }) {
	let body: { product?: PopularProduct; categories?: unknown }
	try { body = await request.json() }
	catch { return json({ message: 'Invalid JSON body' }, { status: 400 }) }
	const product = body.product
	if (typeof product?.id !== 'string' || typeof product.slug !== 'string' || typeof product.title !== 'string' || product.id.length > 120 || product.slug.length > 300 || product.title.length > 300 || !valuePattern.test(product.id) || !valuePattern.test(product.slug)) return json({ message: 'Valid product id, slug and title are required' }, { status: 400 })
	const categories = Array.isArray(body.categories) ? [...new Set(body.categories.filter((value): value is string => typeof value === 'string' && valuePattern.test(value)).slice(0, 20))] : []
	const visitorId = cookies.get('rj_popularity_sid') || randomUUID()
	cookies.set('rj_popularity_sid', visitorId, { path: '/', httpOnly: true, sameSite: 'lax', secure: url.protocol === 'https:', maxAge: 60 * 60 * 24 * 365 })
	try {
		const recorded = await recordProductClick({ id: product.id, title: product.title.slice(0, 300), slug: product.slug, thumbnail: typeof product.thumbnail === 'string' ? product.thumbnail.slice(0, 2000) : undefined }, categories, visitorId)
		return json({ recorded })
	} catch (error) { console.error('Unable to update product popularity:', error); return json({ message: 'Popularity service is unavailable' }, { status: 503 }) }
}
