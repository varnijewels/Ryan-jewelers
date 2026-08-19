<script lang="ts">
	const female = ['Wedding Rings', 'Earrings', 'Pendants', 'Necklaces', 'Bracelet']
	const metals = [
		['White Gold', 'white'],
		['Yellow Gold', 'yellow'],
		['Rose Gold', 'rose'],
		['Yellow gold & White Gold', 'yellow-white'],
		['Rose gold & White Gold', 'rose-white']
	]
	const description = 'These dazzling Kundan earrings from Tarinika give your outfit a captivating charm. Handcrafted with'
</script>

<div class="rj-all-mega" id="rj-all-jewellery-menu" aria-label="All Jewellery menu">
	<section class="rj-all-types" aria-label="Jewellery types">
		<div class="rj-type rj-type--diamond">
			<h2><img src="/ryans-jewels/mega-menu/all-category.svg" alt="" /><span>Diamond Jewellery</span></h2>
			<div class="rj-arrow-list">
				<a href="/categories/rings"><span>Diamond Ring’s</span><img src="/ryans-jewels/mega-menu/all-arrow.svg" alt="" /></a>
				<a href="/categories/bracelets"><span>Diamond Bracelet</span><img src="/ryans-jewels/mega-menu/all-arrow.svg" alt="" /></a>
			</div>
		</div>

		<div class="rj-type rj-type--silver">
			<h2><img src="/ryans-jewels/mega-menu/all-category.svg" alt="" /><span>Sterling Silver</span></h2>
			<div class="rj-arrow-list">
				<a href="/categories/bracelets"><span>Diamond Bracelet</span><img src="/ryans-jewels/mega-menu/all-arrow.svg" alt="" /></a>
			</div>
		</div>

		<div class="rj-type rj-type--kids">
			<h2><img src="/ryans-jewels/mega-menu/all-category.svg" alt="" /><span>Kid’s Jewellery</span></h2>
			<a class="rj-single-link" href="/categories/kids-jewellery">Round Diamond</a>
		</div>
	</section>

	<section class="rj-all-metals" aria-labelledby="rj-all-metals-title">
		<div class="rj-metals-inner">
			<h2 class="rj-all-heading" id="rj-all-metals-title">
				<img class="rj-discount-icon" src="/ryans-jewels/mega-menu/all-discount.svg" alt="" />
				<span>By Metals &amp; Stamps</span>
			</h2>
			<div class="rj-metal-list">
				{#each metals as metal}
					<div class="rj-metal">
						<div class="rj-metal-name"><span class="rj-swatch rj-swatch--{metal[1]}"></span><span>{metal[0]}</span></div>
						<div class="rj-stamps">
							<a href="/products?metal={metal[1]}&stamp=9k">9K</a>
							<a href="/products?metal={metal[1]}&stamp=14k">14k</a>
							<a href="/products?metal={metal[1]}&stamp=16k">16k</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="rj-all-audience" aria-label="Jewellery by audience">
		<div class="rj-audience rj-audience--female">
			<h2><img src="/ryans-jewels/mega-menu/all-categories.png" alt="" /><span>Female Jewellery</span></h2>
			<div class="rj-arrow-list">
				{#each female as item}
					<a href="/products?category={item.toLowerCase().replace(' ', '-')}"><span>{item}</span><img src="/ryans-jewels/mega-menu/all-arrow.svg" alt="" /></a>
				{/each}
			</div>
		</div>

		<div class="rj-audience rj-audience--male">
			<h2><img src="/ryans-jewels/mega-menu/all-categories.png" alt="" /><span>Male Jewellery</span></h2>
			<div class="rj-arrow-list">
				<a href="/categories/rings"><span>Wedding Rings</span><img src="/ryans-jewels/mega-menu/all-arrow.svg" alt="" /></a>
			</div>
		</div>
	</section>

	<section class="rj-all-collections" aria-labelledby="rj-all-collections-title">
		<div class="rj-all-collections-inner">
			<div class="rj-all-collections-head">
				<h2 id="rj-all-collections-title">Brows By Collection</h2>
				<a href="/collections"><span>View More</span><span class="rj-more-arrows"><img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" /><img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" /></span></a>
			</div>

			<a class="rj-all-card" href="/categories/rings">
				<img src="/ryans-jewels/mega-menu/all-collection-1.png" alt="Silver Diamond Rings" />
				<span><strong>Silver Diamond Rings</strong><small>{description}</small></span>
			</a>
			<a class="rj-all-card" href="/categories/rings">
				<img src="/ryans-jewels/mega-menu/all-collection-2.png" alt="Silver Diamond Rings" />
				<span><strong>Silver Diamond Rings</strong><small>{description}</small></span>
			</a>
		</div>

		<div class="rj-all-jewel" aria-hidden="true">
			<img class="rj-all-ring-main" src="/ryans-jewels/mega-menu/all-ring-main.png" alt="" />
			<img class="rj-all-ring-reflection" src="/ryans-jewels/mega-menu/all-ring-main.png" alt="" />
			<img class="rj-all-ring-side" src="/ryans-jewels/mega-menu/all-ring-side.png" alt="" />
			<img class="rj-all-ring-side-reflection" src="/ryans-jewels/mega-menu/all-ring-side.png" alt="" />
		</div>
	</section>
</div>

<style>
	.rj-all-mega {
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

	.rj-all-types,
	.rj-all-metals,
	.rj-all-audience,
	.rj-all-collections {
		position: relative;
		min-width: 0;
		height: 440px;
	}

	.rj-all-types { grid-column: 2; }
	.rj-all-metals { grid-column: 4; background: #fafafa; }
	.rj-all-audience { grid-column: 6; }
	.rj-all-collections { grid-column: 8; border-left: 1.5px solid #f1f1f1; background: #fdfdfd; }

	.rj-type,
	.rj-audience { position: absolute; left: 0; }
	.rj-type--diamond { top: 22px; width: 182px; }
	.rj-type--silver { top: 158px; width: 182px; }
	.rj-type--kids { top: 288px; width: 154px; }
	.rj-audience--female { top: 22px; width: 177px; }
	.rj-audience--male { top: 246px; width: 177px; }

	.rj-type h2,
	.rj-audience h2,
	.rj-all-heading {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		height: 39px;
		margin: 0;
		padding: 10px 20px 10px 0;
		border-bottom: 1px dashed #bcbcbc;
		font-family: 'Lato', sans-serif;
		font-size: 17px;
		font-weight: 500;
		line-height: normal;
		color: #202020;
		white-space: nowrap;
	}

	.rj-type h2 img { width: 20px; height: 19.707px; flex-shrink: 0; }
	.rj-audience h2 img { width: 26px; height: 31px; margin-top: -5px; margin-bottom: -6px; flex-shrink: 0; }

	.rj-arrow-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 20px;
	}

	.rj-arrow-list a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 21px;
		font-family: 'Sarala', sans-serif;
		font-size: 14px;
		line-height: 21px;
		color: #404040;
		text-decoration: none;
		white-space: nowrap;
	}

	.rj-arrow-list img { width: 11px; height: 11px; flex-shrink: 0; }
	.rj-single-link {
		display: block;
		margin-top: 20px;
		font-family: 'Sarala', sans-serif;
		font-size: 14px;
		line-height: 21px;
		color: #404040;
		text-decoration: none;
		white-space: nowrap;
	}

	.rj-metals-inner { width: calc(100% - 70px); margin: 22px 35px 0; }
	.rj-all-heading { padding-right: 20px; }
	.rj-all-heading .rj-discount-icon { width: 24px; height: 24px; flex-shrink: 0; }
	.rj-metal-list { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; }
	.rj-metal { display: flex; flex-direction: column; gap: 6px; }
	.rj-metal:nth-child(n + 3) { gap: 8px; }
	.rj-metal-name { display: flex; align-items: center; gap: 8px; font-family: 'Sarala', sans-serif; font-size: 14px; line-height: 21px; color: #404040; white-space: nowrap; }
	.rj-swatch { width: 17px; height: 17px; border-radius: 50%; flex-shrink: 0; }
	.rj-swatch--white { background: linear-gradient(220.6deg, #e8e8e8 28.66%, #fff 38.95%, #efefef 48.86%, #e8e8e8 70.84%); }
	.rj-swatch--yellow { background: linear-gradient(220.6deg, #ffc200 28.66%, #ffe48f 38.95%, #ffc200 49.42%, #ffc200 70.84%); }
	.rj-swatch--rose { background: linear-gradient(218.66deg, rgba(255, 102, 102, 0.5) 27.78%, #ffeaea 38.54%, #ffb9b9 48.89%, #ff9090 71.86%); }
	.rj-swatch--yellow-white { background: linear-gradient(40deg, #ffc200 28.66%, #ffefbe 42.86%, rgba(239, 239, 239, 0.46) 54.42%, rgba(255, 194, 0, 0.46) 69.83%); }
	.rj-swatch--rose-white { background: linear-gradient(220.6deg, rgba(255, 102, 102, 0.5) 27.78%, #fff 40%, #efefef 51%, #ff9090 72%); }
	.rj-stamps { display: flex; gap: 6px; }
	.rj-stamps a { display: flex; align-items: center; justify-content: center; width: 42px; height: 24px; border: 0.8px solid #ededed; border-radius: 2px; background: #fafafa; font-family: 'Sarala', sans-serif; font-size: 13px; line-height: 19px; color: #505050; text-decoration: none; }

	.rj-all-collections-inner { position: relative; z-index: 2; margin: 22px 30px 0; }
	.rj-all-collections-head { display: flex; align-items: center; justify-content: space-between; height: 40px; padding: 10px 10px 10px 0; border-bottom: 1px dashed #bcbcbc; font-family: 'Lato', sans-serif; }
	.rj-all-collections-head h2 { margin: 0; font-family: 'Lato', sans-serif; font-size: 16px; font-weight: 500; line-height: normal; letter-spacing: normal; color: #202020; white-space: nowrap; }
	.rj-all-collections-head > a { display: flex; align-items: center; gap: 5px; font-family: 'Lato', sans-serif; font-size: 16px; font-weight: 500; letter-spacing: normal; color: #4699ff; text-decoration: none; white-space: nowrap; }
	.rj-more-arrows { position: relative; display: block; width: 17px; height: 11px; }
	.rj-more-arrows img { position: absolute; top: 0; width: 11px; height: 11px; }
	.rj-more-arrows img:first-child { left: 0; }
	.rj-more-arrows img:last-child { left: 6px; }

	.rj-all-card { display: flex; align-items: flex-start; gap: 12px; width: 100%; height: 89px; margin-top: 16px; padding: 5px; border-radius: 8px; background: #f7f7f7; color: inherit; text-decoration: none; }
	.rj-all-card + .rj-all-card { margin-top: 12px; }
	.rj-all-card > img { width: 79px; height: 79px; border-radius: 5px; object-fit: cover; flex-shrink: 0; }
	.rj-all-card > span { display: flex; flex: 1; flex-direction: column; gap: 2px; min-width: 0; }
	.rj-all-card strong { font-family: 'Sarala', sans-serif; font-size: 14px; font-weight: 400; line-height: 21px; color: #303030; }
	.rj-all-card small { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-family: 'Lato', sans-serif; font-size: 11px; line-height: 13px; color: #707070; }

	.rj-all-jewel img { position: absolute; object-fit: contain; pointer-events: none; }
	.rj-all-ring-main { right: 0; top: 274px; width: 182.369px; height: 182.369px; transform: rotate(-90deg); }
	.rj-all-ring-reflection { right: 58.51px; top: 340.49px; width: 182.369px; height: 182.369px; opacity: 0.4; transform: rotate(180deg); }
	.rj-all-ring-side { right: -13px; top: 288px; width: 157px; height: 157px; }
	.rj-all-ring-side-reflection { right: -31px; top: 360px; width: 157px; height: 157px; opacity: 0.4; transform: rotate(-15deg); }

	.rj-arrow-list a:hover,
	.rj-single-link:hover,
	.rj-stamps a:hover { color: var(--rj-gold, #cca646); }

	@media (max-width: 1279px) {
		.rj-all-mega { left: 40px; right: 40px; }
	}

	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-all-mega { display: none; }
	}
</style>
