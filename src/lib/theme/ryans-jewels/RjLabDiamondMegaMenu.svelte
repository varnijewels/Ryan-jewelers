<script lang="ts">
	const popular = [
		['Round Diamond', 'round'],
		['Asscher Diamond', 'asscher'],
		['Trilliant Diamond', 'trilliant'],
		['Heart Diamond', 'heart'],
		['Princess Diamond', 'princess'],
		['Radiant Diamond', 'radiant'],
		['Pear Diamond', 'pear'],
		['Marquise Diamond', 'marquise'],
		['Cushion Diamond', 'cushion'],
		['Emerald Diamond', 'emerald'],
		['Oval Diamond', 'oval']
	]

	const categories = [
		['Men’s Jewelry', 'mens-jewellery'],
		['Women’s Jewelry', 'womens-jewellery'],
		['Platinum Jewelry', 'platinum-jewellery'],
		['Diamond Jewelry', 'diamond-jewellery'],
		['Pearl Jewelry', 'pearl-jewellery'],
		['Gold Jewelry', 'gold-jewellery'],
		['Gemstone Jewelry', 'gemstone-jewellery']
	]

	const prices = [
		['Below $1000', '0-1000'],
		['Between $1000 -$5000', '1000-5000'],
		['Between $5000 -$10,000', '5000-10000'],
		['$10,000 and above', '10000-plus']
	]

	const description =
		'These dazzling Kundan earrings from Tarinika give your outfit a captivating charm. Handcrafted with'
</script>

