export function cartItemHref(item: any) {
	return `/products/${encodeURIComponent(item.slug || '')}${item.variantId ? `?variant_id=${encodeURIComponent(item.variantId)}` : ''}`
}

// The shared cart methods swallow API errors. Confirm the actual line quantity
// before opening the drawer, rather than relying on its temporary success flag.
export async function addSelectionToCart(cartState: any, selection: { productId: string; variantId: string; qty: number }) {
	const quantity = () => Number(cartState.cart?.lineItems?.find((item: any) => item.productId === selection.productId && item.variantId === selection.variantId)?.qty || 0)
	const before = quantity()
	await cartState.addOrUpdate(selection)
	if (quantity() <= before) return false
	cartState.isOpen = true
	return true
}

export function checkoutBusy(cartState: any) {
	return Boolean(cartState.isUpdatingCart || Object.values(cartState.updatingItem || {}).some(Boolean))
}
