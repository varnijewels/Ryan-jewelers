<script lang="ts">
	import { page } from '$app/state'
	import { MyOrdersRenderer } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { dashboardOrderRows, dashboardOrderStatus } from './account-dashboard.logic.js'

	let search = $state('')
	const currency = $derived(page.data?.store?.currency?.code || 'USD')

	function itemCategory(item: any) {
		return item.categoryTitle || item.category?.title || item.variantTitle || 'Jewellery'
	}
</script>

<MyOrdersRenderer>
	{#snippet content({ loading, orders })}
		{@const rows = dashboardOrderRows(orders, 'all', search)}
		<section class="rj-orders-page">
			<header>
				<strong>All Order History</strong>
				<label><img src="/ryans-jewels/account/dashboard-search.svg" alt="" /><input type="search" bind:value={search} placeholder="Search for product, order id" aria-label="Search order history" /></label>
			</header>

			{#if loading}
				<div class="rj-orders-loading" aria-live="polite">Loading order history…</div>
			{:else if rows.length}
				<div class="rj-orders-list">
					{#each rows as row (row.key)}
						{@const orderId = row.order.parentOrderNo || row.order.orderNo}
						{@const status = dashboardOrderStatus(row.order.status)}
						<article class="rj-order-row">
							<a class="rj-order-image" href="/my/orders/{orderId}"><img src={row.item.thumbnail || row.item.image || '/ryans-jewels/account/dashboard-product.png'} alt={row.item.title || 'Ordered jewellery'} /></a>
							<div class="rj-order-information">
								<div class="rj-order-heading">
									<div><a href="/my/orders/{orderId}">{row.item.title || 'Jewellery Order'}</a><p>{row.item.description || row.item.subtitle || 'Your Ryan Jewelers order and product details.'}</p></div>
									<div class="rj-order-actions">
										{#if status !== 'cancelled'}<a class="tracking" href="/order-tracking?order={orderId}">Tracking Order <img src="/ryans-jewels/account/dashboard-order-truck.svg" alt="" /></a>{/if}
										<a class="details" href="/my/orders/{orderId}">Order Details <img src="/ryans-jewels/account/dashboard-arrow-right.svg" alt="" /></a>
									</div>
								</div>
								<div class="rj-order-meta">
									<span>Price: <b>{formatPrice(Number(row.item.total ?? row.item.price ?? 0), currency)}</b></span>
									<span>Qty: <b>{row.item.qty || row.item.quantity || 1}</b></span>
									<span>Order Id: <b>{orderId || '_'}</b></span>
									<span>Product Categories: <b>{itemCategory(row.item)}</b></span>
									<span>Order Status: <b class="rj-order-status {status}"><i></i>{row.order.status || 'Pending'}</b></span>
								</div>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="rj-orders-empty">
					<img src="/ryans-jewels/account/dashboard-no-order.png" alt="" />
					<strong>{search ? 'No Orders Found' : 'No Orders Placed Yet'}</strong>
					<p>{search ? 'No orders match your search.' : 'Don’t wait & let’s make your first purchase now.'}</p>
					<a href="/products">Continue Shopping <img src="/ryans-jewels/account/dashboard-arrow-right.svg" alt="" /></a>
				</div>
			{/if}
		</section>
	{/snippet}
</MyOrdersRenderer>

<style>
	.rj-orders-page { box-sizing: border-box; width: 100%; min-height: 853px; padding: 20px; border: 1px solid #c2c2c2; border-radius: 5px; background: #fcfcfc; color: #202020; font-family: 'Lato', sans-serif; }
	.rj-orders-page > header { display: flex; height: 40px; align-items: flex-start; justify-content: space-between; }
	.rj-orders-page > header strong { font: 700 15px/22px 'Sarala', sans-serif; }
	.rj-orders-page > header label { display: flex; box-sizing: border-box; width: 280px; height: 40px; gap: 10px; align-items: center; padding: 9px 15px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; }
	.rj-orders-page > header label img { width: 18px; height: 18px; flex: 0 0 18px; }
	.rj-orders-page > header input { min-width: 0; flex: 1; border: 0; outline: 0; background: transparent; color: #404040; font: 400 13px/22px 'Lato', sans-serif; }
	.rj-orders-page > header input::placeholder { color: #606060; opacity: 1; }
	.rj-orders-list { display: flex; flex-direction: column; margin-top: 20px; }
	.rj-order-row { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 15px; min-height: 150px; align-items: center; padding: 10px 0; border-bottom: 1px solid #f7f7f7; }
	.rj-order-row:last-child { border-bottom: 0; }
	.rj-order-image { display: block; width: 110px; height: 110px; overflow: hidden; border-radius: 8px; background: rgba(232, 232, 232, .2); }
	.rj-order-image img { width: 100%; height: 100%; object-fit: contain; }
	.rj-order-information { display: flex; min-width: 0; height: 102px; flex-direction: column; justify-content: space-between; }
	.rj-order-heading { display: flex; min-width: 0; align-items: flex-start; justify-content: space-between; gap: 24px; }
	.rj-order-heading > div:first-child { min-width: 0; width: min(48%, 520px); }
	.rj-order-heading > div:first-child > a { display: block; overflow: hidden; color: #202020; font: 600 20px/normal 'Lato', sans-serif; text-decoration: none; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap; }
	.rj-order-heading p { display: -webkit-box; overflow: hidden; margin: 10px 0 0; color: #707070; font-size: 13px; line-height: 19px; line-clamp: 2; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
	.rj-order-actions { display: flex; flex: 1; gap: 20px; align-items: center; justify-content: flex-end; }
	.rj-order-actions a { display: flex; height: 35px; gap: 5px; align-items: center; padding: 8px 10px; border-radius: 5px; font-size: 14px; line-height: 19px; text-decoration: none; white-space: nowrap; }
	.rj-order-actions a img { width: 19px; height: 19px; object-fit: contain; }
	.rj-order-actions .tracking { background: rgba(255, 196, 196, .4); color: #a80139; }
	.rj-order-actions .details { background: #d4efff; color: #0053ab; }
	.rj-order-meta { display: flex; min-width: 0; gap: clamp(16px, 1.389vw, 30px); align-items: center; color: #707070; font-size: 14px; line-height: 19px; white-space: nowrap; }
	.rj-order-meta span { overflow: hidden; text-overflow: ellipsis; }
	.rj-order-meta b { color: #202020; font-weight: 600; }
	.rj-order-meta .rj-order-status { display: inline-flex; gap: 4px; align-items: center; font-weight: 400; text-transform: capitalize; }
	.rj-order-status i { width: 5px; height: 5px; flex: 0 0 5px; border-radius: 50%; background: currentColor; }
	.rj-order-status.delivered { color: #00c41d; }
	.rj-order-status.cancelled { color: #f63049; }
	.rj-order-status.shipped { color: #ffb13b; }
	.rj-order-status.processing { color: #0071fb; }
	.rj-orders-loading { display: grid; min-height: 720px; place-items: center; color: #808080; font-size: 14px; }
	.rj-orders-empty { display: flex; min-height: 720px; flex-direction: column; gap: 9px; align-items: center; justify-content: center; text-align: center; }
	.rj-orders-empty > img { width: 140px; height: 140px; object-fit: contain; }
	.rj-orders-empty strong { color: #404040; font-size: 18px; line-height: 22px; }
	.rj-orders-empty p { margin: 0; color: #808080; font-size: 13px; line-height: 22px; }
	.rj-orders-empty > a { display: flex; height: 38px; gap: 10px; align-items: center; margin-top: 2px; padding: 8px 15px; border-radius: 4px; background: #cca646; color: #fff; font-size: 14px; text-decoration: none; }
	.rj-orders-empty > a img { width: 22px; height: 22px; filter: brightness(0) invert(1); }

	@media (max-width: 1200px) {
		.rj-order-meta { flex-wrap: wrap; gap: 5px 18px; white-space: normal; }
	}

	@media (max-width: 700px) {
		.rj-orders-page { min-height: 600px; padding: 12px; }
		.rj-orders-page > header { height: auto; flex-direction: column; gap: 15px; }
		.rj-orders-page > header label { width: 100%; }
		.rj-order-row { grid-template-columns: 80px minmax(0, 1fr); gap: 10px; min-height: 160px; }
		.rj-order-image { width: 80px; height: 100px; }
		.rj-order-information { height: auto; min-height: 140px; gap: 10px; }
		.rj-order-heading { display: block; }
		.rj-order-heading > div:first-child { width: 100%; }
		.rj-order-heading > div:first-child > a { font-size: 16px; }
		.rj-order-actions { justify-content: flex-start; margin-top: 8px; }
		.rj-order-actions a { height: 32px; padding: 6px 8px; font-size: 12px; }
		.rj-order-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 10px; font-size: 11px; }
		.rj-order-meta span:nth-child(4) { display: none; }
	}
</style>
