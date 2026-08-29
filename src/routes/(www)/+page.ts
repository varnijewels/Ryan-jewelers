import { wwwLoad, wwwProductsLoad } from '$lib/core/load-functions/index.js'
import { realCatalogUrl, withoutDemoProducts } from '$lib/theme/ryans-jewels/product-filters.js'

export const load = async (event: any) => {
	const parent = await event.parent()
	if (parent?.theme?.name === 'ryans-jewels') {
		try {
			const response = await event.fetch('/api/products?page=1&sort=-createdAt', {
				headers: { 'x-litekart-store': parent.store?.id || '' }
			})
			const catalog = response.ok ? await response.json() : {}
			const products = withoutDemoProducts(catalog.data || [])
			return {
				storefrontProducts: products.map((product: any) => ({
					...product,
					attributes: (product.attributes || []).map(({ name, value }: any) => ({ name, value }))
				}))
			}
		} catch {
			return { storefrontProducts: [] }
		}
	}

	const [home, catalog] = await Promise.all([
		wwwLoad(event),
		wwwProductsLoad({ ...event, url: realCatalogUrl(new URL('/products?sort=createdAt%3Adesc', event.url)) })
	])

	return { ...home, storefrontProducts: catalog.products?.data || [] }
}
