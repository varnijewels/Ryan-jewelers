<script lang="ts">
	/**
	 * Section 8 — "Our Product's / our best sellers products" carousel.
	 *
	 * Source frames
	 *   desktop 1:6003 (61,2689 · 1525×526) — head 1:6004 w1318, track 1:6014 y131,
	 *           rail 1:5883 (61,3270 · 1318×2.3)
	 *   tablet  63:40324 (25,2380 · 694×442) — head h69, track y99, rail y440
	 *   mobile  77:107262 (0,2197 · 412×386) — head h49 px16, track y71, rail y311
	 *
	 * The track deliberately bleeds past the container's right edge (the source
	 * frame is 1525 wide inside a 1440 page); the rail stays inside the 1318 grid.
	 *
	 * Products are live API data — an empty list renders a loading or empty state
	 * rather than placeholder products.
	 */
	import { onMount } from 'svelte'
	import { Pause, Play } from '@lucide/svelte'
	import emblaCarouselSvelte from 'embla-carousel-svelte'
	import AutoScroll from 'embla-carousel-auto-scroll'
	import type { EmblaCarouselType } from 'embla-carousel'
	import RjArrowRule from './RjArrowRule.svelte'
	import RjCarouselCard from './RjCarouselCard.svelte'
	import RjSectionHead from './RjSectionHead.svelte'
	import { bestSellers } from './home-content.js'
	import { interleaveProductCategories } from './product-filters.js'

	let {
		products = [],
		loading = false,
		eyebrow = bestSellers.eyebrow,
		title = bestSellers.title,
		emptyText = bestSellers.emptyText,
		headingId = 'rj-bestsellers-heading',
		badgeLabel = ''
	}: {
		products?: any[]
		loading?: boolean
		eyebrow?: string
		title?: string
		emptyText?: string
		headingId?: string
		badgeLabel?: string
	} = $props()

	const items = $derived(interleaveProductCategories(products || []))
	let carouselApi = $state<EmblaCarouselType>()
	const autoScroll = AutoScroll({ speed: 1, startDelay: 1500, playOnInit: false, stopOnMouseEnter: true, stopOnInteraction: true })
	const carouselConfig = { options: { loop: true, align: 'start' as const }, plugins: [autoScroll] }
	let paused = $state(false)
	let hovered = $state(false)
	let focused = $state(false)
	let touching = $state(false)
	let reducedMotion = $state(false)
	let scrollable = $state(false)
	let progress = $state(0)
	let thumbWidth = $state(100)

	onMount(() => {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
		const updatePreference = () => {
			reducedMotion = preference.matches
			if (reducedMotion) paused = true
		}
		updatePreference()
		preference.addEventListener('change', updatePreference)
		return () => preference.removeEventListener('change', updatePreference)
	})

	$effect(() => {
		const api = carouselApi
		if (!api) return
		const refresh = () => {
			scrollable = api.canScrollNext() || api.canScrollPrev()
			const slides = api.slideNodes()
			const span = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : slides[0]?.offsetWidth || 1
			thumbWidth = Math.min(100, Math.max(8, api.rootNode().clientWidth / (span * slides.length) * 100))
			updateProgress()
			syncPlayback()
		}
		api.on('scroll', updateProgress).on('reInit', refresh)
		document.addEventListener('visibilitychange', syncPlayback)
		refresh()
		return () => {
			api.off('scroll', updateProgress).off('reInit', refresh)
			document.removeEventListener('visibilitychange', syncPlayback)
		}
	})

	$effect(syncPlayback)

	function updateProgress() {
		progress = Math.min(1, Math.max(0, carouselApi?.scrollProgress() || 0)) * 100
	}

	function syncPlayback() {
		if (!carouselApi) return
		if (paused || hovered || focused || touching || document.hidden || !scrollable || !items.length) autoScroll.stop()
		else autoScroll.play()
	}

	function scrollProducts(direction: -1 | 1) {
		autoScroll.stop()
		if (direction < 0) carouselApi?.scrollPrev(reducedMotion)
		else carouselApi?.scrollNext(reducedMotion)
		syncPlayback()
	}
</script>

