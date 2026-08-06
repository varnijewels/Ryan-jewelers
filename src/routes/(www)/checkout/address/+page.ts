import { wwwProductsLoad } from '$lib/core/load-functions/index.js'

export const load = async (event: any) => {
	const catalog = await wwwProductsLoad({ ...event, url: new URL('/products', event.url) })
	return { checkoutProducts: catalog.products?.data || [] }
}
