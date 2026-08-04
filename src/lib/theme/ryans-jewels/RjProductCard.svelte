<script lang="ts">
	/**
	 * Ryan Jewelers product card.
	 * Source: 1:5663 (desktop 272 / media 250) · 63:40199 (tablet 226 / media 208)
	 *         · 77:107021 (mobile 190 / media 174)
	 *
	 * Product content is live API data; the three swatches and 5.5 display are
	 * fixed presentation from the source frame.
	 */
	import { page } from '$app/state'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { metalSwatchFills } from './home-content.js'

	/**
	 * `size` picks the two card boxes the source uses for this card:
	 *   default — 272 / 226 / 190  (section 5, 1:5663)
	 *   wide    — 272 / 272 / 190  (section 13, 1:6226 — tablet keeps the
	 *             desktop box instead of shrinking)
	 */
	let {
		product,
		aspectRatio = '272:250',
		size = 'default',
		imageOverride = ''
	}: {
		product: any
		aspectRatio?: string
		size?: 'default' | 'wide' | 'listing'
		imageOverride?: string
	} = $props()

	const currencyCode = $derived(page?.data?.store?.currency?.code || '')
	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)

	const title = $derived(product?.title || product?.name || '')
	const href = $derived(product?.slug ? `/products/${product.slug}` : '/products')
	const image = $derived(
		imageOverride || product?.thumbnail || product?.img || product?.image || product?.image_url || ''
	)
	const category = $derived(product?.category?.name || product?.categoryName || product?.collection?.name || '')
	const rating = 5.5
	const swatches = ['gold', 'rose', 'silver'] as const
</script>

