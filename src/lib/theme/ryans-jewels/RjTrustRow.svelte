<script lang="ts">
	/**
	 * Trust badges + slide counter.
	 * Source: 1:5497 (desktop, one row with the counter pushed right),
	 *         63:40035 + 63:40050 (tablet, counter centred above the row),
	 *         77:106850 (mobile, counter above, badges wrap 2 + 1).
	 */
	import { trustBadges, ryansJewelsHome } from './home-content.js'

	let { slideLabel = ryansJewelsHome.hero.slideLabel }: { slideLabel?: string } = $props()
</script>

{#snippet counter()}
	<div class="rj-slides" aria-label="Slide {slideLabel}">
		<span class="rj-slide-arrow rj-slide-arrow--prev" aria-hidden="true"></span>
		<span class="rj-slide-label">{slideLabel}</span>
		<span class="rj-slide-arrow rj-slide-arrow--next" aria-hidden="true"></span>
	</div>
{/snippet}

<div class="rj-trust">
	<div class="rj-trust-counter-top">{@render counter()}</div>

	<ul class="rj-trust-list">
		{#each trustBadges as badge}
			<li class="rj-trust-item rj-trust-item--{badge.key}">
				<img
					class="rj-trust-icon"
					src={badge.icon}
					alt=""
					width={badge.d.w}
					height={badge.d.h}
					style="--dw:{badge.d.w}px; --dh:{badge.d.h}px; --mw:{badge.m.w}px; --mh:{badge.m.h}px;"
				/>
				<span class="rj-trust-label">{badge.label}</span>
			</li>
		{/each}
	</ul>

	<div class="rj-trust-counter-side">{@render counter()}</div>
</div>

<style>
	.rj-trust {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		width: 100%;
	}

	.rj-trust-list {
		display: flex;
		align-items: center;
		gap: 30px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rj-trust-item {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.rj-trust-icon {
		width: var(--dw);
		height: var(--dh);
		flex-shrink: 0;
	}

	.rj-trust-label {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: normal;
		color: var(--rj-ink, #404040);
		white-space: nowrap;
	}

	/* Slide counter — 40px rule with an arrowhead at the outer end (1:5514). */
	.rj-slides {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.rj-slide-label {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: normal;
		color: var(--rj-ink, #404040);
	}

	.rj-slide-arrow {
		position: relative;
		display: block;
		width: 40px;
		height: 1.5px;
		background: #000;
		flex-shrink: 0;
	}

	.rj-slide-arrow::before {
		content: '';
		position: absolute;
		top: 50%;
		width: 0;
		height: 0;
		border-top: 4.33px solid transparent;
		border-bottom: 4.33px solid transparent;
		transform: translateY(-50%);
	}

	.rj-slide-arrow--prev::before {
		left: 0;
		border-right: 7.5px solid #000;
	}

	.rj-slide-arrow--next::before {
		right: 0;
		border-left: 7.5px solid #000;
	}

	.rj-trust-counter-top {
		display: none;
	}

	/* Tablet 744 — counter moves above, centred (63:40050); badges gap 37. */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-trust {
			flex-direction: column;
			gap: 15px;
		}

		.rj-trust-counter-top {
			display: block;
		}

		.rj-trust-counter-side {
			display: none;
		}

		.rj-trust-list {
			width: 100%;
			justify-content: space-between;
			gap: 37px;
		}
	}

	/* Mobile 412 — 13px labels, first two badges split, support centred below. */
	@media (max-width: 639px) {
		.rj-trust {
			gap: 20px;
		}

		.rj-trust-list {
			flex-wrap: wrap;
			justify-content: space-between;
			row-gap: 16px;
			gap: 0;
		}

		.rj-trust-item {
			gap: 8px;
		}

		.rj-trust-item--support {
			width: 100%;
			justify-content: center;
		}

		.rj-trust-icon {
			width: var(--mw);
			height: var(--mh);
		}

		.rj-trust-label {
			font-size: 13px;
		}

		.rj-slide-label {
			font-size: 14px;
		}

		.rj-slide-arrow {
			width: 25px;
		}
	}
</style>
