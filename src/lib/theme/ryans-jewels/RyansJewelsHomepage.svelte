<script lang="ts">
	/**
	 * Ryan Jewelers homepage — composes theme sections only.
	 *
	 * Static presentation (copy, images, geometry) comes from ./home-content.ts.
	 * Live commerce data arrives as props from src/routes/(www)/+page.svelte.
	 *
	 * Source frames: desktop 1:5407 · tablet 63:40011 · mobile 77:106779.
	 * Sections are added in source order; the ones still pending are listed in
	 * themes/ryans-jewels/DESIGN.md so the page order stays traceable.
	 */
	import RjHero from './RjHero.svelte'
	import RjChatWidget from './RjChatWidget.svelte'
	import RjTrustRow from './RjTrustRow.svelte'
	import RjDiamondShapes from './RjDiamondShapes.svelte'
	import RjProductRow from './RjProductRow.svelte'
	import RjMarquee from './RjMarquee.svelte'
	import RjRarePassion from './RjRarePassion.svelte'
	import RjBestSellers from './RjBestSellers.svelte'
	import RjNamePlate from './RjNamePlate.svelte'
	import RjLookbook from './RjLookbook.svelte'
	import RjWideBanner from './RjWideBanner.svelte'
	import RjTrending from './RjTrending.svelte'
	import RjEnquiry from './RjEnquiry.svelte'
	import RjFaq from './RjFaq.svelte'
	import RjInstagram from './RjInstagram.svelte'
	import { onMount } from 'svelte'
	import { reveal } from '$lib/core/actions/reveal.js'

	let homepage: HTMLDivElement

	let {
		featuredProducts = [],
		trendingProducts = [],
		featuredCategories = [],
		loading = false,
		currencyCode = 'INR',
		aspectWidth = '1',
		aspectHeight = '1'
	}: {
		featuredProducts?: any[]
		trendingProducts?: any[]
		featuredCategories?: any[]
		loading?: boolean
		currencyCode?: string
		aspectWidth?: string
		aspectHeight?: string
	} = $props()

	onMount(() => {
		const cleanups = Array.from(homepage.children)
			.slice(1)
			.map((node, index) => {
				const element = node as HTMLElement
				element.style.setProperty('--rj-reveal-delay', `${Math.min(index, 4) * 55}ms`)
				const action = reveal(element)
				return () => action.destroy?.()
			})
		return () => cleanups.forEach((cleanup) => cleanup())
	})
</script>

<div bind:this={homepage} class="rj-home">
	<!-- 2 — hero (1:5755 / 63:40034 / 77:106848) -->
	<div class="rj-hero-wrap">
		<RjHero />
		<RjChatWidget />
	</div>

	<!-- 3 — trust badges + slide counter (1:5497 / 63:40035 / 77:106850) -->
	<div class="rj-band rj-band--trust">
		<div class="rj-band-inner">
			<RjTrustRow />
		</div>
	</div>

	<!-- 4 — FIND YOUR PERFECT CUT (1:5518 / 63:40058 / 77:106871) -->
	<div class="rj-band rj-band--cut">
		<RjDiamondShapes />
	</div>

	<!-- 5 — featured products (1:5651 / 63:40187 / 77:107006) -->
	<div class="rj-band rj-band--products">
		<div class="rj-band-inner">
			<RjProductRow products={featuredProducts} {loading} limit={5} showRule />
		</div>
	</div>

	<!-- 6 — shape marquee (1:5756 / 63:40435 / 77:107113) -->
	<RjMarquee variant="shapes" duration={55} />

	<!-- 7 — designed with rare passion (1:5871 / 63:40291 / 77:107227) -->
	<RjRarePassion />

	<!-- 8 — best sellers carousel (1:6003 / 63:40324 / 77:107262) -->
	<RjBestSellers products={featuredProducts} {loading} />

	<!-- 9 — personalised name plate + top rated collection (1:6110 / 63:40549 / 77:107373) -->
	<RjNamePlate products={featuredProducts} />

	<!-- 10 — tagline marquee (1:5870 / 63:40616 / 77:107438) -->
	<RjMarquee variant="taglines" duration={45} />

	<!-- 11 — lookbook + countdown (1:6474 / 63:40805 / 77:107447) -->
	<RjLookbook products={trendingProducts.length ? trendingProducts : featuredProducts} {loading} />

	<!-- 12 — wide "Glamorous Gifts" banner (1:6201 / 63:40625 / 77:107518) -->
	<RjWideBanner />

	<!-- 13 — trending collection (1:6213 / 63:40637 / 77:107530) -->
	<RjTrending products={trendingProducts.length ? trendingProducts : featuredProducts} {loading} />

	<!-- 14 — enquiry form (1:6426 / 63:40742 / 77:107636) -->
	<RjEnquiry />

	<!-- 15 — FAQ accordion (1:6431 / 63:40782 / 77:107676) -->
	<RjFaq />

	<!-- 16a — Instagram strip (1:6323 / 63:40958 / 77:107699).
	     16b — the footer itself is global; see RyansJewelsFooter, wired from
	     src/lib/components/common/footer.svelte. -->
	<RjInstagram />
</div>

