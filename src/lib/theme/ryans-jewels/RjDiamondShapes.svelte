<script lang="ts">
	/**
	 * "FIND YOUR PERFECT CUT" — diamond cut shortcuts.
	 * Source: 1:5518 (desktop, one row gap 55, items-end)
	 *         63:40058 (tablet, one row gap 25)
	 *         77:106876 (mobile, two rows with space between items)
	 * Per-shape geometry lives in home-content.ts so the markup stays one loop.
	 */
	import RjRuleHeading from './RjRuleHeading.svelte'
	import { ryansJewelsHome } from './home-content.js'

	const { heading, shapes } = ryansJewelsHome.perfectCut
	const rowOne = shapes.slice(0, 5)
	const rowTwo = shapes.slice(5)
	const mobileRowOne = shapes.slice(1, 6)
	const mobileRowTwo = shapes.slice(6)
</script>

{#snippet shapeLink(shape: (typeof shapes)[number])}
	<a
		class="rj-shape"
		href={shape.href}
		style="--dgap:{shape.d.gap}px; --tgap:{shape.t.gap}px; --mgap:{shape.m.gap}px;"
	>
		<span
			class="rj-shape-box"
			style="--dpx:{shape.d.px}px; --dpy:{shape.d.py}px; --tpx:{shape.t.px}px; --tpy:{shape.t.py}px; --mpx:{shape.m.px}px; --mpy:{shape.m.py}px; {shape.box
				? `--dbw:${shape.box.w}px; --dbh:${shape.box.h}px;`
				: ''} {shape.boxSm ? `--tbw:${shape.boxSm.w}px; --tbh:${shape.boxSm.h}px;` : ''}"
			class:rj-shape-box--fixed={!!shape.box}
		>
			<img
				class="rj-shape-img"
				src="/ryans-jewels/shapes/{shape.key}.svg"
				alt=""
				style="--dw:{shape.d.w}px; --dh:{shape.d.h}px; --tw:{shape.t.w}px; --th:{shape.t.h}px; --mw:{shape.m.w}px; --mh:{shape.m.h}px; {shape.rot
					? `--rot:${shape.rot}deg;`
					: ''}"
			/>
		</span>
		<span class="rj-shape-label">{shape.label}</span>
	</a>
{/snippet}

<section class="rj-cut" aria-labelledby="rj-cut-heading">
	<div class="rj-cut-inner">
		<RjRuleHeading text={heading} id="rj-cut-heading" />

		<div class="rj-cut-rows rj-cut-rows--default">
			<div class="rj-cut-row rj-cut-row--one">
				{#each rowOne as shape (shape.key)}
					{@render shapeLink(shape)}
				{/each}
			</div>
			<div class="rj-cut-row rj-cut-row--two">
				{#each rowTwo as shape (shape.key)}
					{@render shapeLink(shape)}
				{/each}
			</div>
		</div>

		<div class="rj-cut-rows rj-cut-rows--mobile">
			<div class="rj-cut-row rj-cut-row--one">
				{#each mobileRowOne as shape (shape.key)}
					{@render shapeLink(shape)}
				{/each}
			</div>
			<div class="rj-cut-row rj-cut-row--two">
				{#each mobileRowTwo as shape (shape.key)}
					{@render shapeLink(shape)}
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.rj-cut {
		width: 100%;
		background: #fff;
	}

	.rj-cut-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 45px;
		margin: 0 auto;
		padding: 0 61px;
	}

	/* Desktop keeps all cuts in a single row (1:5523, items-end). */
	.rj-cut-rows {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 55px;
	}

	.rj-cut-row {
		display: contents;
	}

	.rj-cut-rows--mobile {
		display: none;
	}

	.rj-shape {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--dgap);
		flex-shrink: 0;
		text-decoration: none;
	}

	.rj-shape-box {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--dpy) var(--dpx);
		overflow: clip;
	}

	.rj-shape-box--fixed {
		width: var(--dbw);
		height: var(--dbh);
		padding: 0;
	}

	.rj-shape-img {
		display: block;
		width: var(--dw);
		height: var(--dh);
		flex-shrink: 0;
		max-width: none;
		transform: rotate(var(--rot, 0deg));
		transition: transform 0.25s var(--rj-ease, cubic-bezier(0.22, 0.61, 0.36, 1));
	}

	.rj-shape:hover .rj-shape-img {
		transform: rotate(var(--rot, 0deg)) scale(1.08);
	}

	.rj-shape-label {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: normal;
		text-align: center;
		text-transform: capitalize;
		color: var(--rj-ink, #404040);
		transition: color 0.18s ease;
	}

	.rj-shape:hover .rj-shape-label {
		color: var(--rj-gold, #cca646);
	}

	/* Tablet source frames start with Oval; desktop keeps the complete cut list. */
	@media (min-width: 640px) and (max-width: 1100px) {
		.rj-cut-row--one .rj-shape:first-child {
			display: none;
		}
	}

	@media (max-width: 1279px) {
		.rj-cut-inner {
			padding: 0 40px;
		}

		.rj-cut-rows {
			gap: 32px;
		}
	}

	/* Tablet 744 — still one row, gap 25, smaller icons, 14px labels. */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-cut-inner {
			gap: 25px;
			padding: 0 44px;
		}

		.rj-cut-inner :global(.rj-rule-heading) {
			width: calc(100% + 4px);
		}

		.rj-cut-rows {
			gap: 20px;
			width: 100%;
			justify-content: space-between;
		}

		.rj-shape {
			gap: var(--tgap);
		}

		.rj-shape-box {
			padding: var(--tpy) var(--tpx);
		}

		.rj-shape-box--fixed {
			width: var(--tbw);
			height: var(--tbh);
			padding: 0;
		}

		.rj-shape-img {
			width: var(--tw);
			height: var(--th);
		}

		.rj-shape-label {
			font-size: 14px;
		}
	}

	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-cut-inner {
			gap: 40px;
			padding: 0 24px;
		}

		.rj-cut-rows {
			gap: 30px;
		}
	}

	/* Mobile 412 — two rows, each justify-between (77:106877 / 77:106952). */
	@media (max-width: 639px) {
		.rj-cut-rows--default {
			display: none;
		}

		.rj-cut-rows--mobile {
			display: flex;
		}

		.rj-cut-inner {
			gap: 25px;
			padding: 0 15px;
		}

		.rj-cut-rows {
			flex-direction: column;
			align-items: stretch;
			gap: 19px;
			width: 100%;
		}

		.rj-cut-row {
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
		}

		.rj-cut-row--one {
			height: 79px;
			padding: 0 15px;
		}

		.rj-cut-row--two {
			height: 75px;
			padding: 0 45px;
		}

		.rj-shape {
			height: 100%;
			justify-content: space-between;
			gap: 0;
		}

		.rj-shape-box {
			padding: var(--mpy) var(--mpx);
		}

		.rj-shape-box--fixed {
			width: var(--tbw);
			height: var(--tbh);
			padding: 0;
		}

		.rj-shape-img {
			width: var(--mw);
			height: var(--mh);
		}
	}
</style>
