<script lang="ts">
	/**
	 * Filter bar + a horizontal row of product cards.
	 * Source: 1:5651 (desktop, 4 cards gap 61, centred)
	 *         63:40187 (tablet, gap 61, row overflows -> scrolls)
	 *         77:107006 (mobile, gap 26, row scrolls)
	 *
	 * Products are live API data. When the list is empty the row renders a
	 * loading skeleton or an empty state — it never fabricates products.
	 */
	import RjFilterBar from './RjFilterBar.svelte'
	import RjProductCard from './RjProductCard.svelte'
	import RjRule from './RjRule.svelte'
	import { filterProductsByCategory } from './product-filters.js'
	import { tick } from 'svelte'

	let {
		products = [],
		loading = false,
		limit = 4,
		showRule = false,
		emptyText = 'Products are on their way. Please check back shortly.'
	}: {
		products?: any[]
		loading?: boolean
		limit?: number
		showRule?: boolean
		emptyText?: string
	} = $props()

	let activeCategory = $state('All')
	let track = $state<HTMLDivElement>()
	let atStart = $state(true)
	let atEnd = $state(false)
	const visible = $derived(filterProductsByCategory(products || [], activeCategory))

	function updateScrollState() {
		if (!track) return
		atStart = track.scrollLeft <= 1
		atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1
	}

	function scrollProducts(direction: -1 | 1) {
		track?.scrollBy({ left: direction * Math.max(track.clientWidth * .8, 280), behavior: 'smooth' })
	}

	async function changeCategory(category: string) {
		activeCategory = category
		await tick()
		track?.scrollTo({ left: 0 })
		updateScrollState()
	}
</script>

<section class="rj-row">
	{#if showRule}
		<span class="rj-row-divider">
			<RjRule />
		</span>
	{/if}

	<RjFilterBar active={activeCategory} onchange={changeCategory} onprevious={() => scrollProducts(-1)} onnext={() => scrollProducts(1)} previousDisabled={atStart || !visible.length} nextDisabled={atEnd || !visible.length} />

	{#if loading && !visible.length}
		<div class="rj-row-track" aria-busy="true">
			{#each Array(limit) as _}
				<div class="rj-row-skeleton" aria-hidden="true"></div>
			{/each}
		</div>
	{:else if visible.length}
		<div class="rj-row-track" bind:this={track} onscroll={updateScrollState}>
			{#each visible as product (product?.id || product?.slug)}
				<RjProductCard {product} />
			{/each}
		</div>
	{:else}
		<p class="rj-row-empty">{activeCategory === 'All' ? emptyText : `No ${activeCategory.toLowerCase()} are available yet.`}</p>
	{/if}
</section>

<style>
	.rj-row {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 30px;
		width: 100%;
	}

	/*
	 * Source puts the divider on the section seam at 1310 and the filter row at
	 * 1350. The rule box is 4.9 tall (the diamond cap), so the row's 30 gap
	 * needs another 5 to land the filter bar on 1350.
	 */
	.rj-row-divider {
		display: block;
		width: 100%;
		margin-bottom: 5px;
	}

	.rj-row-track {
		display: flex;
		align-items: center;
		justify-content: safe center;
		gap: min(4.628%, 61px);
		width: 100%;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
	}

	.rj-row-track::-webkit-scrollbar { display: none; }

	/*
	 * Cards share the available row and cap at the source's 272px width.
	 * Below 1024 the row scrolls with fixed per-breakpoint cards.
	 */
	.rj-row-track > :global(*) {
		flex: 0 0 272px;
		max-width: 272px;
		min-width: 0;
		scroll-snap-align: start;
	}

	.rj-row-track :global(.rj-card) {
		width: 100%;
	}

	.rj-row-skeleton {
		flex: 1 1 0;
		max-width: 272px;
		min-width: 0;
		width: auto;
	}

	.rj-row-skeleton {
		width: 272px;
		height: 380px;
		flex-shrink: 0;
		border-radius: 5px;
		background: var(--rj-surface, #f4f4f4);
		animation: rj-row-pulse 1.4s ease-in-out infinite;
	}

	@keyframes rj-row-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.rj-row-empty {
		margin: 0;
		padding: 40px 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		text-align: center;
		color: var(--rj-ink-2, #606060);
	}

	/* Tablet/mobile: the source rows overflow their frame, so they scroll. */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-row {
			gap: 30px;
		}

		.rj-row :global(.rj-filter) {
			height: 29px;
		}

		.rj-row-track > :global(*),
		.rj-row-skeleton {
			flex: 0 0 auto;
			max-width: none;
			width: auto;
		}

		.rj-row-track :global(.rj-card) {
			width: 226px;
		}

		.rj-row-track {
			justify-content: flex-start;
			gap: 61px;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			scrollbar-width: none;
			padding-left: 10px;
		}

		.rj-row-track::-webkit-scrollbar {
			display: none;
		}

		.rj-row-track > :global(*) {
			scroll-snap-align: start;
		}

		.rj-row-skeleton {
			width: 226px;
			height: 349px;
		}
	}

	/* 114:58765 — four 235px cards sit in a 1006px centred track. */
	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-row-divider {
			margin-bottom: 11px;
		}

		.rj-row :global(.rj-filter) {
			height: 29px;
		}

		.rj-row-track {
			justify-content: flex-start;
			gap: 22px;
			width: calc(100% + 30px);
		}

		.rj-row-track > :global(*),
		.rj-row-skeleton {
			flex: 0 0 235px;
			max-width: 235px;
		}

		.rj-row-track :global(.rj-card) {
			width: 235px;
		}

		.rj-row-track :global(.rj-card-media) {
			height: 250px;
			aspect-ratio: auto;
		}

		.rj-row-track :global(.rj-card-info) {
			width: 203px;
			min-height: 136px;
		}

		.rj-row-track :global(.rj-card-swatch) {
			width: 28px;
			height: 28px;
		}

		.rj-row-track :global(.rj-card-name) {
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	@media (max-width: 639px) {
		.rj-row {
			gap: 20px;
		}

		.rj-row-track :global(.rj-card) {
			width: 190px;
		}

		.rj-row-track {
			gap: 26px;
		}

		.rj-row-skeleton {
			width: 190px;
			height: 306px;
		}
	}
</style>
