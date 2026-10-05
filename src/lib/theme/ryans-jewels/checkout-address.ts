export function blankCheckoutAddress(countryCode = 'US') {
	return { firstName: '', lastName: '', phone: '', address_1: '', address_2: '', city: '', state: '', zip: '', countryCode }
}

export function normalizeCheckoutAddress(address: any) {
	return Object.fromEntries(Object.entries(address).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]))
}

export function addressError(address: any) {
	for (const [key, label] of [['firstName', 'First name'], ['lastName', 'Last name'], ['address_1', 'Street address'], ['city', 'City'], ['state', 'State / province'], ['zip', 'ZIP / postal code'], ['countryCode', 'Country']]) {
		if (!String(address[key] || '').trim()) return `${label} is required.`
	}
	return ''
}

export async function saveCheckoutDetails(cartState: any, details: { email: string; phone: string; shipping: any; billing: any; sameBilling: boolean }) {
	await cartState.updateEmail({ email: details.email.trim(), phone: details.phone.trim() })
	if (cartState.cart?.email?.toLowerCase() !== details.email.trim().toLowerCase()) throw new Error('Your contact information was not saved. Please try again.')
	await cartState.updateShippingAddress({ shippingAddress: details.shipping, billingAddress: details.sameBilling ? details.shipping : details.billing, isBillingAddressSameAsShipping: details.sameBilling })
	const cart = cartState.cart
	if (!cart?.shippingAddressId || !cart.shippingAddress?.address_1 || (!details.sameBilling && !cart.billingAddress?.address_1)) throw new Error('Your address was not saved. Please try again.')
}
