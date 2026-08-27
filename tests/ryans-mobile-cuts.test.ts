import { expect, it } from 'vitest'

import { ryansJewelsHome } from '../src/lib/theme/ryans-jewels/home-content.js'

it('keeps the Figma mobile diamond-cut order', () => {
	const { shapes } = ryansJewelsHome.perfectCut
	const rows = [shapes.slice(1, 6), shapes.slice(6)]

	expect(rows.map((row) => row.map((shape) => shape.label))).toEqual([
		['Oval', 'Radiant', 'Pear', 'Cushion', 'Princess'],
		['Asscher', 'Emerald', 'Marquise', 'Heart']
	])
})
