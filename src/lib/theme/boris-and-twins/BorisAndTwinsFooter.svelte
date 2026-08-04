<script lang="ts">
	import { ArrowRight } from '@lucide/svelte'

	let { brandName = 'Boris & Twins' }: { footer?: any; description?: string; brandName?: string } = $props()

	let email = $state('')
	let subscribed = $state(false)

	function onSubscribe(e: Event) {
		e.preventDefault()
		if (email.trim()) subscribed = true
	}

	const aboutLinks = [
		{ label: 'ALL JEWELRY', href: '/products' },
		{ label: 'VINTAGE JEWELRY', href: '/products?q=vintage' },
		{ label: 'CUSTOM JEWELRY', href: '/products?q=custom' },
		{ label: 'SERVICE', href: '/p/shipping-policy' },
		{ label: 'ABOUT', href: '/about-us' },
		{ label: 'CONTACT', href: '/contact-us' }
	]
	const orderLinks = [
		{ label: 'TRACK YOUR ORDER', href: '/order-tracking' },
		{ label: 'SAFE PAYMENT', href: '/p/privacy-policy' },
		{ label: 'SHIPPING INFO', href: '/p/shipping-policy' }
	]
	const serviceLinks = [
		{ label: 'FAQ', href: '/faqs' },
		{ label: 'PROMO CODES & OFFERS', href: '/products' },
		{ label: 'SALE INFORMATION', href: '/products' },
		{ label: 'REFER A FRIEND', href: '/products' },
		{ label: 'ACCESSIBILITY', href: '/p/terms-and-conditions' }
	]
	const contactLinks = [
		{ label: 'boris.store@gmail.com', href: 'mailto:boris.store@gmail.com' },
		{ label: '+1 852-258963', href: 'tel:+1852258963' },
		{ label: 'boris.sales@gmail.com', href: 'mailto:boris.sales@gmail.com' },
		{ label: '+1 852-852147', href: 'tel:+1852852147' }
	]
</script>

