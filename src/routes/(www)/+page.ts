import { wwwLoad, wwwProductsLoad } from '$lib/core/load-functions/index.js'
import { realCatalogUrl } from '$lib/theme/ryans-jewels/product-filters.js'

export const load = async (event: any) => {
	const parent = await event.parent()
	if (parent?.theme?.name === 'ryans-jewels') {
		return { storefrontProducts: [] }
	}

	const [home, catalog] = await Promise.all([
		wwwLoad(event),
		wwwProductsLoad({ ...event, url: realCatalogUrl(new URL('/products?sort=createdAt%3Adesc', event.url)) })
	])

	return { ...home, storefrontProducts: catalog.products?.data || [] }
}
