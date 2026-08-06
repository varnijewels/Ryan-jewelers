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

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('shipping-address.logic.js')) {
	console.assert(JSON.stringify(splitCustomerName('Sujal Amreliya')) === JSON.stringify({ firstName: 'Sujal', lastName: 'Amreliya' }))
	console.assert(JSON.stringify(splitCustomerName('Sujal')) === JSON.stringify({ firstName: 'Sujal', lastName: 'Sujal' }))
	const grouped = groupSavedAddresses([{ id: '1', address_1: 'Home' }, { id: '2', address_1: 'Work', type: 'office' }], { id: '1', address_1: 'Home' })
	console.assert(grouped.all.length === 2 && grouped.home.length === 1 && grouped.office.length === 1)
	console.assert(findAddressReplacement(grouped.all, grouped.all[0])?.id === '2')
	console.assert(findAddressReplacement([grouped.all[0]], grouped.all[0]) === null)
	console.log('shipping address logic: ok')
}
