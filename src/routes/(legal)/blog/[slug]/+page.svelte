<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { blogService } from '$lib/core/services/index.js'
	import { SeoHeader, StructuredData } from '$lib/core/components/index.js'
	import { findRyansBlogPost, type RyanBlogPost } from '$lib/theme/ryans-jewels/blog-content.js'

	let loading = $state(false)
	let error = $state('')
	let post = $state<RyanBlogPost | null>(findRyansBlogPost(page.params.slug || ''))

	const canonicalUrl = $derived(`${page.url.origin}/blog/${page.params.slug}`)
	const articleSchema = $derived(
		post
			? JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Article',
					headline: post.title,
					description: post.excerpt,
					image: [new URL(post.imageUrl, page.url.origin).href],
					datePublished: post.publishedAt,
					dateModified: post.publishedAt,
					mainEntityOfPage: canonicalUrl,
					author: { '@type': 'Organization', name: 'Ryan Jewelers' },
					publisher: { '@type': 'Organization', name: 'Ryan Jewelers' }
				})
			: ''
	)

	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})

	async function loadBlogPost() {
		if (post) return
		try {
			loading = true
			post = (await blogService.getOne(page.params.slug || '')) as unknown as RyanBlogPost
		} catch {
			error = 'This guide could not be found.'
		} finally {
			loading = false
		}
	}

	onMount(loadBlogPost)
</script>

<SeoHeader
	metaTitle={post?.title ? `${post.title} | Ryan Jewelers` : 'Jewelry Guide | Ryan Jewelers'}
	metaDescription={post?.excerpt || 'Read practical Ryan Jewelers guides about diamonds, rings and fine jewelry.'}
	image={post?.imageUrl}
	{canonicalUrl}
/>
{#if articleSchema}<StructuredData schema={articleSchema} />{/if}

<main class="rj-article">
	{#if loading}
		<div class="rj-article-status">Loading guide…</div>
	{:else if error || !post}
		<div class="rj-article-status">
			<h1>Guide not found</h1>
			<p>{error}</p>
			<a href="/blog">← Back to the journal</a>
		</div>
	{:else}
		<article>
			<header>
				<p>{post.tags.join(' · ')}</p>
				<h1>{post.title}</h1>
				<div><span>{post.author}</span><span aria-hidden="true">•</span><time datetime={post.publishedAt}>{formatDate(post.publishedAt)}</time></div>
			</header>
			<img class="rj-article-hero" src={post.imageUrl} alt={post.title} />
			<div class="rj-article-body">{@html post.content}</div>
		</article>
		<a class="rj-article-back" href="/blog">← Back to the journal</a>
	{/if}
</main>

<style>
	.rj-article { min-height: 70vh; background: #fafafa; color: #404040; font-family: 'Sarala', var(--font-body, sans-serif); padding: 70px 24px 96px; }
	.rj-article > article, .rj-article-back, .rj-article-status { display: block; max-width: 900px; margin-right: auto; margin-left: auto; }
	.rj-article header { margin-bottom: 35px; text-align: center; }
	.rj-article header > p { margin: 0; color: #9b7a28; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
	.rj-article h1 { margin: 13px 0 18px; color: #202020; font: 400 clamp(42px, 6vw, 70px)/1.02 'Rozha One', var(--font-heading, serif); }
	.rj-article header > div { display: flex; justify-content: center; gap: 10px; color: #777; font-size: 14px; }
	.rj-article-hero { width: 100%; max-height: 520px; border: 1px solid #e8e0cf; object-fit: cover; }
	.rj-article-body { max-width: 760px; margin: 44px auto 0; font-size: 17px; line-height: 30px; }
	.rj-article-body :global(h2) { margin: 38px 0 10px; color: #202020; font: 400 34px/1.15 'Rozha One', var(--font-heading, serif); }
	.rj-article-body :global(p) { margin: 0 0 20px; }
	.rj-article-back { margin-top: 46px; padding-top: 25px; border-top: 1px solid #e1d6be; color: #8c6d21; text-decoration: none; }
	.rj-article-status { padding: 80px 0; text-align: center; }
	.rj-article-status a { color: #8c6d21; }
	@media (max-width: 639px) { .rj-article { padding: 48px 20px 64px; } .rj-article-body { font-size: 16px; line-height: 27px; } }
</style>
