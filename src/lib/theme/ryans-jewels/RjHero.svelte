<script lang="ts">
 import { catalogNavigation } from './catalog-navigation.js'
 const model = '/ryans-jewels/home/campaign/solitaire-stud-closeup-v3'
 const ring = '/ryans-jewels/home/campaign/oval-halo-hand-v1'
 const earringsHref = catalogNavigation.find((category) => category.name === 'Earrings')!.href
 const ringsHref = catalogNavigation.find((category) => category.name === 'Rings')!.href
</script>
<svelte:head>
 <link rel="preload" as="image" type="image/avif" href={`${model}.avif`} fetchpriority="high" />
</svelte:head>
<section class="rj-hero" aria-label="Discover diamond earrings and rings">
 <article class="rj-hero-panel rj-hero-panel--studs">
  <picture><source type="image/avif" srcset={`${model}.avif`} /><img src={`${model}.webp`} alt="Close-up of a white gold solitaire diamond stud worn on the ear" width="1100" height="1100" fetchpriority="high" /></picture>
  <div class="rj-hero-copy"><p class="rj-hero-eyebrow">Everyday diamonds</p><h1>A little brilliance.</h1><a href={earringsHref}>Shop diamond studs <span aria-hidden="true">&nearr;</span></a></div>
 </article>
 <article class="rj-hero-panel rj-hero-panel--ring">
  <picture><source type="image/avif" srcset={`${ring}.avif`} /><img src={`${ring}.webp`} alt="Oval halo diamond ring in white gold, worn on the hand" width="1100" height="1375" loading="eager" /></picture>
  <div class="rj-hero-copy"><p class="rj-hero-eyebrow">The ring collection</p><h2>For your forever.</h2><a href={ringsHref}>Explore halo rings <span aria-hidden="true">&nearr;</span></a></div>
 </article>
</section>
<style>
 .rj-hero { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px; background: #fff; color: #29251e; }
 .rj-hero-panel { position: relative; min-width: 0; height: clamp(450px, 42vw, 650px); overflow: hidden; background: #f2ede4; }
 picture, img { display: block; width: 100%; height: 100%; }
 img { object-fit: cover; }
 .rj-hero-panel--studs img { object-position: 50% 28%; }
 .rj-hero-panel--ring img { object-position: 50% 45%; }
 .rj-hero-panel::after { content: ''; position: absolute; inset: 42% 0 0; background: linear-gradient(transparent, rgb(249 244 234 / 94%)); pointer-events: none; }
 .rj-hero-copy { position: absolute; z-index: 1; bottom: 34px; left: 7%; right: 7%; }
 .rj-hero-eyebrow { margin: 0 0 12px; font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; }
 h1, h2 { margin: 0 0 21px; font: 400 clamp(29px, 3vw, 46px)/1.1 var(--font-heading, serif); }
 a { display: inline-flex; align-items: center; gap: 24px; padding: 12px 20px; background: #ac8735; color: #fff; font-size: 13px; text-decoration: none; }
 a:hover { background: #8b6b29; }
 a:focus-visible { outline: 2px solid #8b6b29; outline-offset: 4px; }
 @media (max-width: 639px) {
  .rj-hero { grid-template-columns: 1fr; gap: 2px; }
  .rj-hero-panel { height: auto; }
  picture { height: auto; aspect-ratio: 1.35; }
  .rj-hero-panel--ring img { object-position: 50% 36%; }
  .rj-hero-panel::after { display: none; }
  .rj-hero-copy { position: static; padding: 20px 22px 24px; }
  .rj-hero-eyebrow { font-size: 10px; margin-bottom: 9px; }
  h1, h2 { font-size: 29px; margin-bottom: 16px; }
 }
</style>
