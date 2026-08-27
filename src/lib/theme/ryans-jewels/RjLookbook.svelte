<script lang="ts">
	/**
	 * Section 11 — lookbook image + offer countdown + 2×3 product grid.
	 *
	 * Source frames
	 *   desktop  head 1:6474 (77,4133 · 1302×81) · image 1:6175 (60,4264 · 315×810)
	 *            grid 1:5886 (395,4264 · 985×810, cards 315×395, gaps 20)
	 *   tablet   63:40805 (25,3813 · 694×944) — image + grid overflow and scroll,
	 *            with the source's own 10px rail underneath (63:40955)
	 *   mobile   77:107447 (15,3277 · 382×672) — 163 image beside a single
	 *            188 column holding two cards
	 *
	 * Products are live API data; the grid renders a loading or empty state when
	 * the list is short rather than padding it out.
	 */
	import RjCarousel from './RjCarousel.svelte'
	import RjCarouselCard from './RjCarouselCard.svelte'
	import RjCountdown from './RjCountdown.svelte'
	import { lookbook } from './home-content.js'

	let {
		products = [],
		loading = false,
		limit = 8
	}: { products?: any[]; loading?: boolean; limit?: number } = $props()

	const visible = $derived((products || []).slice(0, limit))
</script>

<section class="rj-look" aria-labelledby="rj-look-heading">
	<div class="rj-look-inner">
		<div class="rj-look-head">
			<div class="rj-look-head-text">
				<p class="rj-look-eyebrow">{lookbook.eyebrow}</p>
				<h2 class="rj-look-title" id="rj-look-heading">{lookbook.title}</h2>
			</div>

			<div class="rj-look-head-aside">
				<RjCountdown endsAt={lookbook.offerEndsAt} labels={lookbook.countdownLabels} />
				<a class="rj-look-shop" href={lookbook.shopNowHref}>
					<span>{lookbook.shopNowLabel}</span>
					<img src="/ryans-jewels/home/arrow-right-line.svg" alt="" aria-hidden="true" />
				</a>
			</div>
		</div>

		<div class="rj-look-body">
			<figure class="rj-look-figure">
				<img
					class="rj-look-photo"
					src={lookbook.image}
					alt={lookbook.imageAlt}
					loading="lazy"
					decoding="async"
				/>
				<span class="rj-look-rule" aria-hidden="true"></span>
			</figure>

			<RjCarousel label={lookbook.title}>
				{#if visible.length}
					<ul class="rj-look-grid">
						{#each visible as product (product?.id || product?.slug)}
							<li class="rj-look-cell"><RjCarouselCard {product} size="lg" /></li>
						{/each}
					</ul>
				{:else if loading}
					<div class="rj-look-grid" aria-busy="true">
						{#each Array(limit) as _, i (i)}
							<div class="rj-look-skeleton" aria-hidden="true"></div>
						{/each}
					</div>
				{:else}
					<p class="rj-look-empty">{lookbook.emptyText}</p>
				{/if}
			</RjCarousel>
		</div>
	</div>
</section>

<style>
	.rj-look {
		width: 100%;
		padding: 50px 0;
		background: #fff;
	}

	.rj-look-inner {
		margin: 0 auto;
		padding: 0 60px;
		/* consumed by RjCarousel — the desktop row fits, so no bleed is needed */
		--rj-track-start: 0px;
		--rj-track-end: 0px;
		--rj-track-gap: 20px;
	}

	/* ---- head ----------------------------------------------------------- */
	/* 1:6474 — text left, countdown + Shop now right, aligned to the top. */
	.rj-look-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
		margin: 0 0 50px 17px;
	}

	.rj-look-head-text {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.rj-look-eyebrow {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 24px;
		font-weight: 400;
		line-height: 38px;
		color: var(--rj-gold, #cca646);
	}

	.rj-look-title {
		margin: 0;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 30px;
		font-weight: 400;
		line-height: normal;
		/* app.css tracks all h1–h6 at 0.8px; this source node has none. */
		letter-spacing: normal;
		text-transform: capitalize;
		color: var(--rj-ink, #404040);
	}

	.rj-look-head-aside {
		display: flex;
		align-items: center;
		gap: 15px;
		flex-shrink: 0;
	}

	/* 1:6497 — 15px label plus the 25.456 vuesax arrow, gap 2. */
	.rj-look-shop {
		display: flex;
		align-items: center;
		gap: 2px;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 15px;
		line-height: 1;
		color: var(--rj-heading, #202020);
		text-decoration: none;
		white-space: nowrap;
	}

	.rj-look-shop img {
		width: 25.456px;
		height: 25.456px;
		transition: transform 0.2s var(--rj-ease, ease);
	}

	.rj-look-shop:hover img {
		transform: translateX(3px);
	}

	.rj-look-body {
		display: flex;
		align-items: flex-start;
		gap: var(--rj-track-gap, 20px);
		width: 100%;
	}

	.rj-look-body :global(.rj-carousel) {
		flex: 1 1 auto;
		min-width: 0;
		width: auto;
	}

	/* ---- lookbook image ------------------------------------------------- */
	/* 1:6175 — 315×810, 15px frame, radius 7, 10% ink wash, 1.6px inner rule. */
	.rj-look-figure {
		position: relative;
		flex: 0 0 23.8636%;
		width: 23.8636%;
		height: 810px;
		margin: 0;
		padding: 15px;
		border-radius: 7px;
		overflow: hidden;
	}

	.rj-look-photo {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 7px;
	}

	.rj-look-figure::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 7px;
		background: rgba(37, 37, 37, 0.1);
		pointer-events: none;
	}

	.rj-look-rule {
		position: relative;
		z-index: 1;
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 5px;
		box-shadow: inset 0 0 0 1.6px #fff;
	}

	/* ---- product grid --------------------------------------------------- */
	/* 1:5886 — 985 wide, three 315 columns, 20 gaps both ways. */
	.rj-look-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
		margin: 0;
		padding: 0;
		list-style: none;
		flex: 1 1 auto;
		min-width: 0;
	}

	.rj-look-cell {
		display: block;
		min-width: 0;
	}

	/* The grid columns are 1fr, so the tile fills its cell instead of staying
	   pinned at the frame's 315 and leaving gaps on wide screens. */
	.rj-look-cell :global(.rj-tile) {
		width: 100%;
	}

	/* 1920px — five equal columns fill the full row: one lookbook image and
	   four products, while the original 20px Figma gaps stay unchanged. */
	@media (min-width: 1800px) {
		.rj-look-figure {
			flex-basis: calc((100% - 80px) / 5);
			width: calc((100% - 80px) / 5);
		}

		.rj-look-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			flex: 1 1 auto;
		}

		.rj-look-cell :global(.rj-tile) {
			width: 100%;
		}
	}

	.rj-look-skeleton {
		width: 100%;
		height: 395px;
		border-radius: 10px;
		background: var(--rj-surface, #f4f4f4);
		animation: rj-look-pulse 1.4s ease-in-out infinite;
	}

	/* The source desktop/tablet frames stay 3×2; 1920px reveals all eight
	   products as the requested 4×2 grid. */
	@media (max-width: 1799px) {
		.rj-look-cell:nth-child(n + 7),
		.rj-look-skeleton:nth-child(n + 7) {
			display: none;
		}
	}

	@keyframes rj-look-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-look-skeleton {
			animation: none;
		}
	}

	.rj-look-empty {
		margin: 0;
		padding: 40px 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		color: var(--rj-ink-2, #606060);
	}

	@media (max-width: 1279px) {
		.rj-look-inner {
			padding: 0 40px;
			--rj-track-end: 40px;
		}
	}

	/* ---- tablet 744 (63:40805) ------------------------------------------ */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-look {
			height: 984px;
			padding: 40px 0 0;
			overflow: hidden;
		}

		.rj-look-inner {
			max-width: 744px;
			padding: 0 25px;
			--rj-track-end: 25px;
			--rj-rail-end: 25px;
			--rj-track-gap: 25px;
		}

		.rj-look-head {
			margin: 0 0 40px;
			gap: 16px;
		}

		/* 63:40836 / 63:40838 — the tablet row keeps 315 boxes and scrolls. */
		.rj-look-figure {
			flex: 0 0 315px;
			width: 315px;
		}

		.rj-look-grid {
			grid-template-columns: repeat(3, 315px);
			flex: 0 0 auto;
		}

		.rj-look-cell :global(.rj-tile) {
			width: 315px;
		}

		.rj-look-eyebrow {
			font-size: 22px;
		}

		.rj-look-title {
			font-size: 22px;
		}

		.rj-look-head-aside {
			align-items: flex-start;
			gap: 10px;
		}

		.rj-look-shop {
			margin-top: 18px;
		}

		.rj-look :global(.rj-carousel-rail) {
			margin-top: 15px;
		}
	}

	/* 114:59193 — fixed 945px lookbook followed by the separate banner. */
	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-look {
			height: 945px;
			margin-top: 50px;
			padding: 0;
			overflow: hidden;
		}

		.rj-look-inner {
			padding: 0 25px;
			--rj-track-end: 25px;
			--rj-rail-end: 25px;
			--rj-track-gap: 20px;
		}

		.rj-look-head {
			margin: 0 0 40px;
			gap: 16px;
		}

		.rj-look-figure {
			flex: 0 0 315px;
			width: 315px;
		}

		.rj-look-grid {
			grid-template-columns: repeat(3, 315px);
			flex: 0 0 auto;
		}

		.rj-look-cell :global(.rj-tile) {
			width: 315px;
		}
	}

	/* ---- mobile 412 (77:107447) ----------------------------------------- */
	@media (max-width: 639px) {
		.rj-look {
			height: auto;
			padding: 25px 0;
		}

		.rj-look-inner {
			padding: 0 15px;
			--rj-track-end: 0px;
			--rj-rail-end: 0px;
			--rj-track-gap: 18px;
		}

		/* the head stacks: text, then countdown + Shop now on one row */
		.rj-look-head {
			flex-direction: column;
			align-items: stretch;
			gap: 17px;
			margin-bottom: 30px;
		}

		.rj-look-eyebrow {
			font-size: 18px;
			line-height: normal;
		}

		.rj-look-title {
			font-size: 21px;
		}

		.rj-look-head-aside {
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}

		.rj-look-shop {
			margin-top: 0;
		}

		/* 163 image beside one 188 column of two cards (77:107476) */
		.rj-look-figure {
			flex: 0 0 163px;
			width: 163px;
			height: 514px;
			padding: 10px;
		}

		.rj-look-grid {
			grid-template-columns: 188px;
			gap: 12px;
		}

		.rj-look-cell :global(.rj-tile) {
			width: 188px;
		}

		/* the source shows two cards on mobile, not six */
		.rj-look-cell:nth-child(n + 3) {
			display: none;
		}

		.rj-look-skeleton {
			height: 251px;
		}

		.rj-look-skeleton:nth-child(n + 3) {
			display: none;
		}

		.rj-look :global(.rj-carousel-rail) {
			display: none;
		}
	}
</style>
