import { redirect } from '@sveltejs/kit'
import { UserService } from '$lib/core/services/index.js'
import { isCustomerSignedIn } from '$lib/theme/ryans-jewels/auth-gate.logic.js'
import type { LayoutServerLoad } from './$types.js'

const protectedCheckoutPaths = new Set(['/checkout/address', '/checkout/payment'])

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
	if (!protectedCheckoutPaths.has(url.pathname)) return {}

	if (cookies.get('connect.sid')) {
		try {
			const user = await new UserService(fetch).getMe()
			if (isCustomerSignedIn(user)) return {}
		} catch {
			// Expired sessions use the same login flow as signed-out visitors.
		}
	}

	const returnTo = `${url.pathname}${url.search}`
	const params = new URLSearchParams({ show_auth: 'true', login: 'true', redirect: returnTo })
	redirect(307, `/checkout/cart?${params}`)
}
