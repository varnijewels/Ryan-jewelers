<script lang="ts">
	/**
	 * Section 7 — "Designed with rare passion".
	 *
	 * Source frames
	 *   desktop  bg 1:5871 (0,1953 · 1440×686) · text+stats 1:6177 (61,2053 · 712×387)
	 *            image group 1:5873 (card 1:5874 933,2003 · 424×567, badge 1:5876 914,2473)
	 *   tablet   63:40291 (11,1547 · 713×793)
	 *   mobile   77:107227 (15,1438 · 382×734)
	 *
	 * Desktop is a two-column split: text + stats on the left, image card on the
	 * right sitting 50px higher than the text. Tablet and mobile stack
	 * text → card → stats, which is why `.rj-passion-col` collapses to
	 * `display: contents` below 1024 — that lets `order` interleave the card
	 * between the two halves of the left column without duplicating markup.
	 *
	 * The "30% Off" hexagon overhangs the card's bottom-left corner at every
	 * breakpoint; `.rj-passion-media` carries that overhang as padding so it stays
	 * part of the flow (source group is 586 tall for a 567 card).
	 *
	 * Copy, image paths and per-breakpoint icon boxes come from ./home-content.ts.
	 */
	import { rarePassion } from './home-content.js'

	const { eyebrow, heading, leadBefore, leadStrong, leadAfter, body, image, imageAlt, badge, stats } =
		rarePassion
</script>

<section class="rj-passion" aria-labelledby="rj-passion-heading">
	<div class="rj-passion-inner">
		<div class="rj-passion-col">
			<div class="rj-passion-text">
				<p class="rj-passion-eyebrow">{eyebrow}</p>
				<div class="rj-passion-copy">
					<h2 class="rj-passion-heading" id="rj-passion-heading">{heading}</h2>
					<p class="rj-passion-lead">
						{leadBefore}<strong class="rj-passion-strong">{leadStrong}</strong>{leadAfter}
					</p>
					<p class="rj-passion-body">{body}</p>
				</div>
			</div>

			<ul class="rj-passion-stats">
				{#each stats as stat (stat.key)}
					<li
						class="rj-passion-stat rj-passion-stat--{stat.key}"
						style="--dw:{stat.d.w}px; --dh:{stat.d.h}px; --tw:{stat.t.w}px; --th:{stat.t
							.h}px; --mw:{stat.m.w}px; --mh:{stat.m.h}px;"
					>
						<img class="rj-passion-stat-icon" src={stat.icon} alt="" aria-hidden="true" />
						<span class="rj-passion-stat-text">
							<span class="rj-passion-stat-value">{stat.value}</span>
							<span class="rj-passion-stat-label">{stat.label}</span>
						</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="rj-passion-media">
			<figure class="rj-passion-card">
				<img class="rj-passion-photo" src={image} alt={imageAlt} loading="lazy" decoding="async" fetchpriority="low" />
				<span class="rj-passion-frame" aria-hidden="true"></span>
			</figure>
			<div class="rj-passion-badge">
				<img class="rj-passion-badge-shape" src={badge.shape} alt="" aria-hidden="true" />
				<span class="rj-passion-badge-text">
					<span class="rj-passion-badge-value">{badge.value}</span>
					<span class="rj-passion-badge-label">{badge.label}</span>
				</span>
			</div>
		</div>
	</div>
</section>

