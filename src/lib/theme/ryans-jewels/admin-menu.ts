export type AdminMenuItem = {
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
export const menuHref = (item: AdminMenuItem) => item.link || item.href || (item.slug ? `/${item.slug}` : '/products')
export const menuChildren = (item: AdminMenuItem) => item.children || item.items || []

export function resolveAdminMenu(
	categories: AdminMenuItem[] = [],
	headerLinks: AdminMenuItem[] = [],
	fallbackHome: AdminMenuItem,
	fallbackItems: AdminMenuItem[]
) {
	const managedItems = [...categories, ...headerLinks]
	if (!managedItems.length) return { home: fallbackHome, items: fallbackItems }

	const home = managedItems.find((item) => item.slug === 'home' || item.name?.toLowerCase() === 'home')
	return { home: home || fallbackHome, items: managedItems.filter((item) => item !== home) }
}
