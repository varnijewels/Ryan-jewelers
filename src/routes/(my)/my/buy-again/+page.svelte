<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { Plus } from '@lucide/svelte'
	import { toast } from 'svelte-sonner'
	import Button from '$lib/components/ui/button/button.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { orderService } from '$lib/core/services/index.js'
	import { getCartState } from '$lib/core/stores/index.js'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { buyAgainItems, sameVariant } from '$lib/theme/ryans-jewels/commerce-flow.js'

	const cartState = getCartState()!
	let items = $state<any[]>([])
	let loading = $state(true)
	let error = $state('')
	let adding = $state('')

	const itemKey = (item: any) => `${item.productId}-${item.variantId}`
	const itemInCart = (item: any) => cartState.cart?.lineItems?.some((line: any) => sameVariant(line, item))

	onMount(async () => {
		try {
			const response: any = await orderService.buyAgain()
			items = buyAgainItems(response)
			await cartState.hasLoaded
		} catch (cause: any) {
			error = cause?.message || 'Unable to load previously ordered items.'
		} finally {
			loading = false
		}
	})

	async function addToCart(item: any) {
		const key = itemKey(item)
		if (adding || !item?.productId || !item?.variantId) return
		adding = key
		const previousQty = Number(cartState.cart?.lineItems?.find((line: any) => itemKey(line) === key)?.qty || 0)
		try {
			await cartState.addOrUpdate({ productId: item.productId, variantId: item.variantId, qty: Number(item.qty || 1) })
		} finally {
			adding = ''
		}
		const nextQty = Number(cartState.cart?.lineItems?.find((line: any) => itemKey(line) === key)?.qty || 0)
		if (nextQty <= previousQty) return toast.error('Unable to add this item to your bag')
		toast.success('Item added to bag')
	}
</script>

<svelte:head><title>Buy Again | Ryan Jewelers</title></svelte:head>

<section class="flex flex-col gap-6" aria-labelledby="buy-again-title">
	<h1 id="buy-again-title" class="text-xl font-semibold">Buy Again</h1>
	{#if loading}
		<p role="status">Loading previously ordered items…</p>
	{:else if error}
		<p class="text-red-600" role="alert">{error}</p>
	{:else if items.length}
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			{#each items as item (itemKey(item))}
				<article class="flex gap-4 rounded-md border p-4">
					<a href={`/products/${item.slug}?variant_id=${item.variantId || ''}`} aria-label={`View ${item.title || 'product'}`} class="shrink-0">
						<LazyImg src={item.img || item.thumbnail} alt={item.title || 'Previously ordered jewelry'} width="88" class="h-24 w-20 object-contain" />
					</a>
					<div class="flex min-w-0 flex-1 flex-col gap-2">
						<a href={`/products/${item.slug}?variant_id=${item.variantId || ''}`} class="font-medium hover:underline">{item.title}</a>
						{#if item.qty}<span class="text-sm text-muted-foreground">Qty: {item.qty}</span>{/if}
						<strong>{formatPrice(item.price, page.data?.store?.currency?.code)}</strong>
						{#if itemInCart(item)}
							<p class="mt-auto text-sm text-muted-foreground">Item already in cart</p>
						{:else}
							<Button class="mt-auto w-full" variant="outline" disabled={Boolean(adding)} onclick={() => addToCart(item)}>
								<Plus class="mr-2 h-4 w-4" />{adding === itemKey(item) ? 'Adding…' : 'Add to cart'}
							</Button>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<p>No previously ordered items found.</p>
	{/if}
</section>
