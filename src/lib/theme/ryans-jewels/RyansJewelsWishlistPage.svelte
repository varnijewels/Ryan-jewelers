<script lang="ts">
	import { page } from '$app/state'
	import { MyWishlistRenderer } from '$lib/core/composables/index.js'
	import { formatPrice, toast } from '$lib/core/utils/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import * as Dialog from '$lib/components/ui/dialog/index.js'
	import { metalSwatchFills } from './home-content.js'
	import { productRating } from './product-filters.js'

	let showRemoveConfirmation = $state(false)
	let itemToRemove = $state<any>(null)
	const currency = $derived(page.data?.store?.currency?.code || 'USD')

	function product(item: any) {
		return item?.product || item || {}
	}

	function href(item: any) {
		const value = product(item)
		return value.slug ? `/products/${value.slug}?variant_id=${item.variantId || ''}` : '/products'
	}

	function category(item: any) {
		const value = product(item)
		return value.category?.name || value.category?.title || value.categoryName || value.collection?.name || 'Jewellery'
	}

	function confirmRemove(item: any) {
		itemToRemove = item
		showRemoveConfirmation = true
	}
</script>

<MyWishlistRenderer>
	{#snippet content({ loading, wishlistItems, moveToCart, removeFromWishlist })}
		<section class="rj-wishlist-page">
			<header><h1>My Wishlist History</h1></header>

			{#if loading}
				<div class="rj-wishlist-state" aria-live="polite">Loading wishlist…</div>
			{:else if wishlistItems.length === 0}
				<div class="rj-wishlist-state">
					<strong>Your wishlist is empty</strong>
					<p>Save items you like to keep track of them and buy them later.</p>
					<a href="/products">Browse Products</a>
				</div>
			{:else}
				<div class="rj-wishlist-grid">
					{#each wishlistItems as item (`${item.productId}-${item.variantId}`)}
						{@const value = product(item)}
						{@const rating = productRating(value)}
						<article class="rj-wishlist-card">
							<div class="rj-wishlist-media">
								<a href={href(item)} aria-label={value.title || 'View product'}>
									<img src={value.thumbnail} alt={value.title || 'Jewellery product'} loading="lazy" />
								</a>
								<button type="button" onclick={() => confirmRemove(item)} aria-label="Remove from wishlist">
									<img src="/ryans-jewels/account/wishlist-heart-active.svg" alt="" />
								</button>
							</div>

							<div class="rj-wishlist-info">
								<div class="rj-wishlist-swatches" aria-hidden="true">
									{#each ['gold', 'rose', 'silver'] as swatch}
										<span style="background-image: {metalSwatchFills[swatch]}"></span>
									{/each}
								</div>

								<div class="rj-wishlist-copy">
									<a href={href(item)} title={value.title}>{value.title}</a>
									<div class="rj-wishlist-meta">
										<span>{category(item)}</span>
										{#if rating}
											<div aria-label="Rating {rating} out of 5">
												<img src="/ryans-jewels/home/star.svg" alt="" />
												<img src="/ryans-jewels/home/star.svg" alt="" />
												<b>{rating}</b>
											</div>
										{/if}
									</div>
								</div>

								<div class="rj-wishlist-buy">
									<strong>{formatPrice(value.price, currency)}</strong>
									<button
										type="button"
										onclick={async () => {
											await moveToCart(item)
											toast('Item added to cart', 'success')
										}}
									>
										Buy Now
									</button>
								</div>
							</div>
						</article>
					{/each}
				</div>
			{/if}
		</section>

		<Dialog.Root bind:open={showRemoveConfirmation}>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Remove from Wishlist</Dialog.Title>
					<Dialog.Description>Are you sure you want to remove this item from your wishlist?</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
					<Button variant="outline" onclick={() => (showRemoveConfirmation = false)} class="flex-1 sm:flex-none">Cancel</Button>
					<Button
						variant="destructive"
						onclick={async () => {
							if (!itemToRemove) return
							await removeFromWishlist(itemToRemove.productId, itemToRemove.variantId)
							showRemoveConfirmation = false
							itemToRemove = null
						}}
						class="flex-1 sm:flex-none"
					>
						Remove
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{/snippet}
</MyWishlistRenderer>

<style>
	.rj-wishlist-page { box-sizing: border-box; width: 100%; min-height: 976px; padding: 20px 0; border: 1px solid #c2c2c2; border-radius: 5px; background: #fff; color: #202020; font-family: 'Lato', sans-serif; }
	.rj-wishlist-page > header { box-sizing: border-box; width: 100%; padding: 20px 15px 15px 20px; }
	.rj-wishlist-page h1 { margin: 0; font: 600 22px/22px 'Lato', sans-serif; }
	.rj-wishlist-grid { display: grid; width: min(calc(100% - 40px), 1008px); grid-template-columns: repeat(3, minmax(0, 320px)); gap: 24px; justify-content: start; margin: 25px 20px 0; }
	.rj-wishlist-card { display: flex; min-width: 0; flex-direction: column; gap: 12px; align-items: stretch; }
	.rj-wishlist-media { position: relative; width: 100%; aspect-ratio: 1; overflow: hidden; border: 1px solid var(--rj-card-border, #f5edda); border-radius: 8px; background: #fff; }
	.rj-wishlist-media > a { position: absolute; inset: 0; display: block; }
	.rj-wishlist-media > a img { width: 100%; height: 100%; padding: 20px; object-fit: contain; }
	.rj-wishlist-media > button { position: absolute; top: 12px; left: 12px; display: grid; width: 32px; height: 32px; place-items: center; padding: 8px; border: 0; border-radius: 50%; background: #fff; cursor: pointer; }
	.rj-wishlist-media > button img { width: 16px; height: 16px; filter: brightness(0); opacity: .75; }
	.rj-wishlist-info { display: flex; width: 100%; min-width: 0; flex-direction: column; gap: 6px; align-items: stretch; padding: 0 16px; }
	.rj-wishlist-swatches { display: none; }
	.rj-wishlist-swatches span { width: 28px; height: 28px; border-radius: 7px; }
	.rj-wishlist-copy { display: flex; min-width: 0; max-width: 100%; flex-direction: column; align-items: stretch; }
	.rj-wishlist-copy > a { display: block; max-width: 100%; overflow: hidden; color: var(--rj-ink, #404040); font-size: 16px; font-weight: 400; line-height: 1.5; text-align: left; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
	.rj-wishlist-meta { display: none; }
	.rj-wishlist-meta > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.rj-wishlist-meta > div { display: flex; flex: 0 0 auto; gap: 2px; align-items: center; justify-content: center; }
	.rj-wishlist-meta img { width: 16px; height: 16px; }
	.rj-wishlist-meta b { color: #555; font: 400 17px/16px 'Khmer MN', sans-serif; }
	.rj-wishlist-buy { display: flex; width: 100%; gap: 8px; align-items: center; justify-content: space-between; }
	.rj-wishlist-buy strong { font-size: 16px; font-weight: 400; }
	.rj-wishlist-buy button { padding: 8px 12px; border: 0; border-radius: 6px; background: #cca646; color: #fff; font: 400 18px/normal 'Lato', sans-serif; text-transform: capitalize; cursor: pointer; }
	.rj-wishlist-state { display: flex; min-height: 690px; flex-direction: column; gap: 10px; align-items: center; justify-content: center; color: #808080; text-align: center; }
	.rj-wishlist-state strong { color: #404040; font-size: 18px; }
	.rj-wishlist-state p { margin: 0; font-size: 13px; }
	.rj-wishlist-state a { margin-top: 4px; padding: 8px 15px; border-radius: 4px; background: #cca646; color: #fff; font-size: 14px; text-decoration: none; }

	@media (max-width: 1100px) {
		.rj-wishlist-grid { grid-template-columns: repeat(2, minmax(0, 320px)); }
	}

	@media (max-width: 640px) {
		.rj-wishlist-page { min-height: 600px; padding-top: 8px; }
		.rj-wishlist-page > header { padding: 16px; }
		.rj-wishlist-page h1 { font-size: 19px; }
		.rj-wishlist-grid { width: calc(100% - 24px); grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 10px; margin: 12px 12px 0; }
		.rj-wishlist-media > button { top: 8px; left: 8px; width: 32px; height: 32px; padding: 8px; }
		.rj-wishlist-media > button img { width: 16px; height: 16px; }
		.rj-wishlist-swatches { gap: 6px; }
		.rj-wishlist-swatches span { width: 22px; height: 22px; border-radius: 5px; }
		.rj-wishlist-copy > a { font-size: 14px; }
		.rj-wishlist-meta { font-size: 11px; }
		.rj-wishlist-meta img { width: 13px; height: 13px; }
		.rj-wishlist-meta b { font-size: 14px; }
		.rj-wishlist-buy { width: 100%; gap: 6px; }
		.rj-wishlist-buy strong, .rj-wishlist-buy button { font-size: 13px; }
		.rj-wishlist-buy button { padding: 7px 9px; }
	}
</style>
