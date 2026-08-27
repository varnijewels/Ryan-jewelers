<script lang="ts">
	/**
	 * Section 8 — "Our Product's / our best sellers products" carousel.
	 *
	 * Source frames
	 *   desktop 1:6003 (61,2689 · 1525×526) — head 1:6004 w1318, track 1:6014 y131,
	 *           rail 1:5883 (61,3270 · 1318×2.3)
	 *   tablet  63:40324 (25,2380 · 694×442) — head h69, track y99, rail y440
	 *   mobile  77:107262 (0,2197 · 412×386) — head h49 px16, track y71, rail y311
	 *
	 * The track deliberately bleeds past the container's right edge (the source
	 * frame is 1525 wide inside a 1440 page); the rail stays inside the 1318 grid.
	 *
	 * Products are live API data — an empty list renders a loading or empty state
	 * rather than placeholder products.
	 */
	import RjCarousel from './RjCarousel.svelte'
	import RjCarouselCard from './RjCarouselCard.svelte'
	import RjSectionHead from './RjSectionHead.svelte'
	import { bestSellers } from './home-content.js'
	import { filterProductsByCategory } from './product-filters.js'

	let {
		products = [],
		loading = false,
		eyebrow = bestSellers.eyebrow,
		title = bestSellers.title,
		emptyText = bestSellers.emptyText,
		headingId = 'rj-bestsellers-heading'
	}: {
		products?: any[]
		loading?: boolean
		eyebrow?: string
		title?: string
		emptyText?: string
		headingId?: string
	} = $props()

	let activeCategory = $state('All')
	const items = $derived(filterProductsByCategory(products || [], activeCategory))
</script>

<section class="rj-bestsellers" aria-labelledby={headingId}>
	<div class="rj-bestsellers-inner">
		<div class="rj-bestsellers-head">
			<RjSectionHead {eyebrow} {title} id={headingId} active={activeCategory} onchange={(category) => activeCategory = category} />
		</div>

		{#if items.length}
			{#key activeCategory}
				<RjCarousel label={title} showArrows initialOffset={300.5}>
					{#each items as product (product?.id || product?.slug)}
						<RjCarouselCard {product} />
					{/each}
				</RjCarousel>
			{/key}
		{:else if loading}
			<div class="rj-bestsellers-skeletons" aria-busy="true">
				{#each Array(5) as _, i (i)}
					<div class="rj-bestsellers-skeleton" aria-hidden="true"></div>
				{/each}
			</div>
		{:else}
			<p class="rj-bestsellers-empty">{activeCategory === 'All' ? emptyText : `No ${activeCategory.toLowerCase()} are available yet.`}</p>
		{/if}
	</div>
</section>

<style>
	.rj-bestsellers {
		width: 100%;
		padding: 50px 0;
		background: #fff;
	}

	.rj-bestsellers-inner {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		/* the track bleeds right, so the right gutter lives on the head and rail */
		padding-left: 61px;
		/* consumed by RjCarousel */
		--rj-track-end: 61px;
		--rj-rail-end: 61px;
	}

	/* 1:6004 sits 50 above the track (y0 h81, track y131). */
	.rj-bestsellers-head {
		padding-right: 61px;
		margin-bottom: 50px;
	}

	.rj-bestsellers-skeletons {
		display: flex;
		gap: 25px;
		overflow: hidden;
	}

	.rj-bestsellers-skeleton {
		width: 285px;
		height: 395px;
		flex-shrink: 0;
		border-radius: 10px;
		background: var(--rj-surface, #f4f4f4);
		animation: rj-bestsellers-pulse 1.4s ease-in-out infinite;
	}

	@keyframes rj-bestsellers-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-bestsellers-skeleton {
			animation: none;
		}
	}

	.rj-bestsellers-empty {
		margin: 0;
		padding: 40px 61px 40px 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		color: var(--rj-ink-2, #606060);
	}

	@media (min-width: 1600px) {
		.rj-bestsellers :global(.rj-tile--md) {
			width: calc((100% + 61px - 100px) / 5);
		}
	}

	@media (max-width: 1279px) {
		.rj-bestsellers-inner {
			padding-left: 40px;
			--rj-track-end: 40px;
			--rj-rail-end: 40px;
		}

		.rj-bestsellers-head {
			padding-right: 40px;
		}
	}

	/* Tablet 744 — 25 gutters, head 30 above the track, cards inset 10 (63:40324). */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-bestsellers {
			padding: 40px 0;
		}

		.rj-bestsellers-inner {
			max-width: 744px;
			padding-left: 25px;
			--rj-track-start: 10px;
			--rj-track-end: 25px;
			--rj-rail-end: 25px;
		}

		.rj-bestsellers-head {
			padding-right: 25px;
			margin-bottom: 30px;
		}

		.rj-bestsellers-skeletons {
			gap: 20px;
		}

		.rj-bestsellers-skeleton {
			width: 261px;
			height: 311px;
		}
	}

	/* 114:59005 — 25px start gutter, 285×395 cards and no outer section padding. */
	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-bestsellers {
			margin-top: 50px;
			padding: 0;
			overflow: hidden;
		}

		.rj-bestsellers-inner {
			padding-left: 25px;
			--rj-track-end: 25px;
			--rj-rail-end: 25px;
		}

		.rj-bestsellers-head {
			width: 1318px;
			padding-right: 0;
			margin-bottom: 50px;
		}

		.rj-bestsellers :global(.rj-carousel-track) {
			scroll-snap-type: none;
		}
	}

	/* Mobile 412 — full-bleed section, head padded 16, cards + rail inset 15. */
	@media (max-width: 639px) {
		.rj-bestsellers {
			padding: 25px 0;
		}

		.rj-bestsellers-inner {
			padding-left: 0;
			--rj-track-start: 15px;
			--rj-track-end: 15px;
			--rj-rail-start: 15px;
			--rj-rail-end: 15px;
		}

		.rj-bestsellers-head {
			padding: 0 16px;
			margin-bottom: 22px;
		}

		.rj-bestsellers :global(.rj-carousel-arrows) {
			display: none;
		}

		.rj-bestsellers-skeletons {
			gap: 20px;
			padding-left: 15px;
		}

		.rj-bestsellers-skeleton {
			width: 235px;
			height: 296px;
		}

		.rj-bestsellers-empty {
			padding: 30px 16px;
		}
	}
</style>
