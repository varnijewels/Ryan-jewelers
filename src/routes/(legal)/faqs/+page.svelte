<script lang="ts">
	import { SeoHeader } from '$lib/core/components/index.js'

	const sections = [
		{
			id: 'lab-grown-diamonds',
			title: 'Lab-Grown Diamonds',
			intro: 'Understand their origin, quality and lasting beauty.',
			items: [
				{
					question: 'What are lab-grown diamonds?',
					answer: 'Lab-grown diamonds are created in controlled conditions that reproduce the heat and pressure under which diamonds form in the earth. They have the same carbon crystal structure as mined diamonds.'
				},
				{
					question: 'Are lab-grown diamonds real diamonds?',
					answer: 'Yes. They are chemically, physically and optically identical to mined diamonds and are graded using the same cut, color, clarity and carat standards.'
				},
				{
					question: 'What are the benefits of choosing lab-grown diamonds?',
					answer: 'Lab-grown diamonds offer the brilliance and durability of a diamond with a traceable origin. They can also offer a larger or higher-grade stone within the same budget.'
				},
				{
					question: 'Are lab-grown diamonds durable for everyday wear?',
					answer: 'Yes. Like mined diamonds, lab-grown diamonds are highly durable and suitable for engagement rings and everyday jewelry when set and cared for properly.'
				}
			]
		},
		{
			id: 'why-customers-trust-us',
			title: 'Why Customers Trust Us',
			intro: 'Thoughtful craftsmanship and service at every step.',
			items: [
				{
					question: 'Why choose Ryan Jewelers?',
					answer: 'We focus on considered design, quality craftsmanship, clear product information and personal support before and after your purchase.'
				},
				{
					question: 'Can I get help choosing the right piece?',
					answer: 'Yes. Our team can help you compare styles, metals, diamond shapes, carat weights and ring sizes so you can make a confident choice.'
				},
				{
					question: 'Do you offer custom jewelry options?',
					answer: 'Selected pieces can be configured with available metal, carat, size, diamond shape and stone options. Made-to-order pricing and delivery timing are confirmed separately.'
				}
			]
		},
		{
			id: 'orders-and-payments',
			title: 'Orders & Payments',
			intro: 'From product selection to secure checkout.',
			items: [
				{
					question: 'How do I place an order?',
					answer: 'Select the available product options, add the item to your bag and continue to checkout. You will be asked to sign in or create an account before completing checkout.'
				},
				{
					question: 'Which payment methods can I use?',
					answer: 'The payment methods currently available for your order are displayed securely on the payment step at checkout.'
				},
				{
					question: 'Can I change or cancel an order?',
					answer: 'Contact us as soon as possible. We will try to help before the order enters processing, but changes or cancellation cannot be guaranteed after preparation or dispatch has started.'
				},
				{
					question: 'Where can I view my order status?',
					answer: 'Sign in to your account to review order history and details. Tracking information is also shared after your order is dispatched.'
				}
			]
		},
		{
			id: 'return-and-exchange',
			title: 'Return & Exchange',
			intro: 'Clear guidance when a purchase is not quite right.',
			items: [
				{
					question: 'What is the return window?',
					answer: 'Eligible items may be submitted for return within 30 days of delivery. Please review our Shipping & Returns page for the complete policy.'
				},
				{
					question: 'What condition must a returned item be in?',
					answer: 'The piece must be unworn, in its original condition and returned with its original packaging and documentation.'
				},
				{
					question: 'Can custom or engraved jewelry be returned?',
					answer: 'Custom-made and engraved pieces are generally not returnable unless there is a manufacturing defect or an error on our part.'
				},
				{
					question: 'How do I start a return or exchange?',
					answer: 'Contact our team to request return authorization before sending the item. We will provide the applicable packing and return instructions.'
				}
			]
		},
		{
			id: 'certification',
			title: 'Certification',
			intro: 'The details behind your diamond and jewelry.',
			items: [
				{
					question: 'Will my diamond include a grading report?',
					answer: 'When a grading report is available for a diamond, it is identified in the product information or supplied with the piece. Contact us before purchase if certification is important for your selection.'
				},
				{
					question: 'What information does a diamond report include?',
					answer: 'A grading report typically records characteristics such as carat weight, color, clarity, cut proportions and identifying details for the examined diamond.'
				},
				{
					question: 'How should I care for my jewelry?',
					answer: 'Store pieces separately, avoid harsh chemicals and clean gently with mild soap, warm water and a soft brush. Professional cleaning and setting checks are recommended for frequently worn jewelry.'
				}
			]
		}
	]
</script>

<SeoHeader
	metaTitle="Frequently Asked Questions | Ryan Jewelers"
	metaDescription="Find answers about Ryan Jewelers lab-grown diamonds, orders, payments, returns, exchanges, custom jewelry and certification."
/>

