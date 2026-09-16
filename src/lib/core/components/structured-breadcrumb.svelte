<script module lang="ts">
	export type Breadcrumb = { name: string; item?: string }
</script>

<script lang="ts">
	import { page } from '$app/state'
	import { StructuredData } from '@misiki/kitcommerce-core/components'
	import { safeJsonLd } from '$lib/theme/ryans-jewels/seo.js'

	let {
		breadcrumbs = [],
		categoryHierarchy = []
	}: {
		breadcrumbs?: Breadcrumb[]
		categoryHierarchy?: Array<{ name: string; slug?: string }>
	} = $props()

	const schema = $derived.by(() => {
		const items = breadcrumbs.length
			? breadcrumbs
			: categoryHierarchy.map((category) => ({
					name: category.name,
					item: category.slug ? `${page.url.origin}/categories/${String(category.slug).replace(/^\/?(?:categories\/)?/, '')}` : undefined
				}))
		if (!items.length) return ''

		return safeJsonLd({
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: `${page.url.origin}/` },
				...items.map((item, index) => ({ '@type': 'ListItem', position: index + 2, name: item.name, item: item.item }))
			]
		})
	})
</script>

<StructuredData {schema} />
