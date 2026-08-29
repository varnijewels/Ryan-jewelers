import { env } from '$env/dynamic/public'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ fetch }) => {
	if (!env.PUBLIC_LITEKART_API_URL || !env.PUBLIC_LITEKART_STORE_ID) {
		return Response.json({ message: 'Store configuration unavailable' }, { status: 503 })
	}

	try {
		const upstream = new URL('/api/stores/public-details', env.PUBLIC_LITEKART_API_URL)
		upstream.searchParams.set('store_id', env.PUBLIC_LITEKART_STORE_ID)
		const response = await fetch(upstream)
		if (!response.ok) return Response.json({ message: 'Store configuration unavailable' }, { status: response.status })

		return new Response(await response.text(), {
			headers: {
				'content-type': 'application/json',
				'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
				'cdn-cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
				'vercel-cdn-cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
			}
		})
	} catch {
		return Response.json({ message: 'Store configuration unavailable' }, { status: 502 })
	}
}
