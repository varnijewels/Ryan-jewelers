import type { RequestHandler } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

// Readiness probe for the container orchestrator. It answers "is this process up AND configured
// well enough to serve?" — NOT "is the backend healthy?". It deliberately does NOT call the upstream
// API, because a transient backend blip should not take the whole site out of rotation.
//
// But a container missing its required PUBLIC_ env is misconfigured from boot: every SSR page fails
// (service calls throw "PUBLIC_LITEKART_API_URL is not configured", and store resolution throws
// "Invalid URL" without PUBLIC_LITEKART_DOMAIN / STORE_ID). That state never recovers on its own, so
// the probe MUST fail — otherwise the container reports healthy, the orchestrator's start-first
// rollout routes traffic to it, and it replaces a working container with one that fails every page.
// Failing here makes that deploy roll back instead.
// Only PUBLIC_LITEKART_API_URL is genuinely required: every service call and the /api proxy throw
// without it, and that state never recovers on its own. The other two are NOT required in this
// fleet and must not be probed for:
//   - PUBLIC_LITEKART_STORE_ID is optional — hooks.server.ts resolves the store by domain via
//     getStoreByIdOrDomain when it is absent, and sitemap.xml falls back to the litekart_store_id
//     cookie. 108 of the 109 storefronts ship no STORE_ID at all.
//   - PUBLIC_LITEKART_DOMAIN falls back to the request hostname.
// Probing for either would make every container report 503 and, where the orchestrator gates a
// rollout on readiness, block deploys fleet-wide.
const REQUIRED_ENV = ['PUBLIC_LITEKART_API_URL']

export const GET: RequestHandler = async () => {
	const missing = REQUIRED_ENV.filter((key) => !env[key])
	if (missing.length > 0) {
		return new Response(`misconfigured: missing required env ${missing.join(', ')}`, {
			status: 503,
			headers: { 'cache-control': 'no-store' }
		})
	}
	return new Response('ok', {
		status: 200,
		headers: { 'cache-control': 'no-store' }
	})
}
