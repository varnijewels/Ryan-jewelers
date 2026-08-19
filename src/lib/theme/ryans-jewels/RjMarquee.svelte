<script lang="ts">
	/**
	 * Gold scrolling strip. Two variants from the source:
	 *   "shapes"   — 1:5757  / 63:40436 / 77:107114  (icon + "<cut> Jewellery", 42px star)
	 *   "taglines" — 1:5870  / 63:40617 / 77:107439  (text only, 46x49 sparkle)
	 *
	 * The source frames are wider than the viewport (3220 / 2658 / 1860 px), i.e.
	 * they are meant to scroll. The track is duplicated once and translated by
	 * -50% so the loop is seamless; it pauses on hover and respects
	 * prefers-reduced-motion.
	 */
	import { marqueeShapes, marqueeTaglines } from './home-content.js'

	let { variant = 'shapes', duration = 40 }: { variant?: 'shapes' | 'taglines'; duration?: number } = $props()
</script>

{#snippet shapeGroup()}
	{#each marqueeShapes as item (item.key)}
		<span class="rj-mq-item">
			<img
				class="rj-mq-icon"
				src="/ryans-jewels/marquee/{item.key}.svg"
				alt=""
				style="--hd:{item.hd}px; --hm:{item.hm}px; {item.rot ? `--rot:${item.rot}deg;` : ''}"
			/>
			<span class="rj-mq-text">{item.label}</span>
		</span>
		<img class="rj-mq-star" src="/ryans-jewels/marquee/star.svg" alt="" aria-hidden="true" />
	{/each}
{/snippet}

{#snippet taglineGroup()}
	{#each marqueeTaglines as line}
		<span class="rj-mq-text">{line}</span>
		<img class="rj-mq-star rj-mq-star--sparkle" src="/ryans-jewels/marquee/sparkle.svg" alt="" aria-hidden="true" />
	{/each}
{/snippet}

<div class="rj-mq rj-mq--{variant}" style="--rj-mq-duration:{duration}s">
	<div class="rj-mq-track">
		<div class="rj-mq-group">
			{#if variant === 'shapes'}{@render shapeGroup()}{:else}{@render taglineGroup()}{/if}
		</div>
		<div class="rj-mq-group" aria-hidden="true">
			{#if variant === 'shapes'}{@render shapeGroup()}{:else}{@render taglineGroup()}{/if}
		</div>
	</div>
</div>

<style>
	.rj-mq {
		width: 100%;
		overflow: hidden;
		background: var(--rj-gold, #cca646);
	}

	.rj-mq-track {
		display: flex;
		width: max-content;
		animation: rj-mq-scroll var(--rj-mq-duration, 40s) linear infinite;
	}

	.rj-mq:hover .rj-mq-track {
		animation-play-state: paused;
	}

	@keyframes rj-mq-scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-mq-track {
			animation: none;
		}

		.rj-mq {
			overflow-x: auto;
			scrollbar-width: none;
		}
	}

	.rj-mq-group {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	/* --- shapes variant: padding 26/53, item gap 25, icon->text 22 --- */
	.rj-mq--shapes .rj-mq-group {
		gap: 25px;
		padding: 26px 0 26px 25px;
	}

	.rj-mq--shapes .rj-mq-group:first-child {
		padding-left: 53px;
	}

	.rj-mq-item {
		display: flex;
		align-items: center;
		gap: 22px;
		flex-shrink: 0;
		text-decoration: none;
	}

	.rj-mq-icon {
		display: block;
		width: auto;
		height: var(--hd);
		flex-shrink: 0;
		transform: rotate(var(--rot, 0deg));
	}

	.rj-mq-text {
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 32px;
		line-height: 38px;
		color: #fff;
		white-space: nowrap;
	}

	.rj-mq--shapes .rj-mq-text {
		font-size: 27px;
	}

	.rj-mq-star {
		display: block;
		width: auto;
		height: 42px;
		flex-shrink: 0;
	}

	/* --- taglines variant: padding 23/28, gap 25, sparkle 46x49 --- */
	.rj-mq--taglines .rj-mq-group {
		gap: 25px;
		padding: 23px 0 23px 25px;
	}

	.rj-mq--taglines .rj-mq-group:first-child {
		padding-left: 28px;
	}

	.rj-mq--taglines .rj-mq-text {
		line-height: 39px;
	}

	.rj-mq-star--sparkle {
		height: 49px;
	}

	/* Tablet 744 — shapes 26/38 text, 16px 35px pad; taglines 24/39, 16px 28px. */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-mq--taglines {
			margin-top: 40px;
		}

		.rj-mq--shapes .rj-mq-group {
			padding-top: 16px;
			padding-bottom: 16px;
		}

		.rj-mq--shapes .rj-mq-group:first-child {
			padding-left: 35px;
		}

		.rj-mq--shapes .rj-mq-text {
			font-size: 21px;
		}

		.rj-mq-star {
			height: 40px;
		}

		.rj-mq--taglines .rj-mq-group {
			padding-top: 16px;
			padding-bottom: 16px;
		}

		.rj-mq--taglines .rj-mq-text {
			font-size: 24px;
		}

		.rj-mq-star--sparkle {
			height: 49px;
		}
	}

	/* 114:58957 — landscape tablet keeps the desktop artwork at a 72px strip. */
	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-mq--taglines {
			margin-top: 50px;
		}

		.rj-mq--shapes .rj-mq-group {
			padding-top: 16px;
			padding-bottom: 16px;
		}

		.rj-mq--shapes .rj-mq-group:first-child {
			padding-left: 35px;
		}

		.rj-mq--shapes .rj-mq-text {
			font-size: 21px;
		}

		.rj-mq--shapes .rj-mq-star {
			height: 40px;
		}
	}

	/* Mobile 412 — shapes 18px text, 12px 25px pad, gap 12; taglines 18/39, 12px 15px. */
	@media (max-width: 639px) {
		.rj-mq--shapes .rj-mq-group {
			gap: 12px;
			padding: 12px 0 12px 12px;
		}

		.rj-mq--shapes .rj-mq-group:first-child {
			padding-left: 25px;
		}

		.rj-mq-item {
			gap: 12px;
		}

		.rj-mq-icon {
			height: var(--hm);
		}

		.rj-mq--shapes .rj-mq-text {
			font-size: 13px;
			line-height: normal;
		}

		.rj-mq-star {
			height: 40px;
		}

		.rj-mq--taglines .rj-mq-group {
			gap: 12px;
			padding: 12px 0 12px 12px;
		}

		.rj-mq--taglines .rj-mq-group:first-child {
			padding-left: 15px;
		}

		.rj-mq--taglines .rj-mq-text {
			font-size: 18px;
			line-height: 39px;
		}

		.rj-mq-star--sparkle {
			height: 26px;
		}
	}
</style>
