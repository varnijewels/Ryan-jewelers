import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableSmoothPageScroll } from '../src/lib/theme/ryans-jewels/page-scroll.js'

const eligibility = { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }
const reducedMotion = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
let controller: ReturnType<typeof enableSmoothPageScroll> | undefined
const elapse = async (time: number) => { vi.advanceTimersByTime(time); await Promise.resolve() }
const wheel = (target: HTMLElement = document.body) => {
	const event = new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true })
	target.dispatchEvent(event)
	return event
}
const changeEligibility = async (matches: boolean) => {
	eligibility.matches = matches
	eligibility.addEventListener.mock.calls[0][1]()
	await Promise.resolve()
}

describe('Ryan reference smooth page scrolling', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.clearAllMocks()
		eligibility.matches = true
		reducedMotion.matches = false
		vi.stubGlobal('matchMedia', vi.fn((query: string) => query.includes('min-width: 901px') ? eligibility : reducedMotion))
		vi.stubGlobal('scrollY', 0)
		// Give the Vitest window proxy the browser's Window identity for Lenis sizing.
		vi.stubGlobal('Window', class { static [Symbol.hasInstance](value: unknown) { return value === window } })
		vi.spyOn(window, 'scrollTo').mockImplementation((options) => {
			if (typeof options === 'object' && options.top != null) Object.defineProperty(window, 'scrollY', { configurable: true, value: options.top })
		})
		vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (this: HTMLElement) {
			return this.id === 'nested' ? 600 : this === document.documentElement ? 5000 : 0
		})
		vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
			return this.id === 'nested' ? 100 : this === document.documentElement ? window.innerHeight : 0
		})
	})

	afterEach(() => {
		controller?.destroy()
		controller = undefined
		document.body.removeAttribute('style')
		document.getElementById('nested')?.remove()
		vi.useRealTimers()
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('eases real wheel input instead of jumping by the full wheel delta', async () => {
		controller = enableSmoothPageScroll()
		expect(document.documentElement).toHaveClass('lenis')
		expect(wheel().defaultPrevented).toBe(true)
		expect(window.scrollY).toBe(0)
		await elapse(100)
		expect(window.scrollY).toBeGreaterThan(0)
		expect(window.scrollY).toBeLessThan(120)
		const first = window.scrollY
		await elapse(100)
		expect(window.scrollY).toBeGreaterThan(first)
		await elapse(2500)
		expect(window.scrollY).toBe(120)
	})

	it('leaves mobile, coarse pointers and reduced motion native, and responds to media changes', async () => {
		eligibility.matches = false
		reducedMotion.matches = true
		controller = enableSmoothPageScroll()
		expect(document.documentElement).not.toHaveClass('lenis')
		expect(wheel().defaultPrevented).toBe(false)
		expect(controller.reset(0)).toBe(false)
		reducedMotion.matches = false
		await changeEligibility(true)
		expect(document.documentElement).toHaveClass('lenis')
		await changeEligibility(false)
		expect(document.documentElement).not.toHaveClass('lenis')
		expect(wheel().defaultPrevented).toBe(false)
	})

	it('allows native scrolling inside a scrollable cart or menu panel', () => {
		const panel = document.createElement('div')
		panel.id = 'nested'
		panel.style.overflowY = 'auto'
		document.body.append(panel)
		controller = enableSmoothPageScroll()
		expect(wheel(panel).defaultPrevented).toBe(false)
		expect(window.scrollTo).not.toHaveBeenCalled()
	})

	it('stops momentum while the body is locked and resumes after the drawer closes', async () => {
		controller = enableSmoothPageScroll()
		wheel()
		await elapse(100)
		document.body.style.overflow = 'hidden'
		await Promise.resolve()
		const stopped = window.scrollY
		wheel()
		await elapse(1000)
		expect(window.scrollY).toBe(stopped)
		document.body.style.overflow = ''
		await Promise.resolve()
		wheel()
		await elapse(100)
		expect(window.scrollY).toBeGreaterThan(stopped)
	})

	it('synchronizes route resets without carrying old momentum onto the next page', async () => {
		controller = enableSmoothPageScroll()
		wheel()
		await elapse(100)
		expect(controller.reset(0)).toBe(true)
		expect(window.scrollY).toBe(0)
		await elapse(1500)
		expect(window.scrollY).toBe(0)
	})

	it('removes wheel handling, classes, media listeners and animation frames on destroy', async () => {
		controller = enableSmoothPageScroll()
		wheel()
		await elapse(100)
		controller.destroy()
		expect(document.documentElement).not.toHaveClass('lenis')
		expect(wheel().defaultPrevented).toBe(false)
		expect(eligibility.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
		expect(vi.getTimerCount()).toBe(0)
	})
})
