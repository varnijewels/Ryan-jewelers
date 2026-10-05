<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { getCartState } from '$lib/core/stores/index.js'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { X, Minus, Plus, Trash2, ShoppingBag, LockKeyhole } from '@lucide/svelte'
	import { cartItemHref, checkoutBusy } from './cart-flow.js'
	const cartState = getCartState()
	const items = $derived(cartState.cart?.lineItems || [])
	const currency = $derived(page.data?.store?.currency?.code || 'USD')
	const busy = $derived(checkoutBusy(cartState))
	let dialog: HTMLDialogElement
	let error = $state('')
	let navigating = $state(false)
	function close() { cartState.isOpen = false }
	onMount(() => {
		const previous = document.activeElement as HTMLElement | null
		const overflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		dialog.showModal()
		window.addEventListener('popstate', close)
		return () => { window.removeEventListener('popstate', close); document.body.style.overflow = overflow; previous?.focus() }
	})
	async function update(item: any, qty: number) {
		error = ''
		try {
			if (qty === 0) await cartState.remove({ cartId: cartState.cart.id, lineId: item.id })
			else await cartState.update({ lineId: item.id, productId: item.productId, variantId: item.variantId, qty })
		} catch { error = 'Unable to update your cart. Please try again.' }
	}
	async function checkout() {
		if (busy || navigating) return
		navigating = true
		try { await goto('/checkout/cart'); close() }
		catch { error = 'Unable to open checkout. Please try again.' }
		finally { navigating = false }
	}
</script>

<dialog bind:this={dialog} aria-labelledby="cart-drawer-title" onclose={close} onclick={(event) => { if (event.target === dialog) close() }}>
	<div class="panel">
		<header><h2 id="cart-drawer-title">My Shopping Cart <span>({cartState.cart?.qty || 0})</span></h2><button class="icon" type="button" aria-label="Close cart" onclick={close}><X size={21} /></button></header>
		<div class="items">
			{#if items.length}
				{#each items as item (item.id)}
					<article>
						<a class="image" href={cartItemHref(item)} onclick={close}><img src={item.thumbnail || '/placeholder.svg'} alt={item.title} /></a>
						<div class="detail"><a class="title" href={cartItemHref(item)} onclick={close}>{item.title}</a>{#if item.variantTitle}<p class="variant">{item.variantTitle}</p>{/if}<strong>{formatPrice(item.price * item.qty, currency)}</strong>
							<div class="actions"><div class="quantity"><button type="button" aria-label="Decrease quantity for {item.title}" disabled={busy || cartState.updatingItem[item.id] || item.qty <= 1} onclick={() => update(item, item.qty - 1)}><Minus size={15} /></button><span aria-live="polite">{item.qty}</span><button type="button" aria-label="Increase quantity for {item.title}" disabled={busy || cartState.updatingItem[item.id]} onclick={() => update(item, item.qty + 1)}><Plus size={15} /></button></div><button class="icon" type="button" aria-label="Remove {item.title}" disabled={busy || cartState.updatingItem[item.id]} onclick={() => update(item, 0)}><Trash2 size={17} /></button></div>
						</div>
					</article>
				{/each}
			{:else}<div class="empty"><ShoppingBag size={42} strokeWidth={1} /><h3>Your cart is empty</h3><p>Find a piece you'll love.</p><button class="primary" type="button" onclick={close}>Continue shopping</button></div>{/if}
		</div>
		{#if error}<p class="error" role="alert">{error}</p>{/if}
		{#if items.length}<footer><div class="subtotal"><span>Subtotal</span><strong>{formatPrice(cartState.cart?.subtotal ?? cartState.cart?.total, currency)}</strong></div><p>Shipping &amp; taxes calculated at checkout.</p><button class="primary" type="button" disabled={busy || navigating} onclick={checkout}>{navigating ? 'Opening checkout…' : 'Checkout'} <LockKeyhole size={16} /></button><button class="continue" type="button" onclick={close}>Continue shopping</button></footer>{/if}
	</div>
</dialog>

<style>
	dialog{position:fixed;inset:0 0 0 auto;margin:0;width:min(510px,100%);height:100dvh;max-height:none;max-width:100%;padding:0;border:0;background:#fff;color:#302d27;box-shadow:-12px 0 50px #0002}dialog::backdrop{background:#0006}.panel{height:100%;display:flex;flex-direction:column}header{display:flex;align-items:center;justify-content:space-between;padding:22px 24px;border-bottom:1px solid #e8e4dc;gap:12px}h2{font-size:23px;margin:0}h2 span{font:14px var(--font-body);color:#7b7469}.icon{display:grid;place-items:center;min-width:44px;height:44px;border:0;background:transparent;cursor:pointer}.items{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:0 24px}article{display:flex;gap:18px;padding:24px 0;border-bottom:1px solid #eee9e1}.image{width:108px;flex:0 0 108px;align-self:flex-start;background:#f7f6f3}.image img{width:100%;aspect-ratio:1;object-fit:contain}.detail{min-width:0;flex:1}.title{display:block;font-size:14px;line-height:1.55;color:inherit;text-decoration:none}.variant{font-size:12px;color:#777;margin:6px 0}.detail strong{display:block;font-size:15px;margin-top:8px}.actions{display:flex;align-items:center;gap:10px;margin-top:12px}.quantity{display:flex;align-items:center;border:1px solid #ded9cf;border-radius:4px}.quantity button{width:44px;height:44px;display:grid;place-items:center;background:transparent;border:0;cursor:pointer}.quantity span{min-width:24px;text-align:center;font-size:13px}footer{padding:22px 24px max(16px,env(safe-area-inset-bottom));background:#faf8f3;border-top:1px solid #e8e4dc}.subtotal{display:flex;justify-content:space-between;font-size:17px}footer p{font-size:12px;color:#756f64;margin:8px 0 20px}.primary{width:100%;min-height:52px;display:flex;justify-content:center;align-items:center;gap:12px;border:0;background:#b18b38;color:white;font-weight:600;cursor:pointer}.continue{display:block;width:100%;min-height:44px;border:0;background:transparent;text-decoration:underline;cursor:pointer;font-size:13px;margin-top:7px}.empty{min-height:50dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center}.empty h3,.empty p{margin:0}.empty .primary{margin-top:12px}button:disabled{opacity:.5;cursor:wait}button:focus-visible,a:focus-visible{outline:2px solid #997329;outline-offset:3px}.error{color:#a32626;font-size:13px;padding:0 24px}@media(max-width:400px){header,.items,footer{padding-left:16px;padding-right:16px}.image{width:88px;flex-basis:88px}article{gap:12px}h2{font-size:20px}}
</style>
