<script lang="ts">
	import { page } from '$app/state'
	import { MyOrdersRenderer, ProductCardRenderer } from '$lib/core/composables/index.js'
	import { getCartState, getUserState } from '$lib/core/stores/index.js'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { dashboardOrderRows, dashboardOrderStatus, deliveredOrderCount } from './account-dashboard.logic.js'

	const userState = getUserState()
	const cartState = getCartState()
	let orderFilter = $state('all')
	let orderSearch = $state('')

	const userName = $derived(`${userState?.user?.firstName || ''} ${userState?.user?.lastName || ''}`.trim() || userState?.user?.name || 'Ryan Jewels Customer')
	const product = $derived(page.data?.dashboardProducts?.[0])
	const currency = $derived(page.data?.store?.currency?.code || 'USD')
	const couponCount = $derived(cartState?.cart?.couponCode ? 1 : 0)

	function itemCategory(item: any) {
		return item.categoryTitle || item.category?.title || item.variantTitle || 'Jewellery'
	}
</script>

<svelte:head><title>My Profile | Ryan Jewelers</title></svelte:head>

<MyOrdersRenderer>
	{#snippet content({ loading, orders })}
		{@const orderRows = dashboardOrderRows(orders, orderFilter, orderSearch)}
		<section class="rj-dashboard">
			<div class="rj-dashboard-top">
				<article class="rj-profile-summary">
					<header>
						<div class="rj-profile-person">
							<img src="/ryans-jewels/account/dashboard-avatar.svg" alt="" />
							<div><strong>{userName}</strong><a href="/my/profile">Account Profile <img src="/ryans-jewels/account/dashboard-export.svg" alt="" /></a></div>
						</div>
						<a class="rj-online-support" href="/contact-us">Online Support</a>
					</header>
					<div class="rj-profile-stats">
						<div><strong>0</strong><span>Unread messages</span></div><i></i>
						<div><strong>{deliveredOrderCount(orders)}</strong><span>Total Delivered Order</span></div><i></i>
						<div><strong>{couponCount}</strong><span>Coupons</span></div>
					</div>
				</article>

				<article class="rj-browsing-card">
					<header><strong>My Browsing History</strong><a href="/products">View All</a></header>
					<div class="rj-browsing-body">
						{#if product}
							<ProductCardRenderer {product} aspectRatio="101:99">
								{#snippet content({ toggleWishlist, isWishlisted, loadingForWishlist })}
									<a class="rj-history-product" href="/products/{product.slug}">
										<img src={product.thumbnail || product.img || '/ryans-jewels/account/dashboard-product.png'} alt={product.title || 'Recently viewed product'} />
										<span>{product.title || 'Silver Diamond Ring'}</span>
										<small><b>{formatPrice(product.price || 0, currency)}</b>{#if product.mrp > product.price}<s>{formatPrice(product.mrp, currency)}</s>{/if}</small>
									</a>
									<i></i>
									<button class="rj-history-wishlist" type="button" disabled={loadingForWishlist || isWishlisted} onclick={toggleWishlist}>
										<img src="/ryans-jewels/account/dashboard-bag.png" alt="" /><span>{isWishlisted ? 'In' : 'Move to'}<b>Wishlist</b></span>
									</button>
								{/snippet}
							</ProductCardRenderer>
						{:else}
							<a class="rj-history-product" href="/products"><img src="/ryans-jewels/account/dashboard-product.png" alt="Silver Diamond Ring" /><span>Silver Diamond Ring</span><small><b>$265.85</b><s>$295.85</s></small></a>
							<i></i>
							<a class="rj-history-wishlist" href="/my/wishlist"><img src="/ryans-jewels/account/dashboard-bag.png" alt="" /><span>Move to<b>Wishlist</b></span></a>
						{/if}
					</div>
				</article>
			</div>

			<article class:with-orders={orderRows.length > 0} class="rj-order-history">
				<header>
					<strong>All Order History</strong>
					<div class="rj-order-tools">
						<label class="rj-order-filter"><img src="/ryans-jewels/account/dashboard-filter.svg" alt="" /><select bind:value={orderFilter} aria-label="Filter orders"><option value="all">Select Filter</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select><img src="/ryans-jewels/account/dashboard-arrow-down.svg" alt="" /></label>
						<label class="rj-order-search"><img src="/ryans-jewels/account/dashboard-search.svg" alt="" /><input type="search" bind:value={orderSearch} placeholder="Search for product, order id" aria-label="Search order history" /></label>
					</div>
				</header>

				{#if loading}
					<div class="rj-orders-loading" aria-live="polite">Loading order history…</div>
				{:else if orderRows.length}
					<div class="rj-order-list">
						{#each orderRows.slice(0, 3) as row (row.key)}
							{@const orderId = row.order.parentOrderNo || row.order.orderNo}
							{@const status = dashboardOrderStatus(row.order.status)}
							<div class="rj-order-row">
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
										<span>Order Status: <b class="rj-status {status}"><i></i>{row.order.status || 'Processing'}</b></span>
									</div>
								</div>
							</div>
						{/each}
					</div>
					<a class="rj-orders-view-all" href="/my/orders">View All <span>››</span></a>
				{:else}
					<div class="rj-no-orders">
						<img src="/ryans-jewels/account/dashboard-no-order.png" alt="" />
						<div><strong>No Orders Placed Yet</strong><p>{orderSearch || orderFilter !== 'all' ? 'No orders match your current search or filter.' : 'Don’t wait & let’s make your first punches now.'}</p></div>
						<a href="/products">Continue Shopping <img src="/ryans-jewels/account/dashboard-arrow-right.svg" alt="" /></a>
					</div>
				{/if}
			</article>
		</section>
	{/snippet}
</MyOrdersRenderer>

<style>
	.rj-dashboard { display: flex; width: 100%; flex-direction: column; gap: clamp(24px, 1.667vw, 32px); color: #202020; font-family: 'Lato', sans-serif; }
	.rj-dashboard-top { display: grid; grid-template-columns: minmax(0, 2.3558fr) minmax(312px, 1fr); gap: clamp(24px, 1.667vw, 32px); }
	.rj-profile-summary, .rj-browsing-card, .rj-order-history { box-sizing: border-box; border: 1px solid #c2c2c2; border-radius: 5px; background: #fcfcfc; }
	.rj-profile-summary { height: 210px; padding: 11px 15px; }
	.rj-profile-summary > header { display: flex; height: 52px; align-items: center; justify-content: space-between; }
	.rj-profile-person { display: flex; gap: 7px; align-items: center; }
	.rj-profile-person > img { width: 52px; height: 52px; }
	.rj-profile-person > div { display: flex; flex-direction: column; gap: 2px; }
	.rj-profile-person strong { color: #404040; font: 700 15px/22px 'Sarala', sans-serif; white-space: nowrap; }
	.rj-profile-person a { display: flex; gap: 5px; align-items: center; color: #0071fb; font: 400 12px/normal 'Lato', sans-serif; text-decoration: underline; }
	.rj-profile-person a img { width: 12px; height: 12px; }
	.rj-online-support { color: #404040; font: 400 14px/22px 'Lato', sans-serif; text-decoration: underline; }
	.rj-profile-stats { display: grid; width: 554px; max-width: 100%; grid-template-columns: 108px 1px 133px 1px 55px; gap: 64px; align-items: center; margin: 56px auto 0; }
	.rj-profile-stats div { display: flex; flex-direction: column; gap: 12px; align-items: center; white-space: nowrap; }
	.rj-profile-stats strong { color: #000; font: 700 32px/22px 'Sarala', sans-serif; }
	.rj-profile-stats span { font-size: 14px; line-height: 22px; }
	.rj-profile-stats i { width: 1px; height: 80px; background: #c2c2c2; }
	.rj-browsing-card { height: 210px; padding: 15px 20px; }
	.rj-browsing-card > header { display: flex; align-items: center; justify-content: space-between; }
	.rj-browsing-card > header strong { font: 700 15px/22px 'Sarala', sans-serif; }
	.rj-browsing-card > header a { color: #404040; font-size: 14px; text-decoration: none; }
	.rj-browsing-body { display: grid; grid-template-columns: 101px 1px 100px; gap: 24px; align-items: center; justify-content: center; margin-top: 20px; }
	.rj-browsing-body > i { width: 1px; height: 130px; background: #d9d9d9; }
	.rj-history-product { display: flex; width: 101px; flex-direction: column; gap: 5px; align-items: center; color: #404040; text-decoration: none; }
	.rj-history-product > img { width: 101px; height: 99px; border-radius: 5px; object-fit: contain; background: rgba(231, 231, 231, .2); }
	.rj-history-product > span { display: block; width: 101px; overflow: hidden; font-size: 11px; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
	.rj-history-product small { display: flex; gap: 3px; align-items: center; font-size: 10px; white-space: nowrap; }
	.rj-history-product small b { color: #202020; }
	.rj-history-product small s { color: #ff766b; }
	.rj-history-wishlist { display: flex; box-sizing: border-box; width: 100px; height: 131px; flex-direction: column; gap: 6px; align-items: center; justify-content: center; padding: 11px 22px; border: 0; border-radius: 5px; background: #f6f6f6; color: #404040; font: 400 9px/normal 'Lato', sans-serif; text-align: center; text-decoration: none; cursor: pointer; }
	.rj-history-wishlist:disabled { opacity: .7; cursor: default; }
	.rj-history-wishlist > img { width: 56px; height: 73px; object-fit: cover; }
	.rj-history-wishlist span { display: flex; flex-direction: column; }
	.rj-history-wishlist b { color: #202020; font-size: 14px; }
	.rj-order-history { min-height: 510px; padding: 21px 20px; }
	.rj-order-history > header { display: flex; min-height: 40px; align-items: flex-start; justify-content: space-between; }
	.rj-order-history > header > strong { font: 700 15px/22px 'Sarala', sans-serif; }
	.rj-order-tools { display: flex; gap: 15px; align-items: center; }
	.rj-order-filter, .rj-order-search { display: flex; box-sizing: border-box; height: 40px; align-items: center; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; }
	.rj-order-filter { width: 151px; gap: 10px; padding: 9px 10px; }
	.rj-order-filter > img, .rj-order-search > img { width: 18px; height: 18px; flex: 0 0 18px; }
	.rj-order-filter select { width: 75px; flex: 1; appearance: none; border: 0; outline: 0; background: transparent; color: #606060; font: 400 13px/22px 'Lato', sans-serif; }
	.rj-order-search { width: 280px; gap: 10px; padding: 9px 15px; }
	.rj-order-search input { min-width: 0; flex: 1; border: 0; outline: 0; background: transparent; color: #404040; font: 400 13px/22px 'Lato', sans-serif; }
	.rj-order-search input::placeholder { color: #606060; opacity: 1; }
	.rj-orders-loading { display: grid; min-height: 350px; place-items: center; color: #808080; font-size: 14px; }
	.rj-no-orders { display: flex; width: 268px; flex-direction: column; gap: 10px; align-items: center; margin: 61px auto 0; text-align: center; }
	.rj-no-orders > img { width: 140px; height: 140px; object-fit: contain; }
	.rj-no-orders > div { display: flex; flex-direction: column; gap: 1px; }
	.rj-no-orders strong { color: #404040; font-size: 18px; line-height: 22px; }
	.rj-no-orders p { margin: 0; color: #808080; font-size: 13px; line-height: 22px; white-space: nowrap; }
	.rj-no-orders > a { display: flex; height: 38px; gap: 10px; align-items: center; padding: 8px 15px; border-radius: 4px; background: #cca646; color: #fff; font: 400 14px/21px 'Inter', sans-serif; text-decoration: none; }
	.rj-no-orders > a img { width: 22px; height: 22px; filter: brightness(0) invert(1); }
	.rj-order-history.with-orders { min-height: 0; padding-bottom: 0; }
	.rj-order-list { display: flex; flex-direction: column; margin-top: 20px; }
	.rj-order-row { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 15px; min-height: 150px; align-items: center; padding: 10px 0; border-bottom: 1px solid #f7f7f7; }
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
	.rj-order-meta { display: flex; min-width: 0; gap: clamp(18px, 2.083vw, 40px); align-items: center; color: #707070; font-size: 14px; line-height: 19px; white-space: nowrap; }
	.rj-order-meta span { overflow: hidden; text-overflow: ellipsis; }
	.rj-order-meta b { color: #202020; font-weight: 600; }
	.rj-order-meta .rj-status { display: inline-flex; gap: 4px; align-items: center; font-weight: 400; text-transform: capitalize; }
	.rj-status i { width: 5px; height: 5px; flex: 0 0 5px; border-radius: 50%; background: currentColor; }
	.rj-status.delivered { color: #00c41d; }
	.rj-status.cancelled { color: #f63049; }
	.rj-status.shipped { color: #ffb13b; }
	.rj-status.processing { color: #0053ab; }
	.rj-orders-view-all { display: flex; height: 45px; align-items: center; justify-content: center; margin: 0 -20px -1px; border-radius: 0 0 4px 4px; background: rgba(255, 234, 183, .4); color: #cca646; font-size: 16px; font-weight: 500; text-decoration: none; }
	.rj-orders-view-all span { margin-left: 4px; font-size: 23px; letter-spacing: -6px; transform: translateY(-1px); }

	@media (max-width: 1200px) {
		.rj-dashboard-top { grid-template-columns: minmax(0, 1fr); }
		.rj-browsing-card { width: 312px; }
		.rj-order-meta { flex-wrap: wrap; gap: 5px 18px; white-space: normal; }
	}

	@media (max-width: 700px) {
		.rj-dashboard-top { display: block; }
		.rj-profile-summary, .rj-browsing-card { width: 100%; height: auto; min-height: 210px; }
		.rj-browsing-card { margin-top: 16px; }
		.rj-profile-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 40px; }
		.rj-profile-stats i { display: none; }
		.rj-profile-stats span { font-size: 11px; white-space: normal; text-align: center; }
		.rj-order-history > header { flex-direction: column; gap: 15px; }
		.rj-order-tools { width: 100%; flex-direction: column; align-items: stretch; }
		.rj-order-filter, .rj-order-search { width: 100%; }
		.rj-order-history.with-orders { padding-inline: 12px; }
		.rj-order-row { grid-template-columns: 80px minmax(0, 1fr); gap: 10px; min-height: 150px; }
		.rj-order-image { width: 80px; height: 100px; }
		.rj-order-information { height: auto; min-height: 130px; gap: 10px; }
		.rj-order-heading { display: block; }
		.rj-order-heading > div:first-child { width: 100%; }
		.rj-order-heading > div:first-child > a { font-size: 16px; }
		.rj-order-actions { justify-content: flex-start; margin-top: 8px; }
		.rj-order-actions a { height: 32px; padding: 6px 8px; font-size: 12px; }
		.rj-order-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 10px; font-size: 11px; }
		.rj-order-meta span:nth-child(4) { display: none; }
		.rj-orders-view-all { margin-inline: -12px; }
	}
</style>
