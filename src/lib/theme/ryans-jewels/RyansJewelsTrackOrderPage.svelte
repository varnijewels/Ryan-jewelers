<script lang="ts">
	import { page } from '$app/state'
	import { getUserState } from '$lib/core/stores/index.js'
	import RyansJewelsAccountSidebar from './RyansJewelsAccountSidebar.svelte'

	let { orderTrackingModule = null }: { orderTrackingModule?: any } = $props()
	const userState = getUserState()
	let orderId = $state(page.url.searchParams.get('otp') || page.url.searchParams.get('order') || '')
	let email = $state(page.url.searchParams.get('email') || '')
	const order = $derived(orderTrackingModule?.order)
	const orderNo = $derived(order?.parentOrderNo || order?.orderNo || orderId)
	const status = $derived(titleCase(order?.status || 'processing'))
	const invoiceLink = $derived(order?.invoiceLink || order?.invoiceUrl || order?.fulfillment?.invoiceUrl || order?.fulfillments?.find((entry: any) => entry?.invoiceUrl)?.invoiceUrl || '')
	const origin = $derived(place(order?.fulfillment?.pickup || order?.fulfillments?.[0]?.pickup, 'Surat, India'))
	const destination = $derived(place(order?.shippingAddress, 'California, USA'))
	const progress = $derived(statusProgress(order?.status))
	const timeline = $derived(timelineEntries(order))

	$effect(() => {
		if (!email && userState.user?.email) email = userState.user.email
	})

	function titleCase(value: string) {
		return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
	}

	function formatDate(value: string | number | Date, timeline = false) {
		const parsed = new Date(value)
		if (Number.isNaN(parsed.getTime())) return '—'
		if (timeline) return `${String(parsed.getDate()).padStart(2, '0')}/ ${parsed.toLocaleString('en-US', { month: 'long' })} / ${parsed.getFullYear()}`
		return parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
	}

	function formatTime(value: string | number | Date) {
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
	}

	function place(address: any, fallback: string) {
		if (!address) return fallback
		return [address.city, address.country || address.countryCode].filter(Boolean).join(', ') || fallback
	}

	function statusProgress(value = '') {
		const steps: Record<string, number> = { pending: 10, processing: 28, processed: 32, packed: 40, packing: 40, shipped: 47, out_for_delivery: 78, delivered: 100, cancelled: 0 }
		return steps[String(value).toLowerCase()] ?? 20
	}

	function timelineEntries(currentOrder: any) {
		const entries = currentOrder?.tracking || currentOrder?.timeline || []
		if (Array.isArray(entries) && entries.length) return entries.map((entry: any) => ({
			date: entry.created_at || entry.createdAt || entry.timestamp,
			label: titleCase(entry.status || entry.title || entry.message || 'Order Updated'),
			location: entry.location || entry.comment || origin
		}))
		return currentOrder ? [{ date: currentOrder.updatedAt || currentOrder.createdAt, label: `Order ${status}`, location: origin }] : []
	}
</script>

<svelte:head>
	<title>Track Your Order | Ryan Jewelers</title>
</svelte:head>

