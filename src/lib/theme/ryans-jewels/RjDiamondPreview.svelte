<script lang="ts">
 import { onMount } from 'svelte'
 let { shape }: { shape: string } = $props()
 let host: HTMLDivElement
 let ready = $state(false)
 onMount(() => {
  let disposed = false
  let dispose: (() => void) | undefined
  if (!window.WebGL2RenderingContext) return
  import('./diamond-viewer.js').then(({ createDiamondViewer }) => {
   if (disposed) return
   try {
    dispose = createDiamondViewer(host, shape, () => { ready = false })
    ready = true
   } catch { ready = false }
  }).catch(() => { ready = false })
  return () => { disposed = true; dispose?.() }
 })
</script>
<div class="diamond-model" class:ready bind:this={host}></div>
{#if ready}<span class="rotate-hint">Drag to rotate</span>{/if}
<style>
 .diamond-model { position: absolute; inset: 0; pointer-events: none; }
 .diamond-model.ready { pointer-events: auto; background: #e9e7e2; }
 .diamond-model :global(canvas) { display: block; width: 100%; height: 100%; cursor: grab; touch-action: pan-y; }
 .diamond-model :global(canvas:active) { cursor: grabbing; }
 .diamond-model :global(canvas:focus-visible) { outline: 2px solid #bd964c; }
 .rotate-hint { position: absolute; bottom: 0; left: 0; right: 0; color: #595750; text-align: center; font-size: 11px; pointer-events: none; }
</style>
