import { expect, test } from '@playwright/test'

test('metal color changes the product image without navigating', async ({ page }) => {
	await page.goto('/products/1-to-5-carat-round-lab-grown-diamond-6-prong-solitaire-engagement-ring-in-14k-gold-19')

	const image = page.locator('.rj-main-image > img')
	const roseGold = page.locator('.rj-metal-colors button[aria-label="Select Rose Gold"]')
	await roseGold.scrollIntoViewIfNeeded()
	const before = { url: page.url(), image: await image.getAttribute('src'), scroll: await page.evaluate(() => scrollY) }

	await roseGold.click()
	await expect(roseGold).toHaveAttribute('aria-pressed', 'true')
	await expect.poll(() => image.getAttribute('src')).not.toBe(before.image)
	expect(page.url()).toBe(before.url)
	expect(await page.evaluate(() => scrollY)).toBe(before.scroll)

	const roseImage = await image.getAttribute('src')
	await page.locator('.rj-custom-head button').click()
	const dialog = page.locator('dialog.rj-customizer')
	await dialog.locator('.rj-customizer-metals button').filter({ hasText: 'Yellow Gold' }).click()
	await dialog.getByRole('button', { name: 'CUSTOMISE', exact: true }).click()
	await expect(dialog).toBeHidden({ timeout: 15_000 })
	await expect.poll(() => image.getAttribute('src')).not.toBe(roseImage)
	expect(page.url()).toBe(before.url)
})

test('page navigation starts at the top', async ({ page }) => {
	await page.goto('/products/1-to-5-carat-round-lab-grown-diamond-6-prong-solitaire-engagement-ring-in-14k-gold-19')
	const productUrl = page.url()
	await page.evaluate(() => {
		document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important')
		document.documentElement.scrollTop = document.body.scrollHeight
		document.documentElement.style.removeProperty('scroll-behavior')
	})
	expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0)
	await page.locator('a.rj-cart').click()
	await page.waitForURL('**/checkout/cart')
	expect(await page.evaluate(() => scrollY)).toBe(0)

	await page.evaluate(() => history.back())
	await expect(page).toHaveURL(productUrl)
	await page.waitForTimeout(100)
	expect(await page.evaluate(() => scrollY)).toBe(0)
})

test('mobile account icon opens login and registration', async ({ page }) => {
	await page.setViewportSize({ width: 412, height: 915 })
	await page.goto('/')
	await page.getByRole('button', { name: 'Sign in or register' }).click()
	await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
	await page.getByRole('button', { name: 'Open authentication modal' }).filter({ hasText: 'Create an account' }).click()
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible()
})

test('Ryan catalog hides non-Ryan placeholder products', async ({ page }) => {
	await page.goto('/products')
	await expect(page.locator('a[href="/products/slit-knit-dress"], a[href="/products/satin-crop-top"]')).toHaveCount(0)
})

test('sitemap serves Ryan pages instead of redirecting to a missing file', async ({ request }) => {
	const response = await request.get('/sitemap.xml')
	expect(response.status()).toBe(200)
	expect(response.headers()['content-type']).toContain('application/xml')
	expect(await response.text()).toContain('<loc>http://localhost:3000/products</loc>')
})

for (const path of ['/collections', '/categories/lab-grown-diamond', '/categories/rings', '/categories/earrings', '/categories/pendants']) {
	test(`${path} redirects to the working catalog`, async ({ request }) => {
		const response = await request.get(path)
		expect(response.status()).toBe(200)
		expect(response.url()).toContain('/products')
	})
}

for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 900 }, mobile: { width: 412, height: 915 } })) {
	test(`cart login releases the page scroll on ${name}`, async ({ page }) => {
		const user = { id: 'auth_test_user', firstName: 'Auth', lastName: 'Test', email: 'hi@litekart.in', role: 'USER' }
		await page.setViewportSize(viewport)
		await page.route('**/api/auth/login', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(user) }))
		await page.route('**/api/wishlists/me', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
		await page.goto('/checkout/cart?show_auth=true&login=true')
		await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
		expect(await page.evaluate(() => document.body.style.position)).toBe('fixed')

		await page.locator('input[name="identifier"]').fill('hi@litekart.in')
		await page.locator('input[name="password"]').fill('Litekart1')
		await page.evaluate((mockUser) => {
			document.cookie = 'connect.sid=auth-test-session; path=/'
			document.cookie = `me=${encodeURIComponent(JSON.stringify(mockUser))}; path=/`
		}, user)
		await page.getByRole('button', { name: 'Sign In', exact: true }).click()

		await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeHidden()
		await expect(page).toHaveURL(/\/checkout\/cart$/)
		expect(await page.evaluate(() => [document.documentElement.style.overflow, document.body.style.overflow, document.body.style.position, document.body.style.top])).toEqual(['', '', '', ''])
		await page.evaluate(() => {
			document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important')
			document.documentElement.scrollTop = document.body.scrollHeight
			document.body.scrollTop = document.body.scrollHeight
			document.documentElement.style.removeProperty('scroll-behavior')
		})
		expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0)
		await expect(page.locator('footer.rj-foot')).toBeVisible()
	})
}
