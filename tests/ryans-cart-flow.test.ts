import { describe, expect, it, vi } from 'vitest'
import { addSelectionToCart, cartItemHref, checkoutBusy } from '../src/lib/theme/ryans-jewels/cart-flow.js'
import { addressError, blankCheckoutAddress, normalizeCheckoutAddress, saveCheckoutDetails } from '../src/lib/theme/ryans-jewels/checkout-address.js'

describe('Ryan cart drawer flow', () => {
	it('opens only after the selected variation is added and preserves other lines', async () => {
		const state = { cart: { lineItems: [{ productId: 'other', variantId: 'other', qty: 2 }] }, isOpen: false, addOrUpdate: vi.fn() }
		state.addOrUpdate.mockImplementation(async (selection) => state.cart.lineItems.push(selection))
		expect(await addSelectionToCart(state, { productId: 'ring', variantId: 'size-7-white', qty: 1 })).toBe(true)
		expect(state.isOpen).toBe(true)
		expect(state.cart.lineItems[0].qty).toBe(2)
	})
	it('does not show a successful drawer when the shared API swallows an error', async () => {
		const state = { cart: { lineItems: [{ productId: 'ring', variantId: 'v1', qty: 1 }] }, isOpen: false, showCheckout: true, addOrUpdate: vi.fn().mockResolvedValue(undefined) }
		expect(await addSelectionToCart(state, { productId: 'ring', variantId: 'v1', qty: 1 })).toBe(false)
		expect(state.isOpen).toBe(false)
	})
	it('retains the selected variation in cart product links', () => {
		expect(cartItemHref({ slug: 'halo-ring', variantId: 'white-7' })).toBe('/products/halo-ring?variant_id=white-7')
	})
	it('blocks checkout while a line mutation is pending', () => {
		expect(checkoutBusy({ isUpdatingCart: false, updatingItem: { line1: true } })).toBe(true)
		expect(checkoutBusy({ isUpdatingCart: false, updatingItem: { line1: false } })).toBe(false)
	})
})

describe('Guest delivery details', () => {
	const address = { ...blankCheckoutAddress(), firstName: 'Test', lastName: 'Customer', address_1: '123 Test Street', city: 'Salisbury', state: 'MD', zip: '21801' }
	const details = { email: 'guest@example.com', phone: '4105550100', shipping: address, billing: { ...address, address_1: '456 Billing Street' }, sameBilling: true }
	function state() {
		const state: any = { cart: {} }
		state.updateEmail = vi.fn(async (contact) => { Object.assign(state.cart, contact) })
		state.updateShippingAddress = vi.fn(async (data) => { Object.assign(state.cart, data, { shippingAddressId: 'address1' }) })
		return state
	}
	it('accepts a US address without an OTP or landmark', () => {
		expect(addressError(address)).toBe('')
		expect(addressError({ ...address, zip: ' ' })).toBe('ZIP / postal code is required.')
		expect(normalizeCheckoutAddress({ city: ' Salisbury ' }).city).toBe('Salisbury')
	})
	it('saves guest contact and matching billing address before allowing payment', async () => {
		const cart = state()
		await saveCheckoutDetails(cart, details)
		expect(cart.updateEmail).toHaveBeenCalledWith({ email: details.email, phone: details.phone })
		expect(cart.updateShippingAddress).toHaveBeenCalledWith({ shippingAddress: address, billingAddress: address, isBillingAddressSameAsShipping: true })
	})
	it('preserves a separate billing address', async () => {
		const cart = state()
		await saveCheckoutDetails(cart, { ...details, sameBilling: false })
		expect(cart.cart.billingAddress.address_1).toBe('456 Billing Street')
	})
	it('stops before address submission if contact persistence fails', async () => {
		const cart = state()
		cart.updateEmail.mockRejectedValue(new Error('Contact service unavailable'))
		await expect(saveCheckoutDetails(cart, details)).rejects.toThrow('Contact service unavailable')
		expect(cart.updateShippingAddress).not.toHaveBeenCalled()
	})
	it('rejects an unconfirmed address save instead of advancing to payment', async () => {
		const cart = state()
		cart.updateShippingAddress.mockResolvedValue(undefined)
		await expect(saveCheckoutDetails(cart, details)).rejects.toThrow('Your address was not saved')
	})
})
