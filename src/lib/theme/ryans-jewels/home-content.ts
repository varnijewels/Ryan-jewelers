/**
 * Theme-owned static homepage content for the "ryans-jewels" theme.
 *
 * Every value comes from the three Figma source frames:
 *   desktop 1440 `1:5407` · tablet 744 `63:40011` · mobile 412 `77:106779`
 *
 * Live commerce data (products, prices, stock) is NOT here — it stays with the
 * API/composable layer and is passed into the homepage component as props.
 */

/** Per-breakpoint geometry for one icon: box padding, icon size, gap to label. */
export interface ShapeMetrics {
	/** icon width in px */
	w: number
	/** icon height in px */
	h: number
	/** horizontal padding of the clipping box */
	px: number
	/** vertical padding of the clipping box */
	py: number
	/** gap between the icon box and the label */
	gap: number
}

export interface DiamondShape {
	key: string
	label: string
	href: string
	/** rotation applied to the icon box, degrees (source uses 180 / -90) */
	rot?: number
	/** fixed outer box for rotated icons, so the row keeps its rhythm */
	box?: { w: number; h: number }
	/** same, at tablet/mobile */
	boxSm?: { w: number; h: number }
	d: ShapeMetrics
	t: ShapeMetrics
	m: ShapeMetrics
}

/** 1:5523 (desktop) · 63:40058 (tablet) · 77:106876 (mobile) */
export const diamondShapes: DiamondShape[] = [
	{
		key: 'round',
		label: 'Round',
		href: '/products?uiShape=Round',
		d: { w: 58, h: 58, px: 8, py: 9, gap: 13 },
		t: { w: 38, h: 38, px: 6, py: 8, gap: 13 },
		m: { w: 38, h: 38, px: 6, py: 8, gap: 13 }
	},
	{
		key: 'oval',
		label: 'Oval',
		href: '/products?uiShape=Oval',
		d: { w: 50, h: 69.084, px: 12, py: 7, gap: 10 },
		t: { w: 30.21, h: 41.74, px: 6, py: 6, gap: 10 },
		m: { w: 30.21, h: 41.74, px: 6, py: 6, gap: 10 }
	},
	{
		key: 'radiant',
		label: 'Radiant',
		href: '/products?uiShape=Radiant',
		d: { w: 50, h: 65.723, px: 12, py: 7, gap: 11 },
		t: { w: 30, h: 39.434, px: 6, py: 7, gap: 11 },
		m: { w: 30, h: 39.434, px: 6, py: 7, gap: 11 }
	},
	{
		key: 'pear',
		label: 'Pear',
		href: '/products?uiShape=Pear',
		rot: 180,
		d: { w: 40, h: 69.805, px: 15, py: 6, gap: 11 },
		t: { w: 30, h: 45.354, px: 6, py: 6, gap: 10 },
		m: { w: 30, h: 45.354, px: 6, py: 6, gap: 10 }
	},
	{
		key: 'cushion',
		label: 'Cushion',
		href: '/products?uiShape=Cushion',
		d: { w: 58, h: 57.15, px: 10, py: 9, gap: 14 },
		t: { w: 40, h: 39.414, px: 6, py: 9, gap: 14 },
		m: { w: 40, h: 39.414, px: 6, py: 9, gap: 14 }
	},
	{
		key: 'princess',
		label: 'Princess',
		href: '/products?uiShape=Princess',
		d: { w: 50, h: 50, px: 9, py: 9, gap: 18 },
		t: { w: 35, h: 35, px: 6, py: 9, gap: 18 },
		m: { w: 35, h: 35, px: 6, py: 9, gap: 18 }
	},
	{
		key: 'asscher',
		label: 'Asscher',
		href: '/products?uiShape=Asscher',
		rot: -90,
		box: { w: 71, h: 57 },
		boxSm: { w: 43, h: 45 },
		d: { w: 56, h: 52.8, px: 10, py: 9, gap: 23 },
		t: { w: 35, h: 33, px: 5, py: 5, gap: 23 },
		m: { w: 35, h: 33, px: 5, py: 5, gap: 23 }
	},
	{
		key: 'emerald',
		label: 'Emerald',
		href: '/products?uiShape=Emerald',
		d: { w: 40, h: 65.001, px: 16, py: 7, gap: 12 },
		t: { w: 29.999, h: 37.501, px: 6, py: 7, gap: 12 },
		m: { w: 28, h: 35, px: 6, py: 7, gap: 12 }
	},
	{
		key: 'marquise',
		label: 'Marquise',
		href: '/products?uiShape=Marquise',
		d: { w: 37, h: 68.339, px: 15, py: 4, gap: 14 },
		t: { w: 30, h: 55.41, px: 6, py: 4, gap: 12 },
		m: { w: 24, h: 44.328, px: 6, py: 4, gap: 12 }
	},
	{
		key: 'heart',
		label: 'Heart',
		href: '/products?uiShape=Heart',
		d: { w: 70, h: 62.797, px: 9, py: 11, gap: 9 },
		t: { w: 45, h: 40.37, px: 6, py: 11, gap: 9 },
		m: { w: 40, h: 35.884, px: 6, py: 11, gap: 9 }
	}
]

