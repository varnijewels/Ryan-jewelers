<script lang="ts">
	import { page } from '$app/state'
	import { StructuredData } from '@misiki/kitcommerce-core/components'
	import { ryansSeoPlainText, safeJsonLd, seoPlainText } from '$lib/theme/ryans-jewels/seo.js'

	type Product = {
		url?: string
		name?: string
		image?: string[] | string
		description?: string
		brandName?: string
		manufacturer?: string
		material?: string
		offers?: { url?: string; priceCurrency?: string; price?: number; availability?: string }
	}

	let { products = [] }: { products?: Product[] } = $props()
	const cleanText = (value: unknown) => page.data.theme?.name === 'ryans-jewels' ? ryansSeoPlainText(value) : seoPlainText(value)

	const schema = $derived.by(() => {
		const unique = [...new Map(products.filter((product) => product?.url && product?.name).map((product) => [product.url, product])).values()]
		if (!unique.length) return ''

		return safeJsonLd({
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			itemListElement: unique.map((product, index) => {
				const price = Number(product.offers?.price)
				return {
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'Product',
						url: product.url,
						name: product.name,
						image: Array.isArray(product.image) ? product.image.filter(Boolean) : product.image ? [product.image] : undefined,
						description: cleanText(product.description),
						brand: { '@type': 'Brand', name: cleanText(product.brandName || page.data.store?.name) || 'Ryan Jewelers' },
						manufacturer: cleanText(product.manufacturer) || undefined,
						material: product.material || undefined,
						offers: Number.isFinite(price)
							? {
									'@type': 'Offer',
									url: product.offers?.url || product.url,
									priceCurrency: product.offers?.priceCurrency || page.data.store?.currency?.code || 'USD',
									price,
									availability: product.offers?.availability
								}
							: undefined
					}
				}
			})
		})
	})
</script>

<StructuredData {schema} />
