import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, within } from '@testing-library/svelte'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RjRingBuilder from '../src/lib/theme/ryans-jewels/RjRingBuilder.svelte'

vi.mock('../src/lib/core/utils/index.js', async () => {
	const { clsx } = await import('clsx')
	const { twMerge } = await import('tailwind-merge')
	return { cn: (...values: any[]) => twMerge(clsx(values)) }
})

describe('Ryan Ring Studio UI', () => {
	beforeEach(() => { HTMLElement.prototype.scrollIntoView = vi.fn() })
	it('keeps choices across steps and includes them in the review and estimate', async () => {
		render(RjRingBuilder)
		await fireEvent.click(screen.getByRole('button', { name: 'Twist' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Pavé' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Continue to diamond' }))
		expect(screen.getByRole('heading', { name: 'Choose a diamond' })).toHaveFocus()
		expect(HTMLElement.prototype.scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest', behavior: 'instant' })
		await fireEvent.click(screen.getByRole('button', { name: 'Oval' }))
		await fireEvent.click(screen.getByRole('button', { name: '2.00 ct' }))
		expect(screen.getByText('Oval · 2.00 ct', { exact: true })).toBeInTheDocument()
		await fireEvent.click(screen.getByRole('button', { name: 'Continue to metal' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Rose gold' }))
		await fireEvent.click(screen.getByRole('button', { name: /18K gold/ }))
		await fireEvent.click(screen.getByRole('button', { name: 'Continue to personalise' }))
		await fireEvent.input(screen.getByLabelText(/A word, a date/), { target: { value: 'FOREVER' } })
		await fireEvent.click(screen.getByRole('button', { name: 'Review your ring' }))

		expect(screen.getByText('Twist · Pavé · Solitaire')).toBeInTheDocument()
		expect(screen.getByText('Oval · 2.00 ct · Lab grown')).toBeInTheDocument()
		expect(within(screen.getByRole('button', { name: 'Edit metal' }).parentElement!).getByText('18K rose gold')).toBeInTheDocument()
		expect(screen.getByText('FOREVER', { exact: true })).toBeInTheDocument()
		expect(screen.getByTestId('ring-estimate')).toHaveTextContent('$2,690')
		expect(screen.getByRole('button', { name: 'Download your design' })).toBeEnabled()

		await fireEvent.click(screen.getByRole('button', { name: 'Edit diamond' }))
		expect(screen.getByRole('button', { name: 'Oval' })).toHaveAttribute('aria-pressed', 'true')
	})

	it('starts with live preview and keeps the style reference in sync with the selected band', async () => {
		render(RjRingBuilder)
		expect(screen.getByRole('button', { name: '360° preview' })).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByText('3D is unavailable on this device. Showing a style reference.')).toHaveAttribute('role', 'status')
		await fireEvent.click(screen.getByRole('button', { name: 'Style reference' }))
		expect(screen.getByRole('img', { name: 'Classic band style reference' })).toBeInTheDocument()
		await fireEvent.click(screen.getByRole('button', { name: 'Twist' }))
		expect(screen.getByRole('img', { name: 'Twist band style reference' })).toHaveAttribute('src', '/ryans-jewels/ring-builder/options/realistic/twist.webp')
		await fireEvent.click(screen.getByRole('button', { name: '360° preview' }))
		expect(screen.getByRole('button', { name: 'Twist' })).toHaveAttribute('aria-pressed', 'true')
	})

	it('only clears the design after reset is confirmed', async () => {
		render(RjRingBuilder)
		await fireEvent.click(screen.getByRole('button', { name: 'Halo' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Start over' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Keep my design' }))
		expect(screen.getByRole('button', { name: 'Halo' })).toHaveAttribute('aria-pressed', 'true')

		await fireEvent.click(screen.getByRole('button', { name: 'Start over' }))
		await fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Start over' }))
		expect(screen.getByRole('button', { name: 'Solitaire' })).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByTestId('ring-estimate')).toHaveTextContent('$1,280')
	})
})
