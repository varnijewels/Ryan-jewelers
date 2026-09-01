import { describe, expect, it } from 'vitest'
import {
	canStartPayment,
	checkoutFailedPath,
	checkoutPurchaseData,
	hasCheckoutAddress,
	hasVerifiedCheckoutOrders,
	isValidCheckoutCallback,
	successfulCartAction
} from '../src/lib/theme/ryans-jewels/checkout-process.js'

const callback = (query = '') => new URL(`https://ryansjewelers.com/checkout/process?${query}`)

describe('checkout payment callback validation', () => {
	it('rejects missing, incomplete, and unknown payment callbacks', () => {
		expect(isValidCheckoutCallback(callback())).toBe(false)
		expect(isValidCheckoutCallback(callback('pg=unknown&cart_id=c1&order_no=o1'))).toBe(false)
		expect(isValidCheckoutCallback(callback('pg=cod&cart_id=c1'))).toBe(false)
		expect(isValidCheckoutCallback(callback('pg=stripe&cart_id=c1&order_no=o1&store_id=s1'))).toBe(false)
	})

	it('accepts only complete callbacks from supported gateways', () => {
		for (const gateway of ['cod', 'razorpay', 'cashfree']) {
			expect(isValidCheckoutCallback(callback(`pg=${gateway}&cart_id=c1&order_no=o1`))).toBe(true)
		}
		expect(isValidCheckoutCallback(callback('pg=stripe&cart_id=c1&order_no=o1&payment_session_id=p1&store_id=s1'))).toBe(true)
	})

	it('builds a clean failure URL without null query values', () => {
		expect(checkoutFailedPath(callback())).toBe('/checkout/failed')
		expect(checkoutFailedPath(callback('cart_id=c1&order_no=o1'))).toBe('/checkout/failed?cart_id=c1&order_no=o1')
	})

	it('shows success only for paid online orders or placed COD orders', () => {
		expect(hasVerifiedCheckoutOrders({ orders: { data: [{ orderNo: 'o1', paymentMethod: 'stripe', paymentStatus: 'paid' }] } })).toBe(true)
		expect(hasVerifiedCheckoutOrders({ orders: { data: [{ orderNo: 'o2', paymentMethod: 'COD', status: 'placed' }] } })).toBe(true)
		expect(hasVerifiedCheckoutOrders({ orders: { data: [{ orderNo: 'o3', paymentMethod: 'paypal', paymentStatus: 'pending' }] } })).toBe(false)
		expect(hasVerifiedCheckoutOrders({ orders: { data: [{ orderNo: 'o4', paymentMethod: 'COD', status: 'pending' }] } })).toBe(false)
		expect(hasVerifiedCheckoutOrders({ orders: { data: [] } })).toBe(false)
		expect(hasVerifiedCheckoutOrders(undefined)).toBe(false)
	})

	it('requires a delivery address before payment and clears only the completed cart', () => {
		expect(hasCheckoutAddress({ shippingAddressId: 'addr_1' })).toBe(true)
		expect(hasCheckoutAddress({ shippingAddress: { city: 'Surat' } })).toBe(true)
		expect(hasCheckoutAddress({})).toBe(false)
		expect(successfulCartAction('previous_cart')).toBe('restore')
		expect(successfulCartAction(null)).toBe('clear')
	})

	it('blocks duplicate payment submissions while a request is running', () => {
		expect(canStartPayment(false, false)).toBe(true)
		expect(canStartPayment(true, false)).toBe(false)
		expect(canStartPayment(false, true)).toBe(false)
	})

	it('builds one purchase conversion from verified split orders', () => {
		expect(
			checkoutPurchaseData(
				[
					{ orderNo: 'order-1', total: 600, taxAmount: 20, shippingCharges: 10, lineItems: [{ sku: 'RING-1', qty: 1 }] },
					{ orderNo: 'order-1', total: 400, taxAmount: 10, shippingCharges: 5, lineItems: [{ sku: 'PENDANT-1', qty: 1 }] }
				],
				{ id: 'user-1' }
			)
		).toMatchObject({
			orderNo: 'order-1',
			amount: { total: 1000, shipping: 15 },
			tax: 30,
			items: [{ sku: 'RING-1', qty: 1 }, { sku: 'PENDANT-1', qty: 1 }],
			user: { id: 'user-1' }
		})
	})
})
