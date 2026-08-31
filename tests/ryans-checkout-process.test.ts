import { describe, expect, it } from 'vitest'
import {
	checkoutFailedPath,
	hasVerifiedCheckoutOrders,
	isValidCheckoutCallback
} from '../src/lib/theme/ryans-jewels/checkout-process.js'

const callback = (query = '') => new URL(`https://ryansjewelers.com/checkout/process?${query}`)

describe('checkout payment callback validation', () => {
	it('rejects missing, incomplete, and unknown payment callbacks', () => {
		expect(isValidCheckoutCallback(callback())).toBe(false)
		expect(isValidCheckoutCallback(callback('pg=unknown&cart_id=c1&order_no=o1'))).toBe(false)
		expect(isValidCheckoutCallback(callback('pg=cod&cart_id=c1'))).toBe(false)
		expect(
			isValidCheckoutCallback(callback('pg=stripe&cart_id=c1&order_no=o1&store_id=s1'))
		).toBe(false)
	})

	it('accepts only complete callbacks from supported gateways', () => {
		for (const gateway of ['cod', 'razorpay', 'cashfree']) {
			expect(isValidCheckoutCallback(callback(`pg=${gateway}&cart_id=c1&order_no=o1`))).toBe(true)
		}
		expect(
			isValidCheckoutCallback(
				callback('pg=stripe&cart_id=c1&order_no=o1&payment_session_id=p1&store_id=s1')
			)
		).toBe(true)
	})

	it('builds a clean failure URL without null query values', () => {
		expect(checkoutFailedPath(callback())).toBe('/checkout/failed')
		expect(checkoutFailedPath(callback('cart_id=c1&order_no=o1'))).toBe(
			'/checkout/failed?cart_id=c1&order_no=o1'
		)
	})

	it('shows success only for paid online orders or placed COD orders', () => {
		expect(hasVerifiedCheckoutOrders({ orders: { data: [{ orderNo: 'o1', paymentMethod: 'stripe', paymentStatus: 'paid' }] } })).toBe(true)
		expect(hasVerifiedCheckoutOrders({ orders: { data: [{ orderNo: 'o2', paymentMethod: 'COD', status: 'placed' }] } })).toBe(true)
		expect(hasVerifiedCheckoutOrders({ orders: { data: [{ orderNo: 'o3', paymentMethod: 'paypal', paymentStatus: 'pending' }] } })).toBe(false)
		expect(hasVerifiedCheckoutOrders({ orders: { data: [{ orderNo: 'o4', paymentMethod: 'COD', status: 'pending' }] } })).toBe(false)
		expect(hasVerifiedCheckoutOrders({ orders: { data: [] } })).toBe(false)
		expect(hasVerifiedCheckoutOrders(undefined)).toBe(false)
	})
})
