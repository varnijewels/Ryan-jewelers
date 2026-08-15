import { describe, expect, it } from 'vitest'
import { canonicalProductPath, canonicalProductPaths, canonicalProductSlug, isMissingCatalogPage, robotsSitemapUrl, ryansSeoText } from '$lib/theme/ryans-jewels/seo.js'

describe('Ryan Jewelers SEO helpers', () => {
	it('replaces legacy storefront brands in API metadata', () => {
		expect(ryansSeoText('Diamond Ring | JewelWeSell')).toBe('Diamond Ring | Ryan Jewelers')
		expect(ryansSeoText('', 'Shop at Arialshop')).toBe('Shop at Ryan Jewelers')
	})

	it('uses the primary grouped product URL as canonical', () => {
		const product = {
			slug: 'diamond-ring-20',
			groupedSku: 'RING-1',
			pg: [{ slug: 'diamond-ring' }, { slug: 'diamond-ring-1' }, { slug: 'diamond-ring-20' }]
		}
		expect(canonicalProductSlug(product)).toBe('diamond-ring')
		expect(canonicalProductPath(product)).toBe('/products/diamond-ring')
	})

	it('normalizes grouped search hits that omit the product group', () => {
		expect(canonicalProductSlug({ slug: 'diamond-pendant-19', groupedSku: 'PENDANT-1' })).toBe('diamond-pendant')
		expect(canonicalProductSlug({ slug: 'collection-2026' })).toBe('collection-2026')
	})

	it('marks empty catch-all catalog routes as missing', () => {
		expect(isMissingCatalogPage({ products: { count: 0 } })).toBe(true)
		expect(isMissingCatalogPage({ products: { count: 1 } })).toBe(false)
	})

	it('builds the working local sitemap URL for robots.txt', () => {
		expect(robotsSitemapUrl(new URL('https://ryan.varnijewels.com/robots.txt'))).toBe('https://ryan.varnijewels.com/sitemap.xml')
	})

	it('emits canonical grouped products once in the sitemap', () => {
		expect(canonicalProductPaths([{ slug: 'diamond-ring-20', groupedSku: 'RING-1' }, { slug: 'diamond-ring-19', groupedSku: 'RING-1' }])).toEqual([
			'/products/diamond-ring'
		])
	})
})
