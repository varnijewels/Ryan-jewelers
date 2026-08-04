<script lang="ts">
	/**
	 * Full-bleed hero.
	 * Source: 1:5755 (desktop 1440x745) · 63:40034 (tablet 744x434) · 77:106848 (mobile 412x290).
	 * All three are the same photograph at a different crop height, so the image is
	 * rendered edge-to-edge with a per-breakpoint aspect ratio.
	 */
	import { ryansJewelsHome } from './home-content.js'

	const { hero } = ryansJewelsHome
</script>

<section class="rj-hero">
	<a class="rj-hero-link" href={hero.href} aria-label={hero.imageAlt}>
		<img class="rj-hero-img" src={hero.image} alt={hero.imageAlt} width="1440" height="745" fetchpriority="high" />
	</a>
</section>

<style>
	.rj-hero {
		width: 100%;
		background: var(--rj-surface, #f4f4f4);
	}

	/* Full-bleed: the hero art stretches to the viewport at any width. */
	.rj-hero-link {
		display: block;
		width: 100%;
		margin: 0 auto;
	}

	.rj-hero-img {
		display: block;
		width: 100%;
		height: auto;
		/* 1440 x 745 */
		aspect-ratio: 1440 / 745;
		object-fit: cover;
	}

	/* tablet 63:40034 — 744 x 434 */
	@media (max-width: 1023px) {
		.rj-hero-img {
			aspect-ratio: 744 / 434;
		}
	}

	/* mobile 77:106848 — 412 x 290 */
	@media (max-width: 639px) {
		.rj-hero-img {
			aspect-ratio: 412 / 290;
		}
	}
</style>
