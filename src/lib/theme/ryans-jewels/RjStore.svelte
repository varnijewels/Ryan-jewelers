<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte'
</script>

<section class="rj-store" aria-labelledby="rj-store-heading">
	<div class="trust-copy">
		<h2 id="rj-store-heading">The ring is important.<br />So is how you find it.</h2>
		<p>
			At Ryan Jewelers, we believe choosing a diamond should feel exciting and personal.
			From exploring your options to creating a piece that’s entirely yours, our Salisbury
			team is here to help you find jewelry that feels right for your moment.
		</p>
		<a href="/about-us">Why Trust Us <ArrowUpRight size={16} aria-hidden="true" /></a>
	</div>
</section>

<style>
	.rj-store {
		display: grid;
		place-items: center;
		width: 100%;
		margin: 30px 0 60px;
		padding: 80px 40px;
		background: var(--rj-cream, #faf6ea);
		background-image: url('/ryans-jewels/home/trust-texture.svg');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		color: var(--rj-ink, #404040);
		text-align: center;
	}
	.trust-copy { display: flex; width: 100%; max-width: 700px; flex-direction: column; align-items: center; }
	h2 { margin: 0; font: 400 clamp(30px, 3.1vw, 48px)/1.16 var(--font-heading, serif); letter-spacing: -.025em; }
	p { max-width: 650px; margin: 24px 0 32px; color: var(--rj-ink-2, #606060); font: 400 16px/1.75 var(--font-body, sans-serif); }
	a { display: inline-flex; align-items: center; gap: 10px; padding-bottom: 5px; border-bottom: 1px solid currentColor; color: #8b6b29; font: 500 14px/1.5 var(--font-body, sans-serif); text-decoration: none; }
	a:hover { color: var(--rj-ink, #404040); }
	a:focus-visible { outline: 2px solid #8b6b29; outline-offset: 5px; }
	@media (max-width: 639px) { .rj-store { margin: 24px 0 35px; padding-inline: 24px; } h2 { font-size: 30px; } p { font-size: 15px; } }
</style>
