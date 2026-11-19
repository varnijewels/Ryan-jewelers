<script lang="ts">
	import { ChevronLeft, ChevronRight, Crown, Heart, LoaderCircle } from '@lucide/svelte'
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { metalSwatchFills } from './home-content.js'
	import { adjacentProductImage, discountPercent, listingImage, metalVariantChoices, productImages } from './product-details.logic.js'
	import { productRating } from './product-filters.js'
	import { canonicalProductPath } from './seo.js'

	let {
		product,
		aspectRatio = '1:1',
		size = 'default',
		showSwatches = true,
		imageOverride = '',
		badgeLabel = ''
	}: {
		product: any
		aspectRatio?: string
		size?: 'default' | 'wide' | 'listing'
		showSwatches?: boolean
		imageOverride?: string
		badgeLabel?: string
	} = $props()

	const currencyCode = $derived(page?.data?.store?.currency?.code || '')
	let selectedMetal = $state('')
	let loadedMetalProducts = $state<Record<string, any>>({})
	let productDetails = $state<any>(null)
	let productDetailsPromise: Promise<any> | undefined
	let detailsLoaded = $state(false)
	let detailsLoading = $state(false)
	let metalLoading = $state('')
	let activeImage = $state('')
	let mediaMessage = $state('')
	let mediaElement: HTMLDivElement

	onMount(() => {
		if (!showSwatches || !globalThis.IntersectionObserver) return
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				observer.disconnect()
				void ensureDetails()
			}
		}, { rootMargin: '100px' })
		observer.observe(mediaElement)
		return () => observer.disconnect()
	})

	const detailedProduct = $derived(productDetails || product)
	const swatches = $derived(metalVariantChoices(detailedProduct))
	const selectedChoice = $derived(swatches.find((choice) => choice.value === selectedMetal))
	const loadedMetalProduct = $derived(selectedChoice ? loadedMetalProducts[selectedChoice.key] : null)
	const selectedProduct = $derived(loadedMetalProduct || selectedChoice?.product || detailedProduct)
	const title = $derived(selectedProduct?.title || selectedProduct?.name || product?.title || product?.name || '')
	const href = $derived(canonicalProductPath(selectedProduct || product) + (selectedChoice?.variant?.id ? `?variant_id=${encodeURIComponent(selectedChoice.variant.id)}` : ''))
	const variantImages = $derived(selectedChoice?.variant ? productImages({}, selectedChoice.variant) : [])
	const image = $derived(imageOverride || variantImages[0] || selectedProduct?.thumbnail || selectedProduct?.img || selectedProduct?.image || selectedProduct?.image_url || '')
	const images = $derived([...new Set([image, ...(variantImages.length ? variantImages : productImages(selectedProduct, null))].filter(Boolean))])
	const displayedImage = $derived(images.includes(activeImage) ? activeImage : images[0] || '')
	const canBrowse = $derived(images.length > 1 || (!!image && !!product?.slug && !detailsLoaded))
	const category = $derived(product?.category?.name || product?.categoryName || product?.collection?.name || '')
	const price = $derived(selectedChoice?.variant?.price ?? selectedProduct?.price ?? detailedProduct?.price)
	const mrp = $derived(Number(selectedChoice?.variant?.mrp ?? selectedProduct?.mrp ?? detailedProduct?.mrp))
	const hasPrice = $derived(price != null && String(price).trim() !== '' && Number.isFinite(Number(price)) && Number(price) >= 0)
	const hasCompare = $derived(hasPrice && Number.isFinite(mrp) && mrp > Number(price))
	const discount = $derived(hasCompare ? discountPercent(Number(price), mrp) : 0)
	const rating = $derived(productRating(product))

	async function loadProduct(slug: string) {
		try {
			const response = await fetch(`/api/products/${slug}`, { headers: { 'x-litekart-store': page?.data?.store?.id || '' } })
			if (!response.ok) return null
			const details = await response.json()
			return details && typeof details === 'object' && (details.id || details.slug) ? details : null
		} catch {
			return null
		}
	}

	async function ensureDetails() {
		if (detailsLoaded || !product?.slug) return productDetails || product
		if (productDetailsPromise) return productDetailsPromise
		detailsLoading = true
		productDetailsPromise = loadProduct(product.slug).then((details) => {
			if (details) {
				productDetails = details
				detailsLoaded = true
			}
			return details
		}).finally(() => {
			detailsLoading = false
			productDetailsPromise = undefined
		})
		return productDetailsPromise
	}

	async function moveImage(direction: -1 | 1) {
		mediaMessage = ''
		if (images.length < 2 && !detailsLoaded && product?.slug) {
			if (!await ensureDetails()) {
				mediaMessage = 'Could not load more photos. Try again.'
				return
			}
		}
		activeImage = adjacentProductImage(images, displayedImage, direction)
	}

	async function selectMetal(choice: (typeof swatches)[number]) {
		if (metalLoading) return
		metalLoading = choice.key
		mediaMessage = ''
		try {
			const details = choice.variant || choice.product ? detailedProduct : await ensureDetails()
			if (!details) {
				mediaMessage = 'Could not load this metal. Try again.'
				return
			}
			const resolvedChoice = metalVariantChoices(details).find((item) => item.key === choice.key) || choice
			if (!resolvedChoice.variant && !resolvedChoice.product && metalVariantChoices(details).length > 1) {
				mediaMessage = 'This metal is not available for this product.'
				return
			}
			const targetSlug = resolvedChoice.product?.slug
			if (targetSlug && !loadedMetalProducts[choice.key]) {
				const selectedDetails = targetSlug === details.slug ? details : await loadProduct(targetSlug)
				if (!selectedDetails) {
					mediaMessage = 'Could not load this metal. Try again.'
					return
				}
				loadedMetalProducts = { ...loadedMetalProducts, [choice.key]: selectedDetails }
			}
			selectedMetal = resolvedChoice.value
			activeImage = ''
		} finally {
			metalLoading = ''
		}
	}
