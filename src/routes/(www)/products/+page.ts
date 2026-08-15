import { wwwProductsLoad } from '$lib/core/load-functions/index.js'
import { applyClientFilters, clientFilterKeys, clientSorts, realCatalogUrl } from '$lib/theme/ryans-jewels/product-filters.js'

export const load = async (event: any) => {
	event.depends('app:products')
	const requestUrl = realCatalogUrl(event.url)
	const hasClientFilters = clientFilterKeys.some((key) => requestUrl.searchParams.has(key))
	const hasClientSort = clientSorts.has(requestUrl.searchParams.get('uiSort') || '')

	clientFilterKeys.forEach((key) => requestUrl.searchParams.delete(key))
	requestUrl.searchParams.delete('uiSort')
	if (hasClientFilters || hasClientSort) requestUrl.searchParams.set('page', '1')

	const result = await wwwProductsLoad({ ...event, url: requestUrl })
	if (!hasClientFilters && !hasClientSort) return result

	let products = [...(result.products.data || [])]
	if (result.products.totalPages > 1) {
		const pages = await Promise.all(
			Array.from({ length: result.products.totalPages - 1 }, async (_, index) => {
				const pageUrl = new URL(requestUrl)
				pageUrl.searchParams.set('page', String(index + 2))
				return wwwProductsLoad({ ...event, url: pageUrl })
			})
		)
		products.push(...pages.flatMap((page) => page.products.data || []))
	}

	products = applyClientFilters(products, event.url)
	return {
		...result,
		products: { ...result.products, data: products, count: products.length, totalPages: products.length ? 1 : 0 }
	}
}
