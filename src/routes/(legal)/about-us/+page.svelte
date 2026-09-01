<script lang="ts">
	import type { Page } from '$lib/core/types/index.js'
	import { SeoHeader } from '$lib/core/components/index.js'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'
	import { reveal } from '$lib/core/actions/reveal.js'
	import RjWideBanner from '$lib/theme/ryans-jewels/RjWideBanner.svelte'
	import { ryansSeoText } from '$lib/theme/ryans-jewels/seo.js'

	interface Props {
		data: {
			page: Page
			theme?: { name: string }
		}
	}

	const { data }: Props = $props()
	const isRyans = $derived(data?.theme?.name === 'ryans-jewels')
	const ryanDescription =
		'Discover the Ryan Jewelers story, our thoughtful craftsmanship and the values behind our lab-grown diamond jewelry.'

	const stats = [
		{ value: '15+', label: 'Years of experience' },
		{ value: '260+', label: 'Original designs' },
		{ value: '30K', label: 'Product reviews' }
	]

	const craftSteps = [
		{
			number: '01',
			title: 'Designed with intention',
			text: 'Every piece begins with a thoughtful sketch, balancing modern expression with timeless proportion.',
			icon: '/ryans-jewels/home/stat-pen-tool.svg'
		},
		{
			number: '02',
			title: 'Crafted with patience',
			text: 'Materials, settings and finishes are carefully considered so every detail feels beautiful and enduring.',
			icon: '/ryans-jewels/home/stat-timer.svg'
		},
		{
			number: '03',
			title: 'Checked with care',
			text: 'Each design is reviewed for comfort, character and quality before it becomes part of your story.',
			icon: '/ryans-jewels/home/stat-clipboard.svg'
		}
	]

	const values = [
		{
			title: 'Exceptional craft',
			text: 'Details matter. We bring precision and care to every design, setting and finish.'
		},
		{
			title: 'Timeless design',
			text: 'Jewelry should outlive a trend and remain meaningful through every chapter of life.'
		},
		{
			title: 'Conscious choices',
			text: 'Luxury feels better when beauty, quality and thoughtful choices come together.'
		}
	]
</script>

<SeoHeader
	metaTitle={ryansSeoText(data?.page?.metaTitle, 'About Ryan Jewelers')}
	metaDescription={isRyans ? ryanDescription : ryansSeoText(data?.page?.metaDescription, ryanDescription)}
/>

