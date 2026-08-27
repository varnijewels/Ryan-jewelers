import { describe, expect, it } from 'vitest'
import { isCollectionGroup, menuChildren, menuGroups, menuHref, mobileMenuView, resolveAdminMenu, tabletMenuView } from '../src/lib/theme/ryans-jewels/admin-menu.js'

describe('Ryan admin menu', () => {
	it('prefers admin categories and uses header links only as fallback', () => {
		const home = { name: 'Home', slug: 'home' }
		const rings = { name: 'Rings', slug: 'rings', children: [{ name: 'Diamond Rings' }] }
		const contact = { name: 'Contact', link: '/contact-us', items: [{ name: 'Support' }] }
		const resolved = resolveAdminMenu([rings, home], [contact], { label: 'Home', href: '/' }, [])

		expect(resolved).toEqual({ home, items: [rings] })
		expect(resolveAdminMenu([], [contact], { label: 'Home', href: '/' }, [])).toEqual({
			home: { label: 'Home', href: '/' },
			items: [contact]
		})
		expect(menuChildren(contact)).toEqual(contact.items)
	})

	it('recognizes the admin and Figma collection heading variants', () => {
		expect(['Brows By Collection', 'Browse By Collection', 'Browser By Collection'].every((name) => isCollectionGroup({ name }))).toBe(true)
	})

	it('routes admin categories to the working product catalogue', () => {
		expect(menuHref({ name: 'Rings', slug: 'rings' })).toBe('/products?categories=engagement')
		expect(menuHref({ name: 'Bracelets', link: '/categories/bracelets' })).toBe('/products?search=Bracelets')
		expect(menuHref({ name: 'Popular Earring Types', link: '/categories/popular-earring-types' })).toBe('/products?search=Popular%20Earring%20Types')
		expect(menuHref({ name: 'All Diamond Jewellery', slug: 'all-diamond-jewellery' })).toBe('/products?search=diamond')
		expect(menuHref({ name: 'Home', slug: 'home' })).toBe('/')
		expect(menuHref({ name: 'Rings', slug: 'rings', link: '/custom' })).toBe('/custom')
	})

	it('selects the matching tablet submenu', () => {
		expect(['Lab Grown Diamond', 'All Diamond Jewellery', 'Earrings', 'Rings'].map(tabletMenuView)).toEqual([
			'lab',
			'all-diamond',
			'earrings',
			null
		])
	})

	it('selects the category submenus only for mobile', () => {
		expect(mobileMenuView('Bracelets')).toBe('bracelets')
		expect(mobileMenuView('Pendants')).toBe('pendants')
		expect(mobileMenuView('Engagement Rings')).toBe('engagement-rings')
		expect(mobileMenuView('Rings')).toBeNull()
	})

	it('keeps Browse By Collection last in every mega menu', () => {
		expect(menuGroups({ children: [{ name: 'Shapes' }, { name: 'Browser By Collection' }, { name: 'Popular Types' }] }).map(({ name }) => name)).toEqual([
			'Shapes',
			'Popular Types',
			'Browser By Collection'
		])
		expect(menuGroups({ children: [{ name: 'New Category' }] }).map(({ name }) => name)).toEqual(['New Category', 'Browser By Collection'])
	})
})
