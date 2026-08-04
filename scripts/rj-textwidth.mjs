import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 60000 })
const out = await p.evaluate(async () => {
  await document.fonts.ready
  const mk = (txt, font) => {
    const s = document.createElement('span')
    s.style.cssText = `position:absolute;white-space:nowrap;visibility:hidden;text-transform:capitalize;font:${font}`
    s.textContent = txt
    document.body.appendChild(s)
    const w = s.getBoundingClientRect().width
    s.remove()
    return Math.round(w * 100) / 100
  }
  return {
    full32: mk('Create your personalised name Plate!', '400 32px "Red Rose"'),
    line1_32: mk('Create your personalised', '400 32px "Red Rose"'),
    line2_32: mk('name Plate!', '400 32px "Red Rose"'),
    altA: mk('Create your personalised name', '400 32px "Red Rose"'),
    full17: mk('Create your personalised name Plate!', '400 17px "Red Rose"'),
    line1_17: mk('Create your personalised', '400 17px "Red Rose"'),
    full11: mk('Create your personalised name Plate!', '400 11px "Red Rose"'),
    line1_11: mk('Create your personalised', '400 11px "Red Rose"'),
    lede22: mk('Create a one-of-a -kind piece.', '400 22px "Red Rose"')
  }
})
console.log(JSON.stringify(out, null, 2))
await b.close()
