// Local UI regression with mocked APIs. Start the development server on port 3000 first.
// All financial endpoints are aborted; no real payment, refund, or stock write occurs.
import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'

const origin = 'http://127.0.0.1:3000'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const context = await browser.newContext({ viewport: { width: 1365, height: 900 } })
const page = await context.newPage()
const errors = [], financialRequests = []
page.on('pageerror', (error) => errors.push(error.message))
const cart = {
	id: 'qa-shipping', email: 'qa@example.test', phone: '5550100', subtotal: 100, tax: 8, total: 108,
	shippingAddressId: 'qa-address', shippingAddress: { firstName: 'QA', lastName: 'Buyer', address_1: 'Test address', countryCode: 'US', state: 'NY', city: 'New York', zip: '10001' },
	shippingRateId: null, shippingCharges: null, lineItems: [{ id: 'qa-line', productId: 'qa-product', variantId: 'qa-variant', title: 'QA ring', slug: 'qa-ring', thumbnail: '/placeholder.svg', price: 100, qty: 1, isSelectedForCheckout: true }]
}
let rateFailure = false, savingObserved = false, patches = 0
await context.addInitScript(() => localStorage.setItem('cart_id', 'qa-shipping'))
await page.route('**/api/**', async (route) => {
	const request = route.request(), path = new URL(request.url()).pathname
	const reply = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
	if (path.startsWith('/api/checkout/')) { financialRequests.push(path); return route.abort() }
	if (path.startsWith('/api/carts/qa-shipping')) {
		if (request.method() === 'PATCH') {
			patches++
			const { shippingRateId } = request.postDataJSON()
			await new Promise((resolve) => setTimeout(resolve, 600))
			cart.shippingRateId = shippingRateId
			cart.shippingCharges = shippingRateId === 'express' ? 20 : 10
			cart.total = 108 + cart.shippingCharges
		}
		return reply(cart)
	}
	if (path === '/api/shipping-rates/qa-shipping') return rateFailure ? reply({ error: { message: 'Delivery unavailable for this postcode' } }) : reply({ data: [{ id: 'standard', name: 'Standard', baseRate: 10, estimatedMinDays: 3, estimatedMaxDays: 5 }, { id: 'express', name: 'Express', base_rate: 20, estimated_min_days: 1, estimated_max_days: 2 }] })
	if (path === '/api/payment-methods') return reply({ data: [{ code: 'stripe', name: 'Stripe', isTest: true }], count: 1 })
	if (path.includes('/api/coupons')) return reply({ data: [], count: 0 })
	return route.continue()
})
const report = { mockedBackend: true, actualFinancialOperations: false }
try {
	await page.goto(origin + '/checkout/payment', { waitUntil: 'domcontentloaded', timeout: 30000 })
	await page.getByRole('heading', { name: 'Shipping Method', exact: true }).waitFor({ timeout: 20000 })
	const pay = page.getByRole('button', { name: 'PROCEED TO PAYMENT', exact: true })
	const standard = page.locator('input[name=shippingRate][value=standard]')
	const express = page.locator('input[name=shippingRate][value=express]')
	await standard.waitFor({ timeout: 15000 })
	assert(await pay.isDisabled(), 'payment must be disabled before selecting shipping')
	assert.match(await page.locator('.rj-shipping-list').innerText(), /10\.00/)
	assert.match(await page.locator('.rj-shipping-list').innerText(), /20\.00/)
	report.pricedRates = true
	await standard.check({ force: true })
	await page.getByText('Updating delivery charge and total…', { exact: true }).waitFor({ timeout: 5000 })
	savingObserved = await pay.isDisabled()
	assert(savingObserved, 'payment must be disabled during shipping save')
	assert(await page.getByRole('button', { name: 'Increase quantity', exact: true }).isDisabled(), 'quantity must not race a shipping save')
	assert(await page.getByRole('button', { name: 'APPLY COUPON', exact: true }).isDisabled(), 'coupon must not race a shipping save')
	await page.waitForFunction(() => document.querySelector('.rj-order-summary')?.textContent.includes('118.00'))
	await page.waitForTimeout(200)
	assert(await pay.isEnabled(), 'payment must be enabled after shipping is verified')
	assert.match(await page.locator('.summary-lines').innerText(), /Shipping\s+\$10\.00/)
	assert.match(await page.locator('.summary-lines').innerText(), /Taxes\s+\$8\.00/)
	await express.check({ force: true })
	await page.waitForFunction(() => document.querySelector('.rj-order-summary')?.textContent.includes('128.00'))
	await page.waitForTimeout(200)
	assert.match(await page.locator('.summary-lines').innerText(), /Shipping\s+\$20\.00/)
	report.rateAndTotalUpdate = true
	report.backendTaxDisplayed = true
	rateFailure = true
	await page.reload({ waitUntil: 'domcontentloaded' })
	await page.getByText('Delivery unavailable for this postcode', { exact: true }).waitFor({ timeout: 15000 })
	assert(await pay.isDisabled(), 'payment must remain disabled after delivery failure even with a saved rate ID')
	rateFailure = false
	await page.getByRole('button', { name: 'Retry shipping', exact: true }).click()
	await express.waitFor({ timeout: 10000 })
	await page.waitForFunction(() => !document.querySelector('.rj-place-order')?.disabled)
	assert(await pay.isEnabled(), 'successful retry should restore eligibility')
	report.failureAndRetry = true
	await page.setViewportSize({ width: 390, height: 844 })
	assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0)
	report.mobileOverflow = 0
	await page.setViewportSize({ width: 320, height: 844 })
	assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0)
	report.mobile320Overflow = 0
	assert.deepEqual(errors, [])
	assert.deepEqual(financialRequests, [])
	report.paymentBlockedDuringSave = savingObserved
	report.shippingPatches = patches
	report.errors = errors
	report.passed = true
} catch (error) {
	report.passed = false
	report.error = error.message
	report.url = page.url()
	report.body = (await page.locator('body').innerText().catch(() => '')).slice(0, 2400)
	report.errors = errors
	report.overflowingElements = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((element) => element.getBoundingClientRect().right > innerWidth + 1).slice(0, 15).map((element) => ({ tag: element.tagName, className: element.className, right: element.getBoundingClientRect().right })))
	process.exitCode = 1
} finally {
	await context.close()
	await browser.close()
	console.log(JSON.stringify(report, null, 2))
}
