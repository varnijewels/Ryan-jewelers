<script lang="ts">
	import { ProductCardRenderer } from '$lib/core/composables/index.js'
	import RjProductCard from './RjProductCard.svelte'

	let { product, size = 'md', badgeLabel = '' }: { product: any; size?: 'md' | 'lg'; badgeLabel?: string } = $props()
</script>

{#if product}
	<ProductCardRenderer {product} aspectRatio="1:1">
		{#snippet content()}
			<div class="rj-tile rj-tile--{size}"><RjProductCard {product} {badgeLabel} size="listing" /></div>
		{/snippet}
	</ProductCardRenderer>
{/if}

<style>
	.rj-tile { width: 285px; min-width: 0; flex-shrink: 0; }
	.rj-tile--lg { width: 315px; }
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) { .rj-tile--md { width: 261px; } }
	@media (max-width: 639px) {
		.rj-tile--md { width: 235px; }
		.rj-tile--lg { width: 188px; }
	}
</style>
