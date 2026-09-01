<script lang="ts">
	import ShippingPolicyPage from '../shipping-policy/+page.svelte'

	let { data } = $props()
</script>

<ShippingPolicyPage {data} mode="refund" />