<style>
	.rj-home {
		--rj-tablet-gutter: 25px;
		width: 100%;
		background: #fff;
	}

	.rj-hero-wrap {
		position: relative;
		width: 100%;
	}

	/* 186:56688 (1920 frame) keeps the gutters fixed and stretches the content. */
	.rj-band-inner {
		margin: 0 auto;
		padding: 0 61px;
	}

	/* Desktop: hero 211→956, trust row at 986, heading at 1067. */
	.rj-band--trust {
		padding-top: 30px;
	}

	.rj-band--cut {
		padding-top: 55px;
		padding-bottom: 45px;
	}

	/* Desktop: divider at 1310, filter row 1350, grid ends 1805. The divider
	   sits on the seam, so the band opens flush and RjProductRow owns the gap. */
	.rj-band--products {
		padding-bottom: 53px;
	}

	@media (max-width: 1279px) {
		.rj-band-inner {
			padding: 0 40px;
		}
	}

	/* Tablet: hero ends 620, counter 655, trust 696, heading 762. */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-hero-wrap {
			margin-top: 5px;
		}

		.rj-band-inner {
			padding: 0 var(--rj-tablet-gutter);
		}

		.rj-band--trust {
			padding-top: 35px;
		}

		.rj-band--cut {
			padding-top: 40px;
			padding-bottom: 32px;
		}
	}

	/* Keep every tablet-portrait section fluid instead of centring a fixed 744px canvas. */
	@media (min-width: 640px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-home :global(.rj-passion-inner),
		.rj-home :global(.rj-bestsellers-inner),
		.rj-home :global(.rj-plate-inner),
		.rj-home :global(.rj-look-inner),
		.rj-home :global(.rj-trend-head),
		.rj-home :global(.rj-trend-bar),
		.rj-home :global(.rj-trend-track),
		.rj-home :global(.rj-enq-inner),
		.rj-home :global(.rj-faq-inner),
		.rj-home :global(.rj-ig-inner) {
			max-width: none;
		}

		.rj-home :global(.rj-passion-inner) {
			left: 0;
			padding-right: var(--rj-tablet-gutter);
			padding-left: var(--rj-tablet-gutter);
		}

		.rj-home :global(.rj-passion-text),
		.rj-home :global(.rj-passion-stats) {
			max-width: none;
		}

		.rj-home :global(.rj-passion-media) {
			margin-left: 0;
		}

		.rj-home :global(.rj-bestsellers-inner) {
			padding-left: var(--rj-tablet-gutter);
			--rj-track-start: 0px;
			--rj-track-end: var(--rj-tablet-gutter);
			--rj-rail-end: var(--rj-tablet-gutter);
		}

		.rj-home :global(.rj-bestsellers-head) {
			padding-right: var(--rj-tablet-gutter);
		}

		.rj-home :global(.rj-cut-inner),
		.rj-home :global(.rj-look-inner),
		.rj-home :global(.rj-trend-head),
		.rj-home :global(.rj-trend-bar),
		.rj-home :global(.rj-trend-track),
		.rj-home :global(.rj-enq-inner),
		.rj-home :global(.rj-faq-inner) {
			padding-right: var(--rj-tablet-gutter);
			padding-left: var(--rj-tablet-gutter);
		}

		.rj-home :global(.rj-row-track) {
			padding-left: 0;
		}

		.rj-home :global(.rj-plate-collection) {
			padding-right: var(--rj-tablet-gutter);
			padding-left: var(--rj-tablet-gutter);
		}

		.rj-home :global(.rj-trend-track) {
			scroll-padding-left: var(--rj-tablet-gutter);
		}

		.rj-home :global(.rj-faq-list) {
			margin-left: 0;
		}

		.rj-home :global(.rj-ig) {
			padding-right: var(--rj-tablet-gutter);
			padding-left: var(--rj-tablet-gutter);
		}

		.rj-home :global(.rj-passion-stats) {
			width: 100%;
			padding-right: 0;
			padding-left: 0;
		}
	}

	/* Tablet landscape 114:58617 keeps a 24px content gutter. */
	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-band-inner {
			padding: 0 var(--rj-tablet-gutter);
		}

		.rj-band--trust .rj-band-inner {
			padding: 0 var(--rj-tablet-gutter);
		}

		.rj-band--trust {
			padding-top: 25px;
		}

		.rj-band--cut {
			padding-top: 50px;
			padding-bottom: 50px;
		}

		.rj-band--products {
			padding-bottom: 50px;
		}

		.rj-home :global(.rj-passion-inner),
		.rj-home :global(.rj-cut-inner),
		.rj-home :global(.rj-plate-collection),
		.rj-home :global(.rj-look-inner),
		.rj-home :global(.rj-trend-head),
		.rj-home :global(.rj-trend-bar),
		.rj-home :global(.rj-trend-track),
		.rj-home :global(.rj-enq-inner),
		.rj-home :global(.rj-faq-inner) {
			padding-right: var(--rj-tablet-gutter);
			padding-left: var(--rj-tablet-gutter);
		}

		.rj-home :global(.rj-ig) {
			padding-right: var(--rj-tablet-gutter);
			padding-left: var(--rj-tablet-gutter);
		}

		.rj-home :global(.rj-passion-stats) {
			width: 100%;
			padding-right: 0;
			padding-left: 0;
		}
	}

	/* Mobile: hero ends 561, counter 576, trust 619, heading 701. */
	@media (max-width: 639px) {
		/* 77:106821 → 77:106848 — 15px between the mobile header and hero. */
		.rj-hero-wrap {
			margin-top: 15px;
		}

		.rj-band-inner {
			padding: 0 15px;
		}

		.rj-band--trust {
			padding-top: 15px;
		}

		.rj-band--cut {
			padding-top: 25px;
			padding-bottom: 25px;
		}
	}
</style>
