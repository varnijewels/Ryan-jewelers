<script lang="ts">
	/**
	 * Category tabs on the left, arrow rule on the right.
	 * Source: 1:5652 (desktop, rule 100 / tabs 18px)
	 *         63:40188 (tablet) · 77:107009 (mobile, rule 72 / tabs 13px)
	 * The active tab carries a 1px gold underline (1:5657).
	 */
	import RjArrowRule from './RjArrowRule.svelte'
	import { Pause, Play } from '@lucide/svelte'
	import RjCategoryTabs from './RjCategoryTabs.svelte'

	let {
		active = 'All',
		onchange,
		onprevious,
		onnext,
		previousDisabled = false,
		nextDisabled = false,
		paused = false,
		ontoggleautoplay
	}: {
		active?: string
		onchange?: (category: string) => void
		onprevious?: () => void
		onnext?: () => void
		previousDisabled?: boolean
		nextDisabled?: boolean
		paused?: boolean
		ontoggleautoplay?: () => void
	} = $props()
</script>

<div class="rj-filter">
	<RjCategoryTabs {active} size="lg" {onchange} />
	<div class="rj-filter-controls">
		<RjArrowRule gap={20} {onprevious} {onnext} {previousDisabled} {nextDisabled} />
		{#if ontoggleautoplay}
			<button class="rj-filter-playback" type="button" aria-label={paused ? 'Resume product scrolling' : 'Pause product scrolling'} disabled={previousDisabled && nextDisabled} onclick={ontoggleautoplay}>
				{#if paused}<Play size={14} aria-hidden="true" />{:else}<Pause size={14} aria-hidden="true" />{/if}
			</button>
		{/if}
	</div>
</div>

<style>
	.rj-filter {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		width: 100%;
	}
	.rj-filter-controls { display: flex; flex-shrink: 0; align-items: center; gap: 12px; }
	.rj-filter-playback { display: grid; width: 28px; height: 30px; place-items: center; padding: 0; border: 0; background: transparent; color: var(--rj-ink, #404040); cursor: pointer; }
	.rj-filter-playback:hover { color: var(--rj-gold, #cca646); }
	.rj-filter-playback:disabled { opacity: .25; cursor: default; }
	.rj-filter-playback:focus-visible { outline: 2px solid var(--rj-gold, #cca646); outline-offset: 2px; }
	@media (max-width: 639px) { .rj-filter, .rj-filter-controls { gap: 8px; } }
</style>
