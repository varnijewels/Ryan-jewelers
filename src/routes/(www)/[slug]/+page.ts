import { wwwSlugLoad } from '$lib/core/load-functions/index.js'
import { realCatalogUrl } from '$lib/theme/ryans-jewels/product-filters.js'
import { isMissingCatalogPage } from '$lib/theme/ryans-jewels/seo.js'
import { error } from '@sveltejs/kit'

export const load = async (event: any) => {
	const data = await wwwSlugLoad({ ...event, url: realCatalogUrl(event.url) })
	if (isMissingCatalogPage(data)) error(404, 'Page not found')
	return data
}
