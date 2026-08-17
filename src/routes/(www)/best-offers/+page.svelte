<script lang="ts">
	import RjCarouselCard from '$lib/theme/ryans-jewels/RjCarouselCard.svelte'
	import RjInstagram from '$lib/theme/ryans-jewels/RjInstagram.svelte'
	import { SeoHeader } from '$lib/core/components/index.js'

	let { data } = $props()
	const products = $derived((data?.offerProducts || []).slice(0, 8))

	const collections = [
		{ eyebrow: 'A Promise of Forever', title: 'Engagement Rings', text: 'Brilliant designs for the moment that changes everything.', href: '/products?search=engagement%20rings', image: '/ryans-jewels/home/nameplate-card-1.webp' },
		{ eyebrow: 'Everyday Brilliance', title: 'Diamond Essentials', text: 'Refined pieces made to bring light to every day.', href: '/products?search=diamond', image: '/ryans-jewels/home/nameplate-card-2.webp' },
		{ eyebrow: 'Made to Remember', title: 'Gifts With Meaning', text: 'Thoughtful jewelry for milestones, celebrations and just because.', href: '/products?search=gifts', image: '/ryans-jewels/home/nameplate-card-3.webp' }
	]
</script>

<SeoHeader
	metaTitle="Best Jewelry Offers | Ryan Jewelers"
	metaDescription="Explore current Ryan Jewelers offers on diamond rings, earrings, necklaces and meaningful gifts."
/>

