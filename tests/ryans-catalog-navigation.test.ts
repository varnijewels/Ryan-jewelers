import { describe, expect, it } from 'vitest'
import { catalogNavigation, catalogMegaMenu } from '../src/lib/theme/ryans-jewels/catalog-navigation.js'

describe('Ryan CSV navigation', () => {
	it('exposes all five categories and 33 subcategories on desktop and mobile', () => {
		expect(catalogNavigation.map((category) => category.name)).toEqual(['Rings', 'Earrings', 'Pendants', 'Bracelets', 'Necklaces'])
		expect(catalogNavigation.flatMap((category) => category.children)).toHaveLength(33)
		for (const category of catalogNavigation) {
			const desktop = catalogMegaMenu.find((item) => item.name === category.name)
			expect(desktop?.children?.flatMap((group) => group.children || [])).toEqual(category.children)
		}
	})

	it('includes new solitaire pendants and keeps necklace searches distinct', () => {
		const pendants = catalogNavigation.find((category) => category.name === 'Pendants')!
		const solitaire = pendants.children.find((item) => item.name === 'Solitaire Pendants')!
		expect(new URL(solitaire.href, 'https://shop.test').searchParams.get('categories')?.split(',')).toContain('pendants-solitaire-pendants')
		for (const category of catalogNavigation) {
			for (const item of category.children) {
				const url = new URL(item.href, 'https://shop.test')
				expect(url.searchParams.getAll('search').length).toBeLessThanOrEqual(1)
				if (category.name === 'Necklaces') expect(url.searchParams.get('search')).toBe(item.name)
			}
		}
	})
})
