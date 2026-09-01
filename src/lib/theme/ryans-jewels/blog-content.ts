export type RyanBlogPost = {
	id: string
	slug: string
	title: string
	excerpt: string
	content: string
	imageUrl: string
	author: string
	createdAt: string
	publishedAt: string
	tags: string[]
}

export const ryansBlogPosts: RyanBlogPost[] = [
	{
		id: 'lab-grown-vs-natural-diamonds',
		slug: 'lab-grown-vs-natural-diamonds',
		title: 'Lab-Grown vs. Natural Diamonds: How to Choose',
		excerpt:
			'Compare origin, appearance, grading and value so you can choose the diamond that best fits your priorities.',
		content: `
			<p>Lab-grown and natural diamonds share the same crystal structure, brilliance and durability. The main difference is their origin: natural diamonds form underground over a very long period, while lab-grown diamonds are created in controlled conditions using technology that reproduces the way diamonds form.</p>
			<h2>Start with the qualities you can see</h2>
			<p>Both types are evaluated using the familiar four Cs: cut, color, clarity and carat weight. Cut has the strongest influence on sparkle, so it is often the best place to begin. Then compare color and clarity grades in person or through clear, consistent product imagery.</p>
			<h2>Think about budget and size</h2>
			<p>Lab-grown diamonds can make a larger stone or a higher color and clarity grade accessible within the same budget. A natural diamond may appeal to someone who values geological rarity and traditional origin. Neither choice is automatically better; the right one should reflect what matters to the person wearing it.</p>
			<h2>Check the grading report</h2>
			<p>When a grading report is offered, review the carat weight, measurements, color, clarity and cut information before purchasing. The report describes the stone that was examined and helps you compare options consistently.</p>
			<h2>Choose the setting with equal care</h2>
			<p>The setting shapes the final look and protects the stone. Consider how high the diamond sits, how the prongs are arranged, which metal suits everyday wear and whether the ring will sit comfortably beside a wedding band.</p>
			<p>If you are still deciding, compare two pieces with similar grades and focus on the design you would be happiest to wear every day.</p>
		`,
		imageUrl: '/ryans-jewels/home/hero-desktop.png',
		author: 'Ryan Jewelers',
		createdAt: '2026-08-28T09:00:00.000Z',
		publishedAt: '2026-08-28T09:00:00.000Z',
		tags: ['Diamonds', 'Buying Guide']
	},
	{
		id: 'how-to-find-your-ring-size-at-home',
		slug: 'how-to-find-your-ring-size-at-home',
		title: 'How to Find Your Ring Size at Home',
		excerpt:
			'Use a ring you already own, measure at the right time of day and avoid the small mistakes that lead to a poor fit.',
		content: `
			<p>A comfortable ring should slide over the knuckle with light resistance and sit securely without pinching. Because fingers change slightly with temperature and activity, one quick measurement is rarely enough.</p>
			<h2>Measure a ring that already fits</h2>
			<p>Choose a ring worn on the same finger and hand as the new piece. Place it on a ruler and measure the inside diameter across the widest point, without including the metal edge. Compare that measurement with the size chart supplied for the product.</p>
			<h2>Measure more than once</h2>
			<p>Measure near the end of the day, when your hands are at a normal temperature. Avoid measuring immediately after exercise, in very hot weather or when your hands are unusually cold. Repeat the measurement on two or three days to confirm the result.</p>
			<h2>Allow for band width</h2>
			<p>A wider band can feel tighter than a delicate band in the same size. If the design has a broad shank or several stacked bands will be worn together, ask whether a slightly larger size is recommended.</p>
			<h2>Keep the knuckle in mind</h2>
			<p>If your knuckle is noticeably wider than the base of your finger, the ring must pass over it without becoming loose once in place. A professional fitting can help balance both measurements.</p>
			<p>Home measurement is a useful starting point, but an in-person sizing is the safest choice for an engagement ring, a wide band or a design that may be difficult to resize.</p>
		`,
		imageUrl: '/ryans-jewels/home/nameplate-card-1.webp',
		author: 'Ryan Jewelers',
		createdAt: '2026-08-20T09:00:00.000Z',
		publishedAt: '2026-08-20T09:00:00.000Z',
		tags: ['Rings', 'Jewelry Care']
	},
	{
		id: 'diamond-shapes-guide',
		slug: 'diamond-shapes-guide',
		title: 'Diamond Shapes: A Guide to Popular Cuts',
		excerpt:
			'From classic round to elegant oval and architectural emerald cuts, learn how popular diamond shapes change a piece.',
		content: `
			<p>Diamond shape is one of the first details people notice. It changes the balance, sparkle and personality of a ring or pendant even before metal and setting style are considered.</p>
			<h2>Round: classic brilliance</h2>
			<p>Round diamonds are known for strong light return and a balanced outline. They suit solitaire, halo and three-stone settings and remain a versatile choice for both modern and traditional designs.</p>
			<h2>Oval, pear and marquise: graceful length</h2>
			<p>Elongated shapes can create a larger face-up appearance and draw the eye along the finger. Oval feels soft and symmetrical, pear combines a rounded end with a distinctive point, and marquise creates the most dramatic length.</p>
			<h2>Emerald and Asscher: clean geometry</h2>
			<p>Step-cut shapes use broad, linear facets rather than the smaller facets associated with brilliant cuts. Their appeal comes from clarity, symmetry and a calm hall-of-mirrors effect. Because the open facets reveal more of the interior, clarity deserves extra attention.</p>
			<h2>Princess, cushion and radiant: defined edges</h2>
			<p>Princess cuts bring crisp square geometry, cushion cuts soften the corners for a romantic look, and radiant cuts combine an angular outline with lively brilliant-style faceting.</p>
			<h2>Make the final choice personal</h2>
			<p>Compare shapes at a similar carat weight and notice their actual measurements, not only the number on the label. The best choice is the outline that feels natural on the hand and complements the setting you love.</p>
		`,
		imageUrl: '/ryans-jewels/home/lookbook-side.jpg',
		author: 'Ryan Jewelers',
		createdAt: '2026-08-12T09:00:00.000Z',
		publishedAt: '2026-08-12T09:00:00.000Z',
		tags: ['Diamond Shapes', 'Style Guide']
	}
]

export const findRyansBlogPost = (slug: string) =>
	ryansBlogPosts.find((post) => post.slug === slug || post.id === slug) || null
