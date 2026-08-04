<script lang="ts">
	/**
	 * Arrow rule on the left, category tabs on the right.
	 * Source: 1:5652 (desktop, rule 100 / tabs 18px)
	 *         63:40188 (tablet) · 77:107009 (mobile, rule 72 / tabs 13px)
	 * The active tab carries a 1px gold underline (1:5657).
	 */
	import RjArrowRule from './RjArrowRule.svelte'
	import RjCategoryTabs from './RjCategoryTabs.svelte'

	let { active = 'All' }: { active?: string } = $props()
</script>

<div class="rj-filter">
	<RjArrowRule gap={20} />
	<RjCategoryTabs {active} size="lg" />
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
