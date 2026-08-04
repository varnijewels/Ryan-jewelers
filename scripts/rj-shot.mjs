/**
 * Screenshot + measure one ryans-jewels homepage section at all three source
 * breakpoints. Element-shots are used because the header is sticky.
 *
 *   node scripts/rj-shot.mjs <css-selector> <out-name> [measure-json]
 *
 * `measure-json` is an optional JSON array of {label, sel, props[]} describing
 * computed styles / box sizes to print alongside the shots.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const [sel, name, measureRaw] = process.argv.slice(2)
if (!sel || !name) {
	console.error('usage: node scripts/rj-shot.mjs <selector> <out-name> [measure-json]')
	process.exit(1)
}
const measure = measureRaw ? JSON.parse(measureRaw) : []
const OUT = process.env.RJ_QA_OUT || '.rj-qa'
mkdirSync(OUT, { recursive: true })

const VIEWPORTS = [
	{ key: 'desktop', width: 1440, height: 900 },
	{ key: 'tablet', width: 744, height: 1000 },
	{ key: 'mobile', width: 412, height: 900 }
]

const browser = await chromium.launch()
for (const vp of VIEWPORTS) {
	const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
	const errors = []
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
	page.on('pageerror', (e) => errors.push(String(e)))
	await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 60000 })
	const el = page.locator(sel).first()
	const count = await page.locator(sel).count()
	if (!count) {
		console.log(`\n### ${vp.key} ${vp.width} — SELECTOR NOT FOUND: ${sel}`)
		await page.close()
		continue
	}
	await el.scrollIntoViewIfNeeded()
	await page.waitForTimeout(400)
	await el.screenshot({ path: `${OUT}/${name}-${vp.key}.png` })

	const box = await el.boundingBox()
	console.log(`\n### ${vp.key} ${vp.width} — ${sel}`)
	console.log(`   box: ${JSON.stringify(box)}`)

	for (const m of measure) {
		const info = await page.evaluate(
			({ s, props }) => {
				const nodes = [...document.querySelectorAll(s)]
				if (!nodes.length) return null
				const n = nodes[0]
				const cs = getComputedStyle(n)
				const r = n.getBoundingClientRect()
				const out = { n: nodes.length, w: +r.width.toFixed(2), h: +r.height.toFixed(2) }
				for (const p of props) out[p] = cs.getPropertyValue(p)
				return out
			},
			{ s: m.sel, props: m.props || [] }
		)
		console.log(`   ${m.label.padEnd(18)} ${JSON.stringify(info)}`)
	}
	if (errors.length) console.log(`   !! console errors: ${JSON.stringify(errors.slice(0, 5))}`)
	await page.close()
}
await browser.close()
console.log(`\nshots written to ${OUT}/${name}-*.png`)
