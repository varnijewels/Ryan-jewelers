<script lang="ts">
	import { page } from '$app/state'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { CartModule } from '$lib/core/composables/index.js'
	import RjInstagram from './RjInstagram.svelte'

	let { paymentModule, cartState }: { paymentModule: any; cartState: any } = $props()

	const cartModule = new CartModule()
	let couponCode = $state('')
	let paymentOptions = $state<HTMLElement>()
	let returningToAddress = $state(false)

	const items = $derived(cartState.cart?.lineItems || [])
	const currency = $derived(page.data?.store?.currency?.code || cartState.cart?.currencyCode || 'USD')
	const itemCount = $derived(items.reduce((sum: number, item: any) => sum + Number(item.qty || 0), 0))
	const subtotal = $derived(Number(cartState.cart?.subtotal || 0))
	const tax = $derived(Number(cartState.cart?.taxAmount || cartState.cart?.taxes || 0))
	const discount = $derived(Number(cartState.cart?.discountAmount || 0))
	const total = $derived(Number(cartState.cart?.total ?? subtotal + tax - discount))
	const discountPercent = $derived(subtotal ? Math.round((discount / subtotal) * 100) : 0)
	const orderNumber = $derived(String(cartState.cart?.orderNo || cartState.cart?.id || '0258741').slice(-7).toUpperCase())
	const canPlaceOrder = $derived(
		(!page.data?.store?.isPhoneMandatory || cartState.cart?.phone) &&
		(!page.data?.store?.isEmailMandatory || cartState.cart?.email) &&
		(cartState.cart?.shippingAddress || cartState.cart?.shippingAddressId)
	)
	const orderDate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())
	const providers = [
		{ label: 'Apple Pay', className: 'apple', keywords: ['APPLE'], images: ['apple-pay.png'] },
		{ label: 'PayPal', className: 'paypal', keywords: ['PAYPAL'], images: ['paypal-mark.png', 'paypal-wordmark.png'] },
		{ label: 'American Express', className: 'amex', keywords: ['AMEX', 'AMERICAN'], images: ['american-express.png'] },
		{ label: 'Bank', className: 'bank', keywords: ['BANK', 'RAZORPAY', 'STRIPE'], images: [] }
	]
	const testimonials = [
		{ name: 'Johan Michel', avatar: '/ryans-jewels/product/testimonials/avatar-1.jpg', text: 'A diamond ring is handed down as a very rich part of our tradition. It was a memorable fulfillment to design and then manufacture the wedding ring.', date: 'August 29, 2025' },
		{ name: 'Emilio Lindgren', avatar: '/ryans-jewels/product/testimonials/avatar-2.jpg', text: 'A truly divine and inspired homage to creativity and beauty, with the most stylish range of gems and jewels.', date: 'August 29, 2025' },
		{ name: 'Melinda Guskowski', avatar: '/ryans-jewels/product/testimonials/avatar-3.jpg', text: 'The products added spark to celebrations. It looked great in the festive look and was made to perfection.', date: 'August 29, 2025' },
		{ name: 'Ernesto Feeney', avatar: '/ryans-jewels/product/testimonials/avatar-4.jpg', text: 'I had an amazing experience with this product. The quality exceeded my expectations and the customer service was incredibly helpful.', date: 'August 29, 2025' },
		{ name: 'Clara Walker', avatar: '/ryans-jewels/product/testimonials/avatar-5.jpg', text: 'A flawless finish and a beautiful design. The jewellery feels timeless and is perfect for every celebration.', date: 'August 29, 2025' },
		{ name: 'Joy Zboncak', avatar: '/ryans-jewels/product/testimonials/avatar-6.jpg', text: 'The remarkable local contents of a true unique design, this jewellery has always provided the most refined styles.', date: 'August 29, 2025' },
		{ name: 'Naomi Grady', avatar: '/ryans-jewels/product/testimonials/avatar-7.jpg', text: 'The ring was just lovely. It was well built and the detailing made it a wonderful gift for the one we love.', date: 'August 29, 2025' },
		{ name: 'Denise Lind', avatar: '/ryans-jewels/product/testimonials/avatar-8.jpg', text: 'The exceptional design reflects the beauty of a royal diamond, showing a marvellous finish in every detail.', date: 'August 29, 2025' },
		{ name: 'Ernest Von', avatar: '/ryans-jewels/product/testimonials/avatar-9.jpg', text: 'The beautiful design of Ryan Jewels has been something we have always loved. Very classy and crafted perfectly.', date: 'August 29, 2025' },
		{ name: 'Amy Zboncak', avatar: '/ryans-jewels/product/testimonials/avatar-10.jpg', text: 'Beautiful quality, elegant styling and excellent service. The entire experience was smooth from start to finish.', date: 'August 29, 2025' }
	]

	$effect(() => {
		if (!couponCode && cartState.cart?.couponCode) couponCode = cartState.cart.couponCode
	})

	$effect(() => {
		if (!paymentModule.shippingRates?.error?.message || returningToAddress) return
		returningToAddress = true
		paymentModule.handleAddressChange()
	})

	function itemDescription(item: any) {
		return String(item?.product?.description || item?.variant?.product?.description || item?.subtitle || 'A beautifully crafted piece designed with timeless detail and everyday elegance.')
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
	}

	function providerMethod(provider: (typeof providers)[number], index: number) {
		const methods = paymentModule.listOfPaymentMethods || []
		return methods.find((method: any) => provider.keywords.some((key) => `${method?.code || ''} ${method?.name || ''}`.toUpperCase().includes(key))) || methods[index] || methods[0]
	}

	function selectProvider(provider: (typeof providers)[number], index: number) {
		const method = providerMethod(provider, index)
		if (method?.code) paymentModule.SELECTED_PG_CODE = method.code
	}

	async function applyCoupon(event: SubmitEvent) {
		event.preventDefault()
		if (!couponCode.trim()) return
		await cartState.applyCoupon(couponCode.trim())
	}
