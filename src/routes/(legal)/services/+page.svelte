<script lang="ts">
	import RjWideBanner from '$lib/theme/ryans-jewels/RjWideBanner.svelte'
	import { SeoHeader } from '$lib/core/components/index.js'

	const services = [
		{
			number: '01',
			title: 'Jewelry Repair & Restoration',
			text: 'From worn settings and broken clasps to treasured heirlooms, we carefully assess each piece and recommend the right repair.'
		},
		{
			number: '02',
			title: 'Custom Jewelry Design',
			text: 'Create something unmistakably yours with a guided design process shaped around your story, style and budget.'
		},
		{
			number: '03',
			title: 'Ring Sizing & Adjustments',
			text: 'A considered fit makes all the difference. We resize and adjust rings for lasting comfort and confident everyday wear.'
		},
		{
			number: '04',
			title: 'Cleaning & Inspection',
			text: 'Professional cleaning restores brilliance while a careful inspection helps identify loose stones and wear before they become problems.'
		},
		{
			number: '05',
			title: 'Jewelry Appraisals',
			text: 'Receive a clear assessment of your jewelry for insurance, estate planning or a better understanding of the pieces you own.'
		},
		{
			number: '06',
			title: 'Watch Care',
			text: 'Keep your watch performing and looking its best with practical care, inspection and service guidance from our team.'
		}
	]

	const steps = [
		{ number: '01', title: 'Bring us your piece', text: 'Visit or contact us and tell us what your jewelry needs.' },
		{ number: '02', title: 'Review the recommendation', text: 'We assess the piece and explain the suggested work before it begins.' },
		{ number: '03', title: 'Wear it with confidence', text: 'Your finished piece is checked and returned ready to be enjoyed again.' }
	]
</script>

<SeoHeader
	metaTitle="Jewelry Services | Ryan Jewelers"
	metaDescription="Explore jewelry repair, custom design, ring sizing, cleaning, appraisal and watch care services from Ryan Jewelers."
/>

