<script lang="ts">
	/**
	 * Section 15 — "Frequently Asking Questions".
	 *
	 * Source frames
	 *   desktop group 1:6431 (0,6875 · 1440×564) over the marble plate 1:6318
	 *           (0,6825 · 1440×700); content 1:6434 (115,6922 · 1210×427);
	 *           decorative panels 1:6433 (0,7003 · 201×436) and 1:6432
	 *           (1252,6875 · 188×406, rotated 180°), both at 70% opacity
	 *   tablet  63:40782 (25,6253 · 694×659) — image beside the copy, rows below
	 *   mobile  77:107676 — 143 image overlapping the copy, rows below
	 *
	 * The source only draws the collapsed state, so the expand behaviour (and the
	 * answer copy in home-content.ts) is an app-side addition; the "+" rotates
	 * into an "×" when a row opens.
	 */
	import { faq } from './home-content.js'

	let open = $state<string | null>(null)

	function toggle(id: string) {
		open = open === id ? null : id
	}
</script>

<section class="rj-faq" aria-labelledby="rj-faq-heading">
	<img class="rj-faq-side rj-faq-side--left" src={faq.sideImage} alt="" aria-hidden="true" />
	<img class="rj-faq-side rj-faq-side--right" src={faq.sideImage} alt="" aria-hidden="true" />

	<div class="rj-faq-inner">
		<div class="rj-faq-intro">
			<div class="rj-faq-lines">
				<h2 class="rj-faq-heading" id="rj-faq-heading">{faq.heading}</h2>
				<p class="rj-faq-lede">{faq.intro}</p>
			</div>

			<nav class="rj-faq-cats" aria-label="Help topics">
				{#each faq.categories as cat, i (cat.href)}
					<a class="rj-faq-cat" class:is-active={i === 0} href={cat.href}>{cat.label}</a>
				{/each}
			</nav>
		</div>

		<ul class="rj-faq-list">
			{#each faq.items as item (item.id)}
				<li class="rj-faq-item" class:is-open={open === item.id}>
					<h3 class="rj-faq-q">
						<button
							class="rj-faq-trigger"
							type="button"
							aria-expanded={open === item.id}
							aria-controls="rj-faq-panel-{item.id}"
							onclick={() => toggle(item.id)}
						>
							<span class="rj-faq-question">{item.question}</span>
							<span class="rj-faq-toggle" aria-hidden="true"></span>
						</button>
					</h3>
					<div class="rj-faq-panel" id="rj-faq-panel-{item.id}" hidden={open !== item.id}>
						<p>{item.answer}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	/* ---- shell ---------------------------------------------------------- */
	/* 1:6318 — the marble plate runs 97 above the content and 176 below. */
	.rj-faq {
		position: relative;
		width: 100%;
		padding: 97px 0 176px;
		background: #fff;
		overflow: hidden;
	}

	.rj-faq-side {
		position: absolute;
		opacity: 0.7;
		object-fit: cover;
		pointer-events: none;
	}

	.rj-faq-side--left {
		left: 0;
		top: 178px;
		width: 201px;
		height: 436px;
	}

	.rj-faq-side--right {
		right: 0;
		top: 50px;
		width: 188px;
		height: 406px;
		transform: rotate(180deg);
	}

	.rj-faq-inner {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 6.3636%;
		margin: 0 auto;
		padding: 0 115px;
	}

	/* ---- intro column --------------------------------------------------- */
	.rj-faq-intro {
		display: flex;
		flex-direction: column;
		gap: 33px;
		width: 38.2645%;
		flex-shrink: 0;
	}

	.rj-faq-lines {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.rj-faq-heading {
		margin: 0;
		width: 408px;
		max-width: 100%;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 46px;
		font-weight: 400;
		line-height: 58px;
		/* app.css tracks all h1–h6 at 0.8px; this source node has none. */
		letter-spacing: normal;
		color: var(--rj-heading, #202020);
	}

	.rj-faq-lede {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 18px;
		line-height: 28px;
		color: #757575;
	}

	.rj-faq-cats {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 218px;
	}

	.rj-faq-cat {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 18px;
		line-height: 26px;
		color: #757575;
		text-decoration: none;
		transition: color 0.18s ease;
	}

	.rj-faq-cat:hover,
	.rj-faq-cat.is-active {
		color: var(--rj-gold, #cca646);
	}

	/* ---- accordion ------------------------------------------------------ */
	.rj-faq-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 55.3719%;
		flex-shrink: 0;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* 1:6446 — 670×80 white row, 1px #e1d6be, radius 5, 20 padding. */
	.rj-faq-item {
		border: 1px solid var(--rj-rule, #e1d6be);
		border-radius: 5px;
		background: #fff;
	}

	.rj-faq-q {
		margin: 0;
		font-size: inherit;
		font-weight: inherit;
		letter-spacing: normal;
		line-height: inherit;
	}

	.rj-faq-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		width: 100%;
		height: 78px;
		padding: 20px;
		border: 0;
		background: none;
		text-align: left;
		cursor: pointer;
	}

	.rj-faq-question {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 20px;
		line-height: 28px;
		color: var(--rj-ink, #404040);
	}

	/* 1:6448 — the 40px vuesax "add" glyph, drawn as two rules so it can
	   rotate into a close icon when the row opens. */
	.rj-faq-toggle {
		position: relative;
		display: block;
		width: 40px;
		height: 40px;
		flex-shrink: 0;
		transition: transform 0.25s var(--rj-ease, ease);
	}

	.rj-faq-toggle::before,
	.rj-faq-toggle::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 30px;
		height: 2.5px;
		border-radius: 1.25px;
		background: #505050;
		transform: translate(-50%, -50%);
	}

	.rj-faq-toggle::after {
		transform: translate(-50%, -50%) rotate(90deg);
	}

	.rj-faq-item.is-open .rj-faq-toggle {
		transform: rotate(45deg);
	}

	.rj-faq-panel {
		padding: 0 20px 20px;
	}

	.rj-faq-panel p {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: 26px;
		color: #757575;
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-faq-toggle {
			transition: none;
		}
	}

	@media (max-width: 1279px) {
		.rj-faq-inner {
			gap: 48px;
			padding: 0 60px;
		}

		.rj-faq-intro {
			width: auto;
			flex: 1 1 auto;
			min-width: 0;
		}

		.rj-faq-list {
			width: auto;
			flex: 1 1 560px;
			min-width: 0;
		}
	}

	/* ---- tablet 744 (63:40782) — copy row on top, accordion beneath ----- */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-faq {
			padding: 40px 0;
			background: #fff;
		}

		.rj-faq-side--right {
			display: none;
		}

		.rj-faq-inner {
			flex-direction: column;
			gap: 8.595px;
			max-width: 744px;
			padding: 0 25px;
		}

		.rj-faq-intro {
			width: 100%;
			height: 370.405px;
			flex: none;
			gap: 18px;
			padding-left: 136px;
		}

		.rj-faq-side--left {
			left: 25px;
			top: 40px;
			width: 171px;
			height: 370.4px;
		}

		.rj-faq-lines {
			gap: 12px;
			width: 566px;
		}

		.rj-faq-heading {
			width: auto;
			font-size: 42px;
			line-height: normal;
			white-space: nowrap;
		}

		.rj-faq-lede {
			font-size: 16px;
			line-height: normal;
		}

		.rj-faq-cats {
			gap: 16px;
		}

		.rj-faq-cat {
			font-size: 16px;
		}

		.rj-faq-list {
			flex: none;
			width: auto;
			align-self: stretch;
			margin: 0 0 0 24px;
		}
	}

	/* 114:59504 — intro above three full-width accordion rows. */
	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-faq {
			height: 671px;
			margin-top: 50px;
			padding: 40px 0 0;
			background: #fff;
		}

		.rj-faq-side--right {
			display: none;
		}

		.rj-faq-side--left {
			left: 25px;
			top: 40px;
			width: 171px;
			height: 370.4px;
		}

		.rj-faq-inner {
			flex-direction: column;
			gap: 9px;
			padding: 0 25px;
		}

		.rj-faq-intro {
			width: 100%;
			gap: 18px;
			padding-left: 171px;
		}

		.rj-faq-lines {
			gap: 12px;
		}

		.rj-faq-heading {
			width: auto;
			font-size: 42px;
			line-height: normal;
		}

		.rj-faq-lede,
		.rj-faq-cat {
			font-size: 16px;
			line-height: normal;
		}

		.rj-faq-cats {
			gap: 16px;
		}

		.rj-faq-list {
			width: auto;
			align-self: stretch;
			margin: 0;
		}
	}

	/* ---- mobile 412 (77:107676) ----------------------------------------- */
	@media (max-width: 639px) {
		.rj-faq {
			padding: 25px 0;
		}

		.rj-faq-inner {
			gap: 25px;
			padding: 0 16px;
		}

		.rj-faq-side--left {
			left: 0;
			top: 25px;
			width: 143px;
			height: 310px;
		}

		.rj-faq-intro {
			height: 310px;
			gap: 18px;
			padding-left: 92px;
		}

		.rj-faq-heading {
			font-size: 20px;
			white-space: normal;
		}

		.rj-faq-lines {
			width: 100%;
		}

		.rj-faq-lede {
			font-size: 12px;
		}

		.rj-faq-cats {
			width: 100%;
			gap: 13px;
		}

		.rj-faq-cat {
			font-size: 14px;
		}

		.rj-faq-list {
			flex: none;
			margin: 0;
		}

		.rj-faq-question {
			font-size: 16px;
		}
	}
</style>
