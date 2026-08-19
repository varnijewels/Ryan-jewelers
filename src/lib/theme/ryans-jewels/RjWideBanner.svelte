<script lang="ts">
	/**
	 * Section 12 — "Glamorous Gifts" wide banner.
	 *
	 * Source frames
	 *   desktop 1:6201 (60,5124 · 1320×360) — inset card, radius 5, px 24,
	 *           content row centred: 648 text column, gap 50, 485×359 cutout
	 *   tablet  63:40625 (0,4797 · 744×202) — full-bleed, space-between
	 *   mobile  77:107518 (0,3974 · 412×133) — full-bleed, px 12
	 *
	 * The model cutout is a fixed window onto an over-scaled PNG; the same
	 * percentages (w 100%, top -66.34%) hold at all three breakpoints.
	 *
	 * Tablet and mobile draw the button with the unthemed `--primary-color`
	 * fallback in Figma; the themed desktop gold is used everywhere instead.
	 */
	import { wideBanner } from './home-content.js'

	interface Props {
		eyebrow?: string
		heading?: string
		subheading?: string
		ctaLabel?: string
		ctaHref?: string
		background?: string
		image?: string
		imageAlt?: string
		centered?: boolean
	}

	const {
		eyebrow = wideBanner.eyebrow,
		heading = wideBanner.heading,
		subheading = wideBanner.subheading,
		ctaLabel = wideBanner.ctaLabel,
		ctaHref = wideBanner.ctaHref,
		background = wideBanner.background,
		image = wideBanner.image,
		imageAlt = wideBanner.imageAlt,
		centered = false
	}: Props = $props()
</script>

