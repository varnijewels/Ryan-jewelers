<script lang="ts">
	import { page as sveltePage } from '$app/state'
	import { fly } from 'svelte/transition'
	import { X } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import {
		GoogleStructuredDataOrganization,
		GoogleStructuredDataProductsList,
		GoogleStructuredDataWebsite,
		SeoHeader
	} from '$lib/core/components/index.js'
	import { HomepageModule } from '$lib/core/composables/index.js'
	import { setCollectionState } from '$lib/core/stores/collection.svelte.js'
	import { timestampToAgo } from '$lib/core/utils/index.js'
	import { getThemeHomepageContent } from '$lib/theme/index.js'
	import { themeHomepages } from '$lib/theme/homepages.js'
	import Slider from '$lib/components/home/slider.svelte'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'
	import { canonicalProductPath } from '$lib/theme/ryans-jewels/seo.js'

	let { data } = $props()

	const PUBLIC_LITEKART_DOMAIN = $derived(sveltePage.url.origin)
	const [aspectWidth, aspectHeight] = $derived(
		data?.store?.productImageAspectRatio?.split(':') || ['1', '1']
	)

	setCollectionState()

	interface ExtendedPage {
		metaTitle?: string
		metaDescription?: string
		metaKeywords?: string
		logo?: string
		desktopBanners?: any[]
		mobileBanners?: any[]
		sections?: any[]
	}

	const page = (data?.page || {}) as ExtendedPage
	const homepageModule = new HomepageModule()
	const activeTheme = $derived(data?.theme?.name || 'default')
	const ThemeHomepage = $derived(themeHomepages[activeTheme] || themeHomepages['default'])
	const rendersApiPageAddons = $derived(activeTheme === 'default')
	const themeContent = $derived(getThemeHomepageContent(activeTheme))
	const brandName = $derived(themeContent.brandName || data?.store?.name || 'Store')
	const themeDescription = $derived(themeContent.description || page?.metaDescription || '')

	const featuredCategories = $derived(homepageModule.featuredCategories || [])
	const storefrontProducts = $derived(data?.storefrontProducts || [])
	const featuredProducts = $derived(activeTheme === 'ryans-jewels' ? storefrontProducts : homepageModule.featuredProducts || [])
	const trendingProducts = $derived(activeTheme === 'ryans-jewels' ? storefrontProducts : homepageModule.trendingProducts || [])
	const structuredProducts = $derived(activeTheme === 'ryans-jewels'
		? storefrontProducts.map((product: any) => ({
			url: `${sveltePage.url.origin}${canonicalProductPath(product)}`,
			name: product.title,
			image: product.thumbnail ? [product.thumbnail] : [],
			description: product.description || '',
			brandName,
			manufacturer: brandName,
			material: product.attributes?.find((attribute: any) => attribute.name === 'Metal Type')?.value || '',
			offers: {
				url: `${sveltePage.url.origin}${canonicalProductPath(product)}`,
				priceCurrency: data?.store?.currency?.code || 'USD',
				price: product.price,
				availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
			}
		}))
		: homepageModule.featuredProductsStructuredData)
	const filterButtons = $derived([
		'All',
		...featuredCategories
			.map((category: any) => category?.name || category?.title)
			.filter(Boolean)
			.slice(0, 6)
	])

</script>

<GoogleStructuredDataProductsList products={structuredProducts} />

<GoogleStructuredDataOrganization
	name={brandName}
	url={PUBLIC_LITEKART_DOMAIN}
	logo={data?.store?.logo}
	description={themeDescription}
	sameAs={data?.store?.socialSharing?.active
		? (Object.values(data?.store?.socialSharing || {}).filter(
				(link: any) => typeof link === 'string' && link.startsWith('http')
			) as string[])
		: []}
	address={data?.store?.address
		? {
				streetAddress: data?.store?.address?.street,
				addressLocality: data?.store?.address?.city,
				addressRegion: data?.store?.address?.state,
				postalCode: data?.store?.address?.pincode,
				addressCountry: data?.store?.address?.country
			}
		: undefined}
	contactPoint={data?.store?.contact?.phone
		? {
				telephone: data?.store?.contact?.phone,
				email: data?.store?.contact?.email,
				contactType: 'customer service'
			}
		: undefined}
/>

<GoogleStructuredDataWebsite
	name={brandName}
	url={PUBLIC_LITEKART_DOMAIN}
	description={themeDescription}
	searchUrl={`${PUBLIC_LITEKART_DOMAIN}/products?search={search_term_string}`}
/>

<SeoHeader
	metaTitle={themeContent.seoTitle || page?.metaTitle || brandName}
	metaDescription={themeDescription}
	metaKeywords={page?.metaKeywords}
	image={themeContent.seoImage || page?.logo || data?.store?.logo}
/>

{#if activeTheme === 'ryans-jewels'}
	<h1 class="sr-only">Ryan Jewelers — Lab Grown Diamonds and Fine Jewelry</h1>
{/if}

<svelte:component
	this={ThemeHomepage}
	{themeContent}
	{brandName}
	{themeDescription}
	storeLogo={data?.store?.logo}
	storeName={data?.store?.name}
	storeDescription={data?.store?.description}
	{aspectWidth}
	{aspectHeight}
	{featuredCategories}
	{featuredProducts}
	{trendingProducts}
	{filterButtons}
	{homepageModule}
	loading={homepageModule.loading}
	desktopBanners={page?.desktopBanners}
	mobileBanners={page?.mobileBanners}
	currencyCode={data?.store?.currency?.code}
/>

{#if rendersApiPageAddons}
	<Slider />

	<Blocks layouts={data?.page?.layouts || []} />
{/if}

{#if homepageModule.showRecentOrderPopup}
	<div transition:fly={{ x: 50, duration: 150 }} class="fixed bottom-20 right-4 z-50">
		<div class="flex max-w-[320px] gap-3 border-l-4 border-primary bg-white p-3.5 shadow-lg">
			<a href="/products/{homepageModule.selectedRecentOrder?.slug || ''}" class="flex gap-3 text-foreground">
				<img
					src={homepageModule.selectedRecentOrder?.image ||
						homepageModule.selectedRecentOrder?.img ||
						homepageModule.selectedRecentOrder?.thumbnail}
					alt={homepageModule.selectedRecentOrder?.title || 'Product'}
					class="h-[58px] w-[58px] object-cover"
				/>
				<div>
					<p class="text-xs text-gray-500">
						{homepageModule.selectedRecentOrder?.first_name || 'Someone'} from {homepageModule.selectedRecentOrder?.city || 'nearby'}
					</p>
					<strong class="block text-sm text-primary">{homepageModule.selectedRecentOrder?.title || 'a menu item'}</strong>
					<span class="text-xs text-gray-500">
						{timestampToAgo(
							homepageModule.selectedRecentOrder?.created_at ||
								homepageModule.selectedRecentOrder?.createdAt ||
								''
						)}
					</span>
				</div>
			</a>
			<Button
				variant="ghost"
				size="icon"
				class="h-7 w-7 self-start"
				onclick={() => (homepageModule.showRecentOrderPopup = false)}
				aria-label="Close recent order"
			>
				<X class="h-4 w-4" />
			</Button>
		</div>
	</div>
{/if}
