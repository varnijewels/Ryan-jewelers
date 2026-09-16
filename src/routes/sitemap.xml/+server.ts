import { env } from '$env/dynamic/public'
import { ryansBlogPosts } from '$lib/theme/ryans-jewels/blog-content.js'
import { canonicalProductPaths } from '$lib/theme/ryans-jewels/seo.js'
import type { RequestHandler } from './$types.js'

const staticPaths = [
	'/',
	'/products',
	'/categories',
	'/categories/lab-grown-diamond',
	'/categories/rings',
	'/categories/engagement',
	'/categories/bracelets',
	'/categories/earrings',
	'/categories/pendants',
	'/about-us',
	'/contact-us',
	'/services',
	'/faqs',
	'/best-offers',
	'/blog',
	'/shipping-policy',
	'/refund-policy',
	'/privacy-policy',
	'/terms-and-conditions'
]

export const GET: RequestHandler = async ({ fetch, url }) => {
	const paths = new Set([...staticPaths, ...ryansBlogPosts.map((post) => `/blog/${post.slug}`)])

	try {
		const headers = { 'x-litekart-store': String(env.PUBLIC_LITEKART_STORE_ID || '') }
		const firstResponse = await fetch('/api/ms/products?page=1&tags=JewelWeSell', { headers })
		const firstPage = firstResponse.ok ? await firstResponse.json() : {}
		const pages = [firstPage]
		if (firstPage.totalPages > 1) {
			pages.push(
				...(await Promise.all(
					Array.from({ length: firstPage.totalPages - 1 }, async (_, index) => {
						const response = await fetch(`/api/ms/products?page=${index + 2}&tags=JewelWeSell`, { headers })
						return response.ok ? response.json() : {}
					})
				))
			)
		}
		for (const path of canonicalProductPaths(pages.flatMap((page) => page.hits ?? page.data ?? []))) paths.add(path)
	} catch {
		// Static pages still form a valid sitemap while the catalogue API is unavailable.
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...paths]
		.map((path) => `  <url><loc>${new URL(path, url.origin).href}</loc></url>`)
		.join('\n')}\n</urlset>\n`

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	})
}
