import { describe, expect, it, vi } from 'vitest'
import { cartShippingCharge, cartTaxAmount, isShippingReady, normalizeShippingRates, ShippingCheckout, shippingContextKey } from '../src/lib/theme/ryans-jewels/shipping-checkout.js'

const cart = () => ({ id: 'cart-1', shippingAddressId: 'addr-1', shippingAddress: { countryCode: 'US', state: 'NY', city: 'New York', zip: '10001', address_1: 'Test address' }, subtotal: 100, total: 110, lineItems: [{ id: 'line-1', variantId: 'v1', qty: 1, price: 100 }], shippingRateId: 'r1', shippingCharges: 10 })
const rates = { data: [{ id: 'r1', name: 'Standard', baseRate: 10, estimatedMinDays: 3, estimatedMaxDays: 5 }] }
const deferred = () => { let resolve!: (value: any) => void; const promise = new Promise<any>((r) => { resolve = r }); return { promise, resolve } }

function setup(fetchRates = vi.fn().mockResolvedValue(rates), saveRate?: any) {
	const current: { cart: any } = { cart: cart() }
	const changed = vi.fn()
	const save = saveRate || vi.fn(async (_cartId, rateId) => { current.cart = { ...current.cart, shippingRateId: rateId, shippingCharges: rateId === 'r2' ? 20 : 10 } })
	const checkout = new ShippingCheckout({ getCart: () => current.cart, fetchRates, saveRate: save, changed })
	return { current, changed, checkout, fetchRates, save }
}

