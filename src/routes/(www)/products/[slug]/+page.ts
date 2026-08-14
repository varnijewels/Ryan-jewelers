import { wwwProductsSlugLoad } from '$lib/core/load-functions/index.js'
import { withoutDemoProducts } from '$lib/theme/ryans-jewels/product-filters.js'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

const productCache = new Map<string, { data: Awaited<ReturnType<typeof wwwProductsSlugLoad>>; expiresAt: number }>()
const cacheTtlMs = 30_000

export const load: PageLoad = async (event: any) => {
	const cached = productCache.get(event.params.slug)
	if (cached && cached.expiresAt > Date.now()) return cached.data

	const data = await wwwProductsSlugLoad(event)
	if (!withoutDemoProducts([data.product]).length) error(404, 'Product not found')
	productCache.set(event.params.slug, { data, expiresAt: Date.now() + cacheTtlMs })
	return data
}
