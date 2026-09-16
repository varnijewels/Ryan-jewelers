<script lang="ts">
	import { page } from '$app/state'
	import { StructuredData } from '@misiki/kitcommerce-core/components'
	import { ryansSeoPlainText, safeJsonLd, seoPlainText } from '$lib/theme/ryans-jewels/seo.js'

	let {
		name = '',
		url = '',
		description = '',
		searchUrl = ''
	}: { name?: string; url?: string; description?: string; searchUrl?: string } = $props()
	const cleanText = (value: unknown) => page.data.theme?.name === 'ryans-jewels' ? ryansSeoPlainText(value) : seoPlainText(value)

	const schema = $derived(
		safeJsonLd({
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			'@id': `${url || page.url.origin}/#website`,
			name: name || page.data.store?.name,
			description: cleanText(description || page.data.store?.description),
			url: url || page.url.origin,
			publisher: { '@id': `${url || page.url.origin}/#organization` },
			potentialAction: {
				'@type': 'SearchAction',
				target: { '@type': 'EntryPoint', urlTemplate: searchUrl || `${page.url.origin}/products?search={search_term_string}` },
				'query-input': 'required name=search_term_string'
			}
		})
	)
</script>

<StructuredData {schema} />
