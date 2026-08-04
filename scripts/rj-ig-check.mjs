import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const failed = []
p.on('response', r => { if (r.status() >= 400 && /instagram|ryans-jewels/.test(r.url())) failed.push(`${r.status()} ${r.url()}`) })
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 90000 })
await p.locator('.rj-ig').scrollIntoViewIfNeeded()
await p.waitForTimeout(1500)
const info = await p.evaluate(() => {
  const grid = document.querySelector('.rj-ig-grid')
  const imgs = [...document.querySelectorAll('.rj-ig-tile img')]
  return {
    gridBox: grid ? grid.getBoundingClientRect().toJSON() : null,
    imgs: imgs.map(i => ({ src: i.getAttribute('src'), natural: `${i.naturalWidth}x${i.naturalHeight}`, box: `${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)}` }))
  }
})
console.log(JSON.stringify(info, null, 2))
console.log('FAILED:', failed)
await b.close()
