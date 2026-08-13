<script lang="ts">
	import ProductDetails from './components/product-details.svelte'
	import { ProductStateProvider } from '$lib/core/composables/index.js'

	let { data } = $props()
	let trackedProductId: string | undefined

	$effect(() => {
		const product = data?.product
		if (!product?.id || !product?.slug || product.id === trackedProductId) return
		trackedProductId = product.id
		const categories = (product.categories || []).map((item: any) => item.category?.slug || item.slug).filter(Boolean)
		void fetch('/api/popularity/update', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				product: { id: product.id, title: product.title, slug: product.slug, thumbnail: product.thumbnail || product.featuredImage },
				categories
			})
		}).catch(() => {})
	})
</script>

<ProductStateProvider {data}>
	<ProductDetails />
</ProductStateProvider>
