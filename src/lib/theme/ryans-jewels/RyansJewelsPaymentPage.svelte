<script lang="ts">
	import { page } from '$app/state'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { CartModule } from '$lib/core/composables/index.js'
	import RjInstagram from './RjInstagram.svelte'
	import { cardCvvError, cardExpiryError, cardNameError, cardNumberError, formatCardExpiry, formatCardNumber, validatePaymentCard } from './payment-card.logic.js'

	let { paymentModule, cartState }: { paymentModule: any; cartState: any } = $props()

	const cartModule = new CartModule()
	let couponCode = $state('')
	let cardSelectionError = $state('')
	let showCardForm = $state(false)
	let paymentMode = $state<'card' | 'upi'>('card')
	let cardNumber = $state('')
	let cardName = $state('')
	let cardExpiry = $state('')
	let cardCvv = $state('')
	let saveCard = $state(false)
	let upiId = $state('')
	let upiError = $state('')
	let cardErrors = $state({ number: '', name: '', expiry: '', cvv: '' })
	let cardNumberInput = $state<HTMLInputElement>()
	let cardNameInput = $state<HTMLInputElement>()
	let cardExpiryInput = $state<HTMLInputElement>()
	let cardCvvInput = $state<HTMLInputElement>()
	let upiInput = $state<HTMLInputElement>()

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
		(cartState.cart?.shippingAddress || cartState.cart?.shippingAddressId) &&
		cartState.cart?.shippingRateId
	)
	const orderDate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())
	const providers = [
		{ label: 'Apple Pay', className: 'apple', keywords: ['APPLE'], images: ['apple-pay.png'] },
		{ label: 'PayPal', className: 'paypal', keywords: ['PAYPAL'], images: ['paypal-mark.png', 'paypal-wordmark.png'] },
		{ label: 'American Express', className: 'amex', keywords: ['AMEX', 'AMERICAN'], images: ['american-express.png'] },
		{ label: 'Bank', className: 'bank', keywords: ['BANK', 'RAZORPAY', 'STRIPE'], images: [] }
	]
	const paymentMethods = $derived(paymentModule.listOfPaymentMethods || [])
	const cardPaymentMethod = $derived.by(() => paymentMethods.find((method: any) => /STRIPE|RAZORPAY|CASHFREE|CARD/.test(`${method?.code || ''} ${method?.name || ''}`.toUpperCase())))
	const otherPaymentMethods = $derived(paymentMethods.filter((method: any) => method?.code !== cardPaymentMethod?.code))

	$effect(() => {
		if (!couponCode && cartState.cart?.couponCode) couponCode = cartState.cart.couponCode
	})

	function itemDescription(item: any) {
		return String(item?.product?.description || item?.variant?.product?.description || item?.subtitle || 'A beautifully crafted piece designed with timeless detail and everyday elegance.')
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
	}

	function providerMethod(provider: (typeof providers)[number]) {
		return paymentMethods.find((method: any) => provider.keywords.some((key) => `${method?.code || ''} ${method?.name || ''}`.toUpperCase().includes(key)))
	}

	async function selectProvider(provider: (typeof providers)[number]) {
		const method = providerMethod(provider)
		if (!method?.code) {
			cardSelectionError = `${provider.label} is not available for this order.`
			return
		}
		cardSelectionError = ''
		if (method.code === cardPaymentMethod?.code) showCardForm = true
		await paymentModule.handlePaymentMethodChange(method.code)
	}

	async function selectCardPayment() {
		showCardForm = true
		cardSelectionError = ''
		if (cardPaymentMethod?.code) await paymentModule.handlePaymentMethodChange(cardPaymentMethod.code)
	}

	function updateCardNumber(event: Event) {
		cardNumber = formatCardNumber((event.currentTarget as HTMLInputElement).value)
		cardErrors.number = ''
	}

	function updateCardExpiry(event: Event) {
		cardExpiry = formatCardExpiry((event.currentTarget as HTMLInputElement).value)
		cardErrors.expiry = ''
	}

	function focusFirstCardError() {
		const field = cardErrors.number ? cardNumberInput : cardErrors.name ? cardNameInput : cardErrors.expiry ? cardExpiryInput : cardCvvInput
		requestAnimationFrame(() => field?.focus())
	}

	function validateCardDetails() {
		cardErrors = validatePaymentCard({ number: cardNumber, name: cardName, expiry: cardExpiry, cvv: cardCvv })
		if (Object.values(cardErrors).some(Boolean)) {
			focusFirstCardError()
			return false
		}
		return true
	}

	function validateUpi() {
		upiError = /^[\w.-]{2,256}@[A-Za-z]{2,64}$/.test(upiId.trim()) ? '' : 'Enter a valid UPI ID.'
		if (upiError) requestAnimationFrame(() => upiInput?.focus())
		return !upiError
	}

	function switchPaymentMode() {
		paymentMode = paymentMode === 'card' ? 'upi' : 'card'
		cardSelectionError = ''
	}

	async function processPayment() {
		if (!showCardForm) {
			await paymentModule.placeOrder()
			return
		}
		if (paymentMode === 'card' ? !validateCardDetails() : !validateUpi()) return
		cardSelectionError = cardPaymentMethod?.code
			? 'Secure card saving is not connected yet. Your payment details were not sent or saved.'
			: 'Secure card payments are not configured yet. Your payment details were not sent or saved.'
	}

	function submitCardForm(event: SubmitEvent) {
		event.preventDefault()
		processPayment()
	}

	async function applyCoupon(event: SubmitEvent) {
		event.preventDefault()
		if (!couponCode.trim()) return
		await cartState.applyCoupon(couponCode.trim())
	}
