<script lang="ts">
	import { searchService } from '$lib/core/services/index.js'
	import { isCollectionGroup, menuChildren, menuGroups, menuHref, type AdminMenuItem } from './admin-menu.js'
	import { realCatalogUrl } from './product-filters.js'

	let {
		category,
		menuId,
		open = false,
		onNavigate
	}: {
		category: AdminMenuItem
		menuId: string
		open?: boolean
		onNavigate?: () => void
	} = $props()

	type CollectionProduct = { id: string; title: string; slug?: string; thumbnail?: string; featuredImage?: string }
	let collectionProducts = $state<CollectionProduct[]>([])
	let requestedSlug = $state<string | null>(null)
	const groups = $derived(menuGroups(category))
	const hasCollection = $derived(groups.some(isCollectionGroup))
	const isEarrings = $derived(/earrings?/i.test(category.name || ''))
	const collectionCards = $derived(Array.from({ length: 2 }, (_, index) => collectionProducts[index] || null))

	async function loadCollection(slug: string) {
		try {
			const url = realCatalogUrl(new URL('/products?sort=popularity:desc', window.location.origin))
			const [response, popularityResponse] = await Promise.all([
				searchService.searchWithUrl(url, slug),
				fetch(`/api/popularity?category=${encodeURIComponent(slug)}&limit=2`)
			])
			const listed = (response?.data || []).filter((product: any) => Boolean(product.slug)) as CollectionProduct[]
			const ranked = popularityResponse.ok ? (await popularityResponse.json()).products || [] : []
			const current = new Map(listed.map((product) => [product.id, product]))
			collectionProducts = [...ranked.filter((product: CollectionProduct) => current.has(product.id)).map((product: CollectionProduct) => ({ ...product, ...current.get(product.id) })), ...listed]
				.filter((product, index, products) => products.findIndex((item) => item.id === product.id) === index)
				.slice(0, 2)
		} catch (error) {
			console.error('Unable to load Browse By Collection products:', error)
		}
	}

	$effect(() => {
		if (!open || !hasCollection || !category.slug || requestedSlug === category.slug) return
		requestedSlug = category.slug
		void loadCollection(category.slug)
	})
</script>

