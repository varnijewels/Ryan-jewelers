import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 400 }, deviceScaleFactor: 3 })
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await p.waitForTimeout(1000)
await p.locator('.rj-actions').screenshot({ path: '.rj-qa/actions.png' })
const hdr = await p.evaluate(() => {
	const q = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } }
	return { headerBlock: q('.rj-header'), rowsWrap: q('.rj-header-rows') || q('.rj-rows'), row1: q('.rj-row-primary'), row2: q('.rj-row-menu'), actions: q('.rj-actions'), brand: q('.rj-brand'), search: q('.rj-search') }
})
console.log(JSON.stringify(hdr, null, 1))
await b.close()
