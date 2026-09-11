export const buyAgainItems = (response: any) => (Array.isArray(response) ? response : response?.data || [])

export const sameVariant = (left: any, right: any) => left?.productId === right?.productId && left?.variantId === right?.variantId

export function couponAction(appliedCode: unknown, enteredCode: unknown) {
	const code = String(enteredCode || '').trim()
	if (!code) return 'none'
	return String(appliedCode || '').trim().toLowerCase() === code.toLowerCase() ? 'remove' : 'apply'
}

export const orderInvoiceUrl = (order: any) =>
	[order?.invoiceLink, order?.invoiceUrl, order?.invoice?.url, order?.fulfillment?.invoiceUrl, ...(order?.fulfillments || []).map((entry: any) => entry?.invoiceUrl)]
		.find((value) => typeof value === 'string' && value.trim())?.trim() || ''

export function productReviewHref(item: any) {
	if (!item?.slug) return '/products'
	const query = new URLSearchParams({ variant_id: item.variantId || '', review: '1' })
	return `/products/${item.slug}?${query}#rj-specifications`
}
