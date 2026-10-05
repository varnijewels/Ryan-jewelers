<script lang="ts">
	import RjCheckoutHeader from './RjCheckoutHeader.svelte'
	import { cartItemHref } from './cart-flow.js'
	import './checkout.css'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { toast } from 'svelte-sonner'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { canStartPayment, hasCheckoutAddress } from './checkout-process.js'
	import { couponAction } from './commerce-flow.js'
	import { cartShippingCharge, cartTaxAmount, isShippingReady } from './shipping-checkout.js'

	let { paymentModule, cartState }: { paymentModule: any; cartState: any } = $props()

	let couponCode = $state('')
	let couponApplying = $state(false)
	let cardSelectionError = $state('')
	let paymentSubmitting = $state(false)

	const items = $derived(cartState.cart?.lineItems || [])
	const currency = $derived(page.data?.store?.currency?.code || cartState.cart?.currencyCode || 'USD')
	const subtotal = $derived(Number(cartState.cart?.subtotal || 0))
	const tax = $derived(cartTaxAmount(cartState.cart))
	const discount = $derived(Number(cartState.cart?.discountAmount || 0))
	const shippingCharge = $derived(cartShippingCharge(cartState.cart))
	const shippingReady = $derived(Boolean(paymentModule.shippingStatus && isShippingReady(cartState.cart, paymentModule.shippingStatus)))
	const checkoutBusy = $derived(Boolean(cartState.isUpdatingCart || Object.values(cartState.updatingItem || {}).some(Boolean) || paymentModule.shippingStatus?.loading || paymentModule.shippingStatus?.saving))
	const total = $derived(Number(cartState.cart?.total ?? subtotal + tax + (shippingCharge || 0) - discount))
	const couponMode = $derived(couponAction(cartState.cart?.couponCode, couponCode))
	const canPlaceOrder = $derived(
		items.length > 0 && shippingReady && !checkoutBusy && Boolean(paymentModule.SELECTED_PG_CODE) &&
		(!page.data?.store?.isPhoneMandatory || cartState.cart?.phone) &&
		(!page.data?.store?.isEmailMandatory || cartState.cart?.email) &&
		(cartState.cart?.shippingAddress || cartState.cart?.shippingAddressId) &&
		cartState.cart?.shippingRateId
	)
	// Keep Affirm unavailable until its sandbox success, cancel, and failure paths are certified.
	const paymentMethods = $derived(
		(paymentModule.listOfPaymentMethods || []).filter(
			(method: any) => String(method?.code || '').toUpperCase().replace(/[^A-Z]/g, '') !== 'AFFIRMPAY'
		)
	)

	$effect(() => {
		if (!couponCode && cartState.cart?.couponCode) couponCode = cartState.cart.couponCode
		if (String(paymentModule.SELECTED_PG_CODE || '').toUpperCase().replace(/[^A-Z]/g, '') === 'AFFIRMPAY') paymentModule.SELECTED_PG_CODE = ''
	})

	onMount(async () => {
		await cartState.hasLoaded.catch(() => undefined)
		if (!hasCheckoutAddress(cartState.cart)) {
			await goto('/checkout/address', { replaceState: true })
		}
	})

	async function processPayment() {
		if (!canPlaceOrder || !canStartPayment(paymentSubmitting, paymentModule.paymentLoader)) return
		cardSelectionError = ''
		paymentSubmitting = true
		try {
			await paymentModule.placeOrder()
		} catch (cause: any) {
			cardSelectionError = cause?.message || 'Unable to start payment. Please try again.'
		} finally {
			paymentSubmitting = false
		}
	}

	async function applyCoupon(event: SubmitEvent) {
		event.preventDefault()
		if (couponMode === 'none' || couponApplying || checkoutBusy || paymentSubmitting || paymentModule.paymentLoader) return
		couponApplying = true
		try {
			if (couponMode === 'remove') {
				await cartState.removeCoupon()
				couponCode = ''
				toast.success('Coupon removed')
			} else {
				await cartState.applyCoupon(couponCode.trim())
				toast.success('Coupon applied')
			}
		} catch {
			// Shared cart state displays the API error.
		} finally {
			couponApplying = false
		}
	}
