type ProductLike = {
	slug?: unknown
	groupedSku?: unknown
	pg?: Array<{ slug?: unknown }>
}

const legacyBrand = /Arialshop|JewelWeSell|Svelte Commerce|Shop Your Fashion|Our Store/gi

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