<div class="rj-services">
	<RjWideBanner
		eyebrow="Ryan Jewelers Services"
		heading="Expert care for every piece you treasure."
		subheading="Thoughtful service, careful craftsmanship and honest guidance for jewelry made to last."
		ctaLabel="Book a consultation"
		ctaHref="/contact-us"
		centered
	/>

	<section class="rj-services-intro" aria-labelledby="services-intro-title">
		<p class="rj-services-kicker">Care Beyond The Purchase</p>
		<h1 id="services-intro-title">Your jewelry deserves a lifetime of care.</h1>
		<p>
			Whether you are restoring a meaningful heirloom, perfecting a fit or beginning a custom design, our team gives every piece the attention its story deserves.
		</p>
	</section>

	<section class="rj-services-list" aria-labelledby="services-list-title">
		<div class="rj-services-heading">
			<div>
				<p class="rj-services-kicker">How We Can Help</p>
				<h2 id="services-list-title">Services made personal.</h2>
			</div>
			<p>Every piece begins with a careful assessment, a clear recommendation and craftsmanship you can trust.</p>
		</div>

		<div class="rj-services-grid">
			{#each services as service}
				<article>
					<span>{service.number}</span>
					<h3>{service.title}</h3>
					<p>{service.text}</p>
					<a href="/contact-us">Request service <span aria-hidden="true">→</span></a>
				</article>
			{/each}
		</div>
	</section>

	<section class="rj-services-process" aria-labelledby="services-process-title">
		<div class="rj-services-process-head">
			<p class="rj-services-kicker">Simple From Start To Finish</p>
			<h2 id="services-process-title">How service works.</h2>
		</div>
		<ol>
			{#each steps as step}
				<li>
					<span>{step.number}</span>
					<div>
						<h3>{step.title}</h3>
						<p>{step.text}</p>
					</div>
				</li>
			{/each}
		</ol>
	</section>

	<section class="rj-services-cta" aria-labelledby="services-cta-title">
		<p class="rj-services-kicker">Let Us Take A Look</p>
		<h2 id="services-cta-title">Not sure which service you need?</h2>
		<p>Share a few details about your piece and our team will help you choose the right next step.</p>
		<a href="/contact-us">Talk to our team <span aria-hidden="true">→</span></a>
	</section>
</div>

<style>
	.rj-services {
		background: #fff;
		color: var(--rj-ink, #404040);
		font-family: 'Sarala', var(--font-body, sans-serif);
	}

	.rj-services h1,
	.rj-services h2,
	.rj-services h3,
	.rj-services p {
		margin: 0;
	}

	.rj-services h1,
	.rj-services h2,
	.rj-services h3 {
		font-family: 'Rozha One', var(--font-heading, serif);
		font-weight: 400;
		letter-spacing: normal;
		color: var(--rj-heading, #202020);
	}

	.rj-services-kicker {
		font-size: 20px;
		line-height: 30px;
		color: var(--rj-gold, #cca646);
	}

	.rj-services-intro {
		display: flex;
		max-width: 900px;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		margin: 0 auto;
		padding: 80px 40px;
		text-align: center;
	}

	.rj-services-intro h1 {
		font-size: clamp(34px, 3.4vw, 46px);
		line-height: 1.16;
	}

	.rj-services-intro > p:last-child {
		max-width: 760px;
		font-size: 17px;
		line-height: 29px;
		color: var(--rj-ink-2, #606060);
	}

	.rj-services-list {
		padding: 80px max(60px, calc((100% - 1320px) / 2));
		background: var(--rj-cream, #faf6ea);
		border-block: 1px solid var(--rj-rule, #e1d6be);
	}

	.rj-services-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 50px;
		margin-bottom: 46px;
	}

	.rj-services-heading h2,
	.rj-services-process h2,
	.rj-services-cta h2 {
		font-size: clamp(32px, 3vw, 42px);
		line-height: 1.2;
	}

	.rj-services-heading > p {
		max-width: 500px;
		font-size: 16px;
		line-height: 27px;
		color: var(--rj-ink-2, #606060);
	}

	.rj-services-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
	}

	.rj-services-grid article {
		display: flex;
		min-height: 315px;
		flex-direction: column;
		padding: 32px;
		border: 1px solid var(--rj-rule, #e1d6be);
		border-radius: 5px;
		background: #fff;
		transition: border-color 0.2s ease, transform 0.2s var(--rj-ease, ease), box-shadow 0.2s ease;
	}

	.rj-services-grid article:hover {
		transform: translateY(-5px);
		border-color: var(--rj-gold, #cca646);
		box-shadow: 0 12px 30px rgba(64, 64, 64, 0.08);
	}

	.rj-services-grid article > span {
		margin-bottom: 40px;
		font-size: 14px;
		color: var(--rj-gold, #cca646);
	}

	.rj-services-grid h3 {
		margin-bottom: 14px;
		font-size: 26px;
		line-height: 1.25;
	}

	.rj-services-grid article > p {
		font-size: 15px;
		line-height: 26px;
		color: var(--rj-ink-2, #606060);
	}

	.rj-services-grid a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: auto;
		padding-top: 24px;
		font-size: 15px;
		font-weight: 700;
		color: var(--rj-heading, #202020);
		text-decoration: none;
	}

	.rj-services-grid a span {
		color: var(--rj-gold, #cca646);
		transition: transform 0.2s ease;
	}

	.rj-services-grid a:hover span {
		transform: translateX(3px);
	}

	.rj-services-process {
		max-width: 1200px;
		margin: 0 auto;
		padding: 80px 60px;
	}

	.rj-services-process-head {
		margin-bottom: 44px;
		text-align: center;
	}

	.rj-services-process ol {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		margin: 0;
		padding: 0;
		border-block: 1px solid var(--rj-line, #e5e5e5);
		list-style: none;
	}

	.rj-services-process li {
		display: flex;
		gap: 20px;
		padding: 36px 32px;
	}

	.rj-services-process li + li {
		border-left: 1px solid var(--rj-line, #e5e5e5);
	}

	.rj-services-process li > span {
		color: var(--rj-gold, #cca646);
	}

	.rj-services-process h3 {
		margin-bottom: 8px;
		font-size: 23px;
	}

	.rj-services-process li p {
		font-size: 15px;
		line-height: 25px;
		color: var(--rj-ink-2, #606060);
	}

	.rj-services-cta {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		padding: 70px 24px 80px;
		border-block: 1px solid var(--rj-rule, #e1d6be);
		background: var(--rj-cream, #faf6ea);
		text-align: center;
	}

	.rj-services-cta > p:not(.rj-services-kicker) {
		max-width: 600px;
		font-size: 16px;
		line-height: 27px;
		color: var(--rj-ink-2, #606060);
	}

	.rj-services-cta a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		margin-top: 16px;
		padding: 10px 18px;
		border-radius: 2px;
		background: var(--rj-gold, #cca646);
		font-size: 18px;
		font-weight: 700;
		line-height: 32px;
		color: #fff;
		text-decoration: none;
	}

	@media (max-width: 1023px) {
		.rj-services-intro,
		.rj-services-list,
		.rj-services-process {
			padding: 60px 40px;
		}

		.rj-services-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.rj-services-process li {
			padding: 30px 20px;
		}
	}

	@media (max-width: 767px) {
		.rj-services-intro,
		.rj-services-list,
		.rj-services-process {
			padding: 50px 20px;
		}

		.rj-services-kicker {
			font-size: 17px;
		}

		.rj-services-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 18px;
			margin-bottom: 32px;
		}

		.rj-services-grid,
		.rj-services-process ol {
			grid-template-columns: 1fr;
		}

		.rj-services-grid article {
			min-height: 280px;
			padding: 28px;
		}

		.rj-services-process li + li {
			border-top: 1px solid var(--rj-line, #e5e5e5);
			border-left: 0;
		}

		.rj-services-cta {
			padding: 50px 20px 60px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-services-grid article,
		.rj-services-grid a span {
			transition: none;
		}
	}
</style>
