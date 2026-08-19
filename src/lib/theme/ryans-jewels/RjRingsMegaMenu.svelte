<script lang="ts">
	let {
		variant = 'rings',
		menuId = 'rj-rings-menu',
		ariaLabel = 'Rings menu',
		popularTitle = 'Popular Ring Types',
		types = ['All Rings', 'Casual Rings', 'Diamond Rings', 'Mens Rings', 'Couple Rings', 'Gold Rings', 'Couple Rings'],
		baseHref = '/categories/rings',
		viewAllLabel = 'View All Rings',
		cardTitle = 'Silver Diamond Rings',
		collectionImages = ['/ryans-jewels/mega-menu/all-collection-1.png', '/ryans-jewels/mega-menu/ring-collection-2.png']
	}: {
		variant?: 'rings' | 'earrings'
		menuId?: string
		ariaLabel?: string
		popularTitle?: string
		types?: string[]
		baseHref?: string
		viewAllLabel?: string
		cardTitle?: string
		collectionImages?: string[]
	} = $props()

	const prices = ['Below $1000', 'Between $1000 -$5000', 'Between $5000 -$10,000', '$10,000 and above']
	const metals = [
		['White Gold', 'white'],
		['Yellow Gold', 'yellow'],
		['Rose Gold', 'rose'],
		['Yellow gold & White Gold', 'yellow-white'],
		['Rose gold & White Gold', 'rose-white']
	]
	const description = 'These dazzling Kundan earrings from Tarinika give your outfit a captivating charm. Handcrafted with'
</script>

