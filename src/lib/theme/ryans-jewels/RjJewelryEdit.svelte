<script lang="ts">
	const collections = [
		{ name: 'Diamond Studs', image: '/ryans-jewels/home/essentials/studs-transparent-v1.webp', alternate: '/ryans-jewels/home/essentials/studs-angle-v1.webp', href: '/products?categories=studs%2Cwomen-studs' },
		{ name: 'Solitaire Rings', image: '/ryans-jewels/home/essentials/solitaire-transparent-v1.webp', alternate: '/ryans-jewels/home/essentials/solitaire-angle-v1.webp', href: '/products?categories=engagement-shop-by-style-solitaire-rings' },
		{ name: 'Halo Rings', image: '/ryans-jewels/home/essentials/halo-transparent-v1.webp', alternate: '/ryans-jewels/home/essentials/halo-angle-v1.webp', href: '/products?categories=engagement-shop-by-style-halo' },
		{ name: 'Fancy Rings', image: '/ryans-jewels/home/essentials/cluster-transparent-v1.webp', alternate: '/ryans-jewels/home/essentials/cluster-angle-v1.webp', href: '/products?categories=fancy-rings' },
		{ name: 'Diamond Pendants', image: '/ryans-jewels/home/essentials/pendant-transparent-v1.webp', alternate: '/ryans-jewels/home/essentials/pendant-angle-v1.webp', href: '/products?categories=pendants' }
	]
	let alternateReady = $state<Record<string, boolean>>({})
</script>

<section class="rj-edit" aria-labelledby="rj-edit-heading">
	<div class="rj-edit-head"><div><p>Everyday Brilliance</p><h2 id="rj-edit-heading">Discover Your Diamond Essentials</h2></div><a href="/products">View all jewelry <span aria-hidden="true">→</span></a></div>
	<div class="rj-edit-grid">
		{#each collections as collection}
			<a class="rj-edit-card" href={collection.href}>
				<div class="rj-edit-media" class:has-alternate={alternateReady[collection.name]}>
					<div class="rj-edit-object">
						<img class="rj-edit-front" src={collection.image} alt={collection.name} width="640" height="640" loading="lazy" decoding="async" />
						<img class="rj-edit-alternate" src={collection.alternate} alt="" width="640" height="640" loading="lazy" decoding="async" onload={() => alternateReady[collection.name] = true} onerror={() => alternateReady[collection.name] = false} />
					</div>
				</div>
				<h3>{collection.name}</h3><span>Explore collection →</span>
			</a>
		{/each}
	</div>
</section>

<style>
	.rj-edit { padding: 38px 61px; background: #fff; color: #404040; }
	.rj-edit-head { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 25px; }
	.rj-edit-head p { margin: 0 0 6px; font: 26px 'Inria Serif', serif; }
	h2 { margin: 0; font: 20px 'Afacad', sans-serif; }
	.rj-edit-head > a { font: 17px 'Afacad', sans-serif; color: var(--rj-gold, #a18148); }
	.rj-edit-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 24px; }
	.rj-edit-card { color: inherit; text-decoration: none; }
	.rj-edit-media { position: relative; aspect-ratio: 1; perspective: 900px; background: var(--rj-cream, #faf6ea); background-image: radial-gradient(ellipse at 50% 35%, #ffffff8f, transparent 70%); border-radius: 5px; overflow: hidden; }
	.rj-edit-object { position: absolute; inset: 0; transform-style: preserve-3d; transition: transform 700ms cubic-bezier(.2, .7, .25, 1); }
	.rj-edit-card img { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 8px 5px #705b3512); transition: opacity 450ms ease, transform 700ms cubic-bezier(.2, .7, .25, 1), filter 700ms ease; }
	.rj-edit-front { opacity: 1; transform: translateZ(12px); }
	.rj-edit-alternate { opacity: 0; transform: translate3d(5px, 4px, 12px) rotateY(10deg) scale(.97); }
	.rj-edit-card:focus-visible .rj-edit-object { transform: translateY(-7px) rotateX(3deg) rotateY(-5deg) scale(1.04); }
	.rj-edit-card:focus-visible .has-alternate .rj-edit-front { opacity: 0; transform: translate3d(-5px, 0, 0) rotateY(-10deg) scale(.97); }
	.rj-edit-card:focus-visible .has-alternate .rj-edit-alternate { opacity: 1; transform: translateZ(20px); }
	@media (hover: hover) and (pointer: fine) {
		.rj-edit-card:hover .rj-edit-object { transform: translateY(-7px) rotateX(3deg) rotateY(-5deg) scale(1.04); }
		.rj-edit-card:hover .has-alternate .rj-edit-front { opacity: 0; transform: translate3d(-5px, 0, 0) rotateY(-10deg) scale(.97); }
		.rj-edit-card:hover .has-alternate .rj-edit-alternate { opacity: 1; transform: translateZ(20px); }
		.rj-edit-card:hover img { filter: drop-shadow(0 14px 8px #705b3524); }
	}
	h3 { margin: 14px 0 5px; font: 700 21px 'Inria Serif', serif; }
	.rj-edit-card > span { font: 16px 'Afacad', sans-serif; color: #757575; }
	.rj-edit-card:hover h3 { color: var(--rj-gold, #a18148); }
	a:focus-visible { outline: 2px solid #a18148; outline-offset: 5px; }
	@media (max-width: 1100px) { .rj-edit { padding-inline: 25px; } .rj-edit-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; } }
	@media (max-width: 639px) { .rj-edit { padding: 25px 15px; } .rj-edit-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 14px; } .rj-edit-head { align-items: flex-start; } .rj-edit-head p { font-size: 22px; } h2 { font-size: 16px; } h3 { font-size: 18px; } .rj-edit-head > a { font-size: 14px; } .rj-edit-card > span { font-size: 14px; } }
	@media (prefers-reduced-motion: reduce) {
		.rj-edit-object, .rj-edit-card img { transition: none; }
		.rj-edit-card .rj-edit-object, .rj-edit-card .rj-edit-object img { transform: none !important; }
	}
</style>
