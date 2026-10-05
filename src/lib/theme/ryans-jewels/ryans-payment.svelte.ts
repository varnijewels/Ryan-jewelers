import { untrack } from 'svelte'
import { PaymentModule } from '$lib/core/composables/index.js'
import { cartService, checkoutService } from '$lib/core/services/index.js'
import { ShippingCheckout, shippingContextKey, type ShippingStatus } from './shipping-checkout.js'

export class RyansPaymentModule extends PaymentModule {
	shippingStatus = $state<ShippingStatus>({ key: '', data: [], loading: false, saving: false, error: '' })
	private shipping = new ShippingCheckout({
		getCart: () => this.cartState.cart,
		fetchRates: (cartId) => checkoutService.getShippingRates({ cartId }),
		saveRate: async (cartId, shippingRateId) => {
			const previousKey = shippingContextKey(this.cartState.cart)
			const previousAddress = this.cartState.cart?.shippingAddress
			const previousAddressId = this.cartState.cart?.shippingAddressId
			const cart = await cartService.updateShippingRate({ cartId, shippingRateId })
			if (cart?.id !== cartId || cart?.shippingRateId !== shippingRateId) throw new Error('Shipping selection was not confirmed. Please try again.')
			// Ignore a response for a cart/address the buyer has already left.
			if (shippingContextKey(this.cartState.cart) !== previousKey) return
			this.cartState.cart = {
				...cart,
				shippingAddressId: cart.shippingAddressId || previousAddressId,
				shippingAddress: cart.shippingAddress || previousAddress
			}
		},
		changed: (status) => {
			this.shippingStatus = status
			this.shippingRates = { data: status.data, ...(status.error ? { error: { message: status.error } } : {}) }
		}
	})

	constructor() {
		super()
		$effect(() => {
			shippingContextKey(this.cartState.cart)
			// Observe address/items/coupon, not the controller's own state.
			untrack(() => { void this.shipping.refresh() })
		})
	}

	getShippingRates = async (_cartId: string) => { await this.shipping.refresh() }
	handleShippingRateChange = async (rate: any) => { await this.shipping.select(rate?.id) }
	retryShipping = async () => { await this.shipping.refresh(true) }
}
