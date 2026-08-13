<script lang="ts">
	/**
	 * Section 13 — "TRENDING COLLECTION".
	 *
	 * Source frames
	 *   desktop heading 1:6213 (60,5534 · 1321×43) · block 1:6217 (62,5617 · 1318×458)
	 *           bar 1:6218 h29 · grid 1:6225 (4 cards 272, gap 61)
	 *   tablet  63:40637 + 63:40641 — same 272 cards, gap 20, row scrolls
	 *   mobile  77:107531 + 77:107535 — 190 cards, gap 26, row scrolls
	 *
	 * Reuses RjRuleHeading, RjArrowRule and RjProductCard; only the track gaps
	 * are section-specific (section 5 keeps 61 at tablet, this one drops to 20).
	 *
	 * Products are live API data — `trendingProducts` from the homepage module.
	 */
	import RjArrowRule from './RjArrowRule.svelte'
	import RjProductCard from './RjProductCard.svelte'
	import RjRuleHeading from './RjRuleHeading.svelte'
	import { trending } from './home-content.js'

	let {
		products = [],
		loading = false,
		limit = 5
	}: { products?: any[]; loading?: boolean; limit?: number } = $props()

	const visible = $derived((products || []).slice(0, limit))
</script>

<section class="rj-trend" aria-labelledby="rj-trend-heading">
	<div class="rj-trend-head">
		<RjRuleHeading text={trending.heading} id="rj-trend-heading" />
	</div>

	<div class="rj-trend-bar">
		<RjArrowRule gap={20} mobileLength={40} />
		<a class="rj-trend-catalog" href={trending.catalogHref}>
			<span>{trending.catalogLabel}</span>
			<span class="rj-trend-catalog-line" aria-hidden="true"></span>
		</a>
	</div>

	{#if visible.length}
		<ul class="rj-trend-track">
			{#each visible as product (product?.id || product?.slug)}
				<li class="rj-trend-cell">
					<RjProductCard {product} size="wide" />
				</li>
			{/each}
		</ul>
	{:else if loading}
		<div class="rj-trend-track" aria-busy="true">
			{#each Array(limit) as _, i (i)}
				<div class="rj-trend-skeleton" aria-hidden="true"></div>
			{/each}
		</div>
	{:else}
		<p class="rj-trend-empty">{trending.emptyText}</p>
	{/if}
</section>

<style>
	.rj-trend {
		width: 100%;
		padding: 50px 0;
		background: #fff;
	}

	/* 1:6213 sits at x60; the bar and grid below start at x62. */
	.rj-trend-head {
		margin: 0 auto 40px;
		padding: 0 60px;
	}

	/* 1:6218 — arrow rule left, catalog link right, 30 above the grid. */
	.rj-trend-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		margin: 0 auto 30px;
		padding: 0 62px;
	}

	.rj-trend-catalog {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 18px;
		line-height: normal;
		text-transform: capitalize;
		color: var(--rj-ink, #404040);
		text-decoration: none;
		white-space: nowrap;
	}

	/* 1:6224 — 25px rule with an arrowhead on the far end. */
	.rj-trend-catalog-line {
		position: relative;
		display: block;
		width: 25px;
		height: 1.5px;
		background: currentColor;
		transition: width 0.2s var(--rj-ease, ease);
	}

	.rj-trend-catalog-line::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0;
		width: 0;
		height: 0;
		border-top: 4.33px solid transparent;
		border-bottom: 4.33px solid transparent;
		border-left: 7.5px solid currentColor;
		transform: translateY(-50%);
	}

	.rj-trend-catalog:hover {
		color: var(--rj-gold, #cca646);
	}

	.rj-trend-catalog:hover .rj-trend-catalog-line {
		width: 34px;
	}

	/* Five products fill the wide row; the original Figma gutter stays capped at 61px. */
	.rj-trend-track {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: min(4.6353%, 61px);
		margin: 0 auto;
		padding: 0 62px;
		list-style: none;
	}

	.rj-trend-cell {
		flex: 1 1 0;
		min-width: 0;
	}

	.rj-trend-cell :global(.rj-card) {
		width: 100%;
	}

	.rj-trend-skeleton {
		flex: 1 1 0;
		min-width: 0;
		height: 399px;
		border-radius: 5px;
		background: var(--rj-surface, #f4f4f4);
		animation: rj-trend-pulse 1.4s ease-in-out infinite;
	}

	@keyframes rj-trend-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-trend-skeleton {
			animation: none;
		}
	}

	.rj-trend-empty {
		margin: 0;
		padding: 40px 62px;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		text-align: center;
		color: var(--rj-ink-2, #606060);
	}

	@media (max-width: 1279px) {
		.rj-trend-head {
			padding: 0 40px;
		}

		.rj-trend-bar,
		.rj-trend-track {
			padding: 0 40px;
		}

		.rj-trend-track {
			gap: 30px;
		}
	}

	/* ---- tablet 744 (63:40641) — cards keep 272, gap 20, row scrolls ---- */
	@media (max-width: 1023px) {
		.rj-trend {
			padding: 40px 0;
		}

		.rj-trend-head {
			--rj-rule-heading-tablet-gap: 20px;
			max-width: 744px;
			margin-bottom: 30px;
			padding: 0 25px;
		}

		.rj-trend-bar {
			max-width: 744px;
			padding: 0 25px;
		}

		.rj-trend-cell {
			flex: 0 0 auto;
		}

		.rj-trend-track {
			gap: 20px;
		}

		.rj-trend-cell :global(.rj-card) {
			width: 272px;
		}

		.rj-trend-skeleton {
			flex: 0 0 auto;
			width: 272px;
		}

		.rj-trend-track {
			max-width: 744px;
			justify-content: flex-start;
			gap: 20px;
			padding: 0 25px 0 0;
			overflow-x: auto;
			scroll-snap-type: x proximity;
			scrollbar-width: none;
		}

		.rj-trend-track::-webkit-scrollbar {
			display: none;
		}

		.rj-trend-cell {
			scroll-snap-align: start;
		}

		.rj-trend-catalog {
			font-size: 16px;
		}
	}

	/* ---- mobile 412 (77:107535) — 190 cards, gap 26, bar 13px ----------- */
	@media (max-width: 639px) {
		.rj-trend {
			padding: 30px 0;
		}

		.rj-trend-head {
			--rj-rule-heading-mobile-gap: 12px;
			--rj-rule-heading-mobile-size: 18px;
			margin-bottom: 25px;
			padding: 0 19.5px;
		}

		.rj-trend-bar {
			margin-bottom: 22px;
			padding: 0 16px;
		}

		.rj-trend-catalog {
			font-size: 13px;
		}

		.rj-trend-track {
			gap: 26px;
			padding: 0 10px;
		}

		.rj-trend-cell :global(.rj-card) {
			width: 190px;
		}

		.rj-trend-skeleton {
			width: 190px;
			height: 306px;
		}
	}
</style>
