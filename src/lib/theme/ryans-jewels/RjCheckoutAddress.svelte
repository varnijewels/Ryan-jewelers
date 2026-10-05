<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { formatPrice, fireGTagEvent } from '$lib/core/utils/index.js'
	import { showAuthModal } from '$lib/core/components/index.js'
	import { isCustomerSignedIn } from './auth-gate.logic.js'
	import { cartItemHref, checkoutBusy } from './cart-flow.js'
	import { blankCheckoutAddress, normalizeCheckoutAddress, addressError, saveCheckoutDetails } from './checkout-address.js'
	import RjCheckoutHeader from './RjCheckoutHeader.svelte'
	import './checkout.css'
	let { addressModule, cartState }: { addressModule: any; cartState: any } = $props()
	let email = $state(''), phone = $state(''), error = $state(''), saving = $state(false), ready = $state(false)
	let shipping = $state<any>(blankCheckoutAddress()), billing = $state<any>(blankCheckoutAddress()), sameBilling = $state(true)
	const items = $derived(cartState.cart?.lineItems || [])
	const signedIn = $derived(isCustomerSignedIn(addressModule.userState?.user))
	const currency = $derived(page.data?.store?.currency?.code || 'USD')
	const busy = $derived(saving || checkoutBusy(cartState))
	const countries = $derived.by(() => {
		const configured = page.data?.store?.countries || []
		const rows = configured.map((item: any) => ({ code: item.code || item.countryCode || item.country?.code, name: item.name || item.country?.name || item.code })).filter((item: any) => item.code)
		return rows.length ? rows : [{ code: 'US', name: 'United States' }]
	})
	onMount(async () => {
		try {
			await Promise.all([cartState.hasLoaded, addressModule.userState.hasLoaded.catch(() => undefined)])
			const cart = cartState.cart || {}, user = addressModule.userState?.user || {}
			email = cart.email || user.email || ''; phone = cart.phone || user.phone || ''
			shipping = { ...blankCheckoutAddress(page.data?.store?.country?.code || 'US'), ...(cart.shippingAddress || {}), phone: cart.shippingAddress?.phone || phone }
			billing = { ...blankCheckoutAddress(shipping.countryCode), ...(cart.billingAddress || {}) }
			sameBilling = !cart.billingAddressId || cart.billingAddressId === cart.shippingAddressId
		} catch { error = 'Unable to load checkout details. Please refresh and try again.' }
		finally { ready = true }
	})
	function signIn() { sessionStorage.setItem('rj-auth-return-to', '/checkout/address'); showAuthModal('login', { redirect: '/checkout/address' }) }
	async function submit(event: SubmitEvent) {
		event.preventDefault()
		if (busy) return
		error = ''
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { error = 'Enter a valid email address.'; return }
		if (page.data?.store?.isPhoneMandatory && !phone.trim()) { error = 'Phone number is required.'; return }
		if (phone && !/^\+?[\d\s().-]{7,20}$/.test(phone)) { error = 'Enter a valid phone number.'; return }
		const delivery = normalizeCheckoutAddress({ ...shipping, phone: phone.trim() })
		const invoice = normalizeCheckoutAddress({ ...billing, phone: billing.phone || phone.trim() })
		error = addressError(delivery) || (!sameBilling ? addressError(invoice) : '')
		if (error) return
		saving = true
		try {
			await saveCheckoutDetails(cartState, { email, phone, shipping: delivery, billing: invoice, sameBilling })
			void fireGTagEvent('add_shipping_info', { value: cartState.cart.total, items: cartState.cart.lineItems })
			await goto('/checkout/payment')
		} catch (cause: any) { error = cause?.message || 'Unable to save your details. Please try again.' }
		finally { saving = false }
	}
</script>

