<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { getDesktopFilterState } from '$lib/core/composables/index.js'
	import ListingGrid from '$lib/components/product-catalogue/listing-grid.svelte'
	import RjInstagram from './RjInstagram.svelte'
	import { facetOptions } from './product-filters.js'

	const sortOptions = [
		['select', 'Select one'],
		['default', 'Default Sorting'],
		['createdAt:desc', 'Whats New Arrival'],
		['popularity:desc', 'Sort By Popularity'],
		['rating:desc', 'Sort By Average Rating'],
		['updatedAt:desc', 'Sort By Latest'],
		['price:asc', 'Sort By Price: Low To High'],
		['price:desc', 'Sort By Price: High To Low'],
		['title:asc', 'Alphabetically: A to Z'],
		['title:desc', 'Alphabetically: Z to A']
	] as const
	const localSorts = new Set(['default', 'rating:desc', 'title:asc', 'title:desc'])

	const data = $derived(page.data)
	const filterState = getDesktopFilterState()
	let selectedSort = $state(page.url.searchParams.get('uiSort') ?? page.url.searchParams.get('sort') ?? 'position')
	let filterOpen = $state(false)
	let filterHidden = $state(false)
	let listView = $state(false)
	let showAllCategories = $state(false)
	let showAllQualities = $state(false)
	let showAllFeatured = $state(false)
	let openSections = $state<Record<string, boolean>>({
		status: true, categories: true, price: true, material: true,
		shape: true, quality: true, weight: true, featured: true
	})

	const categoryName = $derived(
		data.products?.categoryHierarchy?.at(-1)?.name || data.products?.category?.name || 'Wedding Rings'
	)
	const categories = $derived(filterState.categories || [])
	const visibleCategories = $derived(showAllCategories ? categories : categories.slice(0, 6))
	const statuses = ['In Stock', 'Out of stock', 'Best seller', 'Top Rated', 'Featured products']
	const materials = $derived(facetOptions(filterState.allFilters, ['attributes.Metal_Type', 'attributes.Metal_Color', 'options.Material', 'options.Metal_Type', 'options.Metal_Color'], /gold|silver|platinum|metal/i))
	const shapes = $derived(facetOptions(filterState.allFilters, ['attributes.Stone_Shape', 'attributes.Center_Stone_Shape', 'attributes.Side_Stone_Shape', 'options.Center_Stone']))
	const qualities = $derived(facetOptions(filterState.allFilters, ['attributes.Stone_Quality', 'options.Stone_Quality']))
	const visibleQualities = $derived(showAllQualities ? qualities : qualities.slice(0, 5))
	const weights = $derived(facetOptions(filterState.allFilters, ['attributes.Total_Carat_Weight_Range', 'attributes.Center_Stone_Ctw', 'options.Carat_Weight']))
	const featuredProducts = $derived(data.products?.data || [])
	const featured = $derived(showAllFeatured ? featuredProducts : featuredProducts.slice(0, 3))
	const shapeIcons = new Set(['oval', 'radiant', 'pear', 'cushion', 'princess', 'asscher', 'emerald', 'marquise', 'heart'])
	filterState.searchQuery = page.url.searchParams.get('search') ?? ''

	$effect(() => {
		filterState.searchQuery = page.url.searchParams.get('search') ?? ''
		selectedSort = page.url.searchParams.get('uiSort') ?? page.url.searchParams.get('sort') ?? 'position'
	})

	function checked(key: string, value: string) {
		return filterState.selectedGeneralFilters?.[key]?.includes(value) || false
	}

	function toggleFilter(key: string, value: string, event: Event) {
		filterState.handleGeneralFiltersChange({ key, value, checked: (event.currentTarget as HTMLInputElement).checked })
	}

	function toggleSection(section: string) {
		openSections[section] = !openSections[section]
	}

	function shapeIcon(name: string) {
		const icon = name.toLowerCase().replace(/[^a-z]/g, '')
		return shapeIcons.has(icon) ? icon : ''
	}

	async function selectCategory(category: Record<string, string>) {
		const url = new URL(page.url)
		url.searchParams.set('categories', category.slug || category.name)
		url.searchParams.delete('page')
		filterOpen = false
		await goto(url, { replaceState: true })
	}

	async function applySort(event: Event) {
		selectedSort = (event.currentTarget as HTMLSelectElement).value
		const url = new URL(page.url)
		url.searchParams.delete('page')
		url.searchParams.delete('sort')
		url.searchParams.delete('uiSort')
		if (localSorts.has(selectedSort)) url.searchParams.set('uiSort', selectedSort)
		else if (selectedSort !== 'position' && selectedSort !== 'select') url.searchParams.set('sort', selectedSort)
		await goto(url, { replaceState: true })
	}