export interface TrustBadge {
	key: 'delivery' | 'moneyback' | 'support'
	label: string
	icon: string
	/** intrinsic SVG size — desktop; smaller breakpoints scale via CSS vars */
	d: { w: number; h: number }
	m: { w: number; h: number }
}

/** 1:5497 (desktop) · 63:40035 (tablet) · 77:106855 (mobile) */
export const trustBadges: TrustBadge[] = [
	{
		key: 'delivery',
		label: 'Free delivery from $350',
		icon: '/ryans-jewels/home/trust-delivery.svg',
		d: { w: 25.033, h: 15.283 },
		m: { w: 17.33, h: 10.58 }
	},
	{
		key: 'moneyback',
		label: 'Money back guarantee',
		icon: '/ryans-jewels/home/trust-moneyback.svg',
		d: { w: 18.2, h: 20.8 },
		m: { w: 16.375, h: 18.714 }
	},
	{
		key: 'support',
		label: '24/7 Support service',
		icon: '/ryans-jewels/home/trust-support.svg',
		d: { w: 21.16, h: 21.234 },
		m: { w: 16.927, h: 16.986 }
	}
]

/**
 * Metal swatch fills from the product card (1:5672-1:5674). These describe the
 * theme's *presentation* of a metal option — which option values a product
 * actually has still comes from the API.
 */
export const metalSwatchFills: Record<string, string> = {
	gold: 'linear-gradient(220.6deg, rgb(255,194,0) 28.66%, rgb(255,228,143) 38.953%, rgb(255,194,0) 49.415%, rgb(255,194,0) 70.844%)',
	rose: 'linear-gradient(218.66deg, rgba(255,102,102,0.5) 27.778%, rgb(255,234,234) 38.535%, rgb(255,185,185) 48.89%, rgb(255,144,144) 71.864%)',
	silver:
		'linear-gradient(220.6deg, rgb(232,232,232) 28.66%, rgb(255,255,255) 38.953%, rgb(239,239,239) 48.862%, rgb(232,232,232) 70.844%)'
}

/** Maps an API option value onto one of the three designed swatch fills. */
export function metalSwatchKey(value: string): keyof typeof metalSwatchFills | null {
	const v = String(value || '').toLowerCase()
	if (/rose|pink/.test(v)) return 'rose'
	if (/white|silver|platinum|steel/.test(v)) return 'silver'
	if (/gold|yellow|brass/.test(v)) return 'gold'
	return null
}

/** Filter tabs above the product grids — 1:5656 / 63:40188 / 77:107013. */
export const productFilters = [
	{ label: 'All', href: '/products' },
	{ label: 'Rings', href: '/products?search=rings' },
	{ label: 'Pendants', href: '/products?search=pendants' },
	{ label: 'Earrings', href: '/products?search=earrings' }
]

/**
 * Shape marquee items — 1:5757 (desktop) · 63:40436 (tablet) · 77:107114 (mobile).
 * `hd` / `hm` are the icon heights from the source; widths follow the SVG's own
 * aspect ratio so a single height per breakpoint reproduces the geometry.
 */
export interface MarqueeShape {
	key: string
	label: string
	hd: number
	hm: number
	rot?: number
}

