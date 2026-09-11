<script lang="ts">
	import { isCollectionGroup, menuArtwork, menuChildren, menuGroups, menuHref, type AdminMenuItem } from './admin-menu.js'

	let {
		category,
		menuId,
		collectionProducts = [],
		onNavigate
	}: {
		category: AdminMenuItem
		menuId: string
		collectionProducts?: AdminMenuItem[]
		onNavigate?: () => void
	} = $props()

	const artwork = $derived(menuArtwork(category))
</script>

<div class="rj-admin-mega" id={menuId} aria-label="{category.name || 'Category'} menu">
	<div class="rj-admin-grid">
		{#each menuGroups(category).filter((group) => !isCollectionGroup(group)) as group}
			<section class="rj-admin-group">
				<a class="rj-admin-heading" href={menuHref(group)} onclick={onNavigate}>
					{#if group.thumbnail}<img src={group.thumbnail} alt="" />{/if}
					<span>{group.name}</span>
				</a>

				{#if menuChildren(group).length}
					<ul>
						{#each menuChildren(group) as item}
							<li>
								<a href={menuHref(item)} onclick={onNavigate}>
									<span>{item.name}</span>
									<svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
										<path d="M4 2.25 7.25 5.5 4 8.75" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/each}

		{#if category.thumbnail}
			<a class="rj-admin-feature" href={menuHref(category)} onclick={onNavigate}>
				<img src={category.thumbnail} alt={category.name || ''} />
				<span>{category.name}</span>
			</a>
		{/if}
	</div>

	<a class="rj-admin-view-all" href={menuHref(category)} onclick={onNavigate}>
		<span>View All {category.name}</span>
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<path d="m6.75 3.75 5.25 5.25-5.25 5.25" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</a>

	<section class="rj-admin-collections" aria-labelledby="{menuId}-collections-title">
		<div class="rj-admin-collections-inner">
			<div class="rj-admin-collections-head">
				<h2 id="{menuId}-collections-title">Brows By Collection</h2>
				<a href="/collections" onclick={onNavigate}>
					<span>View More</span>
					<span class="rj-admin-more-arrows" aria-hidden="true">
						<img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" />
						<img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" />
					</span>
				</a>
			</div>

			{#each collectionProducts.slice(0, 2) as product}
				<a class="rj-admin-card" href={menuHref(product)} onclick={onNavigate}>
					<img src={product.thumbnail} alt={product.name || 'New collection product'} />
					<span>
						<strong>{product.name}</strong>
						<small>{product.description}</small>
					</span>
				</a>
			{/each}
		</div>

		{#if artwork === 'earrings'}
			<div class="rj-admin-earring-art" aria-hidden="true">
				<div class="rj-admin-earring-piece rj-admin-earring-piece--main"><div><img src="/ryans-jewels/mega-menu/earring-art.png" alt="" /></div></div>
				<div class="rj-admin-earring-piece rj-admin-earring-piece--reflection"><div><img src="/ryans-jewels/mega-menu/earring-art.png" alt="" /></div></div>
				<div class="rj-admin-earring-piece rj-admin-earring-piece--small"><div><img src="/ryans-jewels/mega-menu/earring-art.png" alt="" /></div></div>
				<div class="rj-admin-earring-piece rj-admin-earring-piece--small-reflection"><div><img src="/ryans-jewels/mega-menu/earring-art.png" alt="" /></div></div>
			</div>
		{:else if artwork === 'bracelets'}
			<div class="rj-admin-category-art rj-admin-category-art--bracelets" aria-hidden="true">
				<img src="/ryans-jewels/mega-menu/bracelets.jpg" alt="" />
			</div>
		{:else if artwork === 'pendants'}
			<div class="rj-admin-category-art rj-admin-category-art--pendants" aria-hidden="true">
				<img src="/ryans-jewels/mega-menu/pendants.jpg" alt="" />
			</div>
		{:else if artwork === 'rings'}
			<div class="rj-admin-jewel" aria-hidden="true">
				<img class="rj-admin-ring-main" src="/ryans-jewels/mega-menu/all-ring-main.png" alt="" />
				<img class="rj-admin-ring-reflection" src="/ryans-jewels/mega-menu/all-ring-main.png" alt="" />
				<img class="rj-admin-ring-side" src="/ryans-jewels/mega-menu/all-ring-side.png" alt="" />
				<img class="rj-admin-ring-side-reflection" src="/ryans-jewels/mega-menu/all-ring-side.png" alt="" />
			</div>
		{/if}
	</section>
</div>

<style>
	.rj-admin-mega {
		position: absolute;
		top: 100%;
		left: 60px;
		right: 60px;
		display: grid;
		grid-template-columns: minmax(0, 67.348%) minmax(0, 32.652%);
		grid-template-rows: minmax(0, 390px) 50px;
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

	.rj-admin-grid {
		display: grid;
		grid-column: 1;
		grid-row: 1;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0;
		min-height: 0;
		padding: 22px 35px;
		overflow-y: auto;
	}

	.rj-admin-group {
		min-width: 0;
		padding: 0 30px;
		border-right: 1px solid #f1f1f1;
	}

	.rj-admin-group:nth-child(3n),
	.rj-admin-group:last-child {
		border-right: 0;
	}

	.rj-admin-heading {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 39px;
		padding: 8px 0;
		border-bottom: 1px dashed #bcbcbc;
		font-family: 'Sarala', sans-serif;
		font-size: 16px;
		font-weight: 400;
		line-height: 23px;
		color: #202020;
		text-decoration: none;
	}

	.rj-admin-heading img {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		object-fit: cover;
		flex-shrink: 0;
	}

	.rj-admin-group ul {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 20px 0 0;
		padding: 0;
		list-style: none;
	}

	.rj-admin-group li a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		font-family: 'Sarala', sans-serif;
		font-size: 14px;
		line-height: 21px;
		color: #404040;
		text-decoration: none;
	}

	.rj-admin-group a:hover,
	.rj-admin-view-all:hover {
		color: var(--rj-gold, #cca646);
	}

	.rj-admin-feature {
		position: relative;
		display: block;
		min-height: 180px;
		overflow: hidden;
		border-radius: 8px;
		color: #fff;
		text-decoration: none;
	}

	.rj-admin-feature img {
		width: 100%;
		height: 100%;
		min-height: 180px;
		object-fit: cover;
	}

	.rj-admin-feature span {
		position: absolute;
		left: 16px;
		bottom: 14px;
		font-family: 'Sarala', sans-serif;
		font-size: 16px;
		text-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
	}

	.rj-admin-view-all {
		display: flex;
		grid-column: 1;
		grid-row: 2;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 50px;
		border-top: 1px solid #f1f1f1;
		background: #fdfdfd;
		font-family: 'Sarala', sans-serif;
		font-size: 14px;
		line-height: 21px;
		color: #303030;
		text-decoration: none;
	}

	.rj-admin-collections {
		position: relative;
		grid-column: 2;
		grid-row: 1 / 3;
		min-width: 0;
		height: 440px;
		overflow: hidden;
		border-left: 1.5px solid #f1f1f1;
		background: #fdfdfd;
	}

	.rj-admin-collections-inner {
		position: relative;
		z-index: 2;
		margin: 22px 30px 0;
	}

	.rj-admin-collections-head {
		display: flex;
		height: 40px;
		align-items: center;
		justify-content: space-between;
		padding: 10px 10px 10px 0;
		border-bottom: 1px dashed #bcbcbc;
		font-family: 'Lato', sans-serif;
	}

	.rj-admin-collections-head h2 {
		margin: 0;
		font-family: 'Lato', sans-serif;
		font-size: 16px;
		font-weight: 500;
		line-height: normal;
		color: #202020;
		white-space: nowrap;
	}

	.rj-admin-collections-head > a {
		display: flex;
		align-items: center;
		gap: 5px;
		font-family: 'Lato', sans-serif;
		font-size: 16px;
		font-weight: 500;
		color: #4699ff;
		text-decoration: none;
		white-space: nowrap;
	}

	.rj-admin-more-arrows {
		position: relative;
		display: block;
		width: 17px;
		height: 11px;
	}

	.rj-admin-more-arrows img {
		position: absolute;
		top: 0;
		width: 11px;
		height: 11px;
	}

	.rj-admin-more-arrows img:first-child { left: 0; }
	.rj-admin-more-arrows img:last-child { left: 6px; }

	.rj-admin-card {
		display: flex;
		width: 100%;
		height: 89px;
		align-items: flex-start;
		gap: 12px;
		margin-top: 16px;
		padding: 5px;
		border-radius: 8px;
		background: #f7f7f7;
		color: inherit;
		text-decoration: none;
	}

	.rj-admin-card + .rj-admin-card { margin-top: 12px; }

	.rj-admin-card > img {
		width: 79px;
		height: 79px;
		border-radius: 5px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.rj-admin-card > span {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		gap: 2px;
	}

	.rj-admin-card strong {
		overflow: hidden;
		font-family: 'Sarala', sans-serif;
		font-size: 13px;
		font-weight: 400;
		line-height: 21px;
		color: #303030;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.rj-admin-card small {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		font-family: 'Lato', sans-serif;
		font-size: 10px;
		line-height: 13px;
		color: #707070;
	}

	.rj-admin-jewel img {
		position: absolute;
		object-fit: contain;
		pointer-events: none;
	}

	.rj-admin-ring-main { right: 0; top: 274px; width: 182.369px; height: 182.369px; transform: rotate(-90deg); }
	.rj-admin-ring-reflection { right: 58.51px; top: 340.49px; width: 182.369px; height: 182.369px; opacity: 0.4; transform: rotate(180deg); }
	.rj-admin-ring-side { right: -13px; top: 288px; width: 157px; height: 157px; }
	.rj-admin-ring-side-reflection { right: -31px; top: 360px; width: 157px; height: 157px; opacity: 0.4; transform: rotate(-15deg); }

	.rj-admin-earring-piece {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.rj-admin-earring-piece > div { position: relative; overflow: hidden; }
	.rj-admin-earring-piece img { position: absolute; left: -163.95%; top: -195.31%; width: 336.91%; height: 360.63%; max-width: none; pointer-events: none; }
	.rj-admin-earring-piece--main { right: 17.094px; top: 302px; width: 139.416px; height: 135.324px; }
	.rj-admin-earring-piece--main > div { width: 109.65px; height: 102.438px; transform: rotate(21.35deg); }
	.rj-admin-earring-piece--reflection { right: 17.006px; top: 377px; width: 149.994px; height: 149.938px; }
	.rj-admin-earring-piece--reflection > div { width: 109.65px; height: 102.438px; opacity: 0.4; transform: rotate(-44.69deg); }
	.rj-admin-earring-piece--small { right: 116.499px; top: 339px; width: 95.501px; height: 92.698px; }
	.rj-admin-earring-piece--small > div { width: 75.111px; height: 70.17px; transform: rotate(158.65deg) scaleY(-1); }
	.rj-admin-earring-piece--small-reflection { right: 119.773px; top: 400.17px; width: 56.877px; height: 57.075px; }
	.rj-admin-earring-piece--small-reflection > div { width: 41.713px; height: 38.969px; opacity: 0.2; transform: rotate(132.08deg) scaleY(-1); }

	.rj-admin-category-art {
		position: absolute;
		pointer-events: none;
	}

	.rj-admin-category-art::after {
		position: absolute;
		z-index: 0;
		right: 10%;
		bottom: 6px;
		left: 14%;
		height: 9px;
		border-radius: 50%;
		background: rgba(32, 32, 32, 0.22);
		filter: blur(7px);
		content: '';
	}

	.rj-admin-category-art img {
		position: relative;
		z-index: 1;
		width: 100%;
		height: 100%;
		object-fit: contain;
		mix-blend-mode: multiply;
	}

	.rj-admin-category-art--bracelets { right: 16px; bottom: 3px; width: 205px; height: 142px; }
	.rj-admin-category-art--pendants { right: 28px; bottom: -8px; width: 132px; height: 202px; }
	.rj-admin-category-art--pendants::after { right: 2%; bottom: 12px; left: 18%; }

	@media (max-width: 1279px) {
		.rj-admin-mega {
			left: 40px;
			right: 40px;
		}
	}

	@media (max-width: 1023px) {
		.rj-admin-mega {
			display: none;
		}
	}
</style>
