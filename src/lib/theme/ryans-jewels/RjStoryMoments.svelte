<script lang="ts">
	import { ArrowRight, ChevronRight, Sparkles } from '@lucide/svelte'
	import { Tabs } from 'bits-ui'
	import { fade } from 'svelte/transition'
	import { prefersReducedMotion } from 'svelte/motion'
	import { reveal } from '$lib/core/actions/reveal.js'

	let activeMoment = $state('beginning')
	const moments = [
		{
			id: 'beginning', label: 'A new beginning', hint: 'A promise, made personal.',
			title: 'Some questions change everything.',
			text: 'A ring is a small thing that holds a very big promise. Explore the shapes, settings and details, and find your own way to say forever.',
			image: '/ryans-jewels/home/campaign/split-shank-eternity-v2.webp',
			alt: 'A diamond engagement ring and eternity band worn together on the hand',
			width: 1672, height: 941, position: '70% 50%',
			link: 'Explore engagement rings', href: '/products?categories=engagement'
		},
		{
			id: 'everyday', label: 'Everyday brilliance', hint: 'For all the days in between.',
			title: 'Your favorite kind of ordinary.',
			text: 'The morning coffee. A familiar face. A day with no special plans. Some pieces make the little things feel a little more like you.',
			image: '/ryans-jewels/home/campaign/solitaire-studs-model-v2.webp',
			alt: 'A woman wearing a small diamond stud earring with an ivory shirt',
			width: 1672, height: 941, position: '70% 50%',
			link: 'Find your everyday pair', href: '/products?categories=women'
		},
		{
			id: 'gift', label: 'A thoughtful gift', hint: 'A little piece of “I know you.”',
			title: 'The thought is what makes it theirs.',
			text: 'A birthday. A thank you. Or no occasion at all. Choose a piece that says you noticed the little things that make them who they are.',
			image: '/ryans-jewels/home/spotlights/studio-diamond-jewelry-v1.webp',
			alt: 'A rose gold diamond pendant and chain arranged on an ivory stone display',
			width: 1122, height: 1402, position: '50% 38%',
			link: 'Discover meaningful gifts', href: '/products?categories=pendants'
		}
	]
</script>

