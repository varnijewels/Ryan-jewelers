<script lang="ts">
	/**
	 * Section 9 — "Create your personalised name Plate!" + top-rated collection.
	 *
	 * Source frames
	 *   desktop  bg 1:6110 (0,3323 · 1440×600) · panel 1:6111 (0,3323 · 598×600)
	 *            cluster 1:6112 · heading 1:6121 · art 1:6122 · panel CTA 1:6126
	 *            head 1:6127 (632,3364 · 748×60) · cards 1:6133 / 1:6161 / 1:6147
	 *   tablet   63:40549 — panel 63:40551 full-width band, content 63:40566
	 *   mobile   panel 77:107373 (0,2608 · 412×213), content 77:107388
	 *
	 * Desktop puts the violet panel beside the collection column; tablet and
	 * mobile stack the panel above it as a full-width band.
	 *
	 * The panel CTA deliberately overlaps the bottom of the name-plate render —
	 * the source has it sitting over the reflection.
	 */
	import RjCustomiseCard from './RjCustomiseCard.svelte'
	import RjArrowRule from './RjArrowRule.svelte'
	import RjDiamondCluster from './RjDiamondCluster.svelte'
	import { namePlate } from './home-content.js'

	const { background, panel, eyebrow, title, ctaLabel, ctaHref, cards } = namePlate
	let track = $state<HTMLUListElement | null>(null)

	function scrollProducts(direction: -1 | 1) {
		track?.scrollBy({ left: direction * Math.max(track.clientWidth * .8, 280), behavior: 'smooth' })
	}
</script>

<section
	class="rj-plate"
	style="background-image: url({background})"
	aria-labelledby="rj-plate-heading"
