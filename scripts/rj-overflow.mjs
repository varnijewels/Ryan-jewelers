import { chromium } from 'playwright'
const w = Number(process.argv[2] || 1024)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: w, height: 900 } })
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60))} window.scrollTo(0,0) })
await p.waitForTimeout(900)
const out = await p.evaluate(() => {
	const vw = document.documentElement.clientWidth
	const bad = []
	for (const el of document.querySelectorAll('body *')) {
		const r = el.getBoundingClientRect()
		if (r.width === 0) continue
		if (r.right <= vw + 1) continue
		// ignore anything inside a deliberate horizontal scroller
		let n = el.parentElement, inScroller = false
		while (n && n !== document.body) {
			const o = getComputedStyle(n).overflowX
			if (o === 'auto' || o === 'scroll' || o === 'hidden') { inScroller = true; break }
			n = n.parentElement
		}
		if (inScroller) continue
		bad.push({ tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().split(' ').slice(0,2).join('.'), right: Math.round(r.right), width: Math.round(r.width) })
	}
	return { vw, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 12) }
})
console.log(JSON.stringify(out, null, 1))
await b.close()