export const marqueeShapes: MarqueeShape[] = [
	{ key: 'emerald', label: 'Emerald Jewellery', hd: 40, hm: 26.667 },
	{ key: 'oval', label: 'Ovel Jewellery', hd: 40.069, hm: 27.634 },
	{ key: 'radiant', label: 'Radiant Jewellery', hd: 40, hm: 26.856 },
	{ key: 'pear', label: 'Pear Jewellery', hd: 40, hm: 33.019, rot: 180 },
	{ key: 'cushion', label: 'Cushion Jewellery', hd: 36.94, hm: 26.102 },
	{ key: 'princess', label: 'Princes Jewellery', hd: 34.49, hm: 25.49 },
	{ key: 'asscher', label: 'Asscher Jewellery', hd: 35.818, hm: 26.818, rot: -90 },
	{ key: 'heart', label: 'Heart Jewellery', hd: 33.203, hm: 23.335 }
]

/** Tagline marquee — 1:5870 (desktop) · 63:40617 (tablet) · 77:107439 (mobile). */
export const marqueeTaglines = [
	'Where Elegance Meets Excellence',
	'Timeless Beauty, Crafted to Perfection',
	'Discover The Art Of Luxury'
]

/**
 * Section 7 — "Designed with rare passion".
 * desktop 1:5871 / 1:6177 / 1:5873 · tablet 63:40291 · mobile 77:107227
 *
 * Icon boxes differ per breakpoint (the source scales the instance, it does not
 * scale uniformly), so each stat carries its own d/t/m size.
 */
export interface PassionStat {
	key: string
	icon: string
	value: string
	label: string
	d: { w: number; h: number }
	t: { w: number; h: number }
	m: { w: number; h: number }
}

export const passionStats: PassionStat[] = [
	{
		key: 'design',
		icon: '/ryans-jewels/home/stat-pen-tool.svg',
		value: '260+',
		label: 'Product design',
		d: { w: 44, h: 44 },
		t: { w: 45, h: 45 },
		m: { w: 35, h: 35 }
	},
	{
		key: 'review',
		icon: '/ryans-jewels/home/stat-clipboard.svg',
		value: '30k',
		label: 'Product Review',
		d: { w: 40, h: 44 },
		t: { w: 42, h: 46 },
		m: { w: 35, h: 38 }
	},
	{
		key: 'experience',
		icon: '/ryans-jewels/home/stat-timer.svg',
		value: '15+',
		label: 'Years of Experience',
		d: { w: 44, h: 44 },
		t: { w: 45, h: 45 },
		m: { w: 35, h: 35 }
	}
]

export const rarePassion = {
	eyebrow: 'About us',
	/** Rendered with `text-transform: capitalize`, exactly as the source frame does. */
	heading: 'Designed with zist core passion',
	/** Paragraph 1 is a single text node with one bold run (1:6182). */
	leadBefore:
		'We believe that every woman deserves the brilliance of a diamond — not just as a luxury, but as a right. We’re redefining what it means to own diamond jewellery by offering high-quality, sustainable, and accessible ',
	leadStrong: 'lab-grown diamond',
	leadAfter: ' pieces that are as ethical as they are elegant.',
	body: 'We believe that every woman deserves the brilliance of a diamond — not just as a luxury, but as a right.',
	image: '/ryans-jewels/home/passion-card.webp',
	imageAlt: 'Hands wearing Ryan Jewelers emerald and diamond rings',
	badge: {
		shape: '/ryans-jewels/home/passion-badge.svg',
		value: '30%',
		label: 'Off'
	},
	stats: passionStats
}

/** Section 8 head copy — 1:6005 (desktop) · 63:40326 (tablet) · 77:107264 (mobile). */
export const bestSellers = {
	eyebrow: "Our Product's",
	/** Rendered with `text-transform: capitalize`, exactly as the source does. */
	title: 'our best sellers products',
	emptyText: 'Our best sellers are on their way. Please check back shortly.'
}

/**
 * Section 9 — "Create your personalised name Plate!".
 * desktop 1:6110 (bg) / 1:6111 (panel) / 1:6127 (head) / 1:6133,1:6161,1:6147 (cards)
 * tablet 63:40549 · mobile 77:107373 (panel) + 77:107388 (head + cards)
 *
 * These tiles are theme-owned customisation promos, not a product list.
 */
export interface NamePlateCard {
	key: string
	image: string
	imageAlt: string
	name: string
	category: string
	rating: number
	cta: string
	href: string
	/** Figma image placement inside the rounded well (percent of the well). */
	crop: { left: number; top: number; width: number }
	/** Text column width from the source (1:6135 / 1:6163 / 1:6149). */
	textWidth: number
}

