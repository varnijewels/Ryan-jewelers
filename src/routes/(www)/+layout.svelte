<script lang="ts">
	import { setCartState, setProductState, setWishlistState } from '$lib/core/stores/index.js'
	import Nav from '$lib/components/nav/nav.svelte'
	import Footer from '$lib/components/common/footer.svelte'
	import { StorePlugins } from '$lib/core/components/index.js'
	import { page } from '$app/state'
	import { browser } from '$app/environment'
	import { afterNavigate } from '$app/navigation'
	import { onDestroy, tick, type Snippet } from 'svelte'
	import { reveal } from '$lib/core/actions/reveal.js'
	import type { StoreData } from '$lib/core/services/index.js'

	const { children, data }: { children: Snippet; data: { store: StoreData; theme?: { name: string } } } = $props()
	let pageContent: HTMLElement
	let revealCleanups: Array<() => void> = []

	setCartState()
	setProductState()
	setWishlistState()

	$effect(() => {
		if (!browser || data.theme?.name !== 'ryans-jewels') return
		const path = `${page.url.pathname}${page.url.search}`
		if (page.url.pathname === '/products' || page.url.pathname.startsWith('/categories/') || page.url.pathname.startsWith('/collections')) {
			sessionStorage.setItem('rj-continue-shopping', path)
		}
	})

	afterNavigate(async () => {
		if (data.theme?.name !== 'ryans-jewels') return
		await tick()
		pageContent.classList.remove('rj-page-enter')
		void pageContent.offsetWidth
		pageContent.classList.add('rj-page-enter')
		for (const cleanup of revealCleanups) cleanup()
		revealCleanups = Array.from(pageContent?.children || [])
			.filter((node) => !node.classList.contains('rj-home'))
			.map((node, index) => {
				const element = node as HTMLElement
				element.style.setProperty('--rj-reveal-delay', `${Math.min(index, 4) * 55}ms`)
				const action = reveal(element)
				return () => action.destroy?.()
			})
	})

	onDestroy(() => revealCleanups.forEach((cleanup) => cleanup()))
</script>

<svelte:head>
	<link rel="icon" href={page?.data?.store?.favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col justify-between">
	<Nav storeData={data.store} />
	<main bind:this={pageContent} class="inter-gap rj-page-enter flex min-h-screen flex-1 flex-col">
		{@render children()}
	</main>
	<Footer />
</div>

<StorePlugins storeData={data.store} />