<section id="your-moment" class="rj-story-moments" aria-labelledby="rj-moments-heading" use:reveal>
	<Tabs.Root bind:value={activeMoment} orientation="vertical" class="rj-moments-layout">
		<div class="rj-moments-selector">
			<p class="rj-moments-eyebrow"><Sparkles size={16} strokeWidth={1.3} aria-hidden="true" /> The Ryan moments journal</p>
			<h2 id="rj-moments-heading">Every story has<br />a little sparkle.</h2>
			<p class="rj-moments-intro">Jewelry becomes meaningful when it becomes yours. Choose a moment and find a little inspiration.</p>
			<Tabs.List aria-label="Choose your moment" class="rj-moments-list">
				{#each moments as moment, index}
					<Tabs.Trigger value={moment.id} aria-label={moment.label} class="rj-moments-trigger">
						<span class="rj-moment-number" aria-hidden="true">0{index + 1}</span>
						<span class="rj-moment-label"><strong>{moment.label}</strong><span>{moment.hint}</span></span>
						<ChevronRight size={17} strokeWidth={1.4} aria-hidden="true" />
					</Tabs.Trigger>
				{/each}
			</Tabs.List>
		</div>
		<div class="rj-moments-panels">
			{#each moments as moment, index}
				<Tabs.Content value={moment.id} class="rj-moment-panel">
					{#if activeMoment === moment.id}
						<div class="rj-moment-content" in:fade={{ duration: prefersReducedMotion.current ? 0 : 240 }}>
							<div class="rj-moment-album">
								<figure>
									<img src={moment.image} alt={moment.alt} width={moment.width} height={moment.height} style:object-position={moment.position} loading="lazy" decoding="async" />
									<figcaption><span>{moment.label}</span><span>0{index + 1} <span aria-hidden="true">/</span> 03</span></figcaption>
								</figure>
							</div>
							<div class="rj-moment-story"><h3>{moment.title}</h3><p>{moment.text}</p><a href={moment.href}>{moment.link}<ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></a></div>
						</div>
					{/if}
				</Tabs.Content>
			{/each}
		</div>
	</Tabs.Root>
</section>

<style>
	.rj-story-moments { padding: 88px var(--about-gutter, 40px); background: var(--rj-cream, #faf6ea); color: var(--rj-ink, #404040); scroll-margin-top: 160px; }
	.rj-story-moments :is(h2, h3, p, figure) { margin: 0; }
	.rj-story-moments :global(.rj-moments-layout) { display: grid; grid-template-columns: .85fr 1.15fr; align-items: center; gap: clamp(40px, 6vw, 100px); }
	.rj-moments-selector { max-width: 540px; }
	.rj-moments-eyebrow { display: flex; align-items: center; gap: 9px; color: var(--about-accent, #795a20); font-size: 11px; font-weight: 500; line-height: 1.5; letter-spacing: .12em; text-transform: uppercase; }
	.rj-story-moments h2 { margin-top: 20px; color: var(--rj-heading, #202020); font-size: clamp(25px, 2.3vw, 34px); font-weight: 400; line-height: 1.3; letter-spacing: 0; }
	.rj-moments-intro { max-width: 43ch; margin-top: 22px !important; color: var(--rj-ink-2, #606060); font-size: 15px; line-height: 1.75; }
	.rj-story-moments :global(.rj-moments-list) { display: flex; flex-direction: column; margin-top: 28px; }
	.rj-story-moments :global(.rj-moments-trigger) { position: relative; display: grid; grid-template-columns: 25px 1fr 18px; min-height: 94px; align-items: center; gap: 14px; width: 100%; padding: 18px 12px; border: 0; border-top: 1px solid var(--rj-rule, #e1d6be); border-radius: 0; background: transparent; color: var(--rj-ink, #404040); text-align: left; cursor: pointer; transition: background-color 220ms ease; }
	.rj-story-moments :global(.rj-moments-trigger:last-child) { border-bottom: 1px solid var(--rj-rule, #e1d6be); }
	.rj-story-moments :global(.rj-moments-trigger::before) { position: absolute; inset: 18px auto 18px 0; width: 2px; background: var(--rj-gold, #cca646); content: ''; opacity: 0; transform: scaleY(.5); transition: opacity 220ms, transform 220ms var(--rj-ease, ease); }
	.rj-story-moments :global(.rj-moments-trigger[data-state='active']) { background: rgb(255 255 255 / 65%); }
	.rj-story-moments :global(.rj-moments-trigger[data-state='active']::before) { opacity: 1; transform: scaleY(1); }
	.rj-story-moments :global(.rj-moments-trigger:hover) { background: rgb(255 255 255 / 80%); }
	.rj-moment-number { align-self: start; padding-top: 4px; color: var(--about-accent, #795a20); font-size: 10px; line-height: 1.5; }
	.rj-moment-label { display: flex; flex-direction: column; gap: 7px; }
	.rj-moment-label strong { font-size: 17px; font-weight: 500; line-height: 1.4; }
	.rj-moment-label > span { color: var(--rj-ink-2, #606060); font-size: 12px; line-height: 1.5; }
	.rj-story-moments :global(.rj-moments-trigger > svg) { color: var(--about-accent, #795a20); transition: transform 220ms var(--rj-ease, ease); }
	.rj-story-moments :global(.rj-moments-trigger[data-state='active'] > svg) { transform: translateX(3px); }
	.rj-moments-panels { min-width: 0; }
	.rj-story-moments :global(.rj-moment-panel[hidden]) { display: none; }
	.rj-moment-album { position: relative; margin: 12px 14px 20px; }
	.rj-moment-album::before { position: absolute; inset: 0; border: 1px solid var(--rj-rule, #e1d6be); background: #f0e7d2; content: ''; transform: rotate(2.3deg); }
	.rj-moment-album figure { position: relative; padding: 12px; border: 1px solid var(--rj-rule, #e1d6be); background: #fff; box-shadow: 0 8px 24px rgb(74 55 19 / 5%); transform: rotate(-.8deg); }
	.rj-moment-album img { display: block; width: 100%; height: auto; aspect-ratio: 1.65; object-fit: cover; }
	.rj-moment-album figcaption { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 4px 5px; color: var(--about-accent, #795a20); font-size: 10px; line-height: 1.5; letter-spacing: .08em; text-transform: uppercase; }
	.rj-moment-album figcaption > span:last-child { flex-shrink: 0; }
	.rj-moment-story { padding: 8px 14px 0; }
	.rj-moment-story h3 { color: var(--rj-heading, #202020); font-size: 21px; font-weight: 400; line-height: 1.4; letter-spacing: 0; text-wrap: balance; }
	.rj-moment-story p { max-width: 60ch; margin-top: 12px !important; color: var(--rj-ink-2, #606060); font-size: 14px; line-height: 1.75; }
	.rj-moment-story a { display: inline-flex; min-height: 44px; align-items: center; gap: 18px; margin-top: 14px; border-bottom: 1px solid var(--rj-rule, #e1d6be); color: var(--about-accent, #795a20); font-size: 13px; line-height: 1.5; text-decoration: none; }
	.rj-moment-story a :global(svg) { transition: transform 220ms var(--rj-ease, ease); }
	.rj-moment-story a:hover :global(svg) { transform: translateX(3px); }
	.rj-story-moments :global(.rj-moments-trigger:focus-visible), .rj-story-moments :global(.rj-moment-panel:focus-visible), .rj-moment-story a:focus-visible { outline: 2px solid var(--about-accent, #795a20); outline-offset: 4px; }
	@media (min-width: 1800px) { .rj-story-moments { padding-block: 110px; } }
	@media (max-width: 1199px) { .rj-story-moments { padding-block: 64px; scroll-margin-top: 240px; }.rj-story-moments :global(.rj-moments-layout) { gap: 36px; grid-template-columns: 1fr 1.1fr; }.rj-story-moments :global(.rj-moments-trigger) { gap: 8px; }.rj-moment-label strong { font-size: 16px; } }
	@media (max-width: 767px) { .rj-story-moments :global(.rj-moments-layout) { grid-template-columns: 1fr; gap: 36px; }.rj-moments-selector { max-width: none; }.rj-moment-album img { aspect-ratio: 1.5; }.rj-moment-story p { max-width: none; } }
	@media (max-width: 639px) { .rj-story-moments { padding-block: 52px; }.rj-moments-eyebrow { font-size: 10px; }.rj-story-moments h2 { margin-top: 18px; }.rj-moments-intro { margin-top: 18px !important; font-size: 14px; }.rj-story-moments :global(.rj-moments-list) { margin-top: 24px; }.rj-story-moments :global(.rj-moments-trigger) { min-height: 82px; grid-template-columns: 22px 1fr 16px; padding-block: 14px; }.rj-moment-label { gap: 4px; }.rj-moment-album { margin-inline: 7px; }.rj-moment-album figure { padding: 8px; }.rj-moment-album figcaption { padding: 12px 2px 4px; font-size: 9px; }.rj-moment-story { padding-inline: 7px; }.rj-moment-story h3 { font-size: 19px; }.rj-moment-story p { font-size: 14px; }.rj-moment-story a { font-size: 12px; } }
	@media (prefers-reduced-motion: reduce) { .rj-story-moments :global(.rj-moments-trigger), .rj-story-moments :global(.rj-moments-trigger::before), .rj-story-moments :global(.rj-moments-trigger > svg), .rj-moment-story a :global(svg) { transition: none; }.rj-moment-story a:hover :global(svg), .rj-story-moments :global(.rj-moments-trigger[data-state='active'] > svg) { transform: none; } }
</style>
