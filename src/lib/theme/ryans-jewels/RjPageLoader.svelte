<script lang="ts">
	import { navigating } from '$app/state'
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	let starting = $state(false)
	let visible = $state(false)
	let reduceMotion = $state(false)

	onMount(() => {
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		starting = document.readyState !== 'complete'
		const ready = () => { starting = false }
		window.addEventListener('load', ready, { once: true })
		const fallback = window.setTimeout(ready, 8000)
		return () => {
			window.removeEventListener('load', ready)
			window.clearTimeout(fallback)
		}
	})

	$effect(() => {
		if (!starting && !navigating.to) { visible = false; return }
		// Fast navigation stays instant; show feedback only when there is a wait.
		const timer = window.setTimeout(() => { visible = true }, 180)
		return () => window.clearTimeout(timer)
	})
</script>

{#if visible}
	<div class="rj-page-loader" role="status" aria-live="polite" aria-label="Loading page" transition:fade={{ duration: reduceMotion ? 0 : 140 }}>
		<div class="loader-mark">
			<img src="/ryans-jewels/logo.webp" width="46" height="46" alt="" />
			<span class="loader-track" aria-hidden="true"><span></span></span>
		</div>
	</div>
{/if}

<style>
	.rj-page-loader { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; background: rgb(255 254 251 / 88%); cursor: progress; }
	.loader-mark { display: flex; flex-direction: column; align-items: center; gap: 22px; }
	img { display: block; width: 46px; height: 46px; object-fit: contain; }
	.loader-track { display: block; width: 72px; height: 2px; overflow: hidden; background: #eae2cf; }
	.loader-track span { display: block; width: 30px; height: 100%; background: #b28b35; animation: loading 1.25s ease-in-out infinite; }
	@keyframes loading { 0% { transform: translateX(-30px); } 100% { transform: translateX(72px); } }
	@media (prefers-reduced-motion: reduce) { .loader-track span { animation: none; transform: translateX(21px); } }
</style>
