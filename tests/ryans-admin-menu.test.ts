import { describe, expect, it } from 'vitest'
import { isCollectionGroup, menuChildren, menuGroups, menuHref, resolveAdminMenu, tabletMenuView } from '../src/lib/theme/ryans-jewels/admin-menu.js'

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

	it('routes admin category slugs through the category page', () => {
		expect(menuHref({ name: 'Rings', slug: 'rings' })).toBe('/categories/rings')
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

	it('keeps Browse By Collection last in every mega menu', () => {
		expect(menuGroups({ children: [{ name: 'Shapes' }, { name: 'Browser By Collection' }, { name: 'Popular Types' }] }).map(({ name }) => name)).toEqual([
			'Shapes',
			'Popular Types',
			'Browser By Collection'
		])
		expect(menuGroups({ children: [{ name: 'New Category' }] }).map(({ name }) => name)).toEqual(['New Category', 'Browser By Collection'])
	})
})
