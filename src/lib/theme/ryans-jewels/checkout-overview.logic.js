/** @typedef {{ hasAddress: boolean, userId?: string, email: string, password: string }} CheckoutGateValues */

/** @param {CheckoutGateValues} values */
export function checkoutGate({ hasAddress, userId, email, password }) {
	if (hasAddress) return 'payment'
	if (userId) return 'address'
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && password ? 'login' : 'credentials'
}

/** @param {{ data?: unknown[], error?: { message?: string } } | null | undefined} result */
export function shippingRatesAvailable(result) {
	return !result?.error?.message && Array.isArray(result?.data) && result.data.length > 0
}

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('checkout-overview.logic.js')) {
	/** @param {Partial<CheckoutGateValues>} values */
	const gate = (values) => checkoutGate({ hasAddress: false, userId: '', email: '', password: '', ...values })
	console.assert(gate({ hasAddress: true }) === 'payment')
	console.assert(gate({ userId: 'user_1' }) === 'address')
	console.assert(gate({ email: 'buyer@example.com', password: 'secret' }) === 'login')
	console.assert(gate({ email: 'bad-email', password: 'secret' }) === 'credentials')
	console.assert(shippingRatesAvailable({ data: [{ id: 'economy' }] }))
	console.assert(!shippingRatesAvailable({ data: [], error: { message: 'Country not deliverable' } }))
	console.log('checkout overview logic: ok')
}
