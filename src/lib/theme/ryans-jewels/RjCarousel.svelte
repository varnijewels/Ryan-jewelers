<script lang="ts" module>
	let carouselCount = 0
	function nextCarouselId() {
		return ++carouselCount
	}
</script>

<script lang="ts">
	/**
	 * Horizontal product carousel with the source's slim drag scrollbar.
	 * Source: track 1:6014 (cards 285, gap 25) + bar 1:5883 (1318×2.3 #f9f9f9
	 * rail, #ccc thumb, radius 2) · tablet 63:40336 + 63:40432 (gap 20)
	 * · mobile 77:107274 + 77:107370 (gap 20, 4px rail).
	 *
	 * The mock draws a fixed one-card-wide thumb; here the thumb is sized and
	 * positioned from the real scroll ratio so it stays truthful for any number
	 * of products. Native scrolling, wheel and keyboard all keep working — the
	 * rail is an additional pointer affordance, not a replacement.
	 */
	import type { Snippet } from 'svelte'
	import RjArrowRule from './RjArrowRule.svelte'

	let { children, label = 'Products', showArrows = false, initialOffset = 0 }: { children: Snippet; label?: string; showArrows?: boolean; initialOffset?: number } = $props()

	/** role="scrollbar" requires aria-controls, so each track needs its own id. */
	const trackId = `rj-carousel-${nextCarouselId()}`

	let track = $state<HTMLDivElement | null>(null)
	let scrollLeft = $state(0)
	let scrollWidth = $state(0)
	let clientWidth = $state(0)

	const overflows = $derived(scrollWidth - clientWidth > 1)
	const thumbWidth = $derived(overflows ? Math.max((clientWidth / scrollWidth) * 100, 8) : 100)
	const thumbLeft = $derived(
		overflows ? (scrollLeft / (scrollWidth - clientWidth)) * (100 - thumbWidth) : 0
	)
	const atStart = $derived(!overflows || scrollLeft <= 1)
	const atEnd = $derived(!overflows || scrollLeft + clientWidth >= scrollWidth - 1)

	function readMetrics() {
		if (!track) return
		scrollLeft = track.scrollLeft
		scrollWidth = track.scrollWidth
		clientWidth = track.clientWidth
	}

	$effect(() => {
		if (!track) return
		const landscape = window.matchMedia('(min-width: 768px) and (max-width: 1100px) and (orientation: landscape)')
		const setInitialOffset = () => {
			if (track) track.scrollLeft = landscape.matches ? initialOffset : 0
		}
		setInitialOffset()
		readMetrics()
		const ro = new ResizeObserver(readMetrics)
		ro.observe(track)
		for (const child of Array.from(track.children)) ro.observe(child)
		landscape.addEventListener('change', setInitialOffset)
		return () => {
			ro.disconnect()
			landscape.removeEventListener('change', setInitialOffset)
		}
	})

	/** Map a pointer position on the rail to a scroll offset and jump there. */
	function seek(rail: HTMLElement, clientX: number) {
		if (!track || !overflows) return
		const rect = rail.getBoundingClientRect()
		const thumbPx = (thumbWidth / 100) * rect.width
		const travel = rect.width - thumbPx
		if (travel <= 0) return
		const ratio = Math.min(Math.max((clientX - rect.left - thumbPx / 2) / travel, 0), 1)
		track.scrollLeft = ratio * (scrollWidth - clientWidth)
	}

	function onRailPointerDown(event: PointerEvent) {
		const rail = event.currentTarget as HTMLElement
		rail.setPointerCapture(event.pointerId)
		seek(rail, event.clientX)
	}

	function onRailPointerMove(event: PointerEvent) {
		const rail = event.currentTarget as HTMLElement
		if (!rail.hasPointerCapture(event.pointerId)) return
		seek(rail, event.clientX)
	}

	function onRailKeydown(event: KeyboardEvent) {
		if (!track) return
		const step = Math.max(clientWidth * 0.8, 200)
		if (event.key === 'ArrowRight') {
			track.scrollLeft += step
			event.preventDefault()
		} else if (event.key === 'ArrowLeft') {
			track.scrollLeft -= step
			event.preventDefault()
		}
	}

	function scrollProducts(direction: -1 | 1) {
		track?.scrollBy({ left: direction * Math.max(clientWidth * .8, 280), behavior: 'smooth' })
	}
