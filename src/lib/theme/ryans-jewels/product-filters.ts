export const clientFilterKeys = ['uiStatus', 'uiMaterial', 'uiShape', 'uiQuality', 'uiWeight']
export const clientSorts = new Set(['rating:desc', 'title:asc', 'title:desc'])

export function facetOptions(allFilters: Record<string, Record<string, number>> | undefined, keys: string[], fallback?: RegExp) {
	const options = new Map<string, number>()
	for (const key of keys) {
		for (const [name, count] of Object.entries(allFilters?.[key] || {})) {
			options.set(name, Math.max(options.get(name) || 0, Number(count) || 0))
		}
	}
	if (!options.size && fallback) {
		for (const [name, count] of Object.entries(allFilters?.['tags.name'] || {})) {
			if (fallback.test(name)) options.set(name, Number(count) || 0)
		}
	}
	return [...options].map(([name, count]) => ({ name, count }))
}

function selectedValues(url: URL, key: string) {
	const value = url.searchParams.get(key)
	if (!value) return []
	try {
		return decodeURIComponent(value).split(',').filter(Boolean)
	} catch {
		return value.split(',').filter(Boolean)
	}
}

function normalized(value: unknown) {
	return String(value ?? '').toLowerCase().replace(/[^a-z0-9.]+/g, ' ').trim()
}

function rating(product: any) {
	if (Array.isArray(product.ratings) && product.ratings.length) {
		return product.ratings.reduce((sum: number, item: any) => sum + Number(item.rating || 0), 0) / product.ratings.length
	}
	return Number(product.averageRating || product.rating || 0)
}

function matchesMetadata(product: any, values: string[]) {
	if (!values.length) return true
	const haystack = normalized(JSON.stringify(product))
	return values.some((value) => normalized(value.replace(/\(\d+\)$/, '')).split(' ').every((word) => haystack.includes(word)))
}

export function applyClientFilters(products: any[], url: URL) {
	const statuses = selectedValues(url, 'uiStatus')
	const filtered = products.filter((product) => {
		const text = normalized(JSON.stringify(product))
		const statusMatches = !statuses.length || statuses.some((status) => {
			if (status === 'In Stock') return Number(product.stock) > 0
			if (status === 'Out of stock') return Number(product.stock) <= 0
			if (status === 'Best seller') return Number(product.popularity) > 0 || text.includes('best seller')
			if (status === 'Top Rated') return rating(product) >= 4
			return Boolean(product.isFeatured || product.featured || text.includes('featured'))
		})

		return statusMatches
			&& matchesMetadata(product, selectedValues(url, 'uiMaterial'))
			&& matchesMetadata(product, selectedValues(url, 'uiShape'))
			&& matchesMetadata(product, selectedValues(url, 'uiQuality'))
			&& matchesMetadata(product, selectedValues(url, 'uiWeight'))
	})

	const sort = url.searchParams.get('uiSort')
	if (sort === 'rating:desc') return filtered.sort((a, b) => rating(b) - rating(a))
	if (sort === 'title:asc' || sort === 'title:desc') {
		const direction = sort === 'title:asc' ? 1 : -1
		return filtered.sort((a, b) => direction * String(a.title || a.name || '').localeCompare(String(b.title || b.name || '')))
	}
	return filtered
}
