import { expect, test } from '@playwright/test'

test('customizer loads the real grouped metal product without navigating', async ({ page }) => {
	await page.goto('/products/175-to-575-carat-round-lab-grown-diamond-halo-engagement-ring-in-14k-gold-398')

	const image = page.locator('.rj-main-image > img')
	const roseGold = page.locator('.rj-customizer-metals button').filter({ hasText: 'Rose Gold' })
	const goldInfo = page.locator('.rj-detail-fact').filter({ hasText: 'Gold Info' }).locator('p')
	const before = { url: page.url(), image: await image.getAttribute('src') }

	await roseGold.click()
	await expect(roseGold).toHaveAttribute('aria-pressed', 'true')
	await expect.poll(() => image.getAttribute('src')).not.toBe(before.image)
	await expect(image).toHaveAttribute('src', /main_rg\.jpg/)
	await expect(goldInfo).toContainText('Rose Gold')
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
	await page.waitForLoadState('networkidle')
	const accountMenu = page.getByRole('button', { name: 'Open account menu' })
	await accountMenu.click()
	await expect(accountMenu).toHaveAttribute('aria-expanded', 'true')
	await page.getByRole('button', { name: 'Open authentication modal' }).filter({ hasText: 'Sign in / Create Account' }).click()
	await expect(page.locator('.rj-auth-popup')).toBeVisible()
	await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
	await page.getByRole('button', { name: 'Open authentication modal' }).filter({ hasText: 'Create an account' }).click()
	expect(new URL(page.url()).pathname).toBe('/')
	await expect(page.locator('.rj-auth-popup')).toBeVisible()
	await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible()
})

test('Ryan account pages link the login and registration flow', async ({ page }) => {
	await page.goto('/auth/login?redirect=%2Fcheckout%2Fcart')
	await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible()
	await page.getByRole('link', { name: 'Create your account' }).click()
	await expect(page).toHaveURL(/\/auth\/signup\?redirect=/)
	await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
	await expect(page.getByRole('button', { name: 'Create account' })).toBeDisabled()

	await page.goto('/auth/signup/success?email=test%40example.com')
	await expect(page.getByRole('heading', { name: 'Check your inbox' })).toBeVisible()
	await expect(page.getByText('test@example.com')).toBeVisible()
})

test('Ryan catalog hides non-Ryan placeholder products', async ({ page }) => {
	await page.goto('/products')
	await expect(page.locator('a[href="/products/slit-knit-dress"], a[href="/products/satin-crop-top"]')).toHaveCount(0)
})

test('mobile product filter opens, fits the viewport, and closes with Escape', async ({ page }) => {
	await page.setViewportSize({ width: 412, height: 915 })
	await page.goto('/products')
	const filterButton = page.getByRole('button', { name: 'Filter', exact: true })

	await filterButton.click()
	await expect(filterButton).toHaveAttribute('aria-expanded', 'true')
	const dialog = page.getByRole('dialog', { name: 'Filters' })
	await expect(dialog).toBeVisible()
	await expect(dialog.getByRole('button', { name: /View(?: \d+)? Results/ })).toBeVisible()
	await expect.poll(async () => Math.round((await dialog.boundingBox())?.x ?? -999)).toBe(0)

	const [dialogBox, filterButtonBox, closeButtonBox] = await Promise.all([
		dialog.boundingBox(),
		filterButton.boundingBox(),
		dialog.getByRole('button', { name: 'Close filters' }).boundingBox()
	])
	expect(dialogBox?.x).toBe(0)
	expect(dialogBox?.width).toBeLessThanOrEqual(412)
	expect(filterButtonBox?.height).toBeGreaterThanOrEqual(44)
	expect(closeButtonBox?.width).toBeGreaterThanOrEqual(44)
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(412)

	await page.keyboard.press('Escape')
	await expect(filterButton).toHaveAttribute('aria-expanded', 'false')
	await expect(filterButton).toBeFocused()

	await filterButton.click()
	await dialog.getByRole('checkbox', { name: 'In Stock' }).check()
	await expect.poll(() => new URL(page.url()).searchParams.has('uiStatus')).toBe(true)
	await dialog.getByRole('button', { name: /View(?: \d+)? Results/ }).click()
	await expect(filterButton).toHaveAttribute('aria-expanded', 'false')

	await filterButton.click()
	const clearButton = dialog.getByRole('button', { name: 'Clear All' })
	await expect(clearButton).toBeEnabled()
	await clearButton.click()
	await expect.poll(() => new URL(page.url()).searchParams.has('uiStatus')).toBe(false)
	await expect(filterButton).toHaveAttribute('aria-expanded', 'false')
})

test('Ryan header does not render the static fallback menu', async ({ request }) => {
	const response = await request.get('/')
	expect(response.status()).toBe(200)
	expect(await response.text()).not.toContain('>All Jewellery<')
})

test('sitemap serves Ryan pages instead of redirecting to a missing file', async ({ request }) => {
	const response = await request.get('/sitemap.xml')
	expect(response.status()).toBe(200)
	expect(response.headers()['content-type']).toContain('application/xml')
	expect(await response.text()).toContain(`<loc>${new URL(response.url()).origin}/products</loc>`)
})

for (const path of ['/collections', '/categories/lab-grown-diamond', '/categories/rings', '/categories/engagement', '/categories/bracelets', '/categories/earrings', '/categories/pendants']) {
	test(`${path} redirects to the working catalog`, async ({ request }) => {
		const response = await request.get(path)
		expect(response.status()).toBe(200)
		expect(response.url()).toContain('/products')
	})
}

test('mobile submenu opens its working catalog destination', async ({ page }) => {
	await page.setViewportSize({ width: 412, height: 917 })
	await page.goto('/')
	await page.getByRole('button', { name: 'Open menu' }).click()
	await page.locator('.rj-tablet-menu-item', { hasText: 'Bracelets' }).click()
	await page.locator('.rj-tablet-menu .rj-tablet-lab-view-all').click()
	await expect(page).toHaveURL(/\/products\?search=Bracelets$/)
})

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
