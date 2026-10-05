<script lang="ts">
	import { ryanServices } from './service-content.js'
</script>

<section class="rj-home-services" aria-labelledby="rj-services-title">
	<header>
		<div><p class="eyebrow">At your service</p><h2 id="rj-services-title">Jewelry care, close to home.</h2></div>
		<a class="all-services" href="/services">Explore our services <span aria-hidden="true">&nearr;</span></a>
	</header>
	<div class="service-grid">
		{#each ryanServices as service}
			<a class="service-card" href={`/services#${service.id}`}>
				<div class="service-image"><img src={service.image} alt={service.imageAlt} width="312" height="311" loading="lazy" decoding="async" /></div>
				<h3>{service.title}</h3>
				<p>{service.description}</p>
				<span class="service-link">Learn more <span aria-hidden="true">&nearr;</span></span>
			</a>
		{/each}
	</div>
</section>

<style>
	.rj-home-services { max-width: 1440px; margin: 0 auto; padding: 52px 48px; color: #292724; }
	header { display: flex; align-items: flex-end; justify-content: space-between; gap: 28px; margin-bottom: 28px; }
	.eyebrow { margin: 0 0 12px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: .14em; color: #8b6b29; }
	h2 { margin: 0; font: 400 clamp(28px, 2.5vw, 38px)/1.2 var(--font-heading, serif); letter-spacing: -.02em; }
	.all-services { display: inline-flex; gap: 22px; padding: 0 0 6px; border-bottom: 1px solid #a5843c; color: inherit; white-space: nowrap; text-decoration: none; font-size: 13px; }
	.service-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
	.service-card { display: flex; flex-direction: column; color: inherit; text-decoration: none; }
	.service-image { overflow: hidden; background: #f3f0e9; aspect-ratio: 1.35; }
	img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .25s ease; }
	h3 { margin: 18px 0 9px; font: 500 16px/1.4 var(--font-body, sans-serif); }
	.service-card p { margin: 0 0 18px; max-width: 270px; font: 400 13px/1.6 var(--font-body, sans-serif); color: #6b665f; }
	.service-link { display: flex; align-items: center; gap: 16px; margin-top: auto; font-size: 12px; }
	.service-card:hover img { transform: scale(1.025); }
	.service-card:hover .service-link { color: #8b6b29; }
	a:focus-visible { outline: 2px solid #aa873a; outline-offset: 5px; }
	@media (max-width: 900px) { .rj-home-services { padding: 40px 24px; } .service-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 20px; } }
	@media (max-width: 639px) { .rj-home-services { padding: 34px 20px; } header { align-items: flex-start; flex-direction: column; gap: 18px; } h2 { font-size: 29px; } .service-grid { gap: 26px 16px; } .service-image { aspect-ratio: 1.1; } h3 { font-size: 14px; margin-top: 13px; } .service-card p { font-size: 12px; } }
	@media (prefers-reduced-motion: reduce) { img { transition: none; } }
</style>
