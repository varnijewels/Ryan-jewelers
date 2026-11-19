import { cleanup, fireEvent, render, screen } from '@testing-library/svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { tick } from 'svelte'
import RjDiamondCollection from '../src/lib/theme/ryans-jewels/RjDiamondCollection.svelte'
import { diamondShapes } from '../src/lib/theme/ryans-jewels/home-content.js'

afterEach(cleanup)

describe('Natural white diamond collection', () => {
	it('shows the original white diamond without colour controls or a shape strip', () => {
		const { container } = render(RjDiamondCollection)
		expect(screen.getByRole('img', { name: 'Radiant diamond' }).querySelector('image')).toHaveAttribute('href', '/ryans-jewels/shapes/real/radiant.jpg')
		expect(screen.getByRole('heading', { name: 'Diamond collection in natural white.' })).toBeInTheDocument()
		expect(container.querySelector('.detail-colour dd')).toHaveTextContent('Natural white')
		expect(screen.queryByRole('group', { name: 'Diamond shapes' })).not.toBeInTheDocument()
		expect(screen.queryByRole('group', { name: 'Diamond colours' })).not.toBeInTheDocument()
		expect(container.querySelector('filter')).not.toBeInTheDocument()
		expect(screen.getAllByRole('button')).toHaveLength(2)
	})

	it('cycles all ten diamonds with correct store links and wraps in both directions', async () => {
		render(RjDiamondCollection)
		const start = diamondShapes.findIndex(shape => shape.key === 'radiant')
		for (let step = 0; step < diamondShapes.length; step++) {
			const shape = diamondShapes[(start + step) % diamondShapes.length]
			expect(screen.getByRole('img', { name: `${shape.label} diamond` }).querySelector('image')).toHaveAttribute('href', `/ryans-jewels/shapes/real/${shape.key}.jpg`)
			expect(screen.getByRole('img', { name: `${shape.label} diamond` }).querySelector('image')).toHaveAttribute('clip-path', 'url(#rj-diamond-cutout)')
			expect(screen.getByRole('link', { name: `Explore ${shape.label} designs` })).toHaveAttribute('href', shape.href)
			await fireEvent.click(screen.getByRole('button', { name: 'Next diamond' }))
		}
		expect(screen.getByRole('img', { name: 'Radiant diamond' })).toBeInTheDocument()
		await fireEvent.click(screen.getByRole('button', { name: 'Previous diamond' }))
		expect(screen.getByRole('img', { name: 'Oval diamond' })).toBeInTheDocument()
	})

	it('passes the current natural diamond selection to the existing enquiry form', async () => {
		const onEnquire = vi.fn()
		render(RjDiamondCollection, { onEnquire })
		await fireEvent.click(screen.getByRole('button', { name: 'Next diamond' }))
		const link = screen.getByRole('link', { name: 'Enquire about this diamond' })
		expect(link).toHaveAttribute('href', '#rj-enq')
		await fireEvent.click(link)
		expect(onEnquire).toHaveBeenCalledWith("I'm interested in a white pear-cut diamond. Please share available stones and options.")
	})
	it('follows scroll direction, returns to steady marquee speed and cleans up', async () => {
		vi.useFakeTimers()
		vi.stubGlobal('scrollY', 0)
		const animation = { currentTime: 1000, effect: { getTiming: () => ({ duration: 70000 }) }, updatePlaybackRate: vi.fn() }
		const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'getAnimations')
		Object.defineProperty(HTMLElement.prototype, 'getAnimations', { configurable: true, value: () => [animation] })
		try {
			const { unmount } = render(RjDiamondCollection)
			await tick()
			vi.stubGlobal('scrollY', 100)
			await fireEvent.scroll(window)
			expect(animation.updatePlaybackRate).toHaveBeenLastCalledWith(2)
			vi.stubGlobal('scrollY', 10)
			await fireEvent.scroll(window)
			expect(animation.updatePlaybackRate).toHaveBeenLastCalledWith(-1.9)
			expect(animation.currentTime).toBe(71000)
			vi.advanceTimersByTime(600)
			expect(animation.updatePlaybackRate).toHaveBeenLastCalledWith(1)
			unmount()
			const calls = animation.updatePlaybackRate.mock.calls.length
			vi.stubGlobal('scrollY', 200)
			await fireEvent.scroll(window)
			expect(animation.updatePlaybackRate).toHaveBeenCalledTimes(calls)
		} finally {
			cleanup()
			if (original) Object.defineProperty(HTMLElement.prototype, 'getAnimations', original)
			else delete (HTMLElement.prototype as any).getAnimations
			vi.unstubAllGlobals()
			vi.useRealTimers()
		}
	})

})
