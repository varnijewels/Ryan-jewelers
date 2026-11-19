import { stat } from 'node:fs/promises'
import { cleanup, fireEvent, render, screen } from '@testing-library/svelte'
import { tick } from 'svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import RjEngagementExplore from '../src/lib/theme/ryans-jewels/RjEngagementExplore.svelte'

const preference = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
let stageTop = 1200
const elapse = async (time: number) => { vi.advanceTimersByTime(time); await tick() }
const boxImage = () => screen.getByAltText('Ryan Jewelers Ring Box')
const mountBox = async () => { const result = render(RjEngagementExplore); await tick(); return result }

it('ships the ring-box video, stills and animation fallbacks with the app', async () => {
	for (const asset of ['ryan-ring-box.webm', 'ryan-ring-box-open.webp', 'ryan-ring-box-closed.webp', 'ryan-ring-box-open.gif', 'ryan-ring-box-close.gif']) {
		expect((await stat(`static/videos/${asset}`)).size).toBeGreaterThan(0)
	}
})

describe('Supplied ring-box WebM', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		stageTop = 1200
		preference.matches = false
		vi.clearAllMocks()
		vi.stubGlobal('matchMedia', vi.fn(() => preference))
		vi.stubGlobal('innerWidth', 1440)
		vi.stubGlobal('innerHeight', 1000)
		vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
		vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
			return new DOMRect(0, this.classList.contains('rj-engagement-stage') ? stageTop : 0, 1440, 620)
		})
	})

	afterEach(() => {
		cleanup()
		vi.useRealTimers()
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('autoplays the supplied WebM once on entry and keeps its final frame', async () => {
		const { container } = await mountBox()
		expect(boxImage()).toHaveAttribute('src', '/videos/ryan-ring-box-closed.webp')
		stageTop = 700
		await fireEvent.scroll(window)
		await elapse(20)
		const video = container.querySelector('video')!
		expect(video.querySelector('source')).toHaveAttribute('src', '/videos/ryan-ring-box.webm')
		for (const name of ['autoplay', 'playsinline']) expect(video).toHaveAttribute(name)
		expect(video.muted).toBe(true)
		expect(video).toHaveAttribute('preload', 'auto')
		expect(video).not.toHaveAttribute('loop')
		await fireEvent.loadedData(video)
		expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
		await fireEvent.ended(video)
		expect(container.querySelector('.ring-box')).toHaveClass('is-open')
		expect(container.querySelector('video')).toBe(video)
	})

	it('closes on scroll back and creates a fresh video on re-entry', async () => {
		const { container } = await mountBox()
		stageTop = 700
		await fireEvent.scroll(window)
		await elapse(20)
		const firstVideo = container.querySelector('video')!
		await fireEvent.ended(firstVideo)
		stageTop = 1200
		await fireEvent.scroll(window)
		await elapse(20)
		expect(container.querySelector('video')).not.toBeInTheDocument()
		expect(boxImage()).toHaveAttribute('src', '/videos/ryan-ring-box-close.gif')
		await fireEvent.load(boxImage())
		await elapse(3000)
		expect(boxImage()).toHaveAttribute('src', '/videos/ryan-ring-box-closed.webp')
		stageTop = 700
		await fireEvent.scroll(window)
		await elapse(20)
		expect(container.querySelector('video')).not.toBe(firstVideo)
		expect(container.querySelector('video')).toBeInTheDocument()
	})

	it('supports manual opening and retains the store destinations without extra artwork', async () => {
		const { container } = await mountBox()
		await fireEvent.click(screen.getByRole('button', { name: 'Open ring box' }))
		await fireEvent.ended(container.querySelector('video')!)
		expect(container.querySelector('.ring-box')).toHaveClass('is-open')
		expect(container.querySelectorAll('.ring-box video')).toHaveLength(1)
		expect(container.querySelector('.ring-box-brand, #rj-ring-box-tone')).not.toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Build Your Ring' })).toHaveAttribute('href', '/ring-builder')
		expect(screen.getByRole('link', { name: 'Explore Designs' })).toHaveAttribute('href', '/products?categories=engagement')
	})

	it('uses the open still for reduced motion and cleans up preferences', async () => {
		preference.matches = true
		const { container, unmount } = await mountBox()
		expect(boxImage()).toHaveAttribute('src', '/videos/ryan-ring-box-open.webp')
		expect(container.querySelector('video')).not.toBeInTheDocument()
		expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()
		unmount()
		expect(preference.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
	})

	it('uses the matching GIF if the WebM cannot load', async () => {
		const { container } = await mountBox()
		await fireEvent.click(screen.getByRole('button', { name: 'Open ring box' }))
		await fireEvent.error(container.querySelector('source')!)
		expect(boxImage()).toHaveAttribute('src', '/videos/ryan-ring-box-open.gif')
		await fireEvent.load(boxImage())
		await elapse(3000)
		expect(boxImage()).toHaveAttribute('src', '/videos/ryan-ring-box-open.webp')
	})

	it('uses the matching GIF if autoplay is rejected', async () => {
		vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(new Error('Playback blocked'))
		const { container } = await mountBox()
		await fireEvent.click(screen.getByRole('button', { name: 'Open ring box' }))
		await fireEvent.loadedData(container.querySelector('video')!)
		await tick()
		expect(boxImage()).toHaveAttribute('src', '/videos/ryan-ring-box-open.gif')
	})

})
