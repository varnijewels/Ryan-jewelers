<script lang="ts">
	import Blocks from '$lib/components/page-blocks/blocks.svelte'
	import type { Page } from '$lib/core/types/index.js'
	import { SeoHeader } from '$lib/core/components/index.js'

	interface Props {
		data: {
			page: Page
			theme?: { name: string }
		}
	}

	const { data }: Props = $props()
	const isRyans = $derived(data?.theme?.name === 'ryans-jewels')
	let activeSection = $state('acceptance')

	const sections = [
		{ id: 'acceptance', label: 'Acceptance & updates' },
		{ id: 'site-use', label: 'Site use & accounts' },
		{ id: 'products-orders', label: 'Products & orders' },
		{ id: 'payment', label: 'Payment & billing' },
		{ id: 'shipping-returns', label: 'Shipping & returns' },
		{ id: 'intellectual-property', label: 'Intellectual property' },
		{ id: 'privacy-disclaimers', label: 'Privacy & disclaimers' },
		{ id: 'liability-law', label: 'Liability & governing law' },
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

<SeoHeader
	metaTitle="Terms & Conditions | Ryan Jewelers"
	metaDescription="Review the terms governing use of the Ryan Jewelers website, accounts, product orders, payments and related services."
/>

{#if isRyans}
	<div class="rj-terms">
		<header class="rj-terms-hero">
			<div class="rj-terms-hero-mark" aria-hidden="true">R</div>
			<p>Ryan Jewelers</p>
			<h1>Terms &amp; Conditions</h1>
			<span>Clear terms for a trusted and refined shopping experience.</span>
		</header>

		<section class="rj-terms-intro" aria-labelledby="terms-intro-title">
			<div>
				<p class="rj-terms-kicker">Our Agreement</p>
				<h2 id="terms-intro-title">Designed for clarity and confidence.</h2>
			</div>
			<div class="rj-terms-intro-copy">
				<p>
					Please read these Terms &amp; Conditions before using the Ryan Jewelers website or placing an order. By accessing our website, creating an account or making a purchase, you agree to these terms.
				</p>
				<p class="rj-terms-updated">Last updated: August 14, 2026</p>
			</div>
		</section>

		<div class="rj-terms-rule" aria-hidden="true"><span></span><i></i><span></span></div>

		<div class="rj-terms-layout">
			<aside>
				<p>In these terms</p>
				<nav aria-label="Terms and conditions sections">
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

			<article class="rj-terms-content">
				<section id="acceptance">
					<p class="rj-terms-number">01</p>
					<h2>Acceptance &amp; updates</h2>
					<p>By using this website, you agree to comply with these Terms &amp; Conditions. If you do not agree, please do not use the website or its services.</p>
					<p>We may revise these terms when our services, policies or legal obligations change. Continued use of the website after an update means you accept the revised terms. The latest revision date appears above.</p>
				</section>

				<section id="site-use">
					<p class="rj-terms-number">02</p>
					<h2>Use of the website &amp; accounts</h2>
					<ul>
						<li>You must be at least 18 years old, or use the website with the involvement and consent of a parent or legal guardian.</li>
						<li>You agree to provide accurate, complete and current information when creating an account or placing an order.</li>
						<li>You are responsible for protecting your account credentials and for activity performed through your account.</li>
						<li>You may not misuse the website, interfere with its operation or use it for unlawful or fraudulent activity.</li>
					</ul>
				</section>

				<section id="products-orders">
					<p class="rj-terms-number">03</p>
					<h2>Products &amp; orders</h2>
					<p>We make reasonable efforts to present accurate product descriptions, imagery, pricing and availability. Screen settings, photography and the natural characteristics of gemstones and precious metals may cause slight visual variations.</p>
					<p>Submitting an order is an offer to purchase. An order is accepted only after payment authorization and order confirmation. We may decline or cancel an order because of availability, pricing or description errors, suspected fraud, shipping restrictions or other reasonable circumstances. If payment was captured for a cancelled order, it will be refunded.</p>
				</section>

				<section id="payment">
					<p class="rj-terms-number">04</p>
					<h2>Payment &amp; billing</h2>
					<ul>
						<li>Available payment methods are displayed during checkout and processed through secure payment providers.</li>
						<li>By submitting payment details, you confirm that you are authorized to use the selected payment method.</li>
						<li>You authorize the total shown at checkout, including applicable taxes, shipping and other disclosed charges.</li>
						<li>Incorrect or incomplete billing information may delay or cancel an order.</li>
					</ul>
				</section>

				<section id="shipping-returns">
					<p class="rj-terms-number">05</p>
					<h2>Shipping &amp; returns</h2>
					<p>Delivery options, estimated timelines and applicable charges are presented during checkout. International shipments may be subject to customs duties, taxes or import fees charged by the destination country.</p>
					<p>Return eligibility, timelines, exclusions and refund details are explained in our <a href="/shipping-policy">Shipping &amp; Return Policy</a>. That policy forms part of these terms.</p>
				</section>

				<section id="intellectual-property">
					<p class="rj-terms-number">06</p>
					<h2>Intellectual property</h2>
					<p>Website content—including text, product photography, graphics, logos, designs, icons and software—is owned by or licensed to Ryan Jewelers and is protected by applicable intellectual-property laws.</p>
					<p>You may use the website for personal, non-commercial shopping. You may not copy, reproduce, publish, distribute, modify or commercially exploit our content without prior written permission.</p>
				</section>

				<section id="privacy-disclaimers">
					<p class="rj-terms-number">07</p>
					<h2>Privacy &amp; disclaimers</h2>
					<p>Our <a href="/privacy-policy">Privacy Policy</a> explains how we collect, use and protect personal information and forms part of these terms.</p>
					<p>The website and its content are provided on an “as available” basis. To the extent permitted by law, we do not guarantee that the website will always be uninterrupted, error-free or completely current. Nothing in these terms excludes warranties or rights that cannot legally be excluded.</p>
				</section>

				<section id="liability-law">
					<p class="rj-terms-number">08</p>
					<h2>Liability &amp; governing law</h2>
					<p>To the fullest extent permitted by law, Ryan Jewelers is not liable for indirect, incidental, special or consequential loss arising from use of the website or products. Our total liability for a claim relating to an order will not exceed the amount paid for that order, except where applicable law requires otherwise.</p>
					<p>These terms are governed by the laws of the State of Maryland, without regard to conflict-of-law principles. Applicable disputes will be handled by courts with jurisdiction in Maryland, unless consumer law provides another required forum.</p>
				</section>

				<section id="contact-us" class="rj-terms-contact">
					<div>
						<p class="rj-terms-number">09</p>
						<h2>Questions about these terms?</h2>
						<p>Our team is available to help clarify these Terms &amp; Conditions before you shop.</p>
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
				<h1>TERMS</h1>
				<hr class="mt-2.5 w-20 border-t-4 border-zinc-900 opacity-50" />
			</div>
			<div class="prose-lg prose-h2:my-4 prose-p:my-0 prose-li:my-0">{@html data?.page?.content}</div>
		</div>
	</section>
	<Blocks layouts={data.page.layouts} />
{/if}

<style>
	.rj-terms {
		--terms-gold: var(--rj-gold, #cca646);
		--terms-ink: var(--rj-heading, #202020);
		--terms-copy: var(--rj-ink-2, #606060);
		--terms-cream: var(--rj-cream, #faf6ea);
		--terms-rule: var(--rj-rule, #e1d6be);
		background: #fff;
		color: var(--terms-copy);
		font-family: 'Sarala', var(--font-body, sans-serif);
		scroll-behavior: smooth;
	}

	.rj-terms :global(h1), .rj-terms :global(h2), .rj-terms :global(p), .rj-terms :global(ul) { margin: 0; }
	.rj-terms :global(h1), .rj-terms :global(h2) { color: var(--terms-ink); font-family: 'Rozha One', var(--font-heading, serif); font-weight: 400; letter-spacing: normal; }

	.rj-terms-hero {
		position: relative;
		display: flex;
		min-height: 330px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 58px 24px;
		overflow: hidden;
		border-bottom: 1px solid var(--terms-rule);
		background:
			radial-gradient(circle at 50% -80%, rgb(204 166 70 / 24%), transparent 52%),
			linear-gradient(135deg, #f8f5ee 0%, #fff 50%, #f5f0e5 100%);
		text-align: center;
	}

	.rj-terms-hero-mark { position: absolute; color: rgb(204 166 70 / 6%); font: 280px/1 'Rozha One', serif; pointer-events: none; }
	.rj-terms-hero > p { position: relative; margin-bottom: 8px; color: var(--terms-gold); font-size: 14px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; }
	.rj-terms-hero h1 { position: relative; font-size: clamp(48px, 6vw, 76px); line-height: 1.05; }
	.rj-terms-hero > span { position: relative; margin-top: 14px; color: var(--terms-copy); font-size: 16px; }

	.rj-terms-intro { display: grid; width: min(1180px, calc(100% - 80px)); grid-template-columns: .9fr 1.1fr; gap: 90px; margin: 0 auto; padding: 76px 0 62px; }
	.rj-terms-kicker, .rj-terms-number { color: var(--terms-gold); font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
	.rj-terms-intro h2 { max-width: 470px; margin-top: 12px; font-size: clamp(36px, 4vw, 52px); line-height: 1.08; }
	.rj-terms-intro-copy { display: flex; flex-direction: column; gap: 24px; justify-content: center; }
	.rj-terms-intro-copy > p:first-child { font-size: 17px; line-height: 30px; }
	.rj-terms-updated { color: #8a7443; font-size: 13px; letter-spacing: .5px; }
	.rj-terms-rule { display: flex; width: min(1180px, calc(100% - 80px)); align-items: center; gap: 16px; margin: 0 auto; }
	.rj-terms-rule span { height: 1px; flex: 1; background: var(--terms-rule); }
	.rj-terms-rule i { width: 8px; height: 8px; border: 1px solid var(--terms-gold); transform: rotate(45deg); }

	.rj-terms-layout { display: grid; width: min(1180px, calc(100% - 80px)); grid-template-columns: 250px minmax(0, 1fr); gap: 80px; margin: 0 auto; padding: 62px 0 110px; }
	.rj-terms-layout > aside { align-self: start; position: sticky; top: 179px; padding: 26px; border: 1px solid var(--terms-rule); background: var(--terms-cream); }
	.rj-terms-layout > aside > p { margin-bottom: 18px; color: var(--terms-ink); font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
	.rj-terms-layout nav { display: flex; flex-direction: column; }
	.rj-terms-layout nav a { display: grid; grid-template-columns: 28px 1fr; gap: 8px; padding: 10px 0; border-bottom: 1px solid rgb(225 214 190 / 75%); color: var(--terms-copy); font-size: 13px; line-height: 19px; text-decoration: none; transition: color .18s ease, transform .18s ease; }
	.rj-terms-layout nav a:last-child { border-bottom: 0; }
	.rj-terms-layout nav a span { color: var(--terms-gold); font-size: 11px; }
	.rj-terms-layout nav a:hover, .rj-terms-layout nav a:focus-visible { outline: 0; color: var(--terms-ink); transform: translateX(3px); }
	.rj-terms-layout nav a.active { box-shadow: inset 2px 0 var(--terms-gold); color: var(--terms-ink); font-weight: 700; transform: translateX(3px); }

	.rj-terms-content { min-width: 0; }
	.rj-terms-content > section { scroll-margin-top: 24px; padding: 0 0 48px; margin-bottom: 48px; border-bottom: 1px solid var(--terms-rule); }
	.rj-terms-content > section:last-child { margin-bottom: 0; }
	.rj-terms-content h2 { margin: 8px 0 18px; font-size: clamp(31px, 3vw, 40px); line-height: 1.14; }
	.rj-terms-content p, .rj-terms-content li { font-size: 15px; line-height: 27px; }
	.rj-terms-content section > p + p { margin-top: 14px; }
	.rj-terms-content ul { display: grid; gap: 8px; margin-top: 18px; padding: 0; list-style: none; }
	.rj-terms-content li { position: relative; padding-left: 20px; }
	.rj-terms-content li::before { position: absolute; left: 1px; top: 11px; width: 5px; height: 5px; background: var(--terms-gold); content: ''; transform: rotate(45deg); }
	.rj-terms-content section > p a { color: #8a7443; font-weight: 700; text-underline-offset: 3px; }

	.rj-terms-contact { display: flex; align-items: center; justify-content: space-between; gap: 40px; padding: 38px !important; border: 1px solid var(--terms-rule) !important; background: var(--terms-cream); }
	.rj-terms-contact > div { max-width: 560px; }
	.rj-terms-contact > a { display: inline-flex; min-width: max-content; align-items: center; gap: 12px; padding: 13px 20px; border: 1px solid var(--terms-gold); background: var(--terms-gold); color: #fff; font-size: 14px; font-weight: 700; text-decoration: none; transition: background .18s ease, color .18s ease; }
	.rj-terms-contact > a:hover { background: transparent; color: var(--terms-ink); }

	@media (max-width: 900px) {
		.rj-terms-intro { grid-template-columns: 1fr; gap: 28px; }
		.rj-terms-layout { grid-template-columns: 1fr; gap: 42px; }
		.rj-terms-layout > aside { position: static; }
		.rj-terms-layout nav { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 24px; }
	}

	@media (min-width: 901px) and (max-width: 1023px) {
		.rj-terms-layout > aside { top: 149px; }
	}

	@media (max-width: 640px) {
		.rj-terms-hero { min-height: 270px; padding: 44px 20px; }
		.rj-terms-hero-mark { font-size: 220px; }
		.rj-terms-hero > span { max-width: 310px; font-size: 14px; line-height: 22px; }
		.rj-terms-intro, .rj-terms-rule, .rj-terms-layout { width: calc(100% - 40px); }
		.rj-terms-intro { padding: 52px 0 44px; }
		.rj-terms-layout { padding: 44px 0 72px; }
		.rj-terms-layout > aside { padding: 20px; }
		.rj-terms-layout nav { grid-template-columns: 1fr; }
		.rj-terms-content > section { padding-bottom: 36px; margin-bottom: 36px; }
		.rj-terms-contact { align-items: flex-start; flex-direction: column; padding: 26px !important; }
		.rj-terms-contact > a { width: 100%; justify-content: center; }
	}
</style>
