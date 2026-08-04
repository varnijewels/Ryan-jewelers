import { chromium } from 'playwright'
const b = await chromium.launch()
for (const w of (process.env.RJ_WIDTHS || '1920,1440').split(',').map(Number)) {
	const p = await b.newPage({ viewport: { width: w, height: 400 } })
	await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 90000 })
	await p.waitForTimeout(900)
	const m = await p.evaluate(() => {
		const q = (s) => document.querySelector(s)
		const box = (s) => { const e = q(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) } }
		return {
			utilityInner: box('.rj-utility-inner'),
			headerInner: box('.rj-header-inner') || box('.rj-row-primary')?.parentElement,
			search: box('.rj-search'),
			rowPrimary: box('.rj-row-primary')
		}
	})
	console.log(`### ${w}`, JSON.stringify(m))
	await p.screenshot({ path: `.rj-qa/header-${w}.png`, clip: { x: 0, y: 0, width: w, height: 215 } })
	await p.close()
}
await b.close()
