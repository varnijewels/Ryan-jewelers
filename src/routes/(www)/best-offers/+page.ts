import { wwwProductsLoad } from '$lib/core/load-functions/index.js'
import { realCatalogUrl } from '$lib/theme/ryans-jewels/product-filters.js'

export const load = async (event: any) => {
	const catalog = await wwwProductsLoad({ ...event, url: realCatalogUrl(new URL('/products?sort=discount', event.url)) })
	return { ...catalog, offerProducts: catalog.products?.data || [] }
}
