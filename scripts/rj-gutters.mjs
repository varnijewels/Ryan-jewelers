/** Report the left/right gutter and content width of every homepage section. */
import { chromium } from 'playwright'

const SECTIONS = [
	['Header utility bar', '.rj-util-inner, .rj-nav-util-inner, header .rj-util'],
	['Header row', '.rj-head-row, .rj-nav-inner, .rj-brand-mark'],
	['3 Trust row', '.rj-band--trust .rj-band-inner'],
	['4 Perfect cut', '.rj-band--cut'],
	['5 Featured products', '.rj-band--products .rj-band-inner'],
	['7 Rare passion', '.rj-passion-inner'],
	['8 Best sellers head', '.rj-bestsellers-head'],
	['8 Best sellers rail', '.rj-carousel-rail'],
	['9 Name plate', '.rj-plate-inner'],
	['9 Name plate collection', '.rj-plate-collection'],
	['11 Lookbook head', '.rj-look-head'],
	['11 Lookbook track', '.rj-look-inner .rj-carousel-track'],
	['12 Wide banner card', '.rj-banner-card'],
	['13 Trending head', '.rj-trend-head'],
	['13 Trending track', '.rj-trend-track'],
	['14 Enquiry', '.rj-enq-inner'],
	['15 FAQ', '.rj-faq-inner'],
	['16a Instagram', '.rj-ig-inner'],
	['16b Footer body', '.rj-foot-inner'],
	['16b Legal bar', '.rj-foot-legal-inner']
]

const VIEWPORTS = (process.env.RJ_WIDTHS || '1440,744,412')
	.split(',')
	.map((w) => ({ key: `w${w.trim()}`, width: Number(w.trim()) }))

const browser = await chromium.launch()
for (const vp of VIEWPORTS) {
	const page = await browser.newPage({ viewport: { width: vp.width, height: 900 } })
	await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 90000 })
	await page.evaluate(async () => {
		for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) }
		window.scrollTo(0, 0)
	})
	await page.waitForTimeout(800)

	const rows = await page.evaluate((sections) => {
		const vw = document.documentElement.clientWidth
		return sections.map(([label, sel]) => {
			const el = document.querySelector(sel)
			if (!el) return { label, missing: true }
			const r = el.getBoundingClientRect()
			const cs = getComputedStyle(el)
			const padL = parseFloat(cs.paddingLeft) || 0
			const padR = parseFloat(cs.paddingRight) || 0
			return {
				label,
				left: Math.round((r.left + padL) * 10) / 10,
				right: Math.round((vw - r.right + padR) * 10) / 10,
				content: Math.round((r.width - padL - padR) * 10) / 10,
				box: Math.round(r.width * 10) / 10
			}
		})
	}, SECTIONS)

	console.log(`\n### ${vp.key} — viewport ${vp.width}`)
	console.log('   ' + 'section'.padEnd(26) + 'gutter-L  gutter-R  content')
	for (const r of rows) {
		if (r.missing) { console.log(`   ${r.label.padEnd(26)}(not found)`); continue }
		console.log(`   ${r.label.padEnd(26)}${String(r.left).padEnd(10)}${String(r.right).padEnd(10)}${r.content}`)
	}
	await page.close()
}
await browser.close()
