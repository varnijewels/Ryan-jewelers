import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { Mesh, MeshPhysicalMaterial } from 'three'
import { createDiamondGeometry, createRingModel, disposeRingModel, type Ring3DOptions } from '../src/lib/theme/ryans-jewels/ring-3d'
import RjRingPreview from '../src/lib/theme/ryans-jewels/RjRingPreview.svelte'

const defaults: Ring3DOptions = { style: 0, side: 0, crown: 0, shape: 'Round', carat: 1, metal: 'White gold' }

describe('Ring 3D geometry', () => {
	it('builds finite, distinct faceted geometry for every diamond shape', () => {
		const signatures = new Set<string>()
		for (const shape of ['Round', 'Oval', 'Emerald', 'Radiant', 'Pear', 'Princess', 'Cushion', 'Marquise', 'Heart']) {
			const geometry = createDiamondGeometry(shape)
			const positions = Array.from(geometry.getAttribute('position').array)
			expect(positions.every(Number.isFinite)).toBe(true)
			expect(positions.length).toBeGreaterThan(200)
			expect(geometry.getAttribute('normal').count).toBe(positions.length / 3)
			expect(geometry.boundingSphere!.radius).toBeGreaterThan(.8)
			signatures.add(positions.map((value) => value.toFixed(3)).join(','))
			geometry.dispose()
		}
		expect(signatures.size).toBe(9)
	})

	it('supports every band, detail and crown, and applies carat and metal selections', () => {
		for (let style = 0; style < 6; style++) {
			const model = createRingModel({ ...defaults, style, side: style % 4, crown: style % 3, carat: 2, metal: 'Rose gold' })
			let centre: Mesh | undefined
			let band: Mesh | undefined
			model.traverse((object) => {
				if (!(object instanceof Mesh)) return
				expect(Array.from(object.geometry.getAttribute('position').array).every(Number.isFinite)).toBe(true)
				if (object.name === 'Centre diamond') centre = object
				if (object.name === 'Band') band = object
			})
			expect(centre!.scale.x).toBeCloseTo(.34 * Math.cbrt(2))
			expect((centre!.material as MeshPhysicalMaterial).transmission).toBe(1)
			expect((band!.material as MeshPhysicalMaterial).color.getHexString()).toBe('e3aea0')
			expect((band!.material as MeshPhysicalMaterial).metalness).toBe(1)
			disposeRingModel(model)
		}
	})

	it('releases each shared GPU resource once when a design is replaced', () => {
		const model = createRingModel({ ...defaults, side: 1, crown: 2 })
		const resources = new Set<any>()
		model.traverse((object) => {
			if (object instanceof Mesh) { resources.add(object.geometry); resources.add(object.material) }
		})
		const disposed = vi.fn()
		resources.forEach((resource) => resource.addEventListener('dispose', disposed))
		disposeRingModel(model)
		expect(disposed).toHaveBeenCalledTimes(resources.size)
	})
})

it('keeps a labelled reference available when WebGL is unsupported', () => {
	render(RjRingPreview, { options: defaults, zoom: 1, resetKey: 0, poster: '/ring.webp', onzoom: vi.fn() })
	expect(screen.getByRole('status')).toHaveTextContent('3D is unavailable on this device')
	expect(screen.getByRole('img', { name: 'Round white gold ring style reference' })).toHaveAttribute('src', '/ring.webp')
})
