import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 500 } })
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await p.waitForTimeout(1000)
const out = await p.evaluate(() => {
	const group = document.querySelector('.rj-actions')
	if (!group) return { error: 'no .rj-actions' }
	const g = group.getBoundingClientRect()
	const rel = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: +(r.x - g.x).toFixed(1), y: +(r.y - g.y).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } }
	const walk = (root, depth = 0, out = []) => {
		for (const el of root.children) {
			const cls = (el.className || '').toString().split(' ').filter(c => c.startsWith('rj-')).join('.')
			out.push({ d: depth, tag: el.tagName.toLowerCase(), cls, ...rel(el), text: (el.children.length ? '' : (el.textContent||'').trim().slice(0,22)) })
			if (depth < 4) walk(el, depth + 1, out)
		}
		return out
	}
	return { group: { w: +g.width.toFixed(1), h: +g.height.toFixed(1) }, tree: walk(group) }
})
if (out.error) console.log(out.error)
else {
	console.log('GROUP', JSON.stringify(out.group))
	for (const n of out.tree) console.log(' '.repeat(n.d*2) + `${n.cls||n.tag}`.padEnd(30) + `x${String(n.x).padStart(6)} y${String(n.y).padStart(6)} ${String(n.w).padStart(6)}x${String(n.h).padStart(5)}  ${n.text}`)
}
await b.close()
