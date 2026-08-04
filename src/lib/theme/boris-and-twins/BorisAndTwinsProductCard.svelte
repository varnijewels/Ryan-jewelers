<script lang="ts">
	import { page } from '$app/state'
	import { Heart, ShoppingBag } from '@lucide/svelte'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils/index.js'

	let { product, aspectRatio = '238:231', hideCartControls = false, meta = '14k, 18k, 24k Gold Ring' }: any = $props()

	const currencyCode = $derived(page?.data?.store?.currency?.code || '')
	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)
	const title = $derived(product?.title || product?.name || 'Product')
	const image = $derived(product?.thumbnail || product?.image_url || product?.image || '/boris-and-twins/images/Product-Images/img.22.jpg')
	const hasMrp = $derived(product?.mrp && product.mrp > product.price)
</script>

<ProductCardRenderer {product} {aspectRatio}>
	{#snippet content({ toggleWishlist, isWishlisted, addToCart })}
		<article class="bt-card" data-testid="product-card-{product.id}">
			<a class="bt-media" href="/products/{product.slug}" aria-label="View {title}">
				<img src={image} alt={title} loading="lazy" />
			</a>
			<div class="bt-info">
				<a href="/products/{product.slug}" class="bt-name-link">
					<h3 class="bt-name">{title}</h3>
				</a>
				<p class="bt-meta">{meta}</p>
				<div class="bt-bottom">
					<div class="bt-price">
						{#if product?.price}
							<span class="bt-price-now" data-testid="product-card-selling-price">{formatPrice(product.price, currencyCode)}</span>
						{:else}
							<span class="bt-price-now">Price on request</span>
						{/if}
						{#if hasMrp}
							<span class="bt-price-old" data-testid="product-card-mrp">{formatPrice(product.mrp, currencyCode)}</span>
						{/if}
					</div>
					{#if !hideCartControls}
						<div class="bt-actions">
							{#if wishlistPlugin?.active}
								<button
									type="button"
									class="bt-wish"
									class:is-active={isWishlisted}
									aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
									onclick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										toggleWishlist()
									}}
								>
									<Heart class="h-[15px] w-[15px]" />
								</button>
							{/if}
							<button class="bt-add" type="button" onclick={() => addToCart(product)}>
								<ShoppingBag class="h-[15px] w-[15px]" />
								Add
							</button>
						</div>
					{/if}
				</div>
			</div>
		</article>
	{/snippet}
</ProductCardRenderer>

<style>
	.bt-card {
		padding: 10px 8px;
		border: 1px solid var(--bt-line, #e9e9e9);
		border-radius: 8px;
		transition:
			border-color 0.3s,
			box-shadow 0.3s,
			transform 0.3s;
	}

	.bt-card:hover {
		border-color: var(--bt-maroon, #9e260e);
		box-shadow: 0 8px 24px rgb(158 38 14 / 0.08);
		transform: translateY(-2px);
	}

	.bt-media {
		display: block;
		background: #fff;
		border-radius: 5px;
		overflow: hidden;
		aspect-ratio: 238 / 231;
	}

	.bt-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s var(--bt-ease, ease);
	}

	.bt-card:hover .bt-media img {
		transform: scale(1.05);
	}

	.bt-info {
		padding-top: 12px;
	}

	.bt-name-link {
		text-decoration: none;
	}

	.bt-name {
		font-family: var(--font-heading, 'Bodoni Moda', serif);
		font-size: 15px;
		font-weight: 500;
		color: var(--bt-ink, #202020);
		text-transform: uppercase;
		letter-spacing: 0.03em;
		line-height: 1.2;
	}

	.bt-meta {
		font-size: 13px;
		color: var(--bt-muted, #595454);
		margin-top: 6px;
	}

	.bt-bottom {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 10px;
		margin-top: 12px;
	}

	.bt-price {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.bt-price-now {
		font-size: 16px;
		font-weight: 600;
		color: var(--bt-ink, #202020);
	}

	.bt-price-old {
		font-size: 12px;
		color: var(--bt-maroon, #9e260e);
		text-decoration: line-through;
	}

	.bt-actions {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.bt-wish {
		width: 27px;
		height: 27px;
		display: grid;
		place-items: center;
		border: 1px solid var(--bt-line, #e9e9e9);
		border-radius: 5px;
		color: var(--bt-ink, #202020);
		background: #fff;
		transition:
			background 0.25s,
			color 0.25s,
			border-color 0.25s;
	}

	.bt-wish:hover,
	.bt-wish.is-active {
		border-color: var(--bt-maroon, #9e260e);
		color: var(--bt-maroon, #9e260e);
	}

	.bt-wish.is-active :global(svg) {
		fill: currentColor;
	}

	.bt-add {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 27px;
		padding: 0 12px;
		background: var(--bt-maroon, #9e260e);
		color: #fff;
		font-size: 12px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		border-radius: 5px;
		transition:
			background 0.25s,
			transform 0.2s;
	}

	.bt-add:hover {
		background: var(--bt-maroon-dark, #7d1c08);
		transform: translateY(-1px);
	}
</style>