</script>

<section class="rj-category-hero" aria-labelledby="rj-listing-title">
	<img class="rj-category-pattern" src="/ryans-jewels/listing/category-bg.png" alt="" aria-hidden="true" />
	<div class="rj-plp-width rj-category-inner">
		<div class="rj-category-copy">
			<h1 id="rj-listing-title">{categoryName}</h1>
			<p>Home / Categories / Ring’s / {categoryName} - {data.products?.count || 265} Design</p>
		</div>
		<div class="rj-category-model" aria-hidden="true">
			<img src="/ryans-jewels/listing/category-model.png" alt="" />
		</div>
	</div>
</section>

<section class="rj-plp-toolbar" aria-label="Product listing controls">
	<div class="rj-plp-width rj-toolbar-row">
		<div class="rj-toolbar-left">
			<button
				class="rj-toolbar-button rj-filter-toggle"
				class:filter-hidden={filterHidden}
				class:filter-open={filterOpen}
				type="button"
				onclick={() => { filterOpen = true; filterHidden = !filterHidden }}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path class="rj-filter-lines" d="M4 7h16M4 17h16" />
					<path class="rj-filter-knob rj-filter-knob--top" d="M15 4v6" />
					<path class="rj-filter-knob rj-filter-knob--bottom" d="M7 14v6" />
				</svg>
				<span class="rj-hide-label">{filterHidden ? 'Show Filter' : 'Hide Filter'}</span><span class="rj-mobile-label">Filter</span>
			</button>
			<span class="rj-toolbar-divider"></span>
			<label class="rj-sort"><span>Sort by:</span><select value={selectedSort} onchange={applySort} aria-label="Sort products">
				<option value="position" hidden>Position</option>
				{#each sortOptions as option}<option value={option[0]}>{option[1]}</option>{/each}
			</select></label>
			<span class="rj-toolbar-divider"></span>
			<button class="rj-toolbar-button rj-refresh" type="button" onclick={() => location.reload()}>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6v5h-5M4 18v-5h5M6.1 9A7 7 0 0 1 18.5 6.5L20 11M4 13l1.5 4.5A7 7 0 0 0 18 15" /></svg>Refresh
			</button>
		</div>
		<div class="rj-view-controls"><span>View as</span>
			<button class="rj-view-grid" class:active={!listView} type="button" aria-label="Grid view" onclick={() => listView = false}>
				<svg viewBox="0 0 28 30" aria-hidden="true"><rect x="1" y="1" width="10" height="12" rx="2"/><rect x="17" y="1" width="10" height="12" rx="2"/><rect x="1" y="17" width="10" height="12" rx="2"/><rect x="17" y="17" width="10" height="12" rx="2"/></svg>
			</button>
			<button class="rj-view-list" class:active={listView} type="button" aria-label="List view" onclick={() => listView = true}>
				<svg viewBox="0 0 28 30" aria-hidden="true"><rect x="1" y="1" width="26" height="11" rx="2"/><rect x="1" y="18" width="26" height="11" rx="2"/></svg>
			</button>
		</div>
	</div>
</section>

<div class="rj-plp-width rj-products-layout" class:filter-hidden={filterHidden} class:list-view={listView}>
	{#if filterOpen}<button class="rj-filter-backdrop" aria-label="Close filters" onclick={() => filterOpen = false}></button>{/if}
	<aside class="rj-sidebar" class:open={filterOpen} aria-label="Product filters">
		<div class="rj-sidebar-content">
		<button class="rj-filter-close" type="button" aria-label="Close filters" onclick={() => filterOpen = false}>×</button>
		<label class="rj-filter-search">
			<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>
			<input bind:value={filterState.searchQuery} onkeydown={(event) => event.key === 'Enter' && filterState.handleApply()} placeholder="Search" />
		</label>

		<div class="rj-filter-section">
			<h2><button class="rj-section-toggle" type="button" onclick={() => toggleSection('status')} aria-expanded={openSections.status}>Products Status <span class:closed={!openSections.status}>⌃</span></button></h2>
			{#if openSections.status}<div class="rj-filter-options">
				{#each statuses as item}<label><input type="checkbox" checked={checked('uiStatus', item)} onchange={(e) => toggleFilter('uiStatus', item, e)} /><span>{item}</span></label>{/each}
			</div>{/if}
		</div>

		<div class="rj-filter-section">
			<h2><button class="rj-section-toggle" type="button" onclick={() => toggleSection('categories')} aria-expanded={openSections.categories}>Shop by Categories <span class:closed={!openSections.categories}>⌃</span></button></h2>
			{#if openSections.categories}<div class="rj-filter-options">
				{#each visibleCategories as category}<button class="rj-category-filter" type="button" onclick={() => selectCategory(category)}><span class="rj-faux-check"></span><span>{category.name}</span><b>+</b></button>{/each}
			</div>
			{#if categories.length > 6}<button class="rj-see-more" type="button" onclick={() => showAllCategories = !showAllCategories}>{showAllCategories ? 'Show Less ↑' : 'See More ↓'}</button>{/if}{/if}
		</div>

		<div class="rj-filter-section">
			<h2><button class="rj-section-toggle" type="button" onclick={() => toggleSection('price')} aria-expanded={openSections.price}>Filter by price <span class:closed={!openSections.price}>⌃</span></button></h2>
			{#if openSections.price}<div class="rj-price-controls">
				<div class="rj-range-wrap">
					<input type="range" bind:value={filterState.minPrice} min={filterState.minPossiblePrice || 0} max={filterState.maxPossiblePrice || 10000} onchange={filterState.handleMinPriceChange} aria-label="Minimum price" />
					<input type="range" bind:value={filterState.maxPrice} min={filterState.minPossiblePrice || 0} max={filterState.maxPossiblePrice || 10000} onchange={filterState.handleMaxPriceChange} aria-label="Maximum price" />
				</div>
				<button type="button" onclick={filterState.handleApply}>GO</button>
			</div>
			<p class="rj-price-copy">Up to $2000<br />Over $2000</p>{/if}
		</div>

		{#if materials.length}<div class="rj-filter-section">
			<h2><button class="rj-section-toggle" type="button" onclick={() => toggleSection('material')} aria-expanded={openSections.material}>Filter by Material <span class:closed={!openSections.material}>⌃</span></button></h2>
			{#if openSections.material}<div class="rj-filter-options">
				{#each materials as item}<label><input type="checkbox" checked={checked('uiMaterial', item.name)} onchange={(e) => toggleFilter('uiMaterial', item.name, e)} /><span>{item.name}</span></label>{/each}
			</div>{/if}
		</div>{/if}

		{#if shapes.length}<div class="rj-filter-section">
			<h2><button class="rj-section-toggle" type="button" onclick={() => toggleSection('shape')} aria-expanded={openSections.shape}>Stone Shape <span class:closed={!openSections.shape}>⌃</span></button></h2>
			{#if openSections.shape}<div class="rj-shapes">
				{#each shapes as shape}<label><input class="sr-only" type="checkbox" checked={checked('uiShape', shape.name)} onchange={(e) => toggleFilter('uiShape', shape.name, e)} />{#if shapeIcon(shape.name)}<img src="/ryans-jewels/shapes/{shapeIcon(shape.name)}.svg" alt="" />{/if}<span>{shape.name}</span></label>{/each}
			</div>{/if}
		</div>{/if}

		{#if qualities.length}<div class="rj-filter-section">
			<h2><button class="rj-section-toggle" type="button" onclick={() => toggleSection('quality')} aria-expanded={openSections.quality}>Stone Quality <span class:closed={!openSections.quality}>⌃</span></button></h2>
			{#if openSections.quality}<div class="rj-filter-options compact">
				{#each visibleQualities as item}<label><input type="checkbox" checked={checked('uiQuality', item.name)} onchange={(e) => toggleFilter('uiQuality', item.name, e)} /><span>{item.name}</span></label>{/each}
			</div>
			{#if qualities.length > 5}<button class="rj-see-more" type="button" onclick={() => showAllQualities = !showAllQualities}>{showAllQualities ? 'Show Less ↑' : 'See More ↓'}</button>{/if}{/if}
		</div>{/if}

		{#if weights.length}<div class="rj-filter-section">
			<h2><button class="rj-section-toggle" type="button" onclick={() => toggleSection('weight')} aria-expanded={openSections.weight}>Total Craft Wight <span class:closed={!openSections.weight}>⌃</span></button></h2>
			{#if openSections.weight}<div class="rj-filter-options compact">
				{#each weights as item}<label><input type="checkbox" checked={checked('uiWeight', item.name)} onchange={(e) => toggleFilter('uiWeight', item.name, e)} /><span>{item.name}</span><small>{item.count}</small></label>{/each}
			</div>{/if}
		</div>{/if}

		<div class="rj-featured">
			<h2><button class="rj-section-toggle" type="button" onclick={() => toggleSection('featured')} aria-expanded={openSections.featured}>Featured Product <span class:closed={!openSections.featured}>⌃</span></button></h2>
			{#if openSections.featured}{#each featured as product}
				<a href="/products/{product.slug}"><span class="rj-featured-image">{#if product.thumbnail || product.image_url}<img src={product.thumbnail || product.image_url} alt="" />{/if}</span><span><b>{product.title || product.name}</b><i>★★★★</i><small>{formatPrice(product.price, data.store?.currency?.code)}</small></span></a>
			{/each}
			{#if featuredProducts.length > 3}<button class="rj-see-more" type="button" onclick={() => showAllFeatured = !showAllFeatured}>{showAllFeatured ? 'Show Less ↑' : 'See More ↓'}</button>{/if}{/if}
		</div>
		</div>
	</aside>

	<main class="rj-product-results">
		<ListingGrid ryanLayout={listView ? 'list' : 'grid'} />
	</main>
</div>

<RjInstagram />

<style>
	:global(body:has(.rj-category-hero)) { overflow-x: hidden; }
	.rj-plp-width { width: min(calc(100% - clamp(40px, 8.333vw, 160px)), 1760px); margin-inline: auto; }
	.rj-category-hero { position: relative; height: 260px; overflow: hidden; background: #fff; font-family: 'Sarala', var(--font-body, sans-serif); }
	.rj-category-pattern { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
	.rj-category-inner { position: relative; display: flex; height: 100%; align-items: center; justify-content: space-between; }
	.rj-category-copy { display: flex; flex-direction: column; gap: 6px; z-index: 1; }
	.rj-category-copy h1 { margin: 0; font-family: 'Sarala', sans-serif; font-size: 28px; line-height: normal; letter-spacing: 0; color: #404040; text-transform: capitalize; }
	.rj-category-copy p { margin: 0; font-size: 16px; line-height: normal; color: #a2a2a2; text-transform: capitalize; }
	.rj-category-model { position: relative; width: 322px; height: 260px; overflow: hidden; flex: 0 0 322px; }
	.rj-category-model img { position: absolute; top: -52.47%; left: 0; width: 100%; height: 152.58%; max-width: none; }
	.rj-plp-toolbar { margin-top: 23px; border-bottom: 1px solid #d9d9d9; font-family: 'Sarala', var(--font-body, sans-serif); }
	.rj-toolbar-row { display: flex; align-items: center; justify-content: space-between; height: 33px; padding-bottom: 23px; box-sizing: content-box; }
	.rj-toolbar-left, .rj-toolbar-button, .rj-sort, .rj-view-controls { display: flex; align-items: center; }
	.rj-toolbar-left { gap: 15px; }
	.rj-toolbar-button { gap: 8px; padding: 0; border: 0; background: transparent; font: inherit; font-size: 18px; line-height: 26px; color: #505050; cursor: pointer; }
	.rj-toolbar-button svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.35; }
	.rj-filter-toggle .rj-filter-lines { transition: opacity .25s ease; }
	.rj-filter-toggle .rj-filter-knob { transition: transform .5s cubic-bezier(.34, 1.56, .64, 1); }
	.rj-filter-toggle.filter-hidden .rj-filter-lines { opacity: .72; }
	.rj-filter-toggle.filter-hidden .rj-filter-knob--top { transform: translateX(-8px); }
	.rj-filter-toggle.filter-hidden .rj-filter-knob--bottom { transform: translateX(8px); }
	.rj-toolbar-divider { width: 1px; height: 22px; background: #d9d9d9; }
	.rj-sort { gap: 15px; font-size: 18px; line-height: 26px; color: #202020; }
	.rj-sort select { width: 149px; border: 0; outline: 0; background: transparent; font: inherit; color: #606060; cursor: pointer; }
	.rj-refresh { gap: 15px; }
	.rj-refresh svg { width: 24px; height: 24px; }
	.rj-view-controls { gap: 12px; font-size: 18px; color: #505050; }
	.rj-view-controls > span { margin-right: 8px; }
	.rj-view-controls button { width: 28px; height: 31px; padding: 0; border: 0; color: #505050; background: transparent; cursor: pointer; }
	.rj-view-controls button:first-of-type { color: #cca646; }
	.rj-view-controls button.active { color: #cca646; }
	.rj-view-controls button:not(.active) { color: #505050; }
	.rj-view-controls svg { width: 100%; height: 100%; }
	.rj-view-grid svg { fill: currentColor; }
	.rj-view-list svg { fill: none; stroke: currentColor; stroke-width: 1.5; }
	.rj-mobile-label { display: none; }
	.rj-products-layout { display: grid; grid-template-columns: 307px minmax(0, 1fr); column-gap: 29px; margin-top: 26px; margin-bottom: 170px; align-items: start; transition: grid-template-columns .45s cubic-bezier(.22, 1, .36, 1), column-gap .45s cubic-bezier(.22, 1, .36, 1); }
	.rj-products-layout.filter-hidden { grid-template-columns: 0 minmax(0, 1fr); column-gap: 0; }
	.rj-sidebar { position: relative; width: 307px; overflow: hidden; opacity: 1; transform: translateX(0); visibility: visible; transition: width .45s cubic-bezier(.22, 1, .36, 1), opacity .22s ease, transform .45s cubic-bezier(.22, 1, .36, 1), visibility 0s; }
	.rj-products-layout.filter-hidden .rj-sidebar { width: 0; opacity: 0; transform: translateX(-22px); visibility: hidden; pointer-events: none; transition: width .45s cubic-bezier(.22, 1, .36, 1), opacity .18s ease, transform .45s cubic-bezier(.22, 1, .36, 1), visibility 0s .45s; }
	.rj-sidebar-content { display: flex; flex-direction: column; gap: 23px; width: 307px; font-family: 'Sarala', var(--font-body, sans-serif); color: #404040; background: #fff; }
	.rj-filter-close { display: none; }
	.rj-filter-search { display: flex; align-items: center; gap: 10px; height: 42px; padding: 8px 10px; border: 1px solid #e1d6be; border-radius: 5px; }
	.rj-filter-search svg { width: 18px; height: 18px; fill: none; stroke: #707070; stroke-width: 1.5; }
	.rj-filter-search input { min-width: 0; flex: 1; border: 0; outline: 0; font: inherit; font-size: 17px; color: #707070; background: transparent; }
	.rj-filter-section, .rj-featured { display: flex; flex-direction: column; gap: 20px; }
	.rj-filter-section h2, .rj-featured h2 { display: flex; align-items: center; justify-content: space-between; margin: 0; font-family: 'Sarala', sans-serif; font-size: 20px; font-weight: 400; line-height: 26px; letter-spacing: 0; color: #202020; }
	.rj-filter-section h2 span, .rj-featured h2 span { font-size: 15px; }
	.rj-section-toggle { display: flex; width: 100%; align-items: center; justify-content: space-between; padding: 0; border: 0; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
	.rj-section-toggle span { transition: transform .2s ease; }
	.rj-section-toggle span.closed { transform: rotate(180deg); }
	.rj-filter-options { display: flex; flex-direction: column; gap: 16px; padding-left: 11px; }
	.rj-filter-options label, .rj-category-filter { display: flex; align-items: center; gap: 10px; min-height: 26px; font-size: 16px; line-height: 26px; color: #505050; cursor: pointer; }
	.rj-filter-options input, .rj-faux-check { width: 18px; height: 18px; margin: 0; border: 1px solid #505050; border-radius: 2px; accent-color: #cca646; flex: 0 0 18px; }
	.rj-category-filter { width: 100%; padding: 0; border: 0; background: transparent; text-align: left; font-family: inherit; }
	.rj-category-filter b { margin-left: auto; font-size: 20px; font-weight: 400; }
	.rj-see-more { align-self: center; padding: 0; border: 0; border-bottom: 1px solid #101010; background: transparent; font: 12px/20px 'Sarala', sans-serif; color: #101010; cursor: pointer; }
	.rj-price-controls { display: flex; align-items: center; justify-content: space-between; width: 295px; }
	.rj-price-controls > button { width: 70px; height: 34px; border: 1px solid #404040; border-radius: 5px; background: #fff; font: 14px 'Sarala', sans-serif; }
	.rj-range-wrap { position: relative; width: 210px; height: 20px; }
	.rj-range-wrap input { position: absolute; inset: 0; width: 210px; margin: 0; appearance: none; pointer-events: none; background: transparent; }
	.rj-range-wrap input::-webkit-slider-runnable-track { height: 2px; background: #cca646; }
	.rj-range-wrap input::-webkit-slider-thumb { width: 12px; height: 12px; margin-top: -5px; appearance: none; border: 2px solid #cca646; border-radius: 50%; background: #fff; pointer-events: auto; }
	.rj-price-copy { margin: -5px 0 0; font-size: 14px; line-height: 29px; }
	.rj-shapes { display: flex; flex-direction: column; gap: 10px; padding-left: 6px; }
	.rj-shapes label { display: flex; align-items: center; gap: 10px; min-height: 36px; cursor: pointer; }
	.rj-shapes img { width: 20px; max-height: 37px; }
	.rj-shapes span { font-size: 16px; text-transform: capitalize; }
	.rj-filter-options.compact label { min-height: 23px; font-size: 14px; line-height: 23px; }
	.rj-filter-options label small { margin-left: auto; font-size: 14px; }
	.rj-featured { padding-top: 23px; border-top: 1px solid #efefef; }
	.rj-featured a { display: flex; gap: 15px; width: 250px; color: inherit; text-decoration: none; }
	.rj-featured-image { width: 88px; height: 88px; border-radius: 5px; background: rgba(136,136,136,.05); flex: 0 0 88px; }
	.rj-featured-image img { width: 100%; height: 100%; object-fit: contain; border-radius: 5px; }
	.rj-featured a > span:last-child { display: flex; flex-direction: column; gap: 3px; padding-top: 4px; }
	.rj-featured b { font-size: 16px; line-height: 24px; font-weight: 400; }
	.rj-featured i { font-size: 14px; font-style: normal; letter-spacing: 1px; color: #fca01f; }
	.rj-featured small { font-size: 13px; color: #b1b1b1; }
	.rj-product-results { min-width: 0; }
	.rj-filter-backdrop { display: none; }

	@media (min-width: 1600px) { .rj-products-layout { column-gap: 40px; } .rj-products-layout.filter-hidden { column-gap: 0; } }
	@media (max-width: 1100px) {
		.rj-products-layout, .rj-products-layout.filter-hidden { grid-template-columns: minmax(0, 1fr); }
		.rj-sidebar, .rj-products-layout.filter-hidden .rj-sidebar { position: fixed; z-index: 1002; top: 0; bottom: 0; left: 0; width: min(360px, 90vw); padding: 28px 26px 50px; overflow-y: auto; opacity: 1; visibility: visible; pointer-events: auto; transform: translateX(-101%); transition: transform .4s cubic-bezier(.22, 1, .36, 1); box-shadow: 8px 0 28px rgba(0,0,0,.12); }
		.rj-sidebar-content { width: 100%; }
		.rj-sidebar.open { transform: translateX(0); }
		.rj-filter-toggle.filter-hidden .rj-filter-lines { opacity: 1; }
		.rj-filter-toggle.filter-hidden .rj-filter-knob { transform: none; }
		.rj-filter-toggle.filter-open .rj-filter-lines { opacity: .72; }
		.rj-filter-toggle.filter-open .rj-filter-knob--top { transform: translateX(-8px); }
		.rj-filter-toggle.filter-open .rj-filter-knob--bottom { transform: translateX(8px); }
		.rj-filter-close { position: absolute; top: 4px; right: 12px; display: block; border: 0; background: transparent; font-size: 28px; }
		.rj-filter-backdrop { position: fixed; z-index: 1001; inset: 0; display: block; border: 0; background: rgba(0,0,0,.28); }
		.rj-hide-label { display: none; } .rj-mobile-label { display: inline; }
	}
	@media (max-width: 767px) {
		.rj-plp-width { width: calc(100% - 28px); }
		.rj-category-hero { height: 180px; }
		.rj-category-copy h1 { font-size: 23px; }
		.rj-category-copy p { max-width: 230px; font-size: 12px; }
		.rj-category-model { width: 185px; flex-basis: 185px; height: 180px; margin-right: -35px; }
		.rj-category-model img { top: -30%; height: 140%; }
		.rj-toolbar-row { height: 30px; padding-bottom: 15px; }
		.rj-plp-toolbar { margin-top: 15px; }
		.rj-toolbar-left { gap: 9px; }
		.rj-toolbar-divider, .rj-refresh, .rj-view-controls > span { display: none; }
		.rj-toolbar-button, .rj-sort { font-size: 14px; gap: 6px; }
		.rj-sort select { width: 95px; font-size: 13px; }
		.rj-view-controls { gap: 7px; }
		.rj-view-controls button { width: 22px; height: 24px; }
		.rj-products-layout { margin-top: 20px; margin-bottom: 80px; }
	}
	@media (max-width: 430px) {
		.rj-category-model { width: 145px; flex-basis: 145px; }
		.rj-category-copy p { max-width: 190px; }
	}
	@media (prefers-reduced-motion: reduce) {
		.rj-products-layout, .rj-sidebar, .rj-filter-toggle .rj-filter-lines, .rj-filter-toggle .rj-filter-knob { transition: none; }
	}
</style>
