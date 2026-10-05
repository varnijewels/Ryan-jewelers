<script lang="ts">
	const collections = [
		{ name: 'Diamond Studs', image: 'studs', href: '/products?categories=studs%2Cwomen-studs' },
		{ name: 'Solitaire Rings', image: 'solitaire-simple-v2', href: '/products?categories=engagement-shop-by-style-solitaire-rings' },
		{ name: 'Halo Rings', image: 'halo', href: '/products?categories=engagement-shop-by-style-halo' },
		{ name: 'Fancy Rings', image: 'cluster', href: '/products?categories=fancy-rings' }
	]
</script>

<section class="rj-edit" aria-labelledby="rj-edit-heading">
	<div class="rj-edit-head"><div><p>Everyday Brilliance</p><h2 id="rj-edit-heading">Discover Your Diamond Essentials</h2></div><a href="/products">View all jewelry <span aria-hidden="true">→</span></a></div>
	<div class="rj-edit-grid">{#each collections as collection}<a class="rj-edit-card" href={collection.href}><div class="rj-edit-media" class:is-product={collection.image === 'solitaire-product'}><img src="/ryans-jewels/home/minimal/{collection.image}.webp" alt="{collection.name} in white gold" width="640" height="640" loading="lazy" decoding="async" /></div><h3>{collection.name}</h3><span>Explore collection →</span></a>{/each}</div>
</section>

<style>
	.rj-edit { padding: 38px 61px; background: #fff; color: #404040; }
	.rj-edit-head { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 25px; }
	.rj-edit-head p { margin: 0 0 6px; font: 26px 'Inria Serif', serif; }
	h2 { margin: 0; font: 20px 'Afacad', sans-serif; }
	.rj-edit-head > a { font: 17px 'Afacad', sans-serif; color: var(--rj-gold, #a18148); }
	.rj-edit-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
	.rj-edit-card { color: inherit; text-decoration: none; }
	.rj-edit-card img { width: 100%; height: auto; aspect-ratio: 1; object-fit: cover; border-radius: 5px; }
	h3 { margin: 14px 0 5px; font: 21px 'Inria Serif', serif; }
	.rj-edit-card > span { font: 16px 'Afacad', sans-serif; color: #757575; }
	.rj-edit-card:hover h3 { color: var(--rj-gold, #a18148); }
	a:focus-visible { outline: 2px solid #a18148; outline-offset: 5px; }
	@media (max-width: 1100px) { .rj-edit { padding-inline: 25px; } .rj-edit-grid { gap: 16px; } }
	@media (max-width: 639px) { .rj-edit { padding: 25px 15px; } .rj-edit-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 14px; } .rj-edit-head { align-items: flex-start; } .rj-edit-head p { font-size: 22px; } h2 { font-size: 16px; } h3 { font-size: 18px; } .rj-edit-head > a { font-size: 14px; } .rj-edit-card > span { font-size: 14px; } }
.rj-edit-media { aspect-ratio: 1; display: grid; place-items: center; background: #edeef0; border-radius: 5px; overflow: hidden; } .rj-edit-media.is-product img { width: 72%; mix-blend-mode: multiply; } </style>
