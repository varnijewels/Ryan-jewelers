<script lang="ts">
 import { ArrowUpRight, Phone } from '@lucide/svelte'
 import { ryanContact as store } from './contact-content.js'
</script>
<section class="rj-store" aria-labelledby="rj-store-heading">
 <div class="store-gallery"><div class="store-photo"><img src="/ryans-jewels/store/storefront.webp" alt="Ryan Jewelers storefront at The Centre at Salisbury" width="816" height="1020" loading="lazy" /><span>SALISBURY, MARYLAND</span></div>
 <div class="store-thumbnails"><img src="/ryans-jewels/store/store-exterior.webp" alt="Ryan Jewelers shop entrance and display windows" width="700" height="525" loading="lazy" /><img src="/ryans-jewels/store/store-interior.webp" alt="Jewelry showcases inside the Ryan Jewelers store" width="700" height="560" loading="lazy" /></div></div>
 <div class="store-copy"><p class="eyebrow">COME SAY HELLO</p><h2 id="rj-store-heading">Visit us in Salisbury</h2><p class="intro">See the sparkle in person. Explore your favorites and find a piece that feels right for you at our Salisbury store.</p>
 <div class="store-details"><div><h3>Visit Ryan Jewelers</h3><p>{store.location}</p><address>{store.address}<br />{store.city}</address><a class="phone" href={store.phoneHref}><Phone size={15} />{store.phone}</a></div><div><h3>Opening hours</h3><dl>{#each store.hours as hours}<div><dt>{hours.days}</dt><dd>{hours.time}</dd></div>{/each}</dl><p class="hours-note">{store.hoursNote}</p></div></div>
 <div class="store-links"><a class="directions" href={store.directionsHref} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={18} /></a><a href="/contact-us">Contact our store <ArrowUpRight size={16} /></a></div>
 </div>
</section>
<style>
 .rj-store { max-width: 1440px; margin: 30px auto 60px; padding: 0 48px; display: grid; grid-template-columns: .85fr 1.15fr; color: #353535; }
 .store-photo { position: relative; min-height: 490px; overflow: hidden; }
 .store-photo img { width: 100%; height: 100%; position: absolute; object-fit: cover; object-position: center 55%; }
 .store-photo > span { position: absolute; bottom: 22px; left: 24px; color: #fff; font-size: 10px; letter-spacing: 2px; background: #2229; padding: 10px 12px; }
 .store-copy { padding: 44px 42px; background: #f8f7f3; }
 .eyebrow { color: #9c803d; font-size: 11px; letter-spacing: 2px; margin: 0 0 18px; }
 h2 { font: 46px/1.05 'Libre Baskerville', serif; margin: 0 0 18px; }
 .intro { max-width: 470px; color: #747474; font-size: 13px; line-height: 1.8; margin: 0 0 26px; }
 .store-details { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; border-top: 1px solid #e4dfd5; padding-top: 22px; }
 h3 { font-size: 13px; font-weight: 500; margin: 0 0 12px; }
 .store-details p, address, dl { font-size: 11px; line-height: 1.8; color: #777; margin: 0; font-style: normal; }
 dl > div { display: flex; flex-wrap: wrap; column-gap: 8px; justify-content: space-between; }
 dd { margin: 0; white-space: nowrap; }
 .store-details .hours-note { font-size: 10px; margin-top: 7px; }
 a { display: inline-flex; align-items: center; gap: 9px; color: #454545; text-decoration: none; font-size: 12px; }
 a.phone { margin-top: 12px; }
 .store-links { display: flex; align-items: center; flex-wrap: wrap; gap: 24px; margin-top: 28px; }
 .directions { background: var(--rj-gold, #cca646); color: white; padding: 14px 20px; }
 a:hover { text-decoration: underline; }
 a:focus-visible { outline: 2px solid var(--rj-gold); outline-offset: 4px; }
 @media (max-width: 1000px) { .rj-store { padding: 0 25px; grid-template-columns: .8fr 1.2fr; } .store-copy { padding: 30px 25px; } .store-details { grid-template-columns: 1fr; gap: 18px; } h2 { font-size: 38px; } }
 @media (max-width: 639px) { .rj-store { padding: 0 16px; grid-template-columns: 1fr; margin-bottom: 35px; } .store-photo { min-height: 320px; } .store-photo img { object-position: center 48%; } .store-copy { padding: 30px 24px; } .store-details { grid-template-columns: 1fr; } }
 .store-gallery { display: grid; grid-template-rows: 1fr 150px; gap: 8px; min-width: 0; }
 .store-gallery .store-photo { min-height: 330px; }
 .store-thumbnails { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; min-height: 0; }
 .store-thumbnails img { width: 100%; height: 100%; object-fit: cover; min-width: 0; }
 @media (max-width: 639px) { .store-gallery { grid-template-rows: 310px 125px; } .store-gallery .store-photo { min-height: 0; } }
</style>
