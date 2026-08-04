import { chromium } from 'playwright'
const [startSel, endSel, name, w] = process.argv.slice(2)
const width = Number(w || 1440)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,70))} window.scrollTo(0,0) })
await p.waitForTimeout(1200)
const clip = await p.evaluate(([s, e]) => {
	const a = document.querySelector(s).getBoundingClientRect()
	const z = document.querySelector(e).getBoundingClientRect()
	const top = a.top + window.scrollY
	return { x: 0, y: top, width: document.documentElement.clientWidth, height: (z.bottom + window.scrollY) - top }
}, [startSel, endSel])
await p.screenshot({ path: `.rj-qa/${name}.png`, clip, fullPage: true })
await b.close()
console.log('ok', name, JSON.stringify(clip))
