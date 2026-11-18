import { cleanup, fireEvent, render, screen } from '@testing-library/svelte'
import { tick } from 'svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import RjAnnouncementBar from '../src/lib/theme/ryans-jewels/RjAnnouncementBar.svelte'

const preference = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
const elapse = async (milliseconds: number) => {
	vi.advanceTimersByTime(milliseconds)
	await tick()
}

describe('Ryan announcement bar', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		preference.matches = false
		vi.clearAllMocks()
		vi.stubGlobal('matchMedia', vi.fn(() => preference))
	})
	afterEach(() => {
		cleanup()
		vi.useRealTimers()
		vi.unstubAllGlobals()
	})

	it('rotates every four seconds, updates the visible link, and loops', async () => {
		render(RjAnnouncementBar)
		await tick()
		expect(screen.getByRole('link', { name: 'Shop Offers' })).toHaveAttribute('href', '/best-offers')
		await elapse(4000)
		expect(screen.queryByRole('link', { name: 'Shop Offers' })).not.toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Build Your Ring' })).toHaveAttribute('href', '/ring-builder')
		await elapse(12000)
		expect(screen.getByRole('link', { name: 'Shop Offers' })).toHaveAttribute('href', '/best-offers')
	})

	it('supports previous/next, pause, and play', async () => {
		render(RjAnnouncementBar)
		await tick()
		await fireEvent.click(screen.getByRole('button', { name: 'Previous announcement' }))
		expect(screen.getByRole('link', { name: 'Explore Services' })).toHaveAttribute('href', '/services')
		await fireEvent.click(screen.getByRole('button', { name: 'Next announcement' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Pause announcements' }))
		await elapse(8000)
		expect(screen.getByRole('link', { name: 'Shop Offers' })).toBeInTheDocument()
		await fireEvent.click(screen.getByRole('button', { name: 'Play announcements' }))
		await elapse(4000)
		expect(screen.getByRole('link', { name: 'Build Your Ring' })).toBeInTheDocument()
	})

	it('holds the message while hovered or focused and resumes after leaving', async () => {
		render(RjAnnouncementBar)
		await tick()
		const region = screen.getByRole('region', { name: 'Store announcements' })
		await fireEvent.mouseEnter(region)
		await elapse(8000)
		expect(screen.getByRole('link', { name: 'Shop Offers' })).toBeInTheDocument()
		await fireEvent.mouseLeave(region)
		await elapse(4000)
		const link = screen.getByRole('link', { name: 'Build Your Ring' })
		await fireEvent.focusIn(link)
		await elapse(8000)
		expect(link).not.toHaveAttribute('inert')
		expect(screen.getByRole('link', { name: 'Build Your Ring' })).toBeInTheDocument()
		await fireEvent.focusOut(link)
		await elapse(4000)
		expect(screen.getByRole('link', { name: 'Shop Jewelry' })).toHaveAttribute('href', '/products')
	})

	it('starts paused for reduced motion and cleans up timers and listeners', async () => {
		preference.matches = true
		const { unmount } = render(RjAnnouncementBar)
		await tick()
		expect(screen.getByRole('button', { name: 'Play announcements' })).toBeInTheDocument()
		await elapse(8000)
		expect(screen.getByRole('link', { name: 'Shop Offers' })).toBeInTheDocument()
		await fireEvent.click(screen.getByRole('button', { name: 'Play announcements' }))
		expect(vi.getTimerCount()).toBe(1)
		unmount()
		expect(vi.getTimerCount()).toBe(0)
		expect(preference.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
	})
})
