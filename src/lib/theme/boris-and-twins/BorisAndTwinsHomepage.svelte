<script lang="ts">
	import { ArrowRight, Play, Star, Truck, Gem, Headphones, RotateCcw, Camera } from '@lucide/svelte'
	import type { ThemeHomepageContent } from '../types.js'
	import BorisAndTwinsProductCard from './BorisAndTwinsProductCard.svelte'

	let {
		themeContent,
		featuredProducts = [],
		loading = false
	}: {
		themeContent: ThemeHomepageContent
		featuredProducts?: any[]
		currencyCode?: string
		loading?: boolean
	} = $props()

	const IMG = '/boris-and-twins/images'

	// Theme-owned signature collection tiles (map to catalogue search)
	const exploreTiles = [
		{ label: 'PENDENT', href: '/products?q=pendant', image: `${IMG}/Home-page-images/Frame 18.jpg` },
		{ label: 'CHAIN', href: '/products?q=chain', image: `${IMG}/Home-page-images/Frame 19.jpg` },
		{ label: 'RINGS', href: '/products?q=ring', image: `${IMG}/Home-page-images/Frame 20.jpg` },
		{ label: 'EARRING', href: '/products?q=earring', image: `${IMG}/Home-page-images/Frame 21.jpg` }
	]

	const benefits = [
		{ icon: Truck, label: 'FREE SHIPPING' },
		{ icon: Gem, label: 'COSTUME JEWELRY' },
		{ icon: Headphones, label: 'EXPERT SUPPORT' },
		{ icon: RotateCcw, label: '30 DAY RETURN' }
	]

	const sparkleTiles = [
		{ tag: 'Lab-Grown Diamond', name: 'Gold Hoop Pendent', price: 'On sale from $285.76', image: `${IMG}/Product-Images/img.10.jpg` },
		{ tag: 'Lab-Grown Diamond', name: 'Diamond Solitaire', price: 'On sale from $285.76', image: `${IMG}/Product-Images/img.11.jpg` },
		{ tag: 'Lab-Grown Diamond', name: 'Cross Pendant', price: 'On sale from $285.76', image: `${IMG}/Product-Images/img.12.jpg` },
		{ tag: 'Lab-Grown Diamond', name: 'Studs Set', price: 'On sale from $285.76', image: `${IMG}/Product-Images/img.13.jpg` }
	]

	const instaImages = [3, 4, 5, 6, 7, 8].map((n) => `${IMG}/Social-media/image ${n}.jpg`)

	// Static jewelry fallbacks (used only when the API returns no live products; no cart controls)
	const fallbackProducts = [
		{ id: 'bt-1', slug: '#', title: 'Wedding Diamond Ring', price: 286.75, mrp: 386.75, thumbnail: `${IMG}/Product-Images/Rectangle 26-1.jpg` },
		{ id: 'bt-2', slug: '#', title: 'Gold Hoop Pendent', price: 286.75, mrp: 386.75, thumbnail: `${IMG}/Product-Images/enr7190_yellow_gold_image3.jpg` },
		{ id: 'bt-3', slug: '#', title: 'Diamond Ring', price: 286.75, mrp: 386.75, thumbnail: `${IMG}/Product-Images/img.21.jpg` },
		{ id: 'bt-4', slug: '#', title: 'Gold Diamond Chain', price: 286.75, mrp: 386.75, thumbnail: `${IMG}/Product-Images/enr7321_yellow_gold_image3.jpg` },
		{ id: 'bt-5', slug: '#', title: 'Studs Gold Earring', price: 286.75, mrp: 386.75, thumbnail: `${IMG}/Product-Images/enr7967_yellow_gold_image3.jpg` }
	]

	const hasLiveProducts = $derived(featuredProducts.length > 0)
	const mostLoved = $derived(hasLiveProducts ? featuredProducts.slice(0, 10) : fallbackProducts)
	const bestSellers = $derived(hasLiveProducts ? featuredProducts.slice(0, 5) : fallbackProducts)
</script>

