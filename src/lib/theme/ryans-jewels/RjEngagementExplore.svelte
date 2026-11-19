<script lang="ts">
	import { onMount } from 'svelte'
	import { ArrowRight, ArrowUpRight } from '@lucide/svelte'

	const media = '/videos/'
	const openingImage = 'ryan-ring-box-open.gif'
	const closingImage = 'ryan-ring-box-close.gif'
	let stage: HTMLDivElement
	let video = $state<HTMLVideoElement>()
	let videoFallback = $state(false)
	let boxOpen = $state(false)
	let animating = $state(false)
	let reducedMotion = $state(false)
	let imageSource = $state(`${media}ryan-ring-box-closed.webp`)
	let imageKey = $state(0)
	let openingPlays = 0
	let closingPlays = 0
	let settleTimer: ReturnType<typeof setTimeout> | undefined

	function finish(open: boolean) {
		if (boxOpen !== open) return
		animating = false
		imageSource = `${media}ryan-ring-box-${open ? 'open' : 'closed'}.webp`
	}

	function settleAfterPlayback() {
		if (!animating) return
		clearTimeout(settleTimer)
		const open = boxOpen
		settleTimer = setTimeout(() => finish(open), 3000)
	}

	function useGifFallback() {
		if (!boxOpen) return
		videoFallback = true
		video?.pause()
	}

	function playOpening() {
		const active = video
		if (!active || !boxOpen || reducedMotion) return
		active.play().catch(() => { if (boxOpen && video === active) useGifFallback() })
	}

	function setOpen(open: boolean) {
		if (open === boxOpen && !animating) return
		clearTimeout(settleTimer)
		video?.pause()
		boxOpen = open
		if (reducedMotion) { finish(open); return }
		animating = true
		const play = open ? openingPlays++ : closingPlays++
		// A new URL restarts the once-playing GIF when the visitor returns to the section.
		imageSource = `${media}${open ? openingImage : closingImage}${play ? `?play=${play}` : ''}`
		imageKey += 1
	}

	onMount(() => {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
		let frame = 0
		const update = () => {
			if (reducedMotion) return
			const rect = stage.getBoundingClientRect()
			const reached = window.innerWidth <= 639
				? rect.top + rect.height / 2 <= window.innerHeight * .7 + 200
				: rect.top <= window.innerHeight * .8
			if (reached !== boxOpen) setOpen(reached)
		}
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(() => { frame = 0; update() })
		}
		const updatePreference = () => {
			reducedMotion = preference.matches
			if (reducedMotion) setOpen(true)
			else update()
		}
		preference.addEventListener('change', updatePreference)
		window.addEventListener('scroll', schedule, { passive: true })
		window.addEventListener('resize', schedule)
		updatePreference()
		return () => {
			clearTimeout(settleTimer)
			video?.pause()
			cancelAnimationFrame(frame)
			preference.removeEventListener('change', updatePreference)
			window.removeEventListener('scroll', schedule)
			window.removeEventListener('resize', schedule)
		}
	})
</script>

