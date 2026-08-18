
<script lang="ts">
	import { goto, preloadData } from '$app/navigation'
	import { page } from '$app/state'
	import { onMount } from 'svelte'
	import { toast } from 'svelte-sonner'
	import { dateOnly, formatPrice, time, timestampToAgo } from '$lib/core/utils/index.js'
	import { productService } from '$lib/core/services/index.js'
	import { useProductState } from '$lib/core/composables/index.js'
	import LoginModal from '$lib/components/auth/login-modal.svelte'
	import RjCarousel from './RjCarousel.svelte'
	import RjProductCustomizer from './RjCustomizeModal.svelte'
	import RjInstagram from './RjInstagram.svelte'
	import RjProductCard from './RjProductCard.svelte'
	import { productRating, withoutDemoProducts } from './product-filters.js'
	import RjWideBanner from './RjWideBanner.svelte'
	import { customizationOptions, diamondImageForShape, discountPercent, groupedProductForAttribute, groupedProductForSelections, groupedValuesForAttribute, metalColorImage, metalColorTone, productAttributeValue, productDetailParagraphs, productImages, toggleStoredId, variantForOption, variantForSelections } from './product-details.logic.js'

	const COMPARE_STORAGE_KEY = 'ryans-jewels-compare-products'

	const productState = useProductState()
	const data = $derived(page.data)
	let selectedProduct = $state<any>(null)
	let pageProductSlug = $state('')
	const product = $derived(selectedProduct || data?.product || {})
	const variants = $derived(product?.variants || [])
	const currency = $derived(data?.store?.currency?.code || 'USD')
	let selectedVariant = $state<any>(null)
	let activeImage = $state('')
	let relatedProducts = $state<any[]>([])
	let relatedLoading = $state(false)
	let wishlistLoading = $state(false)
	let compared = $state(false)
	let postalCode = $state('')
	let locating = $state(false)
	let activeTab = $state<'details' | 'reviews'>('details')
	let visibleReviewCount = $state(2)
	let customizationRequest = 0

	$effect(() => {
		const slug = data?.product?.slug || ''
		if (slug === pageProductSlug) return
		pageProductSlug = slug
		selectedProduct = null
	})

	$effect(() => {
		if (!selectedVariant || !variants.some((variant: any) => variant.id === selectedVariant.id)) {
			selectedVariant = variants.find((variant: any) => variant.stock > 0) || variants[0] || product
		}
		productState.selectedVariant = selectedVariant || {}
	})

	const images = $derived(productImages(product, selectedVariant))
	$effect(() => {
		if (!images.includes(activeImage)) activeImage = images[0] || ''
		productState.selectedImage = activeImage
	})

	const price = $derived(Number(selectedVariant?.price ?? product?.price ?? 0))
	const mrp = $derived(Number(selectedVariant?.mrp ?? product?.mrp ?? price))
	const discount = $derived(discountPercent(price, mrp))
	const category = $derived(product?.category?.name || [...(product?.categoryHierarchy || [])].reverse().find((item: any) => item.name !== product.title)?.name || '')
	const ratings = $derived(Array.isArray(product?.ratings) ? product.ratings : [])
	const rating = $derived(productRating(product))
	const reviewCount = $derived(Number(product?.reviewCount ?? product?.ratingCount ?? ratings.length) || ratings.length)
	const inStock = $derived(!product?.manageInventory || Number(selectedVariant?.stock ?? product?.stock ?? 0) > 0)
	const attributes = $derived(Array.isArray(product?.attributes) ? product.attributes : [])
	const detailSku = $derived(selectedVariant?.sku || product?.sku || product?.id || '')
	const detailParagraphs = $derived(productDetailParagraphs(product?.description, product?.subtitle))
	const metalType = $derived(productAttributeValue(attributes, /metal\s*type/i))
	const metalColor = $derived(productAttributeValue(attributes, /metal\s*color/i))
	const caratWeight = $derived(productAttributeValue(attributes, /(carat|diamond).*weight|weight.*(carat|diamond)/i))
	const stoneQuality = $derived(productAttributeValue(attributes, /(stone|diamond).*quality|quality.*(stone|diamond)/i))
	const stoneShape = $derived(productAttributeValue(attributes, /(center\s*)?(stone|diamond).*shape|shape.*(stone|diamond)/i))
	const diamondImage = $derived(diamondImageForShape(stoneShape))
	const stoneSetting = $derived(productAttributeValue(attributes, /(center\s*)?(stone|diamond).*setting|setting.*(stone|diamond)/i))
	const stoneType = $derived(productAttributeValue(attributes, /(stone|diamond)\s*type|type.*(stone|diamond)/i) || (/lab[\s-]*grown/i.test(`${product?.title || ''} ${product?.description || ''}`) ? 'Lab Grown Diamond' : /diamond/i.test(`${product?.title || ''} ${product?.description || ''}`) ? 'Natural Diamond' : ''))
	const ringSize = $derived(productAttributeValue(attributes, /ring\s*size/i))
	const ringHeight = $derived(selectedVariant?.height || product?.height || productAttributeValue(attributes, /ring\s*height/i))
	const dimensionUnit = $derived(selectedVariant?.dimensionUnit || product?.dimensionUnit || 'mm')
	const detailImage = $derived(images[1] || activeImage)
	const goldInfo = $derived([metalType, metalColor, product?.weight ? `${product.weight} ${product.weightUnit || 'g'}` : ''].filter(Boolean).join(' · ') || 'Metal details unavailable')
	const dimensionInfo = $derived([
		product?.width ? `${product.width} ${product.dimensionUnit || 'mm'} Width` : '',
		product?.height ? `${product.height} ${product.dimensionUnit || 'mm'} Height` : '',
		product?.len ? `${product.len} ${product.dimensionUnit || 'mm'} Length` : '',
		ringSize ? `Ring Size ${ringSize}` : ''
	].filter(Boolean).join(' × ') || 'Dimensions unavailable')
	const diamondInfo = $derived([stoneQuality, caratWeight, stoneShape].filter(Boolean).join(' · ') || 'Diamond details unavailable')
	const diamondMeta = $derived([stoneSetting ? `${stoneSetting} setting` : '', ringSize ? `Size ${ringSize}` : ''].filter(Boolean).join(' · '))
	const productOptions = $derived(Array.isArray(product?.options) ? product.options : productState.productOptions || [])
	const optionCards = $derived(customizationOptions(productOptions, attributes))
	const metalColorOption = $derived(productOptions.find((option: any) => /\bmetal\s*color\b/i.test(option.title || option.type || '')))
	const caratWeightOption = $derived(productOptions.find((option: any) => /(carat|diamond).*weight|weight.*(carat|diamond)/i.test(option.title || option.type || '')))
	const ringSizeOption = $derived(productOptions.find((option: any) => /ring\s*size|^size$/i.test(option.title || option.type || '')))
	const stoneShapeOption = $derived(productOptions.find((option: any) => /(center\s*)?(stone|diamond).*shape|shape.*(stone|diamond)|diamond\s*cut/i.test(option.title || option.type || '')))
	const stoneTypeOption = $derived(productOptions.find((option: any) => /(stone|diamond)\s*type|type.*(stone|diamond)/i.test(option.title || option.type || '')))
	const metalColorAggregationKey = $derived(Object.keys(product?.ag || {}).find((key) => /\bmetal\s*color\b/i.test(key)) || '')
	const caratWeightAggregationKey = $derived(Object.keys(product?.ag || {}).find((key) => /(carat|diamond).*weight|weight.*(carat|diamond)/i.test(key)) || '')
	const ringSizeAggregationKey = $derived(Object.keys(product?.ag || {}).find((key) => /ring\s*size/i.test(key)) || '')
	const stoneShapeAggregationKey = $derived(Object.keys(product?.ag || {}).find((key) => /(center\s*)?(stone|diamond).*shape|shape.*(stone|diamond)/i.test(key)) || '')
	const stoneTypeAggregationKey = $derived(Object.keys(product?.ag || {}).find((key) => /(stone|diamond)\s*type|type.*(stone|diamond)/i.test(key)) || '')
	const groupedProducts = $derived(Array.isArray(product?.pg) ? product.pg : [])
	const currentGroupedProduct = $derived(groupedProducts.find((item: any) => item.id === product.id || item.slug === product.slug))
	function adminValues(option: any, aggregationKey: string, currentValue: string) {
		const values = groupedValuesForAttribute(groupedProducts, currentGroupedProduct, aggregationKey)
		return [...new Set((values.length ? values : [
			...(option?.values || []).map((item: any) => item.value),
			...((aggregationKey && product?.ag?.[aggregationKey]) || []),
			currentValue
		]).filter(Boolean))] as string[]
	}
	const metalColorValues = $derived.by(() => {
		const values = adminValues(metalColorOption, metalColorAggregationKey, metalColor)
		return [...['yellow', 'rose', 'white'].flatMap((tone) => values.filter((value) => metalColorTone(value) === tone)), ...values.filter((value) => !['yellow', 'rose', 'white'].includes(metalColorTone(value)))]
	})
	const caratWeightValues = $derived(adminValues(caratWeightOption, caratWeightAggregationKey, caratWeight).sort((left, right) => parseFloat(String(left)) - parseFloat(String(right))))
	const ringSizeValues = $derived(adminValues(ringSizeOption, ringSizeAggregationKey, ringSize).sort((left, right) => parseFloat(String(left)) - parseFloat(String(right))))
	const stoneShapeValues = $derived(adminValues(stoneShapeOption, stoneShapeAggregationKey, stoneShape))
	const stoneTypeValues = $derived(adminValues(stoneTypeOption, stoneTypeAggregationKey, stoneType))
	const customizationInitial = $derived({ metal: metalColor, carat: caratWeight, size: ringSize, cut: stoneShape, stone: stoneType })
	const wishlistKey = $derived(`${product?.id}-${selectedVariant?.id || variants[0]?.id || ''}`)
	const wishlisted = $derived(Boolean(productState.wishlistState?.isWishlisted?.[wishlistKey]))

	function selectedValue(option: any) {
		if (!option) return ''
		return selectedVariant?.options?.find((item: any) => item.optionId === option.id)?.value || option.values?.[0]?.value || ''
	}

	function selectOption(option: any, event: Event) {
		if (option.readonly) return
		const nextVariant = variantForOption(variants, selectedVariant, option.id, (event.currentTarget as HTMLSelectElement).value)
		selectedVariant = nextVariant
		activeImage = productImages(product, nextVariant)[0] || ''
	}

	function groupedMetalColorProduct(value: string) {
		return metalColorAggregationKey ? groupedProductForAttribute(groupedProducts, currentGroupedProduct, metalColorAggregationKey, value) : null
	}

	async function showGroupedProduct(groupedProduct: any, request = customizationRequest) {
		const result = await preloadData(`/products/${groupedProduct.slug}`)
		const nextProduct = result.type === 'loaded' ? (result.data as any)?.product : null
		if (!nextProduct) throw new Error('Product variation is unavailable')
		if (request !== customizationRequest) return
		const nextVariant = (nextProduct.variants || []).find((variant: any) => variant.id === groupedProduct.variantId) || nextProduct.variants?.[0] || nextProduct
		selectedProduct = nextProduct
		selectedVariant = nextVariant
		activeImage = productImages(nextProduct, nextVariant)[0] || activeImage
	}

	function preloadMetalColor(value: string) {
		const groupedProduct = groupedMetalColorProduct(value)
		if (!groupedProduct?.slug || groupedProduct.slug === product.slug) return
		void preloadData(`/products/${groupedProduct.slug}`).catch(() => {})
		const preview = metalColorImage(images[0], value)
		if (preview) new Image().src = preview
	}

	async function addToBag() {
		const cartState = productState.cartState
		if (!cartState) return toast.error('Cart is not available')
		if (cartState.showCheckout) return goto('/checkout/cart')
		if (!selectedVariant?.id || !product?.id) return toast.error('Please select a product variation')
		await cartState.addOrUpdate({ productId: product.id, variantId: selectedVariant.id, qty: productState.qty })
		if (cartState.showCheckout) toast.success('Added to bag')
	}

	async function buyNow() {
		const cartState = productState.cartState
		if (!cartState) return toast.error('Cart is not available')
		if (!selectedVariant?.id || !product?.id) return toast.error('Please select a product variation')
		const previousCartId = cartState.cart?.id
		await cartState.createSingleItemCheckoutSession({ productId: product.id, variantId: selectedVariant.id, qty: productState.qty })
		if (cartState.cart?.id && cartState.cart.id !== previousCartId) goto('/checkout/cart')
	}

	async function toggleWishlist() {
		const user = productState.userState?.user
		if (!user?.userId && !user?.id) {
			productState.showLoginModal = true
			toast.error('Please login to use your wishlist')
			return
		}
		if (user?.role && String(user.role).toUpperCase() !== 'USER') return toast.error('Only users can add products to a wishlist')
		if (!productState.wishlistPluginEnabled) return toast.error('Wishlist is not available')
		wishlistLoading = true
		try {
			const wasWishlisted = wishlisted
			await productState.wishlistState.toggleWishlistFromIds(product.id, selectedVariant?.id || variants[0]?.id)
			const isNowWishlisted = Boolean(productState.wishlistState?.isWishlisted?.[wishlistKey])
			if (isNowWishlisted === wasWishlisted) toast.error('Wishlist update failed')
			else toast.success(isNowWishlisted ? 'Added to wishlist' : 'Removed from wishlist')
		} catch (error: any) {
			toast.error(error?.message || 'Wishlist update failed')
		} finally {
			wishlistLoading = false
		}
	}

	function toggleCompare() {
		try {
			const stored = JSON.parse(localStorage.getItem(COMPARE_STORAGE_KEY) || '[]')
			const next = toggleStoredId(stored, String(product.id))
			localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(next.ids))
			compared = next.active
			toast.success(compared ? 'Added to compare' : 'Removed from compare')
		} catch {
			toast.error('Compare update failed')
		}
	}

	function customizationTarget(selection: { metal: string; carat: string; size: string; cut: string; stone: string }) {
		const selectedAttributes = Object.fromEntries([
			[metalColorAggregationKey, selection.metal],
			[caratWeightAggregationKey, selection.carat],
			[ringSizeAggregationKey, selection.size],
			[stoneShapeAggregationKey, selection.cut],
			[stoneTypeAggregationKey, selection.stone]
		].filter(([key, value]) => key && value))
		return groupedProductForSelections(groupedProducts, currentGroupedProduct, selectedAttributes)
	}

	function customizationVariant(selection: { metal: string; carat: string; size: string; cut: string; stone: string }) {
		const choices = [
			[metalColorOption, metalColor, selection.metal],
			[caratWeightOption, caratWeight, selection.carat],
			[ringSizeOption, ringSize, selection.size],
			[stoneShapeOption, stoneShape, selection.cut],
			[stoneTypeOption, stoneType, selection.stone]
		] as [any, string, string][]
		if (choices.some(([option, current, selected]) => selected && selected.toLowerCase() !== current.toLowerCase() && !option?.id)) return null
		return variantForSelections(variants, selectedVariant, Object.fromEntries([
			[metalColorOption?.id, selection.metal],
			[caratWeightOption?.id, selection.carat],
			[ringSizeOption?.id, selection.size],
			[stoneShapeOption?.id, selection.cut],
			[stoneTypeOption?.id, selection.stone]
		].filter(([key, value]) => key && value)))
	}

	async function applyCustomization(selection: { metal: string; carat: string; size: string; cut: string; stone: string }) {
		const request = ++customizationRequest
		const target = customizationTarget(selection)
		try {
			if (target?.slug) return await showGroupedProduct(target, request)
			const nextVariant = customizationVariant(selection)
			if (!nextVariant) throw new Error('Product variation is unavailable')
			selectedVariant = nextVariant
			activeImage = productImages(product, nextVariant)[0] || activeImage
		} catch (error: any) {
			toast.error(error?.message || 'Product variation is unavailable')
		}
	}

	function showRingView() {
		activeImage = images[1] || images[0] || activeImage
		setTimeout(() => document.querySelector('.rj-gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
	}

	async function locateMe() {
		if (!navigator.geolocation) return toast.error('Location is not supported by this browser')
		locating = true
		try {
			const position = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 10000 }))
			const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
			if (!response.ok) throw new Error('Location lookup failed')
			const result = await response.json()
			postalCode = result?.address?.postcode || ''
			if (postalCode) toast.success(`Postal code ${postalCode} located`)
			else toast.error('Postal code was not found for this location')
		} catch (error: any) {
			toast.error(error?.code === 1 ? 'Location permission was denied' : 'Unable to locate your postal code')
		} finally {
			locating = false
		}
	}

	async function checkPostalCode() {
		const value = postalCode.trim()
		if (!/^[a-z\d][a-z\d -]{2,9}$/i.test(value)) return toast.error('Please enter a valid postal code')
		try {
			const response = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(value)}&format=json&limit=1`)
			const result = await response.json()
			toast[result?.length ? 'success' : 'error'](result?.length ? 'Postal code found. Delivery availability is confirmed at checkout.' : 'Postal code not found')
		} catch {
			toast.error('Postal code lookup failed')
		}
	}

	async function shareProduct() {
		try {
			if (navigator.share) await navigator.share({ title: product.title, url: location.href })
			else {
				await navigator.clipboard?.writeText(location.href)
				toast.success('Product link copied')
			}
		} catch (error: any) {
			if (error?.name !== 'AbortError') toast.error('Unable to share this product')
		}
	}

	async function copyDetail(value: string) {
		if (!value) return
		try {
			await navigator.clipboard.writeText(value)
			toast.success('Copied')
		} catch {
			toast.error('Unable to copy')
		}
	}

	function reviewValue(review: any, ...keys: string[]) {
		return keys.map((key) => review?.[key]).find((value) => value !== undefined && value !== null && value !== '')
	}

	function scrollRelated(direction: -1 | 1) {
		const track = document.querySelector<HTMLElement>('#rj-related .rj-carousel-track')
		track?.scrollBy({ left: direction * track.clientWidth * .8, behavior: 'smooth' })
	}

	onMount(async () => {
		window.setTimeout(() => metalColorValues.forEach(preloadMetalColor), 1000)
		try {
			const stored = JSON.parse(localStorage.getItem(COMPARE_STORAGE_KEY) || '[]')
			compared = Array.isArray(stored) && stored.map(String).includes(String(product.id))
		} catch {
			localStorage.removeItem(COMPARE_STORAGE_KEY)
		}
		if (!product?.categoryId) return
		relatedLoading = true
		try {
			const response = await productService.listRelatedProducts({ page: 1, categoryId: product.categoryId })
			relatedProducts = withoutDemoProducts(response?.data || []).filter((item: any) => item.id !== product.id).slice(0, 8)
		} finally {
			relatedLoading = false
		}
	})
</script>

<div class="rj-pdp">
	<nav class="rj-breadcrumb" aria-label="Breadcrumb">
		<a href="/">Home</a><span>/</span>
		{#each (product?.categoryHierarchy || []).filter((item: any) => item.name !== product.title && item.slug !== product.slug) as item}
			<a href="/{item.slug}">{item.name}</a><span>/</span>
		{/each}
		<span class="current">{product.title}</span>
	</nav>

	<section class="rj-product" aria-label={product.title}>
		<div class="rj-gallery">
			<div class="rj-main-image">
				{#if activeImage}<img src={activeImage} alt={product.title} />{:else}<span class="rj-image-empty"></span>{/if}
				<div class="rj-image-actions">
					<button class="rj-wishlist" class:is-active={wishlisted} type="button" disabled={wishlistLoading} onclick={toggleWishlist} aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wishlisted} aria-busy={wishlistLoading}><img src="/ryans-jewels/product/heart.svg" alt="" /></button>
					<button class="rj-compare" class:is-active={compared} type="button" onclick={toggleCompare} aria-label={compared ? 'Remove from compare' : 'Add to compare'} aria-pressed={compared}><img src="/ryans-jewels/product/compare.svg" alt="" /></button>
					<a href={activeImage} target="_blank" aria-label="View full product image"><img src="/ryans-jewels/product/eye.svg" alt="" /></a>
				</div>
				{#if relatedProducts.length}<button class="rj-similar" type="button" onclick={() => document.querySelector('#rj-related')?.scrollIntoView({ behavior: 'smooth' })}><img src="/ryans-jewels/product/view-similar.svg" alt="" />View Similar</button>{/if}
			</div>

			{#if images.length > 1}
				<div class="rj-thumbnails">
					{#each images.slice(0, 6) as image}
						<button class:active={image === activeImage} type="button" onclick={() => activeImage = image}><img src={image} alt="View {product.title}" /></button>
					{/each}
				</div>
			{/if}
		</div>

		<div class="rj-details">
			<div class="rj-title-row">
				<h1>{product.title}</h1>
			</div>

			<div class="rj-price-row">
				<strong>{formatPrice(price, currency)}</strong>
				{#if mrp > price}<s>{formatPrice(mrp, currency)}</s>{/if}
				{#if discount}<span>({discount}% Off Making Charge)</span>{/if}
			</div>

			<div class="rj-product-meta">
				<div class="rj-meta-summary">
					{#if category}<span class="rj-category">{category}</span>{/if}
					<span class="rj-stars"><img src="/ryans-jewels/product/star.svg" alt="" /><img src="/ryans-jewels/product/star.svg" alt="" />{rating.toFixed(1)}</span>
				</div>
				<i aria-hidden="true"></i>
				<span class="rj-rating-copy">{rating.toFixed(1)} out of 5 ratings <span class="rj-review-count">{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span></span><i aria-hidden="true"></i>
				<span class:available={inStock} class="rj-stock">{#if inStock}<span class="rj-stock-icon"><img src="/ryans-jewels/product/stock-tick.svg" alt="" /></span>{/if}{inStock ? 'Stock Available' : 'Out Of Stock'}</span>
			</div>

			<div class="rj-description">
				<p class="rj-label">Description</p>
				<div class="rj-description-copy">{@html product.description || ''}</div>
			</div>

			<hr />

			{#if optionCards.length}
				<div class="rj-custom-section">
					<div class="rj-custom-head"><h2><img src="/ryans-jewels/product/customize.svg" alt="" />Your Selected Product Details</h2></div>
					<div class="rj-options">
						{#each optionCards as option, index}
							<label class="rj-option rj-option-{index}">
								<span class="rj-option-title">
									{#if index === 0}
										<img class="rj-diamond-icon" src="/ryans-jewels/product/diamond-quality.svg" alt="" />
									{:else if index === 1}
										<img class="rj-metal-icon" src="/ryans-jewels/product/metal-type.svg" alt="" />
									{:else}
										<span class="rj-ring-icon" aria-hidden="true">
											<span class="rj-ring-rotate"><span class="rj-ring-object">
												{#each Array.from({ length: 16 }, (_, item) => item + 1) as part}<img class="rj-ring-part rj-ring-part-{part}" src="/ryans-jewels/product/ring-{String(part).padStart(2, '0')}.svg" alt="" />{/each}
											</span></span>
										</span>
									{/if}
									<small>{['Diamond Quality & Color', 'Metal type', 'Ring Size'][index]}</small>
								</span>
								<span class="rj-option-value">{#if index === 1}<i class="rj-metal-swatch"></i>{/if}<b>{selectedValue(option)}</b></span>
								{#if !option.readonly}
									<select value={selectedValue(option)} onchange={(event) => selectOption(option, event)} aria-label={option.title}>
										{#each option.values || [] as value}<option value={value.value}>{value.value}</option>{/each}
									</select>
								{/if}
							</label>
						{/each}
					</div>
				</div>
			{/if}

			{#if ringSizeValues.length}<a class="rj-size-guide" href="#rj-specifications"><span>Not sure about your ring size?</span><b><img src="/ryans-jewels/product/size-guide.svg" alt="" />Size Guide</b></a>{/if}
			{#if metalColorValues.length || caratWeightValues.length || ringSizeValues.length || stoneShapeValues.length || stoneType}
				<RjProductCustomizer initial={customizationInitial} {metalType} metalOptions={metalColorValues} caratOptions={caratWeightValues} sizeOptions={ringSizeValues} cutOptions={stoneShapeValues} stoneOptions={stoneTypeValues.length > 1 ? stoneTypeValues : []} onchange={applyCustomization} onringview={showRingView} />
			{/if}

			<hr />

			<div class="rj-purchase">
				<div class="rj-purchase-actions">
					<div class="rj-buy-row">
						<div class="rj-qty" aria-label="Quantity">
							<button type="button" onclick={productState.incrementQuantity} aria-label="Increase quantity"><img src="/ryans-jewels/product/add.svg" alt="" /></button>
							<span>{productState.qty}</span>
							<button type="button" onclick={productState.decrementQuantity} aria-label="Decrease quantity"><img src="/ryans-jewels/product/minus.svg" alt="" /></button>
						</div>
						<button class="rj-add" type="button" disabled={!inStock || productState.cartState?.isUpdatingCart} onclick={addToBag}>{productState.cartState?.showCheckout ? 'Go To Bag' : inStock ? 'Add To Bag' : 'Out Of Stock'}</button>
						<button class="rj-share" type="button" onclick={shareProduct}><img src="/ryans-jewels/product/share.svg" alt="" />Share</button>
					</div>
					<button class="rj-buy-now" type="button" disabled={!inStock || productState.cartState?.isUpdatingCart} onclick={buyNow}><img src="/ryans-jewels/product/cart.svg" alt="" />Buy Now : {formatPrice(price, currency)}</button>
				</div>
			</div>

			<div class="rj-delivery">
				<label><span>Check Zip Code For Order Delivery Related</span><span class="rj-zip-input"><span><img src="/ryans-jewels/product/routing.svg" alt="" /><input bind:value={postalCode} inputmode="text" placeholder="Please Enter Zip Code" onkeydown={(event) => event.key === 'Enter' && checkPostalCode()} /></span><button type="button" disabled={locating} onclick={locateMe}>{locating ? 'Locating...' : 'Locate Me'}</button></span></label>
			</div>

			<div class="rj-service-row">
				<div><img src="/ryans-jewels/product/free-shipping.svg" alt="" /><span><b>Free Shipping</b><small>Free Shipping All order</small></span></div>
				<div><img src="/ryans-jewels/product/support.svg" alt="" /><span><b>24/7 Support</b><small>Free Shipping All order</small></span></div>
				<div><img src="/ryans-jewels/product/payment-security.svg" alt="" /><span><b>Payment Security</b><small>Free Shipping All order</small></span></div>
			</div>

			<div class="rj-payments">
				<div class="rj-payment-logos">{#each ['mastercard.png', 'paypal.png', 'visa.png', 'amex.png', 'apple-pay.png', 'discover.png'] as card}<span class="rj-payment-logo"><img src="/ryans-jewels/product/{card}" alt="" /></span>{/each}</div>
				<p>Learn more about our <a href="/terms-and-conditions">TERAMS &amp; POLICIES</a></p>
			</div>
		</div>
	</section>

	<section class="rj-info" class:is-reviews={activeTab === 'reviews'} id="rj-specifications">
		<div class="rj-detail-tabs" role="tablist" aria-label="Product information">
			<div>
				<button class:active={activeTab === 'details'} type="button" role="tab" aria-selected={activeTab === 'details'} onclick={() => activeTab = 'details'}>Product Details</button>
				<button class:active={activeTab === 'reviews'} type="button" role="tab" aria-selected={activeTab === 'reviews'} onclick={() => activeTab = 'reviews'}>Reviews</button>
			</div>
			<div class="rj-style-copy"><span>Style No. <b>{detailSku}</b></span><button type="button" onclick={() => copyDetail(detailSku)} aria-label="Copy style number"><img src="/ryans-jewels/product/detail-copy.svg" alt="" />Copy</button></div>
		</div>
		{#if activeTab === 'details'}
			<div class="rj-detail-body" role="tabpanel">
				<div class="rj-detail-description">
					<p><b>Description</b> : <span>{product.title}</span></p>
					<div>{#each detailParagraphs as paragraph}<p>{paragraph}</p>{/each}</div>
				</div>

				<div class="rj-detail-main">
					<div class="rj-detail-visual">
						{#if detailImage}<img class="rj-detail-product-image" src={detailImage} alt="Side view of {product.title}" />{/if}
						<div class="rj-detail-height-label"><i></i><span>{ringHeight ? `${ringHeight} ${dimensionUnit} (Height)` : ringSize ? `Ring Size ${ringSize}` : 'Ring Height'}</span><i></i></div>
						<img class="rj-detail-height-guide" src="/ryans-jewels/product/detail-height-guide.svg?v=6" alt="" />
						<img class="rj-detail-stone-guide" src="/ryans-jewels/product/detail-stone-guide.svg?v=6" alt="" />
						<div class="rj-detail-stone"><span>{#if diamondImage}<img class="is-shape" src={diamondImage} alt="{stoneShape} diamond" />{:else if activeImage}<img class="is-crop" src={activeImage} alt="{stoneShape || 'Center'} diamond detail" />{/if}</span><small>{stoneShape || 'Center'} Diamond{#if caratWeight}<b>{caratWeight}</b>{/if}</small></div>
					</div>

					<div class="rj-detail-card">
						<header><strong>{product.title}</strong><div><span>SKU {detailSku}</span><button type="button" onclick={() => copyDetail(detailSku)} aria-label="Copy SKU"><img src="/ryans-jewels/product/detail-copy.svg" alt="" />Copy</button></div></header>
						<div class="rj-detail-card-body">
							<p>Set in {[metalType, metalColor].filter(Boolean).join(' ') || 'premium metal'}{caratWeight ? ` with ${caratWeight}` : ''}{stoneQuality ? ` ${stoneQuality}` : ''} diamonds</p>
							<div class="rj-detail-facts">
								<div class="rj-detail-fact"><h3><img src="/ryans-jewels/product/detail-gold.svg" alt="" />Gold Info <img class="rj-detail-info-icon" src="/ryans-jewels/product/detail-info.svg" alt="" /></h3><p>{goldInfo}</p></div>
								<div class="rj-detail-fact"><h3><img src="/ryans-jewels/product/detail-dimension.svg" alt="" />Dimension Info</h3><p>{dimensionInfo}</p></div>
								<div class="rj-detail-fact"><h3><img src="/ryans-jewels/product/detail-diamond.svg" alt="" />Diamond Info <img class="rj-detail-info-icon" src="/ryans-jewels/product/detail-info.svg" alt="" /></h3><p>{diamondInfo}{#if diamondMeta}<br />{diamondMeta}{/if}</p></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="rj-detail-reviews" role="tabpanel" aria-label="Customer reviews">
				<div class="rj-review-feed">
					{#if ratings.length}
						<div class="rj-review-cards">
							{#each ratings.slice(0, visibleReviewCount) as review}
								{@const reviewerName = reviewValue(review, 'name', 'reviewerName', 'userName') || 'Customer'}
								{@const createdAt = reviewValue(review, 'createdAt', 'created_at', 'date')}
								{@const reviewCopy = reviewValue(review, 'review', 'message', 'comment')}
								<article class="rj-review-card">
									<header>
										<span class="rj-review-avatar">
											{#if reviewValue(review, 'img', 'image', 'avatar')}<img src={reviewValue(review, 'img', 'image', 'avatar')} alt="" />{:else}{String(reviewerName).charAt(0).toUpperCase()}{/if}
										</span>
										<span><b>{reviewerName}</b><small>{createdAt ? timestampToAgo(createdAt) || 'Recently' : 'Recently'}</small></span>
										<span class="rj-review-card-rating" aria-label="{Number(review.rating || 0)} out of 5 stars">
											{#each Array.from({ length: 5 }) as _, index}<i class:filled={index < Math.round(Number(review.rating || 0))}></i>{/each}
										</span>
									</header>
									{#if reviewCopy}<p>{reviewCopy}</p>{/if}
									{#if createdAt}<footer><span>{dateOnly(createdAt)}</span><i></i><span><img src="/ryans-jewels/product/review-clock.svg" alt="" />{time(createdAt)}</span></footer>{/if}
								</article>
							{/each}
						</div>
						{#if visibleReviewCount < ratings.length}
							<button class="rj-review-more" type="button" onclick={() => visibleReviewCount += 2}>View More<span><img src="/ryans-jewels/product/review-arrow-right.svg" alt="" /><img src="/ryans-jewels/product/review-arrow-right.svg" alt="" /></span></button>
						{/if}
					{:else}
						<p class="rj-review-empty">No customer reviews yet.</p>
					{/if}
				</div>

				<i class="rj-review-divider"></i>

				<div class="rj-review-summary">
					<div class="rj-review-heading">
						<span aria-hidden="true"><img src="/ryans-jewels/product/review-star.svg" alt="" /><img src="/ryans-jewels/product/review-star.svg" alt="" /><img src="/ryans-jewels/product/review-star.svg" alt="" /></span>
						<h2>Customer Reviews</h2>
					</div>
					<div class="rj-review-score">
						<div><span class="rj-review-score-stars" aria-label="{rating} out of 5 stars">{#each Array.from({ length: 5 }) as _, index}<i class:filled={index < Math.round(rating)}></i>{/each}</span><small>{ratings.length ? `${rating} out of 5` : 'Be the first to write a review'}</small></div>
						<i></i>
						<p>Based on <b>Reviews {ratings.length}</b></p>
					</div>
					<button class="rj-write-review" type="button" onclick={() => productState.showReviewForm = true}>Write Review<img src="/ryans-jewels/product/review-brush.svg" alt="" /></button>
				</div>
			</div>
		{/if}
	</section>

	{#if relatedLoading || relatedProducts.length}
		<section class="rj-related" id="rj-related">
			<div class="rj-related-head"><i></i><div><h2>You May Also Like...</h2><p>Explore our most loved pieces, handpicked for you.</p></div><i></i></div>
			{#if relatedLoading}
				<div class="rj-loading">Loading...</div>
			{:else}
				<button class="rj-related-arrow is-prev" type="button" onclick={() => scrollRelated(-1)} aria-label="Previous products">‹</button>
				<RjCarousel label="You May Also Like">
					{#each relatedProducts as item (item.id)}<div class="rj-related-item"><RjProductCard product={item} size="listing" /></div>{/each}
				</RjCarousel>
				<button class="rj-related-arrow is-next" type="button" onclick={() => scrollRelated(1)} aria-label="Next products">›</button>
			{/if}
		</section>
	{/if}

	{#if ratings.length}
		<section class="rj-reviews">
			<p>Customer Reviews</p><h2>Don't Take Our Word For It</h2>
			<div class="rj-review-grid">{#each ratings.slice(0, 3) as review}<article><div class="rj-review-stars">★★★★★</div>{#if review.message || review.review}<p>{review.message || review.review}</p>{/if}<b>{review.name || 'Customer'}</b></article>{/each}</div>
		</section>
	{/if}
</div>

<RjInstagram />
<LoginModal bind:show={productState.showLoginModal} />

<style>
	.rj-pdp { color: #404040; font-family: 'Sarala', var(--font-body, sans-serif); }
	.rj-breadcrumb, .rj-product, .rj-info, .rj-related, .rj-reviews { width: min(calc(100% - clamp(120px, 8.333vw, 160px)), 1760px); margin-inline: auto; }
	.rj-breadcrumb { display: flex; gap: 8px; align-items: center; min-height: 63px; overflow: hidden; font-size: 14px; color: #a2a2a2; white-space: nowrap; }
	.rj-breadcrumb a { color: inherit; } .rj-breadcrumb .current { overflow: hidden; text-overflow: ellipsis; color: #505050; }
	.rj-product { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(24px, 1.667vw, 32px); align-items: start; margin-top: 30px; }
	.rj-gallery { min-width: 0; }
	.rj-main-image { position: relative; width: 100%; aspect-ratio: 1; border: 1.5px solid #f4f4f4; border-radius: 5px; overflow: hidden; }
	.rj-main-image > img { width: 100%; height: 100%; object-fit: cover; }
	.rj-image-empty { display: block; width: 100%; height: 100%; background: #f9f9f9; }
	.rj-image-actions { position: absolute; top: 20px; left: 20px; display: flex; flex-direction: column; gap: 15px; }
	.rj-image-actions button, .rj-image-actions a { display: grid; width: 70px; height: 70px; place-items: center; border: 0; border-radius: 50%; background: #f9f9f9; cursor: pointer; }
	.rj-image-actions img { width: auto; height: auto; max-width: 32px; max-height: 32px; }
	.rj-image-actions button:nth-child(2) img { width: 100%; height: 100%; max-width: none; max-height: none; object-fit: contain; }
	.rj-image-actions button:disabled { opacity: .55; cursor: wait; }
	.rj-image-actions button.is-active { box-shadow: inset 0 0 0 1px #cca646; }
	.rj-wishlist.is-active img { filter: sepia(1) saturate(4) hue-rotate(330deg); }
	.rj-similar { position: absolute; right: 0; bottom: 20px; display: flex; gap: 12px; align-items: center; width: 150px; height: 50px; padding: 10px; border: 0; border-radius: 30px 0 0 30px; background: #f9f9f9; font: 16px 'Lato', sans-serif; }
	.rj-similar img { width: 30px; height: 30px; }
	.rj-thumbnails { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(12px, .833vw, 16px) clamp(24px, 1.667vw, 32px); margin-top: clamp(12px, .833vw, 16px); }
	.rj-thumbnails button { aspect-ratio: 1; padding: 0; border: 1.5px solid transparent; border-radius: 5px; overflow: hidden; background: #fff; cursor: pointer; }
	.rj-thumbnails button.active { border-color: #cca646; }
	.rj-thumbnails img { width: 100%; height: 100%; object-fit: cover; }
	.rj-details { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
	.rj-title-row { display: block; }
	.rj-title-row h1 { margin: 0; font-family: 'Sarala', sans-serif; font-size: 30px; font-weight: 400; line-height: 44px; letter-spacing: 0; color: #202020; text-transform: capitalize; }
	.rj-price-row { display: flex; gap: 15px; align-items: baseline; flex-wrap: wrap; }
	.rj-price-row strong { font-size: 29px; line-height: normal; color: #202020; }
	.rj-price-row s { font-size: 18px; color: #ff7578; } .rj-price-row > span { font-size: 18px; color: #ff9233; }
	.rj-product-meta { display: flex; gap: 15px; align-items: center; flex-wrap: wrap; color: #707070; font: 400 14px/22px 'Lato', sans-serif; }
	.rj-product-meta > i { width: 1px; height: 31px; flex: 0 0 1px; background: #c5c5c5; }
	.rj-meta-summary { display: flex; gap: 10px; align-items: center; }
	.rj-category { color: #404040; font: 400 18px/normal 'Sarala', sans-serif; text-transform: capitalize; white-space: nowrap; }
	.rj-product-meta .available { color: #008f65; }
	.rj-review-count { color: #a80139; }
	.rj-rating-copy { white-space: nowrap; }
	.rj-stock { display: flex; gap: 10px; align-items: center; white-space: nowrap; }
	.rj-stock-icon { display: grid; width: 27px; height: 27px; flex: 0 0 27px; place-items: center; border-radius: 50%; background: rgb(109 208 171 / 50%); }
	.rj-stock-icon img { width: 21px; height: 21px; }
	.rj-stars { display: flex; gap: 2px; align-items: center; color: #555; }
	.rj-stars img { width: 20px; height: 20px; }
	.rj-description { font-family: 'Lato', sans-serif; }
	.rj-label { margin: 0 0 6px; color: #303030; font-size: 13px; font-weight: 500; line-height: 20px; }
	.rj-description-copy { display: -webkit-box; overflow: hidden; color: #707070; font-size: 14px; line-height: 22px; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
	.rj-description-copy :global(p) { margin: 0; }
	.rj-details hr { width: 100%; margin: 1px 0; border: 0; border-top: 1px solid #eee; }
	.rj-custom-section { display: flex; width: calc(100% - 20px); margin-left: 10px; flex-direction: column; gap: 10px; }
	.rj-custom-head { display: flex; min-height: 23px; align-items: center; justify-content: space-between; }
	.rj-custom-head h2 { display: flex; align-items: center; gap: 5px; margin: 0; color: #606060; font: 400 14px 'Sarala', sans-serif; letter-spacing: 0; }
	.rj-custom-head h2 img { width: 19px; height: 19px; }
	.rj-options { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px; height: 100px; padding: 2px; overflow: hidden; border-radius: 5px; background: #f6f6f6; }
	.rj-option { position: relative; display: flex; height: 96px; min-width: 0; flex-direction: column; gap: 20px; padding: 13px 15px; border-radius: 2px; background: #fff; }
	.rj-option:first-child { border-radius: 4px 2px 2px 4px; }
	.rj-option:last-child { border-radius: 2px 4px 4px 2px; }
	.rj-option-title, .rj-option-value { display: flex; min-width: 0; align-items: center; }
	.rj-option-title { gap: 6px; }
	.rj-option-0 .rj-option-value { justify-content: center; }
	.rj-option-1 .rj-option-value, .rj-option-2 .rj-option-value { justify-content: center; }
	.rj-option-title small { overflow: hidden; color: #303030; font: 400 14px 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rj-option-value { gap: 9px; }
	.rj-option-value b { overflow: hidden; color: #006678; font: 700 22px 'Sarala', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rj-diamond-icon, .rj-metal-icon { width: 21px; height: 21px; }
	.rj-metal-swatch { width: 21px; height: 21px; flex: 0 0 21px; border-radius: 4px; background: linear-gradient(221deg, #f5d874 8%, #c7981b 43%, #f7dc7c 76%, #b78714 100%); }
	.rj-ring-icon { position: relative; width: 21px; height: 21px; flex: 0 0 21px; }
	.rj-ring-rotate { position: absolute; top: -5px; left: 1px; width: 20.13px; height: 24px; transform: rotate(14.73deg) skewX(-.66deg); transform-origin: center; }
	.rj-ring-object { position: absolute; top: 1.54px; left: 2.53px; width: 15.08px; height: 20.92px; }
	.rj-ring-part { position: absolute; display: block; max-width: none; }
	.rj-ring-part-1 { top: 25.03%; left: .19%; width: 81.01%; height: 74.84%; }
	.rj-ring-part-2 { top: 7.67%; left: 43.09%; width: 47%; height: 25.96%; }
	.rj-ring-part-3 { top: 6.67%; left: 54.15%; width: 5.61%; height: 1.92%; }
	.rj-ring-part-4 { top: 9.68%; left: 49.67%; width: 33.2%; height: 12.59%; }
	.rj-ring-part-5 { top: 13.6%; left: 80.43%; width: 4.69%; height: 3.77%; }
	.rj-ring-part-6 { top: 6.94%; left: 32.51%; width: 12.28%; height: 8.67%; }
	.rj-ring-part-7 { top: 7.5%; left: 41.2%; width: 8.24%; height: 5.29%; }
	.rj-ring-part-8 { top: 11.94%; left: 31.96%; width: 22.08%; height: 22.54%; }
	.rj-ring-part-9 { top: 14.34%; left: 47.47%; width: 13%; height: 14.06%; }
	.rj-ring-part-10 { top: 20.98%; left: 88.48%; width: 6.43%; height: 8.57%; }
	.rj-ring-part-11 { top: 18.06%; left: 86.14%; width: 5.91%; height: 7.6%; }
	.rj-ring-part-12 { top: 23.3%; left: 67.64%; width: 27.73%; height: 14.97%; }
	.rj-ring-part-13 { top: 26.75%; left: 72.66%; width: 12.11%; height: 9.99%; }
	.rj-ring-part-14 { top: 19.25%; left: 75.95%; width: 5.91%; height: 10.75%; }
	.rj-ring-part-15 { top: 19.81%; left: 50.2%; width: 28.05%; height: 17.95%; }
	.rj-ring-part-16 { top: 0; left: 18.8%; width: 81.2%; height: 43.8%; }
	.rj-option select { position: absolute; inset: 0; width: 100%; opacity: 0; cursor: pointer; }
	.rj-size-guide { display: flex; box-sizing: border-box; width: calc(100% - 20px); height: 45px; margin-left: 10px; align-items: center; justify-content: space-between; padding: 10px 13px; border-radius: 6px; background: #e5f4ff; color: #404040; font: 12px 'Lato', sans-serif; }
	.rj-size-guide b { display: flex; gap: 5px; align-items: center; color: #0157a8; font-family: 'Inter', sans-serif; font-weight: 500; } .rj-size-guide img { width: 25px; height: 25px; }
	.rj-purchase { display: flex; box-sizing: border-box; width: calc(100% - 20px); margin-left: 10px; flex-direction: column; gap: 25px; }
	.rj-purchase-actions { display: flex; flex-direction: column; gap: 20px; }
	.rj-buy-row { display: grid; grid-template-columns: 138px minmax(0, 1fr) 100px; gap: 10px; height: 55px; }
	.rj-qty { display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; border: 1px solid #e2e2e2; border-radius: 5px; text-align: center; }
	.rj-qty button { display: grid; place-items: center; padding: 0; border: 0; background: none; cursor: pointer; } .rj-qty img { width: 20px; height: 20px; }
	.rj-add, .rj-share, .rj-buy-now { display: flex; align-items: center; justify-content: center; gap: 10px; border: 1px solid #d5d5d5; border-radius: 4px; font: 18px 'Sarala', sans-serif; cursor: pointer; }
	.rj-add { background: #cca646; color: #fff; } .rj-share img { width: 22px; height: 22px; }
	.rj-add { font-size: 20px; }
	.rj-share, .rj-buy-now { background: #fff; color: #404040; } .rj-buy-now { width: 100%; height: 55px; border-color: #b0b0b0; font-size: 20px; }
	.rj-buy-now img { width: 27px; height: 27px; }
	.rj-add:disabled, .rj-buy-now:disabled { opacity: .55; cursor: not-allowed; }
	.rj-delivery { display: flex; box-sizing: border-box; width: calc(100% - 20px); margin-left: 10px; flex-direction: column; gap: 15px; }
	.rj-delivery > label { padding: 15px; border: 1px solid #efe9e3; border-radius: 5px; }
	.rj-delivery > label { height: 108px; }
	.rj-delivery label > span:first-child { display: block; margin-bottom: 10px; font: 14px 'Sarala', sans-serif; }
	.rj-zip-input { display: flex; align-items: center; justify-content: space-between; height: 45px; padding: 0 15px; border: 1px solid #dedede; border-radius: 4px; }
	.rj-zip-input > span { display: flex; gap: 8px; align-items: center; min-width: 0; }
	.rj-zip-input img { width: 23px; height: 23px; } .rj-zip-input input { min-width: 0; border: 0; outline: 0; font: 12px 'Lato', sans-serif; } .rj-zip-input button { padding: 0; border: 0; background: none; color: #085ace; font: 14px 'Lato', sans-serif; cursor: pointer; white-space: nowrap; } .rj-zip-input button:disabled { opacity: .6; cursor: wait; }
	.rj-service-row { display: flex; gap: 47px; align-items: center; justify-content: center; padding: 25px 0 0; border-top: 1px solid #e4e4e4; }
	.rj-service-row > div { display: flex; gap: 10px; align-items: center; } .rj-service-row img { width: 40px; height: 40px; }
	.rj-service-row span { display: flex; min-width: 0; flex-direction: column; } .rj-service-row b { font: 600 16px/18px 'Lato', sans-serif; } .rj-service-row small { color: #666; font: 12px/18px 'Sarala', sans-serif; }
	.rj-payments { display: flex; flex-direction: column; gap: 10px; align-items: center; padding: 15px; border-radius: 4px; background: #f9f9f9; }
	.rj-payment-logos { display: flex; gap: 15px; align-items: center; }
	.rj-payment-logo { position: relative; display: block; flex: 0 0 auto; overflow: hidden; }
	.rj-payment-logo img { position: absolute; display: block; max-width: none; }
	.rj-payment-logo:nth-child(1) { width: 36px; height: 27px; } .rj-payment-logo:nth-child(1) img { top: 0; left: -.24%; width: 100.48%; height: 120.59%; }
	.rj-payment-logo:nth-child(2) { width: 47px; height: 16px; } .rj-payment-logo:nth-child(2) img { top: -102.94%; left: 0; width: 100%; height: 294.12%; }
	.rj-payment-logo:nth-child(3) { width: 38px; height: 27px; } .rj-payment-logo:nth-child(3) img { top: -27.59%; left: -4.88%; width: 109.76%; height: 155.17%; }
	.rj-payment-logo:nth-child(4) { width: 35px; height: 26px; } .rj-payment-logo:nth-child(4) img { top: -22.58%; left: -4.88%; width: 109.76%; height: 145.16%; }
	.rj-payment-logo:nth-child(5) { width: 35px; height: 23px; } .rj-payment-logo:nth-child(5) img { top: -25.93%; left: -29.78%; width: 159.55%; height: 151.85%; }
	.rj-payment-logo:nth-child(6) { width: 38px; height: 23px; } .rj-payment-logo:nth-child(6) img { top: -33.33%; left: -2.27%; width: 102.27%; height: 166.67%; }
	.rj-payments p { margin: 0; color: #303030; font-size: 12px; line-height: 24px; } .rj-payments a { color: #a80139; font: 700 12px 'Lato', sans-serif; }
	.rj-info { min-height: 747px; margin-top: 65px; overflow: hidden; border: 1px solid #e0e0e0; border-radius: 5px; background: #fff; }
	.rj-detail-tabs { display: flex; height: 70px; align-items: center; justify-content: space-between; padding: 13px 50px; border-bottom: 1px solid #e0e0e0; }
	.rj-detail-tabs > div:first-child { display: flex; gap: 36px; align-items: flex-start; }
	.rj-detail-tabs > div:first-child button { position: relative; padding: 0 0 7px; border: 0; background: none; color: #808080; font: 18px/18px 'Sarala', sans-serif; cursor: pointer; white-space: nowrap; }
	.rj-detail-tabs > div:first-child button.active { color: #303030; }
	.rj-detail-tabs > div:first-child button.active::after { position: absolute; bottom: 0; left: 0; height: 2px; background: #cca646; content: ''; }
	.rj-detail-tabs > div:first-child button:first-child.active::after { width: 125px; }
	.rj-detail-tabs > div:first-child button:last-child.active::after { width: 50px; }
	.rj-style-copy, .rj-style-copy button, .rj-detail-card header > div, .rj-detail-card header button { display: flex; align-items: center; }
	.rj-style-copy { gap: 12px; padding: 3px 7px; color: #808080; font: 18px/18px 'Sarala', sans-serif; }
	.rj-style-copy b { color: #cca646; font-weight: 400; }
	.rj-style-copy button, .rj-detail-card header button { display: flex; min-width: 82px; height: 34px; flex: 0 0 auto; gap: 10px; align-items: center; justify-content: center; padding: 7px 10px; border: 0; border-radius: 5px; background: #003176; color: #fff; font: 14px/18px 'Sarala', sans-serif; white-space: nowrap; cursor: pointer; }
	.rj-style-copy button img, .rj-detail-card header button img { width: 20px; height: 20px; }
	.rj-detail-body { display: flex; flex-direction: column; gap: 35px; padding: 22px 49px 30px; }
	.rj-detail-description { display: flex; flex-direction: column; gap: 18px; color: #303030; font-size: 18px; }
	.rj-detail-description > p { margin: 0; font: 18px/18px 'Lato', sans-serif; }
	.rj-detail-description > p b { font-weight: 500; }
	.rj-detail-description > div { display: flex; flex-direction: column; gap: 12px; color: #656565; font: 18px/30px 'Lato', sans-serif; text-transform: capitalize; }
	.rj-detail-description > div p { margin: 0; }
	.rj-detail-main { display: grid; grid-template-columns: minmax(360px, 486fr) minmax(0, 710fr); gap: 24px; align-items: start; }
	.rj-detail-visual { position: relative; height: 382px; min-width: 0; overflow: hidden; border-radius: 4px; background: #fff; }
	.rj-detail-product-image { position: absolute; inset: 2% 5% 0 5%; width: 90%; height: 98%; object-fit: contain; }
	.rj-detail-height-label { position: absolute; z-index: 2; top: 76px; left: 18.5%; display: grid; width: 18px; height: 242px; place-items: center; }
	.rj-detail-height-label::before { position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: var(--rj-gold, #cca646); content: ''; transform: translateX(-50%); }
	.rj-detail-height-label i { position: absolute; left: 50%; width: 0; height: 0; border-right: 4px solid transparent; border-left: 4px solid transparent; transform: translateX(-50%); }
	.rj-detail-height-label i:first-child { top: -1px; border-bottom: 7px solid var(--rj-gold, #cca646); }
	.rj-detail-height-label i:last-child { bottom: -1px; border-top: 7px solid var(--rj-gold, #cca646); }
	.rj-detail-height-label span { position: relative; padding: 8px 0; background: #fff; color: #202020; font: 14px/18px 'Lato', sans-serif; writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; }
	.rj-detail-height-guide { position: absolute; z-index: 2; top: 76px; left: 24.2%; width: 27.5%; height: 242px; }
	.rj-detail-stone-guide { position: absolute; z-index: 2; top: 55px; left: 46%; width: 36%; height: auto; }
	.rj-detail-stone { position: absolute; z-index: 3; top: 15px; right: 4%; display: flex; width: 95px; flex-direction: column; gap: 7px; align-items: center; color: #202020; font: 12px/18px 'Lato', sans-serif; }
	.rj-detail-stone > span { position: relative; display: block; box-sizing: border-box; width: 95px; height: 85px; padding: 3px; overflow: hidden; border: 1.5px solid #e9e9e9; border-radius: 5px; background: #fff; }
	.rj-detail-stone img.is-shape { width: calc(100% - 5px); height: calc(100% - 5px); margin: 2.5px; border-radius: 4px; object-fit: contain; }
	.rj-detail-stone img.is-crop { position: absolute; top: 50%; left: 50%; width: 320%; max-width: none; height: auto; aspect-ratio: 1; border-radius: 4px; object-fit: cover; transform: translate(-50%, -50%); }
	.rj-detail-stone small { width: 100%; font: inherit; text-align: center; }
	.rj-detail-stone small b { display: block; color: #707070; font-weight: 400; }
	.rj-detail-card { min-width: 0; min-height: 353px; overflow: hidden; border: 1px solid #e0e0e0; border-radius: 5px; background: #fff; }
	.rj-detail-card header { display: flex; height: 66px; align-items: center; justify-content: space-between; gap: 15px; padding: 11px 20px; border-bottom: 1px solid #e0e0e0; }
	.rj-detail-card header > strong { min-width: 0; flex: 1 1 auto; overflow: hidden; color: #202020; font: 18px/18px 'Sarala', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rj-detail-card header > div { min-width: 0; flex: 0 1 284px; gap: 12px; }
	.rj-detail-card header > div > span { min-width: 0; flex: 1 1 auto; overflow: hidden; color: #1f9eff; font: 16px/18px 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rj-detail-card-body { padding: 12px 20px 20px; }
	.rj-detail-card-body > p { margin: 0 0 28px; color: #808080; font: 16px/18px 'Sarala', sans-serif; }
	.rj-detail-facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px 50px; padding-left: 15px; }
	.rj-detail-fact h3 { display: flex; gap: 10px; align-items: center; margin: 0; color: #454545; font: 18px/18px 'Sarala', sans-serif; text-transform: uppercase; }
	.rj-detail-fact h3 > img:first-child { width: 28px; height: 28px; }
	.rj-detail-fact h3 .rj-detail-info-icon { width: 14px; height: 14px; }
	.rj-detail-fact p { margin: 10px 0 0 10px; color: #7c7c7c; font: 14px/18px 'Lato', sans-serif; }
	.rj-info.is-reviews { height: 534px; min-height: 534px; }
	.rj-detail-reviews { position: relative; height: 464px; color: #505050; font-family: 'Lato', sans-serif; }
	.rj-review-feed { position: absolute; top: 40px; left: 2.273%; display: flex; width: 45.379%; flex-direction: column; gap: 30px; align-items: flex-end; }
	.rj-review-cards { display: flex; width: 100%; flex-direction: column; gap: 15px; }
	.rj-review-card { box-sizing: border-box; display: flex; width: 100%; height: 150px; flex-direction: column; gap: 19px; padding: 12px 15px; overflow: hidden; border: 1px solid #e0e0e0; border-radius: 5px; background: #fff; box-shadow: -1px 5px 3px rgb(229 229 229 / 25%); }
	.rj-review-card header { display: flex; height: 40px; align-items: center; }
	.rj-review-avatar { display: grid; width: 40px; height: 40px; flex: 0 0 40px; place-items: center; overflow: hidden; border-radius: 50%; background: #f3f3f3; color: #cca646; font: 600 16px 'Lato', sans-serif; }
	.rj-review-avatar img { width: 100%; height: 100%; object-fit: cover; }
	.rj-review-card header > span:nth-child(2) { display: flex; min-width: 0; flex-direction: column; gap: 3px; margin-left: 12px; }
	.rj-review-card header b { overflow: hidden; max-width: 180px; color: #000; font: 500 14px 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rj-review-card header small { color: #9a9a9a; font: 10px 'Lato', sans-serif; }
	.rj-review-card-rating { display: flex; gap: 3px; margin-left: auto; }
	.rj-review-card-rating i, .rj-review-score-stars i { display: block; background: #e4e4e4; -webkit-mask: url('/ryans-jewels/product/review-rating-star.svg') center / contain no-repeat; mask: url('/ryans-jewels/product/review-rating-star.svg') center / contain no-repeat; }
	.rj-review-card-rating i { width: 15px; height: 15px; }
	.rj-review-card-rating i.filled, .rj-review-score-stars i.filled { background: #cca646; }
	.rj-review-card > p { display: -webkit-box; overflow: hidden; margin: -9px 0 0; color: #555; font: 12px/16px 'Lato', sans-serif; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
	.rj-review-card footer { display: flex; height: 16px; align-items: center; gap: 5px; margin-top: auto; color: #505050; font: 12px 'Lato', sans-serif; }
	.rj-review-card footer > i { width: 1px; height: 16px; background: #d9d9d9; }
	.rj-review-card footer span:last-child { display: flex; gap: 5px; align-items: center; }
	.rj-review-card footer img { width: 12px; height: 12px; }
	.rj-review-empty { display: grid; box-sizing: border-box; width: 100%; height: 150px; place-items: center; margin: 0; border: 1px solid #e0e0e0; border-radius: 5px; color: #808080; font: 14px 'Sarala', sans-serif; }
	.rj-review-more { display: flex; gap: 5px; align-items: center; padding: 0; border: 0; background: none; color: #404040; font: 14px/18px 'Sarala', sans-serif; cursor: pointer; }
	.rj-review-more span { display: flex; align-items: center; }
	.rj-review-more img { width: 18px; height: 18px; }
	.rj-review-more img:first-child { margin-right: -10px; }
	.rj-review-divider { position: absolute; top: 20px; left: 49.924%; width: 2px; height: 424px; background: #e0e0e0; }
	.rj-review-summary { position: absolute; top: 90px; left: 56.288%; display: flex; width: 37.5%; flex-direction: column; gap: 24px; align-items: center; }
	.rj-review-heading { display: flex; width: 201px; flex-direction: column; gap: 12px; align-items: center; }
	.rj-review-heading > span { display: flex; align-items: flex-end; }
	.rj-review-heading img { width: 40px; height: 40px; }
	.rj-review-heading img:nth-child(1), .rj-review-heading img:nth-child(2) { margin-right: -12px; }
	.rj-review-heading img:nth-child(2) { width: 60px; height: 60px; }
	.rj-review-heading h2 { margin: 0; color: #303030; font: 400 24px/normal 'Sarala', sans-serif; text-align: center; white-space: nowrap; }
	.rj-review-score { display: flex; width: 100%; height: 80px; gap: 20px; align-items: center; }
	.rj-review-score > div { display: flex; width: 224px; flex: 0 0 224px; flex-direction: column; gap: 5px; }
	.rj-review-score-stars { display: flex; width: 224px; gap: 6px; align-items: center; }
	.rj-review-score-stars i { width: 40px; height: 40px; }
	.rj-review-score small { width: 100%; color: #505050; font: 400 14px/normal 'Sarala', sans-serif; }
	.rj-review-score > i { width: 2px; height: 80px; flex: 0 0 2px; background: #e0e0e0; }
	.rj-review-score p { margin: 0; color: #303030; font: 400 22px/normal 'Sarala', sans-serif; white-space: nowrap; }
	.rj-review-score b { color: #cca646; font-weight: 400; }
	.rj-write-review { display: flex; min-height: 45px; gap: 10px; align-items: center; justify-content: center; padding: 8px 16px; border: 0; border-radius: 5px; background: #cca646; color: #fff; font: 400 18px/normal 'Sarala', sans-serif; cursor: pointer; }
	.rj-write-review img { width: 24px; height: 24px; }
	.rj-related { position: relative; width: min(calc(100% - 48px), 1760px); padding-block: 42px 50px; }
	.rj-related-head { display: grid; grid-template-columns: 40px max-content minmax(40px, 1fr); gap: 8px; align-items: start; margin-bottom: 20px; }
	.rj-related-head > i { height: 1.5px; margin-top: 11px; background: var(--rj-gold, #cca646); }
	.rj-related-head > div { display: flex; flex-direction: column; align-items: flex-start; }
	.rj-related-head h2 { margin: 0; color: #202020; font: 600 18px/22px 'Sarala', sans-serif; letter-spacing: 0; }
	.rj-related-head p { margin: 0; color: #707070; font: 8px/12px 'Lato', sans-serif; }
	.rj-related-item { flex: 0 0 calc((100% - 72px) / 4); min-width: 0; }
	.rj-related-item :global(.rj-card--listing .rj-card-info) { gap: 5px; }
	.rj-related-item :global(.rj-card--listing .rj-card-swatch) { width: 18px; height: 18px; border-radius: 5px; }
	.rj-related-item :global(.rj-card--listing .rj-card-name) { font-size: 12px; line-height: 17px; }
	.rj-related-item :global(.rj-card--listing .rj-card-category) { font-size: 9px; }
	.rj-related-item :global(.rj-card--listing .rj-card-star) { width: 11px; height: 11px; }
	.rj-related-item :global(.rj-card--listing .rj-card-rating-value) { height: 11px; font-size: 10px; line-height: 11px; transform: none; }
	.rj-related-item :global(.rj-card--listing .rj-card-price) { font-size: 16px; }
	.rj-related-item :global(.rj-card-wish) { padding: 7px; }
	.rj-related-item :global(.rj-card-heart), .rj-related-item :global(.rj-card-spinner) { width: 18px; height: 18px; }
	.rj-related :global(.rj-carousel-track) { gap: 24px; }
	.rj-related :global(.rj-carousel-rail) { height: 4px; margin-top: 28px; border-radius: 4px; background: #f5f5f5; }
	.rj-related :global(.rj-carousel-thumb) { height: 4px; background: #cca646; }
	.rj-related-arrow { position: absolute; z-index: 4; top: 47%; display: grid; width: 38px; height: 38px; place-items: center; padding: 0 0 3px; border: 0; border-radius: 50%; background: #fff; box-shadow: 0 2px 12px rgb(0 0 0 / 8%); color: #606060; font: 300 27px/1 Arial, sans-serif; cursor: pointer; }
	.rj-related-arrow.is-prev { left: -14px; }
	.rj-related-arrow.is-next { right: -14px; }
	.rj-loading { min-height: 300px; display: grid; place-items: center; }
	.rj-reviews { padding-block: 80px; border-top: 1px solid #f0f0f0; text-align: center; }
	.rj-reviews > p { margin: 0 0 8px; color: #cca646; font-size: 20px; }
	.rj-reviews > h2 { margin: 0 0 50px; color: #202020; font: 400 34px/normal 'Rozha One', serif; letter-spacing: 0; }
	.rj-review-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; text-align: left; }
	.rj-review-grid article { padding: 28px; border: 1px solid #eee; border-radius: 5px; } .rj-review-stars { color: #cca646; } .rj-review-grid article p { min-height: 70px; color: #707070; font: 14px/22px 'Lato', sans-serif; }
	@media (max-width: 1023px) {
		.rj-breadcrumb, .rj-product, .rj-info, .rj-related, .rj-reviews { width: min(calc(100% - 60px), 684px); }
		.rj-related { width: calc(100% - 48px); }
		.rj-product { grid-template-columns: 1fr; }
		.rj-main-image { max-height: 684px; }
		.rj-info { min-height: 0; }
		.rj-info.is-reviews { height: auto; min-height: 0; }
		.rj-detail-tabs { padding-inline: 30px; }
		.rj-detail-body { padding-inline: 30px; }
		.rj-detail-main { grid-template-columns: 1fr; }
		.rj-detail-visual { width: min(100%, 560px); margin-inline: auto; }
		.rj-detail-reviews { display: flex; height: auto; min-height: 464px; flex-direction: column; }
		.rj-review-summary, .rj-review-feed { position: static; box-sizing: border-box; width: 100%; }
		.rj-review-summary { order: -1; padding: 45px 30px; }
		.rj-review-feed { align-items: stretch; padding: 30px; border-top: 1px solid #e0e0e0; }
		.rj-review-divider { display: none; }
		.rj-review-card { height: auto; min-height: 150px; }
		.rj-related-item { flex-basis: calc((100% - 60px) / 4); }
		.rj-related :global(.rj-carousel-track) { gap: 20px; }
	}
	@media (max-width: 639px) {
		.rj-breadcrumb, .rj-product, .rj-info, .rj-related, .rj-reviews { width: calc(100% - 40px); }
		.rj-info { width: calc(100% - 30px); margin-top: 65px; }
		.rj-breadcrumb { min-height: 50px; font-size: 12px; }
		.rj-main-image { aspect-ratio: 1; }
		.rj-image-actions { top: 10px; left: 10px; gap: 6px; } .rj-image-actions button, .rj-image-actions a { width: 44px; height: 44px; } .rj-image-actions img { max-width: 22px; max-height: 22px; }
		.rj-similar { right: 10px; bottom: 10px; width: auto; height: 42px; padding-inline: 14px; border-radius: 25px; }
		.rj-thumbnails { display: flex; gap: 10px; overflow-x: auto; margin-top: 12px; } .rj-thumbnails button { width: 92px; flex: 0 0 92px; }
		.rj-title-row h1 { font-size: 22px; line-height: 31px; }
		.rj-price-row strong { font-size: 24px; }
		.rj-product-meta { gap: 10px 14px; }
		.rj-product-meta > i { display: none; }
		.rj-meta-summary { flex-wrap: wrap; }
		.rj-custom-section, .rj-size-guide, .rj-purchase, .rj-delivery { width: 100%; margin-left: 0; }
		.rj-options { grid-template-columns: 1fr; height: auto; } .rj-option { height: 96px; }
		.rj-buy-row { grid-template-columns: 112px 1fr; } .rj-share { display: none; }
		.rj-service-row { flex-direction: column; align-items: flex-start; gap: 16px; }
		.rj-payments { gap: 10px; }
		.rj-detail-tabs { height: 58px; padding: 12px 15px; }
		.rj-detail-tabs > div:first-child { gap: 12px; }
		.rj-detail-tabs > div:first-child button { padding-bottom: 4px; font-size: 12px; line-height: 18px; }
		.rj-style-copy { gap: 10px; padding: 2px 5px; font-size: 11px; line-height: 15px; }
		.rj-style-copy > span { display: none; }
		.rj-style-copy button { width: 76px; height: 30px; padding: 5px 10px; font-size: 11px; }
		.rj-style-copy button img { width: 20px; height: 20px; }
		.rj-detail-body { gap: 22px; padding: 22px 10px 10px; }
		.rj-detail-description { gap: 18px; font-size: 18px; }
		.rj-detail-description > p { font-size: 18px; line-height: 18px; }
		.rj-detail-description > div { gap: 12px; font-size: 13px; line-height: 24px; }
		.rj-detail-main { display: flex; flex-direction: column; gap: 22px; align-items: center; }
		.rj-detail-visual { width: calc(100% - 16px); height: 241px; margin: 0; }
		.rj-detail-product-image { inset: 0; width: 100%; height: 100%; }
		.rj-detail-height-label { top: 44px; left: 19.73%; height: 156px; }
		.rj-detail-height-label span { font-size: 12px; }
		.rj-detail-height-guide { top: 44px; left: 27.87%; width: 24.3%; height: 156px; }
		.rj-detail-stone-guide { top: 92px; left: 43.9%; width: 34.9%; }
		.rj-detail-stone { top: 50px; right: 2.9%; width: 57px; font-size: 10px; line-height: normal; }
		.rj-detail-stone > span { width: 57px; height: 53px; }
		.rj-detail-card { width: 100%; min-height: 399px; }
		.rj-detail-card header { height: 66px; gap: 8px; padding: 11px 12px; }
		.rj-detail-card header > strong { max-width: none; font-size: 14px; }
		.rj-detail-card header > div { gap: 7px; }
		.rj-detail-card header > div { flex: 0 0 145px; }
		.rj-detail-card header > div > span { width: 64px; max-width: 64px; flex: 0 0 64px; font-size: 11px; line-height: 14px; white-space: nowrap; }
		.rj-detail-card header button { min-width: 68px; gap: 7px; padding: 7px 6px; font-size: 11px; }
		.rj-detail-card-body { padding: 25px 22px 20px; }
		.rj-detail-card-body > p { margin-bottom: 20px; font-size: 14px; line-height: 18px; }
		.rj-detail-facts { grid-template-columns: 1fr; gap: 30px; padding-left: 0; }
		.rj-detail-fact h3 { gap: 8px; font-size: 14px; }
		.rj-detail-fact h3 > img:first-child { width: 22px; height: 22px; }
		.rj-detail-fact p { margin: 8px 0 0; font-size: 14px; }
		.rj-review-summary { gap: 20px; padding: 35px 15px; }
		.rj-review-score { height: auto; flex-direction: column; gap: 14px; }
		.rj-review-score > div { width: 224px; flex-basis: auto; align-items: center; }
		.rj-review-score > i { width: 80px; height: 1px; flex-basis: 1px; }
		.rj-review-score p { font-size: 18px; }
		.rj-review-feed { padding: 20px 10px; }
		.rj-review-card header b { max-width: 105px; }
		.rj-review-card-rating { gap: 1px; }
		.rj-review-card-rating i { width: 11px; height: 11px; }
		.rj-related, .rj-reviews { padding-block: 35px; }
		.rj-related { width: calc(100% - 30px); }
		.rj-related-head { grid-template-columns: 25px max-content minmax(25px, 1fr); margin-bottom: 15px; }
		.rj-related-head h2 { font-size: 15px; line-height: 19px; }
		.rj-related-head p { font-size: 7px; line-height: 10px; }
		.rj-related-item { flex-basis: 190px; }
		.rj-related :global(.rj-carousel-track) { gap: 16px; }
		.rj-related-arrow { width: 34px; height: 34px; }
		.rj-related-arrow.is-prev { left: -10px; }
		.rj-related-arrow.is-next { right: -10px; }
		.rj-reviews > p { font-size: 15px; }
		.rj-reviews > h2 { margin-bottom: 30px; font-size: 25px; }
		.rj-review-grid { grid-template-columns: 1fr; }
	}
</style>
