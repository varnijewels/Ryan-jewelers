<script lang="ts">
	import Blocks from '$lib/components/page-blocks/blocks.svelte'
	import type { Page } from '$lib/core/types/index.js'

	interface Props {
		data: {
			page: Page
			theme?: { name: string }
		}
	}

	const { data }: Props = $props()
	const isRyans = $derived(data?.theme?.name === 'ryans-jewels')
	let activeSection = $state('processing')

	const sections = [
		{ id: 'processing', label: 'Order processing' },
		{ id: 'shipping-methods', label: 'Shipping methods' },
		{ id: 'tracking', label: 'Tracking & delivery' },
		{ id: 'international', label: 'International shipping' },
		{ id: 'returns', label: '30-day returns' },
		{ id: 'return-process', label: 'Return process' },
		{ id: 'refunds', label: 'Refunds & exchanges' },
		{ id: 'exceptions', label: 'Exceptions & costs' },
		{ id: 'contact-us', label: 'Contact us' }
	]

	function scrollToSection(event: MouseEvent, id: string) {
		event.preventDefault()
		const target = document.getElementById(id)
		if (!target) return

		activeSection = id
		history.pushState(history.state, '', `#${id}`)
		const headerHeight = document.querySelector<HTMLElement>('.rj-header')?.getBoundingClientRect().height ?? 0
		window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - headerHeight - 24, behavior: 'smooth' })
	}
</script>

<svelte:head>
	<title>Shipping &amp; Return Policy | Ryan Jewelers</title>
	<meta
		name="description"
		content="Review Ryan Jewelers shipping, tracking, return, refund and exchange information before placing your order."
	/>
</svelte:head>

