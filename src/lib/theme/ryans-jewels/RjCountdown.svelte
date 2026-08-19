<script lang="ts">
	/**
	 * Offer countdown — four bordered value boxes with labels underneath.
	 * Source: 1:6479 (desktop 60×60 boxes, 24px values, 12px labels)
	 *         · 63:40811 (tablet 45×45, 22px, 10px) · 77:107453 (mobile 35×35, 16px, 10px)
	 *
	 * The mock freezes the clock at 21:59:08:08. This runs a real countdown to the
	 * theme's `offerEndsAt` instead, because a static timer would be fabricated
	 * data; when the target has passed every unit reads 00.
	 *
	 * Labels keep the source's spelling, including "Secound".
	 */
	let { endsAt, labels }: { endsAt: string; labels: string[] } = $props()

	const target = $derived(new Date(endsAt).getTime())
	let now = $state(Date.now())

	$effect(() => {
		const id = setInterval(() => (now = Date.now()), 1000)
		return () => clearInterval(id)
	})

	const parts = $derived.by(() => {
		const ms = Math.max(target - now, 0)
		const total = Number.isFinite(ms) ? Math.floor(ms / 1000) : 0
		return [
			Math.floor(total / 86400),
			Math.floor((total % 86400) / 3600),
			Math.floor((total % 3600) / 60),
			total % 60
		].map((n) => String(n).padStart(2, '0'))
	})

	const remainingLabel = $derived(
		`${parts[0]} days, ${parts[1]} hours, ${parts[2]} minutes and ${parts[3]} seconds remaining`
	)
</script>

<div class="rj-count" role="timer" aria-label={remainingLabel}>
	{#each parts as value, i (labels[i])}
		{#if i > 0}
			<span class="rj-count-sep" aria-hidden="true">:</span>
		{/if}
		<div class="rj-count-unit">
			<span class="rj-count-box"><span class="rj-count-value">{value}</span></span>
			<span class="rj-count-label">{labels[i]}</span>
		</div>
	{/each}
</div>

<style>
	/*
	 * Figma trims the value and label boxes to cap height, so the unit's total
	 * height is box + gap + label-cap — 60 + 12 + 8 = 80 on desktop (1:6479).
	 * The line-heights below are those trimmed boxes.
	 */
	.rj-count {
		--box: 60px;
		display: flex;
		align-items: flex-start;
		gap: 5px;
	}

	.rj-count-unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: var(--box);
	}

	/* 1:6481 — 60×60, radius 5, #fdfdfd on a 1px #e1d6be rule. */
	.rj-count-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: var(--box);
		border: 1px solid var(--rj-rule, #e1d6be);
		border-radius: 5px;
		background: #fdfdfd;
	}

	.rj-count-value {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 24px;
		line-height: 17px;
		color: #000;
	}

	.rj-count-label {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 12px;
		line-height: 8px;
		text-align: center;
		color: var(--rj-ink, #404040);
	}

	.rj-count-sep {
		display: flex;
		align-items: center;
		height: var(--box);
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 24px;
		line-height: 39px;
		color: #000;
	}

	/* Tablet 744 — 45×45 boxes, 22px values, 10px labels (63:40811). */
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-count {
			--box: 45px;
			gap: 6px;
		}

		.rj-count-unit {
			gap: 10px;
		}

		.rj-count-value {
			font-size: 22px;
			line-height: 16px;
		}

		.rj-count-label {
			font-size: 10px;
			line-height: 7px;
		}
	}

	/*
	 * Mobile 412 — the source boxes are content-sized (12/10 padding around a
	 * 16px value), so they run 35–40 wide depending on the digits (77:107453).
	 */
	@media (max-width: 639px) {
		.rj-count {
			--box: auto;
			gap: 2px;
		}

		.rj-count-unit {
			width: auto;
			gap: 10px;
		}

		.rj-count-box {
			height: 35px;
			padding: 0 10px;
		}

		.rj-count-value {
			font-size: 16px;
			line-height: 11px;
		}

		.rj-count-sep {
			height: 35px;
		}
	}
</style>
