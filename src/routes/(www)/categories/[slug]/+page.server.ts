import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types.js'

const catalogFilters: Record<string, [string, string]> = {
	'lab-grown-diamond': ['search', 'lab grown diamond'],
	rings: ['categories', 'engagement'],
	engagement: ['categories', 'engagement'],
	bracelets: ['search', 'bracelets'],
	earrings: ['search', 'earrings'],
	pendants: ['search', 'pendants']
}

export const load: PageServerLoad = (event) => {
	if (/(^|-)(kids?|sarees?)(-|$)/i.test(event.params.slug)) redirect(307, '/categories')

	const destination = new URL('/products', event.url)
	for (const [key, value] of event.url.searchParams) destination.searchParams.set(key, value)
	const [key, value] = catalogFilters[event.params.slug] || ['categories', event.params.slug]
	destination.searchParams.set(key, value)
	const type = destination.searchParams.get('type')
	if (type) {
		destination.searchParams.delete('type')
		destination.searchParams.set('search', type.replaceAll('-', ' '))
	}
	const shape = destination.searchParams.get('shape')
	if (shape) {
		destination.searchParams.delete('shape')
		destination.searchParams.set(
			'uiShape',
			shape.replace(/\b\w/g, (letter) => letter.toUpperCase())
		)
	}
	destination.searchParams.set(
		'catalog',
		event.params.slug.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
	)
	redirect(307, `${destination.pathname}${destination.search}`)
}
