/** @param {any} product @param {any} variant */
export function productImages(product, variant) {
	const raw = variant?.images || product?.images || ''
	return [...new Set([variant?.thumbnail || variant?.img || product?.thumbnail, ...String(raw).split(',')].map((image) => image?.trim()).filter(Boolean))]
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

/** @param {any[]} variants @param {any} current @param {Record<string, string>} selections */
export function variantForSelections(variants, current, selections) {
	const wanted = new Map((current?.options || []).map((/** @type {any} */ option) => [option.optionId, option.value]))
	Object.entries(selections).forEach(([optionId, value]) => value && wanted.set(optionId, value))
	return variants.find((variant) => [...wanted].every(([optionId, value]) => (variant.options || []).some((/** @type {any} */ option) => option.optionId === optionId && option.value === value))) || null
}

/** @param {any[]} products @param {any} current @param {string} attribute @param {string} value */
export function groupedProductForAttribute(products, current, attribute, value) {
	if (!current) return null
	const fixedAttributes = Object.keys(current).filter((key) => !['id', 'slug', 'variantId', attribute].includes(key))
	return (products || []).find((product) => product[attribute] === value && fixedAttributes.every((key) => product[key] === current[key])) || null
}

/** @param {any[]} products @param {any} current @param {string} attribute */
export function groupedValuesForAttribute(products, current, attribute) {
	if (!current || !attribute) return []
	const fixedAttributes = Object.keys(current).filter((key) => !['id', 'slug', 'variantId', attribute].includes(key))
	return [...new Set((products || [])
		.filter((product) => fixedAttributes.every((key) => product[key] === current[key]))
		.map((product) => product[attribute])
		.filter(Boolean))]
}

/** @param {any[]} products @param {any} current @param {Record<string, string>} selections */
export function groupedProductForSelections(products, current, selections) {
	if (!current) return null
	const wanted = { ...current, ...selections }
	const attributes = Object.keys(wanted).filter((key) => !['id', 'slug', 'variantId'].includes(key))
	return (products || []).find((product) => attributes.every((key) => product[key] === wanted[key])) || null
}

/** @param {number} price @param {number} mrp */
export function discountPercent(price, mrp) {
	return mrp > price && price >= 0 ? Math.round(((mrp - price) / mrp) * 100) : 0
}

/** @param {string} source */
export function listingImage(source) {
	const mediaHost = 'https://media.jewelwesell.com/'
	return source.startsWith(`${mediaHost}cdn-cgi/image/`)
		? source
		: source.startsWith(mediaHost)
		? source.replace(mediaHost, `${mediaHost}cdn-cgi/image/width=800,format=auto/`)
		: source
}

/** @param {unknown} value */
export function metalColorTone(value) {
	const name = String(value || '').toLowerCase()
	if (/rose|pink|red/.test(name)) return 'rose'
	if (/white|silver|platinum/.test(name)) return 'white'
	return 'yellow'
}

/** @param {unknown} image @param {unknown} color */
export function metalColorImage(image, color) {
	const tone = metalColorTone(color)
	const source = String(image || '')
	if (/_(?:wg|rg)(?=\.[a-z\d]+(?:[?#]|$))/i.test(source)) {
		return source.replace(/_(?:wg|rg)(?=\.[a-z\d]+(?:[?#]|$))/i, tone === 'yellow' ? '' : `_${tone === 'rose' ? 'rg' : 'wg'}`)
	}
	if (/_(?:white|yellow|rose)_/i.test(source)) {
		return source.replace(/_(?:white|yellow|rose)_/i, `_${tone === 'yellow' ? 'yellow' : tone}_`)
	}
	return source.replace(/_(?:yg|rg|wg)(?=\.[a-z\d]+(?:[?#]|$))/i, `_${tone === 'yellow' ? 'yg' : tone === 'rose' ? 'rg' : 'wg'}`)
}

/** @param {any} product */
export function metalVariantChoices(product) {
	const variants = /** @type {any[]} */ (Array.isArray(product?.variants) ? product.variants : [])
	const options = /** @type {any[]} */ (product?.options || [])
	const groupedProducts = /** @type {any[]} */ (product?.pg || [])
	const option = options.find((item) => /\bmetal\s*color\b/i.test(item.title || item.type || ''))
	const aggregationKey = Object.keys(product?.ag || {}).find((key) => /\bmetal\s*color\b/i.test(key))
	const attributeValues = /** @type {any[]} */ (product?.['attributes.Metal_Color'] || (product?.attributes || []).filter((/** @type {any} */ item) => /\bmetal\s*color\b/i.test(item.name || item.title || '')).map((/** @type {any} */ item) => item.value))
	const values = /** @type {any[]} */ ([...(option?.values || []).map((/** @type {any} */ item) => item.value), ...((aggregationKey && product.ag[aggregationKey]) || []), ...attributeValues])
	if (!values.length && option?.id) variants.forEach((variant) => values.push(...(variant.options || []).filter((/** @type {any} */ item) => item.optionId === option.id).map((/** @type {any} */ item) => item.value)))

	const currentGrouped = groupedProducts.find((item) => item.id === product.id || item.slug === product.slug)
	const choices = values.map((value) => {
		const tone = metalColorTone(value)
		const variant = variants.find((item) => (item.options || []).some((/** @type {any} */ variantOption) => variantOption.optionId === option?.id && variantOption.value === value))
		const groupedProduct = aggregationKey ? groupedProductForAttribute(groupedProducts, currentGrouped, aggregationKey, value) : null
		return { value, key: tone === 'rose' ? 'rose' : tone === 'white' ? 'silver' : 'gold', variant, product: groupedProduct }
	})
	return choices.filter((choice, index) => choices.findIndex((item) => item.key === choice.key) === index)
}

/** @param {unknown} shape */
export function diamondImageForShape(shape) {
	const name = String(shape || '').toLowerCase().replace(/[^a-z]/g, '')
	const aliases = /** @type {Record<string, string>} */ ({ round: 'round', oval: 'oval', ovel: 'oval', radiant: 'radiant', pear: 'pear', cushion: 'cushion', cushin: 'cushion', princess: 'princess', emerald: 'emerald', marquise: 'marquise', marquris: 'marquise' })
	const key = Object.keys(aliases).find((alias) => name.includes(alias))
	return key ? `/ryans-jewels/diamonds/${aliases[key]}.jpg` : ''
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
	console.assert(variantForSelections(variants, variants[0], { size: '7' }).id === 'b')
	console.assert(variantForSelections(variants, variants[0], { size: '8' }) === null)
	console.assert(discountPercent(75, 100) === 25)
	console.assert(listingImage('https://media.jewelwesell.com/items/ring.png') === 'https://media.jewelwesell.com/cdn-cgi/image/width=800,format=auto/items/ring.png')
	console.assert(listingImage('https://media.jewelwesell.com/cdn-cgi/image/width=400/items/ring.png') === 'https://media.jewelwesell.com/cdn-cgi/image/width=400/items/ring.png')
	console.assert(['yellow', 'rose', 'white'].map((tone) => metalColorTone(`${tone} gold`)).join(',') === 'yellow,rose,white')
	console.assert(metalColorImage('https://example.com/main_yg.jpg', 'Rose Gold') === 'https://example.com/main_rg.jpg')
	console.assert(metalColorImage('https://example.com/ring_YG_1_wg.png', 'Yellow Gold') === 'https://example.com/ring_YG_1.png')
	console.assert(metalColorImage('https://example.com/ring_YG_1_wg.png', 'Rose Gold') === 'https://example.com/ring_YG_1_rg.png')
	console.assert(metalColorImage('https://example.com/ring_white_top.png', 'Yellow Gold') === 'https://example.com/ring_yellow_top.png')
	console.assert(metalVariantChoices({ options: [{ id: 'metal', title: 'Metal Color', values: [{ value: 'Yellow Gold' }, { value: 'Rose Gold' }] }], variants: [{ id: 'yellow', options: [{ optionId: 'metal', value: 'Yellow Gold' }] }, { id: 'rose', options: [{ optionId: 'metal', value: 'Rose Gold' }] }] }).map((choice) => `${choice.key}:${choice.variant.id}`).join(',') === 'gold:yellow,rose:rose')
	console.assert(metalVariantChoices({ 'attributes.Metal_Color': ['White Gold'] }).map((choice) => choice.value).join(',') === 'White Gold')
	console.assert(diamondImageForShape('Round Brilliant') === '/ryans-jewels/diamonds/round.jpg')
	console.assert(diamondImageForShape('Cushin') === '/ryans-jewels/diamonds/cushion.jpg')
	console.assert(diamondImageForShape('Heart') === '')
	console.assert(productAttributeValue([{ name: 'Metal_Type', value: '14K Gold' }], /metal type/i) === '14K Gold')
	console.assert(productDetailParagraphs('<p>First sentence. Second sentence.</p><li>Skip this.</li>').join('|') === 'First sentence.|Second sentence.')
	console.assert(productImages({ thumbnail: 'a', images: 'a,b' }, {}).join(',') === 'a,b')
	console.assert(productImages({ thumbnail: 'product' }, { thumbnail: 'variant', images: 'variant,detail' }).join(',') === 'variant,detail')
	const grouped = [
		{ id: 'yellow-6', slug: 'yellow-6', Color: 'Yellow', Size: '6', variantId: 'a' },
		{ id: 'rose-6', slug: 'rose-6', Color: 'Rose', Size: '6', variantId: 'b' },
		{ id: 'rose-7', slug: 'rose-7', Color: 'Rose', Size: '7', variantId: 'c' }
	]
	console.assert(groupedProductForAttribute(grouped, grouped[0], 'Color', 'Rose').id === 'rose-6')
	console.assert(groupedValuesForAttribute(grouped, grouped[0], 'Color').join(',') === 'Yellow,Rose')
	console.assert(groupedValuesForAttribute(grouped, grouped[0], 'Size').join(',') === '6')
	console.assert(groupedProductForSelections(grouped, grouped[0], { Color: 'Rose', Size: '7' }).id === 'rose-7')
	console.assert(customizationOptions([{ id: 'color', title: 'Metal Color' }, { id: 'size', title: 'Ring Size' }, { id: 'quality', title: 'Stone Quality' }, { id: 'metal', title: 'Metal Type' }], []).map((option) => option.id).join(',') === 'quality,metal,size')
	console.assert(toggleStoredId(['a'], 'b', 2).ids.join(',') === 'a,b')
	console.assert(toggleStoredId(['a', 'b'], 'a').ids.join(',') === 'b')
}
