<script lang="ts">
	import { page } from '$app/state'
	import { MyOrdersIdRenderer } from '$lib/core/composables/index.js'
	import type { Snippet } from 'svelte'

	let { content: view }: { content: Snippet<[{ loading: boolean; order: any }]> } = $props()

	const localOrder = {
		id: 'rj-local-test-order',
		orderNo: 'RJ-TEST-0911',
		status: 'delivered',
		createdAt: new Date('2026-09-11T10:30:00.000Z').getTime(),
		paymentMethod: 'MasterCard',
		paymentStatus: 'paid',
		subtotal: 285.25,
		total: 285.25,
		shippingCharges: 0,
		shippingRate: { estimatedMaxDays: 4 },
		shippingAddress: {
			firstName: 'Sujal', lastName: 'Amreliya', address_1: 'A 404 Monarch Business, Gaurav Path Road',
			city: 'Surat', state: 'Gujarat', zip: '395009', phone: '+91 9876543210', countryCode: 'IN'
		},
		lineItems: [{
			id: 'rj-local-test-item', title: 'Silver Diamond Rings 2541',
			description: 'These dazzling Kundan earrings from Tarinika give your outfit a captivating charm.',
			thumbnail: '/ryans-jewels/account/order-details-product.png', price: 285.25, subtotal: 285.25, qty: 1
		}],
		trackingNumber: 'HG2587LK2368',
		tracking: [
			{ createdAt: '2026-01-14T12:30:00', status: 'Shipment has been created', location: 'Surat, India' },
			{ createdAt: '2026-01-13T17:45:00', status: 'Order label generated', location: 'Surat, India' },
			{ createdAt: '2026-01-13T17:30:00', status: 'Order Accepted', location: 'Surat, India' }
		]
	}
</script>

{#if import.meta.env.DEV && page.params.id === localOrder.orderNo}
	{@render view({ loading: false, order: localOrder })}
{:else}
	<MyOrdersIdRenderer>
		{#snippet content({ loading, order })}{@render view({ loading, order })}{/snippet}
	</MyOrdersIdRenderer>
{/if}
