<script lang="ts">
	import { ArrowRight, ArrowUpRight, ChevronRight, Diamond, HeartHandshake, MapPin, PenTool, Phone } from '@lucide/svelte'
	import type { Page } from '$lib/core/types/index.js'
	import { SeoHeader } from '$lib/core/components/index.js'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'
	import RjStoryMoments from '$lib/theme/ryans-jewels/RjStoryMoments.svelte'
	import { reveal } from '$lib/core/actions/reveal.js'
	import { ryanContact } from '$lib/theme/ryans-jewels/contact-content.js'
	import { ryansSeoText } from '$lib/theme/ryans-jewels/seo.js'

	interface Props {
		data: { page: Page; theme?: { name: string } }
	}
	const { data }: Props = $props()
	const isRyans = $derived(data?.theme?.name === 'ryans-jewels')
	const ryanDescription = 'Meet Ryan Jewelers in Salisbury, Maryland. Explore our approach to lab-grown diamond jewelry, custom design and personal jewelry care.'
	const chapters = [
		{ label: 'Our story', href: '#our-story' },
		{ label: 'Our approach', href: '#our-values' },
		{ label: 'The details', href: '#our-craft' },
		{ label: 'Visit our store', href: '#discover-ryan' }
	]
	const values = [
		{ icon: HeartHandshake, title: 'Personal, from the start', text: 'A milestone, a gift, or something just for you. Tell us what you have in mind, and explore the possibilities with our team.' },
		{ icon: Diamond, title: 'Room to find your favorite', text: 'Get a closer look at the stones, settings and metals. Ask questions, try pieces on, and find the details that feel right.' },
		{ icon: PenTool, title: 'A relationship beyond the piece', text: 'From a custom idea to cleaning, inspection and repairs, we are here to help you care for the jewelry you love.' }
	]
</script>

<SeoHeader
	metaTitle={isRyans ? 'About Ryan Jewelers | Our Story & Salisbury Store' : ryansSeoText(data?.page?.metaTitle, 'About Ryan Jewelers')}
	metaDescription={isRyans ? ryanDescription : ryansSeoText(data?.page?.metaDescription, ryanDescription)}
/>