export const namePlateCards: NamePlateCard[] = [
	{
		key: 'kayla',
		image: '/ryans-jewels/home/nameplate-card-1.webp',
		imageAlt: 'Diamond-set name plate pendant reading Kayla',
		name: 'Yellow gold frams50013',
		category: 'wedding rings',
		rating: 5.5,
		cta: 'Customise now',
		href: '/products',
		crop: { left: -3.61, top: -5.45, width: 109.31 },
		textWidth: 178
	},
	{
		key: 'laura',
		image: '/ryans-jewels/home/nameplate-card-2.webp',
		imageAlt: 'Diamond-set name plate pendant reading Laura',
		name: 'Rose gold frams50013',
		category: 'wedding rings',
		rating: 5.5,
		cta: 'Customise now',
		href: '/products',
		crop: { left: -3.75, top: -3.62, width: 109.31 },
		textWidth: 178
	},
	{
		key: 'third',
		image: '/ryans-jewels/home/nameplate-card-3.webp',
		imageAlt: 'Diamond-set personalised name plate pendant',
		name: 'Yellow gold frams50013',
		category: 'wedding rings',
		rating: 5.5,
		cta: 'Customise now',
		href: '/products',
		crop: { left: -3.56, top: -0.15, width: 109.31 },
		textWidth: 178
	},
	{
		key: 'martin',
		image: '/ryans-jewels/home/nameplate-word.webp',
		imageAlt: 'Diamond-set name plate reading Martin',
		name: 'Rose gold frams50013',
		category: 'wedding rings',
		rating: 5.5,
		cta: 'Customise now',
		href: '/products',
		crop: { left: -3.75, top: 0, width: 109.31 },
		textWidth: 178
	}
]

export const namePlate = {
	/** 1:6110 — near-white gradient behind the whole 1440×600 band. */
	background: '/ryans-jewels/home/nameplate-bg.jpg',
	panel: {
		/** 1:6111 — deep violet gradient, radius 5 on the right corners. */
		background: '/ryans-jewels/home/nameplate-panel.webp',
		heading: 'Create your personalised name Plate!',
		art: '/ryans-jewels/home/nameplate-word.webp',
		artAlt: 'Diamond-set name plate spelling Martin',
		cta: 'Customise now',
		href: '/products'
	},
	eyebrow: 'Top rated collection',
	title: 'Create a one-of-a -kind piece.',
	ctaLabel: 'customise now',
	ctaHref: '/products',
	cards: namePlateCards
}

/**
 * Section 11 — lookbook image + countdown + 2×3 product grid.
 * desktop 1:6474 (head) / 1:6175 (image) / 1:5886 (grid)
 * tablet 63:40805 · mobile 77:107447
 *
 * The source freezes the timer at 21:59:08:08. `offerEndsAt` drives a real
 * countdown instead — set it to the campaign's actual end date.
 */
export const lookbook = {
	eyebrow: 'New Connection',
	title: 'our best sellers products',
	/** TODO: replace with the real campaign end date. */
	offerEndsAt: '2026-12-31T23:59:59Z',
	countdownLabels: ['Day', 'Hours', 'Minutes', 'Secound'],
	shopNowLabel: 'Shop now',
	shopNowHref: '/products',
	image: '/ryans-jewels/home/lookbook-side.jpg',
	imageAlt: 'Model wearing a Ryan Jewelers diamond tennis necklace and rings',
	emptyText: 'This collection is on its way. Please check back shortly.'
}

/**
 * Section 12 — wide "Glamorous Gifts" banner.
 * desktop 1:6201 (60,5124 · 1320×360, radius 5)
 * tablet 63:40625 (full-bleed 744×202) · mobile 77:107518 (full-bleed 412×133)
 */
export const wideBanner = {
	eyebrow: 'Glamorous Gifts',
	heading: 'Redefining Elegance with Unique Charms',
	subheading: 'Our Collection, Your Timeless Elegance',
	ctaLabel: 'Know more',
	ctaHref: '/products',
	background: '/ryans-jewels/home/banner-bg.jpg',
	image: '/ryans-jewels/home/banner-model.png',
	imageAlt: 'Model wearing layered diamond necklaces'
}

/**
 * Section 13 — "TRENDING COLLECTION".
 * desktop 1:6213 (heading) + 1:6217 (bar + grid)
 * tablet 63:40637 + 63:40641 · mobile 77:107531 + 77:107535
 */
