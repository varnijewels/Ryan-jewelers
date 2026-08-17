<script lang="ts">
	/**
	 * Full-bleed hero video.
	 * Source: 1:6861 (desktop 1440x745) · 63:40034 (tablet 744x434) · 77:106848 (mobile 412x290).
	 * The same media is rendered edge-to-edge with a per-breakpoint aspect ratio.
	 */
	import { ryansJewelsHome } from './home-content.js'

	const { hero } = ryansJewelsHome
</script>

<svelte:head>
	<link
		rel="preload"
		as="image"
		href={hero.mobileImage}
		media="(max-width: 639px)"
		fetchpriority="high"
	/>
	<link
		rel="preload"
		as="image"
		href={hero.image}
		media="(min-width: 640px)"
		fetchpriority="high"
	/>
</svelte:head>

<section class="rj-hero">
	<a class="rj-hero-link" href={hero.href} aria-label={hero.imageAlt}>
		<div class="rj-hero-media">
			<picture class="rj-hero-picture">
				<source media="(max-width: 639px)" srcset={hero.mobileImage} />
				<img
					class="rj-hero-img"
					src={hero.image}
					alt=""
					width="1440"
					height="745"
					fetchpriority="high"
					decoding="async"
				/>
			</picture>
			<video class="rj-hero-video" autoplay muted loop playsinline preload="none" aria-hidden="true">
				<source src={hero.video} type="video/mp4" media="(min-width: 640px)" />
			</video>
		</div>
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

	.rj-hero-media {
		position: relative;
	}

	.rj-hero-picture {
		display: block;
	}

	.rj-hero-img {
		display: block;
		width: 100%;
		height: auto;
		/* 1440 x 745 */
		aspect-ratio: 1440 / 745;
		object-fit: cover;
	}

	.rj-hero-video {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
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

		.rj-hero-video {
			display: none;
		}
	}
</style>
