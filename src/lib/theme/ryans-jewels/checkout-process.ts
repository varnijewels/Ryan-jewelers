const SUPPORTED_GATEWAYS = new Set(['STRIPE', 'CASHFREE', 'RAZORPAY', 'COD'])

export function hasCheckoutAddress(cart: any) {
	return Boolean(cart?.shippingAddress || cart?.shippingAddressId)
}

export function successfulCartAction(previousCartId: string | null) {
	return previousCartId ? 'restore' : 'clear'
}

export function canStartPayment(isSubmitting: boolean, paymentLoader: boolean) {
	return !isSubmitting && !paymentLoader
}

export function hasVerifiedCheckoutOrders(data: any) {
	const orders = data?.orders?.data
	return Boolean(
		orders?.length &&
		orders.every((order: any) => {
			const method = String(order?.paymentMethod || order?.paymentGateway || '').toUpperCase()
			if (method === 'COD') return String(order?.status || '').toUpperCase() === 'PLACED'
			return String(order?.paymentStatus || '').toUpperCase() === 'PAID'
		})
	)
}

export function isValidCheckoutCallback(url: URL) {
	const gateway = url.searchParams.get('pg')?.trim().toUpperCase()
	if (!gateway || !SUPPORTED_GATEWAYS.has(gateway)) return false
	if (!url.searchParams.get('cart_id') || !url.searchParams.get('order_no')) return false

	return gateway !== 'STRIPE' || Boolean(url.searchParams.get('payment_session_id') && url.searchParams.get('store_id'))
}

export function checkoutFailedPath(url: URL) {
	const params = new URLSearchParams()
	for (const key of ['cart_id', 'order_no']) {
		const value = url.searchParams.get(key)
		if (value) params.set(key, value)
	}
	return `/checkout/failed${params.size ? `?${params}` : ''}`
}

export function checkoutPurchaseData(orders: any[] = [], user?: any) {
	const firstOrder = orders[0] || {}
	return {
		orderNo: firstOrder.orderNo,
		amount: {
			total: orders.reduce((sum, order) => sum + Number(order?.total || 0), 0),
			shipping: orders.reduce(
				(sum, order) => sum + Number(order?.shippingCharges || order?.shippingRate?.baseRate || 0),
				0
			)
		},
		tax: orders.reduce((sum, order) => sum + Number(order?.taxAmount || order?.tax || 0), 0),
		coupon: firstOrder.coupon,
		items: orders.flatMap((order) => order?.lineItems || []),
		user
	}
}