<main class="rj-offers">
	<section class="rj-offers-hero" aria-labelledby="rj-offers-title">
		<div class="rj-offers-hero-copy">
			<p>Exclusive Ryan Jewelers Edit</p>
			<h1 id="rj-offers-title">A little more brilliance,<br /><em>for less.</em></h1>
			<span>Discover special prices across a considered selection of timeless diamond jewelry.</span>
			<div class="rj-offers-actions">
				<a href="#offer-edit">Shop the offer edit <span aria-hidden="true">→</span></a>
				<a href="/products?sort=discount">View all jewelry</a>
			</div>
		</div>
		<div class="rj-offers-hero-art" aria-hidden="true">
			<span>Special<br />Prices</span>
			<img src="/ryans-jewels/home/banner-model.png" alt="" />
		</div>
	</section>

	<section class="rj-offers-promises" aria-label="Offer shopping assurances">
		<p><span>01</span><b>Authentic Quality</b><small>Selected with care</small></p>
		<p><span>02</span><b>Secure Checkout</b><small>Protected payment</small></p>
		<p><span>03</span><b>Insured Delivery</b><small>Handled with care</small></p>
		<p><span>04</span><b>30-Day Returns</b><small>Eligible purchases</small></p>
	</section>

	<section class="rj-offers-edit" id="offer-edit" aria-labelledby="rj-offers-edit-title">
		<header>
			<div>
				<p>Curated For You</p>
				<h2 id="rj-offers-edit-title">The Offer Edit</h2>
			</div>
			<a href="/products?sort=discount">View all offers <span aria-hidden="true">→</span></a>
		</header>

		{#if products.length}
			<ul class="rj-offers-grid">
				{#each products as product (product?.id || product?.slug)}
					<li><RjCarouselCard {product} /></li>
				{/each}
			</ul>
		{:else}
			<div class="rj-offers-empty">
				<img src="/ryans-jewels/icons/gift-box-3d-premium.webp" alt="" />
				<h2>New offers are being prepared.</h2>
				<p>Explore our complete collection while our next special edit arrives.</p>
				<a href="/products">Shop all jewelry</a>
			</div>
		{/if}
	</section>

	<section class="rj-offers-banner" aria-label="Limited jewelry offer">
		<div>
			<p>Ryan Jewelers Privilege</p>
			<h2>Beauty worth keeping.<br />Prices worth discovering.</h2>
			<span>Every offer uses the currently listed product price. Availability applies while pieces remain in stock.</span>
			<a href="/products?sort=discount">Discover the collection <span aria-hidden="true">→</span></a>
		</div>
		<img src="/ryans-jewels/home/hero-desktop.png" alt="Ryan Jewelers diamond ring" />
	</section>

	<section class="rj-offers-collections" aria-labelledby="rj-offers-collections-title">
		<div class="rj-offers-section-head">
			<p>Shop With Intention</p>
			<h2 id="rj-offers-collections-title">More Ways to Find Your Piece</h2>
		</div>
		<div class="rj-offers-collection-grid">
			{#each collections as collection}
				<a href={collection.href}>
					<div><img src={collection.image} alt="" /></div>
					<span>
						<small>{collection.eyebrow}</small>
						<strong>{collection.title}</strong>
						<i>{collection.text}</i>
						<b>Explore <span aria-hidden="true">→</span></b>
					</span>
				</a>
			{/each}
		</div>
	</section>

	<RjInstagram />
</main>

<style>
	.rj-offers {
		--offers-gold: var(--rj-gold, #cca646);
		--offers-ink: var(--rj-heading, #202020);
		--offers-copy: var(--rj-ink-2, #606060);
		--offers-rule: var(--rj-rule, #e1d6be);
		background: #fff;
		color: var(--offers-copy);
		font-family: 'Sarala', var(--font-body, sans-serif);
	}
	.rj-offers :global(h1), .rj-offers :global(h2), .rj-offers :global(p) { margin: 0; }
	.rj-offers :global(h1), .rj-offers :global(h2) { color: var(--offers-ink); font-family: 'Rozha One', var(--font-heading, serif); font-weight: 400; letter-spacing: normal; }

	.rj-offers-hero { position: relative; display: grid; min-height: 570px; grid-template-columns: 1.08fr .92fr; overflow: hidden; border-bottom: 1px solid var(--offers-rule); background: radial-gradient(circle at 18% 0%, rgb(204 166 70 / 18%), transparent 38%), linear-gradient(120deg, #f7f3e9 0%, #fff 55%, #f2ead8 100%); }
	.rj-offers-hero::after { position: absolute; right: 30%; top: -80px; width: 1px; height: 720px; background: rgb(204 166 70 / 22%); content: ''; transform: rotate(20deg); }
	.rj-offers-hero-copy { position: relative; z-index: 1; display: flex; max-width: 760px; flex-direction: column; align-items: flex-start; justify-content: center; padding: 84px clamp(40px, 7vw, 120px); }
	.rj-offers-hero-copy > p, .rj-offers-edit header p, .rj-offers-section-head p, .rj-offers-banner > div > p { color: #9b7a28; font-size: 13px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; }
	.rj-offers-hero h1 { margin-top: 14px; font-size: clamp(52px, 6.2vw, 88px); line-height: .98; }
	.rj-offers-hero h1 em { color: var(--offers-gold); font-style: normal; }
	.rj-offers-hero-copy > span { max-width: 570px; margin-top: 25px; font-size: 17px; line-height: 29px; }
	.rj-offers-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
	.rj-offers-actions a, .rj-offers-banner a, .rj-offers-empty a { display: inline-flex; min-height: 47px; align-items: center; justify-content: center; gap: 14px; padding: 12px 22px; border: 1px solid var(--offers-gold); color: var(--offers-ink); font-size: 14px; font-weight: 700; text-decoration: none; transition: background .18s ease, color .18s ease; }
	.rj-offers-actions a:first-child, .rj-offers-banner a { background: var(--offers-gold); color: #fff; }
	.rj-offers-actions a:hover, .rj-offers-banner a:hover, .rj-offers-empty a:hover { background: var(--offers-ink); border-color: var(--offers-ink); color: #fff; }
	.rj-offers-hero-art { position: relative; min-width: 0; overflow: hidden; }
	.rj-offers-hero-art::before { position: absolute; inset: 8% 8% 0; border: 1px solid rgb(204 166 70 / 38%); border-radius: 50% 50% 0 0; content: ''; }
	.rj-offers-hero-art img { position: absolute; right: 2%; bottom: -5%; width: min(610px, 100%); height: 108%; object-fit: contain; object-position: bottom center; filter: saturate(.9); }
	.rj-offers-hero-art > span { position: absolute; z-index: 1; right: 10%; top: 13%; display: grid; width: 104px; height: 104px; place-items: center; border: 1px solid var(--offers-gold); border-radius: 50%; background: rgb(255 255 255 / 88%); color: #8a6b22; font: 20px/21px 'Rozha One', serif; text-align: center; transform: rotate(8deg); }

	.rj-offers-promises { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--offers-rule); }
	.rj-offers-promises p { display: grid; grid-template-columns: 34px 1fr; padding: 27px 32px; border-right: 1px solid var(--offers-rule); }
	.rj-offers-promises p:last-child { border-right: 0; }
	.rj-offers-promises span { grid-row: 1 / 3; color: var(--offers-gold); font-size: 11px; }
	.rj-offers-promises b { color: var(--offers-ink); font-size: 14px; font-weight: 400; }
	.rj-offers-promises small { margin-top: 3px; color: #999; font-size: 12px; }

	.rj-offers-edit { scroll-margin-top: 24px; padding: 90px clamp(30px, 4.25vw, 62px) 110px; }
	.rj-offers-edit > header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 42px; padding-bottom: 24px; border-bottom: 1px solid var(--offers-rule); }
	.rj-offers-edit header h2, .rj-offers-section-head h2 { margin-top: 7px; font-size: clamp(38px, 4vw, 54px); line-height: 1.08; }
	.rj-offers-edit header > a { color: var(--offers-ink); font-size: 15px; text-decoration: none; }
	.rj-offers-edit header > a span { margin-left: 10px; color: var(--offers-gold); }
	.rj-offers-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 42px clamp(18px, 3vw, 44px); margin: 0; padding: 0; list-style: none; }
	.rj-offers-grid li { min-width: 0; }
	.rj-offers-grid li :global(.rj-tile) { width: 100%; }
	.rj-offers-empty { padding: 70px 25px; border: 1px solid var(--offers-rule); background: #fffdfa; text-align: center; }
	.rj-offers-empty img { width: 66px; margin: 0 auto 18px; }
	.rj-offers-empty h2 { font-size: 36px; }
	.rj-offers-empty p { margin: 8px 0 24px; }

	.rj-offers-banner { display: grid; height: clamp(360px, 24vw, 390px); grid-template-columns: 1.05fr .95fr; margin: 0 clamp(30px, 4.25vw, 62px); overflow: hidden; background: #342812; }
	.rj-offers-banner > div { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: clamp(30px, 3vw, 44px); }
	.rj-offers-banner > div > p { color: #d9b967; }
	.rj-offers-banner h2 { margin-top: 8px; color: #fff; font-size: clamp(36px, 3vw, 46px); line-height: 1.03; }
	.rj-offers-banner > div > span { max-width: 560px; margin: 12px 0 18px; color: rgb(255 255 255 / 72%); font-size: 14px; line-height: 21px; }
	.rj-offers-banner img { width: 100%; height: 100%; min-height: 0; object-fit: cover; object-position: center; }

	.rj-offers-collections { padding: 110px clamp(30px, 4.25vw, 62px); }
	.rj-offers-section-head { margin-bottom: 42px; text-align: center; }
	.rj-offers-collection-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
	.rj-offers-collection-grid > a { display: grid; grid-template-columns: 43% 57%; min-height: 260px; overflow: hidden; border: 1px solid var(--offers-rule); color: var(--offers-copy); text-decoration: none; }
	.rj-offers-collection-grid > a > div { overflow: hidden; background: #faf7f0; }
	.rj-offers-collection-grid img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
	.rj-offers-collection-grid > a:hover img { transform: scale(1.05); }
	.rj-offers-collection-grid > a > span { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: 28px 24px; }
	.rj-offers-collection-grid small { color: #9b7a28; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
	.rj-offers-collection-grid strong { margin-top: 7px; color: var(--offers-ink); font: 30px/1.1 'Rozha One', serif; }
	.rj-offers-collection-grid i { margin-top: 12px; font-size: 13px; font-style: normal; line-height: 21px; }
	.rj-offers-collection-grid b { margin-top: 20px; color: var(--offers-ink); font-size: 12px; }
	.rj-offers-collection-grid b span { margin-left: 7px; color: var(--offers-gold); }

	@media (max-width: 1100px) {
		.rj-offers-hero { min-height: 510px; }
		.rj-offers-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
		.rj-offers-grid li:nth-child(n + 7) { display: none; }
		.rj-offers-collection-grid > a { grid-template-columns: 1fr; }
		.rj-offers-collection-grid > a > div { height: 210px; }
	}

	@media (max-width: 800px) {
		.rj-offers-hero { min-height: 680px; grid-template-columns: 1fr; }
		.rj-offers-hero-copy { justify-content: flex-start; padding: 60px 40px 280px; }
		.rj-offers-hero-art { position: absolute; right: 0; bottom: 0; width: 60%; height: 390px; }
		.rj-offers-promises { grid-template-columns: repeat(2, 1fr); }
		.rj-offers-promises p:nth-child(2) { border-right: 0; }
		.rj-offers-promises p:nth-child(-n + 2) { border-bottom: 1px solid var(--offers-rule); }
		.rj-offers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.rj-offers-grid li:nth-child(n) { display: block; }
		.rj-offers-banner { height: auto; grid-template-columns: 1fr; }
		.rj-offers-banner > div { padding: 38px 34px; }
		.rj-offers-banner img { height: 240px; min-height: 0; }
		.rj-offers-collection-grid { grid-template-columns: 1fr; }
		.rj-offers-collection-grid > a { grid-template-columns: 40% 60%; }
		.rj-offers-collection-grid > a > div { height: auto; }
	}

	@media (max-width: 520px) {
		.rj-offers-hero { min-height: 650px; }
		.rj-offers-hero-copy { padding: 46px 20px 270px; }
		.rj-offers-hero h1 { font-size: 48px; }
		.rj-offers-hero-copy > span { font-size: 15px; line-height: 25px; }
		.rj-offers-actions { width: 100%; }
		.rj-offers-actions a { width: 100%; }
		.rj-offers-hero-art { width: 80%; height: 330px; }
		.rj-offers-hero-art > span { width: 78px; height: 78px; font-size: 16px; line-height: 17px; }
		.rj-offers-promises p { padding: 20px 14px; }
		.rj-offers-promises b { font-size: 12px; }
		.rj-offers-edit { padding: 65px 20px 75px; }
		.rj-offers-edit > header { align-items: flex-start; flex-direction: column; }
		.rj-offers-grid { gap: 18px 12px; }
		.rj-offers-grid li :global(.rj-tile) { height: 285px; }
		.rj-offers-grid li :global(.rj-tile-media) { height: 178px; }
		.rj-offers-banner { min-height: 0; margin: 0 20px; }
		.rj-offers-banner > div { padding: 30px 22px; }
		.rj-offers-banner h2 { font-size: 36px; }
		.rj-offers-banner > div > span { margin: 13px 0 19px; }
		.rj-offers-banner img { height: 200px; min-height: 0; }
		.rj-offers-collections { padding: 75px 20px; }
		.rj-offers-collection-grid > a { grid-template-columns: 1fr; }
		.rj-offers-collection-grid > a > div { height: 220px; }
	}
</style>