<div class="rj-faq-page">
	<header class="rj-faq-hero">
		<div class="rj-faq-hero-mark" aria-hidden="true">?</div>
		<p>Ryan Jewelers</p>
		<h1>Frequently Asked Questions</h1>
		<span>Everything you need to choose, order and care for your jewelry with confidence.</span>
	</header>

	<section class="rj-faq-intro" aria-labelledby="rj-faq-intro-title">
		<div>
			<p class="rj-faq-kicker">How Can We Help?</p>
			<h2 id="rj-faq-intro-title">Answers, made beautifully simple.</h2>
		</div>
		<p>Explore our most common questions by topic. If you need personal guidance, the Ryan Jewelers team is always here to help.</p>
	</section>

	<div class="rj-faq-rule" aria-hidden="true"><span></span><i></i><span></span></div>

	<div class="rj-faq-layout">
		<aside>
			<p>Browse by topic</p>
			<nav aria-label="FAQ categories">
				{#each sections as section, index}
					<a href="#{section.id}"><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a>
				{/each}
			</nav>
			<a class="rj-faq-policy" href="/shipping-policy">Shipping &amp; Returns <span aria-hidden="true">→</span></a>
		</aside>

		<main class="rj-faq-content">
			{#each sections as section, sectionIndex}
				<section id={section.id}>
					<p class="rj-faq-number">{String(sectionIndex + 1).padStart(2, '0')}</p>
					<h2>{section.title}</h2>
					<p class="rj-faq-section-intro">{section.intro}</p>
					<div class="rj-faq-list">
						{#each section.items as item, itemIndex}
							<details open={sectionIndex === 0 && itemIndex === 0}>
								<summary><span>{item.question}</span><i aria-hidden="true"></i></summary>
								<div><p>{item.answer}</p></div>
							</details>
						{/each}
					</div>
				</section>
			{/each}

			<section class="rj-faq-contact" aria-labelledby="rj-faq-contact-title">
				<div>
					<p class="rj-faq-number">Still need help?</p>
					<h2 id="rj-faq-contact-title">Let’s find the right answer together.</h2>
					<p>Speak with our team for product guidance, order support or custom jewelry questions.</p>
				</div>
				<a href="/contact-us">Contact Ryan Jewelers <span aria-hidden="true">→</span></a>
			</section>
		</main>
	</div>
</div>

<style>
	.rj-faq-page {
		--faq-gold: var(--rj-gold, #cca646);
		--faq-ink: var(--rj-heading, #202020);
		--faq-copy: var(--rj-ink-2, #606060);
		--faq-cream: var(--rj-cream, #faf6ea);
		--faq-rule: var(--rj-rule, #e1d6be);
		background: #fff;
		color: var(--faq-copy);
		font-family: 'Sarala', var(--font-body, sans-serif);
		scroll-behavior: smooth;
	}

	.rj-faq-page :global(h1), .rj-faq-page :global(h2), .rj-faq-page :global(p) { margin: 0; }
	.rj-faq-page :global(h1), .rj-faq-page :global(h2) { color: var(--faq-ink); font-family: 'Rozha One', var(--font-heading, serif); font-weight: 400; letter-spacing: normal; }

	.rj-faq-hero {
		position: relative;
		display: flex;
		min-height: 330px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 58px 24px;
		overflow: hidden;
		border-bottom: 1px solid var(--faq-rule);
		background: radial-gradient(circle at 50% -80%, rgb(204 166 70 / 24%), transparent 52%), linear-gradient(135deg, #f8f5ee 0%, #fff 50%, #f5f0e5 100%);
		text-align: center;
	}
	.rj-faq-hero-mark { position: absolute; color: rgb(204 166 70 / 7%); font: 280px/1 'Rozha One', serif; pointer-events: none; }
	.rj-faq-hero > p { position: relative; margin-bottom: 8px; color: var(--faq-gold); font-size: 14px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; }
	.rj-faq-hero h1 { position: relative; font-size: clamp(46px, 6vw, 74px); line-height: 1.05; }
	.rj-faq-hero > span { position: relative; max-width: 680px; margin-top: 14px; font-size: 16px; line-height: 25px; }

	.rj-faq-intro { display: grid; width: min(1180px, calc(100% - 80px)); grid-template-columns: .9fr 1.1fr; gap: 90px; margin: 0 auto; padding: 76px 0 62px; }
	.rj-faq-kicker, .rj-faq-number { color: var(--faq-gold); font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
	.rj-faq-intro h2 { max-width: 500px; margin-top: 12px; font-size: clamp(36px, 4vw, 52px); line-height: 1.08; }
	.rj-faq-intro > p { align-self: center; font-size: 17px; line-height: 30px; }
	.rj-faq-rule { display: flex; width: min(1180px, calc(100% - 80px)); align-items: center; gap: 16px; margin: 0 auto; }
	.rj-faq-rule span { height: 1px; flex: 1; background: var(--faq-rule); }
	.rj-faq-rule i { width: 8px; height: 8px; border: 1px solid var(--faq-gold); transform: rotate(45deg); }

	.rj-faq-layout { display: grid; width: min(1180px, calc(100% - 80px)); grid-template-columns: 250px minmax(0, 1fr); gap: 80px; margin: 0 auto; padding: 62px 0 110px; }
	.rj-faq-layout > aside { position: sticky; top: 24px; align-self: start; padding: 26px; border: 1px solid var(--faq-rule); background: var(--faq-cream); }
	.rj-faq-layout > aside > p { margin-bottom: 18px; color: var(--faq-ink); font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
	.rj-faq-layout nav { display: flex; flex-direction: column; }
	.rj-faq-layout nav a { display: grid; grid-template-columns: 28px 1fr; gap: 8px; padding: 11px 0; border-bottom: 1px solid rgb(225 214 190 / 75%); color: var(--faq-copy); font-size: 13px; line-height: 19px; text-decoration: none; transition: color .18s ease, transform .18s ease; }
	.rj-faq-layout nav a span { color: var(--faq-gold); font-size: 11px; }
	.rj-faq-layout nav a:hover, .rj-faq-layout nav a:focus-visible { color: var(--faq-ink); transform: translateX(3px); }
	.rj-faq-policy { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; color: #8a7443; font-size: 13px; font-weight: 700; text-decoration: none; }

	.rj-faq-content { min-width: 0; }
	.rj-faq-content > section { scroll-margin-top: 24px; padding-bottom: 54px; margin-bottom: 54px; border-bottom: 1px solid var(--faq-rule); }
	.rj-faq-content > section:last-child { margin-bottom: 0; }
	.rj-faq-content h2 { margin: 8px 0 7px; font-size: clamp(31px, 3vw, 40px); line-height: 1.14; }
	.rj-faq-section-intro { margin-bottom: 25px !important; font-size: 15px; line-height: 26px; }
	.rj-faq-list { display: grid; gap: 12px; }
	.rj-faq-list details { border: 1px solid var(--faq-rule); border-radius: 5px; background: #fff; }
	.rj-faq-list summary { display: flex; min-height: 72px; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 20px; color: var(--faq-ink); cursor: pointer; font-size: 17px; line-height: 25px; list-style: none; }
	.rj-faq-list summary::-webkit-details-marker { display: none; }
	.rj-faq-list summary:focus-visible { outline: 2px solid var(--faq-gold); outline-offset: 2px; }
	.rj-faq-list summary i { position: relative; width: 28px; height: 28px; flex: 0 0 28px; }
	.rj-faq-list summary i::before, .rj-faq-list summary i::after { position: absolute; top: 50%; left: 50%; width: 18px; height: 1.5px; background: #505050; content: ''; transform: translate(-50%, -50%); transition: transform .2s ease; }
	.rj-faq-list summary i::after { transform: translate(-50%, -50%) rotate(90deg); }
	.rj-faq-list details[open] summary i::after { transform: translate(-50%, -50%) rotate(0); }
	.rj-faq-list details[open] summary { border-bottom: 1px solid rgb(225 214 190 / 70%); }
	.rj-faq-list details > div { padding: 18px 20px 20px; }
	.rj-faq-list details p { font-size: 15px; line-height: 27px; }

	.rj-faq-contact { display: flex; align-items: center; justify-content: space-between; gap: 40px; padding: 38px !important; border: 1px solid var(--faq-rule) !important; background: var(--faq-cream); }
	.rj-faq-contact > div { max-width: 560px; }
	.rj-faq-contact h2 { margin-bottom: 12px; }
	.rj-faq-contact > div > p:last-child { font-size: 15px; line-height: 26px; }
	.rj-faq-contact a { display: inline-flex; min-width: max-content; align-items: center; gap: 12px; padding: 13px 20px; background: var(--faq-gold); color: #fff; font-size: 14px; font-weight: 700; text-decoration: none; transition: background .18s ease, color .18s ease; }
	.rj-faq-contact a:hover { outline: 1px solid var(--faq-gold); background: transparent; color: var(--faq-ink); }

	@media (max-width: 900px) {
		.rj-faq-intro { grid-template-columns: 1fr; gap: 28px; }
		.rj-faq-layout { grid-template-columns: 1fr; gap: 42px; }
		.rj-faq-layout > aside { position: static; }
		.rj-faq-layout nav { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 24px; }
	}

	@media (max-width: 640px) {
		.rj-faq-hero { min-height: 270px; padding: 44px 20px; }
		.rj-faq-hero-mark { font-size: 220px; }
		.rj-faq-hero > span { max-width: 310px; font-size: 14px; line-height: 22px; }
		.rj-faq-intro, .rj-faq-rule, .rj-faq-layout { width: calc(100% - 40px); }
		.rj-faq-intro { padding: 52px 0 44px; }
		.rj-faq-layout { padding: 44px 0 72px; }
		.rj-faq-layout > aside { padding: 20px; }
		.rj-faq-layout nav { grid-template-columns: 1fr; }
		.rj-faq-list summary { min-height: 66px; padding: 15px 16px; font-size: 15px; line-height: 22px; }
		.rj-faq-list details > div { padding: 16px; }
		.rj-faq-contact { flex-direction: column; align-items: flex-start; padding: 26px !important; }
		.rj-faq-contact a { width: 100%; justify-content: space-between; }
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-faq-list summary i::before, .rj-faq-list summary i::after { transition: none; }
	}
</style>