</script>
<section class="rj-checkout">
 <RjCheckoutHeader step={3} title="Payment" description="Choose delivery and payment options, then review your order." />
 <div class="checkout-layout">
  <div class="payment-sections">
   <section class="checkout-card"><div class="section-heading"><h2>Deliver to</h2><a href="/checkout/address">Edit</a></div>
    {#if cartState.cart?.shippingAddress}{@const address = cartState.cart.shippingAddress}<p>{address.firstName} {address.lastName}<br />{address.address_1}{#if address.address_2}<br />{address.address_2}{/if}<br />{address.city}, {address.state} {address.zip}<br />{address.countryCode}</p><p class="muted">{cartState.cart.email} {cartState.cart.phone || ''}</p>{/if}
   </section>
   <section class="checkout-card"><h2>Shipping method</h2>
    {#if paymentModule.shippingStatus?.loading}<p role="status">Calculating delivery options...</p>
    {:else if paymentModule.shippingRates?.error?.message}<p class="checkout-error" role="alert">{paymentModule.shippingRates.error.message}</p><button class="text-button" type="button" disabled={checkoutBusy} onclick={() => paymentModule.retryShipping()}>Retry shipping</button>
    {:else if paymentModule.shippingRates?.data?.length}<div class="option-list">{#each paymentModule.shippingRates.data as rate (rate.id)}<label class:selected={cartState.cart?.shippingRateId === rate.id}><input type="radio" name="shipping-rate" checked={cartState.cart?.shippingRateId === rate.id} disabled={checkoutBusy || paymentSubmitting || paymentModule.paymentLoader} onchange={() => paymentModule.handleShippingRateChange(rate)} /><span><b>{rate.name}</b><small>{rate.estimated_min_days && rate.estimated_max_days ? `${rate.estimated_min_days} to ${rate.estimated_max_days} business days` : rate.description || ''}</small></span><strong>{Number(rate.base_rate) > 0 ? formatPrice(rate.base_rate, currency) : 'Free'}</strong></label>{/each}</div>
    {:else}<p class="muted">Delivery options will appear after your address is confirmed.</p>{/if}
    {#if paymentModule.shippingStatus?.saving}<p role="status">Updating your total...</p>{/if}
   </section>
   <section class="checkout-card"><h2>Payment method</h2><p class="muted">Payments are processed securely by the selected payment provider.</p>
    {#if paymentModule.loadingForPaymentMethods}<p role="status">Loading payment options...</p>{:else if paymentMethods.length}<div class="option-list">{#each paymentMethods as method (method.code)}<label class:selected={paymentModule.SELECTED_PG_CODE === method.code}><input type="radio" name="payment-method" checked={paymentModule.SELECTED_PG_CODE === method.code} disabled={checkoutBusy || paymentSubmitting || paymentModule.paymentLoader} onchange={() => paymentModule.handlePaymentMethodChange(method.code)} /><span><b>{method.name || method.code}</b></span></label>{/each}</div>{:else}<p class="checkout-error" role="alert">No payment methods are available for this order. Please contact the store.</p>{/if}
    {#if cardSelectionError || paymentModule.showError}<p class="checkout-error" role="alert">{cardSelectionError || paymentModule.errorMessage}</p>{/if}
   </section>
  </div>
  <aside class="checkout-card checkout-summary"><h2>Order summary</h2>
   {#each items as item (item.id)}<div class="summary-item"><a href={cartItemHref(item)}><img src={item.thumbnail || '/placeholder.svg'} alt={item.title} /></a><div><a href={cartItemHref(item)}>{item.title}</a>{#if item.variantTitle}<p>{item.variantTitle}</p>{/if}<p>Qty: {item.qty}</p><strong>{formatPrice(item.price * item.qty, currency)}</strong></div></div>{/each}
   <form class="coupon-form" onsubmit={applyCoupon}><label for="payment-coupon">Discount code</label><div><input id="payment-coupon" bind:value={couponCode} placeholder="Enter code" /><button type="submit" disabled={couponMode === 'none' || couponApplying || checkoutBusy || paymentSubmitting || paymentModule.paymentLoader}>{couponApplying ? 'Please wait...' : couponMode === 'remove' ? 'Remove' : 'Apply'}</button></div></form>
   <div class="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal, currency)}</strong></div>
   {#if discount > 0}<div class="summary-row"><span>Discount</span><strong>-{formatPrice(discount, currency)}</strong></div>{/if}
   <div class="summary-row"><span>Shipping</span><strong>{shippingReady ? formatPrice(shippingCharge || 0, currency) : 'Calculating'}</strong></div>
   <div class="summary-row"><span>Tax</span><strong>{formatPrice(tax, currency)}</strong></div>
   <div class="summary-row total"><span>Total</span><strong>{formatPrice(total, currency)}</strong></div>
   <button class="checkout-primary" type="button" disabled={!canPlaceOrder || checkoutBusy || paymentSubmitting || paymentModule.paymentLoader || couponApplying} onclick={processPayment}>{paymentSubmitting || paymentModule.paymentLoader ? 'Processing...' : String(paymentModule.SELECTED_PG_CODE).toUpperCase() === 'COD' ? 'Place order' : 'Continue to secure payment'}</button>
   <p class="muted">Review your details before continuing. <a href="/checkout/cart">Edit cart</a></p>
  </aside>
 </div>
</section>
<style>
 .payment-sections{display:grid;gap:22px}.section-heading{display:flex;justify-content:space-between;align-items:baseline}.section-heading a{font-size:13px}.payment-sections p{font-size:14px;line-height:1.7}.option-list{display:grid;gap:12px;margin-top:20px}.option-list label{display:flex;gap:12px;align-items:center;min-height:64px;padding:14px;border:1px solid #ddd6c8;cursor:pointer;border-radius:3px}.option-list .selected{border-color:#a88132;background:#faf6eb}.option-list input{width:18px!important;min-height:18px!important;height:18px;accent-color:#a88132;flex:0 0 18px}.option-list span{flex:1;min-width:0}.option-list small{display:block;color:#777;margin-top:5px;font-size:12px}.option-list b,.option-list strong{font-size:14px;font-weight:500}.summary-item{display:flex;gap:12px;padding:16px 0;border-bottom:1px solid #e6e0d5}.summary-item>a{width:65px;flex:0 0 65px;align-self:flex-start}.summary-item img{width:100%;aspect-ratio:1;object-fit:contain}.summary-item>div{min-width:0;font-size:12px;line-height:1.5}.summary-item a{text-decoration:none}.summary-item p{margin:5px 0;color:#777}
</style>
