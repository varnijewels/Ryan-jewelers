<script lang="ts">
	import { onMount } from 'svelte'
	import { ChevronLeft, ChevronRight, Pause, Play } from '@lucide/svelte'
	import { ryansJewelsNavContent as nav } from './nav-content.js'

	let activeIndex = $state(0)
	let paused = $state(false)
	let hovered = $state(false)
	let focused = $state(false)

	function move(direction: number) {
		activeIndex = (activeIndex + direction + nav.announcements.length) % nav.announcements.length
	}

	onMount(() => {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
		paused = preference.matches
		const onChange = (event: MediaQueryListEvent) => {
			if (event.matches) paused = true
		}
		preference.addEventListener('change', onChange)
		return () => preference.removeEventListener('change', onChange)
	})

	$effect(() => {
		if (paused || hovered || focused) return
		const timer = setInterval(() => move(1), 4000)
		return () => clearInterval(timer)
	})
</script>

<section
	class="rj-announcement"
	aria-label="Store announcements"
	aria-roledescription="carousel"
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
	onfocusin={() => (focused = true)}
	onfocusout={() => (focused = false)}
>
	<div class="rj-announcement-controls">
		<button type="button" aria-label="Previous announcement" onclick={() => move(-1)}><ChevronLeft size={13} aria-hidden="true" /></button>
		<button
			type="button"
			aria-label={paused ? 'Play announcements' : 'Pause announcements'}
			onclick={() => { paused = !paused; focused = false }}
		>
			{#if paused}<Play size={12} aria-hidden="true" />{:else}<Pause size={12} aria-hidden="true" />{/if}
		</button>
		<button type="button" aria-label="Next announcement" onclick={() => move(1)}><ChevronRight size={13} aria-hidden="true" /></button>
	</div>
	<div class="rj-announcement-viewport" aria-live={paused || hovered || focused ? 'polite' : 'off'} aria-atomic="true">
		<div class="rj-announcement-track" style:transform={`translateX(-${activeIndex * 100}%)`}>
			{#each nav.announcements as announcement, index}
				<div class="rj-announcement-slide" role="group" aria-roledescription="slide" aria-label={`Announcement ${index + 1} of ${nav.announcements.length}`} aria-hidden={index !== activeIndex} inert={index !== activeIndex}>
					<a class="rj-announcement-message" href={announcement.link.href}>{announcement.message}</a>
					<a class="rj-announcement-link" href={announcement.link.href}>{announcement.link.label}<ChevronRight size={13} aria-hidden="true" /></a>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.rj-announcement {
		position: relative;
		z-index: 0;
		min-height: 44px;
		border-top: 1px solid var(--rj-line, #e5e5e5);
		background: var(--rj-header-promo, #fff);
		color: var(--rj-heading, #202020);
		font-size: 14px;
	}
	.rj-announcement-controls {
		position: absolute;
		z-index: 1;
		top: 50%;
		left: 40px;
		display: flex;
		transform: translateY(-50%);
	}
	button {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}
	button:hover {
		background: var(--rj-cream, #faf6ea);
	}
	.rj-announcement-viewport {
		overflow: hidden;
	}
	.rj-announcement-track {
		display: flex;
		transition: transform 350ms ease;
	}
	.rj-announcement-slide {
		position: relative;
		display: flex;
		flex: 0 0 100%;
		min-width: 0;
		min-height: 43px;
		align-items: center;
		justify-content: center;
		padding: 8px 160px;
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	.rj-announcement-message {
		text-align: center;
	}
	.rj-announcement-link {
		position: absolute;
		right: 40px;
		display: flex;
		align-items: center;
		gap: 4px;
		min-height: 32px;
		font-size: 11px;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	a:focus-visible,
	button:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: -2px;
	}
	@media (max-width: 639px) {
		.rj-announcement-controls {
			left: 24px;
		}
		button {
			width: 28px;
		}
		.rj-announcement-slide {
			display: grid;
			justify-items: center;
			gap: 2px;
			padding: 8px 24px 8px 120px;
			font-size: 11px;
		}
		.rj-announcement-link {
			position: static;
			min-height: 24px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.rj-announcement-track {
			transition: none;
		}
	}
</style>
