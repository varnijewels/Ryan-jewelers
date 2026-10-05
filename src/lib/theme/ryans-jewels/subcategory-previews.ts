import { mainCategoryForUrl } from './listing-content.js'

type Preview = { name: string; href: string; image: string }
const cache = new Map<string, { expires: number; previews: Preview[] }>()

export async function subcategoryPreviews(url: URL, storeId: string, search: (url: URL) => Promise<any>) {
	const category = mainCategoryForUrl(url)
	if (!category) return []
	const key = `${url.origin}:${storeId}:${category.name}`
	const cached = cache.get(key)
	if (cached && cached.expires > Date.now()) return cached.previews
	const previews: Preview[] = []
	let failed = false
	for (let start = 0; start < category.children.length; start += 4) {
		const batch = await Promise.all(category.children.slice(start, start + 4).map(async (child) => {
			try {
				const result = await search(new URL(child.href, url.origin))
				const products = result.products || result
				const first = products.data?.[0]
				if (!first) return null
				const image = first.thumbnail || first.img || first.image || first.variants?.[0]?.thumbnail
				return image ? { name: child.name, href: child.href, image } : null
			} catch { failed = true; return null }
		}))
		previews.push(...batch.filter((item): item is Preview => !!item))
	}
	if (!failed) {
		if (cache.size > 100) cache.clear()
		cache.set(key, { expires: Date.now() + 5 * 60_000, previews })
	}
	return previews
}
