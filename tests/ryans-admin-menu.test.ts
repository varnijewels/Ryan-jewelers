import { describe, expect, it } from 'vitest'
import { menuChildren, resolveAdminMenu } from '../src/lib/theme/ryans-jewels/admin-menu.js'

describe('Ryan admin menu', () => {
	it('uses admin categories and header links while keeping Home separate', () => {
		const home = { name: 'Home', slug: 'home' }
		const rings = { name: 'Rings', slug: 'rings', children: [{ name: 'Diamond Rings' }] }
		const contact = { name: 'Contact', link: '/contact-us', items: [{ name: 'Support' }] }
		const resolved = resolveAdminMenu([rings, home], [contact], { label: 'Home', href: '/' }, [])

		expect(resolved).toEqual({ home, items: [rings, contact] })
		expect(menuChildren(contact)).toEqual(contact.items)
	})
})
