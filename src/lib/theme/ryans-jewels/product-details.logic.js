/** @param {any} product @param {any} variant */
export function productImages(product, variant) {
	const raw = variant?.images || product?.images || ''
	return [...new Set([product?.thumbnail, ...String(raw).split(',')].map((image) => image?.trim()).filter(Boolean))]
}

/** @param {any[]} variants @param {any} current @param {string} optionId @param {string} value */
export function variantForOption(variants, current, optionId, value) {
	const selectedOptions = /** @type {any[]} */ (current?.options || [])
	const wanted = new Map(selectedOptions.map((option) => [option.optionId, option.value]))
	wanted.set(optionId, value)
	return variants.find((variant) => /** @type {any[]} */ (variant.options || []).every((option) => wanted.get(option.optionId) === option.value))
		|| variants.find((variant) => /** @type {any[]} */ (variant.options || []).some((option) => option.optionId === optionId && option.value === value))
		|| current
}

/** @param {number} price @param {number} mrp */
export function discountPercent(price, mrp) {
	return mrp > price && price >= 0 ? Math.round(((mrp - price) / mrp) * 100) : 0
}

/** @param {unknown} value */
export function metalColorTone(value) {
	const name = String(value || '').toLowerCase()
	if (/rose|pink|red/.test(name)) return 'rose'
	if (/white|silver|platinum/.test(name)) return 'white'
	return 'yellow'
}

/** @param {any[]} attributes @param {RegExp} pattern */
export function productAttributeValue(attributes, pattern) {
	return String((attributes || []).find((item) => pattern.test(String(item.name || item.title || '').replaceAll('_', ' ')))?.value || '')
}

/** @param {unknown} html @param {unknown} fallback */
export function productDetailParagraphs(html, fallback = '') {
	const text = String(html || fallback)
		.replace(/<li[^>]*>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
	const sentences = text.match(/[^.!?]+(?:[.!?]+|$)/g)?.map((item) => item.trim()).filter(Boolean) || []
	return sentences.slice(0, 2).length ? sentences.slice(0, 2) : [text].filter(Boolean)
}

/** @param {any[]} options @param {any[]} attributes */
export function customizationOptions(options, attributes) {
	const source = options.length ? options : attributes.map((item, index) => ({ id: `attribute-${index}`, title: item.name?.replaceAll('_', ' '), values: [{ value: item.value }], readonly: true }))
	const patterns = [/\b(diamond|stone).*quality|quality.*(diamond|stone)\b/i, /\bmetal\s*type\b/i, /\bring\s*size\b/i]
	const picked = patterns.map((pattern) => source.find((option) => pattern.test(option.title || option.type || ''))).filter(Boolean)
	return [...picked, ...source.filter((option) => !picked.includes(option))].slice(0, 3)
}

/** @param {unknown} storedIds @param {string} id @param {number} limit */
export function toggleStoredId(storedIds, id, limit = 4) {
	const ids = [...new Set((Array.isArray(storedIds) ? storedIds : []).filter(Boolean).map(String))]
	if (!id) return { ids, active: false }
	if (ids.includes(id)) return { ids: ids.filter((item) => item !== id), active: false }
	return { ids: [...ids.slice(-(Math.max(1, limit) - 1)), id], active: true }
}

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('product-details.logic.js')) {
	const variants = [
		{ id: 'a', options: [{ optionId: 'metal', value: 'Gold' }, { optionId: 'size', value: '6' }] },
		{ id: 'b', options: [{ optionId: 'metal', value: 'Gold' }, { optionId: 'size', value: '7' }] }
	]
	console.assert(variantForOption(variants, variants[0], 'size', '7').id === 'b')
	console.assert(discountPercent(75, 100) === 25)
	console.assert(['yellow', 'rose', 'white'].map((tone) => metalColorTone(`${tone} gold`)).join(',') === 'yellow,rose,white')
	console.assert(productAttributeValue([{ name: 'Metal_Type', value: '14K Gold' }], /metal type/i) === '14K Gold')
	console.assert(productDetailParagraphs('<p>First sentence. Second sentence.</p><li>Skip this.</li>').join('|') === 'First sentence.|Second sentence.')
	console.assert(productImages({ thumbnail: 'a', images: 'a,b' }, {}).join(',') === 'a,b')
	console.assert(customizationOptions([{ id: 'color', title: 'Metal Color' }, { id: 'size', title: 'Ring Size' }, { id: 'quality', title: 'Stone Quality' }, { id: 'metal', title: 'Metal Type' }], []).map((option) => option.id).join(',') === 'quality,metal,size')
	console.assert(toggleStoredId(['a'], 'b', 2).ids.join(',') === 'a,b')
	console.assert(toggleStoredId(['a', 'b'], 'a').ids.join(',') === 'b')
}
