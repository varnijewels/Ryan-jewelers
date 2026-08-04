import { chromium } from 'playwright'
const widths = (process.env.RJ_WIDTHS || '1440,1920').split(',').map(Number)
const T = [
	['s5 card', '.rj-band--products .rj-card'],
	['s5 media', '.rj-band--products .rj-card-media'],
	['s5 info', '.rj-band--products .rj-card-info'],
	['s8 tile', '.rj-bestsellers .rj-tile'],
	['s11 tile', '.rj-look-cell .rj-tile'],
	['s11 figure', '.rj-look-figure'],
	['s13 card', '.rj-trend .rj-card'],
	['s13 media', '.rj-trend .rj-card-media'],
	['s16 ig tile', '.rj-ig-tile']
]
const b = await chromium.launch()
for (const w of widths) {
	const p = await b.newPage({ viewport: { width: w, height: 900 } })
	await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 90000 })
	await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60))} window.scrollTo(0,0) })
	await p.waitForTimeout(900)
	const rows = await p.evaluate((t) => t.map(([label, sel]) => {
		const els = [...document.querySelectorAll(sel)]
		if (!els.length) return `${label}: NOT FOUND`
		const r = els[0].getBoundingClientRect()
		return `${label.padEnd(14)} n=${String(els.length).padEnd(3)} ${Math.round(r.width)}x${Math.round(r.height)}`
	}), T)
	console.log(`\n### ${w}`)
	rows.forEach(r => console.log('   ' + r))
	await p.close()
}
await b.close()
