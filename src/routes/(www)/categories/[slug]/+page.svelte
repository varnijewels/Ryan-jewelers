<script lang="ts">
	import { page } from '$app/state'
	import ListingPage from '$lib/components/product-catalogue/listing-page.svelte'
	import ListingSchema from '$lib/components/product-catalogue/listing-scehma.svelte'
	import { SeoHeader } from '$lib/core/components/index.js'
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'

	setDesktopFilterState()
	setCategoryFilterState()

	const categoryContent: Record<string, { title: string; description: string; copy: string }> = {
		'lab-grown-diamond': {
			title: 'Lab Grown Diamonds | Ryan Jewelers',
			description: 'Shop certified lab grown diamonds in classic shapes and fine jewelry settings at Ryan Jewelers. Ethical brilliance, transparent value and timeless design.',
			copy: 'Discover lab grown diamonds created with the same optical, chemical and physical properties as mined diamonds. Compare shapes, settings and styles to find an expertly crafted piece for engagements, anniversaries and everyday milestones.'
		},
		rings: {
			title: 'Lab Grown Diamond Rings | Ryan Jewelers',
			description: 'Explore lab grown diamond rings from Ryan Jewelers, including engagement, wedding and everyday designs in timeless precious-metal settings.',
			copy: 'Find a lab grown diamond ring designed around your moment. Explore classic solitaires, detailed halos and modern settings, with options for different diamond shapes, metals and budgets.'
		},
		engagement: {
			title: 'Lab Grown Diamond Engagement Rings | Ryan Jewelers',
			description: 'Discover lab grown diamond engagement rings in solitaire, halo and modern settings. Shop meaningful, made-to-order designs from Ryan Jewelers.',
			copy: 'Choose an engagement ring that balances personal style, craftsmanship and value. Our lab grown diamond designs include timeless and contemporary settings made to celebrate a proposal that is uniquely yours.'
		},
		bracelets: {
			title: 'Lab Grown Diamond Bracelets | Ryan Jewelers',
			description: 'Shop lab grown diamond bracelets from Ryan Jewelers, from refined everyday styles to statement designs crafted for memorable occasions.',
			copy: 'Explore diamond bracelets designed for effortless layering and lasting brilliance. Compare refined tennis-inspired lines, delicate everyday pieces and celebration-ready styles made with lab grown diamonds.'
		},
		earrings: {
			title: 'Lab Grown Diamond Earrings | Ryan Jewelers',
			description: 'Explore lab grown diamond earrings from Ryan Jewelers, including elegant studs and modern designs created for daily wear and gifting.',
			copy: 'Find lab grown diamond earrings for everyday polish, thoughtful gifts and milestone moments. Browse versatile shapes and precious-metal finishes crafted to bring balanced brilliance to every look.'
		},
		pendants: {
			title: 'Lab Grown Diamond Pendants | Ryan Jewelers',
			description: 'Shop lab grown diamond pendants and necklaces from Ryan Jewelers in timeless and contemporary designs for gifting or everyday elegance.',
			copy: 'Discover lab grown diamond pendants designed to wear beautifully on their own or layered. Explore classic silhouettes and modern details for birthdays, anniversaries and meaningful everyday gifts.'
		}
	}

	const slug = $derived(String(page.params.slug || ''))
	const name = $derived(slug.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()))
	const seo = $derived(
		categoryContent[slug] || {
			title: `${name} Jewelry | Ryan Jewelers`,
			description: `Shop ${name.toLowerCase()} jewelry from Ryan Jewelers. Explore lab grown diamond designs crafted for meaningful moments and everyday wear.`,
			copy: `Explore our ${name.toLowerCase()} collection and compare thoughtfully crafted lab grown diamond designs, precious-metal finishes and styles for every occasion.`
		}
	)
</script>

<ListingSchema />
<SeoHeader metaTitle={seo.title} metaDescription={seo.description} canonicalUrl={`${page.url.origin}${page.url.pathname}`} />
<ListingPage />

<section class="mx-auto mb-20 max-w-5xl px-5 text-center" aria-labelledby="category-guide-title">
	<h2 id="category-guide-title" class="mb-3 text-2xl font-semibold text-zinc-800">Shop {name} at Ryan Jewelers</h2>
	<p class="mx-auto max-w-3xl leading-7 text-zinc-600">{seo.copy}</p>
	<a class="mt-4 inline-block font-semibold text-amber-700 underline underline-offset-4" href="/blog/lab-grown-vs-natural-diamonds">Learn about lab grown diamonds</a>
</section>
