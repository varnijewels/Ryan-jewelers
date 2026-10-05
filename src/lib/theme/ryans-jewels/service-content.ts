/** Verified against the rendered official site on 2026-10-05. */
export const serviceSource = 'https://www.theryanjewelers.com/services.htm'

export const ryanServices = [
	{
		id: 'custom-jewelry',
		title: 'Custom Jewelry',
		description: 'Turn your ideas into a personal piece of jewelry.',
		detail: 'Discuss a custom engagement ring, personalized necklace or another design with our team. We can help create a piece around your style and preferences.',
		image: '/ryans-jewels/services/custom-jewelry.webp',
		imageAlt: 'Jeweler working on a piece of jewelry at a workbench',
		sourceImage: 'https://media.rainpos.com/13009/Services_1.png'
	},
	{
		id: 'jewelry-repairs',
		title: 'Jewelry Repairs',
		description: 'Care for broken clasps, missing stones and worn settings.',
		detail: 'Bring in jewelry that needs attention, from a damaged clasp to a missing stone or worn band. Our team can assess the repair and help restore the piece.',
		image: '/ryans-jewels/services/jewelry-repairs.webp',
		imageAlt: 'Jeweler holding a ring with tweezers during a repair',
		sourceImage: 'https://media.rainpos.com/13009/Services_2.png'
	},
	{
		id: 'cleaning-inspection',
		title: 'Jewelry Cleaning & Inspection',
		description: 'Professional cleaning and a careful check of your jewelry.',
		detail: 'Have your jewelry cleaned and inspected by our team. Each piece is assessed as part of the service to help keep it looking its best.',
		image: '/ryans-jewels/services/cleaning-inspection.webp',
		imageAlt: 'Jeweler inspecting jewelry with a customer',
		sourceImage: 'https://media.rainpos.com/13009/Services_3.png'
	},
	{
		id: 'jewelry-appraisal',
		title: 'Jewelry Appraisal',
		description: 'Understand the value of the pieces you own.',
		detail: 'Ask about a professional appraisal for your jewelry. A detailed assessment can help you understand its value and make informed decisions.',
		image: '/ryans-jewels/services/jewelry-appraisal.webp',
		imageAlt: 'Emerald-cut diamond beside jeweler’s tweezers',
		sourceImage: 'https://media.rainpos.com/13009/Services_4.png'
	}
] as const
