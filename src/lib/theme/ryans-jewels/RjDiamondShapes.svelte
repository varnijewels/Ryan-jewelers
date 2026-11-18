<script lang="ts">
	import RjRuleHeading from './RjRuleHeading.svelte'
	import { ryansJewelsHome } from './home-content.js'

	const { heading, shapes } = ryansJewelsHome.perfectCut
</script>

<section class="rj-cut" aria-labelledby="rj-cut-heading">
	<div class="rj-cut-inner">
		<RjRuleHeading text={heading} id="rj-cut-heading" />
		<div class="rj-cut-grid">
			{#each shapes as shape (shape.key)}
				<a class="rj-shape" href={shape.href}>
					<img
						class="rj-shape-img"
						src="/ryans-jewels/shapes/real/{shape.key}.jpg"
						alt=""
						width="80"
						height="80"
						loading="lazy"
						decoding="async"
					/>
					<span class="rj-shape-label">{shape.label}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.rj-cut { width: 100%; background: #fff; }
	.rj-cut-inner { display: flex; flex-direction: column; align-items: center; gap: 45px; margin: 0 auto; padding: 0 61px; }
	.rj-cut-grid { display: grid; width: 100%; grid-template-columns: repeat(10, minmax(0, 1fr)); align-items: start; gap: 24px; }
	.rj-shape { position: relative; display: flex; min-width: 0; flex-direction: column; align-items: center; gap: 14px; text-decoration: none; }
	.rj-shape-img { display: block; width: 80px; max-width: 100%; height: auto; aspect-ratio: 1; object-fit: contain; transition: transform 250ms var(--rj-ease, ease); }
	.rj-shape:hover .rj-shape-img, .rj-shape:focus-visible .rj-shape-img { transform: translateY(-3px) scale(1.035); animation: rj-diamond-float 1.2s ease-in-out both; }
	.rj-shape::after { position: absolute; top: 8px; right: calc(50% - 32px); width: 10px; height: 10px; background: var(--rj-gold, #cca646); clip-path: polygon(50% 0, 61% 37%, 100% 50%, 61% 63%, 50% 100%, 39% 63%, 0 50%, 39% 37%); opacity: 0; pointer-events: none; content: ''; }
	.rj-shape:hover::after, .rj-shape:focus-visible::after { animation: rj-diamond-sparkle 1.2s ease-out both; }
	@keyframes rj-diamond-float { 0% { transform: translateY(0) rotate(0) scale(1); } 40% { transform: translateY(-5px) rotate(-2deg) scale(1.04); } 70% { transform: translateY(-2px) rotate(1deg) scale(1.035); } 100% { transform: translateY(-3px) rotate(0) scale(1.035); } }
	@keyframes rj-diamond-sparkle { 0%, 80%, 100% { opacity: 0; transform: scale(.4) rotate(0); } 35% { opacity: .8; transform: scale(1) rotate(45deg); } 60% { opacity: .2; transform: scale(.6) rotate(90deg); } }
	.rj-shape-label { color: var(--rj-ink, #404040); font-size: 16px; line-height: 1.4; text-align: center; }
	.rj-shape:hover .rj-shape-label { color: #8b6b29; }
	.rj-shape:focus-visible { outline: 2px solid var(--rj-ink, #404040); outline-offset: 4px; }
	@media (max-width: 1279px) {
		.rj-cut-inner { padding-inline: 40px; }
		.rj-cut-grid { gap: 18px; }
	}
	@media (max-width: 1100px) {
		.rj-cut-inner { gap: 30px; }
		.rj-cut-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 24px 16px; }
		.rj-shape-img { width: 60px; }
		.rj-shape-label { font-size: 14px; }
	}
	@media (max-width: 639px) {
		.rj-cut-inner { gap: 25px; padding-inline: 24px; }
		.rj-cut-grid { gap: 22px 12px; }
		.rj-shape { gap: 10px; }
		.rj-shape-img { width: 48px; }
		.rj-shape-label { font-size: 12px; }
	}
	@media (prefers-reduced-motion: reduce) {
		.rj-shape-img { transition: none; }
		.rj-shape:hover .rj-shape-img, .rj-shape:focus-visible .rj-shape-img { animation: none; transform: none; }
		.rj-shape:hover::after, .rj-shape:focus-visible::after { animation: none; opacity: 0; }
	}
</style>
