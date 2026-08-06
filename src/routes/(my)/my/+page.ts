import { wwwProductsLoad } from '$lib/core/load-functions/index.js'

export const load = async (event: any) => {
	try {
		const catalog = await wwwProductsLoad({ ...event, url: new URL('/products', event.url) })
		return { dashboardProducts: catalog.products?.data || [] }
	} catch {
		return { dashboardProducts: [] }
	}
}
