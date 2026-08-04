<script lang="ts">
	/**
	 * Source `Line 3` — a 4.9px diamond marker plus a 1.2px #E1D6BE rule.
	 *
	 * `cap` picks which end carries the diamond: the heading rules cap their
	 * outer end only (1:5519), the section divider caps both (1:5651).
	 * `variant` picks the sizing: `heading` flexes beside a title and caps at the
	 * source's 460 rule, `full` spans its container.
	 */
	let { cap = 'both', variant = 'full' }: { cap?: 'start' | 'end' | 'both'; variant?: 'heading' | 'full' } =
		$props()
</script>

<span class="rj-rule" class:rj-rule--heading={variant === 'heading'} aria-hidden="true">
	{#if cap === 'start' || cap === 'both'}
		<span class="rj-rule-dot"></span>
	{/if}
	<span class="rj-rule-line"></span>
	{#if cap === 'end' || cap === 'both'}
		<span class="rj-rule-dot"></span>
	{/if}
</span>

<style>
	.rj-rule {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.rj-rule--heading {
		flex: 1 1 auto;
		min-width: 0;
	}

	.rj-rule-line {
		flex: 1 1 auto;
		height: 1.2px;
		background: var(--rj-rule, #e1d6be);
	}

	.rj-rule-dot {
		flex: 0 0 auto;
		width: 4.9px;
		height: 4.9px;
		background: var(--rj-rule, #e1d6be);
		transform: rotate(45deg);
	}
</style>
