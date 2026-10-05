import { load as loadProducts } from '../products/+page.js'
import { realCatalogUrl } from '$lib/theme/ryans-jewels/product-filters.js'
import { isMissingCatalogPage } from '$lib/theme/ryans-jewels/seo.js'
import { error } from '@sveltejs/kit'

export const load = async (event: any) => {
	const url = realCatalogUrl(event.url)
	url.searchParams.set('categories', event.params.slug)
	const data = await loadProducts({ ...event, url })
	if (isMissingCatalogPage(data)) error(404, 'Page not found')
	return data
}
