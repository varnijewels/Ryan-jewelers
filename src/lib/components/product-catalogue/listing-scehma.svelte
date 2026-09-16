<script lang="ts">
	import { page } from '$app/state'
	import { GoogleStructuredDataBreadcrumb, GoogleStructuredDataProductsList } from '$lib/core/components/index.js'
	import { canonicalProductPath } from '$lib/theme/ryans-jewels/seo.js'

	const products = $derived(page.data.products?.data || [])
	const mappedProducts = $derived(
		products.map((product: any) => {
			const url = `${page.url.origin}${canonicalProductPath(product)}`
			return {
				url,
				name: product.name || product.title,
				image: product.images || (product.thumbnail ? [product.thumbnail] : []),
				description: product.description || product.metaDescription || '',
				brandName: product.brandName || page.data.store?.name || 'Ryan Jewelers',
				manufacturer: product.manufacturer || '',
				material: product.material || '',
				offers: {
					url,
					priceCurrency: page.data.store?.currency?.code || 'USD',
					price: product.price,
					availability: product.allowBackorder || product.manageInventory === false || product.stock > 0
						? 'https://schema.org/InStock'
						: 'https://schema.org/OutOfStock'
				}
			}
		})
	)
	const categoryHierarchy = $derived(page.data.products?.categoryHierarchy)
</script>

<GoogleStructuredDataProductsList products={mappedProducts} />
<GoogleStructuredDataBreadcrumb {categoryHierarchy} />
