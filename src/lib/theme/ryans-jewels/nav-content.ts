/**
 * Theme-owned header content for the "ryans-jewels" storefront theme.
 *
 * Everything here is static design copy taken from the Figma source
 * (Design System / "Login menu" + "Without Lohin", node 1:5408). Live commerce
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
		dailyDeals: RyansJewelsNavLink
		giftCard: RyansJewelsNavLink | null
		helpContact: RyansJewelsNavLink
		postalCodeLabel: string
		countryCode: string
		language: string
	}
	searchPlaceholder: string
	orderReturn: { top: string; bottom: string; href: string }
	cartLabel: string
	account: {
		greeting: string
		greetingLoggedIn: string
		signIn: string
		divider: string
		register: string
	}
	home: RyansJewelsNavLink
	menu: RyansJewelsNavLink[]
	offers: RyansJewelsNavLink
}

export const ryansJewelsNavContent: RyansJewelsNavContent = {
	brandName: 'Ryan Jewelers',
	logo: '/ryans-jewels/logo.webp',
	utility: {
		dailyDeals: { label: 'Daily Deals', href: '/products?sort=discount' },
		giftCard: { label: 'Gift Card', href: '/products?search=gift+card' },
		helpContact: { label: 'Help & Contact', href: '/contact-us' },
		postalCodeLabel: 'Enter postal code',
		countryCode: 'IN',
		language: 'English'
	},
	searchPlaceholder: 'Search here',
	orderReturn: { top: 'Order', bottom: '& Return', href: '/shipping-policy' },
	cartLabel: 'Add Cart',
	account: {
		greeting: 'Hello!',
		greetingLoggedIn: 'Hello! Good Morning',
		signIn: 'Sign in',
		divider: ' or ',
		register: 'register'
	},
	home: { label: 'Home', href: '/' },
	menu: [
		{ label: 'Lab Grown Diamond', href: '/categories/lab-grown-diamond', dropdown: true },
		{ label: 'All Jewellery', href: '/products', dropdown: true },
		{ label: 'Rings', href: '/categories/rings' },
		{ label: 'Earrings', href: '/categories/earrings' },
		{ label: 'Customise', href: '/products' },
		{ label: 'About us', href: '/about-us' },
		{ label: 'Contact', href: '/contact-us' }
	],
	offers: { label: 'Best Offers', href: '/best-offers' }
}
