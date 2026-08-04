<script lang="ts">
	/**
	 * Section heading flanked by two tapered rules with a diamond end-marker.
	 * Source: 1:5519 (desktop) · 63:40054 (tablet) · 77:106872 (mobile).
	 * The rule itself is `Line 3`; see RjRule.svelte.
	 */
	import RjRule from './RjRule.svelte'

	let { text, id = undefined }: { text: string; id?: string } = $props()
</script>

<div class="rj-rule-heading">
	<RjRule variant="heading" cap="start" />
	<h2 class="rj-rule-title" {id}>{text}</h2>
	<RjRule variant="heading" cap="end" />
</div>

<style>
	.rj-rule-heading {
		display: flex;
		align-items: center;
		gap: var(--rj-rule-heading-gap, 37px);
		width: 100%;
	}

	.rj-rule-title {
		flex: 0 0 auto;
		margin: 0;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: var(--rj-rule-heading-size, 30px);
		font-weight: 400;
		line-height: normal;
		/* app.css tracks all h1–h6 at 0.8px; this source node has none. */
		letter-spacing: normal;
		/* 1:6215 sets the transform; section 4's copy is already caps. */
		text-transform: uppercase;
		color: var(--rj-heading, #202020);
		white-space: nowrap;
	}

	/* tablet 744 — rules 180, gap 30, title 22 (63:40054) */
	@media (max-width: 1023px) {
		.rj-rule-heading {
			gap: var(--rj-rule-heading-tablet-gap, 30px);
		}

		.rj-rule-title {
			font-size: var(--rj-rule-heading-tablet-size, 22px);
		}
	}

	/* mobile 412 — rules 90, gap 14, title 16 (77:106872) */
	@media (max-width: 639px) {
		.rj-rule-heading {
			gap: var(--rj-rule-heading-mobile-gap, 14px);
		}

		.rj-rule-title {
			font-size: var(--rj-rule-heading-mobile-size, 16px);
			white-space: normal;
			text-align: center;
		}
	}
</style>
