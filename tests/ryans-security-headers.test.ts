import { describe, expect, it } from 'vitest'
import { applySecurityHeaders } from '../src/lib/server/security-headers.js'

describe('storefront security headers', () => {
	it('adds browser protections and only enables HSTS over HTTPS', () => {
		const secure = new Response()
		applySecurityHeaders(secure, 'https:')
		expect(secure.headers.get('content-security-policy')).toContain("frame-ancestors 'self'")
		expect(secure.headers.get('x-content-type-options')).toBe('nosniff')
		expect(secure.headers.get('strict-transport-security')).toBe('max-age=31536000')

		const local = new Response()
		applySecurityHeaders(local, 'http:')
		expect(local.headers.has('strict-transport-security')).toBe(false)
	})
})
