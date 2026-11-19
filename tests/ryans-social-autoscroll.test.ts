import { cleanup, fireEvent, render, screen } from '@testing-library/svelte'
import { tick } from 'svelte'
import type { EmblaCarouselType } from 'embla-carousel'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import RjSocial from '../src/lib/theme/ryans-jewels/RjSocial.svelte'

const preference = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
const elapse = async (time: number) => { vi.advanceTimersByTime(time); await tick() }

async function mountSocial() {
	const result = render(RjSocial)
	const viewport = result.container.querySelector('.social-viewport') as HTMLElement
	let api!: EmblaCarouselType
	viewport.addEventListener('emblaInit', (event) => api = (event as CustomEvent<EmblaCarouselType>).detail)
	await tick()
	await elapse(0)
	expect(api).toBeDefined()
	return { ...result, api, track: viewport.firstElementChild as HTMLElement, region: screen.getByRole('region', { name: 'From our Instagram' }), autoScroll: api.plugins().autoScroll }
}

describe('Public Instagram previews without an account connection', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		preference.matches = false
		vi.clearAllMocks()
		vi.stubGlobal('matchMedia', vi.fn(() => preference))
		vi.stubGlobal('fetch', vi.fn())
		vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
		vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
		const readStyles = window.getComputedStyle.bind(window)
		vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
			const style = readStyles(element)
			if (element.tagName === 'ARTICLE') style.marginRight = '18px'
			return style
		})
		vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) { return this.tagName === 'ARTICLE' ? 222 : 600 })
		vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400)
		vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (this: HTMLElement) { return this.tagName === 'ARTICLE' ? Array.from(this.parentElement!.children).indexOf(this) * 240 : 0 })
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) { return new DOMRect(this.offsetLeft, 0, this.offsetWidth, this.offsetHeight) })
	})

	afterEach(() => {
		cleanup()
		vi.useRealTimers()
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('shows six public reel previews plus existing posts without requesting an API', async () => {
		const { track } = await mountSocial()
		expect(track.children).toHaveLength(10)
		const reelLinks = Array.from(track.querySelectorAll('a')).map((link) => link.getAttribute('href')).filter((href) => href?.startsWith('https://www.instagram.com/reel/'))
		expect(new Set(reelLinks).size).toBe(6)
		expect(fetch).not.toHaveBeenCalled()
	})

	it('moves horizontally after the reference delay and loops without duplicate slides', async () => {
		const { api, track, autoScroll } = await mountSocial()
		await elapse(1490)
		expect(track.style.transform).toBe('translate3d(0px,0px,0px)')
		await elapse(210)
		expect(track.style.transform).not.toBe('translate3d(0px,0px,0px)')
		expect(api.internalEngine().options.loop).toBe(true)
		api.scrollTo(9, true)
		await elapse(8000)
		expect(autoScroll.isPlaying()).toBe(true)
		expect(track.children).toHaveLength(10)
	})

	it('supports hover pause, explicit pause and manual arrows', async () => {
		const { api, region, autoScroll } = await mountSocial()
		await fireEvent.mouseEnter(region)
		expect(autoScroll.isPlaying()).toBe(false)
		await fireEvent.mouseLeave(region)
		expect(autoScroll.isPlaying()).toBe(true)
		await fireEvent.click(screen.getByRole('button', { name: 'Pause Instagram scrolling' }))
		const next = vi.spyOn(api, 'scrollNext')
		await fireEvent.click(screen.getByRole('button', { name: 'Next Instagram posts' }))
		expect(next).toHaveBeenCalledWith(false)
		expect(autoScroll.isPlaying()).toBe(false)
		await fireEvent.click(screen.getByRole('button', { name: 'Resume Instagram scrolling' }))
		expect(autoScroll.isPlaying()).toBe(true)
	})

	it('honors reduced motion and cleans up the carousel', async () => {
		preference.matches = true
		const { api, autoScroll, unmount } = await mountSocial()
		expect(autoScroll.isPlaying()).toBe(false)
		const destroyed = vi.fn()
		api.on('destroy', destroyed)
		unmount()
		expect(destroyed).toHaveBeenCalledOnce()
		expect(preference.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
	})
})
