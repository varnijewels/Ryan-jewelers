import { layoutServer } from '$lib/core/load-functions/index.js'
import { CategoryService, ProductService, UserService } from '$lib/core/services/index.js'
import { withoutDemoProducts } from '$lib/theme/ryans-jewels/product-filters.js'
import { canonicalProductPath, ryansSeoText } from '$lib/theme/ryans-jewels/seo.js'
import { resolveStorefrontTheme } from '$lib/theme/index.js'

export async function load(event: any) {
	const data = await layoutServer(event)
	let user = null
	const theme = resolveStorefrontTheme(data?.store)
	const isPublicHomepage = theme.name === 'ryans-jewels' && event.url.pathname === '/'
	const store = isPublicHomepage
		? { ...data.store, countries: [], shippingZones: [], paymentMethods: [], workingHours: [] }
		: data.store
	let megaMenu: any[] | undefined
	let collectionProducts: any[] | undefined

	const sid = event.cookies.get('connect.sid')
	if (!isPublicHomepage && sid && sid !== 'dev-session') {
		try {
			user = await new UserService(event.fetch).getMe()
		} catch {
			// An expired session is the same as being signed out.
		}
	}

	if (theme.name === 'ryans-jewels') {
		const [megaMenuResult, productResult] = await Promise.allSettled([
			new CategoryService(event.fetch).getMegamenu(),
			new ProductService(event.fetch).list({ page: 1, search: '', sort: '-createdAt' })
		])
		// Connector types this endpoint as paginated, but the API returns the menu array directly.
		if (megaMenuResult.status === 'fulfilled') megaMenu = megaMenuResult.value as unknown as any[]
		if (productResult.status === 'fulfilled') {
			collectionProducts = []
			const seenImages = new Set<string>()
			for (const product of withoutDemoProducts((productResult.value?.data || []) as any[])) {
				if (!product.slug || !product.thumbnail || seenImages.has(product.thumbnail)) continue
				seenImages.add(product.thumbnail)
				collectionProducts.push({
					name: ryansSeoText(product.title || product.name, 'New Arrival'),
					href: canonicalProductPath(product),
					thumbnail: product.thumbnail,
					description: ryansSeoText(product.description || product.metaDescription, 'Discover this new arrival from Ryan Jewelers.')
				})
				if (collectionProducts.length === 2) break
			}
		}
	}

	return {
		...data,
		store,
		user,
		isPublicHomepage,
		theme,
		navigation: { megaMenu, collectionProducts }
	}
}
