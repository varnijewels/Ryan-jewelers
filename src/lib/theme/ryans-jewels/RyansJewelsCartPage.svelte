<script lang="ts">
 import { page } from '$app/state'
 import { goto } from '$app/navigation'
 import { formatPrice, fireGTagEvent } from '$lib/core/utils/index.js'
 import { showAuthModal } from '$lib/core/components/index.js'
 import { getUserState } from '$lib/core/stores/index.js'
 import { isCustomerSignedIn } from './auth-gate.logic.js'
 import { cartItemHref, checkoutBusy } from './cart-flow.js'
 import RjCheckoutHeader from './RjCheckoutHeader.svelte'
 import './checkout.css'
 let { cartModule, cartState }: { cartModule: any; cartState: any } = $props()
 const userState = getUserState()
 const signedIn = $derived(isCustomerSignedIn(userState.user) || isCustomerSignedIn((page.data as any)?.user))
 const guestEnabled = $derived(Boolean(page.data?.store?.plugins?.isGuestCheckout?.active))
 const items = $derived(cartState.cart?.lineItems || [])
 const currency = $derived(page.data?.store?.currency?.code || 'USD')
 const busy = $derived(checkoutBusy(cartState))
 let coupon = $state(''), error = $state(''), processing = $state(false)
 async function applyCoupon() {
  if (processing || busy) return
  processing = true; error = ''
  try { if (cartState.cart?.couponCode) { await cartState.removeCoupon(); coupon = '' } else { await cartState.applyCoupon(coupon.trim()) } }
  catch (cause: any) { error = cause?.message || 'Unable to apply this code.' }
  finally { processing = false }
 }
 function signIn() { sessionStorage.setItem('rj-auth-return-to', '/checkout/address'); showAuthModal('login', { redirect: '/checkout/address' }) }
 async function checkout() {
  if (processing || busy) return
  if (!signedIn && !guestEnabled) return signIn()
  processing = true; error = ''
  try { void fireGTagEvent('begin_checkout', { total: cartState.cart.total, items }); await goto('/checkout/address') }
  catch { error = 'Unable to open checkout. Please try again.' }
  finally { processing = false }
 }
</script>
<svelte:head><title>Shopping cart - Ryan Jewelers</title></svelte:head>
<section class="rj-checkout">
 <RjCheckoutHeader step={1} title="Shopping bag" description="Review your pieces before continuing." />
 {#await cartState.hasLoaded}<p role="status">Loading your cart...</p>{:then}
 {#if items.length}
 <div class="checkout-layout">
  <div class="checkout-card cart-items">
   {#each items as item (item.id)}
    <article class="cart-line">
     <a href={cartItemHref(item)} class="cart-image"><img src={item.thumbnail || '/placeholder.svg'} alt={item.title} /></a>
     <div class="cart-copy"><a href={cartItemHref(item)}>{item.title}</a>{#if item.variantTitle}<p>{item.variantTitle}</p>{/if}<strong>{formatPrice(item.price * item.qty, currency)}</strong>
      <div class="cart-controls"><div class="quantity"><button type="button" disabled={busy || item.qty <= 1} aria-label="Decrease quantity for {item.title}" onclick={(e) => cartModule.decreaseQty(e, item)}>-</button><span aria-live="polite">{item.qty}</span><button type="button" disabled={busy} aria-label="Increase quantity for {item.title}" onclick={(e) => cartModule.increaseQty(e, item)}>+</button></div><button class="text-button" type="button" disabled={busy} onclick={(e) => cartModule.removeItem(e, item)}>Remove</button></div>
     </div>
    </article>
   {/each}
  </div>
  <aside class="checkout-card checkout-summary">
   <h2>Order summary</h2>
   <div class="summary-row"><span>Subtotal</span><strong>{formatPrice(cartState.cart?.subtotal || 0, currency)}</strong></div>
   {#if cartState.cart?.discountAmount > 0}<div class="summary-row"><span>Discount</span><strong>-{formatPrice(cartState.cart.discountAmount, currency)}</strong></div>{/if}
   <p class="muted">Shipping and taxes calculated at checkout.</p>
   <form class="coupon-form" onsubmit={(e) => { e.preventDefault(); applyCoupon() }}><label for="cart-coupon">Discount code</label><div><input id="cart-coupon" bind:value={coupon} placeholder={cartState.cart?.couponCode || 'Enter code'} disabled={!!cartState.cart?.couponCode} /><button type="submit" disabled={busy || processing || (!coupon.trim() && !cartState.cart?.couponCode)}>{cartState.cart?.couponCode ? 'Remove' : 'Apply'}</button></div></form>
   {#if error}<p class="checkout-error" role="alert">{error}</p>{/if}
   <button class="checkout-primary" type="button" disabled={busy || processing} onclick={checkout}>{processing ? 'Please wait...' : signedIn ? 'Continue to checkout' : guestEnabled ? 'Checkout as guest' : 'Sign in to checkout'}</button>
   {#if !signedIn && guestEnabled}<p class="account-option">Already have an account? <button class="text-button" type="button" onclick={signIn}>Sign in</button></p>{/if}
   {#if guestEnabled && !signedIn}<p class="muted centered">No account needed to place your order.</p>{/if}
  </aside>
 </div>
 {:else}<div class="checkout-empty"><h2>Your cart is empty</h2><p>Find a piece you'll love.</p><a class="checkout-primary" href="/products">Continue shopping</a></div>{/if}
 {:catch}<p class="checkout-error" role="alert">Unable to load your cart. Please refresh and try again.</p>{/await}
</section>
<style>
 .cart-line{display:flex;gap:22px;padding:24px 0;border-bottom:1px solid #e8e3d9}.cart-line:first-child{padding-top:0}.cart-line:last-child{border-bottom:0;padding-bottom:0}.cart-image{flex:0 0 130px;width:130px;align-self:flex-start}.cart-image img{width:100%;aspect-ratio:1;object-fit:contain;background:#f8f7f4}.cart-copy{flex:1;min-width:0}.cart-copy>a{font-size:15px;color:inherit;text-decoration:none;line-height:1.6}.cart-copy p{font-size:12px;color:#777;margin:6px 0}.cart-copy strong{display:block;margin-top:10px}.cart-controls{display:flex;gap:18px;align-items:center;margin-top:14px}.quantity{display:flex;border:1px solid #ded8cc;align-items:center}.quantity button{width:44px;height:44px;border:0;background:transparent;font-size:20px;cursor:pointer}.quantity span{min-width:28px;text-align:center}.account-option{text-align:center;font-size:13px;margin-top:16px}.centered{text-align:center}@media(max-width:600px){.cart-line{gap:14px}.cart-image{flex-basis:85px;width:85px}.cart-controls{gap:12px}.cart-copy>a{font-size:14px}}
</style>
