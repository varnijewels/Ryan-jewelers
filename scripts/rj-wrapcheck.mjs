import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle', timeout: 60000 })
const out = await p.evaluate(async () => {
  await document.fonts.ready
  const el = document.querySelector('.rj-plate-title')
  if (!el) return { error: 'no .rj-plate-title' }
  const cs = getComputedStyle(el)
  const r = new Range()
  r.selectNodeContents(el)
  const rects = [...r.getClientRects()].map(x => ({ w: +x.width.toFixed(1), t: +x.top.toFixed(1) }))
  return {
    box: { w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height },
    lineRects: rects,
    props: {
      width: cs.width, boxSizing: cs.boxSizing, padding: cs.padding,
      letterSpacing: cs.letterSpacing, wordSpacing: cs.wordSpacing,
      textWrap: cs.textWrap || cs.getPropertyValue('text-wrap'),
      textWrapStyle: cs.getPropertyValue('text-wrap-style'),
      wordBreak: cs.wordBreak, overflowWrap: cs.overflowWrap,
      fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontStretch: cs.fontStretch
    }
  }
})
console.log(JSON.stringify(out, null, 2))
await b.close()