>
	<div class="rj-plate-inner">
		<div class="rj-plate-panel" style="background-image: url({panel.background})">
			<div class="rj-plate-panel-body">
				<RjDiamondCluster />
				<h2 class="rj-plate-title" id="rj-plate-heading">{panel.heading}</h2>
				<span class="rj-plate-art">
					<img class="rj-plate-art-img" src={panel.art} alt={panel.artAlt} loading="lazy" decoding="async" />
				</span>
				<a class="rj-plate-panel-cta" href={panel.href}>{panel.cta}</a>
			</div>
		</div>

		<div class="rj-plate-collection">
			<div class="rj-plate-head">
				<div class="rj-plate-head-text">
					<p class="rj-plate-eyebrow">{eyebrow}</p>
					<p class="rj-plate-lede">{title}</p>
				</div>
				<a class="rj-plate-button" href={ctaHref}>{ctaLabel}</a>
			</div>

			<ul class="rj-plate-cards" bind:this={track}>
				{#each cards as card (card.key)}
					<li class="rj-plate-card"><RjCustomiseCard {card} /></li>
				{/each}
			</ul>

			<div class="rj-plate-arrows"><RjArrowRule gap={20} onprevious={() => scrollProducts(-1)} onnext={() => scrollProducts(1)} /></div>
		</div>
	</div>
</section>

<style>
	/* ---- shell ---------------------------------------------------------- */
	.rj-plate {
		width: 100%;
		background-color: #fafafa;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.rj-plate-inner {
		display: flex;
		align-items: stretch;
		margin: 0 auto;
		min-height: 600px;
	}

	/* ---- violet panel --------------------------------------------------- */
	/* 1:6111 — 598×600, radius 5 on the right corners only. */
	.rj-plate-panel {
		flex: 0 0 598px;
		max-width: 598px;
		border-radius: 0 5px 5px 0;
		background-color: #0b0320;
		background-size: cover;
		background-position: center;
		overflow: hidden;
	}

	.rj-plate-panel-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 41px 3px 51px;
	}

	/* 1:6121 — Red Rose 32/40, white, centred in a 406 box. */
	.rj-plate-title {
		width: 406px;
		max-width: 100%;
		margin: 32px 0 0;
		font-family: 'Red Rose', var(--font-body, sans-serif);
		font-size: 32px;
		font-weight: 400;
		line-height: 40px;
		/* app.css tracks all h1–h6 at 0.8px; the source node has none, and the
		   extra tracking pushes this headline onto a third line. */
		letter-spacing: normal;
		text-align: center;
		text-transform: capitalize;
		color: #fff;
	}

	/* 1:6122 — 592×254 window onto an over-scaled square render. */
	.rj-plate-art {
		position: relative;
		display: block;
		width: 592px;
		max-width: 100%;
		aspect-ratio: 592 / 254;
		margin-top: 52px;
		overflow: hidden;
	}

	.rj-plate-art-img {
		position: absolute;
		left: 4.68%;
		top: -79.3%;
		width: 90.8%;
		height: auto;
		max-width: none;
	}

	/* 1:6126 — sits 27px over the bottom of the render. */
	.rj-plate-panel-cta {
		margin-top: -27px;
		font-family: 'Red Rose', var(--font-body, sans-serif);
		font-size: 32px;
		font-weight: 400;
		line-height: 40px;
		text-align: center;
		text-transform: capitalize;
		color: #fff;
		text-decoration: none;
		transition: opacity 0.18s ease;
	}

	.rj-plate-panel-cta:hover {
		opacity: 0.82;
	}

	/* ---- collection column ---------------------------------------------- */
	.rj-plate-collection {
		position: relative;
		flex: 1 1 auto;
		min-width: 0;
		padding: 41px 60px 0 34px;
	}

	/* 1:6127 — 748×60, text left, gold button right. */
	.rj-plate-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}

	.rj-plate-head-text {
		display: flex;
		flex-direction: column;
		width: 329px;
	}

	.rj-plate-eyebrow {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		font-weight: 700;
		line-height: 30px;
		letter-spacing: 0.48px;
		text-transform: uppercase;
		color: var(--rj-gold, #cca646);
	}

	.rj-plate-lede {
		margin: 0;
		font-family: 'Red Rose', var(--font-body, sans-serif);
		font-size: 22px;
		font-weight: 400;
		line-height: 30px;
		text-align: center;
		text-transform: capitalize;
		color: var(--rj-heading, #202020);
	}

	/* 1:6131 — gold rectangle, radius 2, 10/18 padding. */
	.rj-plate-button {
		flex-shrink: 0;
		padding: 10px 18px;
		border-radius: 2px;
		background: var(--rj-gold, #cca646);
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		font-weight: 700;
		line-height: 30px;
		letter-spacing: 0.08px;
		text-align: center;
		text-transform: uppercase;
		color: #fff;
		text-decoration: none;
		white-space: nowrap;
		transition: filter 0.18s ease;
	}

	.rj-plate-button:hover {
		filter: brightness(0.94);
	}

	/* Figma 341:55580 — 222px cards with 30px gutters. */
	.rj-plate-cards {
		display: flex;
		justify-content: flex-start;
		gap: 30px;
		margin: 49px 0 0;
		padding: 0 0 0 22px;
		overflow-x: auto;
		scrollbar-width: none;
		list-style: none;
	}

	.rj-plate-cards::-webkit-scrollbar {
		display: none;
	}

	.rj-plate-card {
		display: block;
	}

	@media (min-width: 1670px) {
		.rj-plate-cards {
			justify-content: center;
			padding-left: 0;
		}
	}

	.rj-plate-arrows {
		position: absolute;
		right: 60px;
		bottom: 31px;
	}

	/* ---- 1024–1279: keep the split, tighten the gutters ------------------ */
	@media (max-width: 1279px) {
		.rj-plate-panel {
			flex: 0 1 520px;
		}

		.rj-plate-collection {
			padding: 41px 40px 0 30px;
		}

		.rj-plate-cards {
			gap: 20px;
		}

		.rj-plate-arrows {
			right: 40px;
		}
	}

	/* ---- tablet 744 (63:40549) ------------------------------------------ */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-plate {
			height: 790px;
			overflow: hidden;
		}

		.rj-plate-inner {
			flex-direction: column;
			max-width: 744px;
			min-height: 0;
		}

		.rj-plate-arrows {
			display: none;
		}

		.rj-plate-panel {
			flex: none;
			max-width: none;
			height: 330px;
			border-radius: 0;
		}

		.rj-plate-panel-body {
			padding: 20px 102px;
		}

		.rj-plate-title {
			width: 218px;
			margin-top: 15px;
			font-size: 17px;
			line-height: 21px;
		}

		.rj-plate-art {
			width: 540px;
			aspect-ratio: 540 / 162;
			margin-top: -5px;
		}

		.rj-plate-art-img {
			top: -113.13%;
		}

		.rj-plate-panel-cta {
			margin-top: -29px;
			font-size: 22px;
		}

		.rj-plate-collection {
			padding: 40px 25px 20px;
		}

		.rj-plate-cards {
			justify-content: space-between;
			gap: 14px;
			margin-top: 29px;
			padding-left: 0;
		}
	}

	/* 114:59112 — stacked 330px panel and 460px product collection. */
	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-plate {
			margin-top: 50px;
		}

		.rj-plate-inner {
			flex-direction: column;
			min-height: 790px;
		}

		.rj-plate-arrows {
			display: none;
		}

		.rj-plate-panel {
			flex: none;
			max-width: none;
			height: 330px;
			margin: 0 25px;
			border-radius: 0;
		}

		.rj-plate-panel-body {
			padding: 20px 102px;
		}

		.rj-plate-title {
			width: 218px;
			margin-top: 15px;
			font-size: 17px;
			line-height: 21px;
		}

		.rj-plate-art {
			width: 540px;
			aspect-ratio: 540 / 162;
			margin-top: -5px;
		}

		.rj-plate-art-img {
			top: -113.13%;
		}

		.rj-plate-panel-cta {
			margin-top: -29px;
			font-size: 22px;
		}

		.rj-plate-collection {
			flex: 1 1 auto;
			padding: 40px 40px 20px;
		}

		.rj-plate-cards {
			justify-content: space-between;
			gap: 14px;
			margin-top: 29px;
			padding-left: 0;
		}
	}

	/* ---- mobile 412 (77:107373 + 77:107388) ----------------------------- */
	@media (max-width: 639px) {
		.rj-plate-panel {
			height: 213px;
		}

		.rj-plate-panel-body {
			padding: 19px 118px;
			width: 100%;
		}

		.rj-plate-title {
			width: 140px;
			margin-top: 15px;
			font-size: 11px;
			line-height: normal;
		}

		.rj-plate-art {
			width: 100%;
			aspect-ratio: 121 / 45;
			margin-top: 4px;
		}

		.rj-plate-art-img {
			left: -27.86%;
			top: -176.92%;
			width: 157.59%;
		}

		.rj-plate-panel-cta {
			margin-top: 4px;
			font-size: 14px;
			line-height: normal;
		}

		.rj-plate-collection {
			padding: 25px 0 0;
		}

		.rj-plate-head {
			padding: 0 15px;
			gap: 12px;
		}

		.rj-plate-eyebrow {
			font-size: 14px;
			line-height: normal;
			letter-spacing: 0.42px;
		}

		.rj-plate-lede {
			font-size: 12px;
			line-height: normal;
		}

		.rj-plate-button {
			padding: 10px 14px;
			border-radius: 4px;
			font-size: 14px;
			font-weight: 400;
			line-height: normal;
			letter-spacing: 0.07px;
		}

		/* 3×164 + 2×14 overflows 382, so the row scrolls like the source. */
		.rj-plate-cards {
			justify-content: flex-start;
			gap: 14px;
			margin-top: 25px;
			padding: 0 15px;
			overflow-x: auto;
			scroll-snap-type: x proximity;
			scrollbar-width: none;
		}

		.rj-plate-cards::-webkit-scrollbar {
			display: none;
		}

		.rj-plate-card {
			scroll-snap-align: start;
		}
	}
</style>
