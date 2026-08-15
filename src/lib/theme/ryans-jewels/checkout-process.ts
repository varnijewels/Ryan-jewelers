const SUPPORTED_GATEWAYS = new Set(['STRIPE', 'CASHFREE', 'RAZORPAY', 'COD'])

export function isValidCheckoutCallback(url: URL) {
	const gateway = url.searchParams.get('pg')?.trim().toUpperCase()
	if (!gateway || !SUPPORTED_GATEWAYS.has(gateway)) return false
	if (!url.searchParams.get('cart_id') || !url.searchParams.get('order_no')) return false

	return (
		gateway !== 'STRIPE' ||
		Boolean(url.searchParams.get('payment_session_id') && url.searchParams.get('store_id'))
	)
}

export function checkoutFailedPath(url: URL) {
	const params = new URLSearchParams()
	for (const key of ['cart_id', 'order_no']) {
		const value = url.searchParams.get(key)
		if (value) params.set(key, value)
	}
	return `/checkout/failed${params.size ? `?${params}` : ''}`
}