<section class="rj-engagement" aria-labelledby="rj-engagement-heading">
	<h2 class="sr-only" id="rj-engagement-heading">Explore engagement rings</h2>
	<div class="rj-engagement-stage" bind:this={stage}>
		<div class="engagement-marquee" aria-hidden="true">
			{#each [0, 1] as group (group)}
				<div class="engagement-marquee-group">
					{#each [0, 1, 2] as item (item)}<span>Explore engagement rings <span class="marquee-star">✧</span></span>{/each}
				</div>
			{/each}
		</div>
		<button class="ring-box" type="button" class:is-open={boxOpen && !animating} data-state={boxOpen ? 'open' : 'closed'} aria-label={boxOpen ? 'Close ring box' : 'Open ring box'} aria-pressed={boxOpen} onclick={() => setOpen(!boxOpen)}>
			{#if boxOpen && !reducedMotion && !videoFallback}
				<video bind:this={video} autoplay muted playsinline preload="auto" poster="/videos/ryan-ring-box-closed.webp" width="362" height="362" aria-hidden="true" onloadeddata={playOpening} onended={() => finish(true)} onerror={useGifFallback}>
					<source src="/videos/ryan-ring-box.webm" type="video/webm" onerror={useGifFallback} />
				</video>
			{:else}
				{#key imageKey}<img src={imageSource} alt="Ryan Jewelers Ring Box" width="362" height="362" onload={settleAfterPlayback} onerror={() => finish(boxOpen)} />{/key}
			{/if}
		</button>
	</div>
	<div class="engagement-copy">
		<p>Find the ring that feels like you. Explore our engagement designs, choose the details you love, or start a custom ring with Ryan Jewelers. Our Salisbury team is here to help bring your ideas together.</p>
		<div class="engagement-actions">
			<a class="build-ring" href="/ring-builder">Build Your Ring <ArrowUpRight size={16} aria-hidden="true" /></a>
			<a class="explore-rings" href="/products?categories=engagement"><span>Explore Designs</span><ArrowRight size={18} aria-hidden="true" /></a>
		</div>
	</div>
</section>

<style>
	.rj-engagement { position: relative; width: 100%; overflow: hidden; padding-bottom: 100px; background: #fff; color: var(--rj-ink, #404040); }
	.rj-engagement-stage { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); min-height: 500px; place-items: center; }
	.engagement-marquee { position: absolute; top: 35%; left: 0; display: flex; width: 100%; overflow: hidden; transform: translateY(-50%); user-select: none; }
	.engagement-marquee-group { display: flex; flex: 0 0 auto; align-items: center; gap: 48px; min-width: 100%; padding-right: 48px; animation: engagement-scroll 28s linear infinite; }
	.engagement-marquee-group > span { display: flex; flex: 0 0 auto; align-items: center; gap: 48px; font: 400 clamp(64px, 7vw, 128px)/1.25 var(--font-heading, serif); letter-spacing: -.04em; white-space: nowrap; }
	.marquee-star { color: #ac8735; font-size: .5em; }
	.ring-box { position: relative; z-index: 1; display: block; width: 100%; max-width: 500px; margin: auto; padding: 0; border: 0; background: transparent; cursor: pointer; }
	.ring-box > img, .ring-box > video { display: block; width: 100%; height: auto; }
	.engagement-copy { max-width: 680px; margin: 16px auto 0; padding: 0 24px; text-align: center; }
	.engagement-copy p { margin: 0; color: var(--rj-ink-2, #606060); font: 400 16px/1.65 var(--font-body, sans-serif); }
	.engagement-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 40px; margin-top: 30px; }
	.engagement-actions a { display: inline-flex; align-items: center; gap: 12px; min-height: 44px; font: 500 14px/1.4 var(--font-body, sans-serif); text-decoration: none; }
	.build-ring { color: #8b6b29; border-bottom: 1px solid currentColor; }
	.explore-rings { padding: 14px 22px; border: 1px solid #8b6b29; background: #8b6b29; color: #fff; transition: background .2s ease; }
	.explore-rings:hover { background: #6d531e; }
	.rj-engagement :is(a, button):focus-visible { outline: 2px solid #8b6b29; outline-offset: 5px; }
	@keyframes engagement-scroll { to { transform: translateX(-100%); } }
	@media (max-width: 639px) { .rj-engagement { padding-bottom: 60px; } .rj-engagement-stage { min-height: 380px; } .engagement-marquee { top: 33%; } .engagement-marquee-group, .engagement-marquee-group > span { gap: 28px; } .engagement-marquee-group { padding-right: 28px; } .engagement-marquee-group > span { font-size: 52px; } .engagement-copy { margin-top: 12px; } .engagement-copy p { font-size: 14px; } .engagement-actions { gap: 24px; } }
	@media (prefers-reduced-motion: reduce) { .engagement-marquee-group { animation: none; } .explore-rings { transition: none; } }
</style>
