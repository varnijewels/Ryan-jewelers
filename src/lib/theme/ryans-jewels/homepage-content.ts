import type { ThemeHomepageContent } from '../types.js'
import { defaultContent } from '../default/homepage-content.js'

/**
 * Only the fields the shared route actually reads for SEO / structured data
 * (brandName, description, seoTitle, seoImage) are overridden here. Everything
 * this theme renders on the page itself lives in ./home-content.ts — the
 * ThemeHomepageContent shape is restaurant-oriented and is not the source of
 * truth for the Ryan Jewelers layout.
 */
export const ryansJewelsContent: ThemeHomepageContent = {
	...defaultContent,
	brandName: 'Ryan Jewelers',
	description:
		'Lab grown diamonds and fine jewellery, made to order. Explore rings, earrings and custom pieces in every classic diamond cut.',
	seoTitle: 'Ryan Jewelers — Lab Grown Diamonds & Fine Jewellery',
	seoImage: '/ryans-jewels/home/hero-desktop.png'
}
