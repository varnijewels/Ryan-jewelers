import { wwwLoad, wwwProductsLoad } from '$lib/core/load-functions/index.js'

export const load = async (event: any) => {
	const [home, catalog] = await Promise.all([
		wwwLoad(event),
		wwwProductsLoad({ ...event, url: new URL('/products', event.url) })
	])

	return { ...home, storefrontProducts: catalog.products?.data || [] }
}
