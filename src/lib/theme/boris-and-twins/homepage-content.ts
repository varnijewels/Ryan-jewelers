import { defaultContent } from '../default/homepage-content.js'
import type { ThemeHomepageContent } from '../types.js'

const IMG = '/boris-and-twins/images'

export const borisAndTwinsContent: ThemeHomepageContent = {
	...defaultContent,
	brandName: 'Boris & Twins',
	description: 'Golden Legacy — fine jewelry crafted for every day and every occasion.',
	seoTitle: 'Boris & Twins — Golden Legacy Fine Jewelry',
	seoImage: `${IMG}/Home-benner/Home Banner 18.jpg`,
	hero: {
		...defaultContent.hero,
		badge: 'Golden Legacy',
		titleLead: 'GOLDEN',
		titleAccent: 'LEGACY',
		titleRest: '',
		text: 'Their timeless appeal makes them the perfect accessory for any occasion, from casual wear to formal events.',
		primaryCta: 'Shop Jewelry',
		secondaryCta: 'Watch now',
		bgText: 'Boris & Twins',
		image: `${IMG}/Home-benner/Home Banner 18.jpg`,
		imageAlt: 'Model wearing the Golden Legacy signature jewelry collection'
	},
	// Explore signature collection tiles (theme-owned, links point at catalogue)
	category: {
		...defaultContent.category,
		label: 'Explore Our Signature',
		titleLead: 'Explore Our Signature',
		titleAccent: 'Collection',
		text: 'Discover the pieces our clients love most.',
		emptyTitle: 'No categories available',
		emptyText: 'Categories will appear here when they are returned by the API.'
	},
	menu: {
		...defaultContent.menu,
		label: 'Our Most loved Design',
		titleLead: 'Our Most loved',
		titleAccent: 'Design',
		emptyTitle: 'No products available',
		emptyText: 'Products will appear here when they are returned by the API.',
		cta: 'See More'
	},
	newsletter: {
		...defaultContent.newsletter,
		label: 'Join the list',
		titleLead: 'Sparkle in your',
		titleAccent: 'inbox',
		text: 'Sign up for early access to new drops, private sales, and styling notes.',
		cta: 'Subscribe',
		privacy: 'No spam, unsubscribe anytime.'
	},
	footer: {
		logoAlt: 'Boris & Twins',
		columns: [
			{
				title: 'Shop',
				links: [
					{ label: 'Rings', href: '/products?q=ring' },
					{ label: 'Chains', href: '/products?q=chain' },
					{ label: 'Pendants', href: '/products?q=pendant' },
					{ label: 'Earrings', href: '/products?q=earring' }
				]
			},
			{
				title: 'Customer Care',
				links: [
					{ label: 'Contact Us', href: '/p/contact-us' },
					{ label: 'Shipping Policy', href: '/p/shipping-policy' },
					{ label: 'Refund Policy', href: '/p/refund-policy' },
					{ label: 'Privacy Policy', href: '/p/privacy-policy' }
				]
			},
			{
				title: 'Follow',
				links: [
					{ label: 'Instagram', href: '/' },
					{ label: 'Facebook', href: '/' },
					{ label: 'Pinterest', href: '/' }
				]
			}
		],
		copyright: '© Boris & Twins. All rights reserved.'
	},
	contact: {
		...defaultContent.contact,
		label: 'Customer Care',
		titleLead: 'Contact',
		titleAccent: 'Boris & Twins',
		text: 'Reach out for order, shipping, or styling assistance.'
	},
	defaultHome: {
		eyebrow: 'Golden Legacy',
		primaryCta: 'Shop Jewelry',
		secondaryCta: 'Explore Collections',
		featuredLabel: 'Our Most loved Design',
		featuredTitle: 'Boris & Twins Jewelry',
		emptyTitle: 'No products available',
		emptyText: 'Products will appear here when they are returned by the API.'
	}
}
