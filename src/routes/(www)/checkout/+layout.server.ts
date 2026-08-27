import { redirect } from '@sveltejs/kit'
import { UserService } from '$lib/core/services/index.js'
import { canAccessCheckout } from '$lib/theme/ryans-jewels/auth-gate.logic.js'
import type { LayoutServerLoad } from './$types.js'

const protectedCheckoutPaths = new Set(['/checkout/address', '/checkout/payment'])

export const load: LayoutServerLoad = async ({ cookies, fetch, parent, url }) => {
	if (!protectedCheckoutPaths.has(url.pathname)) return {}
	const data = await parent()
	const guestCheckoutEnabled = Boolean(data?.store?.plugins?.isGuestCheckout?.active)
	if (canAccessCheckout(null, guestCheckoutEnabled)) return {}

	if (cookies.get('connect.sid')) {
		try {
			const user = await new UserService(fetch).getMe()
			if (canAccessCheckout(user, guestCheckoutEnabled)) return {}
		} catch {
			// Expired sessions use the same login flow as signed-out visitors.
		}
	}

	const returnTo = `${url.pathname}${url.search}`
	const params = new URLSearchParams({ show_auth: 'true', login: 'true', redirect: returnTo })
	redirect(307, `/checkout/cart?${params}`)
}
