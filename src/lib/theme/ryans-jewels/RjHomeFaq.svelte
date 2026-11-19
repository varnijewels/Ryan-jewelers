<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte'
	import { ryanContact } from './contact-content.js'
	const questions = [
		{ question: 'Can I create a custom piece?', answer: 'Yes. Share your idea for a ring, pendant, or another personal piece using our custom-design form. Our Salisbury team will discuss the design, stones, and setting with you.', href: '#rj-enq', link: 'Tell us about your idea' },
		{ question: 'How long does a custom order take?', answer: 'Timing depends on the design, materials, and work involved. Contact our team for the estimated timeline for your piece before placing a custom order.', href: '/contact-us', link: 'Ask our team' },
		{ question: 'Do you offer jewelry repairs and cleaning?', answer: 'Yes. Our store offers jewelry repairs, professional cleaning and inspection, custom jewelry, and appraisal services. Bring your piece in so our team can assess what it needs.', href: '/services', link: 'Explore our services' },
		{ question: 'How do I choose the right diamond?', answer: 'Compare cut, color, clarity, and carat weight alongside your style and budget. Ask our team about the diamond’s origin and any grading report available for your selection.', href: '/faqs#certification', link: 'Learn about diamond reports' },
		{ question: 'What should I know about returns?', answer: 'Return eligibility depends on the piece, including whether it is custom-made or engraved. Review our return policy and contact our team for instructions before sending anything back.', href: '/shipping-policy#returns', link: 'Read the return policy' },
		{ question: 'Where can I visit Ryan Jewelers?', answer: `Find us at ${ryanContact.location}, ${ryanContact.address}, ${ryanContact.city}. Visit our contact page for store hours, directions, and ways to reach the team.`, href: '/contact-us', link: 'Plan your visit' }
	]
</script>

<section class="rj-home-faq" aria-labelledby="rj-home-faq-heading">
	<div class="home-faq-inner">
		<header>
			<p class="faq-eyebrow">A little guidance</p>
			<h2 id="rj-home-faq-heading">Frequently Asked Questions</h2>
			<p class="faq-intro">A few helpful answers before you find your next favorite piece.</p>
			<a class="faq-all" href="/faqs">Explore all FAQs <ArrowUpRight size={15} aria-hidden="true" /></a>
		</header>
		<div class="home-faq-list">
			{#each questions as item}
				<details name="ryan-home-faq">
					<summary>{item.question}<span class="faq-toggle" aria-hidden="true"></span></summary>
					<div class="faq-answer"><p>{item.answer}</p><a href={item.href}>{item.link} <ArrowUpRight size={14} aria-hidden="true" /></a></div>
				</details>
			{/each}
		</div>
	</div>
</section>

<style>
	.rj-home-faq { padding: 65px 40px 75px; background: var(--rj-cream, #faf6ea); color: #40392e; }
	.home-faq-inner { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: 90px; max-width: 1320px; margin: auto; }
	.faq-eyebrow { margin: 0 0 15px; color: #8b6b29; font-size: 10px; line-height: 1.6; letter-spacing: .16em; text-transform: uppercase; }
	h2 { max-width: 350px; margin: 0 0 18px; font: 400 34px/1.25 var(--font-heading, serif); }
	.faq-intro { max-width: 300px; margin: 0 0 26px; color: #6f6658; font-size: 14px; line-height: 1.8; }
	.faq-all { display: inline-flex; align-items: center; gap: 18px; padding-bottom: 6px; border-bottom: 1px solid #ae8d46; color: #795a20; font-size: 12px; text-decoration: none; }
	details { border-bottom: 1px solid #dcd0b6; }
	details:first-child { border-top: 1px solid #dcd0b6; }
	summary { display: flex; min-height: 64px; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 0; color: #40392e; font-size: 15px; line-height: 1.6; list-style: none; cursor: pointer; }
	summary::-webkit-details-marker { display: none; }
	.faq-toggle { position: relative; width: 22px; height: 22px; flex: 0 0 22px; }
	.faq-toggle::before, .faq-toggle::after { content: ''; position: absolute; top: 10px; left: 4px; width: 14px; height: 1px; background: #8b6b29; }
	.faq-toggle::after { transform: rotate(90deg); transition: transform 180ms ease; }
	details[open] .faq-toggle::after { transform: rotate(0); }
	.faq-answer { padding: 0 35px 22px 0; }
	.faq-answer p { margin: 0 0 14px; color: #675f52; font-size: 13px; line-height: 1.9; }
	.faq-answer a { display: inline-flex; align-items: center; gap: 8px; color: #795a20; font-size: 12px; text-underline-offset: 4px; }
	:is(a, summary):focus-visible { outline: 2px solid #8b6b29; outline-offset: 5px; }
	@media (max-width: 900px) { .home-faq-inner { gap: 40px; grid-template-columns: 1fr; }h2 { max-width: none; }.faq-intro { max-width: 450px; } }
	@media (max-width: 639px) { .rj-home-faq { padding: 40px 24px 45px; }.home-faq-inner { gap: 28px; }summary { font-size: 14px; }.faq-answer { padding-right: 10px; } }
	@media (prefers-reduced-motion: reduce) { .faq-toggle::after { transition: none; } }
</style>
