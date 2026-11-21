import { fireEvent, render, screen, within } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import RjStoryMoments from '../src/lib/theme/ryans-jewels/RjStoryMoments.svelte'

vi.mock('svelte/transition', () => ({ fade: () => ({ duration: 0 }) }))

describe('Ryan moments journal', () => {
	it('opens with one meaningful story and a working engagement collection link', () => {
		render(RjStoryMoments)
		const panel = screen.getByRole('tabpanel', { name: 'A new beginning' })
		expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
		expect(within(panel).getByRole('link', { name: 'Explore engagement rings' })).toHaveAttribute('href', '/products?categories=engagement')
		expect(within(panel).getByRole('img')).toHaveAttribute('src', '/ryans-jewels/home/campaign/split-shank-eternity-v2.webp')
	})

	it('changes the photo, story and destination together without navigating away', async () => {
		render(RjStoryMoments)
		await fireEvent.click(screen.getByRole('tab', { name: 'A thoughtful gift' }))
		const panel = screen.getByRole('tabpanel', { name: 'A thoughtful gift' })
		expect(screen.getByRole('tab', { name: 'A thoughtful gift' })).toHaveAttribute('aria-selected', 'true')
		expect(within(panel).getByRole('heading')).toHaveTextContent('The thought is what makes it theirs.')
		expect(within(panel).getByRole('img')).toHaveAttribute('src', '/ryans-jewels/home/spotlights/studio-diamond-jewelry-v1.webp')
		expect(within(panel).getByRole('link', { name: 'Discover meaningful gifts' })).toHaveAttribute('href', '/products?categories=pendants')
		expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
	})

	it('supports arrow keys, Home and End with a matching active panel', async () => {
		render(RjStoryMoments)
		const first = screen.getByRole('tab', { name: 'A new beginning' })
		first.focus()
		await fireEvent.keyDown(first, { key: 'ArrowDown' })
		const everyday = screen.getByRole('tab', { name: 'Everyday brilliance' })
		expect(everyday).toHaveFocus()
		expect(everyday).toHaveAttribute('aria-selected', 'true')
		expect(within(screen.getByRole('tabpanel', { name: 'Everyday brilliance' })).getByRole('link')).toHaveAttribute('href', '/products?categories=women')
		await fireEvent.keyDown(everyday, { key: 'End' })
		const gift = screen.getByRole('tab', { name: 'A thoughtful gift' })
		expect(gift).toHaveFocus()
		await fireEvent.keyDown(gift, { key: 'Home' })
		expect(first).toHaveFocus()
		expect(screen.getByRole('tabpanel', { name: 'A new beginning' })).toBeInTheDocument()
	})
})