<div class="rj-track-shell">
	<RyansJewelsAccountSidebar />
	<main class="rj-track-content">
		<header class="rj-track-heading">
			<h1>Track Your Order</h1>
			<p>Enter your order details to check the current status</p>
		</header>

		<section class="rj-track-card">
			<div class="rj-track-card-heading">
				<h2>Find your order</h2>
				<p>Enter your order ID and email address to track your order</p>
			</div>

			<form action="/order-tracking" method="GET" data-sveltekit-reload>
				<div class="rj-track-fields">
					<label>
						<span>Order ID</span>
						<input name="otp" bind:value={orderId} autocomplete="off" required aria-label="Order ID" />
					</label>
					<label>
						<span>Email Address</span>
						<input name="email" type="email" bind:value={email} autocomplete="email" required aria-label="Email Address" />
					</label>
				</div>
				<button type="submit">Track Order <img src="/ryans-jewels/account/dashboard-search.svg" alt="" /></button>
			</form>
		</section>

		{#if orderTrackingModule}
			{#if orderTrackingModule.loading}
				<div class="rj-track-message" aria-live="polite">Finding your order…</div>
			{:else if order?.orderNo}
				<section class="rj-track-summary">
					<div class="rj-track-order-meta">
						<div><span>Order Id:</span> <strong>{orderNo}</strong> <em class={String(order.status || '').toLowerCase()}><i></i>{status}</em></div>
						<p>Placed on {formatDate(order.createdAt)}</p>
					</div>
					<div class="rj-track-actions">
						<button type="button" title={invoiceLink ? 'Open invoice' : 'Print or save invoice as PDF'} onclick={() => invoiceLink ? window.open(invoiceLink, '_blank', 'noopener,noreferrer') : window.print()}>Invoice <img src="/ryans-jewels/account/track-invoice.svg" alt="" /></button>
						<a href={`/order-details/${orderNo}?otp=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`}>Order Details <img src="/ryans-jewels/account/track-details.svg" alt="" /></a>
						<button type="button" onclick={() => window.print()}>Print <img src="/ryans-jewels/account/track-print.svg" alt="" /></button>
					</div>
				</section>

				<section class="rj-delivery-card">
					<header>
						<h2>Delivery Progress</h2>
						<p>Estimated Delivery: {formatDate(order.estimatedDeliveryDate || order.deliveryDate || new Date(new Date(order.createdAt).getTime() + 5 * 86400000))}</p>
					</header>

					<div class="rj-route">
						<span><img src="/ryans-jewels/account/track-origin.svg" alt="" />{origin}</span>
						<i></i>
						<span><img src="/ryans-jewels/account/track-destination.svg" alt="" />{destination}</span>
					</div>
					<div class="rj-progress"><i style:width={`${progress}%`}></i><b style:left={`${progress}%`}></b></div>

					<div class="rj-timeline">
						<h3>Deliver Timeline History</h3>
						<div class="rj-timeline-list">
							{#each timeline as entry, index (entry.date || index)}
								<div class="rj-timeline-row">
									<i></i>
									<div><time>{formatDate(entry.date, true)}</time><small>{formatTime(entry.date)}</small></div>
									<div><strong>{entry.label}</strong><small>{entry.location}</small></div>
								</div>
							{/each}
						</div>
					</div>
				</section>
			{:else}
				<div class="rj-track-message invalid"><strong>Order not found</strong><span>Please check your order ID and email address.</span></div>
			{/if}
		{/if}
	</main>
</div>

<style>
	.rj-track-shell {
		display: grid;
		box-sizing: border-box;
		grid-template-columns: clamp(225px, 15.625vw, 300px) minmax(0, 1fr);
		width: min(calc(100% - clamp(120px, 8.333vw, 160px)), 1760px);
		min-height: 614px;
		gap: clamp(30px, 2.083vw, 40px);
		align-items: start;
		margin: 44px auto 60px;
	}

	.rj-track-content { min-width: 0; color: #202020; font-family: 'Lato', sans-serif; }
	.rj-track-heading { width: 415px; height: 56px; overflow: hidden; }
	.rj-track-heading h1 { margin: 0; font: 600 22px/22px 'Lato', sans-serif; }
	.rj-track-heading p { margin: 12px 0 0; color: #606060; font: 400 19px/22px 'Lato', sans-serif; white-space: nowrap; }

	.rj-track-card {
		box-sizing: border-box;
		width: 100%;
		height: 252px;
		margin-top: 32px;
		padding: 20px;
		border: 1px solid #c2c2c2;
		border-radius: 6px;
		background: #fff;
		box-shadow: -5px 5px 3px rgba(226, 226, 226, .3);
	}

	.rj-track-card-heading { width: 350px; height: 41px; }
	.rj-track-card-heading h2 { margin: 0; color: #404040; font: 600 16px/19px 'Lato', sans-serif; }
	.rj-track-card-heading p { margin: 5px 0 0; color: #606060; font: 400 14px/17px 'Lato', sans-serif; white-space: nowrap; }
	.rj-track-card form { margin-top: 25px; }
	.rj-track-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
	.rj-track-fields label { display: flex; min-width: 0; flex-direction: column; gap: 5px; }
	.rj-track-fields span { font: 700 16px/26px 'Sarala', sans-serif; }
	.rj-track-fields input { box-sizing: border-box; width: 100%; height: 44px; padding: 0 14px; border: 0; border-radius: 5px; outline: 0; background: #f9f9f9; color: #202020; font: 400 16px/22px 'Lato', sans-serif; }
	.rj-track-fields input:focus { box-shadow: inset 0 0 0 1px #cca646; }
	.rj-track-card button { display: flex; width: 100%; height: 48px; gap: 10px; align-items: center; justify-content: center; margin-top: 20px; padding: 0; border: 0; border-radius: 5px; background: #cca646; color: #fff; font: 600 16px/19px 'Lato', sans-serif; cursor: pointer; }
	.rj-track-card button:hover { background: #bd993e; }
	.rj-track-card button img { width: 20px; height: 20px; filter: brightness(0) invert(1); }

	.rj-track-message { display: flex; box-sizing: border-box; width: 100%; min-height: 90px; align-items: center; justify-content: center; margin-top: 32px; border: 1px solid #c2c2c2; border-radius: 6px; color: #606060; font-size: 14px; }
	.rj-track-message.invalid { flex-direction: column; gap: 5px; }
	.rj-track-message.invalid strong { color: #202020; font-size: 16px; }
	.rj-track-summary { display: flex; box-sizing: border-box; width: 100%; height: 90px; align-items: center; justify-content: space-between; margin-top: 32px; padding: 22px 25px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; }
	.rj-track-order-meta { height: 46px; }
	.rj-track-order-meta > div { display: flex; height: 24px; gap: 8px; align-items: center; white-space: nowrap; }
	.rj-track-order-meta span { color: #707070; font-size: 20px; line-height: 24px; }
	.rj-track-order-meta strong { max-width: 230px; overflow: hidden; font-size: 20px; line-height: 24px; text-overflow: ellipsis; }
	.rj-track-order-meta em { display: flex; gap: 4px; align-items: center; color: #ffb13b; font: 600 16px/19px 'Lato', sans-serif; text-transform: capitalize; }
	.rj-track-order-meta em.delivered { color: #00c41d; }
	.rj-track-order-meta em.cancelled { color: #f63049; }
	.rj-track-order-meta em.processing { color: #0071fb; }
	.rj-track-order-meta em i { width: 5px; height: 5px; flex: 0 0 5px; border-radius: 50%; background: currentColor; }
	.rj-track-order-meta p { margin: 5px 0 0; color: #606060; font-size: 14px; line-height: 17px; }
	.rj-track-actions { display: flex; gap: 22px; align-items: center; }
	.rj-track-actions a, .rj-track-actions button { display: flex; box-sizing: border-box; height: 43px; gap: 10px; align-items: center; justify-content: center; padding: 0 10px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; color: #202020; font: 400 16px/19px 'Lato', sans-serif; text-decoration: none; white-space: nowrap; cursor: pointer; }
	.rj-track-actions button:disabled { cursor: default; }
	.rj-track-actions img { width: 19px; height: 19px; }

	.rj-delivery-card { box-sizing: border-box; width: 100%; height: 675px; margin-top: 20px; padding: 24px 25px; border: 1px solid #c2c2c2; border-radius: 10px; background: #fff; }
	.rj-delivery-card > header { height: 49px; }
	.rj-delivery-card > header h2 { margin: 0; font: 600 22px/22px 'Lato', sans-serif; }
	.rj-delivery-card > header p { margin: 10px 0 0; color: #606060; font: 400 14px/17px 'Lato', sans-serif; }
	.rj-route { display: flex; height: 40px; align-items: center; margin-top: 28px; }
	.rj-route span { display: flex; box-sizing: border-box; min-width: 111px; height: 40px; gap: 6px; align-items: center; justify-content: center; padding: 0 12px; border-radius: 23px; background: #fafafa; font: 400 12px/20px 'Sarala', sans-serif; white-space: nowrap; }
	.rj-route span:last-child { min-width: 135px; padding-inline: 17px; }
	.rj-route span img { width: 18px; height: 18px; }
	.rj-route > i { height: 0; flex: 1; margin-inline: 16px; border-top: 1px dashed #202020; }
	.rj-progress { position: relative; height: 15px; margin-top: 23px; border-radius: 4px; background: linear-gradient(#f5f5f5, #f5f5f5) center/100% 5px no-repeat; }
	.rj-progress i { position: absolute; top: 5px; left: 0; height: 5px; border-radius: 4px; background: #cca646; }
	.rj-progress b { position: absolute; top: 0; box-sizing: border-box; width: 15px; height: 15px; transform: translateX(-100%); border: 3px solid #f28b82; border-radius: 50%; background: #cca646; }
	.rj-timeline { margin-top: 40px; padding-top: 24px; border-top: 1px solid #d9d9d9; }
	.rj-timeline h3 { margin: 0 0 24px; font: 600 16px/19px 'Lato', sans-serif; }
	.rj-timeline-list { display: flex; width: 240px; max-height: 335px; flex-direction: column; gap: 22px; overflow: auto; }
	.rj-timeline-row { position: relative; display: grid; min-height: 29px; grid-template-columns: 8px 94px minmax(0, 1fr); column-gap: 7px; }
	.rj-timeline-row > i { position: relative; width: 8px; height: 8px; margin-top: 3px; border-radius: 50%; background: #cca646; }
	.rj-timeline-row:not(:last-child) > i::after { position: absolute; top: 13px; left: 3px; width: 1px; height: 38px; background: #cca646; content: ''; }
	.rj-timeline-row > div { display: flex; min-width: 0; flex-direction: column; }
	.rj-timeline-row > div:last-child { margin-left: 18px; }
	.rj-timeline-row time { color: #202020; font-size: 11px; line-height: 13px; white-space: nowrap; }
	.rj-timeline-row strong { overflow: hidden; font: 500 14px/17px 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rj-timeline-row small { overflow: hidden; color: #606060; font: 400 10px/12px 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }

	@media (max-width: 900px) {
		.rj-track-shell { display: block; width: calc(100% - 32px); min-height: 0; margin: 24px auto 40px; }
		.rj-track-content { margin-top: 24px; }
		.rj-track-heading { width: 100%; }
		.rj-track-card { height: auto; min-height: 252px; }
		.rj-track-fields { grid-template-columns: 1fr; }
		.rj-track-summary { height: auto; flex-direction: column; gap: 18px; align-items: flex-start; }
		.rj-track-actions { width: 100%; flex-wrap: wrap; gap: 10px; }
		.rj-delivery-card { height: auto; min-height: 675px; }
		.rj-route span { min-width: 0; }
		.rj-route > i { margin-inline: 8px; }
		.rj-timeline-list { width: 100%; }
	}
</style>
