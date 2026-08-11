import { wwwProductsSlugLoad } from '$lib/core/load-functions/index.js'
import type { PageLoad } from './$types'

const productCache = new Map<string, { data: Awaited<ReturnType<typeof wwwProductsSlugLoad>>; expiresAt: number }>()
const cacheTtlMs = 30_000

export const load: PageLoad = async (event) => {
	const cached = productCache.get(event.params.slug)
	if (cached && cached.expiresAt > Date.now()) return cached.data

	const data = await wwwProductsSlugLoad(event)
	productCache.set(event.params.slug, { data, expiresAt: Date.now() + cacheTtlMs })
	return data
}
