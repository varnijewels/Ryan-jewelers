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
	if (storeId && storeIdFromCookie !== storeId) {
		event.cookies.set('litekart_store_id', storeId, { path: '/' })
	} else if (!storeIdFromCookie) {
		const domain = env.PUBLIC_LITEKART_DOMAIN || url.hostname
		if (!domain) {
			throw new Error(`Unable to retrieve hostname from URL. ${url.hostname}`)
		}
		if (!url.pathname.startsWith('/api')) {
			const storeService = new StoreService(event.fetch)
			const storeDetails = await storeService.getStoreByIdOrDomain({ storeId, domain })
			if (storeDetails?.id && storeIdFromCookie !== storeDetails?.id) {
				event.cookies.set('litekart_store_id', storeDetails?.id, { path: '/' })
				event.locals.storeDetails = storeDetails
			} else {
				throw new Error('Hooks: Store not found.')
			}
		}
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-type',
		// ponytail: preload route nodes only; restore chunk preloads if slow-network hydration becomes noticeable.
		preload: ({ type, path }) => !isRyansHomepage || type !== 'js' || path.includes('/nodes/')
	})
	if (isRyansHomepage) {
		response.headers.append(
			'Link',
			'</ryans-jewels/home/hero-mobile.webp>; rel=preload; as=image; media="(max-width: 639px)"; fetchpriority=high, </ryans-jewels/home/hero-desktop.webp>; rel=preload; as=image; media="(min-width: 640px)"; fetchpriority=high'
		)
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
