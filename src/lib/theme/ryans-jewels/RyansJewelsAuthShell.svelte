<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		eyebrow,
		title,
		description,
		children
	}: {
		eyebrow: string
		title: string
		description: string
		children: Snippet
	} = $props()
</script>

<main class="rj-auth-page">
	<div class="rj-auth-frame">
		<section class="rj-auth-visual" aria-label="Ryan Jewelers craftsmanship">
			<img src="/ryans-jewels/home/hero-desktop.png" alt="Diamond engagement ring crafted by Ryan Jewelers" />
			<div class="rj-auth-shade"></div>
			<a class="rj-auth-mark" href="/" aria-label="Ryan Jewelers home">
				<img src="/ryans-jewels/logo.png" alt="Ryan Jewelers" />
			</a>
			<div class="rj-auth-story">
				<span>CRAFTED FOR YOUR STORY</span>
				<h2>Where every detail holds a little more meaning.</h2>
				<p>Discover fine jewelry designed for life's most unforgettable moments.</p>
				<div class="rj-auth-promises">
					<span><i>✓</i> Certified jewelry</span>
					<span><i>✓</i> Secure checkout</span>
					<span><i>✓</i> Easy returns</span>
				</div>
			</div>
		</section>

		<section class="rj-auth-panel">
			<div class="rj-auth-panel-top">
				<a href="/" aria-label="Back to Ryan Jewelers home">← Back to store</a>
				<span>RYAN JEWELERS</span>
			</div>
			<div class="rj-auth-card">
				<img class="rj-auth-logo" src="/ryans-jewels/logo.png" alt="Ryan Jewelers" />
				<header>
					<span>{eyebrow}</span>
					<h1>{title}</h1>
					<p>{description}</p>
				</header>
				{@render children()}
			</div>
			<p class="rj-auth-security"><span aria-hidden="true">◇</span> Your personal information is protected with secure encryption.</p>
		</section>
	</div>
</main>