<section class="rj-banner" class:is-centered={centered} aria-labelledby="rj-banner-heading">
	<div class="rj-banner-card" style="background-image: url({background})">
		<div class="rj-banner-row" class:is-centered={centered}>
			<div class="rj-banner-text">
				<div class="rj-banner-copy">
					<div class="rj-banner-lines">
						<p class="rj-banner-eyebrow">{eyebrow}</p>
						<h2 class="rj-banner-heading" id="rj-banner-heading">{heading}</h2>
					</div>
					<p class="rj-banner-sub">{subheading}</p>
				</div>

				<a class="rj-banner-cta" href={ctaHref}>
					<span>{ctaLabel}</span>
					<img src="/ryans-jewels/home/arrow-right-white.svg" alt="" aria-hidden="true" />
				</a>
			</div>

			{#if !centered}
				<span class="rj-banner-cutout">
					<img src={image} alt={imageAlt} loading="lazy" decoding="async" />
				</span>
			{/if}
		</div>
	</div>
</section>

<style>
	/* The card is inset 60 from both page edges (1:6201 sits at x60, w1320). */
	.rj-banner {
		width: 100%;
		padding: 50px 60px;
		background: #fff;
	}

	.rj-banner.is-centered {
		padding: 0;
	}

	.rj-banner.is-centered .rj-banner-card {
		border-radius: 0;
	}

	.rj-banner-card {
		position: relative;
		display: flex;
		justify-content: center;
		margin: 0 auto;
		padding: 0 24px;
		height: 360px;
		border-radius: 5px;
		background-color: #f3f1ee;
		background-size: cover;
		background-position: center;
		overflow: hidden;
	}

	.rj-banner-row {
		display: flex;
		align-items: center;
		gap: 3.9308%;
		width: 100%;
	}

	.rj-banner-row.is-centered {
		justify-content: center;
	}

	.is-centered .rj-banner-text {
		flex: 0 1 760px;
		align-items: center;
		text-align: center;
	}

	.is-centered .rj-banner-heading,
	.is-centered .rj-banner-sub {
		max-width: 760px;
	}

	/* 1:6203 — 648 wide, 50 between the copy block and the button. */
	.rj-banner-text {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 50px;
		flex: 1 1 auto;
		min-width: 0;
	}

	.rj-banner-copy {
		display: flex;
		flex-direction: column;
		gap: 18px;
		width: 100%;
	}

	.rj-banner-lines {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.rj-banner-eyebrow {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 20px;
		font-weight: 700;
		line-height: 38px;
		color: var(--rj-gold, #cca646);
	}

	.rj-banner-heading {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 32px;
		font-weight: 400;
		line-height: 46px;
		/* app.css tracks all h1–h6 at 0.8px; this source node has none. */
		letter-spacing: normal;
		color: #000;
	}

	.rj-banner-sub {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: 1;
		color: var(--rj-ink-2, #606060);
	}

	/* 1:6209 — gold rectangle, radius 2, label + 24px arrow. */
	.rj-banner-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 10px 18px;
		border-radius: 2px;
		background: var(--rj-gold, #cca646);
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 18px;
		font-weight: 700;
		line-height: 32px;
		text-transform: capitalize;
		color: #fff;
		text-decoration: none;
		white-space: nowrap;
		transition: filter 0.18s ease;
	}

	.rj-banner-cta:hover {
		filter: brightness(0.94);
	}

	.rj-banner-cta img {
		width: 24px;
		height: 24px;
		transition: transform 0.2s var(--rj-ease, ease);
	}

	.rj-banner-cta:hover img {
		transform: translateX(3px);
	}

	/* 1:6212 — 485×359 window onto an over-scaled cutout. */
	.rj-banner-cutout {
		position: relative;
		display: block;
		width: 38.1289%;
		aspect-ratio: 485 / 359;
		flex-shrink: 0;
		overflow: hidden;
	}

	.rj-banner-cutout img {
		position: absolute;
		left: 0;
		top: -66.34%;
		width: 100%;
		height: auto;
		max-width: none;
	}

	@media (max-width: 1279px) {
		.rj-banner {
			padding: 50px 40px;
		}

		.rj-banner-text {
			width: auto;
			flex: 1 1 auto;
			min-width: 0;
		}

		.rj-banner-cutout {
			width: 400px;
		}
	}

	/* ---- tablet 744 (63:40625) — full-bleed, 202 tall ------------------- */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-banner {
			padding: 40px 0 0;
		}

		.rj-banner-card {
			height: 202px;
			max-width: none;
			justify-content: flex-start;
		}

		.rj-banner-row {
			width: 100%;
			justify-content: space-between;
			gap: 24px;
		}

		.rj-banner-text {
			gap: 20px;
			padding: 5px 0;
		}

		.rj-banner-copy {
			gap: 12px;
		}

		.rj-banner-lines {
			gap: 9px;
		}

		.rj-banner-eyebrow {
			font-size: 14px;
			line-height: normal;
		}

		.rj-banner-heading {
			max-width: 274px;
			font-size: 18px;
			line-height: normal;
		}

		.rj-banner-sub {
			font-size: 12px;
		}

		.rj-banner-cta {
			gap: 7px;
			padding: 8px 14px;
			font-size: 14px;
			font-weight: 400;
			line-height: normal;
		}

		.rj-banner-cta img {
			width: 20px;
			height: 20px;
		}

		.rj-banner-cutout {
			width: 273px;
			height: 202px;
		}
	}

	/* 114:59297 — 974×247 inset landscape banner. */
	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-banner {
			padding: 50px 25px 0;
		}

		.rj-banner-card {
			height: 247px;
			justify-content: flex-start;
		}

		.rj-banner-row {
			justify-content: space-between;
			gap: 24px;
		}

		.rj-banner-text {
			gap: 20px;
			padding: 5px 0;
		}

		.rj-banner-copy {
			gap: 12px;
		}

		.rj-banner-lines {
			gap: 9px;
		}

		.rj-banner-eyebrow {
			font-size: 14px;
			line-height: normal;
		}

		.rj-banner-heading {
			max-width: 420px;
			font-size: 24px;
			line-height: normal;
		}

		.rj-banner-sub {
			font-size: 14px;
		}

		.rj-banner-cta {
			gap: 7px;
			padding: 8px 14px;
			font-size: 14px;
			font-weight: 400;
			line-height: normal;
		}

		.rj-banner-cta img {
			width: 20px;
			height: 20px;
		}

		.rj-banner-cutout {
			width: 335px;
			height: 247px;
		}
	}

	/* ---- mobile 412 (77:107518) — full-bleed, 133 tall ------------------ */
	@media (max-width: 639px) {
		.rj-banner {
			padding: 25px 0;
		}

		.rj-banner-card {
			height: 133px;
			padding: 0 12px;
		}

		.rj-banner-row {
			gap: 12px;
		}

		.rj-banner-text {
			gap: 13px;
			padding: 0;
		}

		.rj-banner-copy {
			gap: 10px;
		}

		.rj-banner-lines {
			gap: 5px;
		}

		.rj-banner-eyebrow {
			font-size: 10px;
		}

		.rj-banner-heading {
			max-width: 200px;
			font-size: 13px;
			line-height: 18px;
		}

		.rj-banner-sub {
			max-width: 193px;
			font-size: 11px;
		}

		.rj-banner-cta {
			gap: 5px;
			padding: 6px 10px;
			font-size: 11px;
		}

		.rj-banner-cta img {
			width: 14px;
			height: 14px;
		}

		.rj-banner-cutout {
			width: auto;
			height: 133px;
			aspect-ratio: 447 / 331;
		}
	}
</style>
