import { CheckoutService } from '@misiki/litekart-connector'
import { describe, expect, it, vi } from 'vitest'

const okFetch = () =>
	vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
		new Response(JSON.stringify({ order_no: 'order-1', url: 'https://payments.example.test' }), {
			status: 200,
			headers: { 'content-type': 'application/json' }
		})
	)

describe('checkout payment API contracts', () => {
	it('starts the configured Stripe and PayPal gateways with the current cart', async () => {
		const fetch = okFetch()
		const checkout = new CheckoutService(fetch as any)

		await checkout.checkoutStripe({ cartId: 'cart-1', origin: 'https://shop.test' })
		await checkout.checkoutPaypal({
			cartId: 'cart-1',
			origin: 'https://shop.test',
			return_url: 'https://shop.test/checkout/success'
		})

		expect(fetch.mock.calls.map(([url]) => url)).toEqual(['/api/checkout/stripe', '/api/checkout/paypal'])
		expect(JSON.parse(String(fetch.mock.calls[0][1]?.body))).toEqual({ cartId: 'cart-1', origin: 'https://shop.test' })
		expect(JSON.parse(String(fetch.mock.calls[1][1]?.body))).toEqual({
			cartId: 'cart-1',
			origin: 'https://shop.test',
			return_url: 'https://shop.test/checkout/success'
		})
	})

	it('captures Stripe only with the provider callback identifiers', async () => {
		const fetch = okFetch()
		const checkout = new CheckoutService(fetch as any)

		await checkout.checkoutStripeCapture({
			order_no: 'order-1',
			pg: 'stripe',
			payment_session_id: 'session-1',
			storeId: 'store-1'
		})

		expect(fetch.mock.calls[0][0]).toBe('/api/checkout/stripe-capture')
		expect(JSON.parse(String(fetch.mock.calls[0][1]?.body))).toEqual({
			order_no: 'order-1',
			pg: 'stripe',
			payment_session_id: 'session-1',
			storeId: 'store-1'
		})
	})

	it('keeps cash-on-delivery on its dedicated order endpoint', async () => {
		const fetch = okFetch()
		const checkout = new CheckoutService(fetch as any)

		await checkout.checkoutCOD({ cartId: 'cart-1', origin: 'https://shop.test' })

		expect(fetch.mock.calls[0][0]).toBe('/api/checkout/cod')
		expect(JSON.parse(String(fetch.mock.calls[0][1]?.body))).toEqual({ cartId: 'cart-1', origin: 'https://shop.test' })
	})
})
