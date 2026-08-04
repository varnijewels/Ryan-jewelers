<script lang="ts">
	/**
	 * Two short rules with an arrowhead at each outer end — the theme's
	 * "scroll me" marker.
	 *
	 * Source: 1:5653 (section 5 filter bar) and 1:6219 (section 13 catalog bar).
	 * Both draw 40px rules; only the space between them differs, so `gap` is a
	 * prop rather than two near-identical components.
	 */
	let {
		gap = 10,
		length = 40,
		mobileLength = 25
	}: { gap?: number; length?: number; mobileLength?: number } = $props()
</script>

<span
	class="rj-arrow-rule"
	style="--gap:{gap}px; --len:{length}px; --mobile-len:{mobileLength}px"
	aria-hidden="true"
>
	<span class="rj-arrow rj-arrow--prev"></span>
	<span class="rj-arrow rj-arrow--next"></span>
</span>

<style>
	.rj-arrow-rule {
		display: flex;
		align-items: center;
		gap: var(--gap);
		flex-shrink: 0;
	}

	.rj-arrow {
		position: relative;
		display: block;
		width: var(--len);
		height: 1.5px;
		background: #000;
	}

	.rj-arrow::before {
		content: '';
		position: absolute;
		top: 50%;
		width: 0;
		height: 0;
		border-top: 4.33px solid transparent;
		border-bottom: 4.33px solid transparent;
		transform: translateY(-50%);
	}

	.rj-arrow--prev::before {
		left: 0;
		border-right: 7.5px solid #000;
	}

	.rj-arrow--next::before {
		right: 0;
		border-left: 7.5px solid #000;
	}

	/* Mobile 412 — 25px rules (77:107009 / 77:107537). */
	@media (max-width: 639px) {
		.rj-arrow {
			width: var(--mobile-len);
		}
	}
</style>
