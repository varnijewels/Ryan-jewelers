import { isRyanCategoryVisible } from './product-filters.js'

export type AdminMenuItem = {
	id?: string
	name?: string
	label?: string
	link?: string | null
	href?: string
	slug?: string | null
	thumbnail?: string | null
	description?: string | null
	children?: AdminMenuItem[]
	items?: AdminMenuItem[]
}

export const menuLabel = (item: AdminMenuItem) => item.name || item.label
export const menuHref = (item: AdminMenuItem) => {
	const href = item.link || item.href
	if (href) return href
	if (item.slug === 'home') return '/'
	if (item.slug) return `/categories/${item.slug}`
	const label = menuLabel(item)?.trim() || item.slug?.replaceAll('-', ' ')
	if (!label) return '/products'
	return `/products?search=${encodeURIComponent(/^all diamond jewel(?:lery|ry)$/i.test(label) ? 'diamond' : label)}&catalog=${encodeURIComponent(label)}`
}
export const menuChildren = (item: AdminMenuItem) => (item.children || item.items || []).filter(isRyanCategoryVisible)
export const tabletMenuView = (label = '') =>
	/lab grown diamond/i.test(label)
		? 'lab'
		: /^all\s+diamond\s+jewel(?:lery|ry)$/i.test(label.trim())
			? 'all-diamond'
			: /^earrings?$/i.test(label.trim())
				? 'earrings'
				: null
export const mobileMenuView = (label = '') =>
	/^bracelets?$/i.test(label.trim())
		? 'bracelets'
		: /^pendants?$/i.test(label.trim())
			? 'pendants'
			: /^engagement rings?$/i.test(label.trim())
				? 'engagement-rings'
				: null
export const isCollectionGroup = (item: AdminMenuItem) => /^brows(?:e|er)? by collection$/i.test(menuLabel(item)?.trim() || '')
export const menuGroups = (item: AdminMenuItem) => {
	const groups = [...menuChildren(item)]
	if (!groups.some(isCollectionGroup)) groups.push({ name: 'Browser By Collection' })
	return groups.sort((a, b) => Number(isCollectionGroup(a)) - Number(isCollectionGroup(b)))
}

export function resolveAdminMenu(
	categories: AdminMenuItem[] = [],
	headerLinks: AdminMenuItem[] = [],
	fallbackHome: AdminMenuItem,
	fallbackItems: AdminMenuItem[]
) {
	const managedItems = categories.length ? categories : headerLinks
	if (!managedItems.length) return { home: fallbackHome, items: fallbackItems }

	const home = managedItems.find((item) => item.slug === 'home' || item.name?.toLowerCase() === 'home')
	return { home: home || fallbackHome, items: managedItems.filter((item) => item !== home && isRyanCategoryVisible(item)) }
}
