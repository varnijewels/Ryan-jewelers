<script lang="ts">
 import { SeoHeader } from '$lib/core/components/index.js'
 import { ryanServices } from '$lib/theme/ryans-jewels/service-content.js'
</script>

<SeoHeader metaTitle="Jewelry Services | Ryan Jewelers" metaDescription="Custom jewelry, jewelry repairs, cleaning and inspection, and appraisals at Ryan Jewelers in Salisbury, Maryland." />

<main class="rj-services-page">
 <header class="services-intro">
  <p class="eyebrow">Ryan Jewelers · Salisbury, Maryland</p>
  <h1>Jewelry services</h1>
  <p>From a new design to care for a piece you already love, we're here to help.</p>
  <a class="contact-link" href="/contact-us">Talk to our team <span aria-hidden="true">&nearr;</span></a>
 </header>
 <div class="services-list">
  {#each ryanServices as service}
   <section class="service-detail" id={service.id} aria-labelledby={`${service.id}-title`}>
    <img src={service.image} alt={service.imageAlt} width="312" height="311" loading="lazy" decoding="async" />
    <div>
     <h2 id={`${service.id}-title`}>{service.title}</h2>
     <p>{service.detail}</p>
     <a href="/contact-us">Ask about this service <span aria-hidden="true">&nearr;</span></a>
    </div>
   </section>
  {/each}
 </div>
 <aside class="services-visit">
  <h2>Bring your piece in.</h2>
  <p>Visit our Salisbury store or contact us to discuss what you need.</p>
  <a href="/contact-us">Store details &amp; hours <span aria-hidden="true">&nearr;</span></a>
 </aside>
</main>

<style>
 .rj-services-page { color: #292724; background: #fff; }
 .services-intro { padding: 60px 24px 52px; text-align: center; background: #f7f4ee; }
 .eyebrow { margin: 0 0 18px; font-size: 11px; letter-spacing: .13em; text-transform: uppercase; color: #8b6b29; }
 h1 { margin: 0; font: 400 clamp(38px,4vw,52px)/1.15 var(--font-heading,serif); letter-spacing: -.02em; }
 .services-intro > p:not(.eyebrow) { max-width: 480px; margin: 20px auto 24px; font-size: 15px; line-height: 1.7; color: #6b665f; }
 a { display: inline-flex; align-items: center; gap: 24px; color: inherit; border-bottom: 1px solid #b29757; padding-bottom: 7px; text-decoration: none; font-size: 13px; }
 a:hover { color: #8b6b29; }
 a:focus-visible { outline: 2px solid #aa873a; outline-offset: 5px; }
 .services-list { max-width: 1000px; margin: 0 auto; padding: 20px 36px; }
 .service-detail { display: grid; grid-template-columns: 250px 1fr; gap: 48px; align-items: center; padding: 36px 0; border-bottom: 1px solid #e9e4dc; scroll-margin-top: 130px; }
 .service-detail:last-child { border-bottom: 0; }
 .service-detail img { display: block; width: 250px; height: 220px; object-fit: cover; }
 h2 { margin: 0; font: 400 30px/1.2 var(--font-heading,serif); letter-spacing: -.02em; }
 .service-detail p { margin: 18px 0 22px; max-width: 550px; color: #6b665f; font-size: 14px; line-height: 1.8; }
 .services-visit { padding: 42px 24px; margin: 20px auto 0; text-align: center; background: #f7f4ee; }
 .services-visit p { margin: 16px 0 22px; font-size: 14px; line-height: 1.6; color: #6b665f; }
 @media(max-width:639px) { .services-intro { padding: 38px 22px; } .services-list { padding: 10px 22px; } .service-detail { grid-template-columns: 1fr; gap: 24px; padding: 30px 0; } .service-detail img { width: 100%; height: auto; aspect-ratio: 1.5; } h2 { font-size: 27px; } }
</style>
