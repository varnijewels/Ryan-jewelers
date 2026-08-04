<script lang="ts">
	/**
	 * Eyebrow + display title on the left, category tabs on the right.
	 * Source: 1:6004 (desktop) · 63:40325 (tablet) · 77:107263 (mobile).
	 *
	 * Reused by section 8 ("Our Product's") and section 13 ("Trending Collection"),
	 * so the copy arrives as props from the theme's static content module.
	 */
	import RjCategoryTabs from './RjCategoryTabs.svelte'

	let {
		eyebrow,
		title,
		id = undefined,
		showTabs = true,
		active = 'All'
	}: { eyebrow: string; title: string; id?: string; showTabs?: boolean; active?: string } = $props()
</script>

<div class="rj-head">
	<div class="rj-head-text">
		<p class="rj-head-eyebrow">{eyebrow}</p>
		<h2 class="rj-head-title" {id}>{title}</h2>
	</div>

	{#if showTabs}
		<RjCategoryTabs {active} size="md" label={title} />
	{/if}
</div>

<style>
	.rj-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		width: 100%;
	}

	.rj-head-text {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.rj-head-eyebrow {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 24px;
		font-weight: 400;
		line-height: 38px;
		color: var(--rj-gold, #cca646);
	}

	.rj-head-title {
		margin: 0;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 30px;
		font-weight: 400;
		line-height: normal;
		/* app.css tracks all h1–h6 at 0.8px; this source node has none. */
		letter-spacing: normal;
		text-transform: capitalize;
		color: var(--rj-ink, #404040);
		white-space: nowrap;
	}

	/* Tablet 744 — both lines 22 (63:40326). */
	@media (max-width: 1023px) {
		.rj-head-eyebrow,
		.rj-head-title {
			font-size: 22px;
		}
	}

	/* Mobile 412 — eyebrow 18 / lh 33, title 13 (77:107264). */
	@media (max-width: 639px) {
		/* below the 412 frame the tabs drop to their own line rather than
		   forcing the page to scroll sideways */
		.rj-head {
			flex-wrap: wrap;
			gap: 12px;
			row-gap: 12px;
		}

		.rj-head-eyebrow {
			font-size: 18px;
			line-height: 33px;
		}

		.rj-head-title {
			font-size: 13px;
		}
	}
</style>
