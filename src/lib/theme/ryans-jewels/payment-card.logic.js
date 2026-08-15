/** @param {string} value */
export function cardDigits(value = '') {
	return String(value).replace(/\D/g, '').slice(0, 19)
}

/** @param {string} value */
export function formatCardNumber(value = '') {
	return cardDigits(value).replace(/(.{4})/g, '$1 ').trim()
}

/** @param {string} value */
export function formatCardExpiry(value = '') {
	const digits = String(value).replace(/\D/g, '').slice(0, 4)
	return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits
}

/** @param {string} value */
export function validLuhn(value = '') {
	const digits = cardDigits(value)
	let sum = 0
	let double = false
	for (let index = digits.length - 1; index >= 0; index -= 1) {
		let digit = Number(digits[index])
		if (double && (digit *= 2) > 9) digit -= 9
		sum += digit
		double = !double
	}
	return digits.length >= 12 && sum % 10 === 0
}

/** @param {string} value */
export function cardNumberError(value = '') {
	const digits = cardDigits(value)
	if (!digits) return 'Card number is required.'
	if (digits.length < 12) return 'Card number is too short.'
	if (digits.length > 19) return 'Card number is too long.'
	return validLuhn(digits) ? '' : 'Enter a valid card number.'
}

/** @param {string} value */
export function cardNameError(value = '') {
	const name = String(value).trim()
	if (!name) return 'Name on card is required.'
	return /[A-Za-z]{2}/.test(name) ? '' : 'Enter the name shown on the card.'
}

/** @param {string} value @param {Date} now */
export function cardExpiryError(value = '', now = new Date()) {
	const digits = String(value).replace(/\D/g, '')
	if (!digits) return 'Expiration date is required.'
	if (digits.length !== 4) return 'Use MM / YY format.'
	const month = Number(digits.slice(0, 2))
	const year = 2000 + Number(digits.slice(2))
	if (month < 1 || month > 12) return 'Enter a valid expiration month.'
	if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) return 'This card has expired.'
	return ''
}

/** @param {string} value */
export function cardCvvError(value = '') {
	const digits = String(value).replace(/\D/g, '')
	if (!digits) return 'CVV is required.'
	return /^\d{3,4}$/.test(digits) ? '' : 'CVV must be 3 or 4 digits.'
}

/** @param {{ number?: string, name?: string, expiry?: string, cvv?: string }} card @param {Date} now */
export function validatePaymentCard(card, now = new Date()) {
	return {
		number: cardNumberError(card.number),
		name: cardNameError(card.name),
		expiry: cardExpiryError(card.expiry, now),
		cvv: cardCvvError(card.cvv)
	}
}

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('payment-card.logic.js')) {
	console.assert(formatCardNumber('4242-4242 4242 4242') === '4242 4242 4242 4242')
	console.assert(formatCardExpiry('122030') === '12 / 20')
	console.assert(validLuhn('4242 4242 4242 4242'))
	console.assert(validLuhn('378282246310005'))
	console.assert(cardNumberError('4242') === 'Card number is too short.')
	console.assert(cardNumberError('4242424242424241') === 'Enter a valid card number.')
	console.assert(cardExpiryError('07/26', new Date(2026, 7, 1)) === 'This card has expired.')
	console.assert(cardExpiryError('08/26', new Date(2026, 7, 1)) === '')
	console.assert(cardCvvError('12') === 'CVV must be 3 or 4 digits.')
	console.assert(Object.values(validatePaymentCard({})).every(Boolean))
	console.log('payment card logic: ok')
}
