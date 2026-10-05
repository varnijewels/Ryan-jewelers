import { expect, test, type Page } from '@playwright/test'

// Deliberately different title lengths reproduce the supplied screenshot bug.
// Only product search is mocked; no cart, order, payment or refund is submitted.
const products = Array.from({ length: 4 }, (_, index) => ({
	id: `qa-nameplate-${index}`,
	slug: `qa-nameplate-${index}`,
	title: index < 2
		? '1 To 5 Carat Round Lab Grown Diamond Solitaire Engagement Ring In 14K Gold - ENR6789'
		: '14K Gold',
	thumbnail: `/ryans-jewels/home/nameplate-card-${index % 3 + 1}.webp`,
	category: { name: index < 2 ? 'Round' : 'Cluster Pendants' },
	price: 100, stock: 10, rating: 0, tags: [{ name: 'JewelWeSell' }]
}))

async function openHomepage(page: Page) {
	await page.route('**/api/ms/products*', (route) => route.fulfill({
		json: { hits: products, totalHits: products.length, facetDistribution: {}, allfacetStats: {} }
	}))
	await page.goto('/')
	const section = page.locator('.rj-plate')
	await expect(section.locator('.rj-cust-name').first()).toHaveAttribute('title', products[0].title)
	await section.scrollIntoViewIfNeeded()
	await page.evaluate(() => document.fonts.ready)
	return section
}

test('nameplate matches the desktop geometry of Figma 341:55580', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 })
	const section = await openHomepage(page)
	const geometry = await section.evaluate((element) => {
		const base = element.getBoundingClientRect()
		const box = (selector: string) => {
			const node = element.querySelector<HTMLElement>(selector)!
			const rect = node.getBoundingClientRect()
			const style = getComputedStyle(node)
			return { x: rect.x - base.x, y: rect.y - base.y, width: rect.width, height: rect.height,
				fontSize: style.fontSize, lineHeight: style.lineHeight, fontFamily: style.fontFamily }
		}
		return { section: { width: base.width, height: base.height },
			panel: box('.rj-plate-panel'), artwork: box('.rj-plate-art'),
			head: box('.rj-plate-head'), well: box('.rj-cust-well'), title: box('.rj-plate-title'),
			name: box('.rj-cust-name'), meta: box('.rj-cust-meta'), cta: box('.rj-cust-cta') }
	})
	// Reveal animations translate the whole section; relative geometry is stable.
	expect(geometry.section).toEqual({ width: 1440, height: 600 })
	expect(geometry.panel).toMatchObject({ x: 0, width: 598, height: 600 })
	expect(geometry.artwork).toMatchObject({ width: 375, height: 182 })
	expect(geometry.head).toMatchObject({ x: 632, y: 37, width: 748, height: 60 })
	expect(geometry.well).toMatchObject({ x: 654, y: 146, width: 222, height: 270 })
	expect(geometry.title).toMatchObject({ fontSize: '32px', lineHeight: '40px' })
	expect(geometry.title.fontFamily).toContain('Red Rose')
	expect(geometry.name).toMatchObject({ fontSize: '16px', height: 26 })
	expect(geometry.name.fontFamily).toContain('Sarala')
	expect(geometry.meta.height).toBe(23)
	expect(geometry.cta).toMatchObject({ y: 479, height: 26 })
	const rows = await section.locator('.rj-cust-cta').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().y))
	expect(new Set(rows).size).toBe(1)
	await expect(section.locator('.rj-cust-rating')).toHaveCount(0)
})

test('nameplate controls scroll the live products without changing their links', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 })
	const section = await openHomepage(page)
	await expect(section.locator('a.rj-cust').first()).toHaveAttribute('href', '/products/qa-nameplate-0')
	await section.getByRole('button', { name: 'Next products' }).click()
	await expect.poll(() => section.locator('.rj-plate-cards').evaluate((element) => element.scrollLeft)).toBeGreaterThan(20)
	await page.waitForTimeout(400)
	await section.getByRole('button', { name: 'Previous products' }).click()
	await expect.poll(() => section.locator('.rj-plate-cards').evaluate((element) => element.scrollLeft)).toBeLessThan(1)
})

test('nameplate stays within narrow screens and retains the live card actions', async ({ page }) => {
	const section = await openHomepage(page)
	for (const width of [1920, 1144, 1024, 744, 412, 390, 320]) {
		await page.setViewportSize({ width, height: 900 })
		const geometry = await section.evaluate((element) => {
			const box = element.getBoundingClientRect()
			return { left: box.left, right: box.right, bottom: box.bottom,
				innerRight: element.querySelector('.rj-plate-inner')!.getBoundingClientRect().right,
				actions: [...element.querySelectorAll('.rj-cust-cta')].map((node) => node.getBoundingClientRect().bottom) }
		})
		expect(geometry.left).toBeGreaterThanOrEqual(0)
		expect(geometry.right).toBeLessThanOrEqual(width)
		expect(geometry.innerRight).toBeLessThanOrEqual(width)
		expect(geometry.actions.every((bottom) => bottom <= geometry.bottom)).toBe(true)
	}
})
