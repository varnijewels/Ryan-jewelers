import { redirect } from '@sveltejs/kit'
import { wwwCheckoutProcessLoadServer } from '$lib/core/load-functions/index.js'
import {
	checkoutFailedPath,
	isValidCheckoutCallback
} from '$lib/theme/ryans-jewels/checkout-process.js'
import type { PageServerLoad } from './$types.js'

const processCheckout = wwwCheckoutProcessLoadServer(redirect)

export const load: PageServerLoad = (event) => {
	if (!isValidCheckoutCallback(event.url)) redirect(307, checkoutFailedPath(event.url))
	return processCheckout(event)
}
