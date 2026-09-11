import { dev } from '$app/environment'
import { redirect } from '@sveltejs/kit'
import { wwwCheckoutSuccessLoadServer } from '$lib/core/load-functions/index.js'
import { checkoutFailedPath, hasVerifiedCheckoutOrders } from '$lib/theme/ryans-jewels/checkout-process.js'
import type { PageServerLoad } from './$types.js'

export const load: PageServerLoad = async (event) => {
	if (dev && event.url.searchParams.get('preview') === '1') {
		return {
			preview: true,
			orders: {
				data: [{
					orderNo: 'RJ-2026-0911',
					total: 959.99,
					paymentMethod: 'Card',
					paymentStatus: 'PAID',
					status: 'PLACED',
					createdAt: '2026-09-11T10:30:00.000Z',
					userEmail: 'sujal@example.com',
					shippingRate: { estimatedMaxDays: 7 },
					shippingAddress: {
						firstName: 'Sujal', lastName: 'Patel', address_1: '123 Main Street',
						city: 'New York', state: 'NY', zip: '10001', phone: '+1 555 123 4567', countryCode: 'US'
					},
					lineItems: [{
						title: '1 to 5 Carat Round Diamond Ring', slug: '1-to-5-carat-round-diamond-ring',
						thumbnail: '/ryans-jewels/mega-menu/ring-main.webp', price: 959.99,
						qty: 1, subtotal: 959.99, variantTitle: '14K White Gold / 1 CT'
					}]
				}]
			}
		}
	}

	const data = await wwwCheckoutSuccessLoadServer(event)
	if (!hasVerifiedCheckoutOrders(data)) redirect(307, checkoutFailedPath(event.url))
	return data
}
