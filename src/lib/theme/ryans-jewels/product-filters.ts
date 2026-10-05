export const clientFilterKeys = ['uiStatus', 'uiMaterial', 'uiShape', 'uiQuality', 'uiWeight', 'uiKarat', 'uiColor']
export const clientSorts = new Set(['rating:desc', 'title:asc', 'title:desc'])

const categoryCatalogFilters: Record<string, [string, string]> = {
	'lab-grown-diamond': ['search', 'lab grown diamond'],
	rings: ['categories', 'engagement,mens-rings-679,fancy-rings,color-stone-rings,religious-rings,eternity-bands'],
	engagement: ['categories', 'engagement'],
	bracelets: ['categories', 'bracelets'],
	earrings: ['categories', 'women'],
	pendants: ['categories', 'pendants'],
	necklaces: ['search', 'Necklaces']
}

export function realCatalogUrl(url: URL) {
	const filteredUrl = new URL(url)
	const categorySlug = filteredUrl.pathname.match(/^\/categories\/([^/]+)\/?$/)?.[1]
	if (categorySlug) {
		const [key, value] = categoryCatalogFilters[categorySlug] || ['categories', categorySlug]
		if (!filteredUrl.searchParams.has(key)) filteredUrl.searchParams.set(key, value)
		const type = filteredUrl.searchParams.get('type')
		if (type) {
			filteredUrl.searchParams.delete('type')
			filteredUrl.searchParams.set('search', type.replaceAll('-', ' '))
		}
		const shape = filteredUrl.searchParams.get('shape')
		if (shape) {
			filteredUrl.searchParams.delete('shape')
			filteredUrl.searchParams.set('uiShape', shape.replace(/\b\w/g, (letter) => letter.toUpperCase()))
		}
		filteredUrl.pathname = '/products'
	}
	filteredUrl.searchParams.delete('catalog')
	// Product provenance is not a storefront requirement. New Ryan uploads use
	// their own tags; preserve explicit shopper filters without adding a brand tag.
	return filteredUrl
}

