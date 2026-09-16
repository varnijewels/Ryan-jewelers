import { describe, expect, it } from 'vitest'
import {
	canonicalProductPath,
	canonicalProductPaths,
	canonicalProductSlug,
	isMissingCatalogPage,
	productStructuredData,
	robotsSitemapUrl,
	ryansSeoPlainText,
	safeJsonLd,
	ryansSeoText
} from '$lib/theme/ryans-jewels/seo.js'
import { ryansBlogPosts } from '$lib/theme/ryans-jewels/blog-content.js'
import { instagramStrip } from '$lib/theme/ryans-jewels/footer-content.js'
import { instagramTiles } from '$lib/theme/ryans-jewels/instagram-feed.js'
import { realCatalogUrl } from '$lib/theme/ryans-jewels/product-filters.js'

describe('Ryan Jewelers SEO helpers', () => {
	it('replaces legacy storefront brands in API metadata', () => {
		expect(ryansSeoText('Diamond Ring | JewelWeSell')).toBe('Diamond Ring | Ryan Jewelers')
		expect(ryansSeoText("JewelWeSell's certified diamond")).toBe('Ryan Jewelers certified diamond')
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
	it('publishes canonical sitemap URLs without duplicate product variants', () => {
		expect(robotsSitemapUrl(new URL('https://ryan.example/robots.txt'))).toBe('https://ryan.example/sitemap.xml')
		expect(canonicalProductPaths([{ slug: 'diamond-ring-20', groupedSku: 'RING-1' }, { slug: 'diamond-ring-19', groupedSku: 'RING-1' }])).toEqual([
			'/products/diamond-ring'
		])
	})

	it('loads category landing pages through the existing product search', () => {
		const url = realCatalogUrl(new URL('https://ryan.example/categories/engagement?shape=oval'))
		expect(url.pathname).toBe('/products')
		expect(url.searchParams.get('categories')).toBe('engagement')
		expect(url.searchParams.get('uiShape')).toBe('Oval')
		expect(url.searchParams.get('tags')).toBe('JewelWeSell')
	})

	it('keeps structured data plain and safe to embed', () => {
		expect(ryansSeoPlainText('<p>Made by JewelWeSell &amp; crafted for you.</p>')).toBe('Made by Ryan Jewelers & crafted for you.')
		expect(safeJsonLd({ description: '</script><script>alert(1)</script>' })).not.toContain('</script>')
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
		expect(schema.description).not.toContain('<p>')
	})

	it('omits empty aggregate ratings from product schema', () => {
		const schema = productStructuredData(
			{ title: 'Diamond Ring', price: 995.99, stock: 2, manageInventory: true },
			{ name: 'Ryan Jewelers', currency: { code: 'USD' } },
			'https://ryan.varnijewels.com/products/diamond-ring'
		)

		expect(schema.aggregateRating).toBeUndefined()
	})

	it('ships indexable blog fallbacks and the real Instagram profile', () => {
		expect(ryansBlogPosts).toHaveLength(3)
		expect(new Set(ryansBlogPosts.map((post) => post.slug)).size).toBe(ryansBlogPosts.length)
		expect(ryansBlogPosts.every((post) => post.title && post.excerpt && post.content && post.imageUrl)).toBe(true)
		expect(instagramStrip.href).toBe('https://www.instagram.com/ryan.jewelers/')
	})

	it('normalizes Instagram posts and reels without exposing unusable media', () => {
		expect(
			instagramTiles(
				[
					{
						media_type: 'IMAGE',
						media_url: 'https://cdn.example.com/post.jpg',
						permalink: 'https://www.instagram.com/p/post/',
						caption: 'Diamond ring'
					},
					{ media_type: 'VIDEO', thumbnail_url: 'https://cdn.example.com/reel.jpg', permalink: 'https://www.instagram.com/reel/video/' },
					{ media_type: 'IMAGE', media_url: 'javascript:alert(1)' }
				],
				instagramStrip.href
			)
		).toEqual([
			{ src: 'https://cdn.example.com/post.jpg', href: 'https://www.instagram.com/p/post/', alt: 'Diamond ring', isVideo: false },
			{ src: 'https://cdn.example.com/reel.jpg', href: 'https://www.instagram.com/reel/video/', alt: 'Ryan Jewelers Instagram reel', isVideo: true }
		])
	})
})
