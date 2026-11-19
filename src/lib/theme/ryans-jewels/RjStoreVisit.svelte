<script lang="ts">
	import { ryanContact } from './contact-content.js'
</script>

<section class="rj-store-visit" aria-labelledby="rj-store-visit-heading">
	<img class="store-visit-photo" src="/ryans-jewels/store/salisbury-storefront-wide-v1.webp" alt="Ryan Jewelers storefront and jewelry displays at The Centre at Salisbury" width="2400" height="1800" loading="lazy" decoding="async" />
	<img class="store-visit-logo" src="/ryans-jewels/logo.webp" alt="Ryan Jewelers logo" width="512" height="512" loading="lazy" decoding="async" />
	<div class="store-visit-copy">
		<p class="store-visit-eyebrow">{ryanContact.location}</p>
		<h2 id="rj-store-visit-heading">Visit Ryan Jewelers</h2>
		<p class="store-visit-description">See your favorite pieces in person. Visit our Salisbury store for a closer look and personal guidance from our jewelry team.</p>
		<div class="store-visit-actions">
			<a href={ryanContact.directionsHref} target="_blank" rel="noopener noreferrer">Find Our Store</a>
			<a class="store-visit-secondary" href="/contact-us">Plan Your Visit</a>
		</div>
	</div>
</section>

<style>
	.rj-store-visit { position: relative; display: grid; align-items: end; width: 100%; height: clamp(560px, 48vw, 920px); margin: 0 0 45px; overflow: hidden; background: #29251e; color: #fff; text-align: center; }
	.store-visit-photo { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 48%; }
	.rj-store-visit::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, #17120b00 25%, #17120b12 47%, #17120bd9 100%); }
	.store-visit-copy { position: relative; z-index: 1; width: 100%; max-width: 660px; margin: 0 auto; padding: 100px 24px 55px; }
	.store-visit-logo { position: absolute; z-index: 2; top: 32px; left: 40px; display: block; width: 132px; height: 86px; object-fit: cover; object-position: 50% 45%; filter: drop-shadow(0 2px 6px #0006); }
	.store-visit-eyebrow { margin: 0 0 16px; color: #f1dcaa; font-size: 10px; line-height: 1.6; letter-spacing: .18em; text-transform: uppercase; }
	#rj-store-visit-heading { margin: 0 0 18px; color: #fff; font: 400 clamp(34px, 3.2vw, 52px)/1.15 var(--font-heading, Georgia, serif); letter-spacing: -.035em; }
	.store-visit-description { max-width: 480px; margin: 0 auto 26px; color: #f9f6ef; font-size: 15px; line-height: 1.7; }
	.store-visit-actions { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 12px; }
	.store-visit-actions a { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; padding: 12px 23px; border: 1px solid var(--rj-cream, #faf6ea); border-radius: 99px; background: var(--rj-cream, #faf6ea); color: #332b1e; font-size: 12px; line-height: 1.5; text-decoration: none; transition: background-color 200ms, border-color 200ms, color 200ms; }
	.store-visit-actions .store-visit-secondary { background: #fff1; color: #fff; }
	.store-visit-actions a:hover { border-color: var(--rj-gold, #cca646); background: var(--rj-gold, #cca646); color: #2d2515; }
	.store-visit-actions a:focus-visible { outline: 2px solid #fff; outline-offset: 5px; }
	@media (max-width: 639px) { .rj-store-visit { height: 620px; margin-bottom: 28px; }.store-visit-photo { object-position: 70% 45%; }.store-visit-logo { top: 20px; left: 24px; width: 110px; height: 72px; }.store-visit-copy { padding: 90px 24px 36px; }.store-visit-description { max-width: 340px; font-size: 14px; }.store-visit-actions { gap: 10px; }.store-visit-actions a { padding-inline: 18px; } }
	@media (prefers-reduced-motion: reduce) { .store-visit-actions a { transition: none; } }
</style>
