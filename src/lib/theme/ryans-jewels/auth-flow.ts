export function normalizePhone(value: string, dialCode = '+91') {
	const phone = value.replace(/[^\d+]/g, '')
	return phone.startsWith('+') ? phone : `${dialCode}${phone.replace(/^0+/, '')}`
}

export function resetPasswordError(token: string, userId: string, password: string, confirmation: string) {
	if (!token || !userId) return 'This password reset link is invalid or incomplete.'
	if (password.length < 8) return 'Password must be at least 8 characters.'
	if (password !== confirmation) return 'Passwords do not match.'
	return ''
}
