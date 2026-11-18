import { fireEvent, render, screen, waitFor } from '@testing-library/svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import RjProductCard from '../src/lib/theme/ryans-jewels/RjProductCard.svelte'

vi.mock('$app/state', () => ({ page: { data: { store: { id: 'store-1', currency: { code: 'USD' } } } } }))
vi.mock('$lib/core/utils/index.js', () => ({
	formatPrice: (value: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}))

const product = { id: 'ring-1', slug: 'diamond-ring', title: 'Diamond Ring', thumbnail: '/front.jpg', images: '/front.jpg,/side.jpg,/hand.jpg', price: 80, mrp: 100 }
const metalProduct = {
	...product,
	options: [{ id: 'metal', title: 'Metal Color', values: [{ value: 'Yellow Gold' }, { value: 'White Gold' }] }],
	variants: [
		{ id: 'yellow', price: 80, mrp: 100, thumbnail: '/yellow.jpg', images: '/yellow.jpg,/yellow-side.jpg', options: [{ optionId: 'metal', value: 'Yellow Gold' }] },
		{ id: 'white', price: 95, mrp: 120, images: '/white.jpg,/white-side.jpg', options: [{ optionId: 'metal', value: 'White Gold' }] }
	]
}

afterEach(() => vi.unstubAllGlobals())

describe('Ryan card image controls and metals', () => {
	it('loads real metal choices when a card reaches the viewport', async () => {
		let intersect: (entries: any[]) => void = () => {}
		const disconnect = vi.fn()
		vi.stubGlobal('IntersectionObserver', class {
			constructor(callback: typeof intersect) { intersect = callback }
			observe() {}
			disconnect = disconnect
		})
		const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => metalProduct })
		vi.stubGlobal('fetch', fetch)
		render(RjProductCard, { product })
		expect(screen.queryByRole('button', { name: 'Select White Gold' })).not.toBeInTheDocument()
		intersect([{ isIntersecting: true }])
		await waitFor(() => expect(screen.getByRole('button', { name: 'Select White Gold' })).toBeInTheDocument())
		expect(fetch).toHaveBeenCalledTimes(1)
		expect(disconnect).toHaveBeenCalled()
	})

	it('cycles real images in both directions and wraps without navigating', async () => {
		const fetch = vi.fn()
		vi.stubGlobal('fetch', fetch)
		const { container } = render(RjProductCard, { product })
		const clickedParent = vi.fn()
		container.querySelector('a')?.addEventListener('click', clickedParent)
		await fireEvent.click(screen.getByRole('button', { name: 'Next image of Diamond Ring' }))
		expect(screen.getByRole('img', { name: 'Diamond Ring' })).toHaveAttribute('src', '/side.jpg')
		await fireEvent.click(screen.getByRole('button', { name: 'Previous image of Diamond Ring' }))
		await fireEvent.click(screen.getByRole('button', { name: 'Previous image of Diamond Ring' }))
		expect(screen.getByRole('img', { name: 'Diamond Ring' })).toHaveAttribute('src', '/hand.jpg')
		expect(clickedParent).not.toHaveBeenCalled()
		expect(fetch).not.toHaveBeenCalled()
	})

	it('loads missing gallery data once and hides arrows for a genuine single image', async () => {
		const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ...product, images: '/front.jpg' }) })
		vi.stubGlobal('fetch', fetch)
		render(RjProductCard, { product: { ...product, images: undefined } })
		await fireEvent.mouseEnter(screen.getByRole('group', { name: 'Diamond Ring images' }))
		await waitFor(() => expect(screen.queryByRole('button', { name: 'Next image of Diamond Ring' })).not.toBeInTheDocument())
		await fireEvent.mouseEnter(screen.getByRole('group', { name: 'Diamond Ring images' }))
		expect(fetch).toHaveBeenCalledTimes(1)
		expect(fetch).toHaveBeenCalledWith('/api/products/diamond-ring', { headers: { 'x-litekart-store': 'store-1' } })
	})

	it('retries a failed gallery request and keeps the original photo while loading', async () => {
		const fetch = vi.fn()
			.mockRejectedValueOnce(new Error('offline'))
			.mockResolvedValueOnce({ ok: true, json: async () => product })
		vi.stubGlobal('fetch', fetch)
		render(RjProductCard, { product: { ...product, images: undefined } })
		await fireEvent.click(screen.getByRole('button', { name: 'Next image of Diamond Ring' }))
		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Could not load more photos. Try again.'))
		expect(screen.getByRole('img', { name: 'Diamond Ring' })).toHaveAttribute('src', '/front.jpg')
		await fireEvent.click(screen.getByRole('button', { name: 'Next image of Diamond Ring' }))
		await waitFor(() => expect(screen.getByRole('img', { name: 'Diamond Ring' })).toHaveAttribute('src', '/side.jpg'))
		expect(fetch).toHaveBeenCalledTimes(2)
	})

	it('switches price, variant link and gallery to the selected real metal', async () => {
		render(RjProductCard, { product: metalProduct })
		await fireEvent.click(screen.getByRole('button', { name: 'Select White Gold' }))
		expect(screen.getByRole('button', { name: 'Select White Gold' })).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByTestId('product-card-selling-price')).toHaveTextContent('$95.00')
		expect(screen.getByTestId('product-card-mrp')).toHaveTextContent('$120.00')
		expect(screen.getByRole('img', { name: 'Diamond Ring' })).toHaveAttribute('src', '/white.jpg')
		for (const link of screen.getAllByRole('link', { name: 'Diamond Ring' })) expect(link).toHaveAttribute('href', '/products/diamond-ring?variant_id=white')
		await fireEvent.click(screen.getByRole('button', { name: 'Next image of Diamond Ring' }))
		expect(screen.getByRole('img', { name: 'Diamond Ring' })).toHaveAttribute('src', '/white-side.jpg')
		await fireEvent.click(screen.getByRole('button', { name: 'Next image of Diamond Ring' }))
		expect(screen.getByRole('img', { name: 'Diamond Ring' })).toHaveAttribute('src', '/white.jpg')
	})

	it('holds the current metal on grouped-product failure and caches successful selection', async () => {
		const grouped = { ...product, ag: { 'Metal Type': ['Yellow Gold', 'Rose Gold'] }, pg: [
			{ id: product.id, slug: product.slug, 'Metal Type': 'Yellow Gold' },
			{ id: 'rose-ring', slug: 'rose-ring', 'Metal Type': 'Rose Gold' }
		] }
		const fetch = vi.fn().mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({ ok: true, json: async () => ({ ...product, id: 'rose-ring', slug: 'rose-ring', thumbnail: '/rose.jpg', images: '/rose.jpg,/rose-side.jpg', price: 90 }) })
		vi.stubGlobal('fetch', fetch)
		render(RjProductCard, { product: grouped })
		await fireEvent.click(screen.getByRole('button', { name: 'Select Rose Gold' }))
		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Could not load this metal. Try again.'))
		expect(screen.getByTestId('product-card-selling-price')).toHaveTextContent('$80.00')
		expect(screen.getByRole('button', { name: 'Select Rose Gold' })).toHaveAttribute('aria-pressed', 'false')
		await fireEvent.click(screen.getByRole('button', { name: 'Select Rose Gold' }))
		await waitFor(() => expect(screen.getByTestId('product-card-selling-price')).toHaveTextContent('$90.00'))
		expect(screen.getByRole('img', { name: 'Diamond Ring' })).toHaveAttribute('src', '/rose.jpg')
		await fireEvent.click(screen.getByRole('button', { name: 'Select Rose Gold' }))
		expect(fetch).toHaveBeenCalledTimes(2)
	})

	it('does not change the price to an unmapped metal or render invalid prices', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ...product, ag: { 'Metal Color': ['Yellow Gold', 'Rose Gold'] } }) }))
		render(RjProductCard, { product: { ...product, price: 'invalid', ag: { 'Metal Color': ['Yellow Gold', 'Rose Gold'] } } })
		expect(screen.queryByTestId('product-card-selling-price')).not.toBeInTheDocument()
		await fireEvent.click(screen.getByRole('button', { name: 'Select Rose Gold' }))
		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('This metal is not available for this product.'))
		expect(screen.getByRole('button', { name: 'Select Rose Gold' })).toHaveAttribute('aria-pressed', 'false')
	})
})
