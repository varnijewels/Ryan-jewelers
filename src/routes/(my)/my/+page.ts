import { wwwProductsLoad } from '$lib/core/load-functions/index.js'
import { realCatalogUrl } from '$lib/theme/ryans-jewels/product-filters.js'

export const load = async (event: any) => {
	try {
		const catalog = await wwwProductsLoad({ ...event, url: realCatalogUrl(new URL('/products', event.url)) })
		return { dashboardProducts: catalog.products?.data || [] }
	} catch {
		return { dashboardProducts: [] }
	}
}
