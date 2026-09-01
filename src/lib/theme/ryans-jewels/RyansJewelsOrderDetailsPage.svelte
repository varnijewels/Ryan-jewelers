<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { MyOrdersIdRenderer, OrderTrackingModule } from '$lib/core/composables/index.js'
	import { getCartState } from '$lib/core/stores/index.js'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { toast } from 'svelte-sonner'
	import { productReviewHref } from './commerce-flow.js'

	const cartState = getCartState()
	const hasPublicTracking = Boolean(page.url.searchParams.get('otp') && page.url.searchParams.get('email'))
	const publicTracking: any = hasPublicTracking ? new OrderTrackingModule() : null
	const currency = $derived(page.data?.store?.currency?.code || 'USD')
	let timelineExpanded = $state(false)
	let copiedTrackingNumber = $state('')
	let buyingAgain = $state(false)

	function titleCase(value = '') {
		return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
	}

	function parsedDate(value: any) {
		const result = new Date(value)
		return Number.isNaN(result.getTime()) ? null : result
	}

	function shortDate(value: any) {
		const date = parsedDate(value)
		return date ? `${String(date.getDate()).padStart(2, '0')}/ ${date.toLocaleString('en-US', { month: 'long' })} / ${date.getFullYear()}` : '—'
	}

	function time(value: any) {
		const date = parsedDate(value)
		return date ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''
	}

	function expectedDate(order: any) {
		const created = parsedDate(order?.createdAt) || new Date()
		created.setDate(created.getDate() + Number(order?.shippingRate?.estimatedMaxDays || 5))
		return created.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
	}

	function place(address: any, fallback: string) {
		return [address?.city, address?.country || address?.countryCode].filter(Boolean).join(', ') || fallback
	}

	function plainText(value = '') {
		return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
	}

	function events(order: any) {
		return (order?.tracking || []).map((entry: any) => ({
			date: entry.createdAt || entry.created_at || entry.timestamp,
			label: titleCase(plainText(entry.status || entry.title || entry.message || 'Order updated')),
			location: entry.location || entry.comment || 'Surat, India'
		}))
	}

	function progress(status = '') {
		return ({ created: 16, pending: 16, processing: 42, packed: 58, shipped: 78, delivered: 100 } as Record<string, number>)[status.toLowerCase()] || 16
	}

	function addressText(address: any) {
		return [address?.address_1, address?.address_2, address?.city, address?.state, address?.zip].filter(Boolean).join(', ')
	}

	function shipment(order: any) {
		const fulfillments = [...(order?.fulfillments || []), ...(order?.fulfillment ? [order.fulfillment] : [])]
		return fulfillments.find((entry) => entry?.trackingNumber) || fulfillments[0] || {}
	}

	async function copyTrackingNumber(value: string) {
		let copied = false
		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(value)
				copied = true
			}
		} catch {}
		if (!copied) {
			const textarea = document.createElement('textarea')
			textarea.value = value
			textarea.style.position = 'fixed'
			textarea.style.opacity = '0'
			document.body.append(textarea)
			textarea.select()
			copied = document.execCommand('copy')
			textarea.remove()
		}
		if (copied) {
			copiedTrackingNumber = value
			setTimeout(() => copiedTrackingNumber === value && (copiedTrackingNumber = ''), 1500)
		}
	}

	async function buyAgain(item: any) {
		if (buyingAgain) return
		if (!cartState || !item?.productId || !item?.variantId) return toast.error('This product variation is no longer available')
		buyingAgain = true
		const previousQty = Number(cartState.cart?.lineItems?.find((entry: any) => entry.productId === item.productId && entry.variantId === item.variantId)?.qty || 0)
		await cartState.addOrUpdate({ productId: item.productId, variantId: item.variantId, qty: Number(item.qty || item.quantity || 1) })
		const nextQty = Number(cartState.cart?.lineItems?.find((entry: any) => entry.productId === item.productId && entry.variantId === item.variantId)?.qty || 0)
		buyingAgain = false
		if (nextQty <= previousQty) return toast.error('Unable to add this item to your bag')
		toast.success('Item added to bag')
		await goto('/checkout/cart')
	}

	function useFallbackImage(event: Event) {
		;(event.currentTarget as HTMLImageElement).src = '/ryans-jewels/account/dashboard-product.png'
	}
