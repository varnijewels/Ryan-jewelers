import { env } from '$env/dynamic/public'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ fetch, url }) => {
	const paths = ['/', '/products', '/about-us', '/contact-us']
	try {
		const response = await fetch('/api/ms/products?page=1', {
			headers: { 'x-litekart-store': env.PUBLIC_LITEKART_STORE_ID }
		})
		const data = response.ok ? await response.json() : {}
		for (const product of data.hits ?? data.data ?? []) {
			if (product.styleCode && product.slug) paths.push(`/products/${product.slug}`)
		}
	} catch {
		// The static pages still form a valid sitemap if the catalogue API is unavailable.
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
		.map((path) => `  <url><loc>${new URL(path, url.origin).href}</loc></url>`)
		.join('\n')}\n</urlset>\n`

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	})
}
