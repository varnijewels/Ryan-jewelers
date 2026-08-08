/** @param {string} value */
export function splitCustomerName(value) {
	const [firstName = '', ...rest] = value.trim().split(/\s+/)
	return { firstName, lastName: rest.join(' ') || firstName }
}

/** @param {any[]} addresses @param {any} cartAddress */
export function groupSavedAddresses(addresses = [], cartAddress) {
	const seen = new Set()
	const all = [cartAddress, ...addresses].filter((address) => {
		if (!address?.address_1) return false
		const key = address.id && address.id !== 'new'
			? address.id
			: [address.firstName, address.lastName, address.address_1, address.zip].join('|')
		if (seen.has(key)) return false
		seen.add(key)
		return true
	})
	return {
		all,
		home: all.filter((address) => String(address.type || '').toLowerCase() !== 'office'),
		office: all.filter((address) => String(address.type || '').toLowerCase() === 'office')
	}
}

/** @param {any[]} addresses @param {any} address */
export function findAddressReplacement(addresses, address) {
	return addresses.find((candidate) => candidate !== address && (!address?.id || candidate?.id !== address.id)) || null
}

/** @param {any} left @param {any} right */
function sameAddress(left, right) {
	return Boolean(left?.address_1 && right?.address_1) && ['firstName', 'lastName', 'address_1', 'address_2', 'zip'].every((key) => String(left?.[key] || '') === String(right?.[key] || ''))
}

/** @param {any} address @param {any} cart @param {any[]} addresses */
export function savedAddressId(address, cart, addresses = []) {
	if (address?.id && address.id !== 'new') return address.id
	if (cart?.shippingAddressId && (cart.shippingAddress === address || sameAddress(cart.shippingAddress, address))) return cart.shippingAddressId
	return addresses.find((candidate) => candidate?.id && candidate.id !== 'new' && sameAddress(candidate, address))?.id || ''
}

/** @param {string | null} value */
export function parseHiddenAddressIds(value) {
	try {
		const parsed = JSON.parse(value || '[]')
		return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
	} catch {
		return []
	}
}

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('shipping-address.logic.js')) {
	console.assert(JSON.stringify(splitCustomerName('Sujal Amreliya')) === JSON.stringify({ firstName: 'Sujal', lastName: 'Amreliya' }))
	console.assert(JSON.stringify(splitCustomerName('Sujal')) === JSON.stringify({ firstName: 'Sujal', lastName: 'Sujal' }))
	const grouped = groupSavedAddresses([{ id: '1', address_1: 'Home' }, { id: '2', address_1: 'Work', type: 'office' }], { id: '1', address_1: 'Home' })
	console.assert(grouped.all.length === 2 && grouped.home.length === 1 && grouped.office.length === 1)
	console.assert(findAddressReplacement(grouped.all, grouped.all[0])?.id === '2')
	console.assert(findAddressReplacement([grouped.all[0]], grouped.all[0]) === null)
	const cartAddress = { address_1: 'Cart address' }
	console.assert(savedAddressId(cartAddress, { shippingAddress: cartAddress, shippingAddressId: 'cart-address-id' }) === 'cart-address-id')
	console.assert(savedAddressId({ firstName: 'Sujal', address_1: 'Mota varacha', zip: '395010' }, {}, [{ id: 'saved-id', firstName: 'Sujal', address_1: 'Mota varacha', zip: '395010' }]) === 'saved-id')
	console.assert(JSON.stringify(parseHiddenAddressIds('["one",2,"two"]')) === '["one","two"]')
	console.assert(parseHiddenAddressIds('invalid').length === 0)
	console.log('shipping address logic: ok')
}
