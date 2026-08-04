import { chromium } from 'playwright'
const scale = Number(process.argv[2] || 0.32)
const width = Number(process.argv[3] || 1440)
const key = process.argv[4] || 'desktop'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: scale })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await page.evaluate(async () => {
	for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)) }
	window.scrollTo(0, 0)
})
await page.waitForTimeout(1500)
await page.screenshot({ path: `.rj-qa/full-${key}.png`, fullPage: true })
await browser.close()
console.log('done', key)
