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

	const sections = [
		{ id: 'information-we-collect', label: 'Information we collect' },
		{ id: 'how-we-use-information', label: 'How we use information' },
		{ id: 'cookies', label: 'Cookies & technology' },
		{ id: 'information-sharing', label: 'Information sharing' },
		{ id: 'security', label: 'Security & retention' },
		{ id: 'your-choices', label: 'Your choices' },
		{ id: 'childrens-privacy', label: "Children's privacy" },
		{ id: 'policy-updates', label: 'Policy updates' },
		{ id: 'contact-us', label: 'Contact us' }
	]
</script>

<SeoHeader
	metaTitle="Privacy Policy | Ryan Jewelers"
	metaDescription="Learn how Ryan Jewelers collects, uses, protects and respects your personal information when you shop with us."
/>

{#if isRyans}
	<div class="rj-privacy">
		<header class="rj-privacy-hero">
			<div class="rj-privacy-hero-mark" aria-hidden="true">R</div>
			<p>Ryan Jewelers</p>
			<h1>Privacy Policy</h1>
			<span>Your trust is as valuable as every piece we create.</span>
		</header>

		<section class="rj-privacy-intro" aria-labelledby="privacy-intro-title">
			<div>
				<p class="rj-privacy-kicker">Our Commitment</p>
				<h2 id="privacy-intro-title">Your privacy, treated with care.</h2>
			</div>
			<div class="rj-privacy-intro-copy">
				<p>
					At Ryan Jewelers, we value the confidence you place in us. This policy explains what information we collect when you visit our website, create an account, contact us or make a purchase—and how we use and protect it.
				</p>
				<p class="rj-privacy-updated">Last updated: August 13, 2026</p>
			</div>
		</section>

		<div class="rj-privacy-rule" aria-hidden="true"><span></span><i></i><span></span></div>

		<div class="rj-privacy-layout">
			<aside>
				<p>In this policy</p>
				<nav aria-label="Privacy policy sections">
					{#each sections as section, index}
						<a href="#{section.id}"><span>{String(index + 1).padStart(2, '0')}</span>{section.label}</a>
					{/each}
				</nav>
			</aside>

			<article class="rj-privacy-content">
				<section id="information-we-collect">
					<p class="rj-privacy-number">01</p>
					<h2>Information we collect</h2>
					<p>We collect information you provide directly and limited information generated when you use our website.</p>
					<div class="rj-privacy-columns">
						<div>
							<h3>Information you provide</h3>
							<ul>
								<li>Name, email address, phone number and postal address</li>
								<li>Account and sign-in information</li>
								<li>Order, delivery, billing and payment-related details</li>
								<li>Messages, service requests and product preferences</li>
							</ul>
						</div>
						<div>
							<h3>Information collected automatically</h3>
							<ul>
								<li>IP address, browser, device and approximate location data</li>
								<li>Pages viewed, searches, clicks and website interactions</li>
								<li>Cookie identifiers and similar technical information</li>
							</ul>
						</div>
					</div>
				</section>

				<section id="how-we-use-information">
					<p class="rj-privacy-number">02</p>
					<h2>How we use your information</h2>
					<p>We use personal information to provide a refined, secure and reliable shopping experience, including to:</p>
					<ul>
						<li>Process payments, fulfill orders and coordinate shipping or pickup</li>
						<li>Manage your account, saved details, cart and customer service requests</li>
						<li>Communicate about purchases, services, security and important updates</li>
						<li>Personalize and improve our collections, website and customer experience</li>
						<li>Send promotions when permitted; you may unsubscribe at any time</li>
						<li>Prevent fraud, enforce our terms and meet legal obligations</li>
					</ul>
				</section>

				<section id="cookies">
					<p class="rj-privacy-number">03</p>
					<h2>Cookies &amp; similar technology</h2>
					<p>
						Cookies are small files stored on your device. We use them to keep the website working, remember preferences and cart selections, understand site performance and improve your experience. You can limit cookies through your browser settings, though some website features may no longer work as intended.
					</p>
				</section>

				<section id="information-sharing">
					<p class="rj-privacy-number">04</p>
					<h2>How information is shared</h2>
					<p>Ryan Jewelers does not sell or trade your personal information. We may share only what is reasonably necessary with:</p>
					<ul>
						<li>Payment processors, shipping providers and other order-fulfillment partners</li>
						<li>Trusted technology, website, analytics and customer-support providers</li>
						<li>Professional advisers, regulators or authorities when required by law</li>
						<li>A successor organization in connection with a business transaction</li>
					</ul>
					<p>Service providers are permitted to use information only to perform services for us and must protect it appropriately.</p>
				</section>

				<section id="security">
					<p class="rj-privacy-number">05</p>
					<h2>Data security &amp; retention</h2>
					<p>
						We use reasonable administrative, technical and organizational safeguards designed to protect personal information. No online transmission or storage system can be guaranteed completely secure. We retain information only for as long as needed for the purposes described here, including order records, customer support, fraud prevention and legal or accounting requirements.
					</p>
				</section>

				<section id="your-choices">
					<p class="rj-privacy-number">06</p>
					<h2>Your choices &amp; privacy rights</h2>
					<p>Depending on where you live, you may be able to request access to, correction of or deletion of your personal information, subject to applicable legal exceptions.</p>
					<ul>
						<li>Update account information through your profile or by contacting us</li>
						<li>Unsubscribe from marketing using the link in a promotional email</li>
						<li>Adjust cookie controls through your browser</li>
						<li>Contact us to submit a privacy request or ask a question</li>
					</ul>
				</section>

				<section id="childrens-privacy">
					<p class="rj-privacy-number">07</p>
					<h2>Children's privacy</h2>
					<p>Our website is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided information to us, please contact us so we can review and remove it where appropriate.</p>
				</section>

				<section id="policy-updates">
					<p class="rj-privacy-number">08</p>
					<h2>Changes to this policy</h2>
					<p>We may update this policy as our services, technology or legal obligations change. The date at the top of this page shows the latest revision. We encourage you to review this page periodically.</p>
				</section>

				<section id="contact-us" class="rj-privacy-contact">
					<div>
						<p class="rj-privacy-number">09</p>
						<h2>Questions about your privacy?</h2>
						<p>Our team is here to help with questions, concerns or requests relating to your personal information.</p>
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
				<h1>PRIVACY POLICY</h1>
				<hr class="mt-2.5 w-20 border-t-4 border-zinc-900 opacity-50" />
			</div>
			<div class="prose-lg prose-h2:my-4 prose-p:my-0 prose-li:my-0">{@html data?.page?.content}</div>
		</div>
	</section>
	<Blocks layouts={data.page.layouts} />
{/if}

<style>
	.rj-privacy {
		--privacy-gold: var(--rj-gold, #cca646);
		--privacy-ink: var(--rj-heading, #202020);
		--privacy-copy: var(--rj-ink-2, #606060);
		--privacy-cream: var(--rj-cream, #faf6ea);
		--privacy-rule: var(--rj-rule, #e1d6be);
		background: #fff;
		color: var(--privacy-copy);
		font-family: 'Sarala', var(--font-body, sans-serif);
		scroll-behavior: smooth;
	}

	.rj-privacy :global(h1), .rj-privacy :global(h2), .rj-privacy :global(h3), .rj-privacy :global(p), .rj-privacy :global(ul) { margin: 0; }
	.rj-privacy :global(h1), .rj-privacy :global(h2), .rj-privacy :global(h3) { color: var(--privacy-ink); font-family: 'Rozha One', var(--font-heading, serif); font-weight: 400; letter-spacing: normal; }

	.rj-privacy-hero {
		position: relative;
		display: flex;
		min-height: 330px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 58px 24px;
		overflow: hidden;
		border-bottom: 1px solid var(--privacy-rule);
		background:
			radial-gradient(circle at 50% -80%, rgb(204 166 70 / 24%), transparent 52%),
			linear-gradient(135deg, #f8f5ee 0%, #fff 50%, #f5f0e5 100%);
		text-align: center;
	}

	.rj-privacy-hero-mark { position: absolute; color: rgb(204 166 70 / 6%); font: 280px/1 'Rozha One', serif; pointer-events: none; }
	.rj-privacy-hero > p { position: relative; margin-bottom: 8px; color: var(--privacy-gold); font-size: 14px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; }
	.rj-privacy-hero h1 { position: relative; font-size: clamp(48px, 6vw, 76px); line-height: 1.05; }
	.rj-privacy-hero > span { position: relative; margin-top: 14px; color: var(--privacy-copy); font-size: 16px; }

	.rj-privacy-intro { display: grid; width: min(1180px, calc(100% - 80px)); grid-template-columns: .9fr 1.1fr; gap: 90px; margin: 0 auto; padding: 76px 0 62px; }
	.rj-privacy-kicker, .rj-privacy-number { color: var(--privacy-gold); font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
	.rj-privacy-intro h2 { max-width: 470px; margin-top: 12px; font-size: clamp(36px, 4vw, 52px); line-height: 1.08; }
	.rj-privacy-intro-copy { display: flex; flex-direction: column; gap: 24px; justify-content: center; }
	.rj-privacy-intro-copy > p:first-child { font-size: 17px; line-height: 30px; }
	.rj-privacy-updated { color: #8a7443; font-size: 13px; letter-spacing: .5px; }
	.rj-privacy-rule { display: flex; width: min(1180px, calc(100% - 80px)); align-items: center; gap: 16px; margin: 0 auto; }
	.rj-privacy-rule span { height: 1px; flex: 1; background: var(--privacy-rule); }
	.rj-privacy-rule i { width: 8px; height: 8px; border: 1px solid var(--privacy-gold); transform: rotate(45deg); }

	.rj-privacy-layout { display: grid; width: min(1180px, calc(100% - 80px)); grid-template-columns: 250px minmax(0, 1fr); gap: 80px; margin: 0 auto; padding: 62px 0 110px; }
	.rj-privacy-layout > aside { align-self: start; position: sticky; top: 24px; padding: 26px; border: 1px solid var(--privacy-rule); background: var(--privacy-cream); }
	.rj-privacy-layout > aside > p { margin-bottom: 18px; color: var(--privacy-ink); font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
	.rj-privacy-layout nav { display: flex; flex-direction: column; }
	.rj-privacy-layout nav a { display: grid; grid-template-columns: 28px 1fr; gap: 8px; padding: 10px 0; border-bottom: 1px solid rgb(225 214 190 / 75%); color: var(--privacy-copy); font-size: 13px; line-height: 19px; text-decoration: none; transition: color .18s ease, transform .18s ease; }
	.rj-privacy-layout nav a:last-child { border-bottom: 0; }
	.rj-privacy-layout nav a span { color: var(--privacy-gold); font-size: 11px; }
	.rj-privacy-layout nav a:hover, .rj-privacy-layout nav a:focus-visible { color: var(--privacy-ink); transform: translateX(3px); }

	.rj-privacy-content { min-width: 0; }
	.rj-privacy-content > section { scroll-margin-top: 24px; padding: 0 0 48px; margin-bottom: 48px; border-bottom: 1px solid var(--privacy-rule); }
	.rj-privacy-content > section:last-child { margin-bottom: 0; }
	.rj-privacy-content h2 { margin: 8px 0 18px; font-size: clamp(31px, 3vw, 40px); line-height: 1.14; }
	.rj-privacy-content h3 { margin-bottom: 12px; font-size: 23px; line-height: 1.25; }
	.rj-privacy-content p, .rj-privacy-content li { font-size: 15px; line-height: 27px; }
	.rj-privacy-content ul { display: grid; gap: 8px; margin-top: 18px; padding: 0; list-style: none; }
	.rj-privacy-content li { position: relative; padding-left: 20px; }
	.rj-privacy-content li::before { position: absolute; left: 1px; top: 11px; width: 5px; height: 5px; background: var(--privacy-gold); content: ''; transform: rotate(45deg); }
	.rj-privacy-content section > ul + p { margin-top: 20px; }
	.rj-privacy-columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 26px; }
	.rj-privacy-columns > div { padding: 26px; border: 1px solid var(--privacy-rule); background: #fffdfa; }

	.rj-privacy-contact { display: flex; align-items: center; justify-content: space-between; gap: 40px; padding: 38px !important; border: 1px solid var(--privacy-rule) !important; background: var(--privacy-cream); }
	.rj-privacy-contact > div { max-width: 560px; }
	.rj-privacy-contact a { display: inline-flex; min-width: max-content; align-items: center; gap: 12px; padding: 13px 20px; border: 1px solid var(--privacy-gold); background: var(--privacy-gold); color: #fff; font-size: 14px; font-weight: 700; text-decoration: none; transition: background .18s ease, color .18s ease; }
	.rj-privacy-contact a:hover { background: transparent; color: var(--privacy-ink); }

	@media (max-width: 900px) {
		.rj-privacy-intro { grid-template-columns: 1fr; gap: 28px; }
		.rj-privacy-layout { grid-template-columns: 1fr; gap: 42px; }
		.rj-privacy-layout > aside { position: static; }
		.rj-privacy-layout nav { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 24px; }
	}

	@media (max-width: 640px) {
		.rj-privacy-hero { min-height: 270px; padding: 44px 20px; }
		.rj-privacy-hero-mark { font-size: 220px; }
		.rj-privacy-hero > span { max-width: 290px; font-size: 14px; line-height: 22px; }
		.rj-privacy-intro, .rj-privacy-rule, .rj-privacy-layout { width: calc(100% - 40px); }
		.rj-privacy-intro { padding: 52px 0 44px; }
		.rj-privacy-layout { padding: 44px 0 72px; }
		.rj-privacy-layout > aside { padding: 20px; }
		.rj-privacy-layout nav { grid-template-columns: 1fr; }
		.rj-privacy-content > section { padding-bottom: 36px; margin-bottom: 36px; }
		.rj-privacy-columns { grid-template-columns: 1fr; }
		.rj-privacy-columns > div { padding: 22px; }
		.rj-privacy-contact { align-items: flex-start; flex-direction: column; padding: 26px !important; }
		.rj-privacy-contact a { width: 100%; justify-content: center; }
	}
</style>
