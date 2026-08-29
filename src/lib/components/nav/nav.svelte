<script lang="ts">
	import {
		X,
		UserCircle,
		ChevronLeft,
		Phone,
		Mail,
		Menu,
		ChevronDown,
		Heart,
		Home,
		LayoutGrid,
		Tag,
		Layers,
		Package,
		MapPin,
		KeyRound,
		LogOut
	} from '@lucide/svelte'
	import MainNav from './main-nav.svelte'
	import MegaMenu from './mega-menu.svelte'
	import { page } from '$app/state'
	import MsSearch from './ms-search.svelte'
	import AuthModal from '$lib/components/auth/auth-modal.svelte'
	import { AuthButton } from '$lib/core/components/index.js'
	import { fade, fly } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { NavModule } from '$lib/core/composables/index.js'
	import { getWishlistState } from '@misiki/kitcommerce-core/stores'
	import CartSidebar from './cart-sidebar.svelte'
	import ProfileDropdown from './profile-dropdown.svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import { onDestroy, onMount } from 'svelte'
	import NoorNav from '$lib/theme/noor/NoorNav.svelte'
	import LimelightNav from '$lib/theme/limelight/LimelightNav.svelte'
	import BorisAndTwinsNav from '$lib/theme/boris-and-twins/BorisAndTwinsNav.svelte'
	import RyansJewelsNav from '$lib/theme/ryans-jewels/RyansJewelsNav.svelte'
	import RjTabletLabMenu from '$lib/theme/ryans-jewels/RjTabletLabMenu.svelte'
	import { menuChildren, menuHref, menuLabel, mobileMenuView, tabletMenuView, type AdminMenuItem } from '$lib/theme/ryans-jewels/admin-menu.js'
	import { ryansJewelsNavContent as ryanNav } from '$lib/theme/ryans-jewels/nav-content.js'

	const wishlistState = getWishlistState()
	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)
	const navModule = new NavModule()
	const userState = navModule.userState
	const isHomepage = $derived(page.route?.id === '/(www)')
	const sidebarHistoryKey = '__svelteCommerceMobileSidebar'
	let ownsSidebarHistoryEntry = false

	function handleSidebarBrowserBack() {
		if (!navModule.openSidebar || !ownsSidebarHistoryEntry) return
		ownsSidebarHistoryEntry = false
		navModule.openSidebar = false
	}

	function navigateFromSidebar(href: string) {
		const replaceSidebarEntry = ownsSidebarHistoryEntry && history.state?.[sidebarHistoryKey] === true
		ownsSidebarHistoryEntry = false
		navModule.openSidebar = false
		if (replaceSidebarEntry) window.location.replace(href)
		else window.location.assign(href)
	}

	function closeRyanSidebar(event: MouseEvent) {
		const href = (event.currentTarget as HTMLAnchorElement).getAttribute?.('href')
		if (!href) {
			navModule.openSidebar = false
			return
		}
		event.preventDefault()
		navigateFromSidebar(href)
	}

	onMount(() => {
		window.addEventListener('popstate', handleSidebarBrowserBack)
		return () => window.removeEventListener('popstate', handleSidebarBrowserBack)
	})

	$effect(() => {
		if (typeof window === 'undefined') return

		if (navModule.openSidebar && !ownsSidebarHistoryEntry) {
			history.pushState({ ...history.state, [sidebarHistoryKey]: true }, '', window.location.href)
			ownsSidebarHistoryEntry = true
		} else if (!navModule.openSidebar && ownsSidebarHistoryEntry) {
			const isCurrentSidebarEntry = history.state?.[sidebarHistoryKey] === true
			ownsSidebarHistoryEntry = false
			if (isCurrentSidebarEntry) {
				setTimeout(() => {
					if (!ownsSidebarHistoryEntry && history.state?.[sidebarHistoryKey] === true) history.back()
				})
			}
		}
	})

	onDestroy(() => {
		if (typeof window !== 'undefined' && ownsSidebarHistoryEntry && history.state?.[sidebarHistoryKey] === true) {
			history.back()
		}
	})

	const menuItemsUser = $derived.by(() => {
		const items = [
			{ title: 'Profile', url: '/my/profile' },
			{ title: 'Orders', url: '/my/orders' },
			// { title: 'Buy Again', url: '/my/buy-again' },
			{ title: 'Addresses', url: '/my/addresses' },
			{ title: 'Change Password', url: '/auth/change-password' }
		]
		if (wishlistPlugin?.active) items.push({ title: 'Wishlist', url: '/my/wishlist' })
	})

	const activeThemeName = $derived(page.data?.theme?.name ?? 'default')
	const storeData = $derived(page?.data?.store ?? {})
	let ryanSidebarView = $state<'root' | 'lab' | 'all-diamond' | 'earrings' | 'bracelets' | 'pendants' | 'engagement-rings'>('root')
	const ryanServerMegaMenu = $derived((page.data as any)?.navigation?.megaMenu as AdminMenuItem[] | undefined)
	const ryanStoreHeaderMenu = $derived(
		((page.data as any)?.store?.menu?.find((menu: any) => menu.menuId === 'header')?.items || []) as AdminMenuItem[]
	)
	function uniqueRyanItems(items: AdminMenuItem[]) {
		return items.filter(
			(item, index) => items.findIndex((candidate) => (candidate.id && candidate.id === item.id) || menuLabel(candidate) === menuLabel(item)) === index
		)
	}
	const ryanMegaCategories = $derived(
		uniqueRyanItems([...((ryanServerMegaMenu === undefined ? ryanNav.menu : ryanServerMegaMenu) || []), ...(navModule.megaMenu || [])] as AdminMenuItem[])
	)
	const ryanHeaderItems = $derived(
		uniqueRyanItems([...(ryanStoreHeaderMenu || []), ...(navModule.navMenu || [])] as AdminMenuItem[])
	)
	const ryanAllMenuItems = $derived(uniqueRyanItems([...ryanMegaCategories, ...ryanHeaderItems]))
	function findRyanLabCategory(items: AdminMenuItem[]): AdminMenuItem | null {
		for (const item of items) {
			if (/lab grown diamond/i.test(menuLabel(item) || '')) return item
			const nested = findRyanLabCategory(menuChildren(item))
			if (nested) return nested
		}
		return null
	}
	const ryanLabCategory = $derived(
		findRyanLabCategory(ryanMegaCategories)
	)
	const ryanAllDiamondCategory = $derived(
		ryanMegaCategories.find((item) => /^all\s+diamond\s+jewel(?:lery|ry)$/i.test(menuLabel(item)?.trim() || '')) || null
	)
	const ryanEarringsCategory = $derived(
		ryanAllMenuItems.find((item) => /^earrings?$/i.test(menuLabel(item)?.trim() || '')) || null
	)
	const ryanBraceletsCategory = $derived(
		ryanMegaCategories.find((item) => /^bracelets?$/i.test(menuLabel(item)?.trim() || '')) || null
	)
	const ryanPendantsCategory = $derived(
		ryanMegaCategories.find((item) => /^pendants?$/i.test(menuLabel(item)?.trim() || '')) || null
	)
	const ryanEngagementRingsCategory = $derived(
		ryanMegaCategories.find((item) => /^engagement rings?$/i.test(menuLabel(item)?.trim() || '')) || null
	)
	const ryanHomeItem = $derived(ryanAllMenuItems.find((item) => /^home$/i.test(menuLabel(item) || '')) || null)
	const ryanOfferItem = $derived(ryanAllMenuItems.find((item) => /best offers?|offers?/i.test(menuLabel(item) || '')) || null)
	const ryanSidebarItems = $derived([
		{
			label: ryanHomeItem ? menuLabel(ryanHomeItem) || 'Home' : 'Home',
			href: ryanHomeItem ? menuHref(ryanHomeItem) : '/',
			arrow: false
		},
		...uniqueRyanItems([...ryanMegaCategories, ...ryanHeaderItems].filter((item) => item !== ryanHomeItem && item !== ryanOfferItem)).map((item) => ({
			label: menuLabel(item) || '',
			href: menuHref(item),
			arrow: ryanMegaCategories.includes(item) || menuChildren(item).length > 0
		}))
	].filter((item) => item.label))

	$effect(() => {
		if (!navModule.openSidebar) ryanSidebarView = 'root'
	})