<div class="rj-lab-mega" id="rj-lab-grown-menu" aria-label="Lab Grown Diamond menu">
	<section class="rj-mega-popular" aria-labelledby="rj-mega-popular-title">
		<h2 class="rj-mega-heading" id="rj-mega-popular-title">
			<img src="/ryans-jewels/mega-menu/popular.svg" alt="" aria-hidden="true" />
			<span>Popular Lab Grown Diamond</span>
		</h2>
		<div class="rj-mega-popular-links">
			{#each popular as item}
				<a href="/categories/lab-grown-diamond?shape={item[1]}">{item[0]}</a>
			{/each}
		</div>
		<a class="rj-mega-view-all" href="/categories/lab-grown-diamond">
			<span>View All Diamond</span>
			<span class="rj-mega-double-arrow" aria-hidden="true">
				<img src="/ryans-jewels/mega-menu/arrow-19.svg" alt="" />
				<img src="/ryans-jewels/mega-menu/arrow-19.svg" alt="" />
			</span>
		</a>
	</section>

	<section class="rj-mega-categories" aria-labelledby="rj-mega-categories-title">
		<div class="rj-mega-categories-inner">
			<h2 class="rj-mega-heading" id="rj-mega-categories-title">
				<img class="rj-mega-category-icon" src="/ryans-jewels/mega-menu/all-categories.png" alt="" aria-hidden="true" />
				<span>All Jewelry Categories</span>
			</h2>
			<div class="rj-mega-link-list">
				{#each categories as item}
					<a href="/categories/{item[1]}">{item[0]}</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="rj-mega-price" aria-labelledby="rj-mega-price-title">
		<h2 class="rj-mega-heading" id="rj-mega-price-title">
			<img src="/ryans-jewels/mega-menu/wallet.svg" alt="" aria-hidden="true" />
			<span>By Price Range</span>
		</h2>
		<div class="rj-mega-link-list">
			{#each prices as item}
				<a href="/products?price={item[1]}">{item[0]}</a>
			{/each}
		</div>
	</section>

	<section class="rj-mega-collections" aria-labelledby="rj-mega-collections-title">
		<div class="rj-mega-collections-inner">
			<div class="rj-mega-collections-head">
				<h2 id="rj-mega-collections-title">Browse By Collection</h2>
				<a href="/collections">
					<span>View More</span>
					<span class="rj-mega-more-arrows" aria-hidden="true">
						<img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" />
						<img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" />
					</span>
				</a>
			</div>

			<a class="rj-mega-card" href="/categories/rings">
				<img src="/ryans-jewels/mega-menu/collection-1.png" alt="Silver Diamond Rings" />
				<span>
					<strong>Silver Diamond Rings</strong>
					<small>{description}</small>
				</span>
			</a>
			<a class="rj-mega-card" href="/categories/rings">
				<img src="/ryans-jewels/mega-menu/collection-2.png" alt="Silver Diamond Rings" />
				<span>
					<strong>Silver Diamond Rings</strong>
					<small>{description}</small>
				</span>
			</a>
		</div>

		<div class="rj-mega-jewel" aria-hidden="true">
			<img class="rj-mega-ring-main" src="/ryans-jewels/mega-menu/ring-main.webp" alt="" />
			<img class="rj-mega-ring-reflection" src="/ryans-jewels/mega-menu/ring-main.webp" alt="" />
			<img class="rj-mega-ring-side" src="/ryans-jewels/mega-menu/ring-side.webp" alt="" />
			<img class="rj-mega-ring-side-reflection" src="/ryans-jewels/mega-menu/ring-side.webp" alt="" />
		</div>
	</section>
</div>

<style>
	.rj-lab-mega {
		position: absolute;
		top: 100%;
		left: 60px;
		right: 60px;
		display: grid;
		grid-template-columns: 4.545% 19.167% 3.409% 20.455% 3.03% 13.712% 3.03% 32.652%;
		height: 420px;
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

	.rj-mega-popular,
	.rj-mega-price,
	.rj-mega-categories,
	.rj-mega-collections {
		position: relative;
		min-width: 0;
		height: 420px;
	}

	.rj-mega-popular {
		grid-column: 2;
		margin-top: 22px;
		height: auto;
	}

	.rj-mega-categories {
		grid-column: 4;
		padding: 22px 25px;
		background: #fafafa;
	}

	.rj-mega-price {
		grid-column: 6;
		margin-top: 22px;
		height: auto;
	}

	.rj-mega-collections {
		grid-column: 8;
		border-left: 1.5px solid #f1f1f1;
		background: #fdfdfd;
	}

	.rj-mega-heading {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		height: 40px;
		margin: 0;
		padding: 10px 20px 10px 0;
		border-bottom: 1px dashed #bcbcbc;
		font-family: 'Lato', sans-serif;
		font-size: 17px;
		font-weight: 500;
		line-height: normal;
		letter-spacing: normal;
		color: #202020;
		white-space: nowrap;
	}

	.rj-mega-heading img {
		width: 20px;
		height: 20px;
		object-fit: contain;
		flex-shrink: 0;
	}

	.rj-mega-popular .rj-mega-heading img {
		width: 20px;
		height: 19.707px;
	}

	.rj-mega-price .rj-mega-heading img {
		width: 19px;
		height: 19px;
	}

	.rj-mega-heading .rj-mega-category-icon {
		width: 26px;
		height: 31px;
		margin-top: -5px;
		margin-bottom: -6px;
	}

	.rj-mega-popular-links {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-auto-flow: column;
		grid-template-rows: repeat(8, 21px);
		column-gap: 22px;
		row-gap: 12px;
		margin-top: 20px;
		padding-right: 12px;
	}

	.rj-mega-link-list {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		margin-top: 20px;
	}

	.rj-mega-popular-links a,
	.rj-mega-link-list a {
		font-family: 'Sarala', sans-serif;
		font-size: 14px;
		line-height: 21px;
		color: #404040;
		text-decoration: none;
		white-space: nowrap;
	}

	.rj-mega-popular-links a:hover,
	.rj-mega-link-list a:hover {
		color: var(--rj-gold, #cca646);
	}

	.rj-mega-view-all {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 239px;
		height: 39px;
		margin-top: 22px;
		padding: 8px 45px;
		border: 1px solid #555;
		border-radius: 3px;
		font-family: 'Sarala', sans-serif;
		font-size: 15px;
		line-height: 23px;
		color: #303030;
		text-decoration: none;
		white-space: nowrap;
	}

	.rj-mega-double-arrow {
		position: relative;
		display: block;
		width: 29px;
		height: 19px;
		flex-shrink: 0;
	}

	.rj-mega-double-arrow img {
		position: absolute;
		top: 0;
		width: 19px;
		height: 19px;
	}

	.rj-mega-double-arrow img:first-child { left: 0; }
	.rj-mega-double-arrow img:last-child { left: 10px; }

	.rj-mega-collections-inner {
		position: relative;
		z-index: 2;
		margin: 22px 30px 0;
	}

	.rj-mega-collections-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 40px;
		padding: 10px 10px 10px 0;
		border-bottom: 1px dashed #bcbcbc;
		font-family: 'Lato', sans-serif;
	}

	.rj-mega-collections-head h2 {
		margin: 0;
		font-family: 'Lato', sans-serif;
		font-size: 16px;
		font-weight: 500;
		line-height: normal;
		letter-spacing: normal;
		color: #202020;
	}

	.rj-mega-collections-head > a {
		display: flex;
		align-items: center;
		gap: 5px;
		font-family: 'Lato', sans-serif;
		font-size: 16px;
		font-weight: 500;
		letter-spacing: normal;
		color: #4699ff;
		text-decoration: none;
	}

	.rj-mega-more-arrows {
		position: relative;
		display: block;
		width: 17px;
		height: 11px;
	}

	.rj-mega-more-arrows img {
		position: absolute;
		top: 0;
		width: 11px;
		height: 11px;
	}

	.rj-mega-more-arrows img:first-child { left: 0; }
	.rj-mega-more-arrows img:last-child { left: 6px; }

	.rj-mega-card {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		width: 100%;
		height: 89px;
		margin-top: 16px;
		padding: 5px;
		border-radius: 8px;
		background: #f7f7f7;
		color: inherit;
		text-decoration: none;
	}

	.rj-mega-card + .rj-mega-card { margin-top: 17px; }

	.rj-mega-card > img {
		width: 79px;
		height: 79px;
		border-radius: 5px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.rj-mega-card > span {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		height: 51px;
		min-width: 0;
	}

	.rj-mega-card strong {
		font-family: 'Sarala', sans-serif;
		font-size: 14px;
		font-weight: 400;
		line-height: 21px;
		color: #303030;
	}

	.rj-mega-card small {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		font-family: 'Lato', sans-serif;
		font-size: 11px;
		line-height: 13px;
		color: #707070;
	}

	.rj-mega-jewel img {
		position: absolute;
		object-fit: contain;
		pointer-events: none;
	}

	.rj-mega-ring-main {
		right: 0;
		top: 259px;
		width: 182.37px;
		height: 182.37px;
		transform: rotate(-90deg);
	}

	.rj-mega-ring-reflection {
		right: 58px;
		top: 325.5px;
		width: 182.37px;
		height: 182.37px;
		opacity: 0.4;
		transform: rotate(180deg);
	}

	.rj-mega-ring-side {
		right: -13px;
		top: 273px;
		width: 157px;
		height: 157px;
	}

	.rj-mega-ring-side-reflection {
		right: -31px;
		top: 345px;
		width: 157px;
		height: 157px;
		opacity: 0.4;
		transform: rotate(-15deg);
	}

	@media (max-width: 1279px) {
		.rj-lab-mega {
			left: 40px;
			right: 40px;
		}
	}

	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-lab-mega { display: none; }
	}
</style>
