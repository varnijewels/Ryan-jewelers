<script lang="ts">
	/**
	 * Decorative diamond cluster above the name-plate headline.
	 * Source: 1:6112 (desktop 60.5×77) · 63:40554 (tablet) · 77:107376 (mobile).
	 *
	 * The source draws eight 45°-rotated squares with white borders (two of them
	 * filled). Each Figma box of size S contains a square of side S/√2, so the
	 * geometry below is the source's own numbers with the stroke pulled inside
	 * the box the way a CSS border sits inside its element.
	 *
	 * Sized by the parent through width/height — the SVG scales exactly.
	 * Section 14 reuses it in gold at 43.5 wide (63:40745 / 77:107639); the two
	 * solid squares stay white-filled at both sizes.
	 */
	let { color = '#fff', width = null }: { color?: string; width?: number | null } = $props()

	/** Source bbox is 60.5 × 77, so height follows from a single width. */
	const sized = $derived(width ? `--w:${width}px; --h:${(width * 77) / 60.5}px;` : '')
</script>

<svg
	class="rj-cluster"
	class:is-sized={width}
	style="--c:{color}; {sized}"
	viewBox="0 0 60.5 77"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
	focusable="false"
>
	<rect x="25.3785" y="5.2985" width="17.048" height="17.048" stroke="var(--c, #fff)" stroke-width="2.5" transform="rotate(45 33.9025 13.8225)" />
	<rect x="31.3245" y="11.2445" width="5.149" height="5.149" fill="#fff" stroke="var(--c, #fff)" stroke-width="2.5" transform="rotate(45 33.899 13.819)" />
	<rect x="5.5765" y="23.7465" width="20.098" height="20.098" stroke="var(--c, #fff)" stroke-width="2" transform="rotate(45 15.6255 33.7955)" />
	<rect x="10.674" y="28.844" width="9.899" height="9.899" stroke="var(--c, #fff)" stroke-width="2" transform="rotate(45 15.6235 33.7935)" />
	<rect x="48.134" y="28.914" width="7.899" height="7.899" stroke="var(--c, #fff)" stroke-width="4" transform="rotate(45 52.0835 32.8635)" />
	<rect x="20.8785" y="44.1485" width="26.047" height="26.047" stroke="var(--c, #fff)" stroke-width="2" transform="rotate(45 33.902 57.172)" />
	<rect x="25.3785" y="48.6485" width="17.048" height="17.048" stroke="var(--c, #fff)" stroke-width="2.5" transform="rotate(45 33.9025 57.1725)" />
	<rect x="31.3245" y="54.5945" width="5.149" height="5.149" fill="#fff" stroke="var(--c, #fff)" stroke-width="2.5" transform="rotate(45 33.899 57.169)" />
</svg>

<style>
	.rj-cluster {
		display: block;
		flex-shrink: 0;
		width: 60.5px;
		height: 77px;
		overflow: visible;
	}

	/* An explicit `width` prop pins the size and opts out of the breakpoints. */
	.rj-cluster.is-sized {
		width: var(--w);
		height: var(--h);
	}

	/* Tablet 744 — 51.15×65.09 (63:40554). */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-cluster:not(.is-sized) {
			width: 51.15px;
			height: 65.09px;
		}
	}

	/* Mobile 412 — 34.97×41.76 (77:107376). */
	@media (max-width: 639px) {
		.rj-cluster:not(.is-sized) {
			width: 34.97px;
			height: 41.76px;
		}
	}
</style>
