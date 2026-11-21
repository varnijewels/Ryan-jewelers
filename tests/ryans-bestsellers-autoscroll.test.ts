import { cleanup, fireEvent, render, screen } from '@testing-library/svelte'
import { tick } from 'svelte'
import type { EmblaCarouselType } from 'embla-carousel'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import RjBestSellers from '../src/lib/theme/ryans-jewels/RjBestSellers.svelte'

vi.mock('$app/state', () => ({ page: { data: { store: { currency: { code: 'USD' } } } } }))
vi.mock('$lib/core/utils/index.js', () => ({ cn: (...values: any[]) => values.filter(Boolean).join(' '), formatPrice: (value: number) => `$${value}` }))
vi.mock('$lib/core/composables/index.js', async () => ({ ProductCardRenderer: (await import('./mocks/product-card-renderer.svelte')).default }))

const products = ['Ring', 'Ring', 'Ring', 'Pendant', 'Pendant', 'Earrings', 'Bracelet', 'Necklace'].map((category, index) => ({ id: `${index}`, slug: `product-${index}`, title: `${category} ${index}`, price: 80, thumbnail: `/${index}.jpg` }))
const preference = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
const elapse = async (time: number) => { vi.advanceTimersByTime(time); await tick() }

async function mountSellers(items = products) {
	const result = render(RjBestSellers, { products: items })
	const viewport = result.container.querySelector('.rj-bestsellers-viewport') as HTMLElement
	let api!: EmblaCarouselType
	viewport.addEventListener('emblaInit', (event) => api = (event as CustomEvent<EmblaCarouselType>).detail)
	await tick()
	await elapse(0)
	expect(api).toBeDefined()
	return { ...result, api, viewport, track: viewport.firstElementChild as HTMLElement, region: screen.getByRole('region', { name: 'our best sellers' }), autoScroll: api.plugins().autoScroll }
}

describe('Best sellers shows every category in a continuous carousel', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		preference.matches = false
		vi.clearAllMocks()
		vi.stubGlobal('matchMedia', vi.fn(() => preference))
		vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
		const readStyles = window.getComputedStyle.bind(window)
		vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
			const style = readStyles(element)
			if (element.classList.contains('rj-tile')) style.marginRight = '25px'
			return style
		})
		vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
			return this.classList.contains('rj-tile') ? 285 : 600
		})
		vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600)
		vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(360)
		vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (this: HTMLElement) {
			return this.classList.contains('rj-tile') ? Array.from(this.parentElement!.children).indexOf(this) * 310 : 0
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

	it('shows all supplied categories without tabs and places both arrows in the heading', async () => {
		const { container, track } = await mountSellers()
		expect(track.children).toHaveLength(products.length)
		expect(Array.from(track.querySelectorAll('.rj-card-name')).slice(0, 5).map((node) => node.textContent)).toEqual(['Ring 0', 'Pendant 3', 'Earrings 5', 'Bracelet 6', 'Necklace 7'])
		expect(screen.queryByRole('button', { name: 'Rings' })).not.toBeInTheDocument()
		expect(screen.queryByRole('button', { name: 'Earrings' })).not.toBeInTheDocument()
		for (const name of ['Previous products', 'Next products']) {
			expect(container.querySelector('.rj-bestsellers-head')).toContainElement(screen.getByRole('button', { name }))
		}
	})

	it('moves after the reference delay, loops real slides and supports manual arrows', async () => {
		const { api, track, autoScroll } = await mountSellers()
		await elapse(1490)
		expect(track.style.transform).toBe('translate3d(0px,0px,0px)')
		await elapse(210)
		expect(track.style.transform).not.toBe('translate3d(0px,0px,0px)')
		expect(api.internalEngine().options.loop).toBe(true)
		api.scrollTo(products.length - 1, true)
		await elapse(8000)
		expect(autoScroll.isPlaying()).toBe(true)
		expect(api.canScrollNext()).toBe(true)
		expect(track.children).toHaveLength(products.length)
		const next = vi.spyOn(api, 'scrollNext')
		const previous = vi.spyOn(api, 'scrollPrev')
		await fireEvent.click(screen.getByRole('button', { name: 'Next products' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Previous products' }))
		expect(next).toHaveBeenCalledWith(false)
		expect(previous).toHaveBeenCalledWith(false)
	})

	it('pauses on hover and keeps explicit pause active until resumed', async () => {
		const { region, autoScroll } = await mountSellers()
		await fireEvent.mouseEnter(region)
		expect(autoScroll.isPlaying()).toBe(false)
		await fireEvent.mouseLeave(region)
		expect(autoScroll.isPlaying()).toBe(true)
		await fireEvent.click(screen.getByRole('button', { name: 'Pause product scrolling' }))
		await fireEvent.mouseEnter(region)
		await fireEvent.mouseLeave(region)
		expect(autoScroll.isPlaying()).toBe(false)
		await fireEvent.click(screen.getByRole('button', { name: 'Resume product scrolling' }))
		expect(autoScroll.isPlaying()).toBe(true)
	})

	it('honors reduced motion and allows accessible scrollbar navigation', async () => {
		preference.matches = true
		const { api, autoScroll } = await mountSellers()
		expect(autoScroll.isPlaying()).toBe(false)
		const next = vi.spyOn(api, 'scrollNext')
		await fireEvent.click(screen.getByRole('button', { name: 'Next products' }))
		expect(next).toHaveBeenCalledWith(true)
		const seek = vi.spyOn(api, 'scrollTo')
		await fireEvent.input(screen.getByRole('slider'), { target: { value: '50' } })
		expect(seek).toHaveBeenCalledWith(4, true)
	})
})
