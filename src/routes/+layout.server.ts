import { layoutServer } from '$lib/core/load-functions/index.js'
import { CategoryService, UserService } from '$lib/core/services/index.js'
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

	const sid = event.cookies.get('connect.sid')
	if (!isPublicHomepage && sid && sid !== 'dev-session') {
		try {
			user = await new UserService(event.fetch).getMe()
		} catch {
			// An expired session is the same as being signed out.
		}
	}

	if (theme.name === 'ryans-jewels') {
		try {
			// Connector types this endpoint as paginated, but the API returns the menu array directly.
			megaMenu = (await new CategoryService(event.fetch).getMegamenu()) as unknown as any[]
		} catch {
			// Keep the legacy menu out of the first render if the admin menu is unavailable.
		}
	}

	return {
		...data,
		store,
		user,
		isPublicHomepage,
		theme,
		navigation: { megaMenu }
	}
}