export const trending = {
	heading: 'Trending Collection',
	catalogLabel: 'View full catalog',
	catalogHref: '/products',
	emptyText: 'Trending pieces are on their way. Please check back shortly.'
}

/**
 * Section 14 — "Create Your Signature Piece" enquiry form.
 * desktop 1:6426 (head) / 1:6455 / 1:6463 / 1:6459 / 1:6467 / 1:6319
 * tablet 63:40742 · mobile 77:107636
 *
 * Desktop leads with the logo mark on a white ground; tablet and mobile swap in
 * the gold diamond cluster over the marble/ribbon plate. Both are the source's
 * own per-breakpoint choices, not an app-side decision.
 */
export const enquiry = {
	title: 'Create Your Signature Piece',
	subtitle: 'Customise your Own Orders',
	logo: '/ryans-jewels/logo.webp',
	background: '/ryans-jewels/home/marble-bg.jpg',
	nameLabel: 'First name',
	namePlaceholder: 'Enter name',
	contactLabel: 'Email & Mobile number',
	contactPlaceholder: 'Enter email & mobile number',
	descriptionLabel: 'Add Description',
	descriptionPlaceholder: 'Write a Description',
	/** 1:6467 — three upload wells. */
	uploadCount: 3,
	uploadHint: 'Add a reference image',
	submitLabel: 'SUBMIT',
	successMessage: 'Enquiry submitted successfully'
}

/**
 * Section 15 — "Frequently Asking Questions".
 * desktop 1:6431 (bg 1:6318, content 1:6434) · tablet 63:40782 · mobile 77:107676
 *
 * The source shows the accordion collapsed only, so it carries no answer copy.
 * The answers below are factual placeholders so the accordion actually works —
 * they should be reviewed and replaced with the client's own wording.
 */
export const faq = {
	heading: 'Frequently Asking Questions',
	intro:
		'We believe true luxury lies in exceptional craftsmanship, timeless design, and conscious choices',
	sideImage: '/ryans-jewels/home/faq-side.webp',
	categories: [
		{ label: '1. Lab-Grown Diamonds -', href: '/faqs#lab-grown-diamonds' },
		{ label: '2. Why Customers Trust Us', href: '/faqs#why-customers-trust-us' },
		{ label: '3. Orders & Payments', href: '/faqs#orders-and-payments' },
		{ label: '4. Return & Exchange', href: '/faqs#return-and-exchange' },
		{ label: '5. Certification', href: '/faqs#certification' }
	],
	items: [
		{
			id: 'what-are-lab-grown',
			question: 'What are lab-grown diamonds?',
			/** TODO: confirm this wording with the client. */
			answer:
				'Lab-grown diamonds are created in controlled conditions that reproduce the heat and pressure under which diamonds form in the earth. They have the same carbon crystal structure as mined diamonds.'
		},
		{
			id: 'are-they-real',
			question: 'Are lab-grown diamonds real diamonds?',
			answer:
				'Yes. They are chemically, physically and optically identical to mined diamonds, and are graded on the same colour, cut, clarity and carat scale.'
		},
		{
			id: 'benefits',
			question: 'What are the benefits of choosing lab-grown diamonds?',
			answer:
				'They offer the same brilliance and durability with a traceable origin and a lower environmental footprint, which usually means a larger or higher-grade stone for the same budget.'
		}
	]
}

export const ryansJewelsHome = {
	hero: {
		video: '/ryans-jewels/home/hero.mp4',
		image: '/ryans-jewels/home/hero-desktop.webp',
		mobileImage: '/ryans-jewels/home/hero-mobile.webp',
		imageAlt: 'Ryan Jewelers diamond engagement ring',
		href: '/products',
		/** static slide counter shown in the source (1:5513 / 63:40050 / 77:106851) */
		slideLabel: '1/4'
	},
	trust: trustBadges,
	perfectCut: {
		heading: 'FIND YOUR PERFECT CUT',
		shapes: diamondShapes
	},
	passion: rarePassion,
	/** floating help widget, 1:6500 */
	chat: {
		label: 'How can i help you?',
		logo: '/ryans-jewels/logo.webp',
		href: '/contact-us'
	}
}

export type RyansJewelsHome = typeof ryansJewelsHome
