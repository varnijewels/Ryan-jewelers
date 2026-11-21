/**
 * Theme-owned header content for the "ryans-jewels" storefront theme.
 *
 * Everything here is static design copy taken from the Figma source
 * (Design System / "Login menu" + "Without Login", node 1:5408). Live commerce
 * data (cart qty, user, search results) stays with the app/API layer.
 */

export interface RyansJewelsNavLink {
	label: string
	href: string
	dropdown?: boolean
}

export interface RyansJewelsNavContent {
	brandName: string
	logo: string
	utility: {
		findStore: RyansJewelsNavLink
		help: RyansJewelsNavLink
		trackOrder: RyansJewelsNavLink
		dailyDeals: RyansJewelsNavLink
		giftCard: RyansJewelsNavLink | null
		helpContact: RyansJewelsNavLink
		postalCodeLabel: string
		countryCode: string
		language: string
	}
	searchLabel: string
	searchPlaceholder: string
	announcements: { message: string; link: RyansJewelsNavLink }[]
	orderReturn: { top: string; bottom: string; href: string }
	cartLabel: string
	account: {
		greeting: string
		greetingLoggedIn: string
		signIn: string
		divider: string
		register: string
	}
	information: RyansJewelsNavLink[]
	home: RyansJewelsNavLink
	offers: RyansJewelsNavLink
}

export const ryansJewelsNavContent: RyansJewelsNavContent = {
	brandName: 'Ryan Jewelers',
	logo: '/ryans-jewels/logo.webp',
	utility: {
		findStore: { label: 'Find a Store', href: '/contact-us' },
		help: { label: 'Help', href: '/shipping-policy' },
		trackOrder: { label: 'Track Order', href: '/order-tracking' },
		dailyDeals: { label: 'Daily Deals', href: '/products?sort=discount' },
		giftCard: { label: 'Gift Card', href: '/products?search=gift+card' },
		helpContact: { label: 'Help & Contact', href: '/contact-us' },
		postalCodeLabel: 'Enter postal code',
		countryCode: 'US',
		language: 'English'
	},
	searchLabel: 'Search',
	searchPlaceholder: 'Search diamonds, rings, and more',
	announcements: [
		{
			message: 'Discover lab grown diamonds & fine jewelry',
			link: { label: 'Shop Offers', href: '/best-offers' }
		},
		{
			message: 'Create your perfect ring with Ring Builder',
			link: { label: 'Build Your Ring', href: '/ring-builder' }
		},
		{
			message: 'Explore rings, earrings, necklaces & more',
			link: { label: 'Shop Jewelry', href: '/products' }
		},
		{
			message: 'Explore our jewelry care and design services',
			link: { label: 'Explore Services', href: '/services' }
		}
	],
	orderReturn: { top: 'Order', bottom: '& Return', href: '/shipping-policy' },
	cartLabel: 'Bag',
	account: {
		greeting: 'Hello!',
		greetingLoggedIn: 'Hello! Good Morning',
		signIn: 'Sign in',
		divider: ' or ',
		register: 'register'
	},
	information: [
		{ label: 'About Us', href: '/about-us' },
		{ label: 'Contact Us', href: '/contact-us' }
	],
	home: { label: 'Home', href: '/' },
	offers: { label: 'Best Offers', href: '/best-offers' }
}