{#if isRyans}
	<div class="rj-about">
		<h1 class="sr-only">About Ryan Jewelers</h1>
		<RjWideBanner
			eyebrow="About Ryan Jewelers"
			heading="Made with meaning. Worn with love."
			subheading="Discover the story, craftsmanship and values behind jewelry made for life's most meaningful moments."
			ctaLabel="Discover our journey"
			ctaHref="#our-story"
			imageAlt="Model wearing Ryan Jewelers diamond necklaces"
			centered
		/>

		<nav class="rj-about-jump" aria-label="About Ryan Jewelers sections">
			<a href="#our-story">Our story</a>
			<a href="#our-craft">Our craftsmanship</a>
			<a href="#our-values">What guides us</a>
			<a href="#discover-ryan">Discover Ryan</a>
		</nav>

		<section id="our-story" class="rj-about-story" aria-labelledby="rj-about-story-title" data-reveal use:reveal>
			<div class="rj-about-story-media">
				<figure class="rj-about-story-main">
					<img
						src="/ryans-jewels/home/lookbook-side.jpg"
						alt="Ryan Jewelers diamond jewelry styled for a timeless look"
						loading="lazy"
					/>
				</figure>
				<figure class="rj-about-story-inset">
					<img
						src="/ryans-jewels/home/hero-desktop.png"
						alt="A close view of a Ryan Jewelers diamond ring"
						loading="lazy"
					/>
				</figure>
				<span class="rj-about-story-line" aria-hidden="true"></span>
			</div>

			<div class="rj-about-story-copy">
				<p class="rj-about-kicker">More Than Adornment</p>
				<h2 id="rj-about-story-title">Made for moments worth remembering.</h2>
				<p class="rj-about-lead">
					We believe true luxury is personal. It is the piece chosen for a milestone, worn every day, and passed on with a story of its own.
				</p>
				<p>
					At Ryan Jewelers, every collection brings together thoughtful design, careful craftsmanship and an enduring sense of beauty. Our purpose is simple: to help you find jewelry that feels unmistakably yours.
				</p>
			</div>
		</section>

		<section class="rj-about-manifesto" aria-label="Ryan Jewelers philosophy" data-reveal use:reveal>
			<p>Designed for every chapter. Crafted for every story. Made to remain yours.</p>
		</section>

		<section class="rj-about-stats" aria-label="Ryan Jewelers in numbers" data-reveal use:reveal>
			<ul>
				{#each stats as stat}
					<li>
						<strong>{stat.value}</strong>
						<span>{stat.label}</span>
					</li>
				{/each}
			</ul>
		</section>

		<section id="our-craft" class="rj-about-craft" aria-labelledby="rj-about-craft-title" data-reveal use:reveal>
			<div class="rj-about-section-heading">
				<p class="rj-about-kicker">The Art Behind Every Piece</p>
				<h2 id="rj-about-craft-title">Crafted with purpose, from first line to final polish.</h2>
				<p>Our process is built around considered design, patient craftsmanship and uncompromising attention to detail.</p>
			</div>

			<ol class="rj-about-steps">
				{#each craftSteps as step}
					<li>
						<div class="rj-about-step-top">
							<img src={step.icon} alt="" aria-hidden="true" />
							<span>{step.number}</span>
						</div>
						<h3>{step.title}</h3>
						<p>{step.text}</p>
					</li>
				{/each}
			</ol>
		</section>

		<section class="rj-about-quote" aria-label="Our belief" data-reveal use:reveal>
			<div class="rj-about-quote-copy">
				<img src="/ryans-jewels/home/star.svg" alt="" aria-hidden="true" />
				<blockquote>“True luxury is personal, meaningful and made to last.”</blockquote>
				<p>Our promise, in every Ryan Jewelers piece.</p>
			</div>
			<div class="rj-about-quote-media" aria-hidden="true">
				<img src="/ryans-jewels/home/banner-model.png" alt="" loading="lazy" />
			</div>
		</section>

		<section id="our-values" class="rj-about-values" aria-labelledby="rj-about-values-title" data-reveal use:reveal>
			<div class="rj-about-section-heading rj-about-section-heading--left">
				<p class="rj-about-kicker">What Guides Us</p>
				<h2 id="rj-about-values-title">Beauty with meaning.</h2>
			</div>

			<div class="rj-about-value-grid">
				{#each values as value, index}
					<article>
						<span>0{index + 1}</span>
						<h3>{value.title}</h3>
						<p>{value.text}</p>
					</article>
				{/each}
			</div>
		</section>

		{#if data?.page?.layouts?.length}
			<div class="rj-about-blocks"><Blocks layouts={data.page.layouts} /></div>
		{/if}

		<section id="discover-ryan" class="rj-about-cta" aria-labelledby="rj-about-cta-title" data-reveal use:reveal>
			<p class="rj-about-kicker">Find Your Piece</p>
			<h2 id="rj-about-cta-title">Your story deserves something extraordinary.</h2>
			<p>Explore our collections or create a piece that is uniquely yours.</p>
			<div class="rj-about-cta-actions">
				<a class="rj-about-button rj-about-button--gold" href="/products">Explore the collection</a>
				<a class="rj-about-button rj-about-button--outline" href="/products">Customize your jewelry</a>
			</div>
		</section>
	</div>
{:else}
	<section class="mt-20">
		<div class="container mx-auto flex max-w-7xl flex-col px-4 md:px-10">
			<div class="mx-auto flex max-w-max flex-col items-center py-5 text-center text-3xl font-bold sm:items-start sm:py-10 sm:text-4xl">
				<h1>About Us</h1>
				<hr class="mt-2.5 w-20 border-t-4 border-zinc-900 opacity-50" />
			</div>
			<div class="prose-lg prose-p:my-0 prose-li:my-0">{@html data?.page?.content}</div>
		</div>
	</section>

	<Blocks layouts={data.page.layouts} />
{/if}

<style>
	.rj-about {
		color: var(--rj-ink, #404040);
		background: #fff;
		font-family: 'Sarala', var(--font-body, sans-serif);
		overflow: hidden;
	}

	.rj-about h2,
	.rj-about h3,
	.rj-about p,
	.rj-about blockquote,
	.rj-about figure {
		margin: 0;
	}

	.rj-about-kicker {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 20px;
		font-weight: 400;
		line-height: 1.5;
		letter-spacing: normal;
		color: var(--rj-gold, #cca646);
	}

	.rj-about-jump {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(28px, 5vw, 76px);
		min-height: 60px;
		padding: 12px 24px;
		border-bottom: 1px solid var(--rj-line, #e5e5e5);
		background: rgba(255, 255, 255, 0.96);
	}

	.rj-about-jump a {
		position: relative;
		padding: 8px 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 15px;
		font-weight: 400;
		color: var(--rj-ink, #404040);
		text-decoration: none;
		white-space: nowrap;
	}

	.rj-about-jump a::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 2px;
		width: 100%;
		height: 1px;
		background: var(--rj-gold, #cca646);
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.25s var(--rj-ease, ease);
	}

	.rj-about-jump a:hover::after,
	.rj-about-jump a:focus-visible::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.rj-about-story {
		display: grid;
		grid-template-columns: minmax(360px, 0.92fr) minmax(420px, 1fr);
		align-items: center;
		gap: clamp(60px, 7vw, 100px);
		max-width: 1280px;
		margin: 0 auto;
		padding: 80px 60px 90px;
		scroll-margin-top: 100px;
	}

	.rj-about-story-media {
		position: relative;
		min-height: 650px;
	}

	.rj-about-story-main {
		position: absolute;
		top: 0;
		left: 0;
		width: 73%;
		height: 590px;
		border-radius: 10px;
		overflow: hidden;
	}

	.rj-about-story-inset {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 44%;
		height: 330px;
		padding: 9px;
		border-radius: 10px;
		background: #fff;
		box-shadow: 0 18px 50px rgba(42, 34, 20, 0.14);
	}

	.rj-about-story-main img,
	.rj-about-story-inset img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.rj-about-story-main img {
		object-position: center 24%;
	}

	.rj-about-story-inset img {
		object-position: center 44%;
		border-radius: 5px;
	}

	.rj-about-story-line {
		position: absolute;
		left: -24px;
		bottom: 55px;
		width: 110px;
		height: 1px;
		background: var(--rj-gold, #cca646);
	}

	.rj-about-story-copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
	}

	.rj-about-story-copy h2,
	.rj-about-section-heading h2,
	.rj-about-cta h2 {
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: clamp(32px, 3.2vw, 42px);
		font-weight: 400;
		line-height: 1.2;
		letter-spacing: normal;
		color: var(--rj-heading, #202020);
	}

	.rj-about-story-copy > p:not(.rj-about-kicker),
	.rj-about-section-heading > p:last-child {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: 29px;
		letter-spacing: 0.32px;
		color: #707070;
	}

	.rj-about-story-copy .rj-about-lead {
		font-size: 17px;
		line-height: 29px;
		color: var(--rj-ink, #404040);
	}

	.rj-about-manifesto {
		display: grid;
		place-items: center;
		min-height: 150px;
		padding: 34px 24px;
		background: var(--rj-gold, #cca646);
		text-align: center;
	}

	.rj-about-manifesto p {
		max-width: 850px;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: clamp(25px, 2.6vw, 38px);
		font-weight: 400;
		line-height: 1.35;
		color: #fff;
	}

	.rj-about-stats {
		background: var(--rj-cream, #faf6ea);
		border-block: 1px solid var(--rj-rule, #e1d6be);
	}

	.rj-about-stats ul {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		max-width: 1120px;
		margin: 0 auto;
		padding: 38px 24px;
		list-style: none;
	}

	.rj-about-stats li {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 6px 20px;
		text-align: center;
	}

	.rj-about-stats li + li {
		border-left: 1px solid var(--rj-rule, #e1d6be);
	}

	.rj-about-stats strong {
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 42px;
		font-weight: 400;
		line-height: 1.1;
		color: var(--rj-heading, #202020);
	}

	.rj-about-stats span {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 14px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--rj-ink-2, #606060);
	}

	.rj-about-values {
		max-width: 1320px;
		margin: 0 auto;
		padding: 80px 60px;
	}

	.rj-about-craft {
		max-width: none;
		margin: 0;
		padding: 80px max(60px, calc((100% - 1200px) / 2));
		background: var(--rj-cream, #faf6ea);
	}

	.rj-about-craft .rj-about-section-heading h2 {
		color: var(--rj-heading, #202020);
	}

	.rj-about-craft .rj-about-section-heading > p:last-child {
		color: var(--rj-ink-2, #606060);
	}

	.rj-about-section-heading {
		max-width: 760px;
		margin: 0 auto 50px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		text-align: center;
	}

	.rj-about-section-heading--left {
		align-items: flex-start;
		margin: 0 0 50px;
		text-align: left;
	}

	.rj-about-steps,
	.rj-about-value-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rj-about-steps li {
		min-height: 285px;
		padding: 34px;
		border: 1px solid var(--rj-rule, #e1d6be);
		border-radius: 5px;
		background: #fff;
		transition: transform 0.3s var(--rj-ease, ease), box-shadow 0.3s var(--rj-ease, ease), border-color 0.3s ease;
	}

	.rj-about-steps li:hover {
		transform: translateY(-7px);
		border-color: var(--rj-gold, #cca646);
		box-shadow: 0 12px 30px rgba(64, 64, 64, 0.08);
	}

	.rj-about-step-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 46px;
	}

	.rj-about-step-top img {
		width: 42px;
		height: 42px;
		object-fit: contain;
	}

	.rj-about-step-top span,
	.rj-about-value-grid article > span {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 13px;
		letter-spacing: 0.14em;
		color: var(--rj-gold, #cca646);
	}

	.rj-about-steps h3,
	.rj-about-value-grid h3 {
		margin-bottom: 14px;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 27px;
		font-weight: 400;
		line-height: 1.25;
		color: var(--rj-heading, #202020);
	}

	.rj-about-steps h3 {
		color: var(--rj-heading, #202020);
	}

	.rj-about-steps li > p,
	.rj-about-value-grid article > p {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: 1.7;
		color: #707070;
	}

	.rj-about-steps li > p {
		color: var(--rj-ink-2, #606060);
	}

	.rj-about-quote {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(330px, 0.55fr);
		min-height: 420px;
		background: var(--rj-cream, #faf6ea);
		overflow: hidden;
	}

	.rj-about-quote-copy {
		align-self: center;
		max-width: 790px;
		padding: 80px clamp(50px, 9vw, 140px);
	}

	.rj-about-quote-copy > img {
		width: 26px;
		margin-bottom: 26px;
	}

	.rj-about-quote blockquote {
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: clamp(34px, 3.6vw, 48px);
		font-weight: 400;
		line-height: 1.18;
		color: var(--rj-heading, #202020);
	}

	.rj-about-quote-copy p {
		margin-top: 28px;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 15px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--rj-gold, #cca646);
	}

	.rj-about-quote-media {
		position: relative;
		min-height: 420px;
		background: var(--rj-surface, #f4f4f4);
	}

	.rj-about-quote-media img {
		position: absolute;
		right: -2%;
		bottom: 0;
		width: min(560px, 120%);
		max-width: none;
	}

	.rj-about-values {
		padding-top: 80px;
		padding-bottom: 80px;
	}

	.rj-about-value-grid {
		gap: 0;
		border-top: 1px solid var(--rj-line, #e5e5e5);
		border-bottom: 1px solid var(--rj-line, #e5e5e5);
	}

	.rj-about-value-grid article {
		min-height: 250px;
		padding: 38px 40px;
	}

	.rj-about-value-grid article + article {
		border-left: 1px solid var(--rj-line, #e5e5e5);
	}

	.rj-about-value-grid article > span {
		display: block;
		margin-bottom: 42px;
	}

	.rj-about-cta {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 70px 24px 80px;
		border-block: 1px solid var(--rj-rule, #e1d6be);
		background: var(--rj-cream, #faf6ea);
		text-align: center;
	}

	.rj-about-cta h2 {
		max-width: 760px;
		margin-top: 18px;
		color: var(--rj-heading, #202020);
	}

	.rj-about-cta > p:not(.rj-about-kicker) {
		margin-top: 20px;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 17px;
		color: var(--rj-ink-2, #606060);
	}

	.rj-about-cta-actions {
		display: flex;
		gap: 14px;
		margin-top: 38px;
	}

	.rj-about-button {
		min-width: 205px;
		padding: 15px 24px;
		border: 1px solid var(--rj-gold, #cca646);
		border-radius: 2px;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		font-weight: 700;
		line-height: 24px;
		text-decoration: none;
		transition: background 0.22s ease, color 0.22s ease, transform 0.22s var(--rj-ease, ease);
	}

	.rj-about-button:hover {
		transform: translateY(-2px);
	}

	.rj-about-button--gold {
		background: var(--rj-gold, #cca646);
		color: #fff;
	}

	.rj-about-button--outline {
		background: #fff;
		color: var(--rj-heading, #202020);
	}

	.rj-about-button--outline:hover {
		background: var(--rj-gold, #cca646);
	}

	@media (max-width: 1023px) {
		.rj-about-story {
			grid-template-columns: 1fr 1fr;
			gap: 55px;
			padding: 60px 40px 70px;
		}

		.rj-about-story-media {
			min-height: 560px;
		}

		.rj-about-story-main {
			height: 500px;
		}

		.rj-about-story-inset {
			height: 270px;
		}

		.rj-about-values {
			padding: 60px 40px;
		}

		.rj-about-craft {
			padding: 60px 40px;
		}

		.rj-about-steps {
			gap: 16px;
		}

		.rj-about-steps li {
			padding: 28px 24px;
		}

		.rj-about-quote-copy {
			padding: 60px 40px;
		}

		.rj-about-value-grid article {
			padding: 32px 26px;
		}
	}

	@media (max-width: 767px) {
		.rj-about-jump {
			justify-content: flex-start;
			gap: 28px;
			min-height: 62px;
			overflow-x: auto;
			scrollbar-width: none;
		}

		.rj-about-jump::-webkit-scrollbar {
			display: none;
		}

		.rj-about-story {
			display: flex;
			flex-direction: column;
			gap: 40px;
			padding: 50px 20px 60px;
		}

		.rj-about-story-media {
			width: 100%;
			min-height: 420px;
		}

		.rj-about-story-main {
			width: 78%;
			height: 360px;
		}

		.rj-about-story-inset {
			width: 47%;
			height: 210px;
		}

		.rj-about-story-line {
			left: -10px;
			bottom: 28px;
			width: 70px;
		}

		.rj-about-story-copy h2,
		.rj-about-section-heading h2,
		.rj-about-cta h2 {
			font-size: 30px;
		}

		.rj-about-story-copy .rj-about-lead {
			font-size: 16px;
		}

		.rj-about-stats ul {
			grid-template-columns: 1fr;
			padding: 22px 24px;
		}

		.rj-about-stats li {
			padding: 24px 12px;
		}

		.rj-about-stats li + li {
			border-top: 1px solid var(--rj-rule, #e1d6be);
			border-left: 0;
		}

		.rj-about-stats strong {
			font-size: 34px;
		}

		.rj-about-values {
			padding: 50px 20px;
		}

		.rj-about-craft {
			padding: 50px 20px;
		}

		.rj-about-section-heading {
			align-items: flex-start;
			margin-bottom: 42px;
			text-align: left;
		}

		.rj-about-steps,
		.rj-about-value-grid {
			grid-template-columns: 1fr;
		}

		.rj-about-steps li {
			min-height: 0;
			padding: 28px;
		}

		.rj-about-step-top {
			margin-bottom: 36px;
		}

		.rj-about-quote {
			display: flex;
			min-height: 0;
			flex-direction: column;
		}

		.rj-about-quote-copy {
			padding: 50px 20px 44px;
		}

		.rj-about-quote blockquote {
			font-size: 34px;
		}

		.rj-about-quote-media {
			position: relative;
			min-height: 320px;
			width: 100%;
		}

		.rj-about-quote-media img {
			right: 50%;
			width: min(360px, 90vw);
			transform: translateX(50%);
		}

		.rj-about-value-grid {
			border-bottom: 0;
		}

		.rj-about-value-grid article {
			min-height: 0;
			padding: 30px 4px;
			border-bottom: 1px solid var(--rj-line, #e5e5e5);
		}

		.rj-about-value-grid article + article {
			border-left: 0;
		}

		.rj-about-value-grid article > span {
			margin-bottom: 24px;
		}

		.rj-about-cta {
			padding: 50px 20px 60px;
		}

		.rj-about-cta-actions {
			width: 100%;
			max-width: 390px;
			flex-direction: column;
		}

		.rj-about-button {
			width: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-about-steps li,
		.rj-about-button,
		.rj-about-jump a::after {
			transition: none;
		}
	}
</style>