</script>

<section class="rj-payment-page">
	{#if paymentModule.loadingForPaymentMethods}
		<div class="rj-payment-loading"><span></span><p>Loading secure payment options…</p></div>
	{:else}
		<div class="rj-payment-layout">
			<div class="rj-payment-left">
				<ol class="rj-payment-steps" aria-label="Checkout progress">
					<li class="done"><b>1</b><span>Information</span></li><li aria-hidden="true">----</li>
					<li class="done"><b>2</b><span>Shipping Address</span></li><li aria-hidden="true">----</li>
					<li class="active"><b>3</b><span>Payment Method</span></li>
				</ol>
				<hr class="rj-payment-rule" />

				<section class="rj-shipping-methods" aria-labelledby="rj-shipping-method-title">
					<h1 id="rj-shipping-method-title"><img src="/ryans-jewels/checkout/payment/shipping-method.svg" alt="" />Shipping Method</h1>
					{#if paymentModule.shippingRates?.error?.message}
						<p class="rj-payment-muted">Returning to your delivery address…</p>
					{:else if paymentModule.shippingRates?.data?.length}
						<div class="rj-shipping-list">
							{#each paymentModule.shippingRates.data as rate, index (rate.id)}
								<label>
									<span><input type="radio" name="shippingRate" value={rate.id} checked={cartState.cart?.shippingRateId === rate.id} onchange={() => paymentModule.handleShippingRateChange(rate)} /><i></i></span>
									<span class="copy"><b>{rate.name}</b><small>{rate.estimated_min_days && rate.estimated_max_days ? `${rate.estimated_min_days} to ${rate.estimated_max_days} business day` : rate.description || 'Shipping method'}</small></span>
									<strong>{Number(rate.base_rate) > 0 ? formatPrice(rate.base_rate, currency) : 'FREE'}</strong>
								</label>
								{#if index < paymentModule.shippingRates.data.length - 1}<hr />{/if}
							{/each}
						</div>
					{:else}
						<p class="rj-payment-muted">Shipping methods will appear after your delivery address is confirmed.</p>
					{/if}
				</section>

				<section class="rj-payment-details" aria-labelledby="rj-payment-details-title">
					<header>
						<div><h2 id="rj-payment-details-title"><img src="/ryans-jewels/checkout/payment/payment-details.svg" alt="" />Payment Details</h2><p>All transaction are safe and secure</p></div>
						<span><img src="/ryans-jewels/checkout/payment/lock.svg" alt="" />Secure And Encrypted</span>
					</header>
					<div bind:this={paymentOptions} class="rj-provider-grid" aria-label="Payment providers">
						{#each providers as provider, index}
							{@const method = providerMethod(provider, index)}
							<button class:selected={method?.code && paymentModule.SELECTED_PG_CODE === method.code} type="button" onclick={() => selectProvider(provider, index)} aria-label={`Select ${method?.name || provider.label}`}>
								{#if provider.className === 'bank'}<img class="bank-icon" src="/ryans-jewels/checkout/payment/bank.svg" alt="" /><span>Bank</span>{:else}{#each provider.images as image}<span class="provider-image {provider.className}"><img src="/ryans-jewels/checkout/payment/{image}" alt="" /></span>{/each}{/if}
							</button>
						{/each}
					</div>
					<hr />
					<div class="rj-saved-methods">
						<h3>Payment Methods</h3>
						{#if paymentModule.showError}<p class="rj-payment-error">{paymentModule.errorMessage}</p>{/if}
						{#each paymentModule.listOfPaymentMethods || [] as method (method.code)}
							<button class:selected={paymentModule.SELECTED_PG_CODE === method.code} type="button" onclick={() => (paymentModule.SELECTED_PG_CODE = method.code)}>
								<span class="method-icon"><img src="/ryans-jewels/checkout/payment/card-tick.svg" alt="" /></span>
								<span class="method-copy"><b>{method.name}</b><small>{method.description ? String(method.description).replace(/<[^>]*>/g, '') : 'Secure payment method'}</small></span>
								<i aria-hidden="true"></i>
							</button>
						{/each}
						<button class="add-card" type="button" onclick={() => paymentOptions?.scrollIntoView({ behavior: 'smooth', block: 'center' })}><span><img src="/ryans-jewels/checkout/payment/add.svg" alt="" /></span><b>Choose Payment Method</b></button>
					</div>
				</section>
			</div>

			<div class="rj-payment-right">
				<section class="rj-payment-products" aria-label="Order products">
					{#each items as item (item.id)}
						<article>
							<a href="/products/{item.slug || item.product?.slug}" class="product-image"><img src={item.thumbnail || item.image || '/placeholder.svg'} alt={item.title} /></a>
							<div class="product-copy"><a href="/products/{item.slug || item.product?.slug}">{item.title}</a><p>{itemDescription(item)}</p></div>
							<div class="product-price"><b>{formatPrice(Number(item.price || 0) * Number(item.qty || 0), currency)}</b><span><button type="button" disabled={cartState.updatingItem?.[item.id]} onclick={(event) => cartModule.increaseQty(event, item)} aria-label="Increase quantity">+</button><i>{cartState.updatingItem?.[item.id] ? '…' : item.qty}</i><button type="button" disabled={cartState.updatingItem?.[item.id]} onclick={(event) => cartModule.decreaseQty(event, item)} aria-label="Decrease quantity">−</button></span></div>
						</article>
					{/each}
				</section>

				<section class="rj-order-summary" aria-labelledby="rj-order-summary-title">
					<h2 id="rj-order-summary-title">Order Summary #{orderNumber}</h2>
					<div class="summary-lines">
						<p><span>Date &amp; Time</span><b>{orderDate}</b></p><hr />
						<p><span>Total Item &amp; Price</span><b>{formatPrice(subtotal, currency)}*{itemCount}</b></p>
						<p><span>Subtotal</span><b>{formatPrice(subtotal, currency)}</b></p>
						<p><span>Taxes</span><b>{formatPrice(tax, currency)}</b></p><hr />
					</div>
					<form class="rj-payment-coupon" onsubmit={applyCoupon}>
						<label for="rj-payment-coupon">Discount Code</label>
						<div><img src="/ryans-jewels/checkout/shipping/coupon.svg" alt="" /><input id="rj-payment-coupon" bind:value={couponCode} placeholder="Enter coupon code" /><button type="submit">{cartState.cart?.couponCode ? 'APPLIED' : 'APPLY COUPON'}</button></div>
					</form>
					<div class="rj-payment-total"><p class="discount"><span>Discount</span><b>{discountPercent ? `%${discountPercent}` : formatPrice(discount, currency)}</b></p><p><span>Total</span><b>{formatPrice(total, currency)}</b></p></div>
				</section>

				<button class="rj-place-order" type="button" disabled={!canPlaceOrder || paymentModule.checkoutDisabled || paymentModule.paymentLoader} onclick={paymentModule.placeOrder}>{paymentModule.paymentLoader ? 'PROCESSING…' : 'PROCESS TO PAYMENT'}</button>

				<div class="rj-payment-assurance">
					<div class="assurance-row"><div><img src="/ryans-jewels/checkout/shipping/free-shipping.svg" alt="" /><span><b>Free Shipping</b><small>Free Shipping All order</small></span></div><div><img src="/ryans-jewels/checkout/shipping/support.svg" alt="" /><span><b>24/7 Support</b><small>Free Shipping All order</small></span></div><div><img src="/ryans-jewels/checkout/shipping/security.svg" alt="" /><span><b>Payment Security</b><small>Free Shipping All order</small></span></div></div>
					<div class="payment-brands"><div><img src="/ryans-jewels/checkout/shipping/mastercard.png" alt="Mastercard" /><img src="/ryans-jewels/checkout/shipping/paypal.png" alt="PayPal" /><img src="/ryans-jewels/checkout/shipping/visa.png" alt="Visa" /><img src="/ryans-jewels/checkout/shipping/amex.png" alt="American Express" /><img src="/ryans-jewels/checkout/shipping/apple-pay.png" alt="Apple Pay" /><img src="/ryans-jewels/checkout/shipping/discover.png" alt="Discover" /></div><p>Learn more about our <a href="/terms-and-conditions">TERMS &amp; POLICIES</a></p></div>
				</div>
			</div>
		</div>

		<section class="rj-payment-testimonials" aria-labelledby="rj-payment-testimonials-title">
			<header><div><i></i><h2 id="rj-payment-testimonials-title">Don't take our word for it.</h2><i></i></div><p>Trust our customers</p></header>
			<div class="review-rows">{#each [testimonials, testimonials] as row, rowIndex}<div class:offset={rowIndex === 1} class="review-row">{#each row as review}<article class="review-card"><header><div class="review-author"><img class="review-avatar" src={review.avatar} alt="" /><div><b>{review.name}</b><span><img src="/ryans-jewels/product/testimonials/stars.svg" alt="4.5 out of 5 stars" /><small>4.5 Review</small></span></div></div><div class="review-count"><span><img src="/ryans-jewels/product/testimonials/heart.svg" alt="" />4.5k</span><span><img src="/ryans-jewels/product/testimonials/comment.svg" alt="" />500</span></div></header><p>{review.text}</p><footer><time>{review.date}</time><span><img src="/ryans-jewels/product/testimonials/instagram.png" alt="" />Instagram</span></footer></article>{/each}</div>{/each}</div>
		</section>
		<RjInstagram />
	{/if}
</section>

<style>
	:global(.theme-ryans-jewels main.inter-gap:has(> .rj-payment-page)) { min-height: auto; }
	.rj-payment-page { width: 100%; color: #303030; font-family: 'Lato', sans-serif; }
	.rj-payment-loading { display: flex; min-height: 700px; flex-direction: column; gap: 15px; align-items: center; justify-content: center; }
	.rj-payment-loading span { width: 30px; height: 30px; border: 3px solid #e6e6e6; border-top-color: #cca646; border-radius: 50%; animation: spin .8s linear infinite; }
	.rj-payment-layout { display: grid; width: calc(100% - 120px); max-width: 1800px; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin: 0 auto 65px; }
	.rj-payment-left { min-width: 0; padding-top: 50px; }
	.rj-payment-steps { display: flex; height: 34px; align-items: center; justify-content: center; gap: 12px; margin: 0; padding: 0; color: #9e9e9e; font: 16px/26px 'Lato', sans-serif; list-style: none; }
	.rj-payment-steps li { display: flex; gap: 10px; align-items: center; white-space: nowrap; }
	.rj-payment-steps li[aria-hidden='true'] { display: block; color: #9e9e9e; letter-spacing: 2px; }
	.rj-payment-steps b { display: grid; width: 34px; height: 34px; place-items: center; border: 1px solid #9e9e9e; border-radius: 50%; font-weight: 400; }
	.rj-payment-steps .done, .rj-payment-steps .active { color: #00ca28; }
	.rj-payment-steps .done b, .rj-payment-steps .active b { border-color: #00ca28; background: #00ca28; color: #fff; }
	.rj-payment-rule { margin: 30px 0 25px; border: 0; border-top: 1px solid #c2c2c2; }
	.rj-shipping-methods, .rj-payment-details { box-sizing: border-box; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; }
	.rj-shipping-methods { min-height: 231px; padding: 24px 23.5px; }
	.rj-shipping-methods h1, .rj-payment-details h2 { display: flex; gap: 12px; align-items: center; margin: 0; color: #353535; font: 400 22px/22px 'Lato', sans-serif; letter-spacing: normal; text-transform: capitalize; }
	.rj-shipping-methods h1 img, .rj-payment-details h2 img { width: 24px; height: 24px; }
	.rj-shipping-list { display: flex; flex-direction: column; margin-top: 30px; }
	.rj-shipping-list label { display: grid; height: 45px; grid-template-columns: 22px minmax(0, 1fr) auto; gap: 14px; align-items: start; cursor: pointer; }
	.rj-shipping-list label > span:first-child { position: relative; width: 22px; height: 22px; }
	.rj-shipping-list input { position: absolute; z-index: 2; width: 22px; height: 22px; margin: 0; opacity: 0; cursor: pointer; }
	.rj-shipping-list label > span:first-child i { display: block; width: 22px; height: 22px; border: 1px solid #c2c2c2; border-radius: 50%; }
	.rj-shipping-list input:checked + i { border: 6px solid #fff; background: #a80139; box-shadow: 0 0 0 1px #a80139; }
	.rj-shipping-list .copy { display: flex; flex-direction: column; gap: 1px; }
	.rj-shipping-list b { color: #353535; font: 400 16px/22px 'Sarala', sans-serif; }
	.rj-shipping-list small { color: #909090; font: 14px/22px 'Sarala', sans-serif; text-transform: capitalize; }
	.rj-shipping-list strong { color: #353535; font: 700 18px/22px 'Sarala', sans-serif; }
	.rj-shipping-list hr { width: 100%; margin: 18px 0; border: 0; border-top: 1px solid #c2c2c2; }
	.rj-payment-muted, .rj-payment-error { margin: 25px 0 0; color: #828282; font-size: 14px; }
	.rj-payment-error { color: #d73535; }
	.rj-payment-details { min-height: 544px; margin-top: 25px; padding: 20px 25px; }
	.rj-payment-details > header { display: flex; align-items: flex-start; justify-content: space-between; }
	.rj-payment-details > header > div { display: flex; flex-direction: column; gap: 5px; }
	.rj-payment-details > header p { margin: 0; color: #828282; font: 14px/22px 'Lato', sans-serif; text-transform: capitalize; }
	.rj-payment-details > header > span { display: flex; gap: 5px; align-items: center; color: #828282; font: 14px/22px 'Lato', sans-serif; text-transform: capitalize; }
	.rj-payment-details > header > span img { width: 22px; height: 22px; }
	.rj-provider-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; margin-top: 25px; }
	.rj-provider-grid > button { display: flex; box-sizing: border-box; height: 60px; align-items: center; justify-content: center; padding: 7px; border: 1px solid #c2c2c2; border-radius: 5px; background: #fff; cursor: pointer; }
	.rj-provider-grid > button.selected { border-color: #cca646; box-shadow: 0 0 0 1px #cca646; }
	.provider-image { position: relative; display: block; overflow: hidden; }
	.provider-image.apple { width: 66px; height: 30px; } .provider-image.apple img { position: absolute; top: -59.77%; left: 0; width: 100%; height: 219.54%; max-width: none; }
	.provider-image.paypal:first-child { width: 28px; height: 30px; } .provider-image.paypal:first-child img { width: 107.14%; height: 100%; max-width: none; }
	.provider-image.paypal:nth-child(2) { width: 62px; height: 18px; } .provider-image.paypal:nth-child(2) img { position: absolute; top: -126.9%; width: 100%; height: 353.1%; max-width: none; }
	.rj-provider-grid > button:has(.paypal) { gap: 5px; }
	.provider-image.amex { width: 87px; height: 30px; } .provider-image.amex img { position: absolute; top: -95.83%; width: 100%; height: 291.67%; max-width: none; }
	.rj-provider-grid .bank-icon { width: 26px; height: 26px; } .rj-provider-grid button > span:not(.provider-image) { margin-left: 10px; font-size: 16px; }
	.rj-payment-details > hr { margin: 20px 0 25px; border: 0; border-top: 1px solid #f1f1f1; }
	.rj-saved-methods { display: flex; flex-direction: column; gap: 20px; }
	.rj-saved-methods h3 { margin: 0; color: #202020; font: 400 16px/22px 'Lato', sans-serif; }
	.rj-saved-methods > button { display: grid; box-sizing: border-box; min-height: 80px; grid-template-columns: 50px minmax(0, 1fr) 22px; gap: 15px; align-items: center; padding: 14px; border: 1px solid #c2c2c2; border-radius: 5px; background: #fff; text-align: left; cursor: pointer; }
	.rj-saved-methods > button.selected { border-color: #cca646; }
	.method-icon, .rj-saved-methods .add-card > span { display: grid; width: 50px; height: 50px; place-items: center; border-radius: 6px; background: #f9f9f9; }
	.method-icon img { width: 28px; height: 28px; }
	.method-copy { display: flex; min-width: 0; flex-direction: column; }
	.method-copy b { overflow: hidden; color: #707070; font: 400 16px/22px 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.method-copy small { overflow: hidden; color: #828282; font: 10px/normal 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rj-saved-methods > button > i { width: 22px; height: 22px; border: 1px solid #c2c2c2; border-radius: 50%; }
	.rj-saved-methods > button.selected > i { border: 6px solid #fff; background: #a80139; box-shadow: 0 0 0 1px #a80139; }
	.rj-saved-methods .add-card { grid-template-columns: 50px minmax(0, 1fr); }
	.rj-saved-methods .add-card img { width: 28px; height: 28px; }
	.rj-saved-methods .add-card b { font: 500 16px/22px 'Lato', sans-serif; }
	.rj-payment-right { min-width: 0; padding: 50px 29px 0 31px; background: linear-gradient(to bottom, #f9f9f9 0 936px, #fff 936px); }
	.rj-payment-products { display: flex; flex-direction: column; gap: 11px; padding: 14px 19px; border: 1px solid #c2c2c2; border-radius: 5px; background: #f9f9f9; }
	.rj-payment-products article { display: grid; min-height: 90px; grid-template-columns: 90px minmax(0, 1fr) 88px; gap: 12px; align-items: center; }
	.product-image { display: block; width: 90px; height: 90px; overflow: hidden; border-radius: 5px; background: rgb(232 232 232 / 20%); }
	.product-image img { width: 100%; height: 100%; object-fit: contain; }
	.product-copy { display: flex; width: min(320px, 100%); min-width: 0; flex-direction: column; gap: 10px; }
	.product-copy a { overflow: hidden; color: #202020; font: 500 16px/normal 'Lato', sans-serif; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
	.product-copy p { display: -webkit-box; margin: 0; overflow: hidden; color: #707070; font: 14px/20px 'Sarala', sans-serif; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
	.product-price { display: flex; flex-direction: column; gap: 12px; align-items: flex-end; }
	.product-price > b { color: #202020; font-size: 16px; }
	.product-price > span { display: grid; box-sizing: border-box; width: 88px; height: 35px; grid-template-columns: repeat(3, 1fr); place-items: center; border: 1px solid #d5d5d5; border-radius: 4px; background: #fff; }
	.product-price button { padding: 0; border: 0; background: transparent; font-size: 18px; cursor: pointer; } .product-price i { color: #000; font: 400 14px 'Sarala', sans-serif; font-style: normal; }
	.rj-order-summary { box-sizing: border-box; min-height: 540px; margin-top: 25px; padding: 20px 15px; border: 1px solid #c2c2c2; border-radius: 5px; background: #fff; }
	.rj-order-summary h2 { height: 66px; margin: -6px 1px 20px -3px; padding: 20px 15px; border-radius: 5px; background: #f9f9f9; color: #353535; font: 600 22px/26px 'Lato', sans-serif; letter-spacing: normal; text-transform: capitalize; }
	.summary-lines { display: flex; flex-direction: column; padding-right: 4px; }
	.summary-lines p, .rj-payment-total p { display: flex; align-items: center; justify-content: space-between; margin: 0; color: #505050; font: 14px/22px 'Sarala', sans-serif; }
	.summary-lines p + p { margin-top: 10px; } .summary-lines b, .rj-payment-total b { color: #353535; font-weight: 600; }
	.summary-lines hr { margin: 20px 0; border: 0; border-top: 1px dashed #c2c2c2; }
	.summary-lines hr:last-child { margin: 25px 0 0; }
	.rj-payment-coupon { margin: 25px 4px 0 0; }
	.rj-payment-coupon label { display: block; margin-bottom: 10px; color: #303030; font: 14px/22px 'Sarala', sans-serif; }
	.rj-payment-coupon > div { display: flex; box-sizing: border-box; height: 60px; align-items: center; padding: 16px 14px; border: 1px solid #c2c2c2; border-radius: 5px; }
	.rj-payment-coupon img { width: 26px; height: 26px; } .rj-payment-coupon input { min-width: 0; flex: 1; margin-left: 10px; border: 0; outline: 0; color: #303030; font: 14px/22px 'Lato', sans-serif; }
	.rj-payment-coupon input::placeholder { color: #c2c2c2; } .rj-payment-coupon button { padding: 0; border: 0; background: transparent; color: #00a96b; font: 600 14px/22px 'Lato', sans-serif; cursor: pointer; }
	.rj-payment-total { margin: 40px 4px 0 0; padding-top: 30px; border-top: 1px dashed #c2c2c2; }
	.rj-payment-total p + p { margin-top: 12px; } .rj-payment-total .discount { color: #2fb3ff; }
	.rj-place-order { width: 100%; height: 50px; margin-top: 25px; border: 0; border-radius: 4px; background: #cca646; color: #fff; font: 600 14px/22px 'Lato', sans-serif; cursor: pointer; }
	.rj-place-order:disabled { opacity: .6; cursor: wait; }
	.rj-payment-assurance { margin: 50px -29px 0 -31px; }
	.assurance-row { display: flex; justify-content: space-between; padding: 0 12px; }
	.assurance-row > div { display: flex; gap: 12px; align-items: center; } .assurance-row img { width: 40px; height: 40px; }
	.assurance-row span { display: flex; flex-direction: column; gap: 4px; } .assurance-row b { color: #303030; font-size: 13px; } .assurance-row small { color: #707070; font-size: 9px; white-space: nowrap; }
	.payment-brands { display: flex; height: 91px; flex-direction: column; gap: 10px; align-items: center; justify-content: center; margin-top: 26px; background: #f9f9f9; }
	.payment-brands > div { display: flex; height: 27px; gap: 15px; align-items: center; } .payment-brands img { max-width: 45px; max-height: 27px; object-fit: contain; }
	.payment-brands p { margin: 0; font: 12px/24px 'Sarala', sans-serif; } .payment-brands a { color: #a80139; font-weight: 700; text-decoration: none; }
	.rj-payment-testimonials { box-sizing: border-box; height: 573px; padding-top: 33px; overflow: hidden; background: #fafafa; }
	.rj-payment-testimonials > header { width: min(1010px, calc(100% - 80px)); height: 65px; margin: 0 auto; text-align: center; }
	.rj-payment-testimonials > header > div { display: grid; grid-template-columns: minmax(0, 340px) auto minmax(0, 340px); gap: 5px; align-items: center; }
	.rj-payment-testimonials > header i { height: 2px; background: #9e9e9e; }
	.rj-payment-testimonials h2 { margin: 0; color: #202020; font: 600 28px/34px 'Lato', sans-serif; letter-spacing: normal; white-space: nowrap; }
	.rj-payment-testimonials > header p { margin: 5px 0 0; color: #a80139; font: 16px/21px 'Sarala', sans-serif; }
	.review-rows { display: flex; flex-direction: column; gap: 17px; margin-top: 41px; }
	.review-row { display: flex; width: max-content; height: 180px; gap: 27px; align-items: center; padding-block: 5px; } .review-row.offset { transform: translateX(-155px); }
	.review-card { display: flex; box-sizing: border-box; width: 310px; height: 170px; flex: 0 0 310px; flex-direction: column; gap: 13px; padding: 11.5px; overflow: hidden; border: 2.5px solid #ececec; border-radius: 5px; background: #fff; color: #303030; }
	.review-card > header { display: flex; height: 36px; align-items: center; justify-content: space-between; } .review-author { display: flex; gap: 10px; align-items: center; } .review-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
	.review-author > div { display: flex; width: 107px; flex-direction: column; gap: 2px; } .review-author b { font-size: 12px; white-space: nowrap; } .review-author span { display: flex; gap: 4px; align-items: center; } .review-author span img { width: 54px; height: 10px; } .review-author small { color: #b5b5b5; font: 10px 'Sarala', sans-serif; white-space: nowrap; }
	.review-count { display: flex; gap: 12px; } .review-count span { display: flex; gap: 5px; align-items: center; color: #606060; font: 10px 'Sarala', sans-serif; } .review-count img { width: 15px; height: 15px; }
	.review-card > p { display: -webkit-box; height: 62px; margin: 0; overflow: hidden; color: #555; font-size: 10px; line-height: 15px; -webkit-box-orient: vertical; -webkit-line-clamp: 4; line-clamp: 4; }
	.review-card footer { display: flex; min-height: 18px; align-items: center; justify-content: space-between; font-size: 10px; } .review-card footer span { display: flex; gap: 5px; align-items: center; color: #555; } .review-card footer img { width: 18px; height: 18px; }
	@keyframes spin { to { transform: rotate(360deg); } }
	@media (max-width: 1100px) { .rj-payment-layout { width: calc(100% - 60px); grid-template-columns: minmax(0, 1fr); } .rj-payment-right { padding-top: 30px; } }
	@media (max-width: 700px) {
		.rj-payment-layout { width: calc(100% - 30px); margin-top: 0; } .rj-payment-left { padding-top: 25px; } .rj-payment-steps { gap: 5px; font-size: 12px; } .rj-payment-steps li[aria-hidden='true'] { display: none; } .rj-payment-steps b { width: 28px; height: 28px; }
		.rj-shipping-methods, .rj-payment-details { padding: 18px 15px; } .rj-payment-details > header { gap: 15px; } .rj-payment-details > header > span { font-size: 11px; } .rj-provider-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
		.rj-payment-right { padding: 20px 15px 0; } .rj-payment-products article { grid-template-columns: 72px minmax(0, 1fr); } .product-image { width: 72px; height: 72px; } .product-price { grid-column: 2; flex-direction: row; align-items: center; justify-content: space-between; }
		.rj-payment-assurance { margin-inline: -15px; } .assurance-row { gap: 12px; overflow-x: auto; } .assurance-row > div { min-width: 150px; } .rj-payment-testimonials h2 { font-size: 20px; } .rj-payment-testimonials > header { width: calc(100% - 30px); } .rj-payment-testimonials > header > div { grid-template-columns: 1fr auto 1fr; }
	}
</style>
