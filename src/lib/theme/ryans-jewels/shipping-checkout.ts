export type ShippingRate = {
	id: string
	name: string
	description?: string
	base_rate: number
	estimated_min_days?: number
	estimated_max_days?: number
}

export type ShippingStatus = { key: string; data: ShippingRate[]; loading: boolean; saving: boolean; error: string }

function amount(value: unknown): number | null {
	if ((typeof value !== 'number' && typeof value !== 'string') || (typeof value === 'string' && !value.trim())) return null
	const number = Number(value)
	return Number.isFinite(number) && number >= 0 ? number : null
}

export function normalizeShippingRates(response: any): ShippingRate[] {
	if (response?.error) throw new Error(response.error.message || 'Delivery is not available for this address.')
	if (!Array.isArray(response?.data)) throw new Error('Shipping rates could not be verified. Please try again.')
	const rates = response.data.flatMap((rate: any) => {
		const charge = amount(rate?.base_rate ?? rate?.baseRate)
		return typeof rate?.id === 'string' && rate.id && charge !== null ? [{
			id: rate.id,
			name: rate.name || 'Delivery',
			description: rate.description,
			base_rate: charge,
			estimated_min_days: rate.estimated_min_days ?? rate.estimatedMinDays,
			estimated_max_days: rate.estimated_max_days ?? rate.estimatedMaxDays
		}] : []
	})
	if (response.data.length && !rates.length) throw new Error('Shipping charges could not be verified. Please try again.')
	return rates
}

// Excludes totals/rate selection so saving a rate does not cause a request loop.
// Includes address, items and coupon because they can change delivery eligibility/pricing.
export function shippingContextKey(cart: any): string {
	if (!cart?.id || !cart?.shippingAddressId || !cart?.shippingAddress || !cart?.lineItems?.length) return ''
	const address = cart.shippingAddress
	return JSON.stringify([
		cart.id, cart.shippingAddressId, address.countryCode, address.state, address.city, address.zip, address.address_1, address.address_2,
		cart.couponCode, cart.subtotal,
		cart.lineItems.map((item: any) => [item.id, item.variantId, item.qty, item.price, item.isSelectedForCheckout])
	])
}

export function cartShippingCharge(cart: any): number | null {
	if (!cart?.shippingRateId) return null
	return amount(cart.shippingCharges ?? cart.shippingCost ?? cart.shippingRate?.base_rate ?? cart.shippingRate?.baseRate)
}

export function cartTaxAmount(cart: any): number {
	return amount(cart?.taxAmount ?? cart?.taxes ?? cart?.tax ?? 0) ?? 0
}

export function isShippingReady(cart: any, status: ShippingStatus): boolean {
	return Boolean(status.key && status.key === shippingContextKey(cart) && !status.loading && !status.saving && !status.error &&
		status.data.some((rate) => rate.id === cart?.shippingRateId) && cartShippingCharge(cart) !== null && amount(cart?.total) !== null)
}

type Dependencies = {
	getCart: () => any
	fetchRates: (cartId: string) => Promise<any>
	saveRate: (cartId: string, rateId: string) => Promise<void>
	changed: (status: ShippingStatus) => void
}

export class ShippingCheckout {
	status: ShippingStatus = { key: '', data: [], loading: false, saving: false, error: '' }
	private sequence = 0
	private pending: Promise<void> | undefined

	constructor(private dependencies: Dependencies) {}

	private update(values: Partial<ShippingStatus>) {
		this.status = { ...this.status, ...values }
		this.dependencies.changed(this.status)
	}

	refresh(force = false): Promise<void> {
		const cart = this.dependencies.getCart()
		const key = shippingContextKey(cart)
		if (!force && key && key === this.status.key) return this.pending || Promise.resolve()
		const sequence = ++this.sequence
		this.update({ key, data: [], error: '', loading: Boolean(key) })
		if (!key) return Promise.resolve()
		const current = () => sequence === this.sequence && key === shippingContextKey(this.dependencies.getCart())
		const run = async () => {
			try {
				const data = normalizeShippingRates(await this.dependencies.fetchRates(cart.id))
				if (!current()) return
				this.update({ data, loading: false, error: data.length ? '' : 'No delivery methods are available for this address. Update your address or contact support.' })
				const selected = this.dependencies.getCart()?.shippingRateId
				const selectedRate = data.find((rate) => rate.id === selected)
				// Re-confirm on every changed checkout context so a weight/quantity/coupon
				// change cannot reuse a stale shipping charge just because the rate ID stayed the same.
				if (selectedRate) await this.select(selectedRate.id)
				else if (data.length === 1) await this.select(data[0].id)
			} catch (cause: any) {
				if (current()) this.update({ data: [], error: cause?.message || 'Unable to load shipping methods. Please try again.' })
			} finally {
				if (sequence === this.sequence) { this.update({ loading: false }); this.pending = undefined }
			}
		}
		this.pending = run()
		return this.pending
	}

	async select(rateId: string): Promise<void> {
		if (this.status.loading || this.status.saving || !this.status.data.some((rate) => rate.id === rateId)) return
		const key = this.status.key
		const cart = this.dependencies.getCart()
		if (!key || key !== shippingContextKey(cart)) return
		this.update({ saving: true, error: '' })
		try {
			await this.dependencies.saveRate(cart.id, rateId)
			if (key !== shippingContextKey(this.dependencies.getCart())) return
			if (this.dependencies.getCart()?.shippingRateId !== rateId || cartShippingCharge(this.dependencies.getCart()) === null) throw new Error('Shipping selection was not confirmed. Please try again.')
		} catch (cause: any) {
			if (key === this.status.key) this.update({ error: cause?.message || 'Unable to save shipping method. Please try again.' })
		} finally {
			this.update({ saving: false })
		}
	}
}
