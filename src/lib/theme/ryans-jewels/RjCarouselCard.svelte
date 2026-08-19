<script lang="ts">
	/**
	 * Carousel product tile — the boxed card used by the "Our Product's" and
	 * "Trending Collection" carousels. Distinct from RjProductCard (section 5),
	 * which is the borderless, centre-aligned card.
	 *
	 * Source: 1:6072 (desktop 285 / media 279×293) · 63:40337 (tablet 261 / 255×201)
	 *         · 77:107275 (mobile 235 / 229×181)
	 *
	 * Product content is live API data; the card treatment follows the source frame.
	 */
	import { page } from '$app/state'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { discountPercent, listingImage } from './product-details.logic.js'
	import { productRating } from './product-filters.js'

	/**
	 * `size` picks the source's two card widths:
	 *   md — 285 / 261 / 235  (sections 8 and 13 carousels)
	 *   lg — 315 / 315 / 188  (section 11 lookbook grid, 1:5888)
	 */
	let { product, size = 'md' }: { product: any; size?: 'md' | 'lg' } = $props()

	const currencyCode = $derived(page?.data?.store?.currency?.code || '')

	const title = $derived(product?.title || product?.name || '')
	const href = $derived(product?.slug ? `/products/${product.slug}` : '/products')
	const image = $derived(
		product?.thumbnail || product?.img || product?.image || product?.image_url || ''
	)
	const category = $derived(
		product?.category?.name || product?.categoryName || product?.collection?.name || ''
	)
	const rating = $derived(productRating(product))
	const price = $derived(Number(product?.price ?? NaN))
	const mrp = $derived(Number(product?.mrp ?? NaN))
	const hasCompare = $derived(Number.isFinite(mrp) && Number.isFinite(price) && mrp > price)
	const discount = $derived(hasCompare ? discountPercent(price, mrp) : 0)
</script>

