import { beforeEach, expect, it, vi } from 'vitest'

const { loadProduct } = vi.hoisted(() => ({
	loadProduct: vi.fn(async (event?: any) => ({ product: { slug: event?.params?.slug } }))
}))

vi.mock('$lib/core/load-functions/index.js', () => ({ wwwProductsSlugLoad: loadProduct }))

import { load } from '../src/routes/(www)/products/[slug]/+page.js'

beforeEach(() => loadProduct.mockClear())

it('reuses recently loaded product data', async () => {
	const event = { params: { slug: 'cached-ring' } } as any

	await load(event)
	await load(event)

	expect(loadProduct).toHaveBeenCalledOnce()
})
