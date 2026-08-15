import { env } from '$env/dynamic/public'
import { canonicalProductPaths } from '$lib/theme/ryans-jewels/seo.js'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ fetch, url }) => {
	const paths = new Set([
		'/',
		'/products',
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
	])
	try {
		const headers = { 'x-litekart-store': env.PUBLIC_LITEKART_STORE_ID }
		const response = await fetch('/api/ms/products?page=1&tags=JewelWeSell', {
			headers
		})
		const firstPage = response.ok ? await response.json() : {}
		const pages = [firstPage]
		if (firstPage.totalPages > 1) {
			pages.push(
				...(await Promise.all(
					Array.from({ length: firstPage.totalPages - 1 }, async (_, index) => {
						const next = await fetch(`/api/ms/products?page=${index + 2}&tags=JewelWeSell`, { headers })
						return next.ok ? next.json() : {}
					})
				))
			)
		}
		const products = pages.flatMap((page) => page.hits ?? page.data ?? [])
		for (const path of canonicalProductPaths(products)) paths.add(path)
	} catch {
		// The static pages still form a valid sitemap if the catalogue API is unavailable.
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
