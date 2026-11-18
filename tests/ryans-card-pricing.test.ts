import { render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import RjProductCard from '../src/lib/theme/ryans-jewels/RjProductCard.svelte'

vi.mock('$app/state', () => ({ page: { data: { store: { currency: { code: 'USD' } } } } }))
vi.mock('$lib/core/utils/index.js', () => ({
	formatPrice: (value: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}))

const product = { id: 'ring-1', slug: 'diamond-ring', title: 'Diamond Ring', thumbnail: '/ring.jpg', price: 80, mrp: 100 }

describe('Ryan product card prices', () => {
	it('shows the live selling price, comparison price and discount together', () => {
		render(RjProductCard, { product })
		expect(screen.getByTestId('product-card-selling-price')).toHaveTextContent('$80.00')
		expect(screen.getByTestId('product-card-mrp')).toHaveTextContent('$100.00')
		expect(screen.getByTestId('product-card-discount')).toHaveTextContent('20% off on product')
		expect(screen.getByRole('img', { name: 'Diamond Ring' })).toHaveAttribute('src', '/ring.jpg')
		expect(screen.queryByRole('button', { name: 'Select Yellow Gold' })).not.toBeInTheDocument()
	})

	it.each([undefined, null, 0, 75, 80, 'invalid', Infinity])('does not invent a discount for comparison price %s', (mrp) => {
		render(RjProductCard, { product: { ...product, mrp } })
		expect(screen.getByTestId('product-card-selling-price')).toHaveTextContent('$80.00')
		expect(screen.queryByTestId('product-card-mrp')).not.toBeInTheDocument()
		expect(screen.queryByTestId('product-card-discount')).not.toBeInTheDocument()
	})

	it('keeps a real zero selling price and a valid discount', () => {
		render(RjProductCard, { product: { ...product, price: 0 } })
		expect(screen.getByTestId('product-card-selling-price')).toHaveTextContent('$0.00')
		expect(screen.getByTestId('product-card-discount')).toHaveTextContent('100% off on product')
	})

	it('preserves optional metal selection controls', () => {
		render(RjProductCard, { product: { ...product, 'attributes.Metal_Color': ['Yellow Gold'] }, showSwatches: true })
		expect(screen.getByRole('button', { name: 'Select Yellow Gold' })).toHaveAttribute('aria-pressed', 'false')
	})
})
