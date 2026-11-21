<script lang="ts">
	/**
	 * Floating help widget pinned to the viewport.
	 * Source: 1:6500 — pill (h45, r5, px12 py9, gap14, drop-shadow -2px 2px 5px rgba(187,187,187,.25))
	 * above a 70px round button (r35, px13 py10) holding the 45x42 logo mark.
	 * Tablet uses the same component at 63:41090.
	 */
	import { onMount } from 'svelte'
	import { ryansJewelsHome } from './home-content.js'

	const { chat } = ryansJewelsHome
	let visible = $state(false)

	onMount(() => {
		const sound = new Audio('/ryans-jewels/chat-chime.wav')
		sound.volume = 0.35
		const timer = window.setTimeout(() => {
			visible = true
			// Browsers may block sound until the visitor interacts with the page.
			if (window.matchMedia('(min-width: 640px)').matches) void sound.play().catch(() => {})
		}, 5000)
		return () => {
			window.clearTimeout(timer)
			sound.pause()
		}
	})
</script>

{#if visible}
<div class="rj-chat">
	<a class="rj-chat-pill" href={chat.href}>
		<span>{chat.label}</span>
		<svg class="rj-chat-caret" width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
			<path d="M4 2.5L8.5 6.5L4 10.5" stroke="#353535" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</a>
	<a class="rj-chat-button" href={chat.href} aria-label={chat.label}>
		<span class="rj-chat-mark"><img src={chat.logo} alt="" /></span>
	</a>
</div>
{/if}

<style>
	.rj-chat {
		position: fixed;
		right: 31px;
		bottom: 45px;
		z-index: 20;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 10px;
		width: 195px;
	}

	.rj-chat-pill {
		display: flex;
		align-items: center;
		gap: 14px;
		width: 100%;
		height: 45px;
		padding: 9px 12px;
		background: #fff;
		border-radius: 5px;
		filter: drop-shadow(-2px 2px 5px rgba(187, 187, 187, 0.25));
		text-decoration: none;
	}

	.rj-chat-pill span {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: normal;
		color: #353535;
		white-space: nowrap;
	}

	.rj-chat-caret {
		width: 13px;
		height: 13px;
		flex-shrink: 0;
	}

	.rj-chat-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 70px;
		height: 70px;
		padding: 10px 13px;
		background: #fff;
		border-radius: 35px;
		filter: drop-shadow(-2px -2px 5px rgba(187, 187, 187, 0.25));
	}

	/* same 55x52 crop transform as the header wordmark, scaled to 45x42 */
	.rj-chat-mark {
		position: relative;
		display: block;
		width: 45px;
		height: 42px;
		overflow: hidden;
	}

	.rj-chat-mark img {
		position: absolute;
		left: -59.69%;
		top: -39%;
		width: 206.72%;
		height: 221.3%;
		max-width: none;
	}

	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-chat {
			right: 25px;
			bottom: 16px;
		}
	}

	@media (min-width: 768px) and (max-width: 1100px) and (orientation: landscape) {
		.rj-chat {
			right: 25px;
			bottom: 25px;
		}
	}

	/* The mobile frame has no floating widget (77:106781). */
	@media (max-width: 639px) {
		.rj-chat {
			display: none;
		}
	}
</style>
