<script lang="ts">
 import { page, navigating } from '$app/state'
 import { goto } from '$app/navigation'
 import { tick } from 'svelte'
 import ListingGrid from '$lib/components/product-catalogue/listing-grid.svelte'
 import { clientFilterKeys, selectedValues, listingFilterOptions } from './product-filters.js'
 import { catalogNavigation } from './catalog-navigation.js'
 import { mainCategoryForUrl, categoryBanners } from './listing-content.js'
 import { listingImage } from './product-details.logic.js'
 const data = $derived(page.data)
 const mainCategory = $derived(mainCategoryForUrl(page.url))
 const banner = $derived(mainCategory ? categoryBanners[mainCategory.name] : null)
 const knownCategory = $derived(catalogNavigation.flatMap(item => item.children).find(item => { const target = new URL(item.href, page.url.origin); return target.searchParams.get('categories') === page.url.searchParams.get('categories') && target.searchParams.get('search') === page.url.searchParams.get('search') }))
 const categoryName = $derived(mainCategory?.name || knownCategory?.name || data.products?.categoryHierarchy?.at(-1)?.name || data.products?.category?.name || (page.params.slug ? page.params.slug.replaceAll('-', ' ') : 'All jewelry'))
 const groups = $derived(data.ryanFilterOptions || listingFilterOptions(data.products?.data || [], data.products?.facets?.allFilters))
 const count = $derived(data.products?.count || 0)
 const selectedSort = $derived(page.url.searchParams.get('uiSort') || page.url.searchParams.get('sort') || '')
 const busy = $derived(!!navigating.to)
 let filterOpen = $state(false)
 let filterButton: HTMLButtonElement
 let filterPanel: HTMLElement
 let closeButton: HTMLButtonElement
 let minPrice = $state('')
 let maxPrice = $state('')
 let priceError = $state('')
 $effect(() => { minPrice = page.url.searchParams.get('priceFrom') || ''; maxPrice = page.url.searchParams.get('priceTo') || ''; priceError = '' })
 const applied = $derived(clientFilterKeys.flatMap(key => selectedValues(page.url, key).map(value => ({key, value}))))
 const hasPrice = $derived(page.url.searchParams.has('priceFrom') || page.url.searchParams.has('priceTo'))
 function checked(key: string, value: string) { return selectedValues(page.url, key).includes(value) }
 async function navigate(url: URL) { url.searchParams.delete('page'); await goto(url, { noScroll: true, keepFocus: true }) }
 async function toggle(key: string, value: string) {
  const url = new URL(page.url); const values = selectedValues(url, key); const next = values.includes(value) ? values.filter(item => item !== value) : [...values, value]
  if(next.length) url.searchParams.set(key, next.join(',')); else url.searchParams.delete(key)
  await navigate(url)
 }
 async function clearFilters() {
  const url = new URL(page.url); [...clientFilterKeys, 'priceFrom', 'priceTo'].forEach(key => url.searchParams.delete(key)); await navigate(url)
 }
 async function applyPrice(event: SubmitEvent) {
  event.preventDefault(); const low = String(minPrice ?? '').trim(); const high = String(maxPrice ?? '').trim()
  if ((low && Number(low) < 0) || (high && Number(high) < 0) || (low && high && Number(low) > Number(high))) { priceError = 'Enter a minimum price below the maximum.'; return }
  priceError = ''; const url = new URL(page.url)
  for(const [key,value] of [['priceFrom',low],['priceTo',high]]) { if(value) url.searchParams.set(key,value); else url.searchParams.delete(key) }
  await navigate(url)
 }
 async function sort(value: string) {
  const url = new URL(page.url); url.searchParams.delete('sort'); url.searchParams.delete('uiSort')
  if(value) url.searchParams.set(value.startsWith('title:') ? 'uiSort' : 'sort', value)
  await navigate(url)
 }
 async function openFilters() { filterOpen = true; await tick(); closeButton?.focus() }
 async function closeFilters() { filterOpen = false; await tick(); filterButton?.focus() }
 function trap(event: KeyboardEvent) {
  if(!filterOpen || event.key !== 'Tab') return
  const controls = Array.from(filterPanel.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), summary, a[href]')).filter(el => el.getClientRects().length)
  const first = controls[0], last = controls.at(-1)
  if(event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
  else if(!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
 }
 $effect(() => {
  if(!filterOpen) return
  const before = document.body.style.overflow; document.body.style.overflow = 'hidden'
  return () => { document.body.style.overflow = before }
 })
</script>
<svelte:window onkeydown={(event) => { if(event.key === 'Escape' && filterOpen) closeFilters() }} />

{#if banner}
 <section class="category-banner" aria-labelledby="rj-listing-title">
  <div class="banner-copy"><p class="eyebrow">Ryan Jewelers</p><h1 id="rj-listing-title">{categoryName}</h1><p>{banner.copy}</p><a href="/">Home</a><span aria-hidden="true"> / </span><span>{categoryName}</span></div>
  <div class="banner-image" class:product-photo={banner.product} class:pendant-collection={!!banner.collection}>
   {#if banner.collection}{#each banner.collection as item}<img src={item.image} alt={item.alt} width="480" height="480" fetchpriority="high" />{/each}
   {:else}<img src={banner.image} alt={banner.alt} width="900" height="600" fetchpriority="high" />{/if}
  </div>
 </section>
{:else}
 <section class="rj-category-hero" aria-labelledby="rj-listing-title">
  <img class="rj-category-pattern" src="/ryans-jewels/listing/category-bg.png" alt="" aria-hidden="true" />
  <div class="rj-plp-width rj-category-inner"><div class="rj-category-copy"><h1 id="rj-listing-title">{categoryName}</h1><p>Home / Categories / {categoryName} - {count} Designs</p></div><div class="rj-category-model" aria-hidden="true"><img src="/ryans-jewels/listing/category-model.png" alt="" /></div></div>
 </section>
{/if}

{#if data.ryanSubcategories?.length}<nav class="category-styles rj-plp-width" aria-label="Shop {mainCategory?.name || 'jewelry'} by style">{#each data.ryanSubcategories as category}<a href={category.href}><span class="subcategory-image"><img src={listingImage(category.image)} alt={category.name} width="180" height="180" loading="lazy" decoding="async" /></span><span>{category.name}</span></a>{/each}</nav>{/if}
<section class="rj-plp-width listing-toolbar" aria-label="Product listing controls">
 <button class="mobile-filter-button" bind:this={filterButton} type="button" aria-expanded={filterOpen} aria-controls="listing-filters" onclick={openFilters}>Filters {applied.length || hasPrice ? `(${applied.length + Number(hasPrice)})` : ''}</button>
 <p aria-live="polite">{count.toLocaleString()} {count === 1 ? 'design' : 'designs'}</p>
 <label>Sort by <select aria-label="Sort products" value={selectedSort} disabled={busy} onchange={event => sort(event.currentTarget.value)}><option value="">Featured</option><option value="createdAt:desc">Newest</option><option value="price:asc">Price: low to high</option><option value="price:desc">Price: high to low</option><option value="title:asc">Name: A to Z</option><option value="title:desc">Name: Z to A</option></select></label>
</section>
<div class="rj-plp-width listing-layout">
 {#if filterOpen}<button class="filter-backdrop" type="button" aria-label="Close filters" onclick={closeFilters}></button>{/if}
 <aside id="listing-filters" class:open={filterOpen} bind:this={filterPanel} aria-label="Product filters" role={filterOpen ? 'dialog' : undefined} aria-modal={filterOpen ? 'true' : undefined} onkeydown={trap}>
  <header><h2>Filters</h2><button class="filter-close" bind:this={closeButton} type="button" aria-label="Close filters" onclick={closeFilters}>&times;</button></header>
  <div class="filter-content">
   <details open><summary>Price</summary><form onsubmit={applyPrice}><div class="price-fields"><label>Min ($)<input type="number" min="0" step="0.01" bind:value={minPrice} placeholder="0" aria-label="Minimum price" /></label><label>Max ($)<input type="number" min="0" step="0.01" bind:value={maxPrice} placeholder="Any" aria-label="Maximum price" /></label></div>{#if priceError}<p class="price-error" role="alert">{priceError}</p>{/if}<button class="price-apply" disabled={busy} type="submit">Apply price</button></form></details>
   {#each groups as group}<details open={['uiMaterial','uiKarat','uiShape','uiColor'].includes(group.key)}><summary>{group.label}</summary><div class="filter-options">{#each [...new Set([...group.values, ...selectedValues(page.url,group.key)])] as value}<label><input type="checkbox" checked={checked(group.key,value)} disabled={busy} onchange={() => toggle(group.key,value)} /><span>{value}</span></label>{/each}</div></details>{/each}
   <details><summary>Availability</summary><div class="filter-options">{#each ['In Stock','Out of stock'] as value}<label><input type="checkbox" checked={checked('uiStatus',value)} disabled={busy} onchange={() => toggle('uiStatus',value)} /><span>{value}</span></label>{/each}</div></details>
  </div>
  <footer><button class="clear" type="button" disabled={busy || (!applied.length && !hasPrice)} onclick={clearFilters}>Clear filters</button><button class="filter-done" type="button" onclick={closeFilters}>Show results</button></footer>
 </aside>
 <main class="product-results" aria-busy={busy}>
  {#if applied.length || hasPrice}<div class="active-filters" aria-label="Selected filters">{#each applied as item}<button type="button" disabled={busy} onclick={() => toggle(item.key,item.value)} aria-label="Remove {item.value} filter">{item.value}<span aria-hidden="true">&times;</span></button>{/each}{#if hasPrice}<button type="button" disabled={busy} onclick={async () => { const url = new URL(page.url); url.searchParams.delete('priceFrom'); url.searchParams.delete('priceTo'); await navigate(url) }} aria-label="Remove price filter">${page.url.searchParams.get('priceFrom') || '0'} - {page.url.searchParams.has('priceTo') ? '$'+page.url.searchParams.get('priceTo') : 'Any'} <span aria-hidden="true">&times;</span></button>{/if}</div>{/if}
  <ListingGrid />
 </main>
</div>

<style>
 .rj-plp-width { width: min(calc(100% - 80px), 1440px); margin-inline: auto; }
 .category-banner { display: grid; grid-template-columns: 1fr 1fr; height: 260px; background: #f5f1e9; overflow: hidden; }
 .banner-copy { align-self: center; padding: 28px max(40px, calc((100vw - 1440px) / 2)); padding-right: 24px; }
 .eyebrow { margin: 0 0 12px; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: #8d7137; }
 .banner-copy h1 { margin: 0 0 14px; font-size: 40px; line-height: 1.15; }
 .banner-copy > p:not(.eyebrow) { max-width: 330px; font-size: 15px; line-height: 1.6; color: #6e675b; margin: 0 0 23px; }
 .banner-copy a, .banner-copy > span { font-size: 11px; color: #756d61; text-decoration: none; }
 .banner-image { min-width: 0; overflow: hidden; }
 .banner-image img { width: 100%; height: 100%; object-fit: cover; object-position: center 45%; }
 .banner-image.product-photo { background: #faf8f3; } .product-photo img { object-fit: contain; mix-blend-mode: multiply; }
 .banner-image.pendant-collection { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: center; gap: 8px; padding: 20px; background: #f5f1e9; }
 .pendant-collection img { height: auto; aspect-ratio: 1; }
 .pendant-collection img:nth-child(2) { transform: translateY(16px); }
 .category-styles { display: flex; justify-content: safe center; gap: 18px; overflow-x: auto; padding-block: 24px 10px; scrollbar-width: thin; scroll-snap-type: x proximity; }
 .category-styles a { display: flex; flex-direction: column; gap: 10px; flex: 0 0 150px; color: #514b40; font-size: 12px; line-height: 1.4; text-align: center; text-decoration: none; scroll-snap-align: start; }
 .subcategory-image { display: block; aspect-ratio: 1; overflow: hidden; border: 1px solid #eee9df; border-radius: 4px; background: #faf9f6; }
 .subcategory-image img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; transition: transform .2s ease; }
 .category-styles a:hover { color: #987428; } .category-styles a:hover img { transform: scale(1.04); }
 .listing-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding-block: 23px; border-bottom: 1px solid #e8e3da; font-size: 13px; }
 .listing-toolbar p { margin: 0; color: #6c655a; }
 .listing-toolbar label { display: flex; align-items: center; gap: 12px; }
 select { border: 1px solid #ded8cc; border-radius: 3px; padding: 10px 30px 10px 12px; background: white; font-size: 13px; color: #38332a; }
 .listing-layout { display: grid; grid-template-columns: 235px minmax(0,1fr); gap: 34px; margin-top: 26px; margin-bottom: 65px; align-items: start; }
 aside { min-width: 0; }
 aside header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
 aside h2 { font-size: 23px; margin: 0; }
 details { border-bottom: 1px solid #e8e3da; padding: 17px 0; }
 summary { cursor: pointer; font-size: 14px; font-weight: 500; list-style: none; display: flex; justify-content: space-between; }
 summary::after { content: '+'; color: #8b7952; } details[open] > summary::after { content: '-'; }
 summary::-webkit-details-marker { display: none; }
 .filter-options { display: flex; flex-direction: column; gap: 13px; margin-top: 18px; max-height: 245px; overflow-y: auto; padding: 1px; }
 .filter-options label { display: flex; gap: 10px; align-items: center; font-size: 13px; color: #5c554a; cursor: pointer; }
 input[type='checkbox'] { width: 16px; height: 16px; accent-color: #aa8536; flex-shrink: 0; }
 .price-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
 .price-fields label { font-size: 11px; color: #777064; }
 .price-fields input { box-sizing: border-box; display: block; width: 100%; min-width: 0; margin-top: 6px; padding: 9px; border: 1px solid #ddd6c9; border-radius: 3px; font-size: 13px; }
 button { cursor: pointer; }
 button:disabled { opacity: .55; cursor: default; }
 .price-apply { background: #fff; border: 1px solid #ad8a3e; color: #715722; padding: 9px 14px; font-size: 12px; width: 100%; margin-top: 12px; border-radius: 3px; }
 .price-error { font-size: 12px; color: #9b2424; }
 aside footer { padding-top: 20px; }
 .clear { border: 0; background: transparent; padding: 0; text-decoration: underline; text-underline-offset: 3px; font-size: 12px; }
 .active-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
 .active-filters button { display: inline-flex; align-items: center; gap: 12px; padding: 8px 12px; border: 1px solid #e5dac4; background: #faf7ef; border-radius: 3px; font-size: 12px; }
 .product-results { min-width: 0; }
 .mobile-filter-button, .filter-close, .filter-done { display: none; }
 .filter-backdrop { position: fixed; inset: 0; background: #0005; border: 0; z-index: 99; }
 a:focus-visible, button:focus-visible, summary:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid #a17d2f; outline-offset: 3px; }
 /* Preserve the existing banner for subcategories. */
 .rj-category-hero { position: relative; height: 260px; overflow: hidden; background: #fff; }
 .rj-category-pattern { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
 .rj-category-inner { position: relative; display: flex; height: 100%; align-items: center; justify-content: space-between; }
 .rj-category-copy h1 { margin: 0 0 6px; font-size: 28px; text-transform: capitalize; }
 .rj-category-copy p { margin: 0; font-size: 16px; color: #a2a2a2; }
 .rj-category-model { position: relative; width: 322px; height: 260px; overflow: hidden; flex: 0 0 322px; }
 .rj-category-model img { position: absolute; top: -52.47%; left: 0; width: 100%; height: 152.58%; max-width: none; }
 @media (max-width: 1000px) {
  .rj-plp-width { width: calc(100% - 40px); } .banner-copy { padding-left: 25px; }
  .listing-layout { grid-template-columns: minmax(0,1fr); }
  .mobile-filter-button { display: block; background: white; border: 1px solid #ded8cc; border-radius: 3px; padding: 10px 16px; font-size: 13px; }
  aside { position: fixed; inset: 0 auto 0 0; width: min(360px, 90vw); background: white; z-index: 100; padding: 24px; box-sizing: border-box; display: none; flex-direction: column; }
  aside.open { display: flex; } .filter-content { overflow-y: auto; flex: 1; min-height: 0; padding-right: 4px; }
  .filter-close { display: block; font-size: 28px; background: transparent; border: 0; padding: 3px 10px; }
  aside footer { display: flex; justify-content: space-between; align-items: center; padding-top: 18px; gap: 16px; }
  .filter-done { display: block; border: 0; border-radius: 3px; padding: 12px 20px; background: #a88538; color: white; font-size: 13px; }
 }
 @media (max-width: 639px) {
  .rj-plp-width { width: calc(100% - 30px); }
  .category-banner { height: 225px; grid-template-columns: 52% 48%; }
  .category-banner:has(.pendant-collection) { height: auto; grid-template-columns: 1fr; }
  .banner-image.pendant-collection { padding: 0 16px 18px; gap: 0; }
  .pendant-collection img:nth-child(2) { transform: translateY(8px); }
  .banner-copy { padding: 20px 15px; } .banner-copy h1 { font-size: 28px; } .banner-copy > p:not(.eyebrow) { font-size: 12px; line-height: 1.5; margin-bottom: 16px; }
  .eyebrow { font-size: 9px; } .banner-image img { object-position: 65% center; }
  .category-styles { padding-top: 16px; gap: 12px; } .category-styles a { flex-basis: 112px; font-size: 11px; }
  .listing-toolbar { flex-wrap: wrap; padding-block: 17px; gap: 10px; } .listing-toolbar label { margin-left: auto; font-size: 11px; gap: 6px; } select { max-width: 145px; font-size: 11px; padding: 10px 20px 10px 8px; } .listing-toolbar p { font-size: 11px; }
  .listing-layout { margin-top: 20px; margin-bottom: 35px; }
  .rj-category-hero { height: 155px; } .rj-category-model { width: 135px; height: 155px; flex-basis: 135px; } .rj-category-copy h1 { font-size: 23px; } .rj-category-copy p { font-size: 11px; }
 }
</style>
