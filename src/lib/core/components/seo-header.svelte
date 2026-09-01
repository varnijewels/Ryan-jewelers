<script lang="ts">
	import { page } from '$app/state'
	import { SeoHeader as CoreSeoHeader } from '@misiki/kitcommerce-core/components'

	let {
		metaTitle = '',
		metaDescription = '',
		metaKeywords = '',
		image = '',
		canonicalUrl = '',
		noindex = false
	}: {
		metaTitle?: string
		metaDescription?: string
		metaKeywords?: string
		image?: string
		canonicalUrl?: string
		noindex?: boolean
	} = $props()

	const socialImage = $derived(
		new URL(
			image || (page.data?.theme?.name === 'ryans-jewels' ? '/ryans-jewels/home/hero-desktop.png' : '/favicon.png'),
			page.url.origin
		).href
	)
</script>

<CoreSeoHeader {metaTitle} {metaDescription} {metaKeywords} image={socialImage} {canonicalUrl} {noindex} />
