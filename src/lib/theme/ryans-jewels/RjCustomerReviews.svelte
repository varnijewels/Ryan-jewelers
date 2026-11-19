<script lang="ts">
	import { ArrowUpRight, Quote, Star } from '@lucide/svelte'
	const googleProfile = 'https://www.google.com/maps?q=place_id:ChIJPdiRcTsDuYkRrclscE6EDko'
	const ratingSource = 'https://reviews.birdeye.com/ryan-jewelers-167913474625329'
	const excerptSource = 'https://www.loc8nearme.com/maryland/salisbury/jewelry-stores/'
	// shortcut: public rating and excerpt are a checked snapshot; refresh when their source listings change.
</script>

<section class="rj-customer-reviews" aria-labelledby="rj-reviews-heading">
	<div class="reviews-inner">
		<header>
			<p class="reviews-eyebrow">Customer Reviews</p>
			<h2 id="rj-reviews-heading">Words from<br />our customers.</h2>
			<p class="reviews-intro">Thoughtful gifts. Personal service. Stories from people who have visited our Salisbury store.</p>
			<a class="reviews-link" href={googleProfile} target="_blank" rel="noopener noreferrer">View our Google profile <ArrowUpRight size={15} aria-hidden="true" /></a>
		</header>
		<div class="reviews-rating">
			<div class="rating-number"><span>4.9</span><Star size={23} fill="currentColor" strokeWidth={1} aria-hidden="true" /></div>
			<p>out of 5</p>
			<a href={ratingSource} target="_blank" rel="noopener noreferrer">169 reviews on Birdeye <ArrowUpRight size={13} aria-hidden="true" /></a>
			<small>Checked November 19, 2026</small>
		</div>
		<figure class="review-excerpt">
			<Quote size={27} strokeWidth={1.2} aria-hidden="true" />
			<blockquote>“Had a fantastic experience purchasing a necklace for my daughter. … Customer service was great.”</blockquote>
			<figcaption><a href={excerptSource} target="_blank" rel="noopener noreferrer">Customer review excerpt · Loc8NearMe <ArrowUpRight size={13} aria-hidden="true" /></a></figcaption>
		</figure>
	</div>
</section>

<style>
	.rj-customer-reviews { padding: 62px 40px; background: #fff; color: var(--rj-ink, #404040); }
	.reviews-inner { display: grid; grid-template-columns: minmax(0, .9fr) minmax(160px, .55fr) minmax(0, 1.3fr); align-items: center; gap: 48px; max-width: 1440px; margin: auto; padding-block: 45px; border-block: 1px solid #e8dfcc; }
	.reviews-eyebrow { margin: 0 0 15px; color: #8b6b29; font-size: 10px; line-height: 1.6; letter-spacing: .16em; text-transform: uppercase; }
	h2 { margin: 0 0 20px; color: #35312b; font: 400 34px/1.2 var(--font-heading, serif); }
	.reviews-intro { max-width: 330px; margin: 0 0 22px; color: #686259; font-size: 13px; line-height: 1.8; }
	.reviews-link { display: inline-flex; align-items: center; gap: 15px; padding-bottom: 6px; border-bottom: 1px solid #ae8d46; color: #795a20; font-size: 12px; text-decoration: none; }
	.reviews-rating { text-align: center; }
	.rating-number { display: flex; align-items: center; justify-content: center; gap: 9px; color: #a17b27; }
	.rating-number > span { font: 400 80px/1.05 var(--font-heading, serif) !important; letter-spacing: -.06em; }
	.reviews-rating p { margin: 8px 0 16px; color: #686259; font-size: 12px; }
	.reviews-rating a { display: inline-flex; align-items: center; justify-content: center; gap: 5px; color: #4b4336; font-size: 11px; text-underline-offset: 3px; }
	.reviews-rating small { display: block; margin-top: 10px; color: #70685c; font-size: 10px; line-height: 1.5; }
	.review-excerpt { margin: 0; padding: 34px; border: 1px solid #e9dfc8; background: var(--rj-cream, #faf6ea); }
	.review-excerpt > :global(svg) { color: #a17b27; }
	blockquote { margin: 20px 0 25px; color: #40382c; font: 400 24px/1.6 var(--font-heading, serif) !important; }
	figcaption a { display: inline-flex; align-items: center; gap: 6px; color: #75613a; font-size: 10px; line-height: 1.7; text-underline-offset: 3px; }
	a:focus-visible { outline: 2px solid #8b6b29; outline-offset: 5px; }
	@media (max-width: 1000px) { .reviews-inner { grid-template-columns: 1fr 1fr; gap: 35px; }.review-excerpt { grid-column: 1 / -1; } }
	@media (max-width: 639px) { .rj-customer-reviews { padding: 20px 24px 34px; }.reviews-inner { grid-template-columns: 1fr; gap: 30px; padding-block: 30px; }.reviews-rating { padding-block: 15px; border-block: 1px solid #e8dfcc; }.review-excerpt { padding: 26px; }blockquote { font-size: 21px !important; }.rating-number > span { font-size: 64px !important; } }
</style>
