<script lang="ts">
	/**
	 * Customisation promo tile used by the name-plate section.
	 * Source: 1:6133 / 1:6161 / 1:6147 (desktop, well 222×270)
	 *         · 63:40574 etc (tablet, well 222×222) · 77:107396 etc (mobile, 164×164)
	 *
	 * Theme content, not commerce data — no price; the rating treatment is fixed
	 * presentation from the source frame.
	 */
	import type { NamePlateCard } from './home-content.js'

	let { card }: { card: NamePlateCard } = $props()
</script>

<a class="rj-cust" href={card.href}>
	<span class="rj-cust-well">
		<img
			class="rj-cust-photo"
			src={card.image}
			alt={card.imageAlt}
			loading="lazy"
			decoding="async"
			style="left:{card.crop.left}%; top:{card.crop.top}%; width:{card.crop.width}%;"
		/>
	</span>

	<span class="rj-cust-text" style="--text-w:{card.textWidth}px">
		<span class="rj-cust-name">{card.name}</span>
		<span class="rj-cust-meta">
			<span class="rj-cust-category">{card.category}</span>
			<span class="rj-cust-rating" aria-label="Rating 5.5">
				<span class="rj-cust-stars">
					<img class="rj-cust-star" src="/ryans-jewels/home/star.svg" alt="" aria-hidden="true" />
					<img class="rj-cust-star" src="/ryans-jewels/home/star.svg" alt="" aria-hidden="true" />
				</span>
				<span class="rj-cust-rating-value">5.5</span>
			</span>
		</span>
		<span class="rj-cust-cta">{card.cta}</span>
	</span>
</a>

<style>
	.rj-cust {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 222px;
		flex-shrink: 0;
		text-decoration: none;
	}

	/* 1:6134 — white well, radius 6, image over-scaled and nudged by the source. */
	.rj-cust-well {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 222 / 270;
		border-radius: 6px;
		background: #fff;
		overflow: hidden;
	}

	.rj-cust-photo {
		position: absolute;
		height: 100%;
		max-width: none;
		transition: transform 0.4s var(--rj-ease, ease);
	}

	.rj-cust:hover .rj-cust-photo {
		transform: scale(1.04);
	}

	.rj-cust-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		width: var(--text-w);
		text-align: center;
	}

	.rj-cust-name {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: normal;
		text-transform: capitalize;
		color: #303030;
	}

	.rj-cust-category {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 14px;
		line-height: normal;
		text-transform: capitalize;
		color: #8b8b8b;
	}

	.rj-cust-meta,
	.rj-cust-rating,
	.rj-cust-stars {
		display: flex;
		align-items: center;
	}

	.rj-cust-meta {
		gap: 10px;
		width: 100%;
	}

	.rj-cust-rating {
		gap: 2px;
	}

	.rj-cust-stars {
		gap: 1px;
	}

	.rj-cust-star {
		width: 19px;
		height: 19px;
		flex-shrink: 0;
	}

	.rj-cust-rating-value {
		display: flex;
		align-items: center;
		height: 19px;
		font-family: 'Khmer MN', sans-serif;
		font-size: 20px;
		line-height: 19px;
		color: #555;
		transform: translateY(2px);
	}

	.rj-cust-cta {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: normal;
		text-transform: capitalize;
		color: var(--rj-gold, #cca646);
		transition: opacity 0.18s ease;
	}

	.rj-cust:hover .rj-cust-cta {
		opacity: 0.78;
	}

	/* Tablet 744 — square well (63:40575). */
	@media (max-width: 1023px) {
		.rj-cust-well {
			aspect-ratio: 1;
		}
	}

	/* Mobile 412 — 164 wide, name 14 (77:107397). */
	@media (max-width: 639px) {
		.rj-cust {
			width: 164px;
		}

		.rj-cust-name {
			font-size: 14px;
		}
	}
</style>