{#snippet addressFields(address: any, prefix: string)}
	<div class="address-grid">
		<label for="{prefix}-first">First name<input id="{prefix}-first" autocomplete="{prefix} given-name" bind:value={address.firstName} required /></label>
		<label for="{prefix}-last">Last name<input id="{prefix}-last" autocomplete="{prefix} family-name" bind:value={address.lastName} required /></label>
		<label class="full" for="{prefix}-country">Country<select id="{prefix}-country" autocomplete="{prefix} country" bind:value={address.countryCode} required>{#each countries as country}<option value={country.code}>{country.name}</option>{/each}</select></label>
		<label class="full" for="{prefix}-street">Street address<input id="{prefix}-street" autocomplete="{prefix} address-line1" bind:value={address.address_1} required /></label>
		<label class="full" for="{prefix}-apartment">Apartment, suite, etc. (optional)<input id="{prefix}-apartment" autocomplete="{prefix} address-line2" bind:value={address.address_2} /></label>
		<label for="{prefix}-city">City<input id="{prefix}-city" autocomplete="{prefix} address-level2" bind:value={address.city} required /></label>
		<label for="{prefix}-state">State / province<input id="{prefix}-state" autocomplete="{prefix} address-level1" bind:value={address.state} required /></label>
		<label for="{prefix}-zip">ZIP / postal code<input id="{prefix}-zip" autocomplete="{prefix} postal-code" bind:value={address.zip} required /></label>
	</div>
{/snippet}

<section class="rj-checkout">
	<RjCheckoutHeader step={2} title="Delivery details" description="A few details to bring your chosen pieces home." />
	{#if !ready}<p role="status">Loading checkout…</p>{:else if !items.length}<div class="checkout-empty"><h2>Your cart is empty</h2><a class="checkout-primary" href="/products">Continue shopping</a></div>{:else}
	<div class="checkout-layout">
		<form class="checkout-card" onsubmit={submit}>
			<fieldset disabled={busy}><div class="section-heading"><h2>Contact details</h2>{#if !signedIn}<button type="button" class="text-button" onclick={signIn}>Sign in</button>{/if}</div>
			{#if !signedIn}<p class="muted">Checking out as a guest. No account required.</p>{/if}
			<div class="address-grid"><label class="full" for="checkout-email">Email address<input id="checkout-email" type="email" autocomplete="email" bind:value={email} required /><span class="muted">We'll send your order confirmation here.</span></label><label class="full" for="checkout-phone">Phone number{page.data?.store?.isPhoneMandatory ? '' : ' (optional)'}<input id="checkout-phone" type="tel" autocomplete="tel" bind:value={phone} required={!!page.data?.store?.isPhoneMandatory} /></label></div>
			<hr /><h2>Shipping address</h2>
			{#if signedIn && addressModule.addresses?.length}<label class="saved-label" for="saved-checkout-address">Use a saved address<select id="saved-checkout-address" onchange={(event) => { const saved = addressModule.addresses.find((item: any) => item.id === event.currentTarget.value); shipping = saved ? { ...saved } : blankCheckoutAddress(shipping.countryCode) }}><option value="">Enter an address</option>{#each addressModule.addresses as address}<option value={address.id}>{address.firstName} {address.lastName} — {address.address_1}, {address.city}</option>{/each}</select></label>{/if}
			{@render addressFields(shipping, 'shipping')}
			<label class="same-billing"><input type="checkbox" bind:checked={sameBilling} /> Billing address is the same as shipping</label>
			{#if !sameBilling}<hr /><h2>Billing address</h2>{@render addressFields(billing, 'billing')}{/if}
			</fieldset>
			{#if error}<p class="checkout-error" role="alert">{error}</p>{/if}
			<button class="checkout-primary" type="submit" disabled={busy}>{saving ? 'Saving your details…' : 'Continue to payment'}</button>
			<a class="back" href="/checkout/cart">Return to cart</a>
		</form>
		<aside class="checkout-card checkout-summary"><h2>Order summary</h2>{#each items as item (item.id)}<div class="summary-item"><a href={cartItemHref(item)}><img src={item.thumbnail || '/placeholder.svg'} alt={item.title} /></a><div><a href={cartItemHref(item)}>{item.title}</a>{#if item.variantTitle}<p>{item.variantTitle}</p>{/if}<p>Qty: {item.qty}</p><strong>{formatPrice(item.price * item.qty, currency)}</strong></div></div>{/each}<div class="summary-row total"><span>Subtotal</span><strong>{formatPrice(cartState.cart?.subtotal || 0, currency)}</strong></div>{#if cartState.cart?.discountAmount > 0}<div class="summary-row"><span>Discount</span><strong>-{formatPrice(cartState.cart.discountAmount, currency)}</strong></div>{/if}<p class="muted">Delivery options and the final total are confirmed in the next step.</p></aside>
	</div>{/if}
</section>

<style>
	fieldset{border:0;padding:0;margin:0;min-width:0}.section-heading{display:flex;justify-content:space-between;align-items:baseline}.section-heading h2{margin-bottom:10px}.address-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:20px}.address-grid label{display:grid;gap:7px}.full{grid-column:1/-1}hr{border:0;border-top:1px solid #e8e3d9;margin:30px 0}.same-billing{display:flex;align-items:center;gap:10px;min-height:48px;margin-top:22px;cursor:pointer}.same-billing input{width:18px;height:18px;accent-color:#ac8433}.back{display:block;text-align:center;min-height:44px;padding:15px;font-size:13px}.summary-item{display:flex;gap:14px;border-bottom:1px solid #e6e0d5;padding:16px 0}.summary-item>a{width:65px;flex:0 0 65px;align-self:flex-start}.summary-item img{width:100%;aspect-ratio:1;object-fit:contain}.summary-item>div{min-width:0;font-size:12px;line-height:1.55}.summary-item a{text-decoration:none}.summary-item p{margin:5px 0;color:#7b756b}.saved-label{display:grid;gap:8px;margin-bottom:20px}@media(max-width:400px){.address-grid{grid-template-columns:1fr}.full{grid-column:auto}}
</style>
