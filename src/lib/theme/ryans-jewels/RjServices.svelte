<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte'
	import RjSectionHead from './RjSectionHead.svelte'
	import { ryanServices } from './service-content.js'
</script>

<section class="rj-home-services" aria-labelledby="rj-services-title">
	<div class="services-inner">
		<header>
			<div class="services-heading">
				<RjSectionHead eyebrow="At your service" title="Jewelry care, close to home." id="rj-services-title" showTabs={false} />
				<p class="services-intro">From a custom creation to everyday care, we're here for the pieces you love.</p>
			</div>
			<a class="all-services" href="/services">Explore our services <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" /></a>
		</header>
		<div class="service-grid">
			{#each ryanServices.filter((service) => service.id !== 'jewelry-appraisal') as service (service.id)}
				<a class="service-card" href={`/services#${service.id}`}>
					<div class="service-image"><img src={service.image} alt={service.imageAlt} width="312" height="311" loading="lazy" decoding="async" /></div>
					<div class="service-copy">
						<h3>{service.title}</h3>
						<p>{service.description}</p>
						<span class="service-link">Learn more <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" /></span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.rj-home-services { --services-accent: #795a20; width: 100%; padding: 56px 40px; background: var(--rj-cream, #faf6ea); color: var(--rj-ink, #404040); }
	header { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-bottom: 32px; }
	.services-heading { min-width: 0; max-width: 760px; }
	.services-heading :global(.rj-head-title) { white-space: normal; }
	.services-heading :global(.rj-head-eyebrow) { color: var(--services-accent); }
	.services-intro { max-width: 650px; margin: 12px 0 0; color: var(--rj-ink-2, #606060); font: 400 16px/1.75 var(--font-body, sans-serif); }
	.all-services { display: inline-flex; min-height: 44px; flex-shrink: 0; align-items: center; justify-content: center; gap: 14px; padding: 8px 0; border-bottom: 1px solid currentColor; color: var(--services-accent); font: 500 14px/1.5 var(--font-body, sans-serif); text-decoration: none; transition: color 200ms; }
	.all-services:is(:hover, :focus-visible) { color: var(--rj-ink, #404040); }
	.service-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
	.service-card { display: flex; min-width: 0; flex-direction: column; border: 1px solid var(--rj-card-border, #e8ddc2); background: #fff; color: inherit; text-decoration: none; transition: border-color 200ms; }
	.service-image { overflow: hidden; background: var(--rj-surface, #f4f4f4); aspect-ratio: 3 / 2; }
	img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 250ms var(--rj-ease, ease); }
	.service-copy { display: flex; flex: 1; flex-direction: column; padding: 24px; }
	h3 { margin: 0 0 12px; color: var(--rj-heading, #202020); font: 500 20px/1.4 var(--font-body, sans-serif); }
	.service-copy p { margin: 0 0 20px; color: var(--rj-ink-2, #606060); font: 400 16px/1.65 var(--font-body, sans-serif); }
	.service-link { display: inline-flex; min-height: 44px; align-self: flex-start; align-items: center; gap: 12px; margin-top: auto; padding: 10px 0; color: var(--services-accent); font: 500 14px/1.5 var(--font-body, sans-serif); text-decoration: underline; text-underline-offset: 5px; }
	.service-card:is(:hover, :focus-visible) { border-color: var(--rj-gold, #cca646); }
	.service-card:is(:hover, :focus-visible) img { transform: scale(1.025); }
	.service-card:is(:hover, :focus-visible) .service-link { color: var(--rj-ink, #404040); }
	a:focus-visible { outline: 2px solid var(--services-accent); outline-offset: 5px; }
	@media (max-width: 1100px) { header { gap: 24px; } .service-grid { gap: 20px; } .service-copy { padding: 20px; } }
	@media (max-width: 900px) { .rj-home-services { padding: 48px var(--rj-tablet-gutter, 25px); } .service-grid { gap: 16px; } .service-copy { padding: 20px 16px; } h3 { font-size: 18px; } .service-copy p { font-size: 15px; } }
	@media (max-width: 639px) { .rj-home-services { padding: 40px 24px; } header { flex-direction: column; align-items: stretch; gap: 16px; margin-bottom: 28px; } .services-intro { margin-top: 12px; } .all-services { align-self: flex-start; } .service-grid { grid-template-columns: minmax(0, 1fr); gap: 24px; } .service-copy { padding: 20px; } .service-copy p { font-size: 16px; } }
	@media (prefers-reduced-motion: reduce) { img, .service-card, .all-services { transition: none; } .service-card:is(:hover, :focus-visible) img { transform: none; } }
</style>
