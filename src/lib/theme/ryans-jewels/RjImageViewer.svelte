<script lang="ts">
	import { onMount } from 'svelte'
	let { images, initialIndex = 0, title, onclose }: { images: string[]; initialIndex?: number; title: string; onclose: () => void } = $props()
	let dialog: HTMLDialogElement
	let current = $state(0)
	function step(direction: number) { current = (current + direction + images.length) % images.length }
	onMount(() => {
		current = initialIndex
		const overflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		dialog.showModal()
		return () => { document.body.style.overflow = overflow }
	})
</script>

<dialog bind:this={dialog} aria-label="{title} image gallery" onclose={onclose}
	onclick={(event) => { if (event.target === dialog) dialog.close() }}
	onkeydown={(event) => {
		if (event.key === 'ArrowRight') { event.preventDefault(); step(1) }
		if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1) }
	}}>
	<button class="close" type="button" aria-label="Close image viewer" onclick={() => dialog.close()}>&times;</button>
	<div class="viewer-image"><img src={images[current]} alt="{title} - image {current + 1} of {images.length}" /></div>
	{#if images.length > 1}
		<button class="previous" type="button" aria-label="Previous image" onclick={() => step(-1)}>&#8249;</button>
		<button class="next" type="button" aria-label="Next image" onclick={() => step(1)}>&#8250;</button>
	{/if}
	<p class="count" aria-live="polite" aria-atomic="true">{current + 1} / {images.length}</p>
</dialog>

<style>
	dialog { position: fixed; inset: 0; width: min(1100px, calc(100vw - 48px)); height: min(900px, calc(100dvh - 48px)); max-width: none; max-height: none; margin: auto; padding: 58px 65px; border: 0; border-radius: 4px; background: #fff; color: #303030; box-sizing: border-box; }
	dialog::backdrop { background: rgb(25 23 19 / 65%); }
	.viewer-image { width: 100%; height: 100%; pointer-events: none; }
	img { display: block; width: 100%; height: 100%; object-fit: contain; }
	button { position: absolute; display: grid; place-items: center; width: 42px; height: 42px; padding: 0; border: 1px solid #e4dfd5; border-radius: 50%; background: #fff; color: #38332b; cursor: pointer; font-size: 32px; line-height: 1; }
	button:hover { background: #faf6ec; border-color: #b69345; }
	button:focus-visible { outline: 2px solid #ac8735; outline-offset: 3px; }
	.close { top: 14px; right: 14px; font-size: 28px; }
	.previous, .next { top: 50%; transform: translateY(-50%); }
	.previous { left: 14px; } .next { right: 14px; }
	.count { position: absolute; bottom: 18px; left: 0; width: 100%; margin: 0; text-align: center; font-size: 13px; color: #6d665d; }
	@media (max-width: 639px) { dialog { width: calc(100vw - 20px); height: calc(100dvh - 40px); padding: 64px 12px 85px; } .previous, .next { top: auto; bottom: 20px; transform: none; } .previous { left: 20px; } .next { right: 20px; } .count { bottom: 33px; width: calc(100% - 140px); left: 70px; } }
</style>
