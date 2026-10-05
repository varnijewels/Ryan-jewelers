// Non-financial smoke audit: creates only its own cart and removes its own item.
// Never submits a payment/order, refunds a charge, changes a product, or sends email.
const origin = process.env.COMMERCE_AUDIT_ORIGIN || 'https://ryan.varnijewels.com'
const storeId = process.env.COMMERCE_AUDIT_STORE_ID || 'store_01KHE7ZJ6951Y73FFRWKJDSNRN'
const headers = { 'x-litekart-store': storeId, 'content-type': 'application/json' }
let cartId, lineId, auditProductId, auditVariantId
const report = { checkedAt: new Date().toISOString(), origin, checks: {}, financialOperations: false }

async function request(path, method = 'GET', body) {
	const response = await fetch(new URL(path, origin), { method, headers, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(20000) })
	const data = await response.json().catch(() => ({}))
	return { status: response.status, ok: response.ok, data }
}

try {
	const list = await request('/api/products?page=1')
	const product = list.data?.data?.find((item) => item.variants?.some((variant) => Number(variant.stock) > 0))
	if (!list.ok || !product) throw new Error('No available audit product')
	const variant = product.variants.find((item) => Number(item.stock) > 0)
	auditProductId = product.id
	auditVariantId = variant.id
	const stockBefore = Number(variant.stock)
	report.checks.catalogue = { status: list.status, productId: product.id, variantId: variant.id, stockBefore }
	const methods = await request('/api/payment-methods?page=1')
	const stripe = methods.data?.data?.find((method) => String(method.code).toLowerCase() === 'stripe')
	report.checks.stripeMode = { status: methods.status, testMode: stripe?.isTest === true, publishableKeyType: String(stripe?.apiKey || '').startsWith('pk_test_') ? 'test' : String(stripe?.apiKey || '').startsWith('pk_live_') ? 'live' : 'not verified' }
	const popularity = await request('/api/popularity/update', 'POST', { product: { id: product.id, title: product.title, slug: product.slug }, categories: ['rings'] })
	report.checks.popularity = { status: popularity.status, recorded: popularity.data.recorded, message: popularity.data.message }
	const created = await request('/api/carts', 'POST', { productId: product.id, variantId: variant.id, qty: 1 })
	cartId = created.data?.id || created.data?.cartId
	if (!created.ok || !cartId) throw new Error(`Audit cart creation failed (${created.status})`)
	let cart = await request(`/api/carts/${cartId}`)
	if (!cart.data?.lineItems?.length) {
		const added = await request(`/api/carts/${cartId}/line-items`, 'POST', { productId: product.id, variantId: variant.id, qty: 1 })
		if (!added.ok) throw new Error(`Add to audit cart failed (${added.status})`)
		cart = await request(`/api/carts/${cartId}`)
	}
	lineId = cart.data?.lineItems?.find((item) => item.variantId === variant.id || item.productId === product.id)?.id
	if (!lineId) throw new Error('Audit item was not found in cart')
	report.checks.cart = { status: cart.status, cartId, itemCount: cart.data.lineItems.length, subtotal: cart.data.subtotal, total: cart.data.total, shippingCharges: cart.data.shippingCharges, hasAddress: Boolean(cart.data.shippingAddressId) }
	const shipping = await request(`/api/shipping-rates/${cartId}`)
	report.checks.shippingWithoutAddress = { status: shipping.status, rateCount: shipping.data?.data?.length || 0, message: shipping.data?.error?.message || shipping.data?.message, interpretation: 'A cart without a verified delivery address must not be considered shipping-ready.' }
	const after = await request(`/api/products/${product.slug}`)
	const currentVariant = after.data?.variants?.find((item) => item.id === variant.id)
	report.checks.cartStock = { status: after.status, stockBefore, stockAfter: currentVariant?.stock, unchanged: currentVariant ? Number(currentVariant.stock) === stockBefore : null, interpretation: 'Cart-only check. Successful-order stock deduction is NOT verified.' }
	report.notVerified = ['Destination-specific shipping/tax totals', 'Paid order and stock decrement', 'Signed webhook processing and duplicate delivery', 'Partial/full refund and inventory policy']
} catch (error) {
	report.error = error.message
	process.exitCode = 1
} finally {
	if (cartId && lineId) {
		// Match the storefront's supported remove-item contract (quantity zero).
		const removed = await request(`/api/carts/${cartId}/line-items`, 'POST', { id: lineId, productId: auditProductId, variantId: auditVariantId, qty: 0 })
		const empty = await request(`/api/carts/${cartId}`)
		report.cleanup = { removeStatus: removed.status, finalStatus: empty.status, remainingItems: empty.data?.lineItems?.length ?? (empty.status === 404 && empty.data?.message === 'Cart is empty' ? 0 : null), empty: empty.data?.lineItems?.length === 0 || (empty.status === 404 && empty.data?.message === 'Cart is empty') }
		if (!report.cleanup.empty) process.exitCode = 1
	}
	console.log(JSON.stringify(report, null, 2))
}
