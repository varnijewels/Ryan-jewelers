/** @typedef {{ hasAddress: boolean, userId?: string, email: string, password: string, guestCheckout?: boolean }} CheckoutGateValues */

/** @param {CheckoutGateValues} values */
export function checkoutGate({ hasAddress, userId, email, password, guestCheckout = false }) {
	if (hasAddress) return 'payment'
	if (userId) return 'address'
	const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
	if (guestCheckout && validEmail && !password) return 'address'
	return validEmail && password ? 'login' : 'credentials'
}

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('checkout-overview.logic.js')) {
	/** @param {Partial<CheckoutGateValues>} values */
	const gate = (values) => checkoutGate({ hasAddress: false, userId: '', email: '', password: '', ...values })
	console.assert(gate({ hasAddress: true }) === 'payment')
	console.assert(gate({ userId: 'user_1' }) === 'address')
	console.assert(gate({ email: 'guest@example.com', guestCheckout: true }) === 'address')
	console.assert(gate({ email: 'buyer@example.com', password: 'secret' }) === 'login')
	console.assert(gate({ email: 'bad-email', password: 'secret' }) === 'credentials')
	console.log('checkout overview logic: ok')
}
