export function applySecurityHeaders(response: Response, protocol: string) {
	response.headers.set('Content-Security-Policy', "base-uri 'self'; object-src 'none'; frame-ancestors 'self'")
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
	response.headers.set('X-Content-Type-Options', 'nosniff')
	response.headers.set('X-Frame-Options', 'SAMEORIGIN')
	if (protocol === 'https:') response.headers.set('Strict-Transport-Security', 'max-age=31536000')
}
