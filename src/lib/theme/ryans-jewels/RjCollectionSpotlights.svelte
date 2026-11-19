<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte'

	const collections = [
		{
			title: 'Engagement Rings',
			eyebrow: 'A promise, beautifully made',
			caption: 'Find the ring for your forever.',
			image: '/ryans-jewels/home/spotlights/studio-engagement-rings-v1.webp',
			alt: 'A solitaire diamond engagement ring on an ivory stone display',
			position: '50% 50%',
			href: '/products?categories=engagement'
		},
		{
			title: 'Diamond Earrings',
			eyebrow: 'Everyday brilliance',
			caption: 'A little sparkle. Entirely you.',
			image: '/ryans-jewels/home/spotlights/studio-diamond-earrings-v1.webp',
			alt: 'A pair of round diamond stud earrings on an ivory stone display',
			position: '50% 50%',
			href: '/products?categories=women'
		},
		{
			title: 'Diamond Jewelry',
			eyebrow: 'For every chapter',
			caption: 'The finishing touch to your story.',
			image: '/ryans-jewels/home/spotlights/studio-diamond-jewelry-v1.webp',
			alt: 'A rose-gold diamond halo pendant and fine chain on an ivory stone display',
			position: '50% 50%',
			href: '/products'
		}
	]
</script>

<section class="rj-collection-spotlights" aria-labelledby="rj-collection-spotlights-heading">
	<h2 class="sr-only" id="rj-collection-spotlights-heading">Discover our diamond jewelry collections</h2>
	<div class="spotlight-grid">
		{#each collections as collection (collection.title)}
			<a class="spotlight-card" href={collection.href} aria-label="Shop {collection.title}">
				<img src={collection.image} alt={collection.alt} loading="lazy" decoding="async" style="object-position: {collection.position}" />
				<div class="spotlight-copy">
					<p class="spotlight-eyebrow">{collection.eyebrow}</p>
					<h3>{collection.title}</h3>
					<span class="spotlight-cta">Shop Now <ArrowUpRight size={15} aria-hidden="true" /></span>
					<p class="spotlight-caption">{collection.caption}</p>
				</div>
			</a>
		{/each}
	</div>
</section>

<style>
	.rj-collection-spotlights { padding: 0 40px 55px; background: #fff; }
	.spotlight-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
	.spotlight-card { position: relative; display: block; min-width: 0; height: clamp(450px, 40vw, 760px); overflow: hidden; background: #eee8dc; color: #fff; text-decoration: none; }
	.spotlight-card > img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 700ms cubic-bezier(.2, .65, .3, 1); }
	.spotlight-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, #14110e00 28%, #14110e12 45%, #14110ec9 100%); pointer-events: none; }
	.spotlight-copy { position: absolute; z-index: 1; right: 30px; bottom: 34px; left: 30px; }
	.spotlight-eyebrow { margin: 0 0 15px; color: #f0ddaf; font: 400 10px/1.6 var(--font-body, sans-serif); letter-spacing: .13em; text-transform: uppercase; }
	h3 { margin: 0 0 24px; color: #fff; font: 400 clamp(27px, 2.2vw, 39px)/1.16 'Libre Baskerville', var(--font-heading, serif); letter-spacing: -.035em; }
	.spotlight-copy h3 { font-family: 'Libre Baskerville', Georgia, serif !important; }
	.spotlight-cta { display: inline-flex; min-height: 42px; align-items: center; justify-content: center; gap: 18px; padding: 11px 20px; border: 1px solid #f5ecd9; border-radius: 99px; background: #faf6ea; color: #3b3020; font: 500 12px/1.4 var(--font-body, sans-serif); transition: color .2s, background .2s, border-color .2s; }
	.spotlight-caption { margin: 25px 0 0; color: #f2eee5; font: 400 11px/1.7 var(--font-body, sans-serif); }
	.spotlight-card:hover > img { transform: scale(1.035); }
	.spotlight-card:hover .spotlight-cta { border-color: #cca646; background: #cca646; color: #2f2514; }
	.spotlight-card:focus-visible { outline: 2px solid #8b6b29; outline-offset: 5px; }
	@media (max-width: 1100px) { .spotlight-grid { gap: 16px; }.spotlight-copy { right: 20px; bottom: 26px; left: 20px; }.spotlight-eyebrow { font-size: 9px; letter-spacing: .09em; }h3 { font-size: 27px; }.spotlight-caption { max-width: 190px; } }
	@media (max-width: 767px) { .rj-collection-spotlights { padding-inline: 24px; padding-bottom: 35px; }.spotlight-grid { grid-template-columns: 1fr; gap: 20px; }.spotlight-card { height: clamp(440px, 115vw, 650px); }.spotlight-copy { right: 26px; bottom: 30px; left: 26px; }h3 { font-size: 30px; }.spotlight-eyebrow { font-size: 10px; }.spotlight-caption { max-width: none; } }
	@media (prefers-reduced-motion: reduce) { .spotlight-card > img, .spotlight-cta { transition: none; } }
</style>