export function isRyanCategoryVisible(category: { name?: string; label?: string; slug?: string | null } = {}) {
	const value = `${category.name || category.label || ''} ${category.slug || ''}`.toLowerCase().replace(/[’']/g, '')
	return !/(^|[\s-])(kids?|sarees?)([\s-]|$)/.test(value)
}

export function withoutDemoProducts<T extends Record<string, any>>(products: T[] = []) {
	return products.filter((product) => {
		const tags = (product.tags || []).map((tag: any) => String(tag?.name ?? tag))
		const identifiers = [product.sku, product.styleCode, product.groupedSku]
		const images = [
			product.thumbnail,
			product.img,
			product.image,
			...(product.variants || []).flatMap((variant: any) => [variant?.thumbnail, variant?.img])
		]
		return (
			!tags.some((tag: string) => /^(dummy data|demo jewels)$/i.test(tag)) &&
			!identifiers.some((value) => /^DMY-/i.test(String(value || ''))) &&
			!images.some((value) => /media\.jewelwesell\.com\/dummy\//i.test(String(value || '')))
		)
	})
}

export function filterProductsByCategory<T>(products: T[] = [], category = 'All') {
	const pattern = ({ Rings: /\brings?\b/i, Pendants: /\bpendants?\b/i, Earrings: /\bearrings?\b/i } as Record<string, RegExp>)[category]
	return pattern
		? products.filter((product: any) =>
				pattern.test(
					[
						product?.title,
						product?.name,
						product?.category?.name,
						product?.categoryName,
						product?.collection?.name,
						...(product?.categoryHierarchy || []).map((item: any) => item?.name),
						...(product?.tags || []).map((item: any) => item?.name ?? item)
					]
						.filter(Boolean)
						.join(' ')
				)
			)
		: products
}

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

export function selectedValues(url: URL, key: string) {
	const value = url.searchParams.get(key)
	if (!value) return []
	try {
		return decodeURIComponent(value).split(',').filter(Boolean)
	} catch {
		return value.split(',').filter(Boolean)
	}
}

function normalized(value: unknown) {
	return String(value ?? '')
		.toLowerCase()
		.replace(/[^a-z0-9.]+/g, ' ')
		.trim()
}

export function productRating(product: any) {
	const raw =
		Array.isArray(product?.ratings) && product.ratings.length
			? product.ratings.reduce((sum: number, item: any) => sum + Number(item.rating || 0), 0) / product.ratings.length
			: Number(product?.averageRating || product?.rating || 0)
	return Number.isFinite(raw) ? Math.min(5, Math.max(0, Math.round(raw * 10) / 10)) : 0
}

function matchesMetadata(product: any, values: string[]) {
	if (!values.length) return true
	const haystack = normalized(JSON.stringify(product))
	return values.some((value) =>
		normalized(value.replace(/\(\d+\)$/, ''))
			.split(' ')
			.every((word) => haystack.includes(word))
	)
}

export const listingFilterDefinitions = [
	{ key: 'uiMaterial', label: 'Metal color', pattern: /^(metal type|metal color|material)$/i, fallback: /^(white gold|yellow gold|rose gold|platinum|sterling silver|silver)$/i },
	{ key: 'uiKarat', label: 'Gold purity', pattern: /^(metal stamp|karat|purity)$/i, fallback: /^\d{2}k(?: gold)?$/i },
	{ key: 'uiShape', label: 'Diamond shape', pattern: /^(diamond shape|center stone shape|stone shape|center stone)$/i, fallback: /^(round|oval|pear|princess|emerald|cushion|radiant|asscher|marquise|heart|baguette)$/i },
	{ key: 'uiWeight', label: 'Carat weight', pattern: /^(total carat weight|total carat weight range|carat weight|center stone ctw)$/i },
	{ key: 'uiColor', label: 'Diamond color', pattern: /^(diamond color|stone color|diamonf color)$/i },
	{ key: 'uiQuality', label: 'Diamond clarity', pattern: /^(diamond clarity|stone quality)$/i }
]

function attributeName(value: string) { return value.replace(/^(attributes|options?)\./, '').replaceAll('_', ' ').trim() }

export function productFilterValues(product: any, key: string): string[] {
	const definition = listingFilterDefinitions.find((item) => item.key === key)
	if (!definition) return []
	const values: string[] = []
	for (const attr of product.attributes || []) {
		if (definition.pattern.test(attributeName(attr.name || attr.title || ''))) values.push(String(attr.value))
	}
	if (!values.length) for (const option of product.options || []) {
		if (definition.pattern.test(attributeName(option.title || option.type || ''))) values.push(...(option.values || []).map((item: any) => String(item.value ?? item)))
	}
	if (!values.length) for (const [name, value] of Object.entries(product)) {
		if (/^(attributes|options?)\./.test(name) && definition.pattern.test(attributeName(name))) values.push(...(Array.isArray(value) ? value : [value]).map(String))
	}
	if (!values.length && definition.fallback) values.push(...(product.tags || []).map((tag: any) => String(tag.name ?? tag)).filter((name: string) => definition.fallback!.test(name)))
	return [...new Set(values.filter((value) => value && value !== 'null' && value !== 'undefined').map(value => key === 'uiKarat' ? value.replace(/\s*gold$/i, '').trim().toUpperCase() : value))]
}

export function listingFilterOptions(products: any[], facets: Record<string, Record<string, number>> = {}) {
	return listingFilterDefinitions.map((definition) => {
		const names = new Set(products.flatMap((product) => productFilterValues(product, definition.key)))
		for (const [key, values] of Object.entries(facets)) {
			if (definition.pattern.test(attributeName(key))) Object.keys(values).forEach((name) => names.add(name))
		}
		if (definition.fallback) Object.keys(facets['tags.name'] || {}).filter((name) => definition.fallback!.test(name)).forEach((name) => names.add(name))
		const choices = [...new Set([...names].map(value => definition.key === 'uiKarat' ? value.replace(/\s*gold$/i, '').trim().toUpperCase() : value))].filter(value => definition.key !== 'uiMaterial' || !/^\d+\s*k\s*gold$/i.test(value))
		return { key: definition.key, label: definition.label, values: choices.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })) }
	}).filter((group) => group.values.length)
}

function matchesDimension(product: any, url: URL, key: string) {
	const selected = selectedValues(url, key)
	if (!selected.length) return true
	const values = productFilterValues(product, key)
	if (values.length) return selected.some((item) => values.some((value) => normalized(value) === normalized(item)))
	return matchesMetadata(product, selected)
}

export function applyClientFilters(products: any[], url: URL) {
	const statuses = selectedValues(url, 'uiStatus')
	const filtered = products.filter((product) => {
		const text = normalized(JSON.stringify(product))
		const statusMatches =
			!statuses.length ||
			statuses.some((status) => {
				if (status === 'In Stock') return product.manageInventory === false || Number(product.stock) > 0 || product.variants?.some((variant: any) => Number(variant.stock) > 0)
				if (status === 'Out of stock') return product.manageInventory !== false && Number(product.stock || 0) <= 0 && !product.variants?.some((variant: any) => Number(variant.stock) > 0)
				if (status === 'Best seller') return Number(product.popularity) > 0 || text.includes('best seller')
				if (status === 'Top Rated') return productRating(product) >= 4
				return Boolean(product.isFeatured || product.featured || text.includes('featured'))
			})

		return (
			statusMatches &&
			clientFilterKeys.filter((key) => key !== 'uiStatus').every((key) => matchesDimension(product, url, key))
		)
	})

	const sort = url.searchParams.get('uiSort')
	if (sort === 'rating:desc') return filtered.sort((a, b) => productRating(b) - productRating(a))
	if (sort === 'title:asc' || sort === 'title:desc') {
		const direction = sort === 'title:asc' ? 1 : -1
		return filtered.sort((a, b) => direction * String(a.title || a.name || '').localeCompare(String(b.title || b.name || '')))
	}
	return filtered
}