</script>

<article class="rj-card rj-card--{size}" data-testid="product-card-{product?.id}">
	<div bind:this={mediaElement} class="rj-card-media" class:has-ribbon={!!badgeLabel} role="group" aria-label="{title} images" aria-busy={detailsLoading || !!metalLoading} onmouseenter={() => { void ensureDetails() }} onfocusin={() => { void ensureDetails() }}>
		<a class="rj-card-media-link" {href} aria-label={title || 'View product'}>
			{#if displayedImage}
				<img src={listingImage(displayedImage)} alt={title} loading="lazy" decoding="async" fetchpriority="low" />
			{:else}
				<span class="rj-card-media-empty" aria-hidden="true"></span>
			{/if}
		</a>
		{#if badgeLabel}<span class="rj-card-ribbon"><span class="rj-card-ribbon-face"><Crown size={12} strokeWidth={1.4} aria-hidden="true" />{badgeLabel}</span></span>{/if}
		<span class="rj-card-wish rj-card-wish--static" aria-hidden="true"><Heart size={16} strokeWidth={1.25} aria-hidden="true" /></span>
		{#if canBrowse}
			<button class="rj-card-gallery-control is-previous" type="button" aria-label="Previous image of {title}" disabled={detailsLoading || !!metalLoading} onclick={(event) => { event.preventDefault(); event.stopPropagation(); void moveImage(-1) }}>{#if detailsLoading || metalLoading}<LoaderCircle size={14} class="animate-spin" aria-hidden="true" />{:else}<ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />{/if}</button>
			<button class="rj-card-gallery-control is-next" type="button" aria-label="Next image of {title}" disabled={detailsLoading || !!metalLoading} onclick={(event) => { event.preventDefault(); event.stopPropagation(); void moveImage(1) }}>{#if detailsLoading || metalLoading}<LoaderCircle size={14} class="animate-spin" aria-hidden="true" />{:else}<ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />{/if}</button>
		{/if}
		{#if detailsLoading || metalLoading}
			<span class="rj-card-media-status" role="status"><LoaderCircle size={12} class="animate-spin" aria-hidden="true" />{metalLoading ? 'Updating metal…' : 'Loading photos…'}</span>
		{:else if mediaMessage}
			<span class="rj-card-media-status" role="status">{mediaMessage}</span>
		{/if}
	</div>
	<div class="rj-card-info">
		<div class="rj-card-text">
			<a class="rj-card-name" {href} title={title}>{title}</a>
			<div class="rj-card-meta">
				{#if category}<span class="rj-card-category">{category}</span>{/if}
				{#if rating}<span class="rj-card-rating" aria-label="Rating {rating} out of 5"><img class="rj-card-star" src="/ryans-jewels/home/star.svg" alt="" aria-hidden="true" /><img class="rj-card-star" src="/ryans-jewels/home/star.svg" alt="" aria-hidden="true" /><span class="rj-card-rating-value">{rating}</span></span>{/if}
			</div>
		</div>
		<div class="rj-card-price-row">
			{#if hasPrice}
				<p class="rj-card-price"><span data-testid="product-card-selling-price">{formatPrice(price, currencyCode)}</span>{#if hasCompare}<s class="rj-card-mrp" data-testid="product-card-mrp">{formatPrice(mrp, currencyCode)}</s>{/if}</p>
			{/if}
			{#if showSwatches && swatches.length}
				<ul class="rj-card-swatches" aria-label="Metal colors">
					{#each swatches as choice (choice.key)}
						<li><button class="rj-card-swatch" class:selected={choice.value === selectedMetal} type="button" title={choice.value} aria-label="Select {choice.value}" aria-pressed={choice.value === selectedMetal} disabled={!!metalLoading} onclick={(event) => { event.stopPropagation(); void selectMetal(choice) }} style="background-image: {metalSwatchFills[choice.key]};">{#if metalLoading === choice.key}<LoaderCircle size={14} class="animate-spin" aria-hidden="true" />{/if}</button></li>
					{/each}
				</ul>
			{/if}
		</div>
		{#if discount > 0}<p class="rj-card-discount" data-testid="product-card-discount">{discount}% off on product</p>{/if}
	</div>
</article>

<style>
	.rj-card { display: flex; flex-shrink: 0; flex-direction: column; align-items: stretch; gap: 12px; width: 272px; min-width: 0; background: #fff; }
	.rj-card-media { position: relative; width: 100%; aspect-ratio: 1; overflow: hidden; border: 1px solid var(--rj-card-border, #f5edda); border-radius: 8px; background: #fff; }
	.rj-card-media-link { position: absolute; inset: 0; display: block; border-radius: inherit; }
	.rj-card-media-link img { display: block; width: 100%; height: 100%; padding: 20px; object-fit: contain; transition: transform 250ms var(--rj-ease, ease); }
	.rj-card:hover .rj-card-media-link img { transform: scale(1.03); }
	.rj-card-media-empty { display: block; width: 100%; height: 100%; background: var(--rj-surface, #f4f4f4); }
	.rj-card-wish { position: absolute; top: 12px; left: 12px; display: grid; width: 32px; height: 32px; place-items: center; border: 0; border-radius: 50%; background: #fff; color: var(--rj-ink, #404040); }
	.rj-card-wish--static { pointer-events: none; }
	.rj-card-ribbon { position: absolute; z-index: 3; top: 12px; left: 0; pointer-events: none; }
	.rj-card-ribbon::after { content: ''; position: absolute; top: 100%; left: 0; width: 7px; height: 7px; background: #8b6b29; clip-path: polygon(0 0, 100% 0, 100% 100%); }
	.rj-card-ribbon-face { display: flex; min-height: 26px; align-items: center; gap: 6px; padding: 5px 19px 5px 10px; background: linear-gradient(110deg, #f5e3ac, var(--rj-gold, #cca646)); color: #51370f; clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 50%, 100% 100%, 0 100%); font-size: 10px; font-weight: 600; line-height: 1.5; letter-spacing: .055em; text-transform: uppercase; }
	.rj-card-media.has-ribbon .rj-card-wish { right: 12px; left: auto; }
	.rj-card-gallery-control { position: absolute; z-index: 2; top: 50%; display: grid; width: 32px; height: 32px; place-items: center; padding: 0; border: 0; border-radius: 50%; background: rgb(255 255 255 / 94%); color: var(--rj-ink, #404040); opacity: 0; pointer-events: none; cursor: pointer; transform: translateY(-50%); transition: opacity 160ms ease, background 160ms ease; }
	.rj-card-gallery-control.is-previous { left: 8px; }
	.rj-card-gallery-control.is-next { right: 8px; }
	.rj-card-media:hover .rj-card-gallery-control, .rj-card-media:focus-within .rj-card-gallery-control { opacity: 1; pointer-events: auto; }
	.rj-card-gallery-control:hover { background: var(--rj-cream, #faf6ea); }
	.rj-card-gallery-control:disabled { cursor: progress; }
	.rj-card-media-status { position: absolute; right: 8px; bottom: 8px; left: 8px; display: flex; align-items: center; justify-content: center; gap: 5px; padding: 4px 6px; background: rgb(255 255 255 / 94%); color: var(--rj-ink, #404040); font-size: 11px; line-height: 1.4; text-align: center; }
	.rj-card-info { display: flex; width: 100%; min-width: 0; flex-direction: column; align-items: stretch; gap: 6px; padding: 0 16px; }
	.rj-card-price-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 8px; }
	.rj-card-swatches { display: flex; flex: 0 0 auto; align-items: center; gap: 1px; margin: 0 0 0 auto; padding: 0; list-style: none; }
	.rj-card-swatches li { display: flex; }
	.rj-card-swatch { width: 24px; height: 24px; padding: 4px; border: 0; border-radius: 50%; background-color: transparent; background-clip: content-box; cursor: pointer; }
	.rj-card-swatch.selected { outline: 1px solid var(--rj-ink, #404040); outline-offset: -2px; }
	.rj-card-swatch:disabled { cursor: progress; opacity: .55; }
	.rj-card-text { width: 100%; min-width: 0; }
	.rj-card-name { display: block; width: 100%; overflow: hidden; color: var(--rj-ink, #404040); font-size: 16px; font-weight: 400; line-height: 1.5; text-align: left; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
	.rj-card-name:hover { color: #8b6b29; }
	.rj-card-meta { display: none; }
	.rj-card-price { display: flex; flex: 1 1 90px; flex-wrap: wrap; align-items: baseline; gap: 5px 12px; margin: 0; color: var(--rj-ink, #404040); font-size: 16px; font-weight: 400; line-height: 1.4; text-align: left; }
	.rj-card-mrp { color: var(--rj-ink-2, #606060); font-size: 12px; font-weight: 400; text-decoration: line-through; }
	.rj-card-discount { margin: 0; color: #8b6b29; font-size: 13px; font-weight: 400; line-height: 1.4; }
	.rj-card :is(a, button):focus-visible { outline: 2px solid var(--rj-ink, #404040); outline-offset: -3px; }
	.rj-card--listing { width: 100%; }
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) { .rj-card--default { width: 226px; } }
	@media (max-width: 639px) {
		.rj-card { width: 190px; }
		.rj-card--listing { width: 100%; }
		.rj-card-media-link img { padding: 12px; }
		.rj-card-info { padding-inline: 10px; }
		.rj-card-name { font-size: 14px; }
		.rj-card-discount { font-size: 12px; }
		.rj-card-wish { top: 8px; left: 8px; }
		.rj-card-media.has-ribbon .rj-card-wish { right: 8px; left: auto; }
	}
	@media (hover: none) { .rj-card-gallery-control { opacity: 1; pointer-events: auto; } }
	@media (prefers-reduced-motion: reduce) { .rj-card-media-link img, .rj-card-gallery-control { transition: none; } }
</style>