</script>

<section class="rj-payment-page">
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
						<p class="rj-payment-error" role="alert">{paymentModule.shippingRates.error.message}</p>
						<a class="rj-payment-address-link" href="/checkout/address?step=shipping">Update delivery address</a>
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
					{#if paymentModule.loadingForPaymentMethods}<p class="rj-payment-status" role="status">Loading secure payment options…</p>{/if}
					<div class="rj-provider-grid" aria-label="Payment providers">
						{#each providers as provider}
							{@const method = providerMethod(provider)}
							<button class:selected={method?.code && paymentModule.SELECTED_PG_CODE === method.code} type="button" onclick={() => selectProvider(provider)} aria-label={`Select ${method?.name || provider.label}`}>
								{#if provider.className === 'bank'}<img class="bank-icon" src="/ryans-jewels/checkout/payment/bank.svg" alt="" /><span>Bank</span>{:else}{#each provider.images as image}<span class="provider-image {provider.className}"><img src="/ryans-jewels/checkout/payment/{image}" alt="" /></span>{/each}{/if}
							</button>
						{/each}
					</div>
					<hr />
					{#if showCardForm}
						<form id="rj-card-form" class="rj-card-form" novalidate onsubmit={submitCardForm}>
							<div class="rj-card-form-head">
								<span>Credit Card <img src="/ryans-jewels/checkout/payment/card-info.svg" alt="" title="Your payment details are encrypted" /></span>
								<div class="rj-payment-mode">
									<span>Credit Card</span>
									<button type="button" role="switch" aria-label="Switch between credit card and UPI ID" aria-checked={paymentMode === 'upi'} class:upi={paymentMode === 'upi'} onclick={switchPaymentMode}><i></i></button>
									<span>UPI Id</span>
								</div>
							</div>

							{#if paymentMode === 'card'}
								<div class="rj-card-fields">
									<div class="rj-card-field">
										<label class="rj-card-input" class:invalid={Boolean(cardErrors.number)}>
											<span class="sr-only">Credit card number</span>
											<input bind:this={cardNumberInput} value={cardNumber} type="text" inputmode="numeric" autocomplete="cc-number" maxlength="23" placeholder="Credit Number" aria-invalid={Boolean(cardErrors.number)} aria-describedby={cardErrors.number ? 'rj-card-number-error' : undefined} oninput={updateCardNumber} onblur={() => cardErrors.number = cardNumberError(cardNumber)} />
											<img src="/ryans-jewels/checkout/payment/card-lock.svg" alt="" />
										</label>
										{#if cardErrors.number}<small id="rj-card-number-error" class="rj-card-error">{cardErrors.number}</small>{/if}
									</div>
									<div class="rj-card-field">
										<label class="rj-card-input" class:invalid={Boolean(cardErrors.name)}>
											<span class="sr-only">Name on card</span>
											<input bind:this={cardNameInput} bind:value={cardName} type="text" autocomplete="cc-name" maxlength="80" placeholder="Name On Card" aria-invalid={Boolean(cardErrors.name)} aria-describedby={cardErrors.name ? 'rj-card-name-error' : undefined} oninput={() => cardErrors.name = ''} onblur={() => cardErrors.name = cardNameError(cardName)} />
										</label>
										{#if cardErrors.name}<small id="rj-card-name-error" class="rj-card-error">{cardErrors.name}</small>{/if}
									</div>
									<div class="rj-card-row">
										<div class="rj-card-field">
											<label class="rj-card-input" class:invalid={Boolean(cardErrors.expiry)}>
												<span class="sr-only">Expiration date</span>
												<input bind:this={cardExpiryInput} value={cardExpiry} type="text" inputmode="numeric" autocomplete="cc-exp" maxlength="7" placeholder="Expiration Date (MM / YY)" aria-invalid={Boolean(cardErrors.expiry)} aria-describedby={cardErrors.expiry ? 'rj-card-expiry-error' : undefined} oninput={updateCardExpiry} onblur={() => cardErrors.expiry = cardExpiryError(cardExpiry)} />
											</label>
											{#if cardErrors.expiry}<small id="rj-card-expiry-error" class="rj-card-error">{cardErrors.expiry}</small>{/if}
										</div>
										<div class="rj-card-field">
											<label class="rj-card-input" class:invalid={Boolean(cardErrors.cvv)}>
												<span class="sr-only">CVV</span>
												<input bind:this={cardCvvInput} value={cardCvv} type="password" inputmode="numeric" autocomplete="cc-csc" maxlength="4" placeholder="CVV" aria-invalid={Boolean(cardErrors.cvv)} aria-describedby={cardErrors.cvv ? 'rj-card-cvv-error' : undefined} oninput={(event) => { cardCvv = (event.currentTarget as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4); cardErrors.cvv = '' }} onblur={() => cardErrors.cvv = cardCvvError(cardCvv)} />
											</label>
											{#if cardErrors.cvv}<small id="rj-card-cvv-error" class="rj-card-error">{cardErrors.cvv}</small>{/if}
										</div>
									</div>
								</div>
								<label class="rj-save-card">
									<input type="checkbox" bind:checked={saveCard} />
									<span aria-hidden="true"><img src="/ryans-jewels/checkout/payment/card-checkbox.svg" alt="" /></span>
									Save for future purchases
								</label>
							{:else}
								<div class="rj-card-field">
									<label class="rj-card-input" class:invalid={Boolean(upiError)}>
										<span class="sr-only">UPI ID</span>
										<input bind:this={upiInput} bind:value={upiId} type="text" inputmode="email" autocomplete="off" maxlength="321" placeholder="Enter UPI ID" aria-invalid={Boolean(upiError)} aria-describedby={upiError ? 'rj-upi-error' : undefined} oninput={() => upiError = ''} onblur={validateUpi} />
									</label>
									{#if upiError}<small id="rj-upi-error" class="rj-card-error">{upiError}</small>{/if}
								</div>
							{/if}
							{#if cardSelectionError}<p class="rj-payment-error" role="alert">{cardSelectionError}</p>{/if}
						</form>
					{:else}
						<div class="rj-saved-methods">
							<h3>Saved Cards</h3>
							<p class="rj-empty-cards">No saved cards yet.</p>
							{#if cardSelectionError || paymentModule.showError}<p class="rj-payment-error" aria-live="polite">{cardSelectionError || paymentModule.errorMessage}</p>{/if}
							<button class="add-card" class:selected={cardPaymentMethod?.code && paymentModule.SELECTED_PG_CODE === cardPaymentMethod.code} type="button" onclick={selectCardPayment}>
								<span><img src="/ryans-jewels/checkout/payment/add.svg" alt="" /></span>
								<span class="method-copy"><b>Add New Card</b><small>Enter and validate your card details.</small></span>
							</button>
							{#if otherPaymentMethods.length}<h3 class="available-methods-title">Available Payment Methods</h3>{/if}
							{#each otherPaymentMethods as method (method.code)}
								<button class:selected={paymentModule.SELECTED_PG_CODE === method.code} type="button" onclick={() => paymentModule.handlePaymentMethodChange(method.code)}>
									<span class="method-icon"><img src="/ryans-jewels/checkout/payment/card-tick.svg" alt="" /></span>
									<span class="method-copy"><b>{method.name}</b><small>{method.description ? String(method.description).replace(/<[^>]*>/g, '') : 'Secure payment method'}</small></span>
									<i aria-hidden="true"></i>
								</button>
							{/each}
						</div>
					{/if}
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

				<button class="rj-place-order" type="button" disabled={!canPlaceOrder || (!showCardForm && paymentModule.checkoutDisabled) || paymentModule.paymentLoader} onclick={processPayment}>{paymentModule.paymentLoader ? 'PROCESSING…' : 'PROCESS TO PAYMENT'}</button>

				<div class="rj-payment-assurance">
					<div class="assurance-row"><div><img src="/ryans-jewels/checkout/shipping/free-shipping.svg" alt="" /><span><b>Free Shipping</b><small>Free Shipping All order</small></span></div><div><img src="/ryans-jewels/checkout/shipping/support.svg" alt="" /><span><b>24/7 Support</b><small>Free Shipping All order</small></span></div><div><img src="/ryans-jewels/checkout/shipping/security.svg" alt="" /><span><b>Payment Security</b><small>Free Shipping All order</small></span></div></div>
					<div class="payment-brands"><div><img src="/ryans-jewels/checkout/shipping/mastercard.png" alt="Mastercard" /><img src="/ryans-jewels/checkout/shipping/paypal.png" alt="PayPal" /><img src="/ryans-jewels/checkout/shipping/visa.png" alt="Visa" /><img src="/ryans-jewels/checkout/shipping/amex.png" alt="American Express" /><img src="/ryans-jewels/checkout/shipping/apple-pay.png" alt="Apple Pay" /><img src="/ryans-jewels/checkout/shipping/discover.png" alt="Discover" /></div><p>Learn more about our <a href="/terms-and-conditions">TERMS &amp; POLICIES</a></p></div>
				</div>
			</div>
	</div>

	<RjInstagram />
</section>

<style>
	:global(.theme-ryans-jewels main.inter-gap:has(> .rj-payment-page)) { min-height: auto; }
	.rj-payment-page { width: 100%; color: #303030; font-family: 'Lato', sans-serif; }
	.rj-payment-status { margin: 20px 0 0; color: #686868; font-size: 14px; }
	.rj-payment-address-link { display: inline-block; margin-top: 10px; color: #a80139; font-size: 14px; text-decoration: underline; }
	.rj-payment-layout { display: grid; width: calc(100% - 120px); max-width: 1800px; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin: 0 auto 65px; }
	.rj-payment-left { min-width: 0; padding-top: 50px; }
	.rj-payment-steps { display: flex; height: 34px; align-items: center; justify-content: flex-start; gap: 12px; margin: 0; padding: 0 0 0 21px; color: #989898; font: 16px/normal 'Sarala', sans-serif; list-style: none; }
	.rj-payment-steps li { display: flex; gap: 10px; align-items: center; white-space: nowrap; }
	.rj-payment-steps li[aria-hidden='true'] { display: block; color: #989898; font-size: 22px; letter-spacing: -1px; }
	.rj-payment-steps b { display: grid; width: 34px; height: 34px; place-items: center; border: 1px solid #9e9e9e; border-radius: 50%; font-weight: 400; }
	.rj-payment-steps .done, .rj-payment-steps .active { color: #00a80b; }
	.rj-payment-steps .done b, .rj-payment-steps .active b { border-color: #00a80b; background: #00a80b; color: #fff; }
	.rj-payment-rule { margin: 30px 0 25px; border: 0; border-top: 1px solid #c2c2c2; }
	.rj-shipping-methods, .rj-payment-details { box-sizing: border-box; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; }
	.rj-shipping-methods { padding: 24px 23.5px; }
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
	.rj-payment-details { margin-top: 25px; padding: 20px 25px 25px; }
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
	.rj-card-form { display: flex; width: 100%; flex-direction: column; gap: 20px; }
	.rj-card-form-head { display: flex; min-height: 22px; align-items: center; justify-content: space-between; gap: 20px; color: #303030; font: 14px/22px 'Lato', sans-serif; }
	.rj-card-form-head > span, .rj-payment-mode { display: flex; align-items: center; gap: 5px; }
	.rj-card-form-head > span img { width: 14px; height: 14px; }
	.rj-payment-mode { gap: 10px; color: #505050; }
	.rj-payment-mode button { box-sizing: border-box; width: 35px; height: 19px; padding: 1px; border: 1px solid #c2c2c2; border-radius: 10px; background: #fff; cursor: pointer; }
	.rj-payment-mode button i { display: block; width: 15px; height: 15px; border-radius: 50%; background: #c2c2c2; transition: transform .15s ease, background .15s ease; }
	.rj-payment-mode button.upi i { transform: translateX(14px); background: #cca646; }
	.rj-card-fields { display: flex; flex-direction: column; gap: 16px; }
	.rj-card-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
	.rj-card-field { display: flex; min-width: 0; flex-direction: column; gap: 4px; }
	.rj-card-input { position: relative; display: block; width: 100%; }
	.rj-card-input input { box-sizing: border-box; width: 100%; height: 52px; padding: 14px 15px; border: 1px solid #c2c2c2; border-radius: 5px; outline: 0; background: #fff; color: #303030; font: 14px/22px 'Lato', sans-serif; }
	.rj-card-input input[autocomplete='cc-number'] { padding-right: 51px; }
	.rj-card-input input::placeholder { color: #828282; opacity: 1; }
	.rj-card-input input:focus { border-color: #cca646; box-shadow: 0 0 0 1px #cca646; }
	.rj-card-input.invalid input { border-color: #d73535; box-shadow: 0 0 0 1px #d73535; }
	.rj-card-input > img { position: absolute; top: 15px; right: 15px; width: 22px; height: 22px; pointer-events: none; }
	.rj-card-error { color: #d73535; font: 12px/16px 'Lato', sans-serif; }
	.rj-save-card { position: relative; display: flex; min-height: 24px; gap: 10px; align-items: center; color: #505050; font: 14px/22px 'Lato', sans-serif; cursor: pointer; }
	.rj-save-card input { position: absolute; z-index: 2; width: 24px; height: 24px; margin: 0; opacity: 0; cursor: pointer; }
	.rj-save-card > span { position: relative; display: grid; box-sizing: border-box; width: 24px; height: 24px; flex: 0 0 24px; place-items: center; }
	.rj-save-card img { width: 24px; height: 24px; }
	.rj-save-card input:checked + span { border-radius: 7px; background: #cca646; }
	.rj-save-card input:checked + span img { opacity: 0; }
	.rj-save-card input:checked + span::after { position: absolute; top: 4px; left: 9px; width: 6px; height: 11px; border-right: 2px solid #fff; border-bottom: 2px solid #fff; content: ''; transform: rotate(45deg); }
	.rj-save-card input:focus-visible + span { outline: 2px solid #303030; outline-offset: 2px; }
	.rj-card-form > .rj-payment-error { margin: 0; }
	.rj-saved-methods { display: flex; flex-direction: column; gap: 20px; }
	.rj-saved-methods h3 { margin: 0; color: #202020; font: 400 16px/22px 'Lato', sans-serif; }
	.rj-saved-methods .available-methods-title { margin-top: 5px; }
	.rj-empty-cards { margin: -10px 0 0; color: #828282; font: 14px/22px 'Lato', sans-serif; }
	.rj-saved-methods > button { display: grid; box-sizing: border-box; min-height: 80px; grid-template-columns: 50px minmax(0, 1fr) 22px; gap: 15px; align-items: center; padding: 14px; border: 1px solid #c2c2c2; border-radius: 5px; background: #fff; text-align: left; cursor: pointer; }
	.rj-saved-methods > button.selected { border-color: #cca646; background: rgb(255 234 183 / 40%); box-shadow: 0 0 0 .5px #cca646; }
	.method-icon, .rj-saved-methods .add-card > span:first-child { display: grid; width: 50px; height: 50px; place-items: center; border-radius: 6px; background: #f9f9f9; }
	.method-icon img { width: 28px; height: 28px; }
	.method-copy { display: flex; min-width: 0; flex-direction: column; }
	.method-copy b { overflow: hidden; color: #707070; font: 400 16px/22px 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.method-copy small { overflow: hidden; color: #828282; font: 10px/normal 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rj-saved-methods > button > i { width: 22px; height: 22px; border: 1px solid #c2c2c2; border-radius: 50%; }
	.rj-saved-methods > button.selected > i { border: 6px solid #fff; background: #a80139; box-shadow: 0 0 0 1px #a80139; }
	.rj-saved-methods .add-card { grid-template-columns: 50px minmax(0, 1fr); }
	.rj-saved-methods .add-card img { width: 28px; height: 28px; }
	.rj-saved-methods .add-card b { color: #202020; font: 500 18px/22px 'Lato', sans-serif; }
	.rj-saved-methods .rj-payment-error { margin: 0; }
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
	@keyframes spin { to { transform: rotate(360deg); } }
	@media (max-width: 1100px) { .rj-payment-layout { width: calc(100% - 60px); grid-template-columns: minmax(0, 1fr); } .rj-payment-right { padding-top: 30px; } }
	@media (max-width: 700px) {
		.rj-payment-layout { width: calc(100% - 30px); margin-top: 0; } .rj-payment-left { padding-top: 25px; } .rj-payment-steps { gap: 5px; padding-left: 0; font-size: 12px; } .rj-payment-steps li[aria-hidden='true'] { display: none; } .rj-payment-steps b { width: 28px; height: 28px; }
		.rj-shipping-methods, .rj-payment-details { padding: 18px 15px; } .rj-payment-details > header { gap: 15px; } .rj-payment-details > header > span { font-size: 11px; } .rj-provider-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } .rj-card-form-head { flex-wrap: wrap; } .rj-payment-mode { margin-left: auto; }
		.rj-payment-right { padding: 20px 15px 0; } .rj-payment-products article { grid-template-columns: 72px minmax(0, 1fr); } .product-image { width: 72px; height: 72px; } .product-price { grid-column: 2; flex-direction: row; align-items: center; justify-content: space-between; }
		.rj-payment-assurance { margin-inline: -15px; } .assurance-row { gap: 12px; overflow-x: auto; } .assurance-row > div { min-width: 150px; }
	}
</style>