</script>

<div class="rj-carousel">
	{#if showArrows}
		<div class="rj-carousel-arrows"><RjArrowRule gap={20} onprevious={() => scrollProducts(-1)} onnext={() => scrollProducts(1)} previousDisabled={atStart} nextDisabled={atEnd} /></div>
	{/if}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable region needs keyboard focus.) -->
	<div
		class="rj-carousel-track"
		id={trackId}
		bind:this={track}
		onscroll={readMetrics}
		role="region"
		aria-label={label}
		tabindex="0"
	>
		{@render children()}
	</div>

	{#if overflows}
		<div
			class="rj-carousel-rail"
			role="scrollbar"
			tabindex="0"
			aria-controls={trackId}
			aria-orientation="horizontal"
			aria-label="{label} scrollbar"
			aria-valuenow={Math.round(thumbLeft)}
			aria-valuemin={0}
			aria-valuemax={100}
			onpointerdown={onRailPointerDown}
			onpointermove={onRailPointerMove}
			onkeydown={onRailKeydown}
		>
			<span
				class="rj-carousel-thumb"
				style="width:{thumbWidth}%; left:{thumbLeft}%;"
				aria-hidden="true"
			></span>
		</div>
	{/if}
</div>

<style>
	.rj-carousel {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.rj-carousel-arrows { position: absolute; top: -40px; left: 0; }

	/*
	 * 1:6014 — cards 285 with a 25 gutter, overflowing the 1318 frame.
	 * The owning section supplies the gutters, because the track bleeds past the
	 * container on the right while the rail stays inside it.
	 */
	.rj-carousel-track {
		display: flex;
		align-items: flex-start;
		gap: var(--rj-track-gap, 25px);
		width: 100%;
		padding-left: var(--rj-track-start, 0px);
		padding-right: var(--rj-track-end, 0px);
		overflow-x: auto;
		scroll-snap-type: x proximity;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.rj-carousel-track::-webkit-scrollbar {
		display: none;
	}

	.rj-carousel-track:focus-visible {
		outline: 2px solid var(--rj-gold, #cca646);
		outline-offset: 4px;
	}

	.rj-carousel-track > :global(*) {
		scroll-snap-align: start;
	}

	/* 1:5883 — 2.3px #f9f9f9 rail, 55 below the track. */
	.rj-carousel-rail {
		position: relative;
		height: 2.3px;
		margin: 55px var(--rj-rail-end, 0px) 0 var(--rj-rail-start, 0px);
		background: #f9f9f9;
		cursor: pointer;
		touch-action: none;
	}

	.rj-carousel-rail:focus-visible {
		outline: 2px solid var(--rj-gold, #cca646);
		outline-offset: 6px;
	}

	.rj-carousel-thumb {
		position: absolute;
		top: 50%;
		height: 2px;
		border-radius: 2px;
		background: #ccc;
		transform: translateY(-50%);
	}

	/* Tablet 744 — card gap 20, rail 30 below the track (63:40432). */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-carousel-arrows { top: -30px; }
		.rj-carousel-track {
			gap: var(--rj-track-gap, 20px);
		}

		.rj-carousel-rail {
			height: 2px;
			margin-top: 30px;
		}
	}

	/* Landscape frames place the rail over the bottom edge of the fixed-height track. */
	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-carousel-rail {
			position: absolute;
			right: var(--rj-rail-end, 0px);
			bottom: 0;
			left: var(--rj-rail-start, 0px);
			margin: 0;
		}
	}

	/* Mobile 412 — 4px rail, 15 below the track (77:107370). */
	@media (max-width: 639px) {
		.rj-carousel-arrows { top: -30px; }
		.rj-carousel-rail {
			height: 4px;
			margin-top: 15px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-carousel-track {
			scroll-behavior: auto;
		}
	}
</style>
