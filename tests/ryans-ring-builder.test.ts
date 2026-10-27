import { fireEvent, render, screen, within } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import RjRingBuilder from '../src/lib/theme/ryans-jewels/RjRingBuilder.svelte'

vi.mock('../src/lib/core/utils/index.js', async () => {
	const { clsx } = await import('clsx')
	const { twMerge } = await import('tailwind-merge')
	return { cn: (...values: any[]) => twMerge(clsx(values)) }
})

describe('Ryan Ring Studio UI', () => {
	it('keeps choices across steps and includes them in the review and estimate', async () => {
		render(RjRingBuilder)
		await fireEvent.click(screen.getByRole('button', { name: 'Twist', exact: true }))
		await fireEvent.click(screen.getByRole('button', { name: 'Pavé', exact: true }))
		await fireEvent.click(screen.getByRole('button', { name: 'Continue to diamond' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Oval', exact: true }))
		await fireEvent.click(screen.getByRole('button', { name: '2.00 ct', exact: true }))
		await fireEvent.click(screen.getByRole('button', { name: 'Continue to metal' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Rose gold', exact: true }))
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
		expect(screen.getByRole('button', { name: 'Oval', exact: true })).toHaveAttribute('aria-pressed', 'true')
	})

	it('only clears the design after reset is confirmed', async () => {
		render(RjRingBuilder)
		await fireEvent.click(screen.getByRole('button', { name: 'Halo', exact: true }))
		await fireEvent.click(screen.getByRole('button', { name: 'Start over', exact: true }))
		await fireEvent.click(screen.getByRole('button', { name: 'Keep my design' }))
		expect(screen.getByRole('button', { name: 'Halo', exact: true })).toHaveAttribute('aria-pressed', 'true')

		await fireEvent.click(screen.getByRole('button', { name: 'Start over', exact: true }))
		await fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Start over', exact: true }))
		expect(screen.getByRole('button', { name: 'Solitaire', exact: true })).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByTestId('ring-estimate')).toHaveTextContent('$1,280')
	})
})