</script>

<svelte:head><title>Order Details | Ryan Jewelers</title></svelte:head>

{#snippet orderDetails(order: any)}
	{@const item = order?.lineItems?.[0] || {}}
	{@const fulfillment = shipment(order)}
	<!-- ponytail: local demo fallback only; remove when test orders receive backend fulfillments. -->
	{@const trackingNumber = fulfillment?.trackingNumber || order?.trackingNumber || (import.meta.env.DEV ? `RJ-TEST-${order?.orderNo}` : '')}
	{@const trackingEvents = events(order)}
	{@const visibleEvents = timelineExpanded ? trackingEvents : trackingEvents.slice(0, 3)}
	{@const shippingAddress = order?.shippingAddress || {}}
	<div class="rj-order-details">
		<a class="rj-order-back" href={hasPublicTracking ? '/order-tracking' : '/my/orders'}><img src="/ryans-jewels/account/order-back.svg" alt="" />Order Details</a>

		<section class="rj-order-detail-card">
			<div class="rj-order-detail-inner">
				<header class="rj-detail-header">
					<div><span>Order Id:</span><strong>{order?.orderNo || order?.parentOrderNo || '—'}</strong></div>
					<nav>
						<button type="button" disabled={buyingAgain} onclick={() => buyAgain(item)}><img src="/ryans-jewels/account/order-buy-again.svg" alt="" />{buyingAgain ? 'Adding…' : 'Buy Again'}</button><i></i>
						{#if String(order?.status || '').toLowerCase() === 'delivered' && item?.slug}<a href={productReviewHref(item)}><img src="/ryans-jewels/product/review-brush.svg" alt="" />Rate &amp; Review</a><i></i>{/if}
						{#if order?.invoiceLink || order?.invoiceUrl}<a href={order.invoiceLink || order.invoiceUrl} target="_blank"><img src="/ryans-jewels/account/track-invoice.svg" alt="" />Invoice PDF</a>{:else}<span><img src="/ryans-jewels/account/track-invoice.svg" alt="" />Invoice PDF</span>{/if}<i></i>
						<em class={String(order?.status || '').toLowerCase()}><b></b>{titleCase(order?.status || 'Pending')}</em>
					</nav>
				</header>

				<section class="rj-item-summary">
					<h2>Item Summery</h2>
					<div class="rj-item-row">
						<a class="rj-item-image" href={item?.slug ? `/products/${item.slug}` : '/products'}><img src={item?.thumbnail || item?.img || '/ryans-jewels/account/dashboard-product.png'} alt={item?.title || 'Ordered jewellery'} onerror={useFallbackImage} /></a>
					<div class="rj-item-copy"><strong>{item?.title || 'Jewellery Order'}</strong><p>{plainText(item?.description || 'Your Ryan Jewelers order and product details.')}</p><span>Quantity: {String(item?.qty || item?.quantity || 1).padStart(2, '0')}</span></div>
					<b>{formatPrice(Number(item?.total ?? item?.subtotal ?? order?.total ?? 0), currency)}</b>
					</div>
				</section>

				<section class="rj-detail-grid">
					<div class="rj-delivery-overview">
						<header><i><img src="/ryans-jewels/account/order-truck-fast.svg" alt="" /></i><strong>Be patient. package on deliver!</strong></header>
						<div class="rj-mini-route"><span><img src="/ryans-jewels/account/track-origin.svg" alt="" />{place(fulfillment?.pickup, 'Surat, India')}</span><i></i><span><img src="/ryans-jewels/account/track-destination.svg" alt="" />{place(shippingAddress, 'California, USA')}</span></div>
						<div class="rj-mini-progress"><i style:width={`${progress(order?.status)}%`}></i><b style:left={`${progress(order?.status)}%`}></b></div>
					</div>
					<div class="rj-stat-card"><header><i><img src="/ryans-jewels/account/order-calendar.svg" alt="" /></i><strong>Expect arrival date</strong></header><b>{expectedDate(order)}</b></div>
					<div class="rj-stat-card"><header><i><img src="/ryans-jewels/account/order-timer.svg" alt="" /></i><strong>Delivered days</strong></header><b>{order?.shippingRate?.estimatedMaxDays || 5} Days</b></div>
				</section>

				<section class="rj-info-grid">
					<div class="rj-timeline-card">
						<header><strong>Deliver Timeline</strong>{#if trackingEvents.length > 3}<button type="button" onclick={() => (timelineExpanded = !timelineExpanded)}>{timelineExpanded ? 'View Less' : 'View All'} <span><img src="/ryans-jewels/account/order-arrow-right.svg" alt="" /><img src="/ryans-jewels/account/order-arrow-right.svg" alt="" /></span></button>{/if}</header>
					<div class="rj-detail-timeline">
						{#each visibleEvents as entry, index (entry.date || index)}<div><i></i><time>{shortDate(entry.date)}<small>{time(entry.date)}</small></time><p>{entry.label}<small>{entry.location}</small></p></div>{/each}
						{#if !visibleEvents.length}<p class="rj-no-timeline">No delivery updates yet</p>{/if}
					</div>
					</div>

					<div class="rj-shipment-card">
						<h3>Shipment Details</h3>
						<div class="rj-shipping-company"><img src="/ryans-jewels/account/order-shipping-logo.png" alt="" /><p>{fulfillment?.courierName || fulfillment?.shippingProvider || 'Shipping logistics Company'}<small>{place(fulfillment?.pickup, 'Surat, India')}</small></p></div>
						<div class="rj-shipment-bottom"><p><strong>Delivery Address</strong><span>{addressText(shippingAddress) || 'Address not available'}</span></p><p><strong>Tracking No</strong><button type="button" disabled={!trackingNumber} title={trackingNumber ? `Copy ${trackingNumber}` : 'Tracking number not assigned'} aria-label={trackingNumber ? `Copy tracking number ${trackingNumber}` : 'Tracking number not assigned'} onclick={() => copyTrackingNumber(trackingNumber)}><span>{copiedTrackingNumber === trackingNumber ? 'Copied!' : trackingNumber || 'Not assigned'}</span><img src="/ryans-jewels/account/order-note.svg" alt="" /></button></p></div>
					</div>
				</section>

				<section class="rj-bottom-grid">
					<div><header><img src="/ryans-jewels/account/order-location.svg" alt="" />Shipping Address</header><p><strong>{shippingAddress?.firstName} {shippingAddress?.lastName}</strong><span>{addressText(shippingAddress) || 'Address not available'}</span><small>{shippingAddress?.phone || ''}</small></p></div>
					<div><header><img src="/ryans-jewels/account/order-wallet.svg" alt="" />Payment Details</header><p class="payment"><strong><img src="/ryans-jewels/account/order-mastercard.png" alt="" />{titleCase(order?.paymentGateway || order?.paymentMethod || 'Payment')} - {titleCase(order?.paymentStatus || 'Pending')}</strong><span>{order?.paymentReferenceId ? `Reference ${order.paymentReferenceId}` : 'Payment reference not available'}</span><small>Total bill payment <b>{formatPrice(Number(order?.total || 0), currency)}</b></small></p></div>
				</section>
			</div>
		</section>
	</div>
{/snippet}

{#if publicTracking}
	{#if publicTracking.loading}<div class="rj-detail-loading">Loading order details…</div>{:else if publicTracking.order}{@render orderDetails(publicTracking.order)}{:else}<div class="rj-detail-loading">Order not found</div>{/if}
{:else}
	<MyOrdersIdRenderer>{#snippet content({ loading, order })}{#if loading}<div class="rj-detail-loading">Loading order details…</div>{:else if order}{@render orderDetails(order)}{:else}<div class="rj-detail-loading">Order not found</div>{/if}{/snippet}</MyOrdersIdRenderer>
{/if}

<style>
	.rj-order-details { width: 100%; color: #202020; font-family: 'Lato', sans-serif; }
	.rj-order-back { display: inline-flex; height: 26px; gap: 12px; align-items: center; color: #000; font-size: 22px; font-weight: 700; line-height: 26px; text-decoration: none; }
	.rj-order-back img { width: 26px; height: 26px; }
	.rj-order-detail-card { box-sizing: border-box; width: 100%; height: 927px; margin-top: 20px; padding: 18px 22px 30px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; }
	.rj-order-detail-inner { width: 100%; height: 877px; }
	.rj-detail-header { display: flex; height: 66px; align-items: flex-start; justify-content: space-between; border-bottom: 1px solid #d9d9d9; }
	.rj-detail-header > div { display: flex; width: 133px; flex-direction: column; gap: 3px; }
	.rj-detail-header > div span { color: #606060; font-size: 14px; line-height: 17px; }
	.rj-detail-header > div strong { overflow: hidden; font-size: 16px; line-height: 19px; text-overflow: ellipsis; white-space: nowrap; }
	.rj-detail-header nav { display: flex; gap: 16px; align-items: center; margin-top: 8px; }
	.rj-detail-header nav a, .rj-detail-header nav button, .rj-detail-header nav > span { display: flex; gap: 6px; align-items: center; padding: 0; border: 0; background: transparent; color: #202020; font: inherit; font-size: 16px; line-height: 19px; text-decoration: none; white-space: nowrap; }
	.rj-detail-header nav button { cursor: pointer; }
	.rj-detail-header nav img { width: 22px; height: 22px; }
	.rj-detail-header nav > i { width: 1px; height: 20px; background: #c2c2c2; }
	.rj-detail-header nav em { display: flex; gap: 4px; align-items: center; color: #ffb13b; font-size: 16px; font-weight: 600; line-height: 19px; }
	.rj-detail-header nav em.delivered { color: #00c41d; } .rj-detail-header nav em.cancelled { color: #f63049; }
	.rj-detail-header nav em b { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
	.rj-item-summary { height: 203px; margin-top: 16px; }
	.rj-item-summary h2 { margin: 0 0 15px; color: #606060; font-size: 16px; font-weight: 400; line-height: 19px; }
	.rj-item-row { display: grid; height: 169px; grid-template-columns: 169px minmax(0, 1fr) auto; gap: 15px; align-items: start; }
	.rj-item-image { display: grid; width: 169px; height: 169px; overflow: hidden; border-radius: 5px; background: #fafafa; place-items: center; }
	.rj-item-image img { width: 100%; height: 100%; object-fit: contain; }
	.rj-item-copy { width: min(100%, 387px); }
	.rj-item-copy > strong { display: block; overflow: hidden; font-size: 20px; font-weight: 500; line-height: 24px; text-overflow: ellipsis; white-space: nowrap; }
	.rj-item-copy p { display: -webkit-box; overflow: hidden; margin: 10px 0 8px; color: #606060; font-size: 14px; line-height: 19px; line-clamp: 2; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
	.rj-item-copy span { color: #606060; font-size: 14px; line-height: 19px; }
	.rj-item-row > b { font-size: 20px; font-weight: 500; line-height: 24px; }
	.rj-detail-grid { display: grid; height: 170px; grid-template-columns: 501fr 237fr 237fr; gap: 24px; margin-top: 26px; }
	.rj-delivery-overview, .rj-stat-card { box-sizing: border-box; height: 170px; padding: 15px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fcfcfc; }
	.rj-delivery-overview header, .rj-stat-card header { display: flex; gap: 10px; align-items: center; }
	.rj-delivery-overview header i, .rj-stat-card header i { display: grid; width: 42px; height: 42px; flex: 0 0 42px; border-radius: 50%; background: #f0f0f0; place-items: center; }
	.rj-delivery-overview header img, .rj-stat-card header img { width: 24px; height: 24px; }
	.rj-delivery-overview header strong, .rj-stat-card header strong { font-size: 16px; font-weight: 600; line-height: 19px; white-space: nowrap; }
	.rj-mini-route { display: flex; height: 32px; align-items: center; margin-top: 30px; }
	.rj-mini-route span { display: flex; min-width: 111px; gap: 6px; align-items: center; justify-content: center; font: 400 12px/20px 'Sarala', sans-serif; white-space: nowrap; }
	.rj-mini-route span img { width: 18px; height: 18px; }
	.rj-mini-route > i { flex: 1; margin-inline: 16px; border-top: 1px dashed #202020; }
	.rj-mini-progress { position: relative; height: 15px; margin-top: 10px; background: linear-gradient(#f5f5f5, #f5f5f5) center/100% 5px no-repeat; }
	.rj-mini-progress i { position: absolute; top: 5px; left: 0; height: 5px; border-radius: 4px; background: #cca646; }
	.rj-mini-progress b { position: absolute; top: 0; box-sizing: border-box; width: 15px; height: 15px; transform: translateX(-100%); border: 3px solid #f28b82; border-radius: 50%; background: #cca646; }
	.rj-stat-card { display: flex; flex-direction: column; justify-content: space-between; }
	.rj-stat-card > b { font: 700 18px/29px 'Sarala', sans-serif; }
	.rj-info-grid, .rj-bottom-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin-top: 24px; }
	.rj-timeline-card, .rj-shipment-card { box-sizing: border-box; height: 200px; padding: 16px 17px; border-radius: 5px; background: #fcfcfc; }
	.rj-timeline-card > header { display: flex; height: 19px; align-items: flex-start; justify-content: space-between; }
	.rj-timeline-card > header strong, .rj-shipment-card h3 { margin: 0; font-size: 16px; font-weight: 600; line-height: 19px; }
	.rj-timeline-card > header button { display: flex; gap: 0; align-items: center; padding: 0; border: 0; background: transparent; color: #606060; font: 500 14px/17px 'Lato', sans-serif; cursor: pointer; }
	.rj-timeline-card > header button span { display: flex; width: 20px; }
	.rj-timeline-card > header button img { width: 14px; height: 14px; }
	.rj-timeline-card > header button img + img { margin-left: -8px; }
	.rj-detail-timeline { display: flex; max-height: 127px; flex-direction: column; gap: 20px; margin-top: 15px; overflow: auto; }
	.rj-detail-timeline > div { position: relative; display: grid; min-height: 29px; grid-template-columns: 8px 94px minmax(0, 1fr); gap: 7px; }
	.rj-detail-timeline > div > i { width: 8px; height: 8px; margin-top: 3px; border-radius: 50%; background: #cca646; }
	.rj-detail-timeline > div:not(:last-child) > i::after { position: absolute; top: 14px; left: 3px; width: 1px; height: 34px; background: #cca646; content: ''; }
	.rj-detail-timeline time, .rj-detail-timeline p { display: flex; min-width: 0; flex-direction: column; margin: 0; font-size: 11px; line-height: 13px; white-space: nowrap; }
	.rj-detail-timeline p { overflow: hidden; margin-left: 18px; font-size: 14px; font-weight: 500; line-height: 17px; text-overflow: ellipsis; }
	.rj-detail-timeline small { overflow: hidden; color: #606060; font-size: 10px; font-weight: 400; line-height: 12px; text-overflow: ellipsis; }
	.rj-no-timeline { color: #606060; font-size: 13px !important; }
	.rj-shipment-card h3 { height: 19px; }
	.rj-shipping-company { display: flex; height: 44px; gap: 12px; align-items: center; margin-top: 15px; }
	.rj-shipping-company > img { width: 76px; height: 44px; border-radius: 4px; object-fit: contain; background: #f7f7f7; }
	.rj-shipping-company p { display: flex; flex-direction: column; margin: 0; font-size: 14px; font-weight: 500; line-height: 17px; }
	.rj-shipping-company small { margin-top: 4px; color: #606060; font-size: 10px; font-weight: 400; line-height: 12px; }
	.rj-shipment-bottom { display: flex; align-items: flex-start; justify-content: space-between; margin-top: 23px; }
	.rj-shipment-bottom p { display: flex; max-width: 256px; flex-direction: column; gap: 10px; margin: 0; }
	.rj-shipment-bottom strong { font-size: 14px; font-weight: 500; line-height: 17px; }
	.rj-shipment-bottom span { display: -webkit-box; overflow: hidden; color: #606060; font-size: 11px; line-height: 14px; line-clamp: 2; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
	.rj-shipment-bottom button { display: flex; max-width: 150px; height: 31px; gap: 10px; align-items: center; padding: 0 12px; overflow: hidden; border: 1px solid #c2c2c2; border-radius: 19px; background: transparent; color: #606060; font-size: 12px; cursor: pointer; }
	.rj-shipment-bottom button:disabled { cursor: default; }
	.rj-shipment-bottom button span { display: block; overflow: hidden; color: inherit; font-size: inherit; line-height: inherit; text-overflow: ellipsis; white-space: nowrap; }
	.rj-shipment-bottom button img { width: 15px; height: 15px; }
	.rj-bottom-grid { margin-top: 24px; }
	.rj-bottom-grid > div { box-sizing: border-box; height: 148px; padding: 16px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fcfcfc; }
	.rj-bottom-grid header { display: flex; gap: 8px; align-items: center; font-size: 16px; font-weight: 600; line-height: 19px; }
	.rj-bottom-grid header img { width: 17px; height: 17px; }
	.rj-bottom-grid p { display: flex; max-width: 330px; flex-direction: column; gap: 7px; margin: 24px 0 0; }
	.rj-bottom-grid p > strong { font-size: 14px; font-weight: 500; line-height: 17px; }
	.rj-bottom-grid p > span, .rj-bottom-grid p > small { color: #606060; font-size: 12px; font-style: normal; line-height: 14px; }
	.rj-bottom-grid .payment strong { display: flex; gap: 10px; align-items: center; }
	.rj-bottom-grid .payment strong img { width: 24px; height: 18px; object-fit: contain; }
	.rj-bottom-grid .payment small b { color: #202020; font-weight: 600; }
	.rj-detail-loading { display: grid; min-height: 927px; place-items: center; color: #606060; font-family: 'Lato', sans-serif; }

	@media (max-width: 1100px) {
		.rj-order-detail-card { height: auto; min-height: 927px; }
		.rj-order-detail-inner { height: auto; }
		.rj-detail-grid { height: auto; grid-template-columns: 1fr 1fr; }
		.rj-delivery-overview { grid-column: 1 / -1; }
		.rj-detail-header { height: auto; min-height: 66px; flex-direction: column; gap: 15px; }
		.rj-detail-header nav { flex-wrap: wrap; margin-bottom: 12px; }
	}

	@media (max-width: 700px) {
		.rj-order-back { font-size: 19px; }
		.rj-order-detail-card { padding: 14px; }
		.rj-item-row { height: auto; grid-template-columns: 100px minmax(0, 1fr); }
		.rj-item-image { width: 100px; height: 120px; }
		.rj-item-row > b { grid-column: 2; }
		.rj-item-summary { height: auto; }
		.rj-detail-grid, .rj-info-grid, .rj-bottom-grid { grid-template-columns: 1fr; }
		.rj-delivery-overview { overflow: hidden; }
		.rj-timeline-card, .rj-shipment-card, .rj-bottom-grid > div { height: auto; min-height: 148px; }
	}
</style>