<ProductCardRenderer {product} aspectRatio="279:293">
	{#snippet content()}
		<article class="rj-tile rj-tile--{size}" data-testid="product-card-{product?.id}">
			<a class="rj-tile-media" {href} aria-label={title || 'View product'}>
				{#if image}
					<img class="rj-tile-photo" src={listingImage(image)} alt={title} loading="lazy" decoding="async" />
				{:else}
					<span class="rj-tile-photo rj-tile-photo--empty" aria-hidden="true"></span>
				{/if}

				{#if discount}<span class="rj-tile-badge">{discount}% off</span>{/if}
			</a>

			<div class="rj-tile-info">
				<div class="rj-tile-top">
					<div class="rj-tile-meta">
						<span class="rj-tile-category">{category}</span>
						{#if rating}
							<span class="rj-tile-rating" aria-label="Rating {rating} out of 5">
								<img class="rj-tile-star" src="/ryans-jewels/home/star.svg" alt="" aria-hidden="true" />
								<img class="rj-tile-star" src="/ryans-jewels/home/star.svg" alt="" aria-hidden="true" />
								<span class="rj-tile-rating-value">{rating}</span>
							</span>
						{/if}
					</div>

					<a class="rj-tile-name" {href}>{title}</a>
				</div>

				{#if Number.isFinite(price)}
					<p class="rj-tile-prices">
						<span class="rj-tile-price" data-testid="product-card-selling-price">
							{formatPrice(price, currencyCode)}
						</span>
						{#if hasCompare}
							<span class="rj-tile-mrp" data-testid="product-card-mrp">
								{formatPrice(mrp, currencyCode)}
							</span>
						{/if}
					</p>
				{/if}
			</div>
		</article>
	{/snippet}
</ProductCardRenderer>

<style>
	/* 1:6072 — 285×395, #f9f9f9, radius 10, 3px frame around the media. */
	.rj-tile {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 285px;
		flex-shrink: 0;
		padding: 3px;
		border-radius: 10px;
		background: #f9f9f9;
	}

	.rj-tile--md {
		height: 395px;
	}

	.rj-tile-media {
		position: relative;
		display: block;
		width: 100%;
		height: 293px;
		border-radius: 10px;
		background: #fff;
		overflow: hidden;
	}

	.rj-tile-photo {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: 10px;
		transition: transform 0.4s var(--rj-ease, ease);
	}

	.rj-tile:hover .rj-tile-photo {
		transform: scale(1.04);
	}

	.rj-tile-photo--empty {
		background: var(--rj-surface, #f4f4f4);
	}

	/* 1:6089 — gold pill at (10,8) from the card corner, text trimmed to cap height. */
	.rj-tile-badge {
		position: absolute;
		left: 7px;
		top: 5px;
		padding: 10px;
		border-radius: 5px;
		background: var(--rj-gold, #cca646);
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 16px;
		line-height: 9px;
		text-transform: uppercase;
		color: #fff;
		white-space: nowrap;
	}

	.rj-tile-info {
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding: 0 7px 7px;
	}

	.rj-tile-top {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.rj-tile-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.rj-tile-category {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 12px;
		line-height: normal;
		text-transform: capitalize;
		color: #b1b1b1;
		white-space: nowrap;
	}

	.rj-tile-rating {
		display: flex;
		align-items: center;
		gap: 2px;
		margin-left: auto;
	}

	.rj-tile-star {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.rj-tile-rating-value {
		display: flex;
		align-items: center;
		height: 16px;
		font-family: 'Khmer MN', sans-serif;
		font-size: 18px;
		line-height: 16px;
		color: #555;
		transform: translateY(2px);
	}

	.rj-tile-name {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 12px;
		line-height: 14px;
		text-transform: capitalize;
		color: #252525;
		text-decoration: none;
		/* the source name box is exactly two 14px lines (1:6085 h28) */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		transition: color 0.18s ease;
	}

	.rj-tile-name:hover {
		color: var(--rj-gold, #cca646);
	}

	.rj-tile-prices {
		display: flex;
		align-items: center;
		gap: 5px;
		margin: 0;
	}

	.rj-tile-price {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 18px;
		font-weight: 700;
		line-height: normal;
		text-transform: capitalize;
		color: var(--rj-heading, #202020);
		white-space: nowrap;
	}

	.rj-tile-mrp {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 12px;
		font-weight: 400;
		line-height: normal;
		text-decoration: line-through;
		color: #838383;
		white-space: nowrap;
	}

	/* Tablet 744 — 261 wide, media 201, name 11, info gaps 5 (63:40337). */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-tile {
			width: 261px;
		}

		.rj-tile--md {
			height: 311px;
		}

		.rj-tile-media {
			height: 201px;
		}

		.rj-tile-badge {
			left: 5px;
			top: 5px;
		}

		.rj-tile-info {
			gap: 5px;
			padding: 0 6px 6px;
		}

		.rj-tile-top {
			gap: 5px;
		}

		.rj-tile-name {
			font-size: 11px;
		}
	}

	/* Mobile 412 — 235 wide, media 181, price 16, name 3 lines (77:107275). */
	@media (max-width: 639px) {
		.rj-tile {
			width: 235px;
		}

		.rj-tile--md {
			height: 296px;
		}

		.rj-tile-media {
			height: 181px;
		}

		.rj-tile-name {
			line-height: normal;
			-webkit-line-clamp: 3;
			line-clamp: 3;
		}

		.rj-tile-price {
			font-size: 16px;
		}
	}

	/* ---- lg variant — section 11 grid (1:5888 / 63:40840 / 77:107480) ---- */
	.rj-tile--lg {
		width: 315px;
		height: 395px;
	}

	.rj-tile--lg .rj-tile-info {
		gap: 5px;
		padding: 0 10px 9px;
	}

	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		/* the tablet lookbook card keeps the full 315 desktop box (63:40840) */
		.rj-tile--lg {
			width: 315px;
		}

		.rj-tile--lg .rj-tile-media {
			height: 293px;
		}

		.rj-tile--lg .rj-tile-info {
			padding: 0 10px 9px;
		}

		.rj-tile--lg .rj-tile-top {
			gap: 3px;
		}

		.rj-tile--lg .rj-tile-name {
			font-size: 12px;
		}
	}

	/* Mobile 412 — 188 wide, media 140, name 2 lines, price 14 (77:107480). */
	@media (max-width: 639px) {
		.rj-tile--lg {
			width: 188px;
			height: 251px;
		}

		.rj-tile--lg .rj-tile-media {
			height: 140px;
		}

		.rj-tile--lg .rj-tile-info {
			padding: 0 6px 6px;
		}

		.rj-tile--lg .rj-tile-top {
			gap: 5px;
		}

		.rj-tile--lg .rj-tile-name {
			font-size: 11px;
			line-height: 17.5px;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}

		.rj-tile--lg .rj-tile-price {
			font-size: 14px;
		}
	}
</style>