<style>
	/* ---- section shell -------------------------------------------------- */
	/* 1:5871 — full-bleed #fafafa band, 686 tall at 1440. */
	.rj-passion {
		width: 100%;
		background: #fafafa;
	}

	/*
	 * Desktop gutters are asymmetric in the source: text starts at x61 and the
	 * card ends at x1357, so 61 + 712 + 160 + 424 + 83 = 1440.
	 */
	.rj-passion-inner {
		display: flex;
		align-items: flex-start;
		gap: 12.3457%;
		margin: 0 auto;
		padding: 50px 83px 50px 61px;
	}

	.rj-passion-col {
		display: flex;
		flex-direction: column;
		gap: 60px;
		flex: 1 1 auto;
		min-width: 0;
		/* 1:6177 starts 50px below the card (y2053 vs y2003). */
		margin-top: 50px;
		order: 1;
	}

	/* ---- text ----------------------------------------------------------- */
	.rj-passion-text {
		display: flex;
		flex-direction: column;
		gap: 12px;
		order: 1;
	}

	.rj-passion-eyebrow {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 24px;
		font-weight: 400;
		line-height: 28px;
		color: var(--rj-gold, #cca646);
	}

	.rj-passion-copy {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.rj-passion-heading {
		margin: 0;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 38px;
		font-weight: 400;
		line-height: 42px;
		/* app.css tracks all h1–h6 at 0.8px; this source node has none. */
		letter-spacing: normal;
		text-transform: capitalize;
		color: #000;
	}

	.rj-passion-lead,
	.rj-passion-body {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		font-weight: 400;
		line-height: 29px;
		letter-spacing: 0.32px;
		color: #707070;
	}

	.rj-passion-strong {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-weight: 700;
		color: var(--rj-heading, #202020);
	}

	/* ---- image card ----------------------------------------------------- */
	.rj-passion-media {
		position: relative;
		flex: 0 0 32.716%;
		max-width: 32.716%;
		/* hexagon overhang below the card — 1:5873 is 586 tall for a 567 card */
		padding-bottom: 19px;
		order: 2;
	}

	.rj-passion-card {
		position: relative;
		margin: 0;
		width: 100%;
		aspect-ratio: 424 / 567;
		border-radius: 10px;
		overflow: hidden;
	}

	.rj-passion-photo {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	/*
	 * 1:5875 — 1.5px white rule inset 20px on every side, radius 10.
	 * Drawn as an inset shadow rather than a border because Chrome rounds
	 * fractional border widths down to 1px at DPR 1.
	 */
	.rj-passion-frame {
		position: absolute;
		inset: 20px;
		box-shadow: inset 0 0 0 1.5px #fff;
		border-radius: 10px;
		pointer-events: none;
	}

	/* 1:5876 — 115.153×116 hexagon, 19px past the card's bottom-left corner. */
	.rj-passion-badge {
		position: absolute;
		left: -19px;
		bottom: 0;
		width: 115.153px;
		height: 116px;
		display: grid;
		place-items: center;
	}

	.rj-passion-badge-shape {
		grid-area: 1 / 1;
		width: 100%;
		height: 100%;
	}

	.rj-passion-badge-text {
		grid-area: 1 / 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
	}

	.rj-passion-badge-value {
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 34px;
		font-weight: 400;
		line-height: 35px;
		text-transform: uppercase;
	}

	.rj-passion-badge-label {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 24px;
		font-weight: 400;
		line-height: 35px;
		text-align: center;
	}

	/* ---- stats ---------------------------------------------------------- */
	/* 1:6184 — three items, gap 35, 60 below the text block. */
	.rj-passion-stats {
		display: flex;
		align-items: center;
		gap: 35px;
		margin: 0;
		padding: 0;
		list-style: none;
		order: 3;
	}

	.rj-passion-stat {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.rj-passion-stat-icon {
		flex-shrink: 0;
		width: var(--dw);
		height: var(--dh);
	}

	.rj-passion-stat-text {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	/* The source trims the value box to cap height (h18 for the 32px face). */
	.rj-passion-stat-value {
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 32px;
		font-weight: 400;
		line-height: 18px;
		color: var(--rj-gold, #cca646);
	}

	.rj-passion-stat-label {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 18px;
		font-weight: 400;
		line-height: normal;
		color: var(--rj-ink, #404040);
	}

	/* 1:6187 — the first item's text column is a fixed 123 wide. */
	.rj-passion-stat--design .rj-passion-stat-text {
		width: 123px;
	}

	/* ---- 1024–1279: desktop split kept, gutters relaxed to 40 ------------ */
	@media (max-width: 1279px) {
		.rj-passion-inner {
			gap: 60px;
			padding: 50px 40px;
		}

		.rj-passion-media {
			flex: 0 1 424px;
		}

		.rj-passion-stats {
			gap: 24px;
		}
	}

	/* ---- tablet 744 (63:40291) ------------------------------------------ */
	@media (max-width: 1023px) {
		.rj-passion-inner {
			flex-direction: column;
			align-items: center;
			gap: 25px;
			padding: 40px 15px;
			max-width: 744px;
		}

		/* collapse the column wrapper so the card can sit between text and stats */
		.rj-passion-col {
			display: contents;
		}

		.rj-passion-text {
			width: 100%;
			max-width: 664px;
			gap: 10px;
		}

		.rj-passion-copy {
			gap: 16px;
		}

		.rj-passion-eyebrow {
			font-size: 18px;
		}

		.rj-passion-heading {
			font-size: 32px;
		}

		.rj-passion-lead,
		.rj-passion-body {
			line-height: 25px;
		}

		/* Card is inset 11.97 from the left so the hexagon lands on the gutter. */
		.rj-passion-media {
			flex: none;
			max-width: none;
			align-self: stretch;
			margin-left: 11.97px;
			padding-bottom: 15px;
		}

		.rj-passion-card {
			aspect-ratio: 701.029 / 415;
		}

		.rj-passion-frame {
			inset: 20px 14.85px;
		}

		.rj-passion-badge {
			left: -11.97px;
			width: 103.447px;
			height: 102px;
		}

		.rj-passion-stats {
			width: 100%;
			max-width: 670px;
			justify-content: space-between;
			gap: 40px;
		}

		.rj-passion-stat {
			gap: 16px;
		}

		.rj-passion-stat-icon {
			width: var(--tw);
			height: var(--th);
		}

		.rj-passion-stat-value {
			font-size: 30px;
			line-height: 17px;
		}
	}

	/* ---- mobile 412 (77:107227) ----------------------------------------- */
	@media (max-width: 639px) {
		.rj-passion-inner {
			align-items: stretch;
			gap: 20px;
			padding: 25px 15px;
		}

		.rj-passion-text {
			max-width: none;
			gap: 12px;
		}

		.rj-passion-heading {
			font-size: 23px;
		}

		.rj-passion-lead {
			font-size: 14px;
			letter-spacing: 0.28px;
		}

		/* text → card gap is 20, card → stats is 25 (77:107234) */
		.rj-passion-media {
			margin-left: 6.413px;
			margin-bottom: 5px;
			padding-bottom: 7.92px;
		}

		.rj-passion-card {
			aspect-ratio: 375.587 / 219.081;
		}

		.rj-passion-frame {
			inset: 10.56px 7.96px;
		}

		.rj-passion-badge {
			left: -6.413px;
			width: 55.423px;
			height: 53.847px;
		}

		.rj-passion-badge-value {
			font-size: 19px;
			line-height: 20px;
		}

		/*
		 * The source leaves "Off" at 24px inside a 27.85px box, which clips it.
		 * Scaled by the same 0.559 ratio the "30%" run uses so the badge reads.
		 */
		.rj-passion-badge-label {
			font-size: 13px;
			line-height: 20px;
		}

		/*
		 * 77:107245 — the first two stats share a space-between row, the third is
		 * centred on its own row 35 below.
		 */
		.rj-passion-stats {
			flex-wrap: wrap;
			justify-content: space-between;
			max-width: none;
			gap: 0;
			row-gap: 35px;
		}

		.rj-passion-stat-icon {
			width: var(--mw);
			height: var(--mh);
		}

		.rj-passion-stat--experience {
			width: 100%;
			justify-content: center;
			gap: 18px;
		}

		.rj-passion-stat-value {
			font-size: 24px;
			line-height: 13px;
		}

		.rj-passion-stat-label {
			font-size: 16px;
		}
	}
</style>