<ProductCardRenderer {product} {aspectRatio}>
	{#snippet content({ toggleWishlist, isWishlisted, loadingForWishlist })}
		<article class="rj-card rj-card--{size}" data-testid="product-card-{product?.id}">
			<div class="rj-card-media">
				<a class="rj-card-media-link" {href} aria-label={title || 'View product'}>
					{#if image}
						<img src={image} alt={title} loading="lazy" />
					{:else}
						<span class="rj-card-media-empty" aria-hidden="true"></span>
					{/if}
				</a>

				{#if wishlistPlugin?.active}
					<button
						type="button"
						class="rj-card-wish"
						class:is-active={isWishlisted}
						class:is-loading={loadingForWishlist}
						disabled={loadingForWishlist}
						aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
						aria-busy={loadingForWishlist}
						onclick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							toggleWishlist()
						}}
					>
					{#if loadingForWishlist}
							<span class="rj-card-spinner" aria-hidden="true"></span>
						{:else}
							<img class="rj-card-heart" src="/ryans-jewels/home/heart.svg" alt="" aria-hidden="true" />
						{/if}
					</button>
				{:else}
					<span class="rj-card-wish rj-card-wish--static" aria-hidden="true">
						<img class="rj-card-heart" src="/ryans-jewels/home/heart.svg" alt="" />
					</span>
				{/if}
			</div>

			<div class="rj-card-info">
				<ul class="rj-card-swatches">
					{#each swatches as key}
						<li class="rj-card-swatch" style="background-image: {metalSwatchFills[key]};"></li>
					{/each}
				</ul>

				<div class="rj-card-text">
					<a class="rj-card-name" {href}>{title}</a>

					<div class="rj-card-meta">
						{#if category}<span class="rj-card-category">{category}</span>{/if}
						<span class="rj-card-rating" aria-label="Rating {rating}">
							<img class="rj-card-star" src="/ryans-jewels/home/star.svg" alt="" aria-hidden="true" />
							<img class="rj-card-star" src="/ryans-jewels/home/star.svg" alt="" aria-hidden="true" />
							<span class="rj-card-rating-value">{rating}</span>
						</span>
					</div>
				</div>

				{#if product?.price != null}
					<p class="rj-card-price" data-testid="product-card-selling-price">
						{formatPrice(product.price, currencyCode)}
					</p>
				{/if}
			</div>
		</article>
	{/snippet}
</ProductCardRenderer>

<style>
	.rj-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 272px;
		flex-shrink: 0;
	}

	.rj-card-media {
		position: relative;
		display: flex;
		align-items: flex-start;
		justify-content: flex-end;
		width: 100%;
		/* 272:250 reproduces every frame's media box — 250 at 272, 208 at 226,
		   174 at 190 — and keeps scaling when the card grows on wide screens. */
		aspect-ratio: 272 / 250;
		padding: 10px;
		border-radius: 5px;
		overflow: hidden;
	}

	.rj-card-media-link {
		position: absolute;
		inset: 0;
		display: block;
		border-radius: 5px;
	}

	.rj-card-media-link img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: 5px;
		transition: transform 0.4s var(--rj-ease, ease);
	}

	.rj-card:hover .rj-card-media-link img {
		transform: scale(1.04);
	}

	.rj-card-media-empty {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--rj-surface, #f4f4f4);
		border-radius: 5px;
	}

	.rj-card-wish {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px;
		border: 0;
		border-radius: 25px;
		background: #f9f9f9;
		color: var(--rj-ink, #404040);
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.rj-card-wish:hover {
		background: #fff;
	}

	.rj-card-wish.is-active {
		color: var(--rj-gold, #cca646);
	}

	.rj-card-wish:disabled {
		cursor: progress;
	}

	.rj-card-wish--static {
		pointer-events: none;
		cursor: default;
	}

	.rj-card-heart {
		display: block;
		width: 30px;
		height: 30px;
	}

	.rj-card-spinner {
		display: block;
		width: 30px;
		height: 30px;
		border: 2px solid rgba(64, 64, 64, 0.25);
		border-top-color: var(--rj-gold, #cca646);
		border-radius: 50%;
		animation: rj-spin 0.7s linear infinite;
	}

	@keyframes rj-spin {
		to {
			transform: rotate(360deg);
		}
	}

	.rj-card-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 9px;
		/* 203 / 272 — the info block keeps its share of the card. */
		width: 74.6324%;
	}

	.rj-card-swatches {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rj-card-swatch {
		width: 31px;
		height: 31px;
		border-radius: 10px;
	}

	.rj-card-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		width: 100%;
	}

	.rj-card-name {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: normal;
		text-align: center;
		text-transform: capitalize;
		color: #303030;
		text-decoration: none;
		transition: color 0.18s ease;
	}

	.rj-card-name:hover {
		color: var(--rj-gold, #cca646);
	}

	.rj-card-meta {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.rj-card-category {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 14px;
		line-height: normal;
		text-transform: capitalize;
		color: #b1b1b1;
		white-space: nowrap;
	}

	.rj-card-rating {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2px;
	}

	.rj-card-star {
		width: 19px;
		height: 19px;
		flex-shrink: 0;
	}

	.rj-card-rating-value {
		display: flex;
		align-items: center;
		height: 19px;
		font-family: 'Khmer MN', sans-serif;
		font-size: 20px;
		line-height: 19px;
		color: #555;
		transform: translateY(2px);
	}

	.rj-card-price {
		margin: 0;
		width: 100%;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 22px;
		font-weight: 700;
		line-height: normal;
		text-align: center;
		color: var(--rj-heading, #202020);
	}

	.rj-card--listing { width: 100%; }
	.rj-card--listing .rj-card-media { aspect-ratio: 312 / 260; }
	.rj-card--listing .rj-card-info { width: 100%; gap: 8px; }
	.rj-card--listing .rj-card-swatch { width: 28px; height: 28px; border-radius: 7px; }
	.rj-card--listing .rj-card-name { font-size: 18px; }
	.rj-card--listing .rj-card-category { font-size: 13px; }
	.rj-card--listing .rj-card-star { width: 16px; height: 16px; }
	.rj-card--listing .rj-card-rating-value { height: 16px; font-size: 17px; line-height: 16px; }
	.rj-card--listing .rj-card-price { font-size: 24px; }

	/* Tablet 744 — 226 wide, media 208, price 19 (63:40199 / 63:40221). */
	@media (max-width: 1023px) {
		.rj-card--default {
			width: 226px;
		}

		.rj-card--default .rj-card-price {
			font-size: 19px;
		}
	}

	/* Mobile 412 — 190 wide, media 174, info 175 justify-between (77:107021). */
	@media (max-width: 639px) {
		.rj-card {
			width: 190px;
		}

		.rj-card--listing { width: 100%; }
		.rj-card--listing .rj-card-media { height: auto; }
		.rj-card--listing .rj-card-name { font-size: 14px; }
		.rj-card--listing .rj-card-price { font-size: 18px; }

		.rj-card-media {
			height: 174px;
		}

		.rj-card-wish {
			padding: 8px;
		}

		.rj-card-heart,
		.rj-card-spinner {
			width: 22px;
			height: 22px;
		}

		.rj-card-info {
			width: 175px;
		}

		.rj-card--listing .rj-card-info {
			width: 100%;
		}

		.rj-card--listing .rj-card-media {
			height: auto;
		}

		.rj-card-swatch {
			width: 20px;
			height: 20px;
			border-radius: 6px;
		}

		.rj-card-name {
			font-size: 14px;
		}

		.rj-card-meta {
			width: 100%;
			justify-content: space-between;
			gap: 8px;
		}

		.rj-card-category {
			font-size: 13px;
		}

		.rj-card-price {
			font-size: 16px;
		}
	}
</style>
