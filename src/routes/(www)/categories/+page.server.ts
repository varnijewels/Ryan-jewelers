import { wwwCategoriesLoadServer } from '$lib/core/load-functions/index.js'
import { isRyanCategoryVisible } from '$lib/theme/ryans-jewels/product-filters.js'

export const load = async (event: any) => {
	const data = await wwwCategoriesLoadServer(event)
	const parent = await event.parent()
	if (parent?.theme?.name !== 'ryans-jewels') return data

	return {
		...data,
		categories: (data.categories || []).filter(isRyanCategoryVisible).map((category: any) => ({
			...category,
			children: (category.children || []).filter(isRyanCategoryVisible)
		}))
	}
}
