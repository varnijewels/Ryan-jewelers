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

	const visible = $derived((products || []).slice(0, limit))
</script>

<section class="rj-row">
	{#if showRule}
		<span class="rj-row-divider">
			<RjRule />
		</span>
	{/if}

	<RjFilterBar />

	{#if loading && !visible.length}
		<div class="rj-row-track" aria-busy="true">
			{#each Array(limit) as _}
				<div class="rj-row-skeleton" aria-hidden="true"></div>
			{/each}
		</div>
	{:else if visible.length}
		<div class="rj-row-track">
			{#each visible as product (product?.id || product?.slug)}
				<RjProductCard {product} />
			{/each}
		</div>
	{:else}
		<p class="rj-row-empty">{emptyText}</p>
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
		justify-content: center;
		gap: min(4.628%, 61px);
		width: 100%;
	}

	/*
	 * Cards share the available row and cap at the source's 272px width.
	 * Below 1024 the row scrolls with fixed per-breakpoint cards.
	 */
	.rj-row-track > :global(*) {
		flex: 1 1 0;
		max-width: 272px;
		min-width: 0;
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
	@media (max-width: 1023px) {
		.rj-row {
			gap: 25px;
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
