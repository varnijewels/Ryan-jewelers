<script lang="ts">
	/**
	 * Category tab list — All / Ring's / Pendents / Earrings.
	 *
	 * Appears twice in the source with the same shape but different type scale:
	 *   size="lg"  section 5 filter bar   1:5657  (18 / t 18 / m 13, gap 15 / 18 / auto)
	 *   size="md"  section 8 + 13 heads   1:6008  (18 / t 16 / m 13, gap 15 / 15 / auto)
	 * The active tab carries a 1px gold underline; the rest are #808080.
	 *
	 * Hrefs are theme-owned static links (home-content.ts), not API data.
	 */
	import { productFilters } from './home-content.js'

	let {
		active = 'All',
		size = 'lg',
		label = 'Product categories'
	}: { active?: string; size?: 'lg' | 'md'; label?: string } = $props()
</script>

<nav class="rj-tabs rj-tabs--{size}" aria-label={label}>
	{#each productFilters as tab}
		<a
			class="rj-tab"
			class:is-active={tab.label === active}
			href={tab.href}
			aria-current={tab.label === active ? 'page' : undefined}>{tab.label}</a
		>
	{/each}
</nav>

<style>
	.rj-tabs {
		display: flex;
		align-items: center;
		gap: 15px;
		flex-shrink: 0;
	}

	.rj-tab {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 18px;
		line-height: normal;
		text-align: center;
		text-transform: capitalize;
		color: #808080;
		text-decoration: none;
		white-space: nowrap;
		border-bottom: 1px solid transparent;
		transition:
			color 0.18s ease,
			border-color 0.18s ease;
	}

	.rj-tab:hover,
	.rj-tab.is-active {
		color: var(--rj-gold, #cca646);
		border-bottom-color: var(--rj-gold, #cca646);
	}

	@media (max-width: 1023px) {
		.rj-tabs--lg {
			gap: 18px;
		}

		.rj-tabs--md .rj-tab {
			font-size: 16px;
		}
	}

	/* Mobile 412 — the block is a fixed 191 wide with the tabs spread across it. */
	@media (max-width: 639px) {
		/* 191 is the source block; it may shrink on phones narrower than 412. */
		.rj-tabs {
			flex: 0 1 191px;
			width: 191px;
			max-width: 100%;
			justify-content: space-between;
			gap: 0;
		}

		.rj-tab,
		.rj-tabs--md .rj-tab {
			font-size: 13px;
		}
	}
</style>
