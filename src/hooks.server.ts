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
	if (url.protocol === 'http:' && !isLocalOrIP) {
		event.url.protocol = 'https:'
	}

	const storeId = env.PUBLIC_LITEKART_STORE_ID
	const storeIdFromCookie = event.cookies.get('litekart_store_id')
	if (!isRyansHomepage && storeId && storeIdFromCookie !== storeId) {
		event.cookies.set('litekart_store_id', storeId, { path: '/' })
	}
	if (!url.pathname.startsWith('/api')) {
		const domain = env.PUBLIC_LITEKART_DOMAIN || url.hostname
		const requestedStoreId = storeId || storeIdFromCookie
		const cacheKey = requestedStoreId || domain
		const cachedStore = storeDetailsCache?.key === cacheKey && storeDetailsCache.expiresAt > Date.now()
			? storeDetailsCache.value
			: null
		let storeDetails = cachedStore
		storeDetails ||= await new StoreService(event.fetch).getStoreByIdOrDomain({ storeId: requestedStoreId, domain })
		if (!storeDetails?.id) throw new Error('Hooks: Store not found.')
		// ponytail: process-local cache; public homepage ISR handles cross-instance caching.
		if (!cachedStore) storeDetailsCache = { key: cacheKey, expiresAt: Date.now() + STORE_CACHE_TTL_MS, value: storeDetails }
		event.locals.storeDetails = storeDetails
		if (!isRyansHomepage && storeIdFromCookie !== storeDetails.id) event.cookies.set('litekart_store_id', storeDetails.id, { path: '/' })
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-type',
		// ponytail: preload route nodes only; restore chunk preloads if slow-network hydration becomes noticeable.
		preload: ({ type, path }) => !isRyansHomepage || type !== 'js' || path.includes('/nodes/')
	})
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