<div class="rj-rings-mega" id={menuId} aria-label={ariaLabel}>
	<section class="rj-rings-popular" aria-label={popularTitle}>
		<div class="rj-rings-popular-inner" class:is-earrings={variant === 'earrings'}>
			<h2 class="rj-rings-heading">
				{#if variant === 'earrings'}
					<span class="rj-earring-heading-icon"><img src="/ryans-jewels/mega-menu/earring-icon-1.svg" alt="" /><img src="/ryans-jewels/mega-menu/earring-icon-2.svg" alt="" /></span>
				{:else}
					<img class="rj-rings-category-icon" src="/ryans-jewels/mega-menu/all-categories.png" alt="" />
				{/if}
				<span>{popularTitle}</span>
			</h2>
			<div class="rj-rings-arrow-list">
				{#each types as item}
					<a href="{baseHref}?type={item.toLowerCase().replaceAll(' ', '-')}"><span>{item}</span><img src="/ryans-jewels/mega-menu/all-arrow.svg" alt="" /></a>
				{/each}
			</div>
		</div>
		<a class="rj-rings-view-all" class:is-earrings={variant === 'earrings'} href={baseHref}>
			<span>{viewAllLabel}</span>
			<span class="rj-rings-double-arrow"><img src="/ryans-jewels/mega-menu/arrow-19.svg" alt="" /><img src="/ryans-jewels/mega-menu/arrow-19.svg" alt="" /></span>
		</a>
	</section>

	<section class="rj-rings-metals" aria-labelledby="rj-rings-metals-title">
		<div class="rj-rings-metals-inner">
			<h2 class="rj-rings-heading" id="rj-rings-metals-title">
				<img class="rj-rings-discount-icon" src="/ryans-jewels/mega-menu/all-discount.svg" alt="" />
				<span>By Metals &amp; Stamps</span>
			</h2>
			<div class="rj-rings-metal-list">
				{#each metals as metal}
					<div class="rj-rings-metal">
						<div class="rj-rings-metal-name"><span class="rj-rings-swatch rj-rings-swatch--{metal[1]}"></span><span>{metal[0]}</span></div>
						<div class="rj-rings-stamps">
							<a href="{baseHref}?metal={metal[1]}&stamp=9k">9K</a>
							<a href="{baseHref}?metal={metal[1]}&stamp=14k">14k</a>
							<a href="{baseHref}?metal={metal[1]}&stamp=16k">16k</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="rj-rings-price" aria-labelledby="rj-rings-price-title">
		<h2 class="rj-rings-heading" id="rj-rings-price-title">
			<img class="rj-rings-wallet-icon" src="/ryans-jewels/mega-menu/wallet.svg" alt="" />
			<span>By Price Range</span>
		</h2>
		<div class="rj-rings-price-list">
			{#each prices as price}
				<a href={baseHref}>{price}</a>
			{/each}
		</div>
	</section>

	<section class="rj-rings-collections" aria-labelledby="rj-rings-collections-title">
		<div class="rj-rings-collections-inner">
			<div class="rj-rings-collections-head">
				<h2 id="rj-rings-collections-title">Brows By Collection</h2>
				<a href="/collections"><span>View More</span><span class="rj-rings-more-arrows"><img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" /><img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" /></span></a>
			</div>

			<a class="rj-rings-card" href={baseHref}>
				<img src={collectionImages[0]} alt={cardTitle} />
				<span><strong>{cardTitle}</strong><small>{description}</small></span>
			</a>
			<a class="rj-rings-card" href={baseHref}>
				<img src={collectionImages[1]} alt={cardTitle} />
				<span><strong>{cardTitle}</strong><small>{description}</small></span>
			</a>
		</div>

		{#if variant === 'earrings'}
			<div class="rj-earring-art" aria-hidden="true">
				<div class="rj-earring-piece rj-earring-piece--main"><div><img src="/ryans-jewels/mega-menu/earring-art.webp" alt="" /></div></div>
				<div class="rj-earring-piece rj-earring-piece--reflection"><div><img src="/ryans-jewels/mega-menu/earring-art.webp" alt="" /></div></div>
				<div class="rj-earring-piece rj-earring-piece--small"><div><img src="/ryans-jewels/mega-menu/earring-art.webp" alt="" /></div></div>
				<div class="rj-earring-piece rj-earring-piece--small-reflection"><div><img src="/ryans-jewels/mega-menu/earring-art.webp" alt="" /></div></div>
			</div>
		{:else}
			<div class="rj-rings-jewel" aria-hidden="true">
				<img class="rj-rings-ring-main" src="/ryans-jewels/mega-menu/ring-main.webp" alt="" />
				<img class="rj-rings-ring-reflection" src="/ryans-jewels/mega-menu/ring-main.webp" alt="" />
				<img class="rj-rings-ring-side" src="/ryans-jewels/mega-menu/ring-side.webp" alt="" />
				<img class="rj-rings-ring-side-reflection" src="/ryans-jewels/mega-menu/ring-side.webp" alt="" />
			</div>
		{/if}
	</section>
</div>

<style>
	.rj-rings-mega {
		position: absolute;
		top: 100%;
		left: 60px;
		right: 60px;
		display: grid;
		grid-template-columns: 4.545% 19.167% 3.409% 20.455% 3.03% 13.712% 3.03% 32.652%;
		height: 440px;
		overflow: hidden;
		border-radius: 4px;
		background: #fff;
		box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
		visibility: hidden;
		opacity: 0;
		pointer-events: none;
		transform: translateY(8px);
		transition: opacity 0.16s ease, transform 0.16s ease, visibility 0.16s;
		z-index: 100;
	}

	.rj-rings-popular,
	.rj-rings-metals,
	.rj-rings-price,
	.rj-rings-collections { position: relative; min-width: 0; height: 440px; }
	.rj-rings-popular { grid-column: 2; }
	.rj-rings-metals { grid-column: 4; background: #fafafa; }
	.rj-rings-price { grid-column: 6; padding-top: 22px; }
	.rj-rings-collections { grid-column: 8; border-left: 1.5px solid #f1f1f1; background: #fdfdfd; }

	.rj-rings-popular-inner { width: 75.1%; margin-top: 22px; }
	.rj-rings-popular-inner.is-earrings { width: 86.6%; }
	.rj-rings-metals-inner { margin: 22px 40px 0 35px; }
	.rj-rings-heading { display: flex; align-items: center; gap: 10px; width: 100%; height: 39px; margin: 0; padding: 10px 20px 10px 0; border-bottom: 1px dashed #bcbcbc; font-family: 'Lato', sans-serif; font-size: 17px; font-weight: 500; line-height: normal; letter-spacing: normal; color: #202020; white-space: nowrap; }
	.rj-rings-category-icon { width: 26px; height: 31px; margin-top: -5px; margin-bottom: -6px; flex-shrink: 0; }
	.rj-earring-heading-icon { position: relative; display: block; width: 42.6px; height: 13px; flex-shrink: 0; }
	.rj-earring-heading-icon img { position: absolute; top: 0; object-fit: contain; }
	.rj-earring-heading-icon img:first-child { left: 0; width: 12.344px; height: 12.341px; }
	.rj-earring-heading-icon img:last-child { left: 16.59px; width: 26.001px; height: 13px; }
	.rj-rings-discount-icon { width: 24px; height: 24px; flex-shrink: 0; }
	.rj-rings-wallet-icon { width: 19px; height: 19px; flex-shrink: 0; }

	.rj-rings-arrow-list { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; padding-right: 10px; }
	.rj-rings-arrow-list a { display: flex; align-items: center; justify-content: space-between; width: 100%; height: 21px; font-family: 'Sarala', sans-serif; font-size: 14px; line-height: 21px; color: #404040; text-decoration: none; white-space: nowrap; }
	.rj-rings-arrow-list img { width: 11px; height: 11px; flex-shrink: 0; }

	.rj-rings-view-all { position: absolute; left: 0; top: 376px; display: flex; align-items: center; justify-content: space-between; width: 228px; height: 39px; padding: 8px 51px; border: 1px solid #555; border-radius: 3px; font-family: 'Sarala', sans-serif; font-size: 14px; line-height: 23px; color: #303030; text-decoration: none; white-space: nowrap; }
	.rj-rings-view-all.is-earrings { padding-right: 45px; padding-left: 45px; }
	.rj-rings-double-arrow { position: relative; display: block; width: 29px; height: 19px; flex-shrink: 0; }
	.rj-rings-double-arrow img { position: absolute; top: 0; width: 19px; height: 19px; }
	.rj-rings-double-arrow img:first-child { left: 0; }
	.rj-rings-double-arrow img:last-child { left: 10px; }

	.rj-rings-metal-list { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; padding-right: 20px; }
	.rj-rings-metal { display: flex; flex-direction: column; gap: 6px; }
	.rj-rings-metal:nth-child(n + 3) { gap: 8px; }
	.rj-rings-metal-name { display: flex; align-items: center; gap: 8px; font-family: 'Sarala', sans-serif; font-size: 14px; line-height: 21px; color: #404040; white-space: nowrap; }
	.rj-rings-swatch { width: 17px; height: 17px; border-radius: 50%; flex-shrink: 0; }
	.rj-rings-swatch--white { background: linear-gradient(220.6deg, #e8e8e8 28.66%, #fff 38.95%, #efefef 48.86%, #e8e8e8 70.84%); }
	.rj-rings-swatch--yellow { background: linear-gradient(220.6deg, #ffc200 28.66%, #ffe48f 38.95%, #ffc200 49.42%, #ffc200 70.84%); }
	.rj-rings-swatch--rose { background: linear-gradient(218.66deg, rgba(255, 102, 102, 0.5) 27.78%, #ffeaea 38.54%, #ffb9b9 48.89%, #ff9090 71.86%); }
	.rj-rings-swatch--yellow-white { background: linear-gradient(40deg, #ffc200 28.66%, #ffefbe 42.86%, rgba(239, 239, 239, 0.46) 54.42%, rgba(255, 194, 0, 0.46) 69.83%); }
	.rj-rings-swatch--rose-white { background: linear-gradient(220.6deg, rgba(255, 102, 102, 0.5) 27.78%, #fff 40%, #efefef 51%, #ff9090 72%); }
	.rj-rings-stamps { display: flex; gap: 6px; }
	.rj-rings-stamps a { display: flex; align-items: center; justify-content: center; width: 42px; height: 24px; border: 0.8px solid #ededed; border-radius: 2px; background: #fafafa; font-family: 'Sarala', sans-serif; font-size: 13px; line-height: 19px; color: #505050; text-decoration: none; }

	.rj-rings-price-list { display: flex; flex-direction: column; gap: 12px; width: 100%; margin-top: 20px; }
	.rj-rings-price-list a { font-family: 'Sarala', sans-serif; font-size: 14px; line-height: 21px; color: #404040; text-decoration: none; white-space: nowrap; }

	.rj-rings-collections-inner { position: relative; z-index: 2; margin: 25px 30px 0; }
	.rj-rings-collections-head { display: flex; align-items: center; justify-content: space-between; height: 39px; padding: 10px 10px 10px 0; border-bottom: 1px dashed #bcbcbc; }
	.rj-rings-collections-head h2 { margin: 0; font-family: 'Lato', sans-serif; font-size: 16px; font-weight: 500; line-height: normal; letter-spacing: normal; color: #202020; white-space: nowrap; }
	.rj-rings-collections-head > a { display: flex; align-items: center; gap: 5px; font-family: 'Lato', sans-serif; font-size: 16px; font-weight: 500; letter-spacing: normal; color: #4699ff; text-decoration: none; white-space: nowrap; }
	.rj-rings-more-arrows { position: relative; display: block; width: 17px; height: 11px; }
	.rj-rings-more-arrows img { position: absolute; top: 0; width: 11px; height: 11px; }
	.rj-rings-more-arrows img:first-child { left: 0; }
	.rj-rings-more-arrows img:last-child { left: 6px; }

	.rj-rings-card { display: flex; align-items: flex-start; gap: 12px; width: 100%; height: 89px; margin-top: 20px; padding: 5px; border-radius: 8px; background: #f7f7f7; color: inherit; text-decoration: none; }
	.rj-rings-card + .rj-rings-card { margin-top: 12px; }
	.rj-rings-card > img { width: 79px; height: 79px; border-radius: 5px; object-fit: cover; flex-shrink: 0; }
	.rj-rings-card > span { display: flex; flex: 1; flex-direction: column; gap: 2px; min-width: 0; }
	.rj-rings-card strong { font-family: 'Sarala', sans-serif; font-size: 14px; font-weight: 400; line-height: 21px; color: #303030; }
	.rj-rings-card small { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-family: 'Lato', sans-serif; font-size: 11px; line-height: 13px; color: #707070; }

	.rj-rings-jewel img { position: absolute; object-fit: contain; pointer-events: none; }
	.rj-rings-ring-main { right: 0; top: 274px; width: 182.369px; height: 182.369px; transform: rotate(-90deg); }
	.rj-rings-ring-reflection { right: 58.51px; top: 340.49px; width: 182.369px; height: 182.369px; opacity: 0.4; transform: rotate(180deg); }
	.rj-rings-ring-side { right: -13px; top: 288px; width: 157px; height: 157px; }
	.rj-rings-ring-side-reflection { right: -31px; top: 360px; width: 157px; height: 157px; opacity: 0.4; transform: rotate(-15deg); }

	.rj-earring-piece { position: absolute; display: flex; align-items: center; justify-content: center; pointer-events: none; }
	.rj-earring-piece > div { position: relative; overflow: hidden; }
	.rj-earring-piece img { position: absolute; left: -163.95%; top: -195.31%; width: 336.91%; height: 360.63%; max-width: none; pointer-events: none; }
	.rj-earring-piece--main { right: 17.094px; top: 302px; width: 139.416px; height: 135.324px; }
	.rj-earring-piece--main > div { width: 109.65px; height: 102.438px; transform: rotate(21.35deg); }
	.rj-earring-piece--reflection { right: 17.006px; top: 377px; width: 149.994px; height: 149.938px; }
	.rj-earring-piece--reflection > div { width: 109.65px; height: 102.438px; opacity: 0.4; transform: rotate(-44.69deg); }
	.rj-earring-piece--small { right: 116.499px; top: 339px; width: 95.501px; height: 92.698px; }
	.rj-earring-piece--small > div { width: 75.111px; height: 70.17px; transform: rotate(158.65deg) scaleY(-1); }
	.rj-earring-piece--small-reflection { right: 119.773px; top: 400.17px; width: 56.877px; height: 57.075px; }
	.rj-earring-piece--small-reflection > div { width: 41.713px; height: 38.969px; opacity: 0.2; transform: rotate(132.08deg) scaleY(-1); }

	.rj-rings-arrow-list a:hover,
	.rj-rings-price-list a:hover,
	.rj-rings-stamps a:hover { color: var(--rj-gold, #cca646); }

	@media (max-width: 1279px) {
		.rj-rings-mega { left: 40px; right: 40px; }
	}

	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-rings-mega { display: none; }
	}
</style>
