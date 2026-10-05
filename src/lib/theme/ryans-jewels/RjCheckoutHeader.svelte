<script lang="ts">
	import { LockKeyhole } from '@lucide/svelte'
	let { step = 1, title, description = '' }: { step?: number; title: string; description?: string } = $props()
</script>
<header class="checkout-header"><div><p class="eyebrow">RYAN JEWELERS</p><h1>{title}</h1><p>{description}</p></div><div class="checkout-links"><a href="/products">Back to shopping</a><span><LockKeyhole size={15} /> Secure checkout</span></div></header>
<ol class="checkout-steps" aria-label="Checkout progress">{#each ['Cart', 'Address', 'Payment'] as name, i}<li aria-current={step === i + 1 ? 'step' : undefined} class:complete={step > i + 1}><span>{i + 1}</span>{#if step > i + 1}<a href={i === 0 ? '/checkout/cart' : '/checkout/address'}>{name}</a>{:else}{name}{/if}</li>{/each}</ol>
