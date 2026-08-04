import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 60000 })
const out = await p.evaluate(async () => {
  await document.fonts.ready
  const fams = new Set()
  document.fonts.forEach(f => fams.add(`${f.family}|${f.weight}|${f.status}`))
  const el = document.querySelector('.rj-plate-title')
  const cs = el ? getComputedStyle(el) : null
  const links = [...document.querySelectorAll('link[rel=stylesheet],link[rel=preload]')].map(l => l.href).filter(h => h.includes('font'))
  return {
    loadedFamilies: [...fams].sort(),
    titleFont: cs?.fontFamily,
    redRoseCheck: document.fonts.check('32px "Red Rose"'),
    rozhaCheck: document.fonts.check('30px "Rozha One"'),
    saralaCheck: document.fonts.check('16px "Sarala"'),
    fontLinks: links
  }
})
console.log(JSON.stringify(out, null, 2))
await b.close()
