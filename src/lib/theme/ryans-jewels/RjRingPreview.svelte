<script lang="ts">
	import { onMount } from 'svelte'
	import type { Ring3DOptions, RingViewer } from './ring-3d'

	let { options, zoom, resetKey, poster, onzoom }: {
		options: Ring3DOptions
		zoom: number
		resetKey: number
		poster: string
		onzoom: (zoom: number) => void
	} = $props()
	let host: HTMLDivElement
	let viewer = $state.raw<RingViewer | null>(null)
	let unavailable = $state(false)

	onMount(() => {
		let mounted = true
		const fallback = () => {
			viewer?.dispose()
			viewer = null
			unavailable = true
		}
		if (!window.WebGL2RenderingContext) {
			fallback()
			return
		}
		import('./ring-3d').then(({ createRingViewer }) => {
			if (!mounted) return
			try { viewer = createRingViewer(host, fallback, onzoom) }
			catch { fallback() }
		}).catch(() => { if (mounted) fallback() })
		return () => { mounted = false; viewer?.dispose(); viewer = null }
	})

	$effect(() => { viewer?.update(options) })
	$effect(() => { viewer?.setView(zoom, resetKey) })
</script>

<div class="ring-preview" class:ready={viewer !== null}>
	<div class="ring-preview-host" bind:this={host}></div>
	{#if !viewer}
		<img src={poster} alt={`${options.shape} ${options.metal.toLowerCase()} ring style reference`} style:transform={`scale(${zoom})`} />
		<p class="ring-preview-message" role="status">{unavailable ? '3D is unavailable on this device. Showing a style reference.' : 'Loading your 3D ring…'}</p>
	{/if}
	{#if viewer}<span class="ring-preview-hint">Drag to rotate <span>·</span> Pinch or scroll to zoom</span>{/if}
</div>

<style>
	.ring-preview, .ring-preview-host { position: absolute; inset: 0; }
	.ring-preview { overflow: hidden; }
	.ring-preview img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }
	.ring-preview-message { position: absolute; right: 16px; bottom: 76px; left: 16px; margin: 0; color: #606060; text-align: center; font: 12px/20px 'Lato', sans-serif; pointer-events: none; }
	.ring-preview-hint { position: absolute; right: 155px; bottom: 29px; left: 20px; color: #756b58; font: 10px/18px 'Lato', sans-serif; pointer-events: none; }
	.ring-preview-hint > span { padding: 0 5px; color: #876917; }
	.ring-preview-host :global(canvas:focus-visible) { outline: 2px solid #876917; }
	.ring-preview-host :global(canvas:active) { cursor: grabbing !important; }
	@media (max-width: 639px) {
		.ring-preview-hint { right: 130px; bottom: 20px; left: 13px; font-size: 9px; line-height: 15px; }
		.ring-preview-message { bottom: 60px; font-size: 11px; }
	}
</style>