{#if isRyans}
	<div class="rj-about">
		<nav class="rj-about-breadcrumb" aria-label="Breadcrumb">
			<ol><li><a href="/">Home</a><ChevronRight size={13} strokeWidth={1.4} aria-hidden="true" /></li><li aria-current="page">About Us</li></ol>
		</nav>

		<section class="rj-about-hero" aria-labelledby="rj-about-title">
			<div class="rj-about-hero-copy">
				<p class="rj-about-eyebrow">About Ryan Jewelers</p>
				<h1 id="rj-about-title">More than a piece.<br />Part of your story.</h1>
				<p class="rj-about-intro">For the big question. The everyday moments. And everything that makes a piece of jewelry yours.</p>
				<div class="rj-about-actions">
					<a class="rj-about-button is-gold" href="#our-story">Get to know us <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></a>
					<a class="rj-about-link" href="/contact-us">Visit our store <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /></a>
				</div>
				<p class="rj-about-local"><MapPin size={15} strokeWidth={1.4} aria-hidden="true" /> Your jeweler in Salisbury, Maryland</p>
			</div>
			<div class="rj-about-hero-photo">
				<picture>
					<source srcset="/ryans-jewels/home/campaign/oval-halo-hand-v1.avif" type="image/avif" />
					<img src="/ryans-jewels/home/campaign/oval-halo-hand-v1.webp" alt="An oval halo diamond ring worn on the hand, against soft ivory fabric" width="1100" height="1375" fetchpriority="high" decoding="async" />
				</picture>
			</div>
		</section>

		<nav class="rj-about-chapters" aria-label="About Ryan Jewelers sections">
			{#each chapters as chapter, index}<a href={chapter.href}><span aria-hidden="true">0{index + 1}</span>{chapter.label}<ArrowUpRight size={14} strokeWidth={1.4} aria-hidden="true" /></a>{/each}
		</nav>

		<section id="our-story" class="rj-about-story rj-about-section" aria-labelledby="rj-about-story-title" use:reveal>
			<figure class="rj-about-story-photo">
				<img src="/ryans-jewels/store/store-interior.webp" alt="Jewelry displays inside the Ryan Jewelers store" width="700" height="560" loading="lazy" decoding="async" />
				<figcaption><span class="rj-about-dot" aria-hidden="true"></span>A closer look, a personal conversation.</figcaption>
			</figure>
			<div class="rj-about-story-copy">
				<p class="rj-about-eyebrow">Rooted in Salisbury</p>
				<h2 id="rj-about-story-title">A familiar face.<br />A personal experience.</h2>
				<p>Jewelry is personal. It marks a beginning, carries a memory, or simply becomes the piece you reach for every morning.</p>
				<p>At Ryan Jewelers, we help you find that connection. Visit us at {ryanContact.location} to explore lab-grown diamond designs and fine jewelry, talk through an idea, or give a favorite piece a little care.</p>
				<p>From your first question to the final choice, our Salisbury team is here to help you find what feels like you.</p>
				<a class="rj-about-link" href="/contact-us">Say hello to our team <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /></a>
			</div>
		</section>

		<section id="our-values" class="rj-about-values rj-about-section" aria-labelledby="rj-about-values-title" use:reveal>
			<div class="rj-about-values-heading">
				<p class="rj-about-eyebrow">The Ryan approach</p>
				<h2 id="rj-about-values-title">Good jewelry begins<br />with a good conversation.</h2>
				<p>Beautiful pieces are only part of the experience. How you find them matters, too.</p>
			</div>
			<ul class="rj-about-values-list">
				{#each values as value}
					<li><value.icon size={25} strokeWidth={1.2} aria-hidden="true" /><div><h3>{value.title}</h3><p>{value.text}</p></div></li>
				{/each}
			</ul>
		</section>

		<section id="our-craft" class="rj-about-details rj-about-section" aria-labelledby="rj-about-details-title" use:reveal>
			<div class="rj-about-details-copy">
				<p class="rj-about-eyebrow">It's all in the details</p>
				<h2 id="rj-about-details-title">The little things.<br />The lasting favorites.</h2>
				<p>The shape of a stone. The warmth of the metal. The way a piece sits when you put it on. Finding your jewelry is about discovering the details you love.</p>
				<p>Explore engagement rings, wedding bands, earrings and pendants. Or bring an idea of your own, and start a conversation about a custom design.</p>
				<a class="rj-about-button" href="/products">Explore our jewelry <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></a>
				<a class="rj-about-link" href="/#rj-enq">Let's create something personal <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /></a>
			</div>
			<div class="rj-about-details-gallery">
				<figure><img src="/ryans-jewels/about/oval-pear-lifestyle-v3.webp" alt="An oval diamond ring with pear-shaped side stones worn on a hand beside an ivory linen sleeve" width="1122" height="1402" loading="lazy" decoding="async" /><figcaption>A moment worth keeping.</figcaption></figure>
				<figure><img src="/ryans-jewels/about/gold-huggie-lifestyle-v3.webp" alt="A yellow gold twisted diamond huggie earring worn on a natural earlobe" width="1122" height="1402" loading="lazy" decoding="async" /><figcaption>A little everyday brilliance.</figcaption></figure>
			</div>
		</section>

		<RjStoryMoments />

		<section class="rj-about-care" aria-labelledby="rj-about-care-title" use:reveal>
			<div><p class="rj-about-eyebrow">Here for the years ahead</p><h2 id="rj-about-care-title">The piece is just the beginning.</h2></div>
			<div class="rj-about-care-copy"><p>A new idea. A broken clasp. An old favorite that needs a fresh shine. Explore custom jewelry, repairs, cleaning and inspection with our team.</p><a class="rj-about-link" href="/services">Discover our services <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /></a></div>
		</section>

		{#if data?.page?.layouts?.length}<div class="rj-about-blocks"><Blocks layouts={data.page.layouts} /></div>{/if}

		<section id="discover-ryan" class="rj-about-visit rj-about-section" aria-labelledby="rj-about-visit-title" use:reveal>
			<div class="rj-about-visit-photo"><img src="/ryans-jewels/store/salisbury-storefront-wide-v1.webp" alt="Ryan Jewelers storefront at The Centre at Salisbury" width="2400" height="1800" loading="lazy" decoding="async" /></div>
			<div class="rj-about-visit-copy">
				<p class="rj-about-eyebrow">We'd love to meet you</p>
				<h2 id="rj-about-visit-title">Come in.<br />Find your next favorite.</h2>
				<p>See the details up close, try on the pieces you love, and let us help you make them part of your story.</p>
				<address><MapPin size={20} strokeWidth={1.3} aria-hidden="true" /><div><strong>{ryanContact.location}</strong><span>{ryanContact.address}</span><span>{ryanContact.city}</span></div></address>
				<div class="rj-about-actions"><a class="rj-about-button is-gold" href="/contact-us">Plan your visit <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></a><a class="rj-about-phone" href={ryanContact.phoneHref}><Phone size={16} strokeWidth={1.4} aria-hidden="true" />{ryanContact.phone}</a></div>
				<a class="rj-about-link" href={ryanContact.directionsHref} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /><span class="sr-only"> (opens in a new tab)</span></a>
			</div>
		</section>
	</div>
{:else}
	<section class="mt-20">
		<div class="container mx-auto flex max-w-7xl flex-col px-4 md:px-10">
			<div class="mx-auto flex max-w-max flex-col items-center py-5 text-center text-3xl font-bold sm:items-start sm:py-10 sm:text-4xl"><h1>About Us</h1><hr class="mt-2.5 w-20 border-t-4 border-zinc-900 opacity-50" /></div>
			<div class="prose-lg prose-p:my-0 prose-li:my-0">{@html data?.page?.content}</div>
		</div>
	</section>
	<Blocks layouts={data.page.layouts} />
{/if}

<style>
	.rj-about { --about-gutter: 40px; --about-accent: #795a20; color: var(--rj-ink, #404040); background: #fff; }
	.rj-about :is(h1, h2, h3, p, figure) { margin: 0; }
	.rj-about h2 { color: var(--rj-heading, #202020); font-size: clamp(25px, 2.3vw, 34px); font-weight: 400; line-height: 1.3; letter-spacing: 0; text-wrap: balance; }
	.rj-about p { font-size: 16px; line-height: 1.75; }
	.rj-about .rj-about-eyebrow { color: var(--about-accent); font-size: 11px; font-weight: 500; line-height: 1.5; letter-spacing: .14em; text-transform: uppercase; }
	.rj-about a { text-decoration: none; }
	.rj-about a:focus-visible { outline: 2px solid currentColor; outline-offset: 5px; }
	.rj-about-section { padding: 88px var(--about-gutter); scroll-margin-top: 160px; }
	.rj-about-breadcrumb { padding: 5px var(--about-gutter); border-bottom: 1px solid var(--rj-card-border, #f5edda); }
	.rj-about-breadcrumb ol { display: flex; align-items: center; gap: 12px; margin: 0; padding: 0; list-style: none; color: var(--rj-ink-2, #606060); font-size: 12px; }
	.rj-about-breadcrumb li { display: flex; align-items: center; gap: 12px; }
	.rj-about-breadcrumb a { display: inline-flex; min-height: 44px; align-items: center; color: inherit; }
	.rj-about-breadcrumb a:hover { color: var(--about-accent); }
	.rj-about-hero { display: grid; grid-template-columns: 1fr 1fr; background: var(--rj-cream, #faf6ea); }
	.rj-about-hero-copy { display: flex; min-height: 580px; flex-direction: column; align-items: flex-start; justify-content: center; padding: 64px clamp(40px, 5vw, 88px); }
	.rj-about-hero h1 { margin: 20px 0 24px; color: var(--rj-heading, #202020); font-size: clamp(36px, 4.2vw, 64px); font-weight: 400; line-height: 1.14; letter-spacing: -.025em; }
	.rj-about-intro { max-width: 390px; color: var(--rj-ink-2, #606060); }
	.rj-about-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 24px; }
	.rj-about-hero .rj-about-actions { margin-top: 30px; }
	.rj-about .rj-about-local { display: flex; align-items: center; gap: 8px; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--rj-rule, #e1d6be); color: var(--rj-ink-2, #606060); font-size: 12px; }
	.rj-about-hero-photo { position: relative; min-width: 0; }
	.rj-about-hero-photo picture, .rj-about-hero-photo img { position: absolute; inset: 0; width: 100%; height: 100%; }
	.rj-about-hero-photo img { object-fit: cover; object-position: 50% 42%; }
	.rj-about-button { display: inline-flex; min-height: 46px; align-items: center; justify-content: center; gap: 20px; padding: 12px 22px; border: 1px solid var(--rj-gold, #cca646); border-radius: 3px; background: transparent; color: #51370f; font-size: 13px; line-height: 1.5; transition: background-color 220ms ease, border-color 220ms ease; }
	.rj-about-button.is-gold { background: var(--rj-gold, #cca646); color: #33270f; }
	.rj-about-button:hover { border-color: #ac8735; background: color-mix(in srgb, var(--rj-gold, #cca646) 20%, #fff); }
	.rj-about-button.is-gold:hover { background: #d9bb70; }
	.rj-about-link { display: inline-flex; min-height: 44px; align-items: center; gap: 16px; border-bottom: 1px solid var(--rj-rule, #e1d6be); color: var(--about-accent); font-size: 13px; line-height: 1.5; }
	.rj-about-link :global(svg), .rj-about-button :global(svg) { flex-shrink: 0; transition: transform 220ms var(--rj-ease, ease); }
	.rj-about-link:hover :global(svg), .rj-about-button:hover :global(svg) { transform: translateX(3px); }
	.rj-about-chapters { display: grid; grid-template-columns: repeat(4, 1fr); padding: 0 var(--about-gutter); border-bottom: 1px solid var(--rj-rule, #e1d6be); }
	.rj-about-chapters a { display: flex; min-height: 76px; align-items: center; gap: 14px; padding: 16px 24px; color: var(--rj-ink, #404040); font-size: 13px; transition: background-color 220ms ease; }
	.rj-about-chapters a:first-child { padding-left: 0; }
	.rj-about-chapters a + a { border-left: 1px solid var(--rj-card-border, #f5edda); }
	.rj-about-chapters a > span { color: var(--about-accent); font-size: 10px; }
	.rj-about-chapters a :global(svg) { margin-left: auto; color: var(--about-accent); }
	.rj-about-chapters a:hover { background: var(--rj-cream, #faf6ea); }
	.rj-about-story { display: grid; grid-template-columns: 1.05fr 1fr; align-items: center; gap: clamp(40px, 7vw, 120px); }
	.rj-about-story-photo img { display: block; width: 100%; aspect-ratio: 1.25; object-fit: cover; }
	.rj-about-story-photo figcaption { display: flex; align-items: center; gap: 8px; padding: 16px 0; border-bottom: 1px solid var(--rj-rule, #e1d6be); color: var(--rj-ink-2, #606060); font-size: 12px; }
	.rj-about-dot { width: 5px; height: 5px; flex-shrink: 0; border-radius: 50%; background: var(--rj-gold, #cca646); }
	.rj-about-story-copy, .rj-about-details-copy, .rj-about-visit-copy { display: flex; flex-direction: column; align-items: flex-start; gap: 22px; }
	.rj-about-story-copy > p:not(.rj-about-eyebrow), .rj-about-details-copy > p:not(.rj-about-eyebrow), .rj-about-visit-copy > p:not(.rj-about-eyebrow) { max-width: 52ch; color: var(--rj-ink-2, #606060); }
	.rj-about-values { display: grid; grid-template-columns: 1fr 1.1fr; align-items: start; gap: clamp(48px, 8vw, 140px); background: var(--rj-cream, #faf6ea); }
	.rj-about-values-heading { position: sticky; top: 166px; display: flex; flex-direction: column; gap: 22px; }
	.rj-about-values-heading > p:last-child { max-width: 36ch; color: var(--rj-ink-2, #606060); }
	.rj-about-values-list { margin: 0; padding: 0; list-style: none; }
	.rj-about-values-list li { display: grid; grid-template-columns: 26px 1fr; gap: 22px; padding: 28px 0; border-top: 1px solid var(--rj-rule, #e1d6be); }
	.rj-about-values-list li:last-child { padding-bottom: 0; }
	.rj-about-values-list li > :global(svg) { color: var(--about-accent); }
	.rj-about h3 { color: var(--rj-heading, #202020); font-size: 18px; font-weight: 500; line-height: 1.4; letter-spacing: 0; }
	.rj-about-values-list p { margin-top: 12px; color: var(--rj-ink-2, #606060); font-size: 15px; }
	.rj-about-details { display: grid; grid-template-columns: .85fr 1.3fr; align-items: center; gap: clamp(40px, 6vw, 100px); }
	.rj-about-details-gallery { display: grid; grid-template-columns: 1fr 1fr; align-items: start; gap: 20px; }
	.rj-about-details-gallery figure:last-child { margin-top: 90px; }
	.rj-about-details-gallery img { display: block; width: 100%; aspect-ratio: .74; object-fit: cover; }
	.rj-about-details-gallery figcaption { padding-top: 14px; color: var(--rj-ink-2, #606060); font-size: 12px; line-height: 1.5; }
	.rj-about-care { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 80px; padding: 60px var(--about-gutter); background: #2e2b25; color: #f9f7f0; }
	.rj-about-care .rj-about-eyebrow { margin-bottom: 16px; color: #e5cf96; }
	.rj-about-care h2 { color: #fff; }
	.rj-about-care-copy { max-width: 540px; }
	.rj-about-care-copy > p { color: #ebe7df; font-size: 15px; }
	.rj-about-care .rj-about-link { margin-top: 18px; border-color: #77664a; color: #f4d994; }
	.rj-about-visit { display: grid; grid-template-columns: 1.12fr 1fr; align-items: center; gap: clamp(40px, 7vw, 120px); background: var(--rj-cream, #faf6ea); }
	.rj-about-visit-photo { min-width: 0; }
	.rj-about-visit-photo img { display: block; width: 100%; aspect-ratio: 1.18; object-fit: cover; object-position: 52% 52%; }
	.rj-about-visit address { display: flex; gap: 14px; margin: 2px 0 4px; font-size: 14px; font-style: normal; line-height: 1.8; }
	.rj-about-visit address > :global(svg) { flex-shrink: 0; margin-top: 4px; color: var(--about-accent); }
	.rj-about-visit address :is(strong, span) { display: block; }
	.rj-about-visit address strong { margin-bottom: 3px; font-weight: 500; }
	.rj-about-phone { display: inline-flex; min-height: 44px; align-items: center; gap: 8px; color: var(--rj-ink, #404040); font-size: 13px; }
	.rj-about-phone:hover { color: var(--about-accent); }
	.rj-about-blocks { padding: 0 var(--about-gutter); }
	@media (min-width: 1800px) { .rj-about-hero-copy { min-height: 680px; }.rj-about-section { padding-block: 110px; } }
	@media (max-width: 1199px) { .rj-about { --about-gutter: 32px; }.rj-about-section { padding-block: 64px; scroll-margin-top: 240px; }.rj-about-hero-copy { min-height: 510px; padding: 44px 32px; }.rj-about-hero h1 { font-size: clamp(36px, 4.2vw, 50px); }.rj-about-values-heading { position: static; }.rj-about-details { grid-template-columns: 1fr 1.1fr; gap: 40px; }.rj-about-details-gallery { gap: 12px; }.rj-about-details-gallery figure:last-child { margin-top: 60px; }.rj-about-care { gap: 40px; } }
	@media (max-width: 899px) { .rj-about-hero-copy { min-height: 500px; }.rj-about-hero h1 { font-size: 38px; }.rj-about-hero .rj-about-actions { gap: 8px 18px; }.rj-about-story, .rj-about-values, .rj-about-details, .rj-about-visit { gap: 36px; }.rj-about-story { grid-template-columns: 1fr 1fr; align-items: start; }.rj-about-values { grid-template-columns: .9fr 1.1fr; }.rj-about-details { grid-template-columns: 1fr; }.rj-about-details-copy { max-width: 620px; }.rj-about-details-gallery { gap: 24px; }.rj-about-details-gallery img { aspect-ratio: 1; }.rj-about-details-gallery figure:last-child { margin-top: 48px; }.rj-about-visit { grid-template-columns: 1fr 1fr; }.rj-about-visit-photo img { aspect-ratio: .8; } }
	@media (max-width: 639px) {
		.rj-about { --about-gutter: 24px; }
		.rj-about-section { padding-block: 52px; }
		.rj-about p { font-size: 15px; line-height: 1.75; }
		.rj-about .rj-about-eyebrow { font-size: 10px; }
		.rj-about-hero { grid-template-columns: 1fr; }
		.rj-about-hero-copy { min-height: 0; padding: 44px var(--about-gutter) 36px; }
		.rj-about-hero h1 { margin-block: 18px 20px; font-size: clamp(33px, 9.2vw, 46px); }
		.rj-about-intro { max-width: 34ch; }
		.rj-about-hero .rj-about-actions { margin-top: 24px; gap: 10px 20px; }
		.rj-about .rj-about-local { margin-top: 28px; font-size: 11px; }
		.rj-about-hero-photo { aspect-ratio: 1.18; }
		.rj-about-hero-photo img { object-position: 50% 43%; }
		.rj-about-button { gap: 14px; padding-inline: 18px; font-size: 12px; }
		.rj-about-link { gap: 12px; font-size: 12px; }
		.rj-about-chapters { grid-template-columns: 1fr 1fr; }
		.rj-about-chapters a { min-height: 58px; gap: 10px; padding: 12px; font-size: 12px; }
		.rj-about-chapters a:nth-child(odd) { padding-left: 0; border-left: 0; }
		.rj-about-chapters a:nth-child(-n+2) { border-bottom: 1px solid var(--rj-card-border, #f5edda); }
		.rj-about-story, .rj-about-values, .rj-about-details, .rj-about-visit, .rj-about-care { grid-template-columns: 1fr; }
		.rj-about-story-photo figcaption { padding-block: 12px; font-size: 11px; }
		.rj-about-story-copy, .rj-about-details-copy, .rj-about-visit-copy { gap: 18px; }
		.rj-about-values { gap: 30px; }
		.rj-about-values-heading { gap: 18px; }
		.rj-about-values-list li { gap: 18px; padding-block: 24px; }
		.rj-about h3 { font-size: 17px; }
		.rj-about-values-list p { margin-top: 10px; font-size: 14px; }
		.rj-about-details-gallery { gap: 14px; }
		.rj-about-details-gallery img { aspect-ratio: .74; }
		.rj-about-details-gallery figure:last-child { margin-top: 36px; }
		.rj-about-details-gallery figcaption { font-size: 11px; }
		.rj-about-care { gap: 24px; padding-block: 44px; }
		.rj-about-care-copy > p { font-size: 14px; }
		.rj-about-visit-photo img { aspect-ratio: 1.15; }
		.rj-about-visit address { font-size: 13px; }
		.rj-about-visit .rj-about-actions { gap: 8px 18px; }
	}
	@media (prefers-reduced-motion: reduce) { .rj-about a, .rj-about a :global(svg) { transition: none; }.rj-about-link:hover :global(svg), .rj-about-button:hover :global(svg) { transform: none; } }
</style>