<footer class="bt-footer">
	<div class="bt-footer-grid">
		<!-- Top: brand + newsletter -->
		<div class="bt-footer-top">
			<a class="bt-footer-brand" href="/">BORIS &amp; TWINS</a>
			{#if subscribed}
				<p class="bt-news-thanks">Thank you — you're on the list.</p>
			{:else}
				<form class="bt-newsletter" onsubmit={onSubscribe}>
					<label class="bt-sr-only" for="bt-news">Email Address</label>
					<input id="bt-news" name="email" type="email" placeholder="EMAIL ADDRESS" bind:value={email} required />
					<button type="submit" aria-label="Subscribe"><ArrowRight class="h-[22px] w-[22px]" /></button>
				</form>
			{/if}
		</div>

		<!-- Columns -->
		<div class="bt-footer-cols">
			<nav class="bt-fcol" aria-label="About">
				<h4>About <span class="bt-accent">B&amp;T</span></h4>
				<ul>
					{#each aboutLinks as l}<li><a href={l.href}>{l.label}</a></li>{/each}
				</ul>
			</nav>
			<nav class="bt-fcol" aria-label="Order and support">
				<h4>Order &amp; support</h4>
				<ul>
					{#each orderLinks as l}<li><a href={l.href}>{l.label}</a></li>{/each}
				</ul>
			</nav>
			<nav class="bt-fcol" aria-label="Customer service">
				<h4>customer service</h4>
				<ul>
					{#each serviceLinks as l}<li><a href={l.href}>{l.label}</a></li>{/each}
				</ul>
			</nav>
			<div class="bt-fcol">
				<h4>contact us</h4>
				<ul class="bt-fcontact">
					{#each contactLinks as l}<li><a href={l.href}>{l.label}</a></li>{/each}
				</ul>
			</div>
			<div class="bt-fcol bt-fpayment">
				<div class="bt-pay-cards" aria-label="Accepted payment methods">
					<span class="bt-pay"
						><svg class="bt-pay-logo" viewBox="0 0 40 24" role="img" aria-label="Mastercard"
							><circle cx="16" cy="12" r="8" fill="#EB001B" /><circle cx="24" cy="12" r="8" fill="#F79E1B" /><path
								d="M20 5.8a8 8 0 0 0 0 12.4 8 8 0 0 0 0-12.4Z"
								fill="#FF5F00"
							/></svg
						></span
					>
					<span class="bt-pay"
						><svg class="bt-pay-logo" viewBox="0 0 60 22" role="img" aria-label="PayPal"
							><text x="2" y="17" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="700" font-style="italic"
								><tspan fill="#003087">Pay</tspan><tspan fill="#0070BA">Pal</tspan></text
							></svg
						></span
					>
					<span class="bt-pay"
						><svg class="bt-pay-logo" viewBox="0 0 54 22" role="img" aria-label="Visa"
							><text
								x="2"
								y="17"
								font-family="Arial,Helvetica,sans-serif"
								font-size="17"
								font-weight="700"
								font-style="italic"
								letter-spacing="1"
								fill="#1A1F71">VISA</text
							></svg
						></span
					>
					<span class="bt-pay"
						><svg class="bt-pay-logo" viewBox="0 0 44 28" role="img" aria-label="American Express"
							><rect width="44" height="28" rx="3" fill="#2E77BC" /><text x="22" y="12.5" font-family="Arial" font-size="5.4" font-weight="700" fill="#fff" text-anchor="middle">AMERICAN</text><text
								x="22"
								y="20"
								font-family="Arial"
								font-size="5.4"
								font-weight="700"
								fill="#fff"
								text-anchor="middle">EXPRESS</text
							></svg
						></span
					>
					<span class="bt-pay"
						><svg class="bt-pay-logo" viewBox="0 0 56 22" role="img" aria-label="Apple Pay"
							><path d="M12.4 7.4c.5-.7.9-1.6.8-2.6-.8 0-1.8.5-2.4 1.2-.5.6-1 1.6-.8 2.5.9.1 1.8-.4 2.4-1.1Z" fill="#000" /><path
								d="M13 8.7c-1.3-.1-2.4.7-3 .7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.8-3.1 2-1.4 2.3-.4 5.8 1 7.7.6 1 1.4 2 2.3 2 .9 0 1.3-.6 2.4-.6s1.5.6 2.4.6 1.6-.9 2.2-1.8c.5-.7.7-1.4.7-1.4 0 0-1.4-.6-1.4-2.1 0-1.4 1.1-2 1.1-2-.6-1-1.6-1.1-2-1.1Z"
								fill="#000"
							/><text x="22" y="17" font-family="Arial" font-size="13" font-weight="600" fill="#000">Pay</text></svg
						></span
					>
					<span class="bt-pay"
						><svg class="bt-pay-logo" viewBox="0 0 60 18" role="img" aria-label="Discover"
							><text x="1" y="14" font-family="Arial" font-size="10.5" font-weight="700" fill="#1a1a1a">DISC</text><circle cx="31" cy="10" r="4" fill="#F76B1C" /><text
								x="36"
								y="14"
								font-family="Arial"
								font-size="10.5"
								font-weight="700"
								fill="#1a1a1a">VER</text
							></svg
						></span
					>
				</div>
				<p class="bt-pay-note">Learn more about our <span class="bt-accent">TRUSTED PAYMENT</span></p>
			</div>
		</div>

		<!-- Bottom -->
		<div class="bt-footer-bottom">
			<p class="bt-copyright">© 2026 {brandName.toUpperCase()}. ALL RIGHTS RESERVED.</p>
			<ul class="bt-socials">
				<li>
					<a href="/" aria-label="Instagram"
						><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6" /><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" /></svg></a
					>
				</li>
				<li>
					<a href="/" aria-label="WhatsApp"
						><svg viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" /><path d="M8.5 9c0 3 2.5 5.5 5.5 5.5.7 0 1.3-.6 1.3-.6l-1.4-1.1-1 .6c-1-.5-1.8-1.3-2.3-2.3l.6-1L9.6 8.4S9 8.4 8.5 9Z" fill="currentColor" /></svg></a
					>
				</li>
				<li>
					<a href="/" aria-label="Facebook"
						><svg viewBox="0 0 24 24" fill="none"><path d="M14 8.5V7c0-.7.3-1 1-1h1.5V3H14c-2.2 0-3.5 1.3-3.5 3.6V8.5H8.5v3h2V21H14v-9.5h2.2l.3-3H14Z" fill="currentColor" /></svg></a
					>
				</li>
				<li>
					<a href="/" aria-label="Twitter"
						><svg viewBox="0 0 24 24" fill="none"><path d="M21 5.9c-.7.3-1.4.5-2.1.6.8-.5 1.3-1.2 1.6-2-.7.4-1.5.7-2.3.9A3.6 3.6 0 0 0 12 8.6c0 .3 0 .6.1.8A10.2 10.2 0 0 1 4.6 5.6a3.6 3.6 0 0 0 1.1 4.8c-.6 0-1.1-.2-1.6-.4v.05a3.6 3.6 0 0 0 2.9 3.5c-.5.15-1 .17-1.5.07a3.6 3.6 0 0 0 3.4 2.5A7.2 7.2 0 0 1 3 17.6 10.2 10.2 0 0 0 8.5 19.2c6.6 0 10.2-5.5 10.2-10.2v-.5c.7-.5 1.3-1.1 1.8-1.8Z" fill="currentColor" /></svg></a
					>
				</li>
			</ul>
		</div>
	</div>
</footer>

<style>
	.bt-footer {
		margin-top: 96px;
		border-top: 1px solid #e9e9e9;
		background: #fff;
		color: #202020;
		font-family: var(--font-body, 'Jost', sans-serif);
	}

	.bt-sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}

	/* Top */
	.bt-footer-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 30px;
		padding: 0 50px;
		min-height: 108px;
		border-bottom: 1px solid #e9e9e9;
	}

	.bt-footer-brand {
		font-family: var(--font-heading, 'Bodoni Moda', serif);
		font-weight: 700;
		font-size: 30px;
		letter-spacing: 0.04em;
		color: #9e260e;
		white-space: nowrap;
		text-decoration: none;
		padding-right: 50px;
		border-right: 1px solid #e9e9e9;
		align-self: stretch;
		display: flex;
		align-items: center;
	}

	.bt-newsletter {
		display: flex;
		align-items: center;
		gap: 14px;
		width: 360px;
		max-width: 46vw;
		border-bottom: 1px solid #202020;
		padding-bottom: 8px;
	}

	.bt-newsletter input {
		flex: 1;
		min-width: 0;
		border: none;
		background: none;
		font-size: 15px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #202020;
		outline: none;
	}

	.bt-newsletter input::placeholder {
		color: #202020;
	}

	.bt-newsletter button {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border: none;
		background: none;
		color: #202020;
		cursor: pointer;
		transition:
			transform 0.3s,
			color 0.3s;
	}

	.bt-newsletter button:hover {
		transform: translateX(4px);
		color: #9e260e;
	}

	.bt-news-thanks {
		font-size: 15px;
		letter-spacing: 0.06em;
		color: #9e260e;
		text-transform: uppercase;
	}

	/* Columns */
	.bt-footer-cols {
		display: grid;
		grid-template-columns: 1.05fr 1.05fr 1.25fr 1.2fr 1.45fr;
		gap: 30px;
		padding: 54px 50px;
	}

	.bt-fcol h4 {
		font-family: var(--font-heading, 'Bodoni Moda', serif);
		font-size: 20px;
		font-weight: 600;
		color: #202020;
		margin-bottom: 26px;
		text-transform: uppercase;
		letter-spacing: 0.01em;
	}

	.bt-accent {
		color: #9e260e;
	}

	.bt-fcol ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.bt-fcol ul li {
		margin-bottom: 16px;
	}

	.bt-fcol ul a {
		font-size: 13px;
		letter-spacing: 0.06em;
		color: #595454;
		text-transform: uppercase;
		text-decoration: none;
		transition: color 0.25s;
	}

	.bt-fcol ul a:hover {
		color: #9e260e;
	}

	.bt-fcontact a {
		text-transform: none;
		letter-spacing: 0.02em;
	}

	.bt-fpayment {
		align-self: start;
	}

	.bt-pay-cards {
		display: grid;
		grid-template-columns: repeat(3, 64px);
		gap: 13px;
		margin-bottom: 20px;
	}

	.bt-pay {
		display: grid;
		place-items: center;
		height: 40px;
		border: 1px solid #e9e9e9;
		border-radius: 5px;
		background: #fff;
	}

	.bt-pay-logo {
		width: auto;
		height: auto;
		max-width: 46px;
		max-height: 24px;
	}

	.bt-pay-note {
		font-size: 13px;
		letter-spacing: 0.04em;
		color: #202020;
		text-transform: uppercase;
		max-width: 260px;
		line-height: 1.5;
	}

	/* Bottom */
	.bt-footer-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 24px 50px;
		border-top: 1px solid #e9e9e9;
	}

	.bt-copyright {
		font-size: 13px;
		letter-spacing: 0.05em;
		color: #202020;
		text-transform: uppercase;
	}

	.bt-socials {
		display: flex;
		gap: 14px;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.bt-socials li a {
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		border: 1px solid #e9e9e9;
		border-radius: 50%;
		color: #202020;
		transition:
			color 0.25s,
			background 0.25s,
			border-color 0.25s;
	}

	.bt-socials li a svg {
		width: 20px;
		height: 20px;
	}

	.bt-socials li a:hover {
		color: #fff;
		background: #9e260e;
		border-color: #9e260e;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.bt-footer-cols {
			grid-template-columns: repeat(3, 1fr);
			gap: 34px;
			padding: 44px 32px;
		}
		.bt-footer-top,
		.bt-footer-bottom {
			padding-left: 32px;
			padding-right: 32px;
		}
	}

	@media (max-width: 640px) {
		.bt-footer-top {
			flex-direction: column;
			align-items: flex-start;
			gap: 18px;
			min-height: 0;
			padding: 24px 18px;
		}
		.bt-footer-brand {
			border-right: none;
			padding-right: 0;
			font-size: 22px;
		}
		.bt-newsletter {
			width: 100%;
			max-width: none;
		}
		.bt-footer-cols {
			grid-template-columns: 1fr 1fr;
			gap: 28px;
			padding: 28px 18px;
		}
		.bt-footer-bottom {
			flex-direction: column;
			align-items: flex-start;
			gap: 14px;
			padding: 18px;
		}
	}
</style>
