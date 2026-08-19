<script lang="ts">
	import { searchService } from '$lib/core/services/index.js'
	import { menuChildren, menuHref, menuLabel, type AdminMenuItem } from './admin-menu.js'
	import { realCatalogUrl, withoutDemoProducts } from './product-filters.js'

	let {
		category,
		fallbackItems = [],
		variant = 'lab',
		open = false,
		onBack,
		onClose
	}: {
		category: AdminMenuItem
		fallbackItems?: AdminMenuItem[]
		variant?: 'lab' | 'all-diamond' | 'earrings'
		open?: boolean
		onBack: () => void
		onClose: () => void
	} = $props()

	type MenuProduct = {
		id: string
		title?: string
		name?: string
		slug?: string | null
		thumbnail?: string
		featuredImage?: string
		description?: string
	}

	let products = $state<MenuProduct[]>([])
	let requestedSlug = $state<string | null>(null)
	const fallbackEarringProducts: MenuProduct[] = [
		{
			id: 'earring-collection-ring',
			title: 'Silver Diamond Earrings',
			thumbnail: '/ryans-jewels/mega-menu/earring-collection-ring.jpeg',
			description: 'These dazzling Kundan earrings give your outfit a captivating charm.'
		},
		{
			id: 'earring-collection-drop',
			title: 'Silver Diamond Earrings',
			thumbnail: '/ryans-jewels/mega-menu/earring-collection-drop.jpeg',
			description: 'These dazzling Kundan earrings give your outfit a captivating charm.'
		}
	]
	const fallbackMetalNames = ['White Gold', 'Yellow Gold', 'Rose Gold', 'Yellow gold & White Gold', 'Rose gold & White Gold']
	const fallbackPriceNames = ['Below $1000', 'Between $1000 -$5000', 'Between $5000 -$10,000', '$10,000 and above']
	const fallbackEarringNames = ['All Earring', 'Drops', 'Solitaire Studs', 'J Hoops', 'Front back', 'Danglers']
	const isEarringLayout = $derived(variant === 'all-diamond' || variant === 'earrings')
	const groups = $derived(menuChildren(category))
	const primaryGroup = $derived(
		groups.find((group) => /popular|lab grown/i.test(menuLabel(group) || '')) ||
			groups.find((group) => !/price|budget|collection|metal|stamp/i.test(menuLabel(group) || '')) ||
			null
	)
	const categoryGroup = $derived(
		groups.find((group) => group !== primaryGroup && /categor|jewel/i.test(menuLabel(group) || '')) || null
	)
	const metalGroup = $derived(groups.find((group) => /metal|stamp/i.test(menuLabel(group) || '')) || null)
	const priceGroup = $derived(groups.find((group) => /price|budget/i.test(menuLabel(group) || '')) || null)
	const fallbackPrimaryGroup = $derived({
		name: variant === 'earrings' ? 'Popular Earring Types' : 'Popular Diamond Jewelry Types',
		link: menuHref(category),
		children: variant === 'earrings'
			? fallbackEarringNames.map((name) => ({ name, link: menuHref(category) }))
			: [category, ...fallbackItems.filter((item) => item !== category && !/^home$/i.test(menuLabel(item) || ''))].slice(0, 6)
	} as AdminMenuItem)
	const fallbackMetalGroup = $derived({
		name: 'By Metals & Stamps',
		link: menuHref(category),
		children: fallbackMetalNames.map((name) => ({
			name,
			link: menuHref(category),
			children: ['9K', '14k', '16k'].map((stamp) => ({ name: stamp, link: menuHref(category) }))
		}))
	} as AdminMenuItem)
	const fallbackPriceGroup = $derived({
		name: 'By Price Range',
		link: menuHref(category),
		children: fallbackPriceNames.map((name) => ({ name, link: menuHref(category) }))
	} as AdminMenuItem)
	const displayPrimaryGroup = $derived(primaryGroup || (isEarringLayout && menuChildren(fallbackPrimaryGroup).length ? fallbackPrimaryGroup : null))
	const displayMetalGroup = $derived(metalGroup || (isEarringLayout ? fallbackMetalGroup : null))
	const displayPriceGroup = $derived(priceGroup || (isEarringLayout ? fallbackPriceGroup : null))
	const primaryItems = $derived(
		displayPrimaryGroup ? (menuChildren(displayPrimaryGroup).length ? menuChildren(displayPrimaryGroup) : [displayPrimaryGroup]) : []
	)
	const categoryItems = $derived(
		categoryGroup ? menuChildren(categoryGroup) : []
	)
	const metalItems = $derived(displayMetalGroup ? menuChildren(displayMetalGroup) : [])
	const priceItems = $derived(displayPriceGroup ? menuChildren(displayPriceGroup) : [])
	const collectionProducts = $derived(products.length ? products : variant === 'earrings' ? fallbackEarringProducts : [])
	const primarySplit = $derived(Math.ceil(Math.min(primaryItems.length, 11) / 2))
	const primaryColumns = $derived(
		isEarringLayout
			? [primaryItems.slice(0, 6)]
			: [primaryItems.slice(0, primarySplit), primaryItems.slice(primarySplit, 11)]
	)

	function metalTone(label = '') {
		const value = label.toLowerCase()
		if (value.includes('rose') && value.includes('white')) return 'rose-white'
		if (value.includes('yellow') && value.includes('white')) return 'yellow-white'
		if (value.includes('rose')) return 'rose'
		if (value.includes('yellow')) return 'yellow'
		return 'white'
	}

	function plainText(value: unknown) {
		return String(value || '')
			.replace(/<[^>]+>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
	}

	async function loadProducts(slug: string) {
		try {
			const url = realCatalogUrl(new URL('/products?sort=popularity:desc', window.location.origin))
			const [categoryResult, popularityResponse] = await Promise.all([
				searchService.searchWithUrl(url, slug),
				fetch(`/api/popularity?category=${encodeURIComponent(slug)}&limit=2`)
			])
			let listed = withoutDemoProducts(categoryResult?.data || []).filter((product) => Boolean(product.slug)) as MenuProduct[]
			if (!listed.length && variant !== 'lab') {
				const search = variant === 'earrings' ? 'earring' : 'diamond'
				const fallbackResult = await searchService.searchWithUrl(
					realCatalogUrl(new URL(`/products?search=${search}&sort=popularity:desc`, window.location.origin))
				)
				listed = withoutDemoProducts(fallbackResult?.data || []).filter((product) => Boolean(product.slug)) as MenuProduct[]
			}
			const ranked = popularityResponse.ok ? (await popularityResponse.json()).products || [] : []
			const current = new Map(listed.map((product) => [product.id, product]))
			products = [...ranked.filter((product: MenuProduct) => current.has(product.id)).map((product: MenuProduct) => ({ ...product, ...current.get(product.id) })), ...listed]
				.filter((product, index, items) => items.findIndex((item) => item.id === product.id) === index)
				.slice(0, 2)
		} catch (error) {
			console.error('Unable to load tablet mega menu products:', error)
			products = []
		}
	}

	$effect(() => {
		if (!open || !category.slug || requestedSlug === category.slug) return
		requestedSlug = category.slug
		void loadProducts(category.slug)
	})
</script>

<div class="rj-tablet-lab" class:rj-tablet-lab--all-diamond={isEarringLayout} aria-label="{menuLabel(category) || 'Lab Grown Diamond'} navigation">
	<div class="rj-tablet-lab-canvas">
		<header class="rj-tablet-lab-header">
			<a class="rj-tablet-lab-brand" href="/" onclick={onClose} aria-label="Ryan Jewelers home">
				<span class="rj-tablet-lab-logo"><img src="/ryans-jewels/navigation/tablet-menu-logo.png" alt="" /></span>
				<span>Ryan Jewelers</span>
			</a>
			<button class="rj-tablet-lab-close" type="button" aria-label="Close menu" onclick={onClose}>
				<img src="/ryans-jewels/navigation/tablet-menu-close.svg" alt="" />
			</button>
		</header>
		<span class="rj-tablet-lab-divider" aria-hidden="true"></span>

		<button class="rj-tablet-lab-back" type="button" onclick={onBack}>
			<img src="/ryans-jewels/navigation/tablet-menu-arrow.svg" alt="" aria-hidden="true" />
			<span>{menuLabel(category)}</span>
		</button>

		{#if displayPrimaryGroup}
			<section class="rj-tablet-lab-section rj-tablet-lab-primary">
				<a class="rj-tablet-lab-section-title" href={menuHref(displayPrimaryGroup)} onclick={onClose}>
					{#if isEarringLayout}
						<span class="rj-tablet-lab-earring-heading" aria-hidden="true">
							<img src={variant === 'earrings' ? '/ryans-jewels/mega-menu/earring-menu-popular-left.svg' : '/ryans-jewels/mega-menu/earring-icon-1.svg'} alt="" />
							<img src={variant === 'earrings' ? '/ryans-jewels/mega-menu/earring-menu-popular-right.svg' : '/ryans-jewels/mega-menu/earring-icon-2.svg'} alt="" />
						</span>
					{:else}
						<img src="/ryans-jewels/mega-menu/popular.svg" alt="" aria-hidden="true" />
					{/if}
					<span>{menuLabel(displayPrimaryGroup)}</span>
				</a>
				<div class="rj-tablet-lab-primary-links">
					{#each primaryColumns as column}
						<div class="rj-tablet-lab-link-column">
							{#each column as item}
								<a class="rj-tablet-lab-link" href={menuHref(item)} onclick={onClose}>
									<span>{menuLabel(item)}</span>
									<img src="/ryans-jewels/navigation/tablet-menu-arrow.svg" alt="" aria-hidden="true" />
								</a>
							{/each}
						</div>
					{/each}
				</div>
				<a class="rj-tablet-lab-view-all" href={menuHref(category)} onclick={onClose}>
					<span>View All {menuLabel(category)}</span>
					<span class="rj-tablet-lab-double-arrow" aria-hidden="true">
						<img src="/ryans-jewels/mega-menu/arrow-19.svg" alt="" />
						<img src="/ryans-jewels/mega-menu/arrow-19.svg" alt="" />
					</span>
				</a>
			</section>
		{/if}

		{#if displayMetalGroup && metalItems.length}
			<section class="rj-tablet-lab-section rj-tablet-lab-metals">
				<a class="rj-tablet-lab-section-title" href={menuHref(displayMetalGroup)} onclick={onClose}>
					<img src={variant === 'earrings' ? '/ryans-jewels/mega-menu/earring-menu-metals.svg' : '/ryans-jewels/mega-menu/all-discount.svg'} alt="" aria-hidden="true" />
					<span>{menuLabel(displayMetalGroup)}</span>
				</a>
				<div class="rj-tablet-lab-metal-grid">
					{#each metalItems.slice(0, 5) as item}
						<div class="rj-tablet-lab-metal">
							<a class="rj-tablet-lab-metal-name" href={menuHref(item)} onclick={onClose}>
								<span class="rj-tablet-lab-swatch rj-tablet-lab-swatch--{metalTone(menuLabel(item))}" aria-hidden="true"></span>
								<span>{menuLabel(item)}</span>
							</a>
							{#if menuChildren(item).length}
								<div class="rj-tablet-lab-stamps">
									{#each menuChildren(item).slice(0, 3) as stamp}
										<a href={menuHref(stamp)} onclick={onClose}>{menuLabel(stamp)}</a>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}

		{#if categoryGroup && categoryItems.length}
			<section class="rj-tablet-lab-section rj-tablet-lab-categories">
				<div class="rj-tablet-lab-section-title">
					<img src="/ryans-jewels/mega-menu/all-categories.png" alt="" aria-hidden="true" />
					<span>{menuLabel(categoryGroup)}</span>
				</div>
				<div class="rj-tablet-lab-grid-links">
					{#each categoryItems.slice(0, 8) as item}
						<a class="rj-tablet-lab-link" href={menuHref(item)} onclick={onClose}>
							<span>{menuLabel(item)}</span>
							<img src="/ryans-jewels/navigation/tablet-menu-arrow.svg" alt="" aria-hidden="true" />
						</a>
					{/each}
				</div>
			</section>
		{/if}

		{#if displayPriceGroup && priceItems.length}
			<section class="rj-tablet-lab-section rj-tablet-lab-price">
				<a class="rj-tablet-lab-section-title" href={menuHref(displayPriceGroup)} onclick={onClose}>
					<img src={variant === 'earrings' ? '/ryans-jewels/mega-menu/earring-menu-price.svg' : '/ryans-jewels/mega-menu/wallet.svg'} alt="" aria-hidden="true" />
					<span>{menuLabel(displayPriceGroup)}</span>
				</a>
				<div class="rj-tablet-lab-grid-links">
					{#each priceItems.slice(0, 4) as item}
						<a class="rj-tablet-lab-link" href={menuHref(item)} onclick={onClose}>
							<span>{menuLabel(item)}</span>
							<img src="/ryans-jewels/navigation/tablet-menu-arrow.svg" alt="" aria-hidden="true" />
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<section class="rj-tablet-lab-collection">
			<div class="rj-tablet-lab-collection-head">
				<span>Brows By Collection</span>
				<a href={menuHref(category)} onclick={onClose}>
					<span>View More</span>
					<span class="rj-tablet-lab-more-arrows" aria-hidden="true">
						<img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" />
						<img src="/ryans-jewels/mega-menu/arrow-11.svg" alt="" />
					</span>
				</a>
			</div>
			<div class="rj-tablet-lab-products">
				{#each collectionProducts as product}
					<a class="rj-tablet-lab-product" href={product.slug ? `/products/${product.slug}` : menuHref(category)} onclick={onClose}>
						{#if product.thumbnail || product.featuredImage}
							<img src={product.thumbnail || product.featuredImage} alt={product.title || product.name || ''} />
						{/if}
						<span>
							<strong>{product.title || product.name}</strong>
							{#if plainText(product.description)}<small>{plainText(product.description)}</small>{/if}
						</span>
					</a>
				{/each}
			</div>

			{#if isEarringLayout}
				<div class="rj-tablet-lab-earring-art" aria-hidden="true">
					<div class="rj-tablet-lab-earring-piece rj-tablet-lab-earring-piece--main"><div><img src="/ryans-jewels/mega-menu/earring-art.webp" alt="" /></div></div>
					<div class="rj-tablet-lab-earring-piece rj-tablet-lab-earring-piece--reflection"><div><img src="/ryans-jewels/mega-menu/earring-art.webp" alt="" /></div></div>
					<div class="rj-tablet-lab-earring-piece rj-tablet-lab-earring-piece--small"><div><img src="/ryans-jewels/mega-menu/earring-art.webp" alt="" /></div></div>
				</div>
			{:else}
				<div class="rj-tablet-lab-ring-art" aria-hidden="true">
					<img class="rj-tablet-lab-ring-main" src="/ryans-jewels/mega-menu/ring-main.webp" alt="" />
					<img class="rj-tablet-lab-ring-side" src="/ryans-jewels/mega-menu/ring-side.webp" alt="" />
				</div>
			{/if}
		</section>
	</div>
</div>

<style>
	.rj-tablet-lab {
		position: relative;
		max-height: 100vh;
		overflow-y: auto;
		background: #fff;
		scrollbar-width: none;
	}

	.rj-tablet-lab::-webkit-scrollbar { display: none; }

	.rj-tablet-lab-canvas {
		position: relative;
		display: flex;
		width: 560px;
		flex-direction: column;
		overflow: hidden;
		background: #fff;
		color: #404040;
	}

	.rj-tablet-lab-header {
		display: flex;
		width: 500px;
		height: 39px;
		align-items: center;
		justify-content: space-between;
		margin: 25px 30px 31px;
	}

	.rj-tablet-lab-brand {
		display: flex;
		align-items: center;
		gap: 12px;
		color: #cca646;
		font-family: 'Inria Serif', serif;
		font-size: 24px;
		font-weight: 400;
		line-height: normal;
		text-decoration: none;
		white-space: nowrap;
	}

	.rj-tablet-lab-logo {
		position: relative;
		display: block;
		width: 42px;
		height: 39px;
		flex: none;
		overflow: hidden;
	}

	.rj-tablet-lab-logo img {
		position: absolute;
		top: -39%;
		left: -59.69%;
		width: 206.72%;
		height: 221.3%;
		max-width: none;
	}

	.rj-tablet-lab-close {
		display: flex;
		width: 26px;
		height: 26px;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	.rj-tablet-lab-close img,
	.rj-tablet-lab-back img,
	.rj-tablet-lab-link img { display: block; width: 100%; height: 100%; }

	.rj-tablet-lab-divider {
		display: block;
		width: 520px;
		height: 1px;
		margin: 0 20px;
		background: #c2c2c2;
	}

	.rj-tablet-lab-back {
		display: flex;
		height: 34px;
		align-items: center;
		gap: 13px;
		margin: 30px 20px 0;
		padding: 0;
		border: 0;
		background: transparent;
		color: #404040;
		font-family: 'Sarala', sans-serif;
		font-size: 18px;
		font-weight: 400;
		line-height: normal;
		cursor: pointer;
	}

	.rj-tablet-lab-back img { width: 24px; height: 24px; transform: rotate(180deg); }

	.rj-tablet-lab-section {
		position: relative;
		font-family: 'Sarala', sans-serif;
	}

	.rj-tablet-lab-primary { width: 520px; margin: 25px 20px 0; }
	.rj-tablet-lab--all-diamond .rj-tablet-lab-primary { margin-top: 26px; }

	.rj-tablet-lab-section-title {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		height: 40px;
		align-items: center;
		gap: 10px;
		padding: 10px 20px 15px 0;
		border-bottom: 1px dashed #bcbcbc;
		color: #202020;
		font-family: 'Lato', sans-serif;
		font-size: 16px;
		font-weight: 500;
		line-height: normal;
		text-decoration: none;
	}

	.rj-tablet-lab-section-title img { width: 20px; height: 20px; object-fit: contain; }
	.rj-tablet-lab-earring-heading { position: relative; display: block; width: 43px; height: 13px; flex: none; }
	.rj-tablet-lab-earring-heading img { position: absolute; top: 0; object-fit: contain; }
	.rj-tablet-lab-earring-heading img:first-child { left: 0; width: 13px; height: 13px; }
	.rj-tablet-lab-earring-heading img:last-child { left: 17px; width: 26px; height: 13px; }

	.rj-tablet-lab-primary-links {
		display: flex;
		width: 480px;
		gap: 40px;
		margin: 20px auto 0;
	}

	.rj-tablet-lab-link-column {
		display: flex;
		width: 220px;
		flex-direction: column;
		gap: 12px;
	}

	.rj-tablet-lab-link {
		display: flex;
		width: 220px;
		height: 26px;
		align-items: center;
		justify-content: space-between;
		color: #606060;
		font-size: 16px;
		font-weight: 400;
		line-height: 26px;
		text-decoration: none;
	}

	.rj-tablet-lab-link img { width: 18px; height: 18px; flex: none; }
	.rj-tablet-lab--all-diamond .rj-tablet-lab-primary-links,
	.rj-tablet-lab--all-diamond .rj-tablet-lab-link-column,
	.rj-tablet-lab--all-diamond .rj-tablet-lab-primary .rj-tablet-lab-link { width: 480px; }

	.rj-tablet-lab-view-all {
		display: flex;
		box-sizing: border-box;
		width: 480px;
		height: 43px;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1px solid #555;
		border-radius: 3px;
		color: #303030;
		font-size: 14px;
		line-height: normal;
		margin: 20px auto 0;
		text-decoration: none;
	}

	.rj-tablet-lab-double-arrow { position: relative; display: block; width: 29px; height: 19px; }
	.rj-tablet-lab-double-arrow img { position: absolute; top: 0; width: 19px; height: 19px; }
	.rj-tablet-lab-double-arrow img:first-child { left: 0; }
	.rj-tablet-lab-double-arrow img:last-child { left: 10px; }

	.rj-tablet-lab-categories {
		box-sizing: border-box;
		width: 560px;
		margin-top: 24px;
		padding: 20px;
		background: #fafafa;
	}

	.rj-tablet-lab-categories .rj-tablet-lab-section-title { height: 44px; }
	.rj-tablet-lab-categories .rj-tablet-lab-section-title img { width: 26px; height: 19px; }

	.rj-tablet-lab-metals {
		box-sizing: border-box;
		width: 560px;
		margin-top: 24px;
		padding: 20px;
		background: #fafafa;
	}
	.rj-tablet-lab--all-diamond .rj-tablet-lab-metals { margin-top: 25px; padding-bottom: 26px; }

	.rj-tablet-lab-metals .rj-tablet-lab-section-title { height: 44px; }
	.rj-tablet-lab-metals .rj-tablet-lab-section-title img { width: 24px; height: 24px; }
	.rj-tablet-lab-metal-grid {
		display: grid;
		grid-template-columns: repeat(2, 220px);
		gap: 16px 40px;
		width: 480px;
		margin: 21px auto 0;
	}

	.rj-tablet-lab-metal { display: flex; min-width: 0; flex-direction: column; gap: 6px; }
	.rj-tablet-lab-metal-name {
		display: flex;
		align-items: center;
		gap: 8px;
		color: #404040;
		font-family: 'Sarala', sans-serif;
		font-size: 13px;
		line-height: 21px;
		text-decoration: none;
	}

	.rj-tablet-lab-swatch { width: 17px; height: 17px; flex: none; border-radius: 50%; }
	.rj-tablet-lab-swatch--white { background: linear-gradient(220.6deg, #e8e8e8 28.66%, #fff 38.95%, #efefef 48.86%, #e8e8e8 70.84%); }
	.rj-tablet-lab-swatch--yellow { background: linear-gradient(220.6deg, #ffc200 28.66%, #ffe48f 38.95%, #ffc200 49.42%, #ffc200 70.84%); }
	.rj-tablet-lab-swatch--rose { background: linear-gradient(218.66deg, rgba(255, 102, 102, 0.5) 27.78%, #ffeaea 38.54%, #ffb9b9 48.89%, #ff9090 71.86%); }
	.rj-tablet-lab-swatch--yellow-white { background: linear-gradient(40deg, #ffc200 28.66%, #ffefbe 42.86%, rgba(239, 239, 239, 0.46) 54.42%, rgba(255, 194, 0, 0.46) 69.83%); }
	.rj-tablet-lab-swatch--rose-white { background: linear-gradient(220.6deg, rgba(255, 102, 102, 0.5) 27.78%, #fff 40%, #efefef 51%, #ff9090 72%); }
	.rj-tablet-lab-stamps { display: flex; gap: 6px; }
	.rj-tablet-lab-stamps a {
		display: flex;
		width: 50px;
		height: 25px;
		align-items: center;
		justify-content: center;
		border: 0.8px solid #ededed;
		border-radius: 2px;
		background: #fafafa;
		color: #505050;
		font-family: 'Sarala', sans-serif;
		font-size: 12px;
		text-decoration: none;
	}

	.rj-tablet-lab-grid-links {
		display: grid;
		grid-template-columns: repeat(2, 220px);
		gap: 12px 40px;
		width: 480px;
		margin: 21px auto 0;
	}

	.rj-tablet-lab-price { width: 520px; margin: 24px 20px 0; }
	.rj-tablet-lab-price .rj-tablet-lab-section-title { height: 49px; padding-block: 15px; }
	.rj-tablet-lab-price .rj-tablet-lab-section-title img { width: 19px; height: 19px; }

	.rj-tablet-lab-collection {
		position: relative;
		box-sizing: border-box;
		width: 560px;
		margin-top: 24px;
		padding: 20px 20px 108px;
		overflow: hidden;
		background: #fafafa;
		font-family: 'Lato', sans-serif;
	}
	.rj-tablet-lab--all-diamond .rj-tablet-lab-collection { min-height: 477px; margin-top: 25px; }

	.rj-tablet-lab-collection-head {
		position: relative;
		z-index: 1;
		display: flex;
		width: 516px;
		height: 44px;
		align-items: center;
		justify-content: space-between;
		padding: 10px 0 15px;
		border-bottom: 1px dashed #bcbcbc;
		color: #202020;
		font-size: 16px;
		font-weight: 500;
	}

	.rj-tablet-lab-collection-head a {
		display: flex;
		align-items: center;
		gap: 5px;
		color: #4699ff;
		text-decoration: none;
	}

	.rj-tablet-lab-more-arrows { position: relative; display: block; width: 17px; height: 11px; }
	.rj-tablet-lab-more-arrows img { position: absolute; top: 0; width: 11px; height: 11px; }
	.rj-tablet-lab-more-arrows img:first-child { left: 0; }
	.rj-tablet-lab-more-arrows img:last-child { left: 6px; }

	.rj-tablet-lab-products {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 13px;
		margin-top: 21px;
	}

	.rj-tablet-lab-product {
		display: flex;
		box-sizing: border-box;
		width: 520px;
		height: 89px;
		align-items: flex-start;
		gap: 12px;
		padding: 5px;
		border-radius: 8px;
		background: #f7f7f7;
		color: #303030;
		text-decoration: none;
	}

	.rj-tablet-lab-product > img { width: 79px; height: 79px; flex: none; border-radius: 5px; object-fit: cover; }

	.rj-tablet-lab-product > span {
		display: flex;
		min-width: 0;
		flex-direction: column;
		padding-top: 5px;
	}

	.rj-tablet-lab-product strong { font-family: 'Sarala', sans-serif; font-size: 13px; font-weight: 400; line-height: 21px; }
	.rj-tablet-lab-product small {
		display: -webkit-box;
		width: 326px;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		color: #707070;
		font-size: 10px;
		font-weight: 400;
		line-height: 13px;
	}

	.rj-tablet-lab-ring-art { position: absolute; right: -6px; bottom: -96px; width: 216px; height: 218px; opacity: 0.85; }
	.rj-tablet-lab-ring-art img { position: absolute; object-fit: contain; }
	.rj-tablet-lab-ring-main { right: 22px; top: 0; width: 141px; height: 141px; transform: rotate(-90deg); }
	.rj-tablet-lab-ring-side { right: 8px; top: 12px; width: 121px; height: 121px; }
	.rj-tablet-lab-earring-art { position: absolute; right: -4px; bottom: -90px; width: 216px; height: 218px; }
	.rj-tablet-lab-earring-piece { position: absolute; display: flex; align-items: center; justify-content: center; }
	.rj-tablet-lab-earring-piece > div { position: relative; overflow: hidden; }
	.rj-tablet-lab-earring-piece img { position: absolute; top: -195.31%; left: -163.95%; width: 336.91%; height: 360.63%; max-width: none; }
	.rj-tablet-lab-earring-piece--main { right: 17px; top: 0; width: 139px; height: 135px; }
	.rj-tablet-lab-earring-piece--main > div { width: 110px; height: 102px; transform: rotate(21deg); }
	.rj-tablet-lab-earring-piece--reflection { right: 14px; top: 75px; width: 150px; height: 150px; opacity: 0.4; }
	.rj-tablet-lab-earring-piece--reflection > div { width: 110px; height: 102px; transform: rotate(-45deg); }
	.rj-tablet-lab-earring-piece--small { right: 105px; top: 37px; width: 96px; height: 93px; }
	.rj-tablet-lab-earring-piece--small > div { width: 75px; height: 70px; transform: rotate(159deg) scaleY(-1); }

	.rj-tablet-lab a:hover,
	.rj-tablet-lab a:focus-visible { color: #cca646; }
	.rj-tablet-lab button:focus-visible,
	.rj-tablet-lab a:focus-visible { outline: 2px solid #cca646; outline-offset: 3px; }
</style>
