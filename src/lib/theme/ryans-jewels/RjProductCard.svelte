<script lang="ts">
	import { ChevronLeft, ChevronRight, Crown, Eye, Heart, LoaderCircle, ShoppingBag } from '@lucide/svelte'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { page } from '$app/state'
	import * as Dialog from '$lib/components/ui/dialog'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { metalSwatchFills } from './home-content.js'
	import { adjacentProductImage, discountPercent, listingImage, metalVariantChoices, productImages } from './product-details.logic.js'
	import { productRating } from './product-filters.js'
	import { canonicalProductPath, ryansSeoText, seoPlainText } from './seo.js'

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

	let quickViewOpen = $state(false)
	let quickViewFailed = $state(false)

	const currencyCode = $derived(page?.data?.store?.currency?.code || '')
	let selectedMetal = $state('')
	let loadedMetalProducts = $state<Record<string, any>>({})
	let productDetails = $state<any>(null)
	let productDetailsPromise: Promise<any> | undefined
	let detailsLoaded = $state(false)
	let detailsLoading = $state(false)
	let metalLoading = $state('')
	let activeImage = $state('')
	let hovered = $state(false)
	let focused = $state(false)
	let canAutoPlay = $state(false)
	let reducedMotion = $state(true)
	let imageDirection = $state(1)
	let mediaMessage = $state('')
	let mediaElement = $state<HTMLDivElement>()

	onMount(() => {
		if (!showSwatches || !globalThis.IntersectionObserver) return
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				observer.disconnect()
				void ensureDetails()
			}
		}, { rootMargin: '100px' })
		if (mediaElement) observer.observe(mediaElement)
		return () => observer.disconnect()
	})

	onMount(() => {
		const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
		const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
		const update = () => {
			reducedMotion = motion.matches
			canAutoPlay = pointer.matches && !motion.matches && !document.hidden
		}
		update()
		pointer.addEventListener('change', update)
		motion.addEventListener('change', update)
		document.addEventListener('visibilitychange', update)
		return () => {
			pointer.removeEventListener('change', update)
			motion.removeEventListener('change', update)
			document.removeEventListener('visibilitychange', update)
		}
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
	const description = $derived(seoPlainText(seoPlainText(ryansSeoText(selectedProduct?.description || selectedProduct?.shortDescription))))

	$effect(() => {
		if (!hovered || focused || quickViewOpen || !canAutoPlay || images.length < 2 || detailsLoading || metalLoading || mediaMessage) return
		const next = adjacentProductImage(images, displayedImage, 1)
		let cancelled = false
		const timer = window.setTimeout(async () => {
			const preview = new Image()
			preview.src = listingImage(next)
			try {
				await preview.decode()
				if (!cancelled) {
					imageDirection = 1
					activeImage = next
				}
			} catch { /* Keep the current photo if the next one cannot load. */ }
		}, 1500)
		return () => { cancelled = true; window.clearTimeout(timer) }
	})

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
		imageDirection = direction
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

<Dialog.Root bind:open={quickViewOpen}>
<article
	class="rj-card rj-card--{size}"
	data-testid="product-card-{product?.id}"
	onmouseenter={() => hovered = true}
	onmouseleave={() => hovered = false}
	onfocusin={() => focused = true}
	onfocusout={(event) => {
		if (quickViewOpen) { event.stopPropagation(); return }
		if (!event.currentTarget.contains(event.relatedTarget as Node | null)) focused = false
	}}
>
	<div bind:this={mediaElement} class="rj-card-media" class:has-ribbon={!!badgeLabel} class:has-offer={discount > 0} role="group" aria-label="{title} images" aria-busy={detailsLoading || !!metalLoading} onmouseenter={() => { void ensureDetails() }} onfocusin={() => { void ensureDetails() }}>
		<a class="rj-card-media-link" {href} aria-label={title || 'View product'}>
			{#if displayedImage}
				{#key displayedImage}
					<img
						src={listingImage(displayedImage)} alt={title} loading="lazy" decoding="async" fetchpriority="low"
						in:fly={{ x: imageDirection * (mediaElement?.clientWidth || 0), opacity: 1, duration: reducedMotion ? 0 : 450, easing: cubicOut }}
						out:fly={{ x: -imageDirection * (mediaElement?.clientWidth || 0), opacity: 1, duration: reducedMotion ? 0 : 450, easing: cubicOut }}
						onoutrostart={(event) => event.currentTarget.setAttribute('aria-hidden', 'true')}
					/>
				{/key}
			{:else}
				<span class="rj-card-media-empty" aria-hidden="true"></span>
			{/if}
		</a>
		{#if badgeLabel}<span class="rj-card-ribbon"><span class="rj-card-ribbon-face"><Crown size={12} strokeWidth={1.4} aria-hidden="true" />{badgeLabel}</span></span>{/if}
		{#if discount > 0}<span class="rj-card-offer" data-testid="product-card-discount"><span class="sr-only">Save{' '}</span>{discount}%</span>{/if}
		<span class="rj-card-wish rj-card-wish--static" aria-hidden="true"><Heart size={16} strokeWidth={1.25} aria-hidden="true" /></span>
		{#if canBrowse}
			<button class="rj-card-gallery-control is-previous" type="button" aria-label="Previous image of {title}" disabled={detailsLoading || !!metalLoading} onclick={(event) => { event.preventDefault(); event.stopPropagation(); void moveImage(-1) }}>{#if detailsLoading || metalLoading}<LoaderCircle size={14} class="animate-spin" aria-hidden="true" />{:else}<ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />{/if}</button>
			<button class="rj-card-gallery-control is-next" type="button" aria-label="Next image of {title}" disabled={detailsLoading || !!metalLoading} onclick={(event) => { event.preventDefault(); event.stopPropagation(); void moveImage(1) }}>{#if detailsLoading || metalLoading}<LoaderCircle size={14} class="animate-spin" aria-hidden="true" />{:else}<ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />{/if}</button>
		{/if}
		<div class="rj-card-actions">
			<Dialog.Trigger type="button" aria-label="Quick view {title}" disabled={!!metalLoading} onclick={(event) => {
				event.stopPropagation()
				event.currentTarget.focus()
				quickViewFailed = false
				void ensureDetails().then((details) => quickViewFailed = !details)
			}}><span class="rj-card-action-label"><Eye size={14} strokeWidth={1.5} aria-hidden="true" /><span>Quick view</span></span></Dialog.Trigger>
			<a {href} aria-label="Buy {title} now"><span class="rj-card-action-label"><ShoppingBag size={14} strokeWidth={1.5} aria-hidden="true" /><span>Buy Now</span></span></a>
		</div>
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
	</div>
</article>
	<Dialog.Content class="rj-card-preview">
		<div class="rj-preview-photo">
			{#if displayedImage}<img src={listingImage(displayedImage)} alt={title} />{/if}
			{#if images.length > 1}
				<button type="button" class="rj-preview-previous" aria-label="Previous preview photo" onclick={() => void moveImage(-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
				<button type="button" class="rj-preview-next" aria-label="Next preview photo" onclick={() => void moveImage(1)}><ChevronRight size={20} aria-hidden="true" /></button>
			{/if}
		</div>
		<div class="rj-preview-info">
			<p class="rj-preview-eyebrow">A closer look</p>
			<Dialog.Title level={2} class="rj-preview-title">{title}</Dialog.Title>
			<Dialog.Description class="rj-preview-description">{description || 'Discover the details and available options for this piece.'}</Dialog.Description>
			{#if hasPrice}<p class="rj-preview-price">{formatPrice(price, currencyCode)}{#if hasCompare}<s>{formatPrice(mrp, currencyCode)}</s>{/if}</p>{/if}
			{#if detailsLoading}<p class="rj-preview-status" role="status">Loading product details…</p>{:else if quickViewFailed}<p class="rj-preview-status" role="status">More details are available on the product page.</p>{/if}
			<a class="rj-preview-link" {href}>View full details <ChevronRight size={16} aria-hidden="true" /></a>
		</div>
	</Dialog.Content>
</Dialog.Root>

<style>
	.rj-card { display: flex; flex-shrink: 0; flex-direction: column; align-items: stretch; gap: 12px; width: 272px; min-width: 0; background: #fff; }
	.rj-card-media { position: relative; width: 100%; aspect-ratio: 1; overflow: hidden; border: 1px solid var(--rj-card-border, #f5edda); border-radius: 8px; background: #fff; }
	.rj-card-media.has-ribbon { overflow: visible; }
	.rj-card-media-link { position: absolute; inset: 0; display: block; overflow: hidden; border-radius: inherit; }
	.rj-card-media-link img { position: absolute; inset: 0; display: block; width: 100%; height: 100%; padding: 20px; object-fit: contain; transition: transform 250ms var(--rj-ease, ease); }
	.rj-card:hover .rj-card-media-link img { transform: scale(1.03); }
	.rj-card-media-empty { display: block; width: 100%; height: 100%; background: var(--rj-surface, #f4f4f4); }
	.rj-card-wish { position: absolute; top: 12px; left: 12px; display: grid; width: 32px; height: 32px; place-items: center; border: 0; border-radius: 50%; background: #fff; color: var(--rj-ink, #404040); }
	.rj-card-wish--static { pointer-events: none; }
	.rj-card-ribbon { position: absolute; z-index: 3; top: 12px; left: -8px; pointer-events: none; filter: drop-shadow(0 1px 1px rgb(81 55 15 / 18%)); }
	.rj-card-ribbon::after { content: ''; position: absolute; top: 100%; left: 0; width: 8px; height: 8px; background: #8b6b29; clip-path: polygon(0 0, 100% 0, 100% 100%); }
	.rj-card-ribbon-face { display: flex; min-height: 26px; align-items: center; gap: 6px; padding: 5px 19px 5px 18px; background: linear-gradient(110deg, #f5e3ac, var(--rj-gold, #cca646)); color: #51370f; clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 50%, 100% 100%, 0 100%); font-size: 10px; font-weight: 600; line-height: 1.5; letter-spacing: .055em; text-transform: uppercase; }
	.rj-card-media:is(.has-ribbon, .has-offer) .rj-card-wish { right: 12px; left: auto; }
	.rj-card-gallery-control { position: absolute; z-index: 2; top: 50%; display: grid; width: 32px; height: 32px; place-items: center; padding: 0; border: 0; border-radius: 50%; background: rgb(255 255 255 / 94%); color: var(--rj-ink, #404040); opacity: 0; pointer-events: none; cursor: pointer; transform: translateY(-50%); transition: opacity 160ms ease, background 160ms ease; }
	.rj-card-gallery-control.is-previous { left: 8px; }
	.rj-card-gallery-control.is-next { right: 8px; }
	.rj-card-media:hover .rj-card-gallery-control, .rj-card-media:focus-within .rj-card-gallery-control { opacity: 1; pointer-events: auto; }
	.rj-card-gallery-control:hover { background: var(--rj-cream, #faf6ea); }
	.rj-card-gallery-control:disabled { cursor: progress; }
	.rj-card-media-status { position: absolute; right: 8px; bottom: 62px; left: 8px; display: flex; align-items: center; justify-content: center; gap: 5px; padding: 4px 6px; background: rgb(255 255 255 / 94%); color: var(--rj-ink, #404040); font-size: 11px; line-height: 1.4; text-align: center; }
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
	.rj-card-offer { position: absolute; top: 12px; left: 12px; padding: 3px 7px; border: 1px solid var(--rj-gold, #cca646); border-radius: 2px; background: #fff; color: #795a20; font-size: 11px; line-height: 1.3; }
	.has-ribbon .rj-card-offer { top: 52px; }
	.rj-card-actions { position: absolute; z-index: 3; right: 8px; bottom: 8px; left: 8px; display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--rj-card-border, #f5edda); border-radius: 3px; background: rgb(255 255 255 / 98%); opacity: 0; pointer-events: none; transform: translateY(8px); transition: opacity 200ms ease, transform 200ms var(--rj-ease, ease); }
	.rj-card:hover .rj-card-actions, .rj-card:focus-within .rj-card-actions { opacity: 1; pointer-events: auto; transform: translateY(0); }
	.rj-card-actions :global(button), .rj-card-actions a { display: flex; align-items: center; justify-content: center; text-decoration: none; min-width: 0; min-height: 44px; padding: 8px 4px; border: 0; background: transparent; color: var(--rj-ink, #404040); font-size: 11px; font-weight: 600; line-height: 1.3; letter-spacing: .035em; text-transform: uppercase; cursor: pointer; transition: background-color 240ms ease; }
	.rj-card-actions a { position: relative; gap: 6px; color: #795a20; }
	.rj-card-actions a::before { position: absolute; top: 14px; bottom: 14px; left: 0; width: 1px; background: var(--rj-rule, #e1d6be); content: ''; }
	.rj-card-actions :global(button:hover), .rj-card-actions a:is(:hover, :focus-visible) { background: color-mix(in srgb, var(--rj-cream, #faf6ea) 45%, #fff); }
	.rj-card-action-label { display: inline-flex; align-items: center; justify-content: center; gap: 7px; line-height: 1; white-space: nowrap; transition: transform 260ms var(--rj-ease, ease); }
	.rj-card-action-label > span { display: block; line-height: 1.15; white-space: normal; text-align: center; }
	.rj-card-action-label :global(svg) { display: block; flex: 0 0 14px; transform: translateY(-1px); transition: transform 300ms var(--rj-ease, ease); }
	.rj-card-actions a::after { position: absolute; right: 22%; bottom: 8px; left: 22%; height: 1px; background: var(--rj-gold, #cca646); content: ''; opacity: .6; transform: scaleX(0); transform-origin: left; transition: transform 300ms var(--rj-ease, ease); }
	.rj-card-actions a:is(:hover, :focus-visible) .rj-card-action-label { transform: translateY(-1px); }
	.rj-card-actions a:is(:hover, :focus-visible) .rj-card-action-label :global(svg) { transform: translateY(-1px) rotate(-8deg); }
	.rj-card-actions a:is(:hover, :focus-visible)::after { transform: scaleX(1); }
	.rj-card-actions :global(button:focus-visible), .rj-card-actions a:focus-visible { outline: 2px solid var(--rj-ink, #404040); outline-offset: -3px; }
	.rj-card-actions :global(button:disabled) { cursor: progress; opacity: .6; }
	:global(.rj-card-preview) { z-index: 60; display: grid; grid-template-columns: 1fr 1fr; gap: 0; width: calc(100% - 32px); max-width: 880px; max-height: 85dvh; overflow-y: auto; padding: 0; border: 1px solid #e1d6be; border-radius: 8px; background: #fff; color: #404040; }
	:global(.rj-card-preview > button) { top: 8px; right: 8px; display: grid; width: 44px; height: 44px; place-items: center; background: #fff; color: #404040; }
	.rj-preview-photo { position: relative; display: grid; min-height: 330px; place-items: center; background: #faf6ea; }
	.rj-preview-photo img { width: 100%; height: 100%; max-height: 460px; padding: 28px; object-fit: contain; }
	.rj-preview-photo button { position: absolute; top: 50%; display: grid; width: 44px; height: 44px; place-items: center; border: 1px solid #e1d6be; border-radius: 50%; background: #fff; color: #404040; cursor: pointer; transform: translateY(-50%); }
	.rj-preview-previous { left: 12px; }
	.rj-preview-next { right: 12px; }
	.rj-preview-info { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 20px; padding: 56px 32px 36px; }
	.rj-preview-eyebrow { margin: 0; color: #795a20; font-size: 11px; line-height: 1.4; letter-spacing: .12em; text-transform: uppercase; }
	:global(.rj-card-preview .rj-preview-title) { margin: 0; color: #202020; font-family: 'Castoro', Georgia, serif !important; font-size: 28px; font-weight: 400; line-height: 1.3; }
	:global(.rj-preview-description) { display: -webkit-box; overflow: hidden; margin: 0; color: #606060; font-size: 14px; line-height: 1.6; -webkit-box-orient: vertical; -webkit-line-clamp: 4; }
	.rj-preview-price { display: flex; flex-wrap: wrap; align-items: baseline; gap: 12px; margin: 0; font-size: 20px; line-height: 1.4; }
	.rj-preview-price s { color: #606060; font-size: 14px; }
	.rj-preview-status { margin: 0; color: #606060; font-size: 12px; }
	.rj-preview-link { display: flex; min-height: 44px; align-items: center; justify-content: center; gap: 16px; padding: 10px 20px; border: 1px solid #cca646; border-radius: 3px; background: #faf6ea; color: #51370f; font-size: 14px; text-decoration: none; }
	.rj-preview-link:hover { background: #f3e8ca; }
	.rj-preview-info :is(a, button):focus-visible, .rj-preview-photo button:focus-visible { outline: 2px solid #404040; outline-offset: 2px; }
	.rj-card :is(a, button):focus-visible { outline: 2px solid var(--rj-ink, #404040); outline-offset: -3px; }
	.rj-card--listing { width: 100%; }
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) { .rj-card--default { width: 226px; } }
	@media (max-width: 639px) {
		.rj-card { width: 190px; }
		.rj-card--listing { width: 100%; }
		.rj-card-media-link img { padding: 12px; }
		.rj-card-info { padding-inline: 10px; }
		.rj-card-name { font-size: 14px; }
		.rj-card-wish { top: 8px; left: 8px; }
		.rj-card-media:is(.has-ribbon, .has-offer) .rj-card-wish { right: 8px; left: auto; }
		:global(.rj-card-preview) { grid-template-columns: 1fr; }
		.rj-preview-photo { min-height: 0; aspect-ratio: 1.25; }
		.rj-preview-photo img { height: 100%; min-height: 0; padding: 24px; }
		.rj-preview-info { gap: 16px; padding: 24px; }
		:global(.rj-card-preview .rj-preview-title) { font-size: 25px; }
	}
	@media (hover: none) { .rj-card-gallery-control, .rj-card-actions { opacity: 1; pointer-events: auto; } .rj-card-actions { transform: none; } }
	@media (prefers-reduced-motion: reduce) {
		.rj-card-media-link img, .rj-card-gallery-control, .rj-card-actions, .rj-card-actions :global(button), .rj-card-actions a, .rj-card-action-label, .rj-card-action-label :global(svg), .rj-card-actions a::after { transition: none; }
		.rj-card-actions a:is(:hover, :focus-visible) .rj-card-action-label { transform: none; }
		.rj-card-actions a:is(:hover, :focus-visible) .rj-card-action-label :global(svg) { transform: translateY(-1px); }
	}
</style>
