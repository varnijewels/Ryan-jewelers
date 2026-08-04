import { chromium } from 'playwright'
const TARGETS = [
	['Nav wordmark', '.rj-brand-name'],
	['Rule heading (s4/s13)', '.rj-rule-title'],
	['s7 heading', '.rj-passion-heading'],
	['s7 body', '.rj-passion-lead'],
	['s8 eyebrow', '.rj-head-eyebrow'],
	['s8 title', '.rj-head-title'],
	['s9 panel title', '.rj-plate-title'],
	['s9 lede', '.rj-plate-lede'],
	['s11 title', '.rj-look-title'],
	['s12 heading', '.rj-banner-heading'],
	['s14 title', '.rj-enq-title'],
	['s15 heading', '.rj-faq-heading'],
	['s16 ig heading', '.rj-ig-heading'],
	['footer USP title', '.rj-foot-usp-title'],
	['footer brand', '.rj-foot-brand-name'],
	['footer nav title', '.rj-foot-nav-title'],
	['footer link', '.rj-foot-link']
]
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=800){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60))} window.scrollTo(0,0) })
await p.waitForTimeout(1000)
const out = await p.evaluate(async (targets) => {
	await document.fonts.ready
	const families = ['Rozha One', 'Sarala', 'Inria Serif', 'Red Rose', 'Afacad', 'Inter']
	return {
		loaded: Object.fromEntries(families.map(f => [f, document.fonts.check(`20px "${f}"`)])),
		applied: targets.map(([label, sel]) => {
			const el = document.querySelector(sel)
			if (!el) return { label, missing: true }
			const cs = getComputedStyle(el)
			return { label, family: cs.fontFamily.split(',')[0].replace(/"/g, ''), size: cs.fontSize, weight: cs.fontWeight }
		})
	}
}, TARGETS)
console.log('FONTS LOADED:', JSON.stringify(out.loaded))
console.log('\nAPPLIED:')
for (const a of out.applied) console.log(a.missing ? `  ${a.label}: NOT FOUND` : `  ${a.label.padEnd(24)} ${a.family.padEnd(13)} ${a.size.padEnd(6)} w${a.weight}`)
await b.close()