<style>
	.rj-auth-page { box-sizing: border-box; min-height: 760px; padding: 32px; background: radial-gradient(circle at 8% 10%, #fffaf0 0, transparent 28%), #f5f1e8; color: #282722; font-family: 'Lato', sans-serif; }
	.rj-auth-frame { display: grid; width: min(1180px, 100%); min-height: 720px; margin: 0 auto; overflow: hidden; border: 1px solid #e4dccd; border-radius: 18px; background: #fff; box-shadow: 0 22px 70px rgba(52, 42, 22, .12); grid-template-columns: minmax(0, 1.04fr) minmax(460px, .96fr); }
	.rj-auth-visual { position: relative; min-height: 720px; overflow: hidden; background: #181816; }
	.rj-auth-visual > img { width: 100%; height: 100%; object-fit: cover; object-position: 48% center; filter: sepia(.12) contrast(1.03); transform: scale(1.015); }
	.rj-auth-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(12, 12, 10, .16) 4%, rgba(14, 13, 10, .02) 42%, rgba(14, 13, 10, .88) 100%); }
	.rj-auth-mark { position: absolute; top: 28px; left: 30px; display: flex; width: 180px; height: 54px; align-items: center; justify-content: center; border: 1px solid rgba(255, 255, 255, .64); border-radius: 5px; background: rgba(255, 255, 255, .9); backdrop-filter: blur(10px); }
	.rj-auth-mark img { width: 150px; max-height: 42px; object-fit: contain; }
	.rj-auth-story { position: absolute; right: 42px; bottom: 42px; left: 42px; color: #fff; }
	.rj-auth-story > span { color: #e0b84f; font: 600 11px/16px 'Sarala', sans-serif; letter-spacing: 2px; }
	.rj-auth-story h2 { max-width: 520px; margin: 10px 0 8px; font: 400 clamp(29px, 3vw, 43px)/1.18 'Sarala', sans-serif; letter-spacing: -.8px; }
	.rj-auth-story p { max-width: 470px; margin: 0; color: rgba(255, 255, 255, .78); font-size: 14px; line-height: 1.7; }
	.rj-auth-promises { display: flex; flex-wrap: wrap; gap: 16px 24px; margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, .2); color: rgba(255, 255, 255, .86); font-size: 12px; }
	.rj-auth-promises span { display: inline-flex; align-items: center; gap: 7px; }
	.rj-auth-promises i { display: inline-grid; width: 18px; height: 18px; place-items: center; border: 1px solid rgba(224, 184, 79, .72); border-radius: 50%; color: #e0b84f; font-style: normal; font-size: 10px; }
	.rj-auth-panel { display: flex; min-width: 0; flex-direction: column; padding: 26px 48px 22px; background: linear-gradient(155deg, #fff 0%, #fff 62%, #fbf8f1 100%); }
	.rj-auth-panel-top { display: flex; align-items: center; justify-content: space-between; color: #8b806c; font: 500 11px/18px 'Sarala', sans-serif; letter-spacing: 1.2px; }
	.rj-auth-panel-top a { color: #655e52; letter-spacing: 0; text-decoration: none; }
	.rj-auth-panel-top a:hover { color: #b18720; }
	.rj-auth-card { width: min(430px, 100%); margin: auto; padding: 30px 0; }
	.rj-auth-logo { display: none; width: 176px; max-height: 52px; object-fit: contain; }
	.rj-auth-card header > span { color: #b13b56; font: 600 10px/16px 'Sarala', sans-serif; letter-spacing: 1.7px; }
	.rj-auth-card h1 { margin: 7px 0 6px; color: #24231f; font: 500 clamp(29px, 3vw, 38px)/1.2 'Sarala', sans-serif; letter-spacing: -.6px; }
	.rj-auth-card header p { margin: 0 0 25px; color: #746f65; font-size: 14px; line-height: 1.65; }
	.rj-auth-security { display: flex; align-items: center; justify-content: center; gap: 7px; margin: 18px 0 0; color: #8b867d; font-size: 11px; text-align: center; }
	.rj-auth-security span { color: #c39b37; font-size: 16px; }

	@media (max-width: 900px) {
		.rj-auth-page { padding: 20px; }
		.rj-auth-frame { min-height: 680px; grid-template-columns: minmax(280px, .78fr) minmax(430px, 1.22fr); }
		.rj-auth-visual { min-height: 680px; }
		.rj-auth-story { right: 28px; bottom: 30px; left: 28px; }
		.rj-auth-promises { gap: 10px 16px; }
		.rj-auth-panel { padding-right: 34px; padding-left: 34px; }
	}

	@media (max-width: 720px) {
		.rj-auth-page { min-height: auto; padding: 0; background: #fff; }
		.rj-auth-frame { display: block; min-height: auto; border: 0; border-radius: 0; box-shadow: none; }
		.rj-auth-visual { min-height: 200px; }
		.rj-auth-visual > img { object-position: center 52%; }
		.rj-auth-shade { background: linear-gradient(180deg, rgba(18, 17, 14, .06), rgba(18, 17, 14, .58)); }
		.rj-auth-mark, .rj-auth-story p, .rj-auth-promises { display: none; }
		.rj-auth-story { right: 22px; bottom: 22px; left: 22px; }
		.rj-auth-story h2 { max-width: 330px; margin-bottom: 0; font-size: 25px; }
		.rj-auth-panel { min-height: 570px; padding: 19px 22px 24px; }
		.rj-auth-panel-top > span { display: none; }
		.rj-auth-card { margin: 8px auto auto; padding: 16px 0 24px; }
		.rj-auth-logo { display: block; margin: 0 auto 24px; }
		.rj-auth-card header { text-align: center; }
		.rj-auth-card h1 { font-size: 29px; }
		.rj-auth-card header p { margin-bottom: 22px; }
	}
</style>
