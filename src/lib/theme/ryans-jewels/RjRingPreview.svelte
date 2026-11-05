<script lang="ts">
	import { onMount } from 'svelte'
	import type { Ring3DOptions, RingViewer } from './ring-3d.js'

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
		import('./ring-3d.js').then(({ createRingViewer }) => {
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
	.ring-preview { position: absolute; inset: 0; overflow: hidden; }
	.ring-preview-host { position: absolute; inset: 0; }
	.ring-preview img { position: absolute; inset: 0; width: 100%; height: 100%; padding: 14px 30px; object-fit: contain; }
	.ring-preview-message { position: absolute; right: 16px; bottom: 12px; left: 16px; margin: 0; color: #70695b; text-align: center; font: 11px/18px 'Sarala', var(--font-body, sans-serif); pointer-events: none; }
	.ring-preview-hint { position: absolute; right: 16px; bottom: 9px; left: 16px; color: #847b69; text-align: center; font: 10px/18px 'Sarala', var(--font-body, sans-serif); pointer-events: none; }
	.ring-preview-hint > span { padding: 0 5px; color: #876917; }
	.ring-preview-host :global(canvas:focus-visible) { outline: 2px solid #876917; }
	.ring-preview-host :global(canvas:active) { cursor: grabbing !important; }
	@media (max-width: 639px) {
		.ring-preview-hint { bottom: 2px; font-size: 8px; line-height: 13px; }
		.ring-preview-message { bottom: 2px; font-size: 9px; line-height: 13px; }
	}
</style>
