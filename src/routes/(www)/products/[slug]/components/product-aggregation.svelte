<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Button } from '$lib/components/ui/button/index.js'

	const productState = useProductState()

	// Option values arrive as strings like "0.50 ct" / "1.25 ct"; a plain .sort() orders them
	// lexically, so 10 sorts before 2. Sort on the leading numeric instead, falling back to 0
	// for non-numeric values so they keep a stable position rather than throwing.
	function sortByNumericValue(arr) {
		return arr
			.map((x) => ({ value: x, numeric: Number(x.match(/[0-9.]+/)?.[0] || "0") || 0 }))
			.sort((a, b) => a.numeric - b.numeric)
			.map((x) => x.value)
	}
</script>

{#if page.data?.product?.ag && Object.keys(page.data?.product?.ag).length}
	<div class="intra-gap flex flex-col">
		{#each Object.entries(page.data?.product?.ag || {}) as [optionName, values]}
			{#if Array.isArray(values)}
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
							{optionName}

							{#if productState.selectedAggregations?.[optionName]}
								:
							{/if}
						</span>

						<span class="font-semibold">{productState.selectedAggregations?.[optionName] || ''}</span>
					</div>

					<div class="flex flex-wrap items-center gap-3">
						{#each sortByNumericValue(values) as value}
							<Button
								variant={productState.selectedAggregations?.[optionName] === value ? 'default' : 'plain'}
								disabled={!productState.isAggregationAvaliable(optionName, value)}
								class="min-w-[3.5rem] !bg-primary px-4 py-2 {productState.selectedAggregations?.[optionName] === value
									? 'border !border-accent !bg-transparent'
									: '!bg-accent text-accent-foreground'}"
								onclick={() => productState.toggleAggregation(optionName, value)}
							>
								{value}
							</Button>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/if}
