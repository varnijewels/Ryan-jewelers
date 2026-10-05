import { wwwProductsLoad } from '$lib/core/load-functions/index.js'
import { applyClientFilters, clientFilterKeys, clientSorts, realCatalogUrl, listingFilterOptions, selectedValues } from '$lib/theme/ryans-jewels/product-filters.js'
import { subcategoryPreviews } from '$lib/theme/ryans-jewels/subcategory-previews.js'

export const load = async (event: any) => {
 event.depends('app:products')
 const requestUrl = realCatalogUrl(event.url)
 const hasClientFilters = clientFilterKeys.some(key => requestUrl.searchParams.has(key))
 const hasClientSort = clientSorts.has(requestUrl.searchParams.get('uiSort') || '')
 clientFilterKeys.forEach(key => requestUrl.searchParams.delete(key))
 requestUrl.searchParams.delete('uiSort')
 if (hasClientFilters || hasClientSort) requestUrl.searchParams.set('page', '1')
 let allVariantFacets: Record<string, Record<string, number>> = {}
 const result = await wwwProductsLoad({ ...event, url: requestUrl, fetch: async (input: any, init: any) => {
  const response = await event.fetch(input, init)
  if (String(input?.url || input).includes('/api/ms/products') && response.ok) {
   const raw = await response.clone().json()
   allVariantFacets = raw.allfacetDistribution || {}
  }
  return response
 } })
 const availableFacets = { ...result.products.facets?.allFilters }
 // Grouped facets omit colors/purities belonging to non-default variants.
 if (result.products.count) {
  for (const key of ['attributes.Metal_Type', 'attributes.Metal_Color', 'options.Metal_Color', 'options.Metal_Type']) {
   availableFacets[key] = { ...availableFacets[key], ...allVariantFacets[key] }
  }
  availableFacets['tags.name'] = { ...availableFacets['tags.name'], ...Object.fromEntries(Object.entries(allVariantFacets['tags.name'] || {}).filter(([name]) => /^\d{2}k(?: gold)?$/i.test(name))) }
 }
 const storeId = result.products.data?.[0]?.storeId || event.data?.store?.id || (await event.parent())?.store?.id || ''
 const ryanSubcategories = await subcategoryPreviews(event.url, storeId, url => wwwProductsLoad({ ...event, url }))
 if (!hasClientFilters && !hasClientSort) return { ...result, ryanSubcategories, ryanFilterOptions: listingFilterOptions(result.products.data || [], availableFacets) }

 async function allPages(url: URL, first?: any) {
  const initial = first || await wwwProductsLoad({ ...event, url })
  const products = [...(initial.products.data || [])]
  for (let start = 2; start <= initial.products.totalPages; start += 4) {
   const pages = await Promise.all(Array.from({ length: Math.min(4, initial.products.totalPages - start + 1) }, async (_, index) => {
    const next = new URL(url); next.searchParams.set('page', String(start + index))
    return wwwProductsLoad({ ...event, url: next })
   }))
   products.push(...pages.flatMap(page => page.products.data || []))
  }
  return products
 }

 // Search the variants BEFORE the API groups them into product cards. Filtering
 // grouped defaults alone hides white-gold and 14K versions of the same design.
 const metals = selectedValues(event.url, 'uiMaterial')
 const karats = selectedValues(event.url, 'uiKarat')
 const variantUrl = new URL(requestUrl)
 if (karats.length) variantUrl.searchParams.set('tags', karats.map(value => value.replace(/\s*gold$/i, '').trim() + ' Gold').join(','))
 let products: any[]
 if (metals.length) {
  const matches: any[] = []
  // New uploads use Metal_Type for color; older products use Metal_Color.
  for (const field of ['attributes.Metal_Type', 'attributes.Metal_Color']) {
   const url = new URL(variantUrl); url.searchParams.set(field, metals.join(','))
   matches.push(...await allPages(url))
  }
  const designs = new Map<string, any>()
  for (const product of matches) { const key = product.groupedSku || product.styleCode || product.id; if (!designs.has(key)) designs.set(key, product) }
  products = [...designs.values()]
 } else products = await allPages(variantUrl, karats.length ? undefined : result)
 const ryanFilterOptions = listingFilterOptions([...(result.products.data || []), ...products], availableFacets)
 products = applyClientFilters(products, event.url)
 // Merging legacy and current metal fields needs a final common sort.
 const sort = event.url.searchParams.get('sort')
 if (sort === 'price:asc' || sort === 'price:desc') products.sort((a,b) => (Number(a.price)-Number(b.price)) * (sort === 'price:asc' ? 1 : -1))
 if (sort === 'createdAt:desc') products.sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)))
 return { ...result, ryanSubcategories, ryanFilterOptions, products: { ...result.products, data: products, count: products.length, totalPages: products.length ? 1 : 0 } }
}
