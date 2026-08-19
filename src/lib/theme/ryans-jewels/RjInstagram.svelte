<script lang="ts">
	/**
	 * Section 16a — the Instagram strip above the footer.
	 * Source: 1:6323 (desktop, six 203×251 tiles, gap 20 on a #fafafa band)
	 *         · 63:40958 (tablet, five 124×153) · 77:107699 (mobile)
	 *
	 * Tiles are theme-owned imagery, not API data — swap them when the store's
	 * real feed is wired up.
	 */
	import { instagramStrip } from './footer-content.js'
</script>

<section class="rj-ig" aria-labelledby="rj-ig-heading">
	<div class="rj-ig-inner">
		<div class="rj-ig-head">
			<p class="rj-ig-eyebrow">{instagramStrip.eyebrow}</p>
			<h2 class="rj-ig-heading" id="rj-ig-heading">{instagramStrip.heading}</h2>
		</div>

		<ul class="rj-ig-grid">
			{#each instagramStrip.tiles as tile, i (tile.src)}
				<li class="rj-ig-cell">
					<a class="rj-ig-tile" href={instagramStrip.href} target="_blank" rel="noopener noreferrer">
						<img src={tile.src} alt={tile.alt} loading="lazy" decoding="async" />
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	/* 1:6323 — #fafafa band, 61/50 padding. */
	.rj-ig {
		width: 100%;
		padding: 50px 61px;
		background: #fafafa;
	}

	.rj-ig-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 55px;
		width: 100%;
		margin: 0 auto;
	}

	.rj-ig-head {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 482px;
		max-width: 100%;
		text-align: center;
	}

	.rj-ig-eyebrow {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 22px;
		line-height: 38px;
		color: var(--rj-gold, #cca646);
	}

	.rj-ig-heading {
		margin: 0;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 32px;
		font-weight: 400;
		line-height: 28px;
		/* app.css tracks all h1–h6 at 0.8px; this source node has none. */
		letter-spacing: normal;
		text-transform: capitalize;
		color: var(--rj-heading, #202020);
		white-space: nowrap;
	}

	/* 1:6328 — six 203×251 tiles with a 20 gutter. */
	.rj-ig-grid {
		display: flex;
		align-items: center;
		gap: 20px;
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rj-ig-cell {
		flex: 1 1 0;
		min-width: 0;
	}

	.rj-ig-tile {
		display: block;
		width: 100%;
		aspect-ratio: 203 / 251;
		border-radius: 5px;
		overflow: hidden;
	}

	.rj-ig-tile img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s var(--rj-ease, ease);
	}

	.rj-ig-tile:hover img {
		transform: scale(1.05);
	}

	@media (max-width: 1279px) {
		.rj-ig {
			padding: 50px 40px;
		}
	}

	/* Tablet 744 — five 124×153 tiles, 16 gutter, heading 33/28 (63:40959). */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-ig {
			height: 319px;
			padding: 30px;
		}

		.rj-ig-inner {
			gap: 35px;
			max-width: 684px;
		}

		.rj-ig-eyebrow {
			font-size: 20px;
			line-height: normal;
		}

		.rj-ig-heading {
			font-size: 28px;
		}

		.rj-ig-grid {
			gap: 16px;
		}

		.rj-ig-tile {
			aspect-ratio: 124 / 153;
		}

		/* the tablet frame drops the sixth tile */
		.rj-ig-cell:last-child {
			display: none;
		}
	}

	/* Tablet landscape 114:59529 — six 124×153 tiles in a 319px band. */
	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-ig {
			min-height: 319px;
			margin-top: 50px;
			padding: 30px;
		}

		.rj-ig-inner {
			gap: 35px;
		}

		.rj-ig-eyebrow {
			font-size: 20px;
			line-height: normal;
		}

		.rj-ig-heading {
			font-size: 28px;
		}

		.rj-ig-grid {
			gap: 16px;
			width: 824px;
			max-width: 100%;
		}

		.rj-ig-tile {
			aspect-ratio: 124 / 153;
		}
	}

	/* Mobile 412 — five 64×79 tiles distributed across the 372px content row. */
	@media (max-width: 639px) {
		.rj-ig {
			padding: 20px;
		}

		.rj-ig-inner {
			gap: 18px;
		}

		.rj-ig-head {
			justify-content: space-between;
			gap: 0;
			height: 47px;
			padding: 0;
		}

		.rj-ig-eyebrow {
			font-size: 14px;
			line-height: normal;
		}

		.rj-ig-heading {
			font-size: 18px;
			line-height: 28px;
		}

		.rj-ig-grid {
			justify-content: space-between;
			gap: 0;
			height: 79px;
			padding: 0;
			overflow: visible;
		}

		.rj-ig-cell {
			flex: 0 0 auto;
			height: 100%;
			aspect-ratio: 203 / 251;
		}

		.rj-ig-tile {
			height: 100%;
		}
	}

	@media (max-width: 363px) {
		.rj-ig-cell {
			flex: 1 1 0;
			height: auto;
		}

		.rj-ig-tile {
			height: auto;
			aspect-ratio: 203 / 251;
		}
	}
</style>
