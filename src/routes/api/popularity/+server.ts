import { json } from '@sveltejs/kit'
import { getPopularProducts } from '$lib/server/product-popularity.js'

export async function GET({ url }) {
	const category = url.searchParams.get('category')?.trim()
	const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 2, 1), 20)
	if (!category || category.length > 120) return json({ message: 'Valid category is required' }, { status: 400 })
	try { return json({ products: await getPopularProducts(category, limit) }) }
	catch (error) { console.error('Unable to read product popularity:', error); return json({ message: 'Popularity service is unavailable' }, { status: 503 }) }
}
