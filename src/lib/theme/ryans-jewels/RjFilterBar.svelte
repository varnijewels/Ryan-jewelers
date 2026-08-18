<script lang="ts">
	/**
	 * Arrow rule on the left, category tabs on the right.
	 * Source: 1:5652 (desktop, rule 100 / tabs 18px)
	 *         63:40188 (tablet) · 77:107009 (mobile, rule 72 / tabs 13px)
	 * The active tab carries a 1px gold underline (1:5657).
	 */
	import RjArrowRule from './RjArrowRule.svelte'
	import RjCategoryTabs from './RjCategoryTabs.svelte'

	let {
		active = 'All',
		onchange,
		onprevious,
		onnext,
		previousDisabled = false,
		nextDisabled = false
	}: {
		active?: string
		onchange?: (category: string) => void
		onprevious?: () => void
		onnext?: () => void
		previousDisabled?: boolean
		nextDisabled?: boolean
	} = $props()
</script>

<div class="rj-filter">
	<RjArrowRule gap={20} {onprevious} {onnext} {previousDisabled} {nextDisabled} />
	<RjCategoryTabs {active} size="lg" {onchange} />
</div>

<style>
	.rj-filter {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		width: 100%;
	}
</style>
