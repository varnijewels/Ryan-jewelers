import { redirect } from '@sveltejs/kit'
import { wwwCheckoutSuccessLoadServer } from '$lib/core/load-functions/index.js'
import { checkoutFailedPath, hasVerifiedCheckoutOrders } from '$lib/theme/ryans-jewels/checkout-process.js'
import type { PageServerLoad } from './$types.js'

export const load: PageServerLoad = async (event) => {
	const data = await wwwCheckoutSuccessLoadServer(event)
	if (!hasVerifiedCheckoutOrders(data)) redirect(307, checkoutFailedPath(event.url))
	return data
}
