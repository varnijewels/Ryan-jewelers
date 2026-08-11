/**
 * Theme-owned static footer content for the "ryans-jewels" theme.
 *
 * Source frames
 *   desktop 1:6335 (0,7958 · 1440×611) — USP strip 1:6338, columns 1:6379,
 *           legal bar 1:6416
 *   tablet  63:40969 (0,7271 · 744×860)
 *   mobile  77:107710 (0,6052 · 412×976)
 *
 * Copy, hrefs and icons live here; the newsletter subscription itself is live
 * app logic (NewsletterRenderer), not static content.
 */

export interface FooterUsp {
	key: string
	/** `verify` is the composite %-in-a-rosette glyph (1:6352). */
	icon: string | 'verify'
	iconWidth: number
	iconHeight: number
	/** gap between the icon and its title — the source varies it per item */
	iconGap: number
	title: string
	text: string
	/** column width from the source row (1:6339) */
	width: number
	titleWidth: number
}

export const footerUsps: FooterUsp[] = [
	{
		key: 'unique',
		icon: '/ryans-jewels/footer/unique-design.svg',
		iconWidth: 30.82,
		iconHeight: 28.515,
		iconGap: 10,
		title: 'Unique Design',
		text: 'Each design tells a story, blending timeless with modern artistry.',
		width: 216,
		titleWidth: 120
	},
	{
		key: 'discount',
		icon: 'verify',
		iconWidth: 30,
		iconHeight: 30,
		iconGap: 9,
		title: 'Discount',
		text: 'Affordable  for everyone. Shop your favorites at prices you’ll love!',
		width: 215,
		titleWidth: 74
	},
	{
		key: 'shipping',
		icon: '/ryans-jewels/footer/delivery-truck.svg',
		/* 1:6358 draws the glyph inside a 33×33 box (the SVG's own bbox is 31.45×19). */
		iconWidth: 33,
		iconHeight: 33,
		iconGap: 6,
		title: 'Fast Shipping',
		text: 'Earn rewards as you shop and unlock exclusive benefits.',
		width: 192,
		titleWidth: 114
	},
	{
		key: 'rewards',
		icon: '/ryans-jewels/footer/gift.svg',
		iconWidth: 35,
		iconHeight: 28,
		iconGap: 11,
		title: 'Reward Program',
		text: 'Earn rewards as you shop and unlock exclusive benefits.',
		width: 192,
		titleWidth: 144
	},
	{
		key: 'prices',
		icon: '/ryans-jewels/footer/dollar-circle.svg',
		iconWidth: 30,
		iconHeight: 30,
		iconGap: 9,
		title: 'Great Prices',
		text: 'Save big with our exclusive special discounts on your favorite items.',
		width: 222,
		titleWidth: 101
	}
]

export const ryansJewelsFooter = {
	logo: '/ryans-jewels/logo.png',
	brandName: 'Ryan Jewelers',
	description:
		'We believe true luxury lies in exceptional craftsmanship, timeless design, and conscious choices',
	usps: footerUsps,
	columns: [
		{
			title: 'Categories',
			width: 148,
			gap: 10,
			links: [
				{ label: 'Rings', href: '/categories/rings' },
				{ label: 'Earrings', href: '/categories/earrings' },
				{ label: 'Customise', href: '/products' },
				{ label: 'About us', href: '/about-us' },
				{ label: 'My Cart', href: '/cart' },
				{ label: 'FAQ', href: '/faqs' },
				{ label: 'Contact', href: '/contact-us' }
			]
		},
		{
			title: 'POLICIES',
			width: 170,
			gap: 12,
			links: [
				{ label: 'Privacy policy', href: '/privacy-policy' },
				{ label: 'Terms and Condition', href: '/terms-and-conditions' },
				{ label: 'Disclaimer', href: '/terms-and-conditions' },
				{ label: 'Shopping policy', href: '/shipping-policy' },
				{ label: 'Refund policy', href: '/refund-policy' }
			]
		}
	],
	newsletter: {
		title: 'Join Our Newsletter',
		placeholder: 'Email address',
		button: 'SUBSCRIBE',
		consent: 'I Agree with the terms & Condition',
		note: 'Keep up with the latest trends and receive exclusive offers! ',
		noteLink: 'Learn more.',
		noteHref: '/faqs'
	},
	legal: {
		/** The source prints a literal "your company" placeholder — the brand name
		 *  is substituted at render time from the theme's `brandName`. */
		year: '2025',
		/* The mock reads "All Rights revered."; corrected to "reserved" here. */
		rights: 'All Rights Reserved.',
		links: [
			{ label: 'Terms & Conditions', href: '/terms-and-conditions' },
			{ label: 'Privacy policy', href: '/privacy-policy' },
			{ label: 'Disclaimer', href: '/terms-and-conditions' }
		]
	}
}

/** Section 16a — the Instagram strip (1:6323 / 63:40958 / 77:107699). */
export const instagramStrip = {
	eyebrow: 'Follow us on Instagram!',
	heading: 'Explore the Instagram Universe!',
	/** TODO: replace with the store's real Instagram profile. */
	href: 'https://www.instagram.com/',
	tiles: [
		{ src: '/ryans-jewels/instagram/tile-1.png', alt: 'Diamond ring styled on a hand' },
		{ src: '/ryans-jewels/instagram/tile-2.jpg', alt: 'Diamond jewellery close-up' },
		{ src: '/ryans-jewels/instagram/tile-3.jpg', alt: 'Model wearing Ryan Jewelers earrings' },
		{ src: '/ryans-jewels/instagram/tile-4.jpg', alt: 'Diamond necklace detail' },
		{ src: '/ryans-jewels/instagram/tile-5.jpg', alt: 'Gold and diamond bracelet' },
		{ src: '/ryans-jewels/instagram/tile-6.jpg', alt: 'Ryan Jewelers ring styling' }
	]
}
