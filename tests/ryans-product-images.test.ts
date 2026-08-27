import { readFile, stat } from 'node:fs/promises'

import sharp from 'sharp'
import { expect, it } from 'vitest'

const assetDir = 'static/ryans-jewels/product/customizer'

it('keeps deferred customizer images sharp and lightweight', async () => {
	const source = await readFile('src/lib/theme/ryans-jewels/RjCustomizeModal.svelte', 'utf8')
	const assets = ['metal-yellow.webp', 'metal-white.webp', 'metal-rose.webp']

	expect(source).toContain('bind:open={isOpen}')
	expect(source).toMatch(/\{#if isOpen\}[\s\S]*rj-customizer-form/)

	for (const asset of assets) {
		const path = `${assetDir}/${asset}`
		const [{ width, height }, { size }] = await Promise.all([sharp(path).metadata(), stat(path)])

		expect(width).toBeGreaterThanOrEqual(320)
		expect(height).toBeGreaterThanOrEqual(240)
		expect(size).toBeLessThan(100_000)
	}
})