<div class="rj-admin-mega" class:rj-admin-mega--collection={hasCollection} id={menuId} aria-label="{category.name || 'Category'} menu">
	<div class="rj-admin-grid">
		{#each groups as group}
			<section class="rj-admin-group" class:rj-admin-collection={isCollectionGroup(group)}>
				{#if isCollectionGroup(group)}
					<div class="rj-admin-collection-head">
						<h2>Brows By Collection</h2>
						<a href={menuHref(category)} onclick={onNavigate}>
							<span>View More</span>
							<span class="rj-admin-more-arrows" aria-hidden="true">
								<img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" />
								<img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" />
							</span>
						</a>
					</div>

					{#each collectionCards as product}
						{#if product}
							<a class="rj-admin-collection-card" href="/products/{product.slug}" onclick={onNavigate}>
								{#if product.thumbnail || product.featuredImage}
									<img src={product.thumbnail || product.featuredImage} alt={product.title} />
								{:else}
									<span class="rj-admin-coming-media">Coming Soon</span>
								{/if}
								<span><strong>{product.title}</strong><small>Explore this product from our {category.name} collection.</small></span>
							</a>
						{:else}
							<div class="rj-admin-collection-card is-coming-soon">
								<span class="rj-admin-coming-media">Coming Soon</span>
								<span><strong>Coming Soon</strong><small>Products will appear here when they are added from the admin store.</small></span>
							</div>
						{/if}
					{/each}
				{:else}
					<a class="rj-admin-heading" href={menuHref(group)} onclick={onNavigate}>
						{#if group.thumbnail}<img src={group.thumbnail} alt="" />{/if}
						<span>{group.name}</span>
					</a>
				{/if}

				{#if !isCollectionGroup(group) && menuChildren(group).length}
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

		{#if category.thumbnail && !hasCollection}
			<a class="rj-admin-feature" href={menuHref(category)} onclick={onNavigate}>
				<img src={category.thumbnail} alt={category.name || ''} />
				<span>{category.name}</span>
			</a>
		{/if}
	</div>

	{#if hasCollection}
		{#if isEarrings}
			<div class="rj-admin-earring-piece rj-admin-earring-piece--main"><div><img src="/ryans-jewels/mega-menu/earring-art.webp" alt="" /></div></div>
			<div class="rj-admin-earring-piece rj-admin-earring-piece--reflection"><div><img src="/ryans-jewels/mega-menu/earring-art.webp" alt="" /></div></div>
			<div class="rj-admin-earring-piece rj-admin-earring-piece--small"><div><img src="/ryans-jewels/mega-menu/earring-art.webp" alt="" /></div></div>
			<div class="rj-admin-earring-piece rj-admin-earring-piece--small-reflection"><div><img src="/ryans-jewels/mega-menu/earring-art.webp" alt="" /></div></div>
		{:else}
			<div class="rj-admin-ring-art" aria-hidden="true">
				<img class="rj-admin-ring-main" src="/ryans-jewels/mega-menu/ring-main.webp" alt="" />
				<img class="rj-admin-ring-reflection" src="/ryans-jewels/mega-menu/ring-main.webp" alt="" />
				<img class="rj-admin-ring-side" src="/ryans-jewels/mega-menu/ring-side.webp" alt="" />
				<img class="rj-admin-ring-side-reflection" src="/ryans-jewels/mega-menu/ring-side.webp" alt="" />
			</div>
		{/if}
	{/if}

	<a class="rj-admin-view-all" href={menuHref(category)} onclick={onNavigate}>
		<span>View All {category.name}</span>
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<path d="m6.75 3.75 5.25 5.25-5.25 5.25" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</a>
</div>

<style>
	.rj-admin-mega {
		position: absolute;
		top: 100%;
		left: 60px;
		right: 60px;
		display: flex;
		min-height: 260px;
		max-height: 440px;
		flex-direction: column;
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
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0;
		min-height: 0;
		padding: 22px 35px;
		overflow-y: auto;
		scrollbar-width: none;
	}

	.rj-admin-grid::-webkit-scrollbar { display: none; }

	.rj-admin-mega--collection {
		height: 440px;
	}

	.rj-admin-mega--collection .rj-admin-grid {
		flex: 1;
	}

	.rj-admin-group {
		min-width: 0;
		padding: 0 30px;
		border-right: 1px solid #f1f1f1;
	}

	.rj-admin-group:nth-child(4n),
	.rj-admin-group:last-child {
		border-right: 0;
	}

	.rj-admin-collection {
		grid-column: 4;
		background: #fff;
	}

	.rj-admin-collection-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 39px;
		padding: 10px 10px 10px 0;
		border-bottom: 1px dashed #bcbcbc;
	}

	.rj-admin-collection-head h2 {
		margin: 0;
		font-family: 'Lato', sans-serif;
		font-size: 16px;
		font-weight: 500;
		line-height: normal;
		color: #202020;
		white-space: nowrap;
	}

	.rj-admin-collection-head > a {
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

	.rj-admin-collection-card {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		height: 89px;
		margin-top: 17px;
		padding: 5px;
		border-radius: 8px;
		background: #f7f7f7;
		color: inherit;
		text-decoration: none;
	}

	.rj-admin-collection-card > img {
		width: 79px;
		height: 79px;
		border-radius: 5px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.rj-admin-coming-media {
		display: flex;
		width: 79px;
		height: 79px;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		background: #eee;
		font-family: 'Lato', sans-serif;
		font-size: 10px;
		color: #888;
		text-align: center;
		flex-shrink: 0;
	}

	.rj-admin-collection-card > span {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		gap: 2px;
	}

	.rj-admin-collection-card strong {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		font-family: 'Sarala', sans-serif;
		font-size: 13px;
		font-weight: 400;
		line-height: 21px;
		color: #303030;
	}

	.rj-admin-collection-card small {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-family: 'Lato', sans-serif;
		font-size: 10px;
		line-height: 13px;
		color: #707070;
	}

	.rj-admin-collection-card.is-coming-soon {
		cursor: default;
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

	.rj-admin-earring-piece {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		z-index: 2;
	}

	.rj-admin-earring-piece > div {
		position: relative;
		overflow: hidden;
	}

	.rj-admin-earring-piece img {
		position: absolute;
		left: -163.95%;
		top: -195.31%;
		width: 336.91%;
		height: 360.63%;
		max-width: none;
	}

	.rj-admin-earring-piece--main { right: 52px; top: 302px; width: 139.416px; height: 135.324px; }
	.rj-admin-earring-piece--main > div { width: 109.65px; height: 102.438px; transform: rotate(21.35deg); }
	.rj-admin-earring-piece--reflection { right: 52px; top: 377px; width: 149.994px; height: 149.938px; }
	.rj-admin-earring-piece--reflection > div { width: 109.65px; height: 102.438px; opacity: 0.4; transform: rotate(-44.69deg); }
	.rj-admin-earring-piece--small { right: 151.5px; top: 339px; width: 95.501px; height: 92.698px; }
	.rj-admin-earring-piece--small > div { width: 75.111px; height: 70.17px; transform: rotate(158.65deg) scaleY(-1); }
	.rj-admin-earring-piece--small-reflection { right: 154.8px; top: 400.17px; width: 56.877px; height: 57.075px; }
	.rj-admin-earring-piece--small-reflection > div { width: 41.713px; height: 38.969px; opacity: 0.2; transform: rotate(132.08deg) scaleY(-1); }

	.rj-admin-ring-art img { position: absolute; object-fit: contain; pointer-events: none; z-index: 2; }
	.rj-admin-ring-main { right: 35px; top: 274px; width: 182.369px; height: 182.369px; transform: rotate(-90deg); }
	.rj-admin-ring-reflection { right: 93.51px; top: 340.49px; width: 182.369px; height: 182.369px; opacity: 0.4; transform: rotate(180deg); }
	.rj-admin-ring-side { right: 22px; top: 288px; width: 157px; height: 157px; }
	.rj-admin-ring-side-reflection { right: 4px; top: 360px; width: 157px; height: 157px; opacity: 0.4; transform: rotate(-15deg); }

	.rj-admin-view-all {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 50px;
		margin-top: auto;
		border-top: 1px solid #f1f1f1;
		background: #fdfdfd;
		font-family: 'Sarala', sans-serif;
		font-size: 14px;
		line-height: 21px;
		color: #303030;
		text-decoration: none;
	}

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
