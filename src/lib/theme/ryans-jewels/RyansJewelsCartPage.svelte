<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { toast } from 'svelte-sonner'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { showAuthModal } from '$lib/core/components/index.js'
	import { getUserState } from '$lib/core/stores/index.js'
	import { isCustomerSignedIn } from './auth-gate.logic.js'

	let { cartModule, cartState }: { cartModule: any; cartState: any } = $props()

	let coupon = $state('')
	let applyingCoupon = $state(false)
	let now = $state(0)
	let cutoff = $state(0)
	let deliveryAt = $state(0)
	let continueShoppingHref = $state('/products')
	const userState = getUserState()

	const items = $derived(cartState.cart?.lineItems || [])
	const currency = $derived(page.data?.store?.currency?.code || cartState.cart?.currencyCode || 'USD')
	const subtotal = $derived(Number(cartState.cart?.subtotal || 0))
	const discount = $derived(Number(cartState.cart?.discountAmount || 0))
	const total = $derived(Number(cartState.cart?.total ?? subtotal - discount))
	const deliveryDate = $derived(deliveryAt ? `${new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(deliveryAt)} ${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(deliveryAt)} ${new Date(deliveryAt).getDate()}` : '—')
	const countdown = $derived.by(() => {
		const seconds = Math.max(0, Math.floor((cutoff - now) / 1000))
		return [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map((value) => String(value).padStart(2, '0')).join(' : ')
	})

	$effect(() => {
		if (!coupon && cartState.cart?.couponCode) coupon = cartState.cart.couponCode
	})

	onMount(() => {
		continueShoppingHref = sessionStorage.getItem('rj-continue-shopping') || '/products'
		const orderCutoff = new Date()
		orderCutoff.setHours(23, 59, 59, 999)
		const delivery = new Date()
		delivery.setDate(delivery.getDate() + 4)
		cutoff = orderCutoff.getTime()
		deliveryAt = delivery.getTime()
		now = Date.now()
		const timer = setInterval(() => now = Date.now(), 1000)
		return () => clearInterval(timer)
	})

	function itemDescription(item: any) {
		return String(item?.product?.description || item?.variant?.product?.description || item?.subtitle || 'A beautifully crafted piece designed with timeless detail and everyday elegance.')
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
	}

	async function handleCoupon() {
		const code = coupon.trim()
		if (!code || applyingCoupon) return
		applyingCoupon = true
		try {
			if (cartState.cart?.couponCode?.toLowerCase() === code.toLowerCase()) {
				await cartState.removeCoupon()
				coupon = ''
				toast.success('Coupon removed')
			} else {
				await cartState.applyCoupon(code)
				toast.success('Coupon applied')
			}
		} catch {
			// The shared cart state displays the API error.
		} finally {
			applyingCoupon = false
		}
	}

	async function handleCheckout() {
		await userState.hasLoaded.catch(() => undefined)
		if (!isCustomerSignedIn(userState.user)) {
			const returnTo = '/checkout/address'
			sessionStorage.setItem('rj-auth-return-to', returnTo)
			showAuthModal('login', { redirect: returnTo })
			return
		}
		await cartModule.gotoCheckout()
	}
</script>

<svelte:head><title>Cart - {page.data?.store?.name || 'Ryan Jewelers'}</title></svelte:head>

<section class="rj-cart-page">
	{#await cartState.hasLoaded}
		<div class="rj-cart-loading" aria-live="polite">Loading your cart…</div>
	{:then _}
		{#if items.length}
			<div class="rj-cart-cutoff" role="timer" aria-label="Order cutoff {countdown}">
				<img src="/ryans-jewels/cart/timer.svg" alt="" />
				<span>Get it by <b>“{deliveryDate}”</b> {countdown}</span>
			</div>

			<div class="rj-cart-layout">
				<div class="rj-cart-main">
					<header class="rj-cart-header">
						<h1>Add To Cart <b>({String(items.length).padStart(2, '0')})</b></h1>
						<a href={continueShoppingHref}><span class="rj-cart-back"><img src="/ryans-jewels/cart/arrow-left.svg" alt="" /><img src="/ryans-jewels/cart/arrow-left.svg" alt="" /></span>Continue Shopping</a>
					</header>

					<div class="rj-cart-list">
						{#each items as item (item.id)}
							<article class="rj-cart-item">
								<a class="rj-cart-image" href="/products/{item.slug}"><img src={item.thumbnail || '/placeholder.svg'} alt={item.title} /></a>
								<div class="rj-cart-details">
									<div class="rj-cart-copy">
										<div><a href="/products/{item.slug}">{item.title}</a><strong>{formatPrice(item.price * item.qty, currency)}</strong></div>
										<p>{itemDescription(item)}</p>
									</div>
									<div class="rj-cart-actions">
										<div class="rj-cart-quantity" aria-label="Quantity for {item.title}">
											<button type="button" disabled={cartState.updatingItem[item.id]} onclick={(event) => cartModule.increaseQty(event, item)} aria-label="Increase quantity"><img src="/ryans-jewels/cart/plus.svg" alt="" /></button>
											<span aria-live="polite">{cartState.updatingItem[item.id] ? '…' : item.qty}</span>
											<button type="button" disabled={cartState.updatingItem[item.id]} onclick={(event) => cartModule.decreaseQty(event, item)} aria-label="Decrease quantity"><img src="/ryans-jewels/cart/minus.svg" alt="" /></button>
										</div>
										<div class="rj-cart-item-links">
											<button type="button" disabled={cartModule.isMovingToWishlist[item.productId]} onclick={() => cartModule.moveToWishlist(item)}><img src="/ryans-jewels/cart/wishlist.svg" alt="" />{cartModule.isMovingToWishlist[item.productId] ? 'Moving…' : 'Move to Wishlist'}</button>
											<button class="remove" type="button" disabled={cartState.updatingItem[item.id]} onclick={(event) => cartModule.removeItem(event, item)}><img src="/ryans-jewels/cart/trash.svg" alt="" />Remove</button>
										</div>
									</div>
								</div>
							</article>
						{/each}
					</div>

					<div class="rj-cart-services">
						<div><img src="/ryans-jewels/cart/shipping.svg" alt="" /><span><b>Free Shipping</b><small>Free Shipping All order</small></span></div>
						<div><img src="/ryans-jewels/cart/support.svg" alt="" /><span><b>24/7 Support</b><small>Free Shipping All order</small></span></div>
						<div><img src="/ryans-jewels/cart/security.svg" alt="" /><span><b>Payment Security</b><small>Free Shipping All order</small></span></div>
					</div>
				</div>

				<aside class="rj-cart-summary">
					<div class="rj-cart-coupon">
						<h2>Discount Code</h2>
						<form onsubmit={(event) => { event.preventDefault(); handleCoupon() }}>
							<label><img src="/ryans-jewels/cart/ticket.svg" alt="" /><input bind:value={coupon} placeholder="Enter coupon code" aria-label="Coupon code" /></label>
							<button type="submit" disabled={!coupon.trim() || applyingCoupon || cartState.isUpdatingCart}>{applyingCoupon ? 'Applying…' : cartState.cart?.couponCode ? 'Remove Coupon' : 'Apply Coupon'}</button>
						</form>
						<p>Coupons can only be applied to eligible products. <img src="/ryans-jewels/cart/info.svg" alt="" /></p>
					</div>

					<div class="rj-cart-total">
						<h2>Cart Summary</h2>
						<div>
							<p><span>Total Items</span><b>{cartState.cart?.qty || items.reduce((sum: number, item: any) => sum + item.qty, 0)}</b></p>
							<p><span>Total Item &amp; Price</span><b>{formatPrice(subtotal, currency)}</b></p>
							{#if discount > 0}<p class="discount"><span>Coupon Discount</span><b>-{formatPrice(discount, currency)}</b></p>{/if}
							<hr />
							<p><span>Total Price</span><b>{formatPrice(total, currency)}</b></p>
						</div>
					</div>

					<button class="rj-order-now" type="button" disabled={cartModule.loadingForCheckout || cartState.isUpdatingCart} onclick={handleCheckout}>{formatPrice(total, currency)} {cartModule.loadingForCheckout ? 'Loading…' : 'Order Now'}</button>
				</aside>
			</div>
		{:else}
			<div class="rj-cart-empty">
				<div class="rj-cart-empty-art"><img src="/ryans-jewels/cart/empty-order.png" alt="Your cart is empty" /></div>
				<a href={continueShoppingHref}><span>Continue Shopping</span><img src="/ryans-jewels/cart/empty-arrow-right.svg" alt="" /></a>
			</div>
		{/if}
	{/await}
</section>

<style>
	:global(.theme-ryans-jewels main.inter-gap:has(> .rj-cart-page)) { min-height: auto; }
	.rj-cart-page { min-height: 717px; color: #202020; background: #fff; font-family: 'Lato', sans-serif; }
	.rj-cart-cutoff { display: flex; height: 50px; gap: 6px; align-items: center; justify-content: center; background: rgb(255 234 183 / 40%); font: 18px/normal 'Sarala', sans-serif; text-transform: capitalize; }
	.rj-cart-cutoff img { width: 23px; height: 23px; }
	.rj-cart-cutoff b { color: #cca646; font-weight: 400; }
	.rj-cart-layout { display: grid; width: min(calc(100% - clamp(120px, 8.333vw, 160px)), 1760px); grid-template-columns: minmax(0, 1.551fr) minmax(0, 1fr); gap: 70px; margin: 40px auto 111px; }
	.rj-cart-main { display: flex; flex-direction: column; gap: 25px; }
	.rj-cart-header { display: flex; height: 44px; align-items: center; justify-content: space-between; }
	.rj-cart-header h1 { margin: 0; font: 400 26px/44px 'Sarala', sans-serif; text-transform: capitalize; }
	.rj-cart-header h1 b { color: #cca646; font-weight: 400; }
	.rj-cart-header > a { display: flex; gap: 5px; align-items: center; color: #004ed5; font-size: 18px; text-decoration: none; }
	.rj-cart-back { display: flex; width: 34px; align-items: center; }
	.rj-cart-back img { width: 22px; height: 22px; }
	.rj-cart-back img:first-child { margin-right: -10px; }
	.rj-cart-list { display: flex; flex-direction: column; gap: 20px; }
	.rj-cart-item { box-sizing: border-box; display: flex; height: 170px; gap: 15px; padding: 10px; border: 1px solid #c2c2c2; border-radius: 7px; background: #fcfcfc; }
	.rj-cart-image { display: block; width: 150px; height: 150px; flex: 0 0 150px; overflow: hidden; border-radius: 8px; background: rgb(232 232 232 / 20%); }
	.rj-cart-image img { width: 100%; height: 100%; object-fit: contain; }
	.rj-cart-details { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 15px; padding-block: 10px; }
	.rj-cart-copy { display: flex; height: 80px; flex-direction: column; justify-content: space-between; }
	.rj-cart-copy > div { display: flex; align-items: center; justify-content: space-between; gap: 20px; font-size: 20px; line-height: normal; text-transform: capitalize; }
	.rj-cart-copy a { overflow: hidden; color: #202020; font-weight: 500; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
	.rj-cart-copy strong { flex: 0 0 auto; font-weight: 700; }
	.rj-cart-copy p { display: -webkit-box; width: 386px; max-width: 100%; margin: 0; overflow: hidden; color: #707070; font-size: 14px; line-height: 20px; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
	.rj-cart-actions { display: flex; align-items: center; justify-content: space-between; }
	.rj-cart-quantity { display: flex; height: 35px; gap: 15px; align-items: center; padding: 6px 11px; border: 1px solid #d5d5d5; border-radius: 4px; background: #fff; font: 14px/normal 'Sarala', sans-serif; }
	.rj-cart-quantity button { display: grid; width: 15px; height: 15px; place-items: center; padding: 0; border: 0; background: transparent; cursor: pointer; }
	.rj-cart-quantity img { width: 15px; height: 15px; }
	.rj-cart-quantity button:disabled, .rj-cart-item-links button:disabled { opacity: .45; cursor: wait; }
	.rj-cart-item-links { display: flex; gap: 16px; align-items: center; }
	.rj-cart-item-links button { display: flex; gap: 7px; align-items: center; padding: 0; border: 0; background: transparent; color: #505050; font: 14px/20px 'Lato', sans-serif; cursor: pointer; white-space: nowrap; }
	.rj-cart-item-links img { width: 18px; height: 18px; }
	.rj-cart-item-links button:first-child img { width: 16px; height: 13px; }
	.rj-cart-item-links .remove { color: #d73535; }
	.rj-cart-services { display: flex; gap: 50px; align-items: center; justify-content: center; }
	.rj-cart-services > div { display: flex; gap: 12px; align-items: center; }
	.rj-cart-services img { width: 52px; height: 52px; }
	.rj-cart-services span { display: flex; flex-direction: column; gap: 4px; }
	.rj-cart-services b { font-size: 17px; line-height: 18px; }
	.rj-cart-services small { color: #666; font: 12px/18px 'Sarala', sans-serif; white-space: nowrap; }
	.rj-cart-summary { display: flex; flex-direction: column; gap: 20px; }
	.rj-cart-coupon, .rj-cart-total { display: flex; flex-direction: column; gap: 10px; }
	.rj-cart-summary h2 { margin: 0; color: #303030; font: 500 16px/22px 'Lato', sans-serif; text-transform: capitalize; }
	.rj-cart-coupon form { display: flex; box-sizing: border-box; width: 100%; height: 60px; align-items: center; justify-content: space-between; padding: 17px 15px; border: 1px solid #c2c2c2; border-radius: 5px; background: #fff; }
	.rj-cart-coupon label { display: flex; min-width: 0; gap: 10px; align-items: center; }
	.rj-cart-coupon label img { width: 26px; height: 26px; }
	.rj-cart-coupon input { min-width: 0; border: 0; outline: 0; color: #303030; font: 18px/22px 'Lato', sans-serif; }
	.rj-cart-coupon input::placeholder { color: #bdbdbd; }
	.rj-cart-coupon form button { flex: 0 0 auto; padding: 0; border: 0; background: transparent; color: #00935c; font: 600 16px/22px 'Lato', sans-serif; text-transform: uppercase; cursor: pointer; }
	.rj-cart-coupon form button:disabled { opacity: .45; cursor: not-allowed; }
	.rj-cart-coupon > p { display: flex; gap: 4px; align-items: center; margin: -5px 0 0; color: #828282; font-size: 12px; line-height: 22px; text-transform: capitalize; }
	.rj-cart-coupon > p img { width: 13px; height: 13px; transform: rotate(180deg); }
	.rj-cart-total > div { display: flex; box-sizing: border-box; min-height: 169px; flex-direction: column; gap: 20px; padding: 22px 20px 20px; border: 1px solid #c2c2c2; border-radius: 5px; background: #f9f9f9; }
	.rj-cart-total p { display: flex; align-items: center; justify-content: space-between; margin: 0; color: #505050; font-size: 16px; line-height: 22px; text-transform: capitalize; }
	.rj-cart-total b { font-weight: 600; }
	.rj-cart-total .discount { color: #00935c; }
	.rj-cart-total hr { width: 100%; margin: 0; border: 0; border-top: 1px solid #c2c2c2; }
	.rj-order-now { display: flex; width: 100%; min-height: 52px; align-items: center; justify-content: center; padding: 15px; border: 0; border-radius: 5px; background: #cca646; color: #fff; font: 500 16px/22px 'Lato', sans-serif; text-transform: capitalize; cursor: pointer; }
	.rj-order-now:disabled { opacity: .6; cursor: wait; }
	.rj-cart-loading { display: flex; min-height: 717px; align-items: center; justify-content: center; }
	.rj-cart-empty { position: relative; min-height: 717px; }
	.rj-cart-empty-art { position: absolute; top: 100px; left: 50%; width: 230px; height: 219px; overflow: hidden; transform: translateX(-50%); }
	.rj-cart-empty-art img { position: absolute; top: -10.53%; left: -7.31%; width: 115.38%; height: 121.46%; max-width: none; }
	.rj-cart-empty > a { position: absolute; top: 349px; left: calc(50% - 99px); display: flex; box-sizing: border-box; width: 179px; height: 37px; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 4px; background: #cca646; color: #fff; font: 400 14px/21px 'Inter', sans-serif; text-transform: capitalize; text-decoration: none; }
	.rj-cart-empty > a img { width: 22px; height: 22px; }

	@media (max-width: 1199px) {
		.rj-cart-layout { width: calc(100% - 80px); grid-template-columns: minmax(0, 1.45fr) minmax(360px, 1fr); gap: 35px; }
		.rj-cart-services { gap: 22px; }
		.rj-cart-services img { width: 42px; height: 42px; }
		.rj-cart-services b { font-size: 14px; }
		.rj-cart-services small { font-size: 10px; }
	}

	@media (max-width: 899px) {
		.rj-cart-layout { width: calc(100% - 48px); grid-template-columns: minmax(0, 1fr); margin-block: 32px 70px; }
		.rj-cart-main, .rj-cart-summary { min-width: 0; }
		.rj-cart-summary { width: min(100%, 600px); margin-inline: auto; }
	}

	@media (max-width: 639px) {
		.rj-cart-cutoff { height: 44px; font-size: 13px; }
		.rj-cart-cutoff img { width: 20px; height: 20px; }
		.rj-cart-layout { width: calc(100% - 30px); gap: 28px; margin-top: 24px; }
		.rj-cart-main { gap: 18px; }
		.rj-cart-header { height: auto; gap: 12px; }
		.rj-cart-header h1 { font-size: 20px; line-height: 32px; }
		.rj-cart-header > a { font-size: 12px; }
		.rj-cart-back { width: 26px; }
		.rj-cart-back img { width: 18px; height: 18px; }
		.rj-cart-item { height: 154px; gap: 10px; padding: 8px; }
		.rj-cart-image { width: 100px; height: 136px; flex-basis: 100px; }
		.rj-cart-details { gap: 10px; padding-block: 4px; }
		.rj-cart-copy { height: 82px; }
		.rj-cart-copy > div { align-items: flex-start; gap: 8px; font-size: 14px; }
		.rj-cart-copy a { white-space: normal; }
		.rj-cart-copy strong { font-size: 13px; }
		.rj-cart-copy p { font-size: 11px; line-height: 16px; }
		.rj-cart-actions { gap: 8px; }
		.rj-cart-quantity { height: 30px; gap: 9px; padding: 5px 7px; font-size: 12px; }
		.rj-cart-item-links { gap: 10px; }
		.rj-cart-item-links button { gap: 4px; font-size: 0; }
		.rj-cart-item-links button::after { font-size: 11px; }
		.rj-cart-item-links button:first-child::after { content: 'Wishlist'; }
		.rj-cart-item-links .remove::after { content: 'Remove'; }
		.rj-cart-services { display: grid; grid-template-columns: 1fr; gap: 14px; justify-items: start; padding-left: 20px; }
		.rj-cart-services img { width: 40px; height: 40px; }
		.rj-cart-coupon input { width: 135px; font-size: 14px; }
		.rj-cart-coupon form button { font-size: 12px; }
		.rj-cart-coupon > p { font-size: 10px; line-height: 16px; }
		.rj-cart-empty-art { top: 70px; width: 210px; height: 200px; }
		.rj-cart-empty > a { top: 300px; left: 50%; transform: translateX(-50%); }
	}
</style>
