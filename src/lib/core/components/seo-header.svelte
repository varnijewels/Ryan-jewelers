<script lang="ts">
	import { page } from '$app/state'

	let {
		metaTitle = '',
		metaDescription = '',
		metaKeywords = '',
		image = '',
		canonicalUrl = '',
		noindex = false,
		ogType = 'website'
	}: {
		metaTitle?: string
		metaDescription?: string
		metaKeywords?: string
		image?: string
		canonicalUrl?: string
		noindex?: boolean
		ogType?: 'website' | 'product' | 'article'
	} = $props()

	const plainText = (value: unknown) => String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
	const finalCanonicalUrl = $derived(canonicalUrl || `${page.url.origin}${page.url.pathname}`)
	const storeName = $derived(page.data?.store?.name || 'Ryan Jewelers')
	const finalTitle = $derived(plainText(metaTitle || storeName))
	const finalDescription = $derived(
		plainText(metaDescription || page.data?.store?.description || `Explore lab grown diamond jewelry from ${storeName}.`)
	)
	const socialImage = $derived(
		new URL(image || (page.data?.theme?.name === 'ryans-jewels' ? '/ryans-jewels/home/hero-desktop.png' : '/favicon.png'), page.url.origin).href
	)
</script>

<svelte:head>
	<title>{finalTitle}</title>
	<meta name="description" content={finalDescription} />
	{#if metaKeywords}<meta name="keywords" content={metaKeywords} />{/if}
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{:else}
		<link rel="canonical" href={finalCanonicalUrl} />
		<link rel="alternate" hreflang="en" href={finalCanonicalUrl} />
		<link rel="alternate" hreflang="x-default" href={finalCanonicalUrl} />
	{/if}

	<meta property="og:title" content={finalTitle} />
	<meta property="og:description" content={finalDescription} />
	<meta property="og:image" content={socialImage} />
	<meta property="og:image:alt" content={finalTitle} />
	<meta property="og:url" content={finalCanonicalUrl} />
	<meta property="og:site_name" content={storeName} />
	<meta property="og:type" content={ogType} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={finalTitle} />
	<meta name="twitter:description" content={finalDescription} />
	<meta name="twitter:image" content={socialImage} />
</svelte:head>
