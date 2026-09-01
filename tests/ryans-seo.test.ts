import { describe, expect, it } from 'vitest'
import {
	canonicalProductPath,
	canonicalProductPaths,
	canonicalProductSlug,
	isMissingCatalogPage,
	productStructuredData,
	robotsSitemapUrl,
	ryansSeoText
} from '$lib/theme/ryans-jewels/seo.js'
import { ryansBlogPosts } from '$lib/theme/ryans-jewels/blog-content.js'
import { instagramStrip } from '$lib/theme/ryans-jewels/footer-content.js'

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

	it('emits complete product pricing and availability for search engines', () => {
		const schema = productStructuredData(
			{
				title: 'Diamond Ring',
				description: '<p>Made by JewelWeSell.</p>',
				sku: 'RING-1',
				price: 995.99,
				stock: 2,
				manageInventory: true,
				thumbnail: 'https://cdn.example.com/ring.jpg'
			},
			{ name: 'RyansJewelers', currency: { code: 'USD' } },
			'https://ryan.varnijewels.com/products/diamond-ring'
		)

		expect(schema).toMatchObject({
			name: 'Diamond Ring',
			image: ['https://cdn.example.com/ring.jpg'],
			sku: 'RING-1',
			brandName: 'Ryan Jewelers',
			priceCurrency: 'USD',
			price: 995.99,
			availability: 'https://schema.org/InStock'
		})
		expect(schema.description).toContain('Ryan Jewelers')
	})

	it('ships indexable blog fallbacks and the real Instagram profile', () => {
		expect(ryansBlogPosts).toHaveLength(3)
		expect(new Set(ryansBlogPosts.map((post) => post.slug)).size).toBe(ryansBlogPosts.length)
		expect(ryansBlogPosts.every((post) => post.title && post.excerpt && post.content && post.imageUrl)).toBe(true)
		expect(instagramStrip.href).toBe('https://www.instagram.com/varnijewels/')
	})
})
