import { catalogNavigation } from './catalog-navigation.js'
import { realCatalogUrl } from './product-filters.js'

const sortedCategories = (value: string | null) => (value || '').split(',').filter(Boolean).sort().join(',')
export function mainCategoryForUrl(url: URL) {
	const alias = url.pathname.match(/^\/categories\/(rings|earrings|pendants|bracelets|necklaces)\/?$/)?.[1]
	if (alias) return catalogNavigation.find((item) => item.name.toLowerCase() === alias)
	const normalized = realCatalogUrl(url)
	return catalogNavigation.find((item) => {
		const target = new URL(item.href, url.origin)
		const categories = target.searchParams.get('categories')
		if (categories) return sortedCategories(normalized.searchParams.get('categories')) === sortedCategories(categories)
		return !normalized.searchParams.has('categories') && normalized.searchParams.get('search')?.toLowerCase() === target.searchParams.get('search')?.toLowerCase()
	})
}

export const categoryBanners: Record<string, { image: string; alt: string; copy: string; product?: boolean; collection?: { image: string; alt: string }[] }> = {
	Rings: { image: '/ryans-jewels/home/campaign/split-shank-eternity-v2.webp', alt: 'White gold diamond rings worn together', copy: 'A ring for your moment. A style that feels like you.' },
	Earrings: { image: '/ryans-jewels/home/campaign/solitaire-stud-closeup-v3.webp', alt: 'A solitaire diamond stud in white gold', copy: 'From everyday studs to something a little special.' },
	Pendants: { image: '/ryans-jewels/listing/pendants-banner.webp', alt: 'Ryan Jewelers diamond pendants', copy: 'A personal touch, kept close.', product: true, collection: [
		{ image: '/ryans-jewels/listing/pendant-collection-1.webp', alt: 'Yellow gold diamond bow pendant' },
		{ image: '/ryans-jewels/listing/pendant-collection-2.webp', alt: 'Rose gold filigree diamond pendant' },
		{ image: '/ryans-jewels/listing/pendant-collection-3.webp', alt: 'Yellow gold swirl diamond pendant' }
	] },
	Bracelets: { image: '/ryans-jewels/listing/bracelets-banner-v2.webp', alt: 'White gold diamond bolo bracelet', copy: 'Simple lines. Beautiful details.', product: true },
	Necklaces: { image: '/ryans-jewels/listing/necklaces-banner.webp', alt: 'Ryan Jewelers diamond necklace', copy: 'Made to wear your way, alone or layered.', product: true }
}
