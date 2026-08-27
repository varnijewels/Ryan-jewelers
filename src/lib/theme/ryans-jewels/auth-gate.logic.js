export const LOGIN_PROMPT_DELAY_MS = 5 * 60 * 1000

/** @param {{ userId?: string, id?: string } | null | undefined} user */
export function isCustomerSignedIn(user) {
	return Boolean(user?.userId || user?.id)
}

/** @param {{ userId?: string, id?: string } | null | undefined} user @param {boolean} guestCheckoutEnabled */
export function canAccessCheckout(user, guestCheckoutEnabled) {
	return guestCheckoutEnabled || isCustomerSignedIn(user)
}

/** @param {{ userId?: string, id?: string } | null | undefined} user @param {boolean} alreadyShown */
export function shouldShowDelayedLogin(user, alreadyShown) {
	return !alreadyShown && !isCustomerSignedIn(user)
}

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('auth-gate.logic.js')) {
	console.assert(isCustomerSignedIn({ id: 'user_1' }))
	console.assert(isCustomerSignedIn({ userId: 'user_2' }))
	console.assert(!isCustomerSignedIn(null))
	console.assert(canAccessCheckout(null, true))
	console.assert(canAccessCheckout({ id: 'user_1' }, false))
	console.assert(!canAccessCheckout(null, false))
	console.assert(shouldShowDelayedLogin(null, false))
	console.assert(!shouldShowDelayedLogin(null, true))
	console.log('Ryan auth gate logic: ok')
}
