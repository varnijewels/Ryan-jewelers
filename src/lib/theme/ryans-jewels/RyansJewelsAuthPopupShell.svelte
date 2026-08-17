<script lang="ts">
	import type { Snippet } from 'svelte'

	let { children }: { children: Snippet } = $props()
</script>

<div class="rj-auth-popup">
	<aside>
		<img src="/ryans-jewels/home/hero-desktop.png" alt="Diamond engagement ring crafted by Ryan Jewelers" />
		<div class="rj-auth-popup-shade"></div>
		<a href="/" aria-label="Ryan Jewelers home"><img src="/ryans-jewels/logo.webp" alt="Ryan Jewelers" /></a>
		<div class="rj-auth-popup-story">
			<span>CRAFTED FOR YOUR STORY</span>
			<h2>Where every detail holds a little more meaning.</h2>
			<p>Fine jewelry designed for life's most unforgettable moments.</p>
			<div><span>✓ Certified jewelry</span><span>✓ Secure checkout</span></div>
		</div>
	</aside>
	<section class="rj-auth-popup-panel">
		{@render children()}
	</section>
</div>

<style>
	.rj-auth-popup { position: relative; display: grid; width: min(920px, calc(100vw - 32px)); max-height: min(760px, calc(100dvh - 32px)); overflow: hidden; border: 1px solid #e5ded1; border-radius: 16px; background: #fff; box-shadow: 0 26px 80px rgba(0, 0, 0, .26); font-family: 'Sarala', var(--font-body, sans-serif); grid-template-columns: minmax(340px, .9fr) minmax(460px, 1.1fr); }
	.rj-auth-popup > aside { position: relative; min-height: 650px; overflow: hidden; background: #181816; }
	.rj-auth-popup > aside > img { width: 100%; height: 100%; object-fit: cover; object-position: 49% center; filter: sepia(.1) contrast(1.02); }
	.rj-auth-popup-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(13, 12, 10, .08), rgba(13, 12, 10, .08) 44%, rgba(13, 12, 10, .9)); }
	.rj-auth-popup > aside > a { position: absolute; top: 24px; left: 24px; display: grid; width: 164px; height: 50px; place-items: center; border: 1px solid rgba(255, 255, 255, .58); border-radius: 5px; background: rgba(255, 255, 255, .91); backdrop-filter: blur(10px); }
	.rj-auth-popup > aside > a img { width: 142px; max-height: 39px; object-fit: contain; }
	.rj-auth-popup-story { position: absolute; right: 30px; bottom: 30px; left: 30px; color: #fff; }
	.rj-auth-popup-story > span { color: #e0b84f; font: 600 10px/15px 'Sarala', sans-serif; letter-spacing: 1.7px; }
	.rj-auth-popup-story h2 { margin: 9px 0 7px; font-family: 'Rozha One', var(--font-heading, serif); font-size: 30px; font-weight: 400; line-height: 1.2; letter-spacing: -.5px; }
	.rj-auth-popup-story p { margin: 0; color: rgba(255, 255, 255, .76); font-family: inherit; font-size: 12px; font-weight: 400; line-height: 1.6; }
	.rj-auth-popup-story > div { display: flex; gap: 15px; margin-top: 18px; padding-top: 15px; border-top: 1px solid rgba(255, 255, 255, .18); color: rgba(255, 255, 255, .82); font-family: inherit; font-size: 10px; font-weight: 400; }
	.rj-auth-popup-panel { min-width: 0; min-height: 0; overflow-y: auto; background: linear-gradient(150deg, #fff 0%, #fff 68%, #fbf8f1 100%); }
	.rj-auth-popup-panel :global(h1), .rj-auth-popup-panel :global(h2) { font-family: 'Rozha One', var(--font-heading, serif); font-weight: 400; letter-spacing: 0; }
	.rj-auth-popup-panel :global(input), .rj-auth-popup-panel :global(button), .rj-auth-popup-panel :global(select), .rj-auth-popup-panel :global(textarea) { font-family: inherit; }

	@media (max-width: 840px) {
		.rj-auth-popup { width: min(480px, calc(100vw - 24px)); grid-template-columns: 1fr; }
		.rj-auth-popup > aside { display: none; }
	}

	@media (max-width: 639px) {
		.rj-auth-popup { width: 100vw; max-height: 100dvh; min-height: 100dvh; border: 0; border-radius: 0; }
		.rj-auth-popup-panel { min-height: 100dvh; }
	}
</style>
