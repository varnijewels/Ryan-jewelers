import { cleanup, fireEvent, render, screen } from '@testing-library/svelte'
import { tick } from 'svelte'
import type { EmblaCarouselType } from 'embla-carousel'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import RjProductRow from '../src/lib/theme/ryans-jewels/RjProductRow.svelte'

vi.mock('$app/state', () => ({ page: { data: { store: { currency: { code: 'USD' } } } } }))
vi.mock('$lib/core/utils/index.js', () => ({ formatPrice: (value: number) => `$${value}` }))

const products = ['Ring', 'Ring', 'Ring', 'Pendant', 'Pendant', 'Pendant', 'Earrings', 'Earrings'].map((category, index) => ({ id: `${index}`, slug: `product-${index}`, title: `${category} ${index}`, price: 80, thumbnail: `/${index}.jpg` }))
const preference = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
const elapse = async (time: number) => { vi.advanceTimersByTime(time); await tick() }
const position = (track: HTMLElement) => Number(track.style.transform.match(/translate3d\(([-.\d]+)px/)?.[1] || 0)

async function mountRow(items = products) {
	const result = render(RjProductRow, { products: items })
	const viewport = result.container.querySelector('.rj-row-viewport') as HTMLElement
	let api!: EmblaCarouselType
	viewport.addEventListener('emblaInit', (event) => api = (event as CustomEvent<EmblaCarouselType>).detail)
	await tick()
	await elapse(0)
	expect(api).toBeDefined()
	return { ...result, api, viewport, track: viewport.firstElementChild as HTMLElement, region: screen.getByRole('region', { name: 'Featured products' }), autoScroll: api.plugins().autoScroll }
}

describe('Ryan reference continuous product scrolling', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		preference.matches = false
		vi.clearAllMocks()
		vi.stubGlobal('matchMedia', vi.fn(() => preference))
		vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
		// jsdom does not resolve stylesheet margins used to measure the loop seam.
		const readStyles = window.getComputedStyle.bind(window)
		vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
			const style = readStyles(element)
			if (element.classList.contains('rj-card')) style.marginRight = '20px'
			return style
		})
		vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
			return this.classList.contains('rj-card') ? 280 : 600
		})
		vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(360)
		vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (this: HTMLElement) {
			return this.classList.contains('rj-card') ? Array.from(this.parentElement!.children).indexOf(this) * 300 : 0
		})
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
			return new DOMRect(this.offsetLeft, 0, this.offsetWidth, this.offsetHeight)
		})
	})

	afterEach(() => {
		cleanup()
		vi.useRealTimers()
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('starts after 1.5 seconds and moves continuously at the reference speed', async () => {
		const { track } = await mountRow()
		await elapse(1490)
		expect(position(track)).toBe(0)
		await elapse(210)
		const first = position(track)
		expect(first).toBeLessThan(0)
		expect(first).toBeGreaterThan(-30)
		await elapse(200)
		expect(position(track)).toBeLessThan(first)
		expect(first - position(track)).toBeLessThan(20)
	})

	it('loops real slides seamlessly without a native scroll reset or duplicate cards', async () => {
		const { api, track, autoScroll } = await mountRow()
		expect(api.internalEngine().options.loop).toBe(true)
		api.scrollTo(products.length - 1, true)
		await elapse(8000)
		expect(autoScroll.isPlaying()).toBe(true)
		expect(api.canScrollNext()).toBe(true)
		expect(api.canScrollPrev()).toBe(true)
		expect(track.children).toHaveLength(products.length)
		expect(Array.from(track.children).some((slide) => (slide as HTMLElement).style.transform)).toBe(true)
	})

	it('pauses for hover, focus and touch, then resumes through the reference delay', async () => {
		const { region, viewport, track, autoScroll } = await mountRow()
		await elapse(1700)
		for (const [start, end] of [['mouseEnter', 'mouseLeave'], ['focusIn', 'focusOut'], ['touchStart', 'touchEnd']] as const) {
			const target = start === 'focusIn' ? viewport : region
			await fireEvent[start](target)
			expect(autoScroll.isPlaying()).toBe(false)
			const frozen = position(track)
			await elapse(3000)
			expect(Math.abs(position(track) - frozen)).toBeLessThanOrEqual(1)
			await fireEvent[end](target)
			expect(autoScroll.isPlaying()).toBe(true)
			await elapse(1700)
			expect(position(track)).not.toBe(frozen)
		}
	})

	it('keeps user pause authoritative and supports both manual arrows', async () => {
		const { api, region, autoScroll } = await mountRow()
		const next = vi.spyOn(api, 'scrollNext')
		const previous = vi.spyOn(api, 'scrollPrev')
		await fireEvent.click(screen.getByRole('button', { name: 'Pause product scrolling' }))
		await fireEvent.mouseEnter(region)
		await fireEvent.mouseLeave(region)
		await elapse(3000)
		expect(autoScroll.isPlaying()).toBe(false)
		await fireEvent.click(screen.getByRole('button', { name: 'Next products' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Previous products' }))
		expect(next).toHaveBeenCalledWith(false)
		expect(previous).toHaveBeenCalledWith(false)
		expect(autoScroll.isPlaying()).toBe(false)
		await fireEvent.click(screen.getByRole('button', { name: 'Resume product scrolling' }))
		expect(autoScroll.isPlaying()).toBe(true)
	})

	it('keeps reduced motion paused and uses instant manual navigation', async () => {
		preference.matches = true
		const { api, autoScroll } = await mountRow()
		const next = vi.spyOn(api, 'scrollNext')
		expect(autoScroll.isPlaying()).toBe(false)
		await fireEvent.click(screen.getByRole('button', { name: 'Next products' }))
		expect(next).toHaveBeenCalledWith(true)
		await fireEvent.click(screen.getByRole('button', { name: 'Resume product scrolling' }))
		preference.addEventListener.mock.calls[0][1]()
		await tick()
		expect(autoScroll.isPlaying()).toBe(false)
	})

	it('rebuilds at the first real product when categories change', async () => {
		const { api, track, autoScroll } = await mountRow()
		await fireEvent.focusIn(screen.getByRole('button', { name: 'Pendants' }))
		expect(autoScroll.isPlaying()).toBe(true)
		await fireEvent.click(screen.getByRole('button', { name: 'Pendants' }))
		expect(track.children).toHaveLength(3)
		expect(api.selectedScrollSnap()).toBe(0)
		await fireEvent.click(screen.getByRole('button', { name: 'Earrings' }))
		expect(track.children).toHaveLength(2)
		expect(screen.queryByText(/No earrings/)).not.toBeInTheDocument()
	})

	it('stops in hidden tabs and destroys the real carousel on unmount', async () => {
		const { api, autoScroll, unmount } = await mountRow()
		const destroyed = vi.fn()
		api.on('destroy', destroyed)
		vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
		await fireEvent(document, new Event('visibilitychange'))
		expect(autoScroll.isPlaying()).toBe(false)
		vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
		await fireEvent(document, new Event('visibilitychange'))
		expect(autoScroll.isPlaying()).toBe(true)
		unmount()
		expect(destroyed).toHaveBeenCalledTimes(1)
		expect(autoScroll.isPlaying()).toBe(false)
		expect(preference.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
	})

	it('does not animate when all products fit in the viewport', async () => {
		const { autoScroll } = await mountRow(products.slice(0, 2))
		expect(autoScroll.isPlaying()).toBe(false)
		expect(screen.getByRole('button', { name: 'Pause product scrolling' })).toBeDisabled()
	})
})
