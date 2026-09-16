<script lang="ts">
	import { page } from '$app/state'
	import { StructuredData } from '@misiki/kitcommerce-core/components'
	import { ryansSeoPlainText, safeJsonLd, seoPlainText } from '$lib/theme/ryans-jewels/seo.js'

	type Contact = { telephone?: string; email?: string; contactType?: string }
	type Address = { streetAddress?: string; addressLocality?: string; addressRegion?: string; postalCode?: string; addressCountry?: string }

	let {
		name = '', url = '', logo = '', image = '', description = '', foundingDate,
		priceRange = '$$$', organizationType = ['Organization', 'JewelryStore'],
		contactType = 'customer service', contactPoint, address, sameAs = []
	}: {
		name?: string; url?: string; logo?: string; image?: string; description?: string; foundingDate?: string
		priceRange?: string; organizationType?: string | string[]; contactType?: string
		contactPoint?: Contact; address?: Address; sameAs?: string[]
	} = $props()
	const cleanText = (value: unknown) => page.data.theme?.name === 'ryans-jewels' ? ryansSeoPlainText(value) : seoPlainText(value)

	const schema = $derived.by(() => {
		const store = page.data.store
		const contact = contactPoint || { telephone: store?.businessPhone, email: store?.businessEmail, contactType }
		const location = address || {
			streetAddress: store?.address_1,
			addressLocality: store?.city,
			addressRegion: store?.state,
			postalCode: store?.zip,
			addressCountry: store?.country?.iso2
		}
		const hasContact = Boolean(contact.telephone || contact.email)
		const hasAddress = Object.values(location).some(Boolean)
		const siteUrl = url || page.url.origin
		const applicableCountry = location.addressCountry || store?.country?.iso2 || 'US'

		return safeJsonLd({
			'@context': 'https://schema.org',
			'@type': organizationType,
			'@id': `${siteUrl}/#organization`,
			name: name || store?.name,
			url: siteUrl,
			logo: logo || store?.logo || undefined,
			image: image || logo || store?.logo || undefined,
			description: cleanText(description || store?.description),
			foundingDate: foundingDate || undefined,
			priceRange,
			contactPoint: hasContact ? { '@type': 'ContactPoint', ...contact, contactType: contact.contactType || contactType } : undefined,
			address: hasAddress ? { '@type': 'PostalAddress', ...location } : undefined,
			hasMerchantReturnPolicy: page.data.theme?.name === 'ryans-jewels'
				? {
						'@type': 'MerchantReturnPolicy',
						applicableCountry,
						returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
						merchantReturnDays: 30,
						merchantReturnLink: `${siteUrl}/refund-policy`
					}
				: undefined,
			sameAs: sameAs.filter((link) => /^https?:\/\//.test(link))
		})
	})
</script>

<StructuredData {schema} />
