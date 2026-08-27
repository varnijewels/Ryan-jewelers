<script lang="ts">
	let {
		step = 1,
		variant = 'overview'
	}: { step?: 1 | 2 | 3; variant?: 'overview' | 'payment' } = $props()
</script>

<ol class="rj-checkout-progress" class:payment={variant === 'payment'} aria-label="Checkout progress">
	<li class:complete={step > 1} aria-current={step === 1 ? 'step' : undefined}><b>1</b><span>Information</span></li>
	<li aria-hidden="true">----</li>
	<li class:complete={step > 2} aria-current={step === 2 ? 'step' : undefined}><b>2</b><span>Shipping Address</span></li>
	<li aria-hidden="true">----</li>
	<li aria-current={step === 3 ? 'step' : undefined}><b>3</b><span>Payment Method</span></li>
</ol>

<style>
	.rj-checkout-progress { display: flex; height: 34px; gap: 12px; align-items: center; margin: 0; padding: 0 0 0 21px; color: #989898; font: 16px/normal 'Sarala', sans-serif; list-style: none; white-space: nowrap; }
	.rj-checkout-progress li { display: flex; gap: 10px; align-items: center; }
	.rj-checkout-progress li[aria-hidden='true'] { display: block; color: #989898; font-size: 22px; letter-spacing: -1px; }
	.rj-checkout-progress b { display: grid; box-sizing: border-box; width: 34px; height: 34px; place-items: center; border: 1.5px solid #989898; border-radius: 50%; font-size: 16px; font-weight: 400; }
	.rj-checkout-progress .complete { color: #00a80b; }
	.rj-checkout-progress .complete b { border-color: #00a80b; background: #00a80b; color: #fff; font-size: 18px; }
	.rj-checkout-progress.payment b { border-width: 1px; border-color: #9e9e9e; }
	.rj-checkout-progress.payment .complete b { border-color: #00a80b; font-size: 16px; }

	@media (min-width: 701px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-checkout-progress { justify-content: center; padding-left: 0; }
		.rj-checkout-progress.payment b { border-width: 1.5px; }
		.rj-checkout-progress.payment .complete b { font-size: 18px; }
	}

	@media (max-width: 700px) {
		.rj-checkout-progress { gap: 7px; padding-left: 0; overflow-x: auto; font-size: 12px; }
		.rj-checkout-progress li { gap: 5px; }
		.rj-checkout-progress li[aria-hidden='true'] { font-size: 15px; }
		.rj-checkout-progress b { width: 28px; height: 28px; flex: 0 0 28px; }
		.rj-checkout-progress.payment { gap: 5px; }
		.rj-checkout-progress.payment li[aria-hidden='true'] { display: none; }
	}
</style>
