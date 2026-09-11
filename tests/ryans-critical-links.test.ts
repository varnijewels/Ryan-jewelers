import { readFile } from 'node:fs/promises'

import { describe, expect, it } from 'vitest'

import { load as loadLegacyOtp } from '../src/routes/(www)/auth/verify-otp/+page.server.js'

describe('Ryan critical account links', () => {
	it('uses the Ryan-specific signed-in dropdown', async () => {
		const navigation = await readFile('src/lib/theme/ryans-jewels/RyansJewelsNav.svelte', 'utf8')

		expect(navigation).toContain("import RjProfileDropdown from './RjProfileDropdown.svelte'")
		expect(navigation).not.toContain("import ProfileDropdown from '$lib/components/nav/profile-dropdown.svelte'")
	})

	it('routes the legacy OTP page to the working sign-in flow', () => {
		expect.assertions(1)
		try {
			loadLegacyOtp()
		} catch (error) {
			expect(error).toMatchObject({ status: 303, location: '/auth/login' })
		}
	})

	it('keeps legal, product, review, and forgot-password links valid', async () => {
		const [storeSignup, orderTracking, orderDetails, buyAgain, forgotPassword, textbox, footer] = await Promise.all([
			readFile('src/routes/(www)/auth/signup/store/+page.svelte', 'utf8'),
			readFile('src/routes/(www)/order-tracking/+page.svelte', 'utf8'),
			readFile('src/routes/(my)/my/orders/[id]/+page.svelte', 'utf8'),
			readFile('src/routes/(my)/my/buy-again/+page.svelte', 'utf8'),
			readFile('src/routes/(www)/auth/forgot-password/+page.svelte', 'utf8'),
			readFile('src/lib/components/form/textbox.svelte', 'utf8'),
			readFile('src/lib/theme/ryans-jewels/footer-content.ts', 'utf8')
		])

		expect(storeSignup).toContain('href="/terms-and-conditions"')
		expect(storeSignup).toContain('href="/privacy-policy"')
		expect(orderTracking).not.toContain('/my/reviews/create')
		expect(orderDetails).not.toContain('/my/reviews/create')
		expect(buyAgain).not.toContain('href={`/product/')
		expect(forgotPassword).toContain('<h1')
		expect(forgotPassword).toContain('id="forgot-password-email"')
		expect(forgotPassword).toContain('placeholder="you@example.com"')
		expect(textbox).toContain('<Label for={props.id}')
		expect(footer).toContain("year: String(new Date().getFullYear())")
		expect(footer).toContain('Carefully packed and dispatched quickly for a secure delivery.')
		expect(footer).toContain("title: 'Support'")
		expect(footer).toContain("{ label: 'Blog', href: '/blog' }")
		expect(footer).toContain("{ label: 'Customise Design', href: '/products' }")
		expect(footer).toContain("{ label: 'Contact Us', href: '/contact-us' }")
	})

	it('shows only genuine customer ratings and testimonials', async () => {
		const [homeContent, namePlate, navigationContent, productDetails, checkoutOverview] = await Promise.all([
			readFile('src/lib/theme/ryans-jewels/home-content.ts', 'utf8'),
			readFile('src/lib/theme/ryans-jewels/RjNamePlate.svelte', 'utf8'),
			readFile('src/lib/theme/ryans-jewels/nav-content.ts', 'utf8'),
			readFile('src/lib/theme/ryans-jewels/RyansJewelsProductDetails.svelte', 'utf8'),
			readFile('src/lib/theme/ryans-jewels/RyansJewelsCheckoutOverview.svelte', 'utf8')
		])

		expect(homeContent).not.toContain('rating: 5.5')
		expect(namePlate).toContain('{#if liveCards.length}')
		expect(navigationContent).toContain("countryCode: 'US'")
		expect(productDetails).not.toContain('TESTIMONIAL_FALLBACK')
		expect(productDetails).not.toContain('reviewRating || 4.5')
		expect(productDetails).toContain('ryansSeoText(product?.description)')
		expect(productDetails).toContain("await goto('/checkout/address?step=shipping')")
		expect(productDetails).toContain('Unable to start checkout. Please try again.')
		expect(checkoutOverview).not.toContain(':is(button, a, input, select):focus-visible')
		expect(checkoutOverview).toContain('.rj-customer-fields label, .rj-address-fields label > span')
	})
})
