import type { Handle } from '@sveltejs/kit'
import { StoreService } from '$lib/core/services/index.js'
import { applySecurityHeaders } from '$lib/server/security-headers.js'
import { env } from '$env/dynamic/public'
import { env as privateEnv } from '$env/dynamic/private'

// Function to check if a URL is a local/IP address
function isLocalOrIpAddress(url: string): boolean {
	return url.includes('localhost') || url.includes('127.0.0.1') || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)
}

const noindexPrefixes = ['/auth', '/checkout', '/my', '/messages', '/profile', '/order-tracking', '/enquiry']
const STORE_CACHE_TTL_MS = 5 * 60 * 1000
let storeDetailsCache: { key: string; expiresAt: number; value: any } | null = null

export const init = async () => {
	if (env.PUBLIC_SHOPIFY_STORE_DOMAIN) {
		const { BaseService } = await import('$lib/core/services/index.js')
		BaseService.setShopifyCredentials(
			env.PUBLIC_SHOPIFY_STORE_DOMAIN,
			privateEnv.SHOPIFY_ADMIN_ACCESS_TOKEN,
			env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
		)
	}

	if (env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY) {
		const { BaseService } = await import('$lib/core/services/index.js')
		BaseService.setMedusaPublisableKey(env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY)
		BaseService.setRegionId(env.PUBLIC_MEDUSA_REGION_ID)
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const url = new URL(event.request.url)
	const isLocalOrIP = isLocalOrIpAddress(url.hostname)
	const isRyansHomepage =
		url.pathname === '/' && (isLocalOrIP || url.hostname === 'ryan.varnijewels.com' || env.PUBLIC_STOREFRONT_THEME === 'ryans-jewels')
	const isRyansStorefront = url.hostname === 'ryan.varnijewels.com'
	const isStoreDetailsCacheRequest = url.pathname === '/store-details.json'
	const edgeCache = isRyansStorefront && typeof caches !== 'undefined'
		? (caches as CacheStorage & { default?: Cache }).default
		: undefined
	const isMobileRequest =
		event.request.headers.get('sec-ch-ua-mobile') === '?1' || /Android|iPhone|Mobile/i.test(event.request.headers.get('user-agent') || '')
	// ponytail: UA only selects the preload hint; <picture> remains the responsive source of truth.
	const heroImage = isMobileRequest ? '/ryans-jewels/home/hero-mobile.webp' : '/ryans-jewels/home/hero-desktop.webp'

	if (url.protocol === 'http:' && !isLocalOrIP) {
		event.url.protocol = 'https:'
	}

	const storeId = env.PUBLIC_LITEKART_STORE_ID
	const storeIdFromCookie = event.cookies.get('litekart_store_id')
	if (!isStoreDetailsCacheRequest && storeId && storeIdFromCookie !== storeId) {
		event.cookies.set('litekart_store_id', storeId, { path: '/' })
	}
	if (!url.pathname.startsWith('/api') && !isStoreDetailsCacheRequest) {
		const domain = env.PUBLIC_LITEKART_DOMAIN || url.hostname
		const requestedStoreId = storeId || storeIdFromCookie
		const cacheKey = requestedStoreId || domain
		const cachedStore = storeDetailsCache?.key === cacheKey && storeDetailsCache.expiresAt > Date.now()
			? storeDetailsCache.value
			: null
		let storeDetails = cachedStore
		const edgeCacheRequest = edgeCache ? new Request(`${url.origin}/store-details.json`) : null
		let edgeCacheHit = false
		if (!storeDetails && edgeCache && edgeCacheRequest) {
			try {
				const response = await edgeCache.match(edgeCacheRequest)
				if (response?.ok) {
					storeDetails = await response.json()
					edgeCacheHit = true
				}
			} catch {
				// Cache availability must never block storefront rendering.
			}
		}
		if (!storeDetails && isRyansStorefront) {
			try {
				const response = await fetch(`${url.origin}/store-details.json`)
				if (response.ok) storeDetails = await response.json()
			} catch {
				// Fall through to the connector when the CDN cache route is unavailable.
			}
		}
		storeDetails ||= await new StoreService(event.fetch).getStoreByIdOrDomain({ storeId: requestedStoreId, domain })
		if (!storeDetails?.id) throw new Error('Hooks: Store not found.')
		if (!cachedStore && !edgeCacheHit && edgeCache && edgeCacheRequest) {
			try {
				await edgeCache.put(edgeCacheRequest, Response.json(storeDetails, {
					headers: { 'cache-control': 'public, max-age=3600' }
				}))
			} catch {
				// Continue with the fetched value when edge storage is unavailable.
			}
		}
		// ponytail: process-local hot path; shared edge storage covers Cloudflare isolates.
		if (!cachedStore) storeDetailsCache = { key: cacheKey, expiresAt: Date.now() + STORE_CACHE_TTL_MS, value: storeDetails }
		event.locals.storeDetails = storeDetails
		if (storeIdFromCookie !== storeDetails.id) event.cookies.set('litekart_store_id', storeDetails.id, { path: '/' })
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-type',
		// ponytail: preload route nodes only; restore chunk preloads if slow-network hydration becomes noticeable.
		preload: ({ type, path }) => !isRyansHomepage || type !== 'js' || path.includes('/nodes/'),
		transformPageChunk: ({ html }) =>
			isRyansHomepage ? html.replace('<head>', `<head><link rel="preload" as="image" type="image/webp" href="${heroImage}" fetchpriority="high">`) : html
	})
	if (isRyansHomepage) {
		const existingLinks = response.headers.get('Link')
		const heroLink = `<${heroImage}>; rel=preload; as=image; type=image/webp; fetchpriority=high`
		response.headers.set('Link', existingLinks ? `${heroLink}, ${existingLinks}` : heroLink)
	}
	if (noindexPrefixes.some((prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`))) {
		response.headers.set('X-Robots-Tag', 'noindex, follow')
	}
	applySecurityHeaders(response, url.protocol)
	// response.headers.set('x-litekart-store', storeDetailsCache?.id || '')
	return response
}

// Simplified error handler that strips stack trace information
export function handleError({ error, event }) {
	// Check if it's a SvelteKitError or similar object with stack trace
	if (error && error.stack && error.status === 404 && !error.message.startsWith('/cdn/')) {
		// Create a simplified version of the error
		const simplifiedError = error.message || 'An error occurred'

		console.error('Sveltekit error:', simplifiedError)

		// Return the simplified error
		return {
			message: simplifiedError.message,
			status: simplifiedError.status
		}
	}

	return {
		message: error?.message || 'An unknown error occurred',
		status: error?.status || 500
	}
}
