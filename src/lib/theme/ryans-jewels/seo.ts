type ProductLike = {
	slug?: unknown
	groupedSku?: unknown
	pg?: Array<{ slug?: unknown }>
	title?: unknown
	description?: unknown
	sku?: unknown
	images?: unknown
	thumbnail?: unknown
	price?: unknown
	stock?: unknown
	manageInventory?: unknown
	allowBackorder?: unknown
	rating?: unknown
	reviewCount?: unknown
	ratings?: Array<{ rating?: unknown }>
	variants?: Array<{
		id?: unknown
		sku?: unknown
		images?: unknown
		img?: unknown
		price?: unknown
		stock?: unknown
		manageInventory?: unknown
	}>
}

const legacyBrand = /Arialshop|JewelWeSell|Svelte Commerce|Shop Your Fashion|Our Store|Ryan'?s?\s*Jewelers?/gi

export function ryansSeoText(value: unknown, fallback = '') {
	return String(value || fallback).replace(legacyBrand, 'Ryan Jewelers')
}

export function canonicalProductSlug(product: ProductLike | null | undefined) {
	const slug = String(product?.slug || '')
	const groupedSlugs = (product?.pg || []).map((item) => String(item?.slug || '')).filter(Boolean)
	return groupedSlugs.find((candidate) => !/-\d+$/.test(candidate)) || groupedSlugs[0] || (product?.groupedSku ? slug.replace(/-\d+$/, '') : slug)
}

export function canonicalProductPath(product: ProductLike | null | undefined) {
	const slug = canonicalProductSlug(product)
	return slug ? `/products/${slug}` : '/products'
}

export function canonicalProductPaths(products: ProductLike[] = []) {
	return [...new Set(products.map(canonicalProductPath).filter((path) => path !== '/products'))]
}

export function robotsSitemapUrl(url: URL) {
	return new URL('/sitemap.xml', url).href
}

export function isMissingCatalogPage(data: { products?: { count?: number } } | null | undefined) {
	return !Number(data?.products?.count)
}

const imageList = (value: unknown) =>
	(Array.isArray(value) ? value : String(value || '').split(','))
		.map((image) => String(image).trim())
		.filter(Boolean)

export function productStructuredData(
	product: ProductLike | null | undefined,
	store: { name?: unknown; currency?: { code?: unknown } } | null | undefined,
	url: string,
	variantId = ''
) {
	const variant = product?.variants?.find((item) => item.id === variantId) || product?.variants?.[0]
	const price = Number(variant?.price ?? product?.price)
	const stock = Number(variant?.stock ?? product?.stock)
	const manageInventory = variant?.manageInventory ?? product?.manageInventory
	const ratings = product?.ratings?.map((item) => Number(item.rating)).filter((rating) => rating > 0) || []
	const ratingValue = Number(product?.rating) || (ratings.length ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length : 0)
	const reviewCount = Number(product?.reviewCount) || ratings.length

	return {
		name: String(product?.title || ''),
		image: imageList(variant?.images || variant?.img || product?.images || product?.thumbnail),
		description: ryansSeoText(product?.description),
		sku: String(variant?.sku || product?.sku || ''),
		brandName: ryansSeoText(store?.name, 'Ryan Jewelers'),
		aggregateRating: { ratingValue, reviewCount },
		url,
		priceCurrency: String(store?.currency?.code || 'USD'),
		price: Number.isFinite(price) ? price : undefined,
		availability:
			product?.allowBackorder || manageInventory === false || stock > 0
				? 'https://schema.org/InStock'
				: 'https://schema.org/OutOfStock'
	}
}
