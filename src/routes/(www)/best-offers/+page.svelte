<svelte:head><title>Best Offers — Coming Soon | Ryan Jewelers</title></svelte:head>

<main class="rj-offers-coming-soon">
	<div class="rj-offers-card">
		<img src="/ryans-jewels/icons/gift-box-3d-premium.png" alt="" />
		<p>Something special is on the way</p>
		<h1>Best Offers<br /><span>Coming Soon</span></h1>
		<div class="rj-offers-line"></div>
		<p class="rj-offers-copy">We’re preparing exclusive jewellery offers for you. Please check back soon.</p>
		<a href="/">Back to Home</a>
	</div>
</main>

<style>
	.rj-offers-coming-soon {
		display: grid;
		min-height: 620px;
		place-items: center;
		padding: 64px 20px;
		background:
			radial-gradient(circle at 50% 25%, rgb(204 166 70 / 14%), transparent 34%),
			url('/ryans-jewels/listing/category-bg.png') center / cover;
		font-family: 'Sarala', var(--font-body, sans-serif);
		text-align: center;
	}

	.rj-offers-card {
		width: min(100%, 620px);
		padding: 54px 48px;
		border: 1px solid #e5d7b5;
		border-radius: 16px;
		background: rgb(255 255 255 / 92%);
		box-shadow: 0 24px 70px rgb(67 52 20 / 10%);
	}

	.rj-offers-card img { width: 74px; height: 74px; margin: 0 auto 20px; object-fit: contain; }
	.rj-offers-card > p:first-of-type { margin: 0 0 10px; color: #9b7a28; font-size: 14px; letter-spacing: .12em; text-transform: uppercase; }
	.rj-offers-card h1 { margin: 0; color: #303030; font-family: 'Inria Serif', var(--font-heading, serif); font-size: clamp(40px, 6vw, 64px); font-weight: 400; line-height: 1.08; }
	.rj-offers-card h1 span { color: #cca646; }
	.rj-offers-line { width: 70px; height: 1px; margin: 25px auto; background: #cca646; }
	.rj-offers-copy { max-width: 430px; margin: 0 auto 28px; color: #686868; font-size: 16px; line-height: 1.65; }
	.rj-offers-card a { display: inline-flex; min-width: 150px; justify-content: center; padding: 12px 22px; border: 1px solid #cca646; border-radius: 4px; color: #303030; text-decoration: none; transition: .2s ease; }
	.rj-offers-card a:hover { background: #cca646; color: #fff; }

	@media (max-width: 639px) {
		.rj-offers-coming-soon { min-height: 520px; padding: 36px 16px; }
		.rj-offers-card { padding: 42px 22px; }
	}
</style>
