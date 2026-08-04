/** Whole-homepage audit: section order, horizontal overflow, console errors. */
import { chromium } from 'playwright'

const ORDER = [
	'.rj-hero-wrap', '.rj-band--trust', '.rj-band--cut', '.rj-band--products',
	'.rj-mq-track', '.rj-passion', '.rj-bestsellers', '.rj-plate',
	'.rj-look', '.rj-banner', '.rj-trend', '.rj-enq', '.rj-faq', '.rj-ig', '.rj-foot'
]
const VIEWPORTS = (process.env.RJ_WIDTHS || '1440,744,412')
	.split(',')
	.map((w) => ({ key: `w${w.trim()}`, width: Number(w.trim()), height: 900 }))

const browser = await chromium.launch()
for (const vp of VIEWPORTS) {
	const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
	const errors = []
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
	page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e)))
	await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 90000 })
	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
	await page.waitForTimeout(1200)
	await page.evaluate(() => window.scrollTo(0, 0))
	await page.waitForTimeout(400)

	const report = await page.evaluate((order) => {
		const found = order.map((sel) => {
			const el = document.querySelector(sel)
			return el ? { sel, top: Math.round(el.getBoundingClientRect().top + window.scrollY) } : { sel, top: null }
		})
		const de = document.documentElement
		const overflowing = [...document.querySelectorAll('body *')]
			.filter((el) => {
				const r = el.getBoundingClientRect()
				return r.width > 0 && (r.right > de.clientWidth + 1 || r.left < -1)
			})
			.slice(0, 6)
			.map((el) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} right=${Math.round(el.getBoundingClientRect().right)}`)
		return {
			sections: found,
			pageHeight: Math.round(de.scrollHeight),
			docScrollWidth: de.scrollWidth,
			clientWidth: de.clientWidth,
			overflowing
		}
	}, ORDER)

	const missing = report.sections.filter((s) => s.top === null).map((s) => s.sel)
	const tops = report.sections.filter((s) => s.top !== null)
	const outOfOrder = tops.filter((s, i) => i > 0 && s.top < tops[i - 1].top).map((s) => s.sel)

	console.log(`\n### ${vp.key} ${vp.width}`)
	console.log(`   page height        ${report.pageHeight}`)
	console.log(`   horizontal scroll  ${report.docScrollWidth > report.clientWidth ? `YES (${report.docScrollWidth} > ${report.clientWidth})` : 'none'}`)
	console.log(`   sections found     ${tops.length}/${ORDER.length}`)
	if (missing.length) console.log(`   MISSING            ${missing.join(', ')}`)
	if (outOfOrder.length) console.log(`   OUT OF ORDER       ${outOfOrder.join(', ')}`)
	if (report.overflowing.length) console.log(`   overflowing        ${report.overflowing.join(' | ')}`)
	const real = errors.filter((e) => !/wishlist|422|Unprocessable/i.test(e))
	console.log(`   console errors     ${real.length ? JSON.stringify(real.slice(0, 4)) : 'none (wishlist 422 filtered)'}`)
	await page.close()
}
await browser.close()
