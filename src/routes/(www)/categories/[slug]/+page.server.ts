import { redirect } from '@sveltejs/kit'
import { wwwProductsLoadServer } from '$lib/core/load-functions/index.js'

export const load = (event: any) => {
	if (/(^|-)(kids?|sarees?)(-|$)/i.test(event.params.slug)) redirect(308, '/categories')
	return wwwProductsLoadServer(event)
}