</script>

<svelte:window bind:scrollY={navModule.scrollY} />

{#if activeThemeName === 'limelight'}
	<LimelightNav {navModule} {wishlistPlugin} {wishlistState} {userState} {storeData} pathname={page.url.pathname} />
{:else if activeThemeName === 'noor'}
	<NoorNav {navModule} {wishlistPlugin} {wishlistState} {userState} {storeData} pathname={page.url.pathname} />
{:else if activeThemeName === 'boris-and-twins'}
	<BorisAndTwinsNav {navModule} {wishlistPlugin} {wishlistState} {userState} {storeData} pathname={page.url.pathname} />
{:else if activeThemeName === 'ryans-jewels'}
	<RyansJewelsNav {navModule} {wishlistPlugin} {wishlistState} {userState} {storeData} pathname={page.url.pathname} />
{:else}
	<header
		class="{navModule.isProductListingPage
			? 'max-sm:border-b'
			: ''} shadow-xs sticky top-0 z-50 w-full flex-col items-center justify-between bg-white transition-all duration-200"
	>
		<!-- Hello bar -->
		{#if navModule.helloBarPlugin?.active && isHomepage}
			<!-- <div class="bg-primary py-2 text-center text-xs text-white sm:text-sm">
				{@html helloBarPlugin?.content}
			</div> -->

			{#if navModule.helloBarPlugin?.content}
				<div class="max-w-none bg-primary py-2 text-center text-xs text-primary-foreground sm:text-sm">
					<ul class="sliding-list" style="--item-count: {navModule.itemCount}; --anim-duration: {navModule.animationDuration}s;">
						{#if navModule.helloBarPlugin?.content}
							<li style="--index: 1;">{@html navModule.helloBarPlugin?.content}</li>
						{/if}
						{#if navModule.helloBarPlugin?.content2}
							<li style="--index: 2;">{@html navModule.helloBarPlugin?.content2}</li>
						{/if}
						{#if navModule.helloBarPlugin?.content3}
							<li style="--index: 3;">{@html navModule.helloBarPlugin?.content3}</li>
						{/if}
					</ul>
				</div>
			{:else}
				<div class="bg-primary py-2 text-center text-xs text-foreground sm:text-sm">
					{@html navModule.helloBarPlugin?.content}
				</div>
			{/if}
		{/if}
		<div class="page-width flex h-16 items-center justify-between bg-white sm:h-14">
			<div class="hidden justify-center gap-3 sm:flex">
				<Button
					variant="ghost"
					size="icon"
					aria-label="Sidebar"
					class="md:hidden"
					onclick={() => {
						navModule.openSidebar = true
					}}
				>
					<Menu class="text-black" />
				</Button>
				<MainNav />
			</div>

			<div class="flex items-center justify-center sm:hidden">
				{#if navModule.isProductListingPage}
					<div class="flex items-center gap-2">
						<Button variant="ghost" size="icon" aria-label="Go back" onclick={navModule.goBack}>
							<ChevronLeft class="h-6 w-6 font-bold" />
							<span class="sr-only">Go back</span>
						</Button>

						<div class="flex flex-col items-start">
							{#if page.params?.slug || page.url?.searchParams?.get?.('search')}
								<p class="text-base font-semibold capitalize">
									{page.params?.slug?.replace?.(/-/g, ' ').replace?.(/\b\w/g, (c) => c?.toUpperCase?.()) || page.url?.searchParams?.get?.('search')}
								</p>
							{:else}
								<p class="text-base font-semibold">Products</p>
							{/if}

							<p class="text-xs text-gray-500">{navModule.productsCount > 999 ? '1000+' : navModule.productsCount} products</p>
						</div>
					</div>
				{:else}
					<Button
						variant="ghost"
						size="icon"
						aria-label="Sidebar"
						class="md:hidden"
						onclick={() => {
							navModule.openSidebar = true
						}}
					>
						<Menu class="text-black" />
					</Button>
					<MainNav />
				{/if}
			</div>

			{#if navModule.megaMenuPluginActive}
				<div class="hidden md:block">
					<MegaMenu />
				</div>
			{/if}
			<div class="flex items-center gap-2 sm:gap-2">
				<MsSearch />

				{#if wishlistPlugin?.active}
					<div class="relative hidden sm:block" role="navigation">
						<a
							href="/my/wishlist"
							class="flex items-center justify-center rounded-full px-2 text-gray-700 transition-colors hover:text-black"
							aria-label="Wishlist"
						>
							<Heart class="h-5 w-5" />
							{#if wishlistState?.count > 0}
								<span
									class="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary px-1.5 py-1 text-xs font-bold leading-none text-primary-foreground"
								>
									{wishlistState.count}
								</span>
							{/if}
						</a>
					</div>
				{/if}

				{#if !page.url.pathname.startsWith('/checkout')}
					<div class="">
						<CartSidebar
							onClose={navModule.closeCartSidebar}
							onContinueShopping={navModule.handleContinueShoppingClick}
							onRemoveCartItem={navModule.removeCartItem}
						/>
					</div>
				{/if}

				<div class="flex h-full items-center px-2 font-sans">
					{#if userState?.user?.role}
						<ProfileDropdown onSignOut={navModule.handleSignOut} />
					{:else}
						<AuthButton aria-label="Login" type="login">
							<div class="flex items-center justify-center text-gray-700 transition-colors hover:text-black">
								<UserCircle class="h-5 w-5" />
							</div>
						</AuthButton>
					{/if}
				</div>
			</div>
		</div>
	</header>
{/if}

<!-- Sidebar -->
{#if navModule.openSidebar}
	<aside class="fixed inset-0 z-[100] flex overflow-hidden bg-transparent font-sans">
		<div
			role="button"
			tabindex="0"
			aria-label="Close sidebar"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 300 }}
			class="backdrop-blur-xs absolute inset-0 bg-black/40"
			onclick={() => {
				navModule.openSidebar = false
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					navModule.openSidebar = false
				}
			}}
		>
			<span class="sr-only">Close sidebar</span>
		</div>
		<div
			in:fly={{ x: activeThemeName === 'ryans-jewels' ? -560 : -320, duration: 300, easing: cubicOut }}
			out:fly={{ x: activeThemeName === 'ryans-jewels' ? -560 : -320, duration: 300, easing: cubicOut }}
			class={activeThemeName === 'ryans-jewels'
				? `rj-tablet-menu${ryanSidebarView !== 'root' ? ' rj-tablet-menu--lab' : ''}`
				: 'relative z-[60] flex h-full w-full max-w-[300px] flex-col overflow-hidden border-r border-gray-100 bg-white text-foreground shadow-2xl'}
		>
			{#if activeThemeName === 'ryans-jewels'}
				{#if ryanSidebarView === 'engagement-rings'}
					{#if ryanEngagementRingsCategory}
						<RjTabletLabMenu
							category={ryanEngagementRingsCategory}
							variant="engagement-rings"
							open={navModule.openSidebar}
							onBack={() => (ryanSidebarView = 'root')}
							onClose={closeRyanSidebar}
						/>
					{:else}
						<div class="rj-tablet-menu-loading" role="status">Loading navigation…</div>
					{/if}
				{:else if ryanSidebarView === 'pendants'}
					{#if ryanPendantsCategory}
						<RjTabletLabMenu
							category={ryanPendantsCategory}
							variant="pendants"
							open={navModule.openSidebar}
							onBack={() => (ryanSidebarView = 'root')}
							onClose={closeRyanSidebar}
						/>
					{:else}
						<div class="rj-tablet-menu-loading" role="status">Loading navigation…</div>
					{/if}
				{:else if ryanSidebarView === 'bracelets'}
					{#if ryanBraceletsCategory}
						<RjTabletLabMenu
							category={ryanBraceletsCategory}
							variant="bracelets"
							open={navModule.openSidebar}
							onBack={() => (ryanSidebarView = 'root')}
							onClose={closeRyanSidebar}
						/>
					{:else}
						<div class="rj-tablet-menu-loading" role="status">Loading navigation…</div>
					{/if}
				{:else if ryanSidebarView === 'lab'}
					{#if ryanLabCategory}
						<RjTabletLabMenu
							category={ryanLabCategory}
							open={navModule.openSidebar}
							onBack={() => (ryanSidebarView = 'root')}
							onClose={closeRyanSidebar}
						/>
					{:else}
						<div class="rj-tablet-menu-loading" role="status">Loading navigation…</div>
					{/if}
				{:else if ryanSidebarView === 'all-diamond'}
					{#if ryanAllDiamondCategory}
						<RjTabletLabMenu
							category={ryanAllDiamondCategory}
							fallbackItems={ryanMegaCategories}
							variant="all-diamond"
							open={navModule.openSidebar}
							onBack={() => (ryanSidebarView = 'root')}
							onClose={closeRyanSidebar}
						/>
					{:else}
						<div class="rj-tablet-menu-loading" role="status">Loading navigation…</div>
					{/if}
				{:else if ryanSidebarView === 'earrings'}
					{#if ryanEarringsCategory}
						<RjTabletLabMenu
							category={ryanEarringsCategory}
							variant="earrings"
							open={navModule.openSidebar}
							onBack={() => (ryanSidebarView = 'root')}
							onClose={closeRyanSidebar}
						/>
					{:else}
						<div class="rj-tablet-menu-loading" role="status">Loading navigation…</div>
					{/if}
				{:else}
				<div class="rj-tablet-menu-header">
					<a class="rj-tablet-menu-brand" href="/" onclick={() => (navModule.openSidebar = false)} aria-label="Ryan Jewelers home">
						<span class="rj-tablet-menu-logo"><img src="/ryans-jewels/navigation/tablet-menu-logo.png" alt="" /></span>
						<span>{storeData?.name || ryanNav.brandName}</span>
					</a>
					<button class="rj-tablet-menu-close" type="button" aria-label="Close menu" onclick={() => (navModule.openSidebar = false)}>
						<img src="/ryans-jewels/navigation/tablet-menu-close.svg" alt="" />
					</button>
				</div>
				<span class="rj-tablet-menu-divider" aria-hidden="true"></span>

				<nav class="rj-tablet-menu-nav" aria-label="Main navigation">
					<ul>
						{#each ryanSidebarItems as item}
							<li>
								{#if tabletMenuView(item.label)}
									<button
										class="rj-tablet-menu-item"
										type="button"
										onclick={() => {
											if (window.matchMedia('(min-width: 640px)').matches) {
												ryanSidebarView = tabletMenuView(item.label) || 'root'
											} else {
												navigateFromSidebar(item.href)
											}
										}}
									>
										<span>{item.label}</span>
										<img src="/ryans-jewels/navigation/tablet-menu-arrow.svg" alt="" aria-hidden="true" />
									</button>
								{:else}
									<a
										class="rj-tablet-menu-item"
										href={item.href}
										onclick={(event) => {
											const submenu = window.matchMedia('(max-width: 639px)').matches && mobileMenuView(item.label)
											if (submenu) {
												event.preventDefault()
												ryanSidebarView = submenu
											} else navModule.openSidebar = false
										}}
									>
										<span>{item.label}</span>
										{#if item.arrow}<img src="/ryans-jewels/navigation/tablet-menu-arrow.svg" alt="" aria-hidden="true" />{/if}
									</a>
								{/if}
							</li>
						{/each}
					</ul>

					{#if ryanOfferItem}
						<a class="rj-tablet-menu-offer" href={menuHref(ryanOfferItem)} onclick={() => (navModule.openSidebar = false)}>
							<span class="rj-tablet-menu-offer-label">
								<span class="rj-tablet-menu-gift" aria-hidden="true">
									<img class="rj-tablet-menu-gift-base" src="/ryans-jewels/navigation/tablet-menu-gift.png" alt="" />
									<img class="rj-tablet-menu-gift-fold" src="/ryans-jewels/navigation/tablet-menu-gift.png" alt="" />
								</span>
								<span>{menuLabel(ryanOfferItem)}</span>
							</span>
							<img class="rj-tablet-menu-offer-arrow" src="/ryans-jewels/navigation/tablet-menu-arrow.svg" alt="" aria-hidden="true" />
						</a>
					{/if}
				</nav>
				{/if}
			{:else}
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
				<a href="/" class="flex items-center gap-2" onclick={() => (navModule.openSidebar = false)}>
					{#if activeThemeName === 'noor'}
						<img src="/noor/logo.png" class="h-8 object-contain" alt="Noor" />
					{:else if page?.data?.store?.logo}
						<img src={page?.data?.store?.logo} class="h-8 object-contain" alt={page?.data?.store?.name || 'Logo'} />
					{:else}
						<span class="text-base font-black uppercase tracking-wider text-black">
							{page?.data?.store?.name || 'Svelte Commerce'}
						</span>
					{/if}
				</a>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Close sidebar"
					class="h-8 w-8 rounded-full bg-gray-50 text-foreground hover:bg-gray-100"
					onclick={() => (navModule.openSidebar = false)}
				>
					<X class="h-4 w-4" />
				</Button>
			</div>

			<!-- User Profile Banner -->
			<div class="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
				{#if userState?.user?.role}
					<div class="flex items-center gap-3">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
							{#if userState.user?.avatar}
								<img src={userState.user.avatar} alt="" class="h-full w-full object-cover" />
							{:else}
								<UserCircle class="h-5 w-5" />
							{/if}
						</div>
						<div class="overflow-hidden">
							<p class="truncate text-xs font-bold text-gray-900">
								{userState.user?.firstName || userState.user?.name || 'My Account'}
							</p>
							<p class="truncate text-[10px] font-medium text-gray-500">
								{userState.user?.email || ''}
							</p>
						</div>
					</div>
				{:else}
					<div class="flex flex-col gap-1.5">
						<span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Welcome Guest</span>
						<AuthButton aria-label="Login" type="login">
							<div
								class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all duration-200 hover:bg-primary/95"
							>
								<UserCircle class="h-4 w-4" />
								<span>Login / Register</span>
							</div>
						</AuthButton>
					</div>
				{/if}
			</div>

			<!-- Menu Scroll Area -->
			<div class="flex-1 space-y-6 overflow-y-auto px-5 py-4">
				<!-- Shop Section -->
				<div>
					<span class="mb-3 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Shop & Explore</span>
					<ul class="m-0 flex w-full list-none flex-col gap-1.5 p-0 text-sm">
						<li>
							<a
								href="/"
								class="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black"
								onclick={() => (navModule.openSidebar = false)}
							>
								<Home class="h-4 w-4 text-gray-400" />
								<span>Home</span>
							</a>
						</li>

						<!-- MegaMenu Categories -->
						{#if navModule.megaMenuPluginActive && navModule.megaMenu?.length}
							{#each navModule.megaMenu as m, mx}
								<li>
									{#if m?.children?.length}
										<div
											class="flex w-full items-center justify-between rounded-md px-3 py-1 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black"
										>
											<a
												href={m.link ? m.link : m.slug ? '/' + m.slug : '/products'}
												aria-label="Click to visit category related products"
												class="flex flex-1 items-center gap-3 py-1"
												onclick={() => (navModule.openSidebar = false)}
											>
												<LayoutGrid class="h-4 w-4 text-gray-400" />
												<span>{m.name}</span>
											</a>

											<Button
												variant="ghost"
												size="icon"
												aria-label="Toggle subcategory"
												class="h-7 w-7 rounded-full p-0 hover:bg-gray-200/50"
												onclick={() => navModule.handleToggleSubCategory(m, mx)}
											>
												<ChevronDown
													class="h-3.5 w-3.5 shrink-0 transition-transform duration-300
													{navModule.showSubCategory[mx] ? '-rotate-180' : ''}"
												/>
											</Button>
										</div>
									{:else}
										<a
											href={m.link ? m.link : m.slug ? '/' + m.slug : '/products'}
											aria-label="Click to visit category related products"
											class="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black"
											onclick={() => (navModule.openSidebar = false)}
										>
											<LayoutGrid class="h-4 w-4 text-gray-400" />
											<span>{m.name}</span>
										</a>
									{/if}

									<!-- Category Level 2 -->
									{#if navModule.showSubCategory[mx]}
										<ul class="ml-6 mt-1 list-none space-y-1 border-l border-gray-100 p-0 pl-3">
											{#each m.children as c, cx}
												<li>
													{#if c.children?.length}
														<div
															class="flex w-full items-center justify-between rounded-md px-2 py-1 text-[11px] font-semibold text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-black"
														>
															<a
																href={c.link ? c.link : c.slug ? '/' + c.slug : '/products'}
																class="flex-1 py-1"
																onclick={() => (navModule.openSidebar = false)}
															>
																{c.name}
															</a>

															<Button
																variant="ghost"
																size="icon"
																aria-label="Toggle subcategory"
																class="h-6 w-6 rounded-full p-0 hover:bg-gray-200/50"
																onclick={() => navModule.handleToggleSubCategory2(c, cx)}
															>
																<ChevronDown
																	class="h-3 w-3 shrink-0 transition-transform duration-300
																	{navModule.showSubCategory2[cx] ? '-rotate-180' : ''}"
																/>
															</Button>
														</div>
													{:else}
														<a
															href={c.link ? c.link : c.slug ? '/' + c.slug : '/products'}
															aria-label="Click to visit category related products page"
															class="flex w-full items-center rounded-md px-2 py-1.5 text-[11px] font-semibold text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-black"
															onclick={() => (navModule.openSidebar = false)}
														>
															{c.name}
														</a>
													{/if}

													<!-- Category Level 3 -->
													{#if navModule.showSubCategory2[cx]}
														<ul class="ml-4 mt-1 list-none space-y-1 border-l border-gray-100 p-0 pl-3">
															{#each c.children as cc}
																<li>
																	<a
																		href={cc.link ? cc.link : cc.slug ? '/' + cc.slug : '/products'}
																		aria-label="Click to visit category related products page"
																		class="flex w-full items-center rounded-md px-2 py-1 text-[10px] font-semibold text-gray-400 transition-all duration-200 hover:bg-gray-50 hover:text-black"
																		onclick={() => (navModule.openSidebar = false)}
																	>
																		{cc.name}
																	</a>
																</li>
															{/each}
														</ul>
													{/if}
												</li>
											{/each}
										</ul>
									{/if}
								</li>
							{/each}
						{/if}

						<li>
							<a
								href="/products"
								class="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black"
								onclick={() => (navModule.openSidebar = false)}
							>
								<Tag class="h-4 w-4 text-gray-400" />
								<span>All Products</span>
							</a>
						</li>
					</ul>
				</div>

				<!-- NavMenu Section -->
				{#if navModule.navMenu?.length}
					<div>
						<span class="mb-3 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Quick Links</span>
						<ul class="m-0 flex w-full list-none flex-col gap-1.5 p-0 text-sm">
							{#each navModule.navMenu as menuItem}
								<li>
									<a
										href={menuItem?.link}
										class="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black"
										onclick={() => (navModule.openSidebar = false)}
									>
										<Layers class="h-4 w-4 text-gray-400" />
										<span>{menuItem.name}</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Account Section -->
				<div>
					<span class="mb-3 block text-[10px] font-bold uppercase tracking-wider text-gray-400">My Account</span>
					<ul class="m-0 flex w-full list-none flex-col gap-1.5 p-0 text-sm">
						{#if menuItemsUser?.length}
							{#each menuItemsUser as m}
								<li>
									<a
										href={m.url}
										class="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black"
										onclick={() => (navModule.openSidebar = false)}
									>
										{#if m.title === 'Profile'}
											<UserCircle class="h-4 w-4 text-gray-400" />
										{:else if m.title === 'Orders'}
											<Package class="h-4 w-4 text-gray-400" />
										{:else if m.title === 'Addresses'}
											<MapPin class="h-4 w-4 text-gray-400" />
										{:else if m.title === 'Change Password'}
											<KeyRound class="h-4 w-4 text-gray-400" />
										{:else if m.title === 'Wishlist'}
											<Heart class="h-4 w-4 text-gray-400" />
										{/if}
										<span>{m.title}</span>
									</a>
								</li>
							{/each}
						{/if}

						{#if userState?.user?.role}
							<li>
								<button
									class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
									onclick={() => {
										navModule.openSidebar = false
										navModule.handleSignOut()
									}}
								>
									<LogOut class="h-4 w-4 text-red-400" />
									<span>Sign Out</span>
								</button>
							</li>
						{/if}
					</ul>
				</div>
			</div>

			<!-- Footer Contact Box -->
			{#if page?.data?.store?.businessEmail || page?.data?.store?.businessPhone}
				<div class="border-t border-gray-100 bg-gray-50/50 p-5">
					<span class="mb-2 block text-[9px] font-bold uppercase tracking-wider text-gray-400">Support Contact</span>
					<div class="flex flex-col gap-2">
						{#if page?.data?.store?.businessEmail}
							<a
								href="mailto:{page?.data?.store?.businessEmail}"
								aria-label="Email us"
								class="flex items-center gap-2.5 text-[11px] font-medium text-gray-600 transition-colors duration-200 hover:text-black"
							>
								<Mail class="h-3.5 w-3.5 text-gray-400" />
								<span class="truncate">{page?.data?.store?.businessEmail}</span>
							</a>
						{/if}

						{#if page?.data?.store?.businessPhone}
							<a
								href="tel:+{page?.data?.store?.businessPhone}"
								aria-label="Call us"
								class="flex items-center gap-2.5 text-[11px] font-medium text-gray-600 transition-colors duration-200 hover:text-black"
							>
								<Phone class="h-3.5 w-3.5 text-gray-400" />
								<span>+{page?.data?.store?.businessPhone}</span>
							</a>
						{/if}
					</div>
				</div>
			{/if}
			{/if}
		</div>
	</aside>
{/if}

<AuthModal bind:show={navModule.showAuthModal} />

<style>
	.rj-tablet-menu {
		position: relative;
		z-index: 60;
		flex: none;
		width: min(560px, 100vw);
		height: 100%;
		overflow: hidden;
		border-radius: 0 10px 10px 0;
		background: #fff;
		box-shadow: -23px 20px 34px 11px rgba(22, 24, 38, 0.5);
		color: #404040;
		font-family: 'Sarala', sans-serif;
	}

	.rj-tablet-menu--lab {
		align-self: flex-start;
		height: auto;
		max-height: 100%;
		box-shadow: -23px 20px 34px 11px rgba(22, 24, 40, 0.3);
	}

	.rj-tablet-menu-loading {
		display: grid;
		height: 100%;
		place-items: center;
		color: #606060;
		font-size: 16px;
	}

	.rj-tablet-menu-header {
		position: absolute;
		top: 24px;
		left: 30px;
		right: 30px;
		display: flex;
		height: 46px;
		align-items: center;
		justify-content: space-between;
	}

	.rj-tablet-menu-brand {
		display: flex;
		align-items: center;
		gap: 12px;
		color: #cca646;
		font-family: 'Inria Serif', serif;
		font-size: 22px;
		font-weight: 400;
		line-height: normal;
		text-decoration: none;
		white-space: nowrap;
	}

	.rj-tablet-menu-logo {
		position: relative;
		display: block;
		width: 32px;
		height: 30px;
		flex: none;
		overflow: hidden;
	}

	.rj-tablet-menu-logo img {
		position: absolute;
		top: -39%;
		left: -59.69%;
		width: 206.72%;
		height: 221.3%;
		max-width: none;
	}

	.rj-tablet-menu-close {
		display: flex;
		width: 26px;
		height: 26px;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	.rj-tablet-menu-close img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.rj-tablet-menu-divider {
		position: absolute;
		top: 95px;
		left: 20px;
		right: 20px;
		height: 1px;
		background: #c2c2c2;
	}

	.rj-tablet-menu-nav {
		position: absolute;
		top: 126px;
		left: 30px;
		right: 30px;
		height: 494px;
	}

	.rj-tablet-menu-nav ul {
		display: flex;
		flex-direction: column;
		gap: 22px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rj-tablet-menu-nav li,
	.rj-tablet-menu-item {
		height: 34px;
	}

	.rj-tablet-menu-item,
	.rj-tablet-menu-offer {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		color: #404040;
		font-size: 21px;
		font-weight: 400;
		line-height: normal;
		text-decoration: none;
	}

	button.rj-tablet-menu-item {
		padding: 0;
		border: 0;
		background: transparent;
		font-family: inherit;
		text-align: left;
		cursor: pointer;
	}

	.rj-tablet-menu-item > img,
	.rj-tablet-menu-offer-arrow {
		display: block;
		width: 24px;
		height: 24px;
		flex: none;
	}

	.rj-tablet-menu-offer {
		height: 31px;
		margin-top: 22px;
		line-height: 31px;
	}

	.rj-tablet-menu-offer-label {
		display: flex;
		align-items: center;
		gap: 10px;
		white-space: nowrap;
	}

	.rj-tablet-menu-gift {
		position: relative;
		display: block;
		width: 36px;
		height: 31px;
		flex: none;
	}

	.rj-tablet-menu-gift img {
		position: absolute;
		object-fit: cover;
	}

	.rj-tablet-menu-gift-base {
		top: 0;
		left: 0;
		width: 27px;
		height: 31px;
	}

	.rj-tablet-menu-gift-fold {
		top: 12px;
		left: 19px;
		width: 17px;
		height: 19px;
		transform: rotate(180deg) scaleY(-1);
	}

	.rj-tablet-menu a:hover,
	.rj-tablet-menu a:focus-visible,
	.rj-tablet-menu-item:hover,
	.rj-tablet-menu-item:focus-visible {
		color: #cca646;
	}

	@media (max-width: 639px) {
		.rj-tablet-menu--lab {
			width: min(350px, 100vw);
		}

		.rj-tablet-menu-item,
		.rj-tablet-menu-offer {
			font-size: 16px;
		}
	}

	.rj-tablet-menu button:focus-visible,
	.rj-tablet-menu a:focus-visible {
		outline: 2px solid #cca646;
		outline-offset: 3px;
	}

	.minimum-width-rem {
		min-width: 360px;
	}

	@media screen and (max-width: 350px) {
		.minimum-width-rem {
			min-width: 300px;
		}
	}

	.sliding-list {
		list-style: none;
		margin: 0;
		padding: 0;
		height: 1.8rem;
		overflow: hidden;
		position: relative;
	}

	.sliding-list li {
		height: 1.8rem;
		line-height: 1.8rem;
		position: absolute;
		width: 100%;
		opacity: 0;
		animation: slideUp var(--anim-duration) linear infinite;
		animation-delay: calc(var(--index) * (var(--anim-duration) / var(--item-count)));
	}

	.sliding-list li:first-child {
		opacity: 1;
		top: 0;
	}

	@media screen and (max-width: 300px) {
		.sliding-list {
			height: 1rem;
		}
		.sliding-list li {
			height: 1rem;
			line-height: 1rem;
		}
	}

	@keyframes slideUp {
		0%,
		3% {
			top: 100%;
			opacity: 0;
		}
		5%,
		33% {
			top: 0;
			opacity: 1;
		}
		36%,
		100% {
			top: -100%;
			opacity: 0;
		}
	}
</style>