describe('Ryan shipping checkout', () => {
	it('reads the backend tax field and preserves an explicit zero tax', () => {
		expect(cartTaxAmount({ tax: 8 })).toBe(8)
		expect(cartTaxAmount({ taxes: 9 })).toBe(9)
		expect(cartTaxAmount({ taxAmount: 0, tax: 8 })).toBe(0)
	})
	it('normalizes camelCase and snake_case prices without inventing FREE shipping', () => {
		expect(normalizeShippingRates(rates)[0]).toMatchObject({ base_rate: 10, estimated_min_days: 3, estimated_max_days: 5 })
		expect(normalizeShippingRates({ data: [{ id: 'free', base_rate: '0' }] })[0].base_rate).toBe(0)
		for (const price of [undefined, '', ' ', -1, 'invalid', true, [], {}]) expect(() => normalizeShippingRates({ data: [{ id: 'invalid', baseRate: price }] })).toThrow('could not be verified')
	})

	it('rejects missing/error responses', () => {
		expect(() => normalizeShippingRates({})).toThrow('could not be verified')
		expect(() => normalizeShippingRates({ error: { message: 'Country not supported' } })).toThrow('Country not supported')
	})

	it('reads authoritative cart shipping charges including zero', () => {
		expect(cartShippingCharge(cart())).toBe(10)
		expect(cartShippingCharge({ shippingRateId: 'r1', shippingCharges: 0 })).toBe(0)
		expect(cartShippingCharge({ shippingRateId: 'r1' })).toBeNull()
		expect(cartShippingCharge({ shippingCharges: 10 })).toBeNull()
	})

	it('deduplicates requests and preserves a valid selected rate', async () => {
		const request = deferred()
		const s = setup(vi.fn().mockReturnValue(request.promise))
		const first = s.checkout.refresh()
		expect(isShippingReady(s.current.cart, s.checkout.status)).toBe(false)
		const second = s.checkout.refresh()
		request.resolve(rates)
		await Promise.all([first, second])
		expect(s.fetchRates).toHaveBeenCalledTimes(1)
		expect(s.save).toHaveBeenCalledOnce()
		expect(isShippingReady(s.current.cart, s.checkout.status)).toBe(true)
	})

	it('automatically selects the sole rate when none or an obsolete rate was selected', async () => {
		for (const selected of [undefined, 'old-rate']) {
			const s = setup()
			s.current.cart.shippingRateId = selected
			await s.checkout.refresh()
			expect(s.save).toHaveBeenCalledWith('cart-1', 'r1')
			expect(isShippingReady(s.current.cart, s.checkout.status)).toBe(true)
		}
	})

	it('blocks payment for unavailable destinations and exposes a retry after an outage', async () => {
		const s = setup(vi.fn().mockRejectedValueOnce(new Error('Temporary shipping outage')).mockResolvedValueOnce({ data: [] }).mockResolvedValueOnce(rates))
		await s.checkout.refresh()
		expect(s.checkout.status.error).toContain('outage')
		expect(isShippingReady(s.current.cart, s.checkout.status)).toBe(false)
		await s.checkout.refresh(true)
		expect(s.checkout.status.error).toContain('No delivery methods')
		await s.checkout.refresh(true)
		expect(isShippingReady(s.current.cart, s.checkout.status)).toBe(true)
	})

	it('ignores late rate responses after the destination changes', async () => {
		const old = deferred(), fresh = deferred()
		const s = setup(vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(fresh.promise))
		const first = s.checkout.refresh()
		s.current.cart.shippingAddress.zip = '90210'
		const second = s.checkout.refresh()
		fresh.resolve({ data: [{ id: 'r2', base_rate: 20 }] })
		await second
		old.resolve(rates)
		await first
		expect(s.checkout.status.data.map((rate) => rate.id)).toEqual(['r2'])
		expect(s.current.cart.shippingRateId).toBe('r2')
	})

	it('invalidates rates when quantity, coupon, or address changes, but not on rate/total changes', async () => {
		const s = setup()
		await s.checkout.refresh()
		const original = shippingContextKey(s.current.cart)
		s.current.cart.total = 120
		expect(shippingContextKey(s.current.cart)).toBe(original)
		s.current.cart.lineItems[0].qty = 2
		expect(isShippingReady(s.current.cart, s.checkout.status)).toBe(false)
		await s.checkout.refresh()
		s.current.cart.couponCode = 'SALE'
		expect(isShippingReady(s.current.cart, s.checkout.status)).toBe(false)
		await s.checkout.refresh()
		expect(s.fetchRates).toHaveBeenCalledTimes(3)
	})

	it('blocks payment and duplicate selections until the updated rate/total is confirmed', async () => {
		const request = deferred()
		const s = setup(vi.fn().mockResolvedValue({ data: [...rates.data, { id: 'r2', baseRate: 20 }] }), vi.fn().mockReturnValue(request.promise))
		s.current.cart.shippingRateId = null
		await s.checkout.refresh()
		s.current.cart.shippingRateId = 'r1'
		const selection = s.checkout.select('r2')
		expect(isShippingReady(s.current.cart, s.checkout.status)).toBe(false)
		await s.checkout.select('r1')
		expect(s.save).toHaveBeenCalledTimes(1)
		request.resolve(undefined)
		await selection
		expect(s.checkout.status.error).toContain('not confirmed')
		expect(isShippingReady(s.current.cart, s.checkout.status)).toBe(false)
	})

	it('does not allow payment after a shipping save failure', async () => {
		const s = setup(vi.fn().mockResolvedValue({ data: [...rates.data, { id: 'r2', baseRate: 20 }] }), vi.fn().mockRejectedValue(new Error('Unable to save')))
		await s.checkout.refresh()
		await s.checkout.select('r2')
		expect(s.checkout.status.error).toBe('Unable to save')
		expect(isShippingReady(s.current.cart, s.checkout.status)).toBe(false)
	})

	it('never requests rates or permits payment for an empty cart/missing address', async () => {
		const s = setup()
		s.current.cart.shippingAddressId = null
		await s.checkout.refresh()
		expect(s.fetchRates).not.toHaveBeenCalled()
		expect(isShippingReady(s.current.cart, s.checkout.status)).toBe(false)
	})
})
