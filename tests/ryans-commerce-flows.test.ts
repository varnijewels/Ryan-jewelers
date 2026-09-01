import { readFile } from 'node:fs/promises'
import { AuthService, OrderService, ProductService } from '@misiki/litekart-connector'
import { describe, expect, it, vi } from 'vitest'
import { normalizePhone, resetPasswordError } from '../src/lib/theme/ryans-jewels/auth-flow.js'
import { buyAgainItems, productReviewHref, sameVariant } from '../src/lib/theme/ryans-jewels/commerce-flow.js'
import { load as loadCategory } from '../src/routes/(www)/categories/[slug]/+page.server.js'

function redirectFor(slug: string, query = '') {
	try {
		loadCategory({ params: { slug }, url: new URL(`https://shop.test/categories/${slug}${query}`) } as any)
	} catch (error) {
		return error as { status: number; location: string }
	}
}

describe('Ryan critical commerce flows', () => {
	it('uses the expected OTP, password, review, and Buy Again API contracts', async () => {
		const fetch = vi.fn(async (_url: string, _init?: RequestInit) =>
			new Response(JSON.stringify({ id: 'ok', data: [] }), { status: 200, headers: { 'content-type': 'application/json' } })
		)
		const auth = new AuthService(fetch as any)
		const products = new ProductService(fetch as any)
		const orders = new OrderService(fetch as any)

		await auth.getOtp({ phone: '+919876543210' })
		await auth.verifyOtp({ phone: '+919876543210', otp: '1234' })
		await auth.forgotPassword({ email: 'customer@example.com', referrer: 'https://shop.test' })
		await auth.resetPassword({ userId: 'user-1', token: 'token-1', password: 'Password1' })
		await products.addReview({ productId: 'product-1', variantId: 'variant-1', rating: 5, review: 'Excellent', uploadedImages: [] })
		await orders.buyAgain()

		expect(fetch.mock.calls.map(([url]) => url)).toEqual([
			'/api/auth/get-otp',
			'/api/auth/verify-otp',
			'/api/auth/forgot-password',
			'/api/auth/reset-password',
			'/api/products/ratings-and-reviews',
			'/api/orders/buy-again'
		])
		expect(JSON.parse(String(fetch.mock.calls[0][1]?.body))).toEqual({ phone: '+919876543210' })
		expect(JSON.parse(String(fetch.mock.calls[3][1]?.body))).toEqual({ userId: 'user-1', token: 'token-1', password: 'Password1' })
		expect(JSON.parse(String(fetch.mock.calls[4][1]?.body))).toEqual({ productId: 'product-1', variantId: 'variant-1', review: 'Excellent', rating: 5, uploadedImages: [] })
	})

	it('normalizes local and international phone numbers for OTP delivery', () => {
		expect(normalizePhone('09876 543210', '+91')).toBe('+919876543210')
		expect(normalizePhone('+1 (415) 555-2671', '+91')).toBe('+14155552671')
	})

	it('validates both reset-link fields and matching secure passwords', () => {
		expect(resetPasswordError('', 'user-1', 'Password1', 'Password1')).toContain('invalid')
		expect(resetPasswordError('token', 'user-1', 'short', 'short')).toContain('8 characters')
		expect(resetPasswordError('token', 'user-1', 'Password1', 'Password2')).toContain('do not match')
		expect(resetPasswordError('token', 'user-1', 'Password1', 'Password1')).toBe('')
	})

	it('normalizes Buy Again data and matches the exact product variant', () => {
		const item = { productId: 'product-1', variantId: 'yellow-7', slug: 'diamond-ring' }
		expect(buyAgainItems({ data: [item], count: 1 })).toEqual([item])
		expect(buyAgainItems([item])).toEqual([item])
		expect(sameVariant(item, { productId: 'product-1', variantId: 'white-7' })).toBe(false)
		expect(sameVariant(item, { productId: 'product-1', variantId: 'yellow-7' })).toBe(true)
		expect(productReviewHref(item)).toBe('/products/diamond-ring?variant_id=yellow-7&review=1#rj-specifications')
	})

	it('routes every jewelry category into the real catalogue and removes kids and saree', () => {
		expect(redirectFor('mens-rings')).toMatchObject({ status: 307, location: '/products?categories=mens-rings&catalog=Mens+Rings' })
		expect(redirectFor('lab-grown-diamond', '?shape=oval')).toMatchObject({
			status: 307,
			location: '/products?search=lab+grown+diamond&uiShape=Oval&catalog=Lab+Grown+Diamond'
		})
		expect(redirectFor('kids-jewellery')).toMatchObject({ status: 307, location: '/categories' })
		expect(redirectFor('saree')).toMatchObject({ status: 307, location: '/categories' })
	})

	it('keeps Buy Again, reviews, OTP and reset completion wired to their APIs', async () => {
		const [buyAgain, login, reset, reviews, order, tracking] = await Promise.all([
			readFile('src/routes/(my)/my/buy-again/+page.svelte', 'utf8'),
			readFile('src/routes/(www)/auth/login/+page.svelte', 'utf8'),
			readFile('src/routes/(www)/auth/reset-password/+page.svelte', 'utf8'),
			readFile('src/routes/(www)/products/[slug]/components/product-reviews-section.svelte', 'utf8'),
			readFile('src/routes/(my)/my/orders/[id]/+page.svelte', 'utf8'),
			readFile('src/routes/(www)/order-tracking/+page.svelte', 'utf8')
		])
		expect(buyAgain).toContain('buyAgainItems(response)')
		expect(buyAgain).toContain('await cartState.addOrUpdate')
		expect(buyAgain).toContain('sameVariant(line, item)')
		expect(login).toContain('await authService.getOtp({ phone })')
		expect(login).toContain('await authService.verifyOtp')
		expect(reset).toContain('await authService.resetPassword({ userId, token, password })')
		expect(reviews).toContain('await productService.addReview')
		expect(reviews).toContain('await invalidateAll()')
		expect(order).toContain('productReviewHref(item)')
		expect(tracking).toContain('productReviewHref(item)')
	})
})