<section
	class="rj-bestsellers"
	aria-labelledby={headingId}
	onmouseenter={() => hovered = true}
	onmouseleave={() => hovered = false}
	ontouchstart={() => touching = true}
	ontouchend={() => touching = false}
	ontouchcancel={() => touching = false}
>
	<div class="rj-bestsellers-inner">
		<div class="rj-bestsellers-head">
			<RjSectionHead {eyebrow} {title} id={headingId} showTabs={false} />
			<div class="rj-bestsellers-controls">
				<RjArrowRule gap={20} onprevious={() => scrollProducts(-1)} onnext={() => scrollProducts(1)} previousDisabled={!scrollable || !items.length} nextDisabled={!scrollable || !items.length} />
				<button class="rj-bestsellers-playback" type="button" aria-label={paused ? 'Resume product scrolling' : 'Pause product scrolling'} disabled={!scrollable || !items.length} onclick={() => { paused = !paused; if (!paused) focused = false }}>
					{#if paused}<Play size={14} aria-hidden="true" />{:else}<Pause size={14} aria-hidden="true" />{/if}
				</button>
			</div>
		</div>

		{#if items.length}
			<div
				class="rj-bestsellers-viewport"
				use:emblaCarouselSvelte={carouselConfig}
				onemblaInit={(event) => carouselApi = event.detail}
				onfocusin={() => focused = true}
				onfocusout={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) focused = false }}
			>
				<div class="rj-bestsellers-track">
					{#each items as product (product?.id || product?.slug)}
						<RjCarouselCard {product} {badgeLabel} />
					{/each}
				</div>
			</div>
			{#if scrollable}
				<input
					class="rj-bestsellers-rail"
					type="range"
					min="0"
					max="100"
					step="any"
					value={progress}
					aria-label="{title} scroll position"
					style="--rj-thumb-width:{thumbWidth}%"
					onfocus={() => focused = true}
					onblur={() => focused = false}
					oninput={(event) => carouselApi?.scrollTo(Math.round(Number(event.currentTarget.value) / 100 * (carouselApi.scrollSnapList().length - 1)), true)}
				/>
			{/if}
		{:else if loading}
			<div class="rj-bestsellers-skeletons" aria-busy="true">
				{#each Array(5) as _, i (i)}
					<div class="rj-bestsellers-skeleton" aria-hidden="true"></div>
				{/each}
			</div>
		{:else}
			<p class="rj-bestsellers-empty">{emptyText}</p>
		{/if}
	</div>
</section>

<style>
	.rj-bestsellers {
		width: 100%;
		padding: 50px 0;
		background: #fff;
	}

	.rj-bestsellers-inner {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		/* the track bleeds right, so the right gutter lives on the head and rail */
		padding-left: 61px;
		/* consumed by RjCarousel */
		--rj-track-end: 61px;
		--rj-rail-end: 61px;
	}

	/* 1:6004 sits 50 above the track (y0 h81, track y131). */
	.rj-bestsellers-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding-right: 61px;
		margin-bottom: 50px;
	}

	.rj-bestsellers-head :global(.rj-head) { width: auto; min-width: 0; }
	.rj-bestsellers-controls { display: flex; flex-shrink: 0; align-items: center; gap: 12px; }
	.rj-bestsellers-playback { display: grid; width: 28px; height: 30px; place-items: center; padding: 0; border: 0; background: transparent; color: var(--rj-ink, #404040); cursor: pointer; }
	.rj-bestsellers-playback:hover { color: var(--rj-gold, #cca646); }
	.rj-bestsellers-playback:disabled { opacity: .25; cursor: default; }
	.rj-bestsellers-playback:focus-visible { outline: 2px solid var(--rj-gold, #cca646); outline-offset: 2px; }
	.rj-bestsellers-viewport { width: 100%; overflow: hidden; }
	.rj-bestsellers-track { display: flex; align-items: flex-start; gap: var(--rj-track-gap, 25px); width: 100%; padding-left: var(--rj-track-start, 0px); touch-action: pan-y pinch-zoom; will-change: transform; }
	.rj-bestsellers-track > :global(:last-child) { margin-right: var(--rj-track-gap, 25px); }
	.rj-bestsellers-rail { appearance: none; width: calc(100% - var(--rj-rail-start, 0px) - var(--rj-rail-end, 0px)); height: 16px; flex-shrink: 0; margin: 48px var(--rj-rail-end, 0px) 0 var(--rj-rail-start, 0px); background: linear-gradient(#f9f9f9, #f9f9f9) center / 100% 2px no-repeat; cursor: pointer; }
	.rj-bestsellers-rail::-webkit-slider-thumb { appearance: none; width: var(--rj-thumb-width); height: 2px; border: 0; border-radius: 2px; background: #ccc; }
	.rj-bestsellers-rail::-moz-range-thumb { width: var(--rj-thumb-width); height: 2px; border: 0; border-radius: 2px; background: #ccc; }
	.rj-bestsellers-rail:focus-visible { outline: 2px solid var(--rj-gold, #cca646); outline-offset: 2px; }

	.rj-bestsellers-skeletons {
		display: flex;
		gap: 25px;
		overflow: hidden;
	}

	.rj-bestsellers-skeleton {
		width: 285px;
		height: 395px;
		flex-shrink: 0;
		border-radius: 10px;
		background: var(--rj-surface, #f4f4f4);
		animation: rj-bestsellers-pulse 1.4s ease-in-out infinite;
	}

	@keyframes rj-bestsellers-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-bestsellers-skeleton {
			animation: none;
		}
	}

	.rj-bestsellers-empty {
		margin: 0;
		padding: 40px 61px 40px 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		color: var(--rj-ink-2, #606060);
	}

	@media (min-width: 1600px) {
		.rj-bestsellers :global(.rj-tile--md) {
			width: calc((100% + 61px - 100px) / 5);
		}
	}

	@media (max-width: 1279px) {
		.rj-bestsellers-inner {
			padding-left: 40px;
			--rj-track-end: 40px;
			--rj-rail-end: 40px;
		}

		.rj-bestsellers-head {
			padding-right: 40px;
		}
	}

	/* Tablet 744 — 25 gutters, head 30 above the track, cards inset 10 (63:40324). */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-bestsellers {
			padding: 40px 0;
		}

		.rj-bestsellers-inner {
			max-width: 744px;
			padding-left: 25px;
			--rj-track-start: 10px;
			--rj-track-end: 25px;
			--rj-rail-end: 25px;
		}

		.rj-bestsellers-head {
			padding-right: 25px;
			margin-bottom: 30px;
		}

		.rj-bestsellers-skeletons {
			gap: 20px;
		}

		.rj-bestsellers-track { --rj-track-gap: 20px; }
		.rj-bestsellers-rail { margin-top: 23px; }

		.rj-bestsellers-skeleton {
			width: 261px;
			height: 311px;
		}
	}

	/* 114:59005 — 25px start gutter, 285×395 cards and no outer section padding. */
	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-bestsellers {
			margin-top: 50px;
			padding: 0;
			overflow: hidden;
		}

		.rj-bestsellers-inner {
			padding-left: 25px;
			--rj-track-end: 25px;
			--rj-rail-end: 25px;
		}

		.rj-bestsellers-head {
			padding-right: 25px;
			margin-bottom: 50px;
		}
	}

	/* Mobile 412 — full-bleed section, head padded 16, cards + rail inset 15. */
	@media (max-width: 639px) {
		.rj-bestsellers {
			padding: 25px 0;
		}

		.rj-bestsellers-inner {
			padding-left: 0;
			--rj-track-start: 15px;
			--rj-track-end: 15px;
			--rj-rail-start: 15px;
			--rj-rail-end: 15px;
		}

		.rj-bestsellers-head {
			gap: 12px;
			padding: 0 16px;
			margin-bottom: 22px;
		}

		.rj-bestsellers-controls { gap: 8px; }
		.rj-bestsellers-rail { margin-top: 9px; background-size: 100% 4px; }
		.rj-bestsellers-rail::-webkit-slider-thumb { height: 4px; }
		.rj-bestsellers-rail::-moz-range-thumb { height: 4px; }

		.rj-bestsellers-skeletons {
			gap: 20px;
			padding-left: 15px;
		}

		.rj-bestsellers-skeleton {
			width: 235px;
			height: 296px;
		}

		.rj-bestsellers-empty {
			padding: 30px 16px;
		}
	}
</style>
