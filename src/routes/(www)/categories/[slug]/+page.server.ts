import { wwwCategoriesSlugLoadServer } from '$lib/core/load-functions/index.js'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

const catalogRedirects: Record<string, string> = {
	'lab-grown-diamond': '/products?search=lab+grown+diamond',
	rings: '/products?categories=engagement',
	earrings: '/products?search=earrings',
	pendants: '/products?search=pendants'
}

export const load: PageServerLoad = (event) => {
	const destination = catalogRedirects[event.params.slug]
	if (destination) redirect(307, destination)
	return wwwCategoriesSlugLoadServer(event)
}