{#if isRyans}
	<div class="rj-policy">
		<header class="rj-policy-hero">
			<div class="rj-policy-hero-mark" aria-hidden="true">R</div>
			<p>Ryan Jewelers</p>
			<h1>Shipping &amp; Returns</h1>
			<span>From our store to your door, every detail is handled with care.</span>
		</header>

		<section class="rj-policy-intro" aria-labelledby="policy-intro-title">
			<div>
				<p class="rj-policy-kicker">Our Promise</p>
				<h2 id="policy-intro-title">Carefully packed. Securely delivered.</h2>
			</div>
			<div class="rj-policy-intro-copy">
				<p>
					We want every Ryan Jewelers purchase to arrive safely and feel exactly right. Here you can find our order processing, delivery, return and exchange guidelines.
				</p>
				<div class="rj-policy-assurances" aria-label="Delivery assurances">
					<span>Secure shipping</span><span>Insured delivery</span><span>Order tracking</span>
				</div>
			</div>
		</section>

		<div class="rj-policy-rule" aria-hidden="true"><span></span><i></i><span></span></div>

		<div class="rj-policy-layout">
			<aside>
				<p>In this policy</p>
				<nav aria-label="Shipping and return policy sections">
					{#each sections as section, index}
						<a
							href="#{section.id}"
							class:active={activeSection === section.id}
							aria-current={activeSection === section.id ? 'location' : undefined}
							onclick={(event) => scrollToSection(event, section.id)}
						><span>{String(index + 1).padStart(2, '0')}</span>{section.label}</a>
					{/each}
				</nav>
			</aside>

			<article class="rj-policy-content">
				<section id="processing">
					<p class="rj-policy-number">01</p>
					<h2>Order processing</h2>
					<p>Most in-stock orders are processed and prepared for shipment within 1–2 business days.</p>
					<p>Custom and personalized jewelry may require additional preparation time. The estimated timeline will be communicated in your order confirmation.</p>
				</section>

				<section id="shipping-methods">
					<p class="rj-policy-number">02</p>
					<h2>Shipping methods</h2>
					<ul>
						<li>Orders are shipped securely and insured through trusted carriers.</li>
						<li>Standard delivery typically takes 3–5 business days after dispatch.</li>
						<li>Available expedited options, rates and delivery estimates are shown at checkout.</li>
						<li>Complimentary shipping, when available for your order, is confirmed at checkout.</li>
					</ul>
				</section>

				<section id="tracking">
					<p class="rj-policy-number">03</p>
					<h2>Tracking &amp; delivery</h2>
					<p>Once your order ships, we will send a confirmation email with tracking information so you can follow the package’s progress.</p>
					<p>Please review your delivery address before placing an order. If an address needs to be corrected, contact us as soon as possible before dispatch.</p>
				</section>

				<section id="international">
					<p class="rj-policy-number">04</p>
					<h2>International shipping</h2>
					<p>International shipping is available to select countries. Fees and delivery times vary by destination and will be presented when available.</p>
					<p>Customs fees, taxes and import duties may apply and are the customer’s responsibility.</p>
				</section>

				<section id="returns">
					<p class="rj-policy-number">05</p>
					<h2>30-day return policy</h2>
					<p>You may initiate a return within 30 days of receiving your order if you are not completely satisfied.</p>
					<p>Returned pieces must be unworn, in their original condition and accompanied by all original packaging and documentation.</p>
				</section>

				<section id="return-process">
					<p class="rj-policy-number">06</p>
					<h2>How to make a return</h2>
					<ol>
						<li>Contact our customer support team or use the Contact Us page to request a Return Authorization (RA) number.</li>
						<li>Securely pack the item with all original packaging and documentation.</li>
						<li>Clearly write the RA number on the outside of the package.</li>
						<li>Ship the package to the return address provided by our team.</li>
					</ol>
				</section>

				<section id="refunds">
					<p class="rj-policy-number">07</p>
					<h2>Refunds &amp; exchanges</h2>
					<p>After we receive the returned item, our quality control team will inspect it.</p>
					<ul>
						<li>Approved refunds are issued to the original payment method.</li>
						<li>Exchanges for another size or product may be arranged, subject to availability.</li>
					</ul>
				</section>

				<section id="exceptions">
					<p class="rj-policy-number">08</p>
					<h2>Exceptions &amp; shipping costs</h2>
					<ul>
						<li>Engraved or custom-made pieces cannot be returned unless there is a manufacturing defect or an error on our part.</li>
						<li>Shipping fees are non-refundable except when an item is damaged or a shipping error occurred.</li>
					</ul>
				</section>

				<section id="contact-us" class="rj-policy-contact">
					<div>
						<p class="rj-policy-number">09</p>
						<h2>Need help with an order?</h2>
						<p>Our team is here to assist with shipping questions, returns and exchanges.</p>
					</div>
					<a href="/contact-us">Contact Ryan Jewelers <span aria-hidden="true">→</span></a>
				</section>
			</article>
		</div>

		{#if data?.page?.layouts?.length}
			<Blocks layouts={data.page.layouts} />
		{/if}
	</div>
{:else}
	<section class="mt-20 min-h-screen">
		<div class="container mx-auto flex max-w-7xl flex-col px-4 md:px-10">
			<div class="mx-auto flex max-w-max flex-col items-center py-5 text-center text-3xl font-bold sm:items-start sm:py-10 sm:text-4xl">
				<h1>Shipping &amp; Delivery Policy</h1>
				<hr class="mt-2.5 w-20 border-t-4 border-zinc-900 opacity-50" />
			</div>
			<div class="prose-lg prose-h2:my-4 prose-p:my-0 prose-li:my-0">{@html data?.page?.content}</div>
		</div>
	</section>
	<Blocks layouts={data.page.layouts} />
{/if}

<style>
	.rj-policy {
		--policy-gold: var(--rj-gold, #cca646);
		--policy-ink: var(--rj-heading, #202020);
		--policy-copy: var(--rj-ink-2, #606060);
		--policy-cream: var(--rj-cream, #faf6ea);
		--policy-rule: var(--rj-rule, #e1d6be);
		background: #fff;
		color: var(--policy-copy);
		font-family: 'Sarala', var(--font-body, sans-serif);
		scroll-behavior: smooth;
	}

	.rj-policy :global(h1), .rj-policy :global(h2), .rj-policy :global(h3), .rj-policy :global(p), .rj-policy :global(ul), .rj-policy :global(ol) { margin: 0; }
	.rj-policy :global(h1), .rj-policy :global(h2), .rj-policy :global(h3) { color: var(--policy-ink); font-family: 'Rozha One', var(--font-heading, serif); font-weight: 400; letter-spacing: normal; }

	.rj-policy-hero {
		position: relative;
		display: flex;
		min-height: 330px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 58px 24px;
		overflow: hidden;
		border-bottom: 1px solid var(--policy-rule);
		background:
			radial-gradient(circle at 50% -80%, rgb(204 166 70 / 24%), transparent 52%),
			linear-gradient(135deg, #f8f5ee 0%, #fff 50%, #f5f0e5 100%);
		text-align: center;
	}

	.rj-policy-hero-mark { position: absolute; color: rgb(204 166 70 / 6%); font: 280px/1 'Rozha One', serif; pointer-events: none; }
	.rj-policy-hero > p { position: relative; margin-bottom: 8px; color: var(--policy-gold); font-size: 14px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; }
	.rj-policy-hero h1 { position: relative; font-size: clamp(48px, 6vw, 76px); line-height: 1.05; }
	.rj-policy-hero > span { position: relative; margin-top: 14px; color: var(--policy-copy); font-size: 16px; }

	.rj-policy-intro { display: grid; width: min(1180px, calc(100% - 80px)); grid-template-columns: .9fr 1.1fr; gap: 90px; margin: 0 auto; padding: 76px 0 62px; }
	.rj-policy-kicker, .rj-policy-number { color: var(--policy-gold); font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
	.rj-policy-intro h2 { max-width: 470px; margin-top: 12px; font-size: clamp(36px, 4vw, 52px); line-height: 1.08; }
	.rj-policy-intro-copy { display: flex; flex-direction: column; gap: 24px; justify-content: center; }
	.rj-policy-intro-copy > p { font-size: 17px; line-height: 30px; }
	.rj-policy-assurances { display: flex; flex-wrap: wrap; gap: 10px; }
	.rj-policy-assurances span { padding: 8px 12px; border: 1px solid var(--policy-rule); background: var(--policy-cream); color: #8a7443; font-size: 12px; letter-spacing: .45px; }
	.rj-policy-rule { display: flex; width: min(1180px, calc(100% - 80px)); align-items: center; gap: 16px; margin: 0 auto; }
	.rj-policy-rule span { height: 1px; flex: 1; background: var(--policy-rule); }
	.rj-policy-rule i { width: 8px; height: 8px; border: 1px solid var(--policy-gold); transform: rotate(45deg); }

	.rj-policy-layout { display: grid; width: min(1180px, calc(100% - 80px)); grid-template-columns: 250px minmax(0, 1fr); gap: 80px; margin: 0 auto; padding: 62px 0 110px; }
	.rj-policy-layout > aside { align-self: start; position: sticky; top: 179px; padding: 26px; border: 1px solid var(--policy-rule); background: var(--policy-cream); }
	.rj-policy-layout > aside > p { margin-bottom: 18px; color: var(--policy-ink); font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
	.rj-policy-layout nav { display: flex; flex-direction: column; }
	.rj-policy-layout nav a { display: grid; grid-template-columns: 28px 1fr; gap: 8px; padding: 10px 0; border-bottom: 1px solid rgb(225 214 190 / 75%); color: var(--policy-copy); font-size: 13px; line-height: 19px; text-decoration: none; transition: color .18s ease, transform .18s ease; }
	.rj-policy-layout nav a:last-child { border-bottom: 0; }
	.rj-policy-layout nav a span { color: var(--policy-gold); font-size: 11px; }
	.rj-policy-layout nav a:hover, .rj-policy-layout nav a:focus-visible { outline: 0; color: var(--policy-ink); transform: translateX(3px); }
	.rj-policy-layout nav a.active { box-shadow: inset 2px 0 var(--policy-gold); color: var(--policy-ink); font-weight: 700; transform: translateX(3px); }

	.rj-policy-content { min-width: 0; }
	.rj-policy-content > section { scroll-margin-top: 24px; padding: 0 0 48px; margin-bottom: 48px; border-bottom: 1px solid var(--policy-rule); }
	.rj-policy-content > section:last-child { margin-bottom: 0; }
	.rj-policy-content h2 { margin: 8px 0 18px; font-size: clamp(31px, 3vw, 40px); line-height: 1.14; }
	.rj-policy-content p, .rj-policy-content li { font-size: 15px; line-height: 27px; }
	.rj-policy-content section > p + p { margin-top: 14px; }
	.rj-policy-content ul, .rj-policy-content ol { display: grid; gap: 8px; margin-top: 18px; padding: 0; list-style: none; }
	.rj-policy-content li { position: relative; padding-left: 20px; }
	.rj-policy-content ul li::before { position: absolute; left: 1px; top: 11px; width: 5px; height: 5px; background: var(--policy-gold); content: ''; transform: rotate(45deg); }
	.rj-policy-content ol { counter-reset: return-step; }
	.rj-policy-content ol li { min-height: 30px; padding-left: 42px; counter-increment: return-step; }
	.rj-policy-content ol li::before { position: absolute; left: 0; top: 1px; display: grid; width: 27px; height: 27px; place-items: center; border: 1px solid var(--policy-gold); border-radius: 50%; color: #8a7443; content: counter(return-step); font-size: 11px; }

	.rj-policy-contact { display: flex; align-items: center; justify-content: space-between; gap: 40px; padding: 38px !important; border: 1px solid var(--policy-rule) !important; background: var(--policy-cream); }
	.rj-policy-contact > div { max-width: 560px; }
	.rj-policy-contact a { display: inline-flex; min-width: max-content; align-items: center; gap: 12px; padding: 13px 20px; border: 1px solid var(--policy-gold); background: var(--policy-gold); color: #fff; font-size: 14px; font-weight: 700; text-decoration: none; transition: background .18s ease, color .18s ease; }
	.rj-policy-contact a:hover { background: transparent; color: var(--policy-ink); }

	@media (max-width: 900px) {
		.rj-policy-intro { grid-template-columns: 1fr; gap: 28px; }
		.rj-policy-layout { grid-template-columns: 1fr; gap: 42px; }
		.rj-policy-layout > aside { position: static; }
		.rj-policy-layout nav { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 24px; }
	}

	@media (min-width: 901px) and (max-width: 1023px) {
		.rj-policy-layout > aside { top: 149px; }
	}

	@media (max-width: 640px) {
		.rj-policy-hero { min-height: 270px; padding: 44px 20px; }
		.rj-policy-hero-mark { font-size: 220px; }
		.rj-policy-hero > span { max-width: 310px; font-size: 14px; line-height: 22px; }
		.rj-policy-intro, .rj-policy-rule, .rj-policy-layout { width: calc(100% - 40px); }
		.rj-policy-intro { padding: 52px 0 44px; }
		.rj-policy-layout { padding: 44px 0 72px; }
		.rj-policy-layout > aside { padding: 20px; }
		.rj-policy-layout nav { grid-template-columns: 1fr; }
		.rj-policy-content > section { padding-bottom: 36px; margin-bottom: 36px; }
		.rj-policy-contact { align-items: flex-start; flex-direction: column; padding: 26px !important; }
		.rj-policy-contact a { width: 100%; justify-content: center; }
	}
</style>
