<script lang="ts">
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'
	import ListingPage from '$lib/components/product-catalogue/listing-page.svelte'
	import { page } from '$app/state'
	import { SeoHeader } from '$lib/core/components/index.js'
	import ListingScehma from '$lib/components/product-catalogue/listing-scehma.svelte'
	import { ryansSeoText } from '$lib/theme/ryans-jewels/seo.js'

	setDesktopFilterState()
	setCategoryFilterState()

	const data = $derived(page.data)
</script>

<ListingScehma />
<SeoHeader
	metaTitle={ryansSeoText(
		data.page?.metaTitle,
		(data.products?.categoryHierarchy?.length > 0
			? `${data.products.categoryHierarchy[data.products.categoryHierarchy.length - 1].name} | Ryan Jewelers`
			: 'Lab Grown Diamond Jewelry | Ryan Jewelers')
	)}
	metaDescription={ryansSeoText(
		data.page?.metaDescription,
		'Explore lab grown diamond rings, earrings, pendants and fine jewelry from Ryan Jewelers. Discover timeless designs crafted for every meaningful moment.'
	)}
	metaKeywords={data.page?.metaKeywords ?? ''}
	image={data.page?.logo ?? ''}
/>

<ListingPage />
