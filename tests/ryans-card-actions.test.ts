import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RjProductCard from '../src/lib/theme/ryans-jewels/RjProductCard.svelte'

vi.mock('svelte/transition', () => ({ fly: () => ({ duration: 0 }) }))
vi.mock('$app/state', () => ({ page: { data: { store: { id: 'store-1', currency: { code: 'USD' } } } } }))
vi.mock('$lib/core/utils/index.js', () => ({
    cn: (...values: any[]) => values.filter(Boolean).join(' '),
    formatPrice: (value: number) => `$${Number(value).toFixed(2)}`
}))

const product = { id: 'ring-1', slug: 'diamond-ring', title: 'Diamond Ring', thumbnail: '/front.jpg', images: '/front.jpg,/side.jpg', price: 80, mrp: 100, description: '<p>A carefully crafted ring.</p>' }

beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => product }))
})

describe('Ryan card hover actions', () => {
    it('opens an accessible preview with real details and manual photos, then restores focus', async () => {
        render(RjProductCard, { product })
        expect(screen.getByRole('link', { name: 'Buy Diamond Ring now' })).toHaveAttribute('href', '/products/diamond-ring')
        const trigger = screen.getByRole('button', { name: 'Quick view Diamond Ring' })
        await fireEvent.click(trigger)
        const dialog = await screen.findByRole('dialog', { name: 'Diamond Ring' })
        expect(within(dialog).getByText('A carefully crafted ring.')).toBeInTheDocument()
        expect(within(dialog).getByText('$80.00')).toBeInTheDocument()
        expect(within(dialog).getByRole('link', { name: 'View full details' })).toHaveAttribute('href', '/products/diamond-ring')
        await fireEvent.click(within(dialog).getByRole('button', { name: 'Next preview photo' }))
        expect(within(dialog).getByRole('img', { name: 'Diamond Ring' })).toHaveAttribute('src', '/side.jpg')
        await fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        await waitFor(() => expect(trigger).toHaveFocus())
    })

    it('keeps the selected metal price, photo and variant link in quick view', async () => {
        const item = { ...product, options: [{ id: 'metal', title: 'Metal Color', values: [{ value: 'White Gold' }] }], variants: [{ id: 'white', price: 95, mrp: 120, images: '/white.jpg', options: [{ optionId: 'metal', value: 'White Gold' }] }] }
        vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => item } as Response)
        render(RjProductCard, { product: item })
        await fireEvent.click(screen.getByRole('button', { name: 'Select White Gold' }))
        expect(screen.getByRole('link', { name: 'Buy Diamond Ring now' })).toHaveAttribute('href', '/products/diamond-ring?variant_id=white')
        await fireEvent.click(screen.getByRole('button', { name: 'Quick view Diamond Ring' }))
        const dialog = await screen.findByRole('dialog', { name: 'Diamond Ring' })
        expect(within(dialog).getByText('$95.00')).toBeInTheDocument()
        expect(within(dialog).getByRole('img', { name: 'Diamond Ring' })).toHaveAttribute('src', '/white.jpg')
        expect(within(dialog).getByRole('link', { name: 'View full details' })).toHaveAttribute('href', '/products/diamond-ring?variant_id=white')
    })

    it('keeps the preview usable when additional product details fail', async () => {
        vi.mocked(fetch).mockRejectedValue(new Error('offline'))
        render(RjProductCard, { product })
        await fireEvent.click(screen.getByRole('button', { name: 'Quick view Diamond Ring' }))
        const dialog = await screen.findByRole('dialog', { name: 'Diamond Ring' })
        await waitFor(() => expect(within(dialog).getByRole('status')).toHaveTextContent('More details are available on the product page.'))
        expect(within(dialog).getByRole('link', { name: 'View full details' })).toHaveAttribute('href', '/products/diamond-ring')
    })

})