<div class="bt-home">
	<!-- HERO -->
	<section class="bt-hero" aria-label="Golden Legacy">
		<h1 class="bt-hero-title">{themeContent.hero.titleLead} {themeContent.hero.titleAccent}</h1>
		<div class="bt-hero-stage">
			<img class="bt-hero-img" src={themeContent.hero.image} alt={themeContent.hero.imageAlt} fetchpriority="high" />
			<div class="bt-hero-caption">
				<h3>Quiet Straight</h3>
				<p>{themeContent.hero.text}</p>
			</div>
			<a class="bt-hero-watch" href="/reels" aria-label="Watch now">
				<Play class="h-4 w-4" fill="currentColor" /><span>{themeContent.hero.secondaryCta}</span>
			</a>
		</div>
	</section>

	<!-- EXPLORE SIGNATURE COLLECTION -->
	<section class="bt-section">
		<div class="bt-section-head">
			<h2 class="bt-section-title">{themeContent.category.titleLead}<br />{themeContent.category.titleAccent}</h2>
			<a class="bt-text-link" href="/products">View All Jewelry <ArrowRight class="h-5 w-5" /></a>
		</div>
		<div class="bt-explore-grid">
			{#each exploreTiles as tile}
				<a class="bt-cat-card" href={tile.href}>
					<img src={tile.image} alt="{tile.label} collection" loading="lazy" />
					<span class="bt-cat-label"><span>{tile.label}</span> <ArrowRight class="h-[18px] w-[18px]" /></span>
				</a>
			{/each}
		</div>
	</section>

	<!-- MOST LOVED -->
	<section class="bt-section">
		<div class="bt-section-head">
			<h2 class="bt-section-title bt-sm">{themeContent.menu.titleLead} {themeContent.menu.titleAccent}</h2>
			<a class="bt-text-link" href="/products">{themeContent.menu.cta} <ArrowRight class="h-5 w-5" /></a>
		</div>
		{#if loading}
			<div class="bt-grid bt-cols-5">
				{#each Array(10) as _}
					<div class="bt-skeleton"></div>
				{/each}
			</div>
		{:else if mostLoved.length}
			<div class="bt-grid bt-cols-5">
				{#each mostLoved as product}
					<BorisAndTwinsProductCard {product} hideCartControls={!hasLiveProducts} />
				{/each}
			</div>
		{:else}
			<div class="bt-empty">
				<h3>{themeContent.menu.emptyTitle}</h3>
				<p>{themeContent.menu.emptyText}</p>
			</div>
		{/if}
	</section>

	<!-- BENEFITS BAR -->
	<section class="bt-benefits" aria-label="Why shop with us">
		<ul class="bt-benefits-row">
			{#each benefits as b}
				<li class="bt-benefit"><b.icon class="h-6 w-6" /><span>{b.label}</span></li>
			{/each}
		</ul>
	</section>

	<!-- EFFORTLESS SPARKLE -->
	<section class="bt-section">
		<div class="bt-sparkle-wrap">
			<figure class="bt-sparkle-figure">
				<img src="{IMG}/Social-media/Effortless Sparkle 11.jpg" alt="Model wearing everyday sparkle jewelry" loading="lazy" />
			</figure>
			<div class="bt-sparkle-content">
				<header class="bt-sparkle-head">
					<p class="bt-eyebrow">Simple. Elegant. Wearable Daily.</p>
					<h2 class="bt-section-title">Effortless Sparkle for Every Day</h2>
					<Star class="bt-sparkle-star h-7 w-7" />
				</header>
				<div class="bt-sparkle-grid">
					{#each sparkleTiles as tile}
						<article class="bt-mini-card">
							<a class="bt-mini-media" href="/products">
								<img src={tile.image} alt={tile.name} loading="lazy" />
							</a>
							<div class="bt-mini-info">
								<p class="bt-mini-tag">{tile.tag}</p>
								<h3 class="bt-mini-name">{tile.name}</h3>
								<p class="bt-mini-price">{tile.price}</p>
							</div>
						</article>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- CRAFTING NARRATIVE -->
	<section class="bt-section">
		<p class="bt-crafting-text">
			Crafting timeless jewelry
			<img class="bt-inline-img bt-portrait" src="{IMG}/Social-media/image 8.jpg" alt="Artisan crafting jewelry" loading="lazy" />
			that carries personal stories. Each piece respects artistry and soulful elegance resonating with unique narratives.
			<img class="bt-inline-img bt-wide" src="{IMG}/Social-media/image 14.jpg" alt="Emerald pendant" loading="lazy" />
			Explore our collection
			<img class="bt-inline-img bt-wide" src="{IMG}/Social-media/image 15.jpg" alt="Emerald necklace" loading="lazy" />
			where beauty meets emotion, revealing adornments with profound tales.
		</p>
	</section>

	<!-- BEST SELLERS -->
	<section class="bt-section">
		<div class="bt-section-head">
			<h2 class="bt-section-title bt-sm">Best Sellers Products</h2>
			<div class="bt-tabs" role="tablist" aria-label="Best seller categories">
				<span class="bt-tab is-active">Ring's</span>
				<span class="bt-tab">Bracelet</span>
				<span class="bt-tab">Earring's</span>
				<span class="bt-tab">Chain</span>
			</div>
		</div>
		{#if bestSellers.length}
			<div class="bt-grid bt-cols-5">
				{#each bestSellers as product}
					<BorisAndTwinsProductCard {product} hideCartControls={!hasLiveProducts} />
				{/each}
			</div>
		{/if}
	</section>

	<!-- REVIEW / TESTIMONIAL -->
	<section class="bt-review" aria-label="Customer review">
		<header class="bt-review-head">
			<h2 class="bt-section-title">All The Happy Review</h2>
			<p class="bt-review-sub">Each Piece In Our Best Collection Radiates Luxury, Elegance,<br />Story In Every Sparkle</p>
		</header>
		<div class="bt-review-body">
			<div class="bt-review-content">
				<blockquote class="bt-review-quote">&ldquo;So Happy for Stunningly Beautiful and Aesthetic Design&rdquo;</blockquote>
				<p class="bt-review-text">Story In Every Sparkle. Each Piece In Best Collection Radiates Luxury, Elegance, Story In Every Sparkle.</p>
				<div class="bt-review-rating">
					<span class="bt-stars" role="img" aria-label="Rated 4.5 out of 5">
						{#each Array(5) as _, i}
							<Star class="bt-star h-[18px] w-[18px]" fill={i < 4 ? 'currentColor' : 'none'} />
						{/each}
					</span>
					<span class="bt-review-count">Review (8547)</span>
				</div>
				<p class="bt-review-counter"><span class="bt-review-index">05</span><span class="bt-review-total">/10</span></p>
			</div>
			<figure class="bt-review-figure">
				<img src="{IMG}/Social-media/image 15.jpg" alt="Customer wearing an emerald diamond necklace and earrings" loading="lazy" />
			</figure>
		</div>
	</section>

	<!-- INSTAGRAM GALLERY -->
	<section class="bt-section bt-insta" aria-label="Instagram gallery">
		<h2 class="bt-insta-title"><span class="bt-rule"></span>#B&amp;TJEWELRY<span class="bt-rule"></span></h2>
		<div class="bt-insta-grid">
			{#each instaImages as img}
				<a class="bt-insta-cell" href="/" aria-label="Instagram post">
					<img src={img} alt="" loading="lazy" />
					<span class="bt-insta-ov"><Camera class="h-7 w-7" /></span>
				</a>
			{/each}
		</div>
	</section>
</div>

<style>
	.bt-home {
		--pad: 60px;
		--maxw: 1440px;
		color: var(--bt-ink, #202020);
		font-family: var(--font-body, 'Jost', sans-serif);
	}

	.bt-section {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 84px var(--pad) 0;
	}

	.bt-section-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 24px;
		margin-bottom: 36px;
	}

	.bt-section-title {
		font-family: var(--font-heading, 'Bodoni Moda', serif);
		font-weight: 400;
		font-size: 46px;
		line-height: 1;
		letter-spacing: 0.5px;
		color: var(--bt-ink, #202020);
	}

	.bt-section-title.bt-sm {
		font-size: 40px;
	}

	.bt-text-link {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: 'Chivo', var(--font-body, sans-serif);
		font-size: 16px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--bt-ink, #202020);
		white-space: nowrap;
		padding-bottom: 7px;
		border-bottom: 1px solid var(--bt-ink, #202020);
		transition:
			color 0.25s,
			border-color 0.25s;
	}

	.bt-text-link:hover {
		color: var(--bt-maroon, #9e260e);
		border-color: var(--bt-maroon, #9e260e);
	}

	.bt-text-link:hover :global(svg) {
		transform: translateX(6px);
		transition: transform 0.3s var(--bt-ease, ease);
	}

	/* HERO */
	.bt-hero {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 var(--pad);
	}

	.bt-hero-title {
		font-family: var(--font-heading, 'Bodoni Moda', serif);
		font-weight: 400;
		font-size: clamp(48px, 8vw, 120px);
		letter-spacing: 0.06em;
		text-align: center;
		padding: 22px 0 18px;
		color: var(--bt-ink, #202020);
	}

	.bt-hero-stage {
		position: relative;
		border-radius: 6px;
		overflow: hidden;
		aspect-ratio: 1440 / 765;
	}

	.bt-hero-stage::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgb(0 0 0 / 0.04), rgb(0 0 0 / 0.18));
		pointer-events: none;
	}

	.bt-hero-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.bt-hero-caption {
		position: absolute;
		left: 22%;
		top: 60%;
		width: 220px;
		color: #fff;
		z-index: 3;
	}

	.bt-hero-caption h3 {
		font-family: var(--font-heading, 'Bodoni Moda', serif);
		font-size: 24px;
		margin-bottom: 8px;
	}

	.bt-hero-caption p {
		font-size: 13px;
		line-height: 1.5;
		opacity: 0.9;
	}

	.bt-hero-watch {
		position: absolute;
		right: 40px;
		bottom: 40px;
		z-index: 3;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 12px 22px;
		background: rgb(255 255 255 / 0.15);
		backdrop-filter: blur(6px);
		border: 1px solid rgb(255 255 255 / 0.6);
		border-radius: 40px;
		color: #fff;
		font-size: 14px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		transition: background 0.25s;
	}

	.bt-hero-watch:hover {
		background: rgb(255 255 255 / 0.28);
	}

	/* EXPLORE */
	.bt-explore-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 13px;
	}

	.bt-cat-card {
		position: relative;
		border-radius: 6px;
		overflow: hidden;
		aspect-ratio: 320 / 380;
		display: block;
	}

	.bt-cat-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s var(--bt-ease, ease);
	}

	.bt-cat-card:hover img {
		transform: scale(1.05);
	}

	.bt-cat-label {
		position: absolute;
		left: 18px;
		bottom: 18px;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: #fff;
		font-size: 14px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	/* GRID */
	.bt-grid {
		display: grid;
		gap: 12px;
	}

	.bt-cols-5 {
		grid-template-columns: repeat(5, 1fr);
	}

	.bt-skeleton {
		aspect-ratio: 238 / 340;
		border-radius: 8px;
		background: linear-gradient(90deg, #f2f0ee, #f8f6f4, #f2f0ee);
		background-size: 200% 100%;
		animation: bt-shimmer 1.4s infinite;
	}

	@keyframes bt-shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.bt-empty {
		text-align: center;
		padding: 40px 0;
	}

	.bt-empty h3 {
		font-family: var(--font-heading, serif);
		font-size: 22px;
		margin-bottom: 8px;
	}

	.bt-empty p {
		color: var(--bt-muted, #595454);
	}

	/* BENEFITS */
	.bt-benefits {
		background: var(--bt-cream, #fbf2ee);
		margin-top: 84px;
	}

	.bt-benefits-row {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 28px var(--pad);
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
		list-style: none;
	}

	.bt-benefit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		color: var(--bt-ink, #202020);
		font-size: 14px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.bt-benefit :global(svg) {
		color: var(--bt-maroon, #9e260e);
	}

	/* SPARKLE */
	.bt-sparkle-wrap {
		display: grid;
		grid-template-columns: 1fr 498px;
		gap: 60px;
		align-items: start;
	}

	.bt-sparkle-figure {
		border-radius: 6px;
		overflow: hidden;
	}

	.bt-sparkle-figure img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.bt-sparkle-head {
		position: relative;
		margin-bottom: 28px;
	}

	.bt-eyebrow {
		font-family: 'Chivo', var(--font-body, sans-serif);
		font-size: 14px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--bt-maroon, #9e260e);
		margin-bottom: 12px;
	}

	.bt-sparkle-star {
		position: absolute;
		right: 0;
		top: 0;
		color: var(--bt-gold, #e2a53c);
	}

	.bt-sparkle-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px 40px;
	}

	.bt-mini-media {
		display: block;
		border-radius: 6px;
		overflow: hidden;
		aspect-ratio: 219 / 262;
	}

	.bt-mini-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s var(--bt-ease, ease);
	}

	.bt-mini-card:hover .bt-mini-media img {
		transform: scale(1.05);
	}

	.bt-mini-tag {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--bt-maroon, #9e260e);
		margin: 12px 0 4px;
	}

	.bt-mini-name {
		font-family: var(--font-heading, serif);
		font-size: 16px;
		text-transform: uppercase;
	}

	.bt-mini-price {
		font-size: 13px;
		color: var(--bt-muted, #595454);
		margin-top: 4px;
	}

	/* CRAFTING */
	.bt-crafting-text {
		font-family: var(--font-heading, 'Bodoni Moda', serif);
		font-size: clamp(28px, 3.6vw, 52px);
		line-height: 1.5;
		text-align: center;
		max-width: 1120px;
		margin: 0 auto;
	}

	.bt-inline-img {
		display: inline-block;
		vertical-align: middle;
		margin: 0 12px;
		border-radius: 6px;
		object-fit: cover;
	}

	.bt-portrait {
		width: 120px;
		height: 66px;
	}

	.bt-wide {
		width: 180px;
		height: 66px;
	}

	/* BEST SELLERS TABS */
	.bt-tabs {
		display: inline-flex;
		gap: 26px;
	}

	.bt-tab {
		font-size: 15px;
		letter-spacing: 0.06em;
		text-transform: capitalize;
		color: var(--bt-muted, #595454);
		padding-bottom: 6px;
		border-bottom: 2px solid transparent;
	}

	.bt-tab.is-active {
		color: var(--bt-maroon, #9e260e);
		border-bottom-color: var(--bt-maroon, #9e260e);
	}

	/* REVIEW */
	.bt-review {
		margin-top: 84px;
	}

	.bt-review-head {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 var(--pad);
		text-align: center;
	}

	.bt-review-sub {
		margin-top: 16px;
		color: var(--bt-muted, #595454);
		line-height: 1.6;
	}

	.bt-review-body {
		max-width: var(--maxw);
		margin: 40px auto 0;
		padding: 0 var(--pad);
		display: grid;
		grid-template-columns: 1fr 642px;
		gap: 60px;
		align-items: center;
	}

	.bt-review-quote {
		font-family: var(--font-heading, 'Bodoni Moda', serif);
		font-size: 38px;
		line-height: 1.25;
		color: var(--bt-ink, #202020);
		max-width: 560px;
		margin-bottom: 22px;
	}

	.bt-review-text {
		color: var(--bt-muted, #595454);
		line-height: 1.6;
		max-width: 520px;
		margin-bottom: 24px;
	}

	.bt-review-rating {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 20px;
	}

	.bt-stars {
		display: inline-flex;
		gap: 3px;
		color: var(--bt-gold, #e2a53c);
	}

	.bt-review-count {
		font-size: 14px;
		color: var(--bt-muted, #595454);
	}

	.bt-review-counter {
		font-family: var(--font-heading, serif);
		font-size: 20px;
	}

	.bt-review-index {
		color: var(--bt-maroon, #9e260e);
	}

	.bt-review-total {
		color: var(--bt-muted, #595454);
	}

	.bt-review-figure {
		border-radius: 6px;
		overflow: hidden;
	}

	.bt-review-figure img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* INSTAGRAM */
	.bt-insta-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
		font-family: var(--font-heading, 'Bodoni Moda', serif);
		font-size: 40px;
		margin-bottom: 36px;
	}

	.bt-rule {
		height: 1px;
		width: 180px;
		background: var(--bt-line-2, #d9d9d9);
	}

	.bt-insta-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 12px;
	}

	.bt-insta-cell {
		position: relative;
		display: block;
		border-radius: 6px;
		overflow: hidden;
		aspect-ratio: 214 / 238;
	}

	.bt-insta-cell img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s var(--bt-ease, ease);
	}

	.bt-insta-cell:hover img {
		transform: scale(1.06);
	}

	.bt-insta-ov {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		color: #fff;
		background: rgb(158 38 14 / 0);
		opacity: 0;
		transition:
			opacity 0.3s,
			background 0.3s;
	}

	.bt-insta-cell:hover .bt-insta-ov {
		opacity: 1;
		background: rgb(158 38 14 / 0.35);
	}

	/* RESPONSIVE */
	@media (max-width: 1024px) {
		.bt-home {
			--pad: 32px;
		}
		.bt-cols-5 {
			grid-template-columns: repeat(3, 1fr);
		}
		.bt-sparkle-wrap {
			grid-template-columns: 1fr;
			gap: 32px;
		}
		.bt-review-body {
			grid-template-columns: 1fr;
			gap: 32px;
		}
		.bt-insta-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 640px) {
		.bt-home {
			--pad: 18px;
		}
		.bt-section {
			padding-top: 56px;
		}
		.bt-section-head {
			flex-direction: column;
			align-items: flex-start;
			gap: 14px;
		}
		.bt-section-title {
			font-size: 32px;
		}
		.bt-section-title.bt-sm {
			font-size: 28px;
		}
		.bt-explore-grid,
		.bt-cols-5,
		.bt-sparkle-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.bt-hero-caption {
			left: 6%;
			width: 60%;
		}
		.bt-benefits-row {
			grid-template-columns: repeat(2, 1fr);
			gap: 18px;
		}
		.bt-insta-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.bt-rule {
			width: 60px;
		}
	}
</style>
