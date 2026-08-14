import { wwwSlugLoad } from '$lib/core/load-functions/index.js'
import { realCatalogUrl } from '$lib/theme/ryans-jewels/product-filters.js'

export const load = (event: any) => wwwSlugLoad({ ...event, url: realCatalogUrl(event.url) })
