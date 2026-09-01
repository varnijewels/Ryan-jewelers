<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { blogService } from '$lib/core/services/index.js'
	import { SeoHeader } from '$lib/core/components/index.js'
	import { ryansBlogPosts, type RyanBlogPost } from '$lib/theme/ryans-jewels/blog-content.js'

	let posts = $state<RyanBlogPost[]>(ryansBlogPosts)

	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})

	onMount(async () => {
		try {
			const response = await blogService.list({ page: 1 })
			if (response?.data?.length) posts = response.data as unknown as RyanBlogPost[]
		} catch {
			// The published Ryan guides remain available when the optional blog API is offline.
		}
	})
</script>

<SeoHeader
	metaTitle="Jewelry Guides & Diamond Education | Ryan Jewelers"
	metaDescription="Explore practical Ryan Jewelers guides about lab-grown diamonds, ring sizing, diamond shapes and choosing fine jewelry with confidence."
	canonicalUrl={`${page.url.origin}/blog`}
/>

<main class="rj-blog">
	<header class="rj-blog-hero">
		<p>Ryan Jewelers Journal</p>
		<h1>Jewelry guides for every meaningful choice.</h1>
		<span>Clear advice on diamonds, rings, personal style and caring for the pieces you love.</span>
	</header>

	<section class="rj-blog-grid" aria-label="Latest jewelry guides">
		{#each posts as post (post.id)}
			<article>
				<a class="rj-blog-image" href={`/blog/${post.slug || post.id}`}>
					<img src={post.imageUrl} alt={post.title} loading="lazy" />
				</a>
				<div class="rj-blog-copy">
					<div class="rj-blog-meta">
						<time datetime={post.publishedAt || post.createdAt}>{formatDate(post.publishedAt || post.createdAt)}</time>
						<span aria-hidden="true">•</span>
						<span>{post.tags?.[0] || 'Jewelry Guide'}</span>
					</div>
					<h2><a href={`/blog/${post.slug || post.id}`}>{post.title}</a></h2>
					<p>{post.excerpt}</p>
					<a class="rj-blog-read" href={`/blog/${post.slug || post.id}`}>Read guide <span aria-hidden="true">→</span></a>
				</div>
			</article>
		{/each}
	</section>
</main>

<style>
	.rj-blog { min-height: 70vh; background: #fafafa; color: #404040; font-family: 'Sarala', var(--font-body, sans-serif); }
	.rj-blog-hero { padding: 72px clamp(24px, 6vw, 88px); border-bottom: 1px solid #e1d6be; background: linear-gradient(120deg, #f7f3e9, #fff); text-align: center; }
	.rj-blog-hero p { margin: 0; color: #9b7a28; font-size: 13px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; }
	.rj-blog-hero h1 { max-width: 760px; margin: 12px auto 0; color: #202020; font: 400 clamp(42px, 5vw, 68px)/1.05 'Rozha One', var(--font-heading, serif); }
	.rj-blog-hero span { display: block; max-width: 670px; margin: 18px auto 0; font-size: 17px; line-height: 28px; }
	.rj-blog-grid { display: grid; max-width: 1320px; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 34px; margin: 0 auto; padding: 72px clamp(24px, 5vw, 64px) 96px; }
	.rj-blog-grid article { overflow: hidden; border: 1px solid #e8e0cf; background: #fff; }
	.rj-blog-image { display: block; aspect-ratio: 4 / 3; overflow: hidden; }
	.rj-blog-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .25s ease; }
	.rj-blog-image:hover img { transform: scale(1.03); }
	.rj-blog-copy { padding: 25px; }
	.rj-blog-meta { display: flex; flex-wrap: wrap; gap: 8px; color: #8f7a46; font-size: 12px; letter-spacing: .7px; text-transform: uppercase; }
	.rj-blog-copy h2 { margin: 13px 0 8px; color: #202020; font: 400 30px/1.12 'Rozha One', var(--font-heading, serif); }
	.rj-blog-copy h2 a, .rj-blog-read { color: inherit; text-decoration: none; }
	.rj-blog-copy > p { margin: 0; font-size: 15px; line-height: 24px; }
	.rj-blog-read { display: inline-flex; gap: 10px; margin-top: 20px; color: #8c6d21; font-size: 14px; font-weight: 700; }
	@media (max-width: 900px) { .rj-blog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (max-width: 639px) {
		.rj-blog-hero { padding: 52px 20px; }
		.rj-blog-grid { grid-template-columns: 1fr; padding: 38px 20px 64px; }
	}
</style>
