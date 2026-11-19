<script lang="ts">
	import { ChevronRight, CircleHelp, Heart, MapPin, Menu, MessageCircle, PackageCheck, Search, ShoppingBag, UserRound } from '@lucide/svelte'
	import { page } from '$app/state'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { AuthButton } from '$lib/core/components/index.js'
	import { MsSearchRenderer } from '$lib/core/composables/index.js'
	import { priceRoundUp } from '@misiki/kitcommerce-core/utils'
	import { getCartState } from '$lib/core/stores/index.js'
	import { ryansJewelsNavContent as nav } from './nav-content.js'
	import { catalogMegaMenu } from './catalog-navigation.js'
	import RjAdminMegaMenu from './RjAdminMegaMenu.svelte'
	import RjAnnouncementBar from './RjAnnouncementBar.svelte'
	import RjProfileDropdown from './RjProfileDropdown.svelte'
	import RjCartDrawer from './RjCartDrawer.svelte'
	import RjRingBuilderIcon from './RjRingBuilderIcon.svelte'
	import { menuChildren, menuHref, menuLabel, resolveAdminMenu } from './admin-menu.js'

	let {
		navModule,
		wishlistPlugin,
		wishlistState,
		userState,
		storeData,
		pathname = '',
	}: {
		navModule: any
		wishlistPlugin?: any
		wishlistState?: any
		userState?: any
		storeData?: any
		pathname?: string
	} = $props()

	let search = $state('')
	let openMega = $state<string | null>(null)
	const cartState = getCartState()

	const activeUser = $derived(userState?.user?.role ? userState.user : (page.data as any)?.user)
	const isLoggedIn = $derived(!!activeUser?.role)
	const resolvedMenu = $derived(resolveAdminMenu(catalogMegaMenu, [], nav.home, []))
	const homeLabel = $derived(menuLabel(resolvedMenu.home))
	const homeHref = '/'
</script>

<svelte:window onscroll={() => (openMega = null)} />

<!-- Storefront header -->
<header
	class="rj-header"
	onmouseleave={() => (openMega = null)}
	onfocusout={(event) => {
		if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) openMega = null
	}}
	onkeydown={(event) => {
		if (event.key === 'Escape') openMega = null
	}}
>
	<div class="rj-utility">
		<div class="rj-utility-links">
			<a href={nav.utility.findStore.href}><MapPin size={14} strokeWidth={1.4} aria-hidden="true" /><span>{nav.utility.findStore.label}</span></a>
			<a href={nav.utility.help.href}><CircleHelp size={14} strokeWidth={1.4} aria-hidden="true" /><span>{nav.utility.help.label}</span></a>
		</div>
		<a class="rj-utility-feature" href={nav.utility.dailyDeals.href}>{nav.utility.dailyDeals.label}</a>
		<div class="rj-utility-links rj-utility-right">
			<a href={nav.utility.trackOrder.href}><PackageCheck size={14} strokeWidth={1.4} aria-hidden="true" /><span>{nav.utility.trackOrder.label}</span></a>
			<a href={nav.utility.helpContact.href}><MessageCircle size={14} strokeWidth={1.4} aria-hidden="true" /><span>{nav.utility.helpContact.label}</span></a>
		</div>
	</div>
	<div class="rj-header-inner">
		<!-- Row 1 -->
		<div class="rj-row-primary" onmouseenter={() => (openMega = null)}>
			<button class="rj-burger" type="button" aria-label="Open menu" onclick={() => (navModule.openSidebar = true)}>
				<Menu class="h-5 w-5" />
			</button>

			<a class="rj-brand" href="/" aria-label="{nav.brandName} home">
				<span class="rj-brand-name">{nav.brandName}</span>
			</a>

			<div class="rj-tools">
				<div class="rj-shortcuts">
					<a class="rj-shortcut rj-ring-builder" href="/ring-builder" title="Create your ring">
						<RjRingBuilderIcon /><span>Ring Builder</span>
					</a>

					<details class="rj-search-toggle">
						<summary aria-label="Search products"><Search size={19} strokeWidth={1.25} aria-hidden="true" /><span>{nav.searchLabel}</span></summary>
						<div class="rj-search-panel">
							<MsSearchRenderer bind:search>
								{#snippet content({ searchResults, showSearchResults, loading, searchPlugin, closeSearch, handleKeyDown, handleResultClick, toggleSearchResults })}
									<form class="rj-search" action="/products" method="GET" onsubmit={() => toggleSearchResults(false)}>
										<input
											class="rj-search-input"
											type="search"
											name="search"
											bind:value={search}
											placeholder={searchPlugin?.placeholder || nav.searchPlaceholder}
											aria-label={searchPlugin?.placeholder || nav.searchPlaceholder}
											autocomplete="off"
											enterkeyhint="search"
											onfocus={() => toggleSearchResults(true)}
											onkeydown={(event) => {
												if (event.key !== 'Enter') handleKeyDown(event)
											}}
										/>
										<button class="rj-search-submit" type="submit" aria-label="Search products"><Search size={21} strokeWidth={1.25} aria-hidden="true" /></button>

										{#if showSearchResults && search}
											<div class="rj-search-results">
												{#if loading}
													{#each Array(4) as _}
														<div class="rj-search-skeleton"></div>
													{/each}
												{:else if searchResults.length > 0}
													<ul>
														{#each searchResults as result}
															<li>
																<button type="button" onclick={() => handleResultClick(result)}>
																	<span class="rj-search-thumb">
																		{#if result.thumbnail}<img src={result.thumbnail} alt="" />{/if}
																	</span>
																	<span class="rj-search-meta">
																		<span class="rj-search-title">{result.name || result.title}</span>
																		{#if result.price}
																			<span class="rj-search-price">{priceRoundUp(result?.price, page?.data?.store?.currency?.code)}</span>
																		{/if}
																	</span>
																</button>
															</li>
														{/each}
													</ul>
												{:else}
													<p class="rj-search-empty">No products found for “{search}”.</p>
												{/if}
											</div>
											<button type="button" class="rj-search-backdrop" tabindex="-1" aria-label="Close search" onclick={closeSearch}></button>
										{/if}
									</form>
								{/snippet}
							</MsSearchRenderer>
						</div>
					</details>
				</div>

				<div class="rj-actions">
					{#if isLoggedIn}
						<RjProfileDropdown onSignOut={navModule.handleSignOut}>
							{#snippet trigger()}
								<span class="rj-account"><UserRound size={21} strokeWidth={1.25} aria-hidden="true" /></span>
							{/snippet}
						</RjProfileDropdown>
					{:else}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger aria-label="Open account menu" class="rj-guest-trigger">
								<span class="rj-account"><UserRound size={21} strokeWidth={1.25} aria-hidden="true" /></span>
							</DropdownMenu.Trigger>

							<DropdownMenu.Content align="end" sideOffset={8} class="rj-guest-menu">
								<DropdownMenu.Item class="rj-guest-item">
									<AuthButton class="rj-guest-signin" type="login">Sign in / Create Account</AuthButton>
								</DropdownMenu.Item>
								<div class="rj-guest-rule"></div>
								<DropdownMenu.Item class="rj-guest-item">
									<AuthButton class="rj-guest-row" type="login"
										><img class="rj-guest-icon" src="/ryans-jewels/icons/order-history.svg" alt="" /><span>Order History</span><ChevronRight /></AuthButton
									>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="rj-guest-item">
									<a class="rj-guest-row" href="/order-tracking"
										><img class="rj-guest-icon" src="/ryans-jewels/icons/track-order.svg" alt="" /><span>Track Order</span><ChevronRight /></a
									>
								</DropdownMenu.Item>
								<div class="rj-guest-rule"></div>
								<DropdownMenu.Item class="rj-guest-item">
									<AuthButton class="rj-guest-row" type="login"
										><img class="rj-guest-icon" src="/ryans-jewels/icons/rewards.svg" alt="" /><span>Rewards</span><ChevronRight /></AuthButton
									>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="rj-guest-item">
									<AuthButton class="rj-guest-row" type="login"
										><img class="rj-guest-icon" src="/ryans-jewels/icons/my-profile.svg" alt="" /><span>My Profile</span><ChevronRight /></AuthButton
									>
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{/if}
					<a class="rj-wishlist" href="/my/wishlist" aria-label="Wishlist">
						<Heart size={21} strokeWidth={1.25} aria-hidden="true" />
						{#if wishlistState?.count > 0}<span class="rj-action-count">{wishlistState.count}</span>{/if}
					</a>
					<button class="rj-cart" type="button" onclick={() => (cartState.isOpen = true)} aria-label={`Open cart, ${cartState.cart?.qty || 0} items`}>
						<ShoppingBag size={21} strokeWidth={1.25} aria-hidden="true" />
						{#if (cartState.cart?.qty || 0) > 0}<span class="rj-action-count">{cartState.cart.qty}</span>{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Row 2 -->
		<div class="rj-row-menu">
			<nav class="rj-menu" aria-label="Main navigation">
				<a class="rj-menu-home" href={homeHref} aria-current={pathname === homeHref ? 'page' : undefined} onmouseenter={() => (openMega = null)}>
					{homeLabel}
				</a>
				<div class="rj-menu-list">
					{#each resolvedMenu.items as item, index}
						{@const label = menuLabel(item)}
						{@const href = menuHref(item)}
						{@const menuId = `rj-admin-menu-${index}`}
						{#if menuChildren(item).length}
							<div class="rj-menu-entry" class:is-open={openMega === menuId} onmouseenter={() => (openMega = menuId)}>
								<a
									class="rj-menu-item"
									{href}
									aria-current={pathname === href ? 'page' : undefined}
									aria-haspopup="true"
									aria-expanded={openMega === menuId}
									aria-controls={menuId}
									onfocus={() => (openMega = menuId)}
								>
									<span>{label}</span>
									<svg class="rj-menu-caret" width="11.6829" height="6.06268" viewBox="0 0 11.6829 6.06268" fill="none" aria-hidden="true">
										<path
											d="M10.9329 0.75L6.74143 4.94143C6.24643 5.43643 5.43643 5.43643 4.94143 4.94143L0.75 0.75"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</a>
								<RjAdminMegaMenu category={item} {menuId} open={openMega === menuId} onNavigate={() => (openMega = null)} />
							</div>
						{:else}
							<a class="rj-menu-item" {href} aria-current={pathname === href ? 'page' : undefined} onmouseenter={() => (openMega = null)}>
								<span>{label}</span>
							</a>
						{/if}
					{/each}
				</div>
			</nav>

		</div>
	</div>
	<RjAnnouncementBar />
</header>

{#if cartState.isOpen}<RjCartDrawer />{/if}

<style>
	.rj-header {
		--rj-header-accent: #2c3543;
		--rj-header-promo: #fff;
		position: sticky;
		top: 0;
		z-index: 50;
		width: 100%;
		border-top: 3px solid var(--rj-header-accent);
		background: #fff;
		color: var(--rj-ink, #404040);
		font-family: var(--font-body, sans-serif);
	}
	.rj-utility {
		background: #ac8735;
		color: #fff;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		min-height: 32px;
		padding: 0 40px;
		border-bottom: 1px solid var(--rj-line, #e5e5e5);
		font-size: 12px;
	}
	.rj-utility-links {
		display: flex;
		align-items: center;
		gap: 18px;
	}
	.rj-utility-right {
		justify-content: flex-end;
	}
	.rj-utility a {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		min-height: 32px;
		color: inherit;
		text-decoration: none;
		white-space: nowrap;
	}
	.rj-utility a:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.rj-header-inner {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 16px;
		min-height: 56px;
		padding: 0 40px;
	}
	.rj-row-primary {
		display: contents;
	}
	.rj-brand {
		grid-column: 1;
		grid-row: 1;
		display: flex;
		align-items: center;
		min-width: 0;
		text-decoration: none;
	}
	.rj-brand-name {
		color: #ac8735;
		font: 400 20px/1.2 'Inria Serif', Georgia, serif;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		white-space: nowrap;
	}
	.rj-burger {
		display: none;
	}
	.rj-search-toggle > summary {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		min-height: 40px;
		list-style: none;
		cursor: pointer;
	}
	.rj-search-toggle > summary::-webkit-details-marker {
		display: none;
	}
	.rj-search-toggle > summary span {
		display: none;
	}
	.rj-search-panel {
		position: absolute;
		top: 100%;
		right: 40px;
		z-index: 90;
		width: min(620px, calc(100% - 80px));
		padding: 16px;
		border: 1px solid var(--rj-line, #e5e5e5);
		background: #fff;
		box-shadow: 0 12px 30px #40351d1f;
	}
	.rj-search {
		position: relative;
		width: 100%;
		min-width: 140px;
		max-width: 800px;
		height: 42px;
	}
	.rj-search-input {
		position: relative;
		z-index: 80;
		width: 100%;
		height: 100%;
		padding: 8px 58px 8px 18px;
		border: 1px solid var(--rj-line-2, #d9d9d9);
		border-radius: 6px;
		background: #fff;
		color: var(--rj-ink, #404040);
		font:
			400 13px/24px 'Sarala',
			sans-serif;
		appearance: none;
	}
	.rj-search-input::placeholder {
		color: #737373;
		opacity: 1;
	}
	.rj-search-input::-webkit-search-cancel-button {
		display: none;
	}
	.rj-search-submit {
		position: absolute;
		z-index: 81;
		top: 0;
		right: 0;
		display: grid;
		place-items: center;
		width: 46px;
		height: 42px;
		border: 0;
		border-radius: 0 6px 6px 0;
		background: transparent;
		color: var(--rj-ink, #404040);
		cursor: pointer;
	}
	.rj-tools {
		grid-column: 3;
		grid-row: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
	}
	.rj-shortcuts {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}
	.rj-shortcut {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 42px;
		padding: 8px 0;
		border: 0;
		color: inherit;
		font-size: 12px;
		white-space: nowrap;
		text-decoration: none;
		transition: background 0.15s ease;
	}
	.rj-shortcut:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.rj-ring-builder { transition: color 350ms ease; }
	.rj-ring-builder:hover, .rj-ring-builder:focus-visible { color: var(--rj-gold, #cca646); text-decoration: none; }
	.rj-actions {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}
	.rj-account,
	.rj-wishlist,
	.rj-cart {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		color: #262626;
		text-decoration: none;
	}
	.rj-account:hover,
	.rj-wishlist:hover,
	.rj-cart:hover {
		background: var(--rj-cream, #faf6ea);
	}
	.rj-cart {
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
	}
	.rj-action-count {
		position: absolute;
		top: 0;
		right: -1px;
		display: grid;
		place-items: center;
		min-width: 17px;
		height: 17px;
		padding: 0 4px;
		border: 2px solid #fff;
		border-radius: 20px;
		background: #806321;
		color: #fff;
		font:
			600 9px/1 'Sarala',
			sans-serif;
	}
	:global(.rj-guest-trigger) {
		display: flex;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		cursor: pointer;
	}
	.rj-row-menu {
		grid-column: 2;
		grid-row: 1;
		display: flex;
		justify-content: center;
		min-width: 0;
	}
	.rj-menu,
	.rj-menu-list {
		display: flex;
		align-items: center;
		gap: 24px;
		min-width: 0;
	}
	.rj-menu-entry {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}
	.rj-menu-home,
	.rj-menu-item {
		display: flex;
		align-items: center;
		gap: 7px;
		min-height: 48px;
		color: inherit;
		font-size: 13px;
		white-space: nowrap;
		text-decoration: none;
	}
	.rj-menu-home:hover,
	.rj-menu-item:hover {
		text-decoration: underline;
		text-underline-offset: 5px;
	}
	.rj-menu-caret {
		width: 9px;
		height: 5px;
		flex-shrink: 0;
		transition: transform 0.16s ease;
	}
	.rj-header :is(a, button, input, summary):focus-visible,
	.rj-header :global(button:focus-visible) {
		outline: 2px solid var(--rj-heading, #202020);
		outline-offset: 3px;
	}
	.rj-search-backdrop {
		position: fixed;
		inset: 0;
		z-index: 70;
		background: transparent;
		border: 0;
		padding: 0;
	}
	.rj-search-results {
		position: absolute;
		left: 0;
		right: 0;
		top: calc(100% + 8px);
		z-index: 80;
		max-height: 70vh;
		overflow-y: auto;
		border: 1px solid #e8dec4;
		border-radius: 12px;
		background: #fff;
		box-shadow: 0 12px 30px #40351d1f;
	}
	.rj-search-results ul {
		margin: 0;
		padding: 8px;
		list-style: none;
	}
	.rj-search-results li button {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 10px;
		border: 0;
		border-radius: 6px;
		background: none;
		text-align: left;
		cursor: pointer;
	}
	.rj-search-results li button:hover {
		background: var(--rj-cream, #faf6ea);
	}
	.rj-search-thumb {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		flex-shrink: 0;
		background: #fafafa;
		border-radius: 6px;
		overflow: hidden;
	}
	.rj-search-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.rj-search-meta {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.rj-search-title {
		color: var(--rj-ink, #404040);
		font-size: 13px;
	}
	.rj-search-price {
		color: #806321;
		font-size: 12px;
	}
	.rj-search-empty {
		padding: 20px 16px;
		margin: 0;
		color: var(--rj-ink-2, #606060);
		font-size: 13px;
		text-align: center;
	}
	.rj-search-skeleton {
		height: 48px;
		margin: 12px;
		border-radius: 6px;
		background: #f4f4f4;
	}
	.rj-menu-entry.is-open :global(.rj-admin-mega) {
		visibility: visible;
		opacity: 1;
		pointer-events: auto;
		transform: translate(-50%, 0);
	}

	.rj-menu-entry.is-open .rj-menu-caret {
		transform: rotate(180deg);
	}

	:global(.rj-guest-menu) {
		width: 250px;
		padding: 14px 14px 10px;
		border: 0;
		border-radius: 0 0 15px 15px;
		background: #fff;
		font-family: 'Sarala', sans-serif;
		color: var(--rj-ink, #404040);
		box-shadow: 0 12px 18px rgba(0, 0, 0, 0.16);
	}

	:global(.rj-guest-signin) {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 40px;
		border-radius: 6px;
		background: var(--rj-gold, #cca646);
		color: #fff;
		font-family: 'Sarala', sans-serif;
		font-weight: 400;
		font-size: 16px;
		line-height: 24px;
		cursor: pointer;
	}

	:global(.rj-guest-rule) {
		height: 1px;
		margin: 12px 0 5px;
		background: #e8e8e8;
	}

	:global(.rj-guest-item) {
		height: 42px;
		padding: 0;
		border-radius: 0;
		color: inherit;
	}

	:global(.rj-guest-item[data-highlighted]) {
		background: #faf6ea;
	}

	:global(.rj-guest-row) {
		display: grid;
		grid-template-columns: 21px 1fr 15px;
		align-items: center;
		gap: 10px;
		width: 100%;
		height: 42px;
		padding: 0;
		color: var(--rj-ink, #404040);
		font-family: 'Sarala', sans-serif;
		font-weight: 400;
		font-size: 16px;
		line-height: 24px;
		text-decoration: none;
		cursor: pointer;
	}

	:global(.rj-guest-icon) {
		width: 21px;
		height: 21px;
	}

	:global(.rj-guest-row svg:last-child) {
		width: 15px;
		height: 15px;
		stroke-width: 1.2;
	}

	@media (max-width: 1399px) and (min-width: 1200px) {
		.rj-header-inner {
			gap: 12px;
		}
		.rj-menu,
		.rj-menu-list {
			gap: 16px;
		}
		.rj-actions {
			gap: 4px;
		}
	}
	@media (max-width: 1199px) {
		.rj-header-inner {
			grid-template-columns: 40px minmax(0, 1fr) auto;
			grid-template-areas: 'menu brand actions' 'shortcuts shortcuts shortcuts';
			gap: 8px 12px;
			padding: 10px 40px;
		}
		.rj-tools {
			display: contents;
		}
		.rj-burger {
			grid-area: menu;
			display: grid;
			place-items: center;
			width: 40px;
			height: 40px;
			padding: 0;
			border: 0;
			background: none;
			color: inherit;
			cursor: pointer;
		}
		.rj-brand {
			grid-area: brand;
		}
		.rj-search-toggle > summary {
			justify-content: flex-start;
			gap: 10px;
			width: 100%;
			font-size: 13px;
		}
		.rj-search-toggle > summary span {
			display: inline;
		}
		.rj-shortcuts {
			grid-area: shortcuts;
			justify-content: space-between;
		}
		.rj-shortcut {
			min-height: 40px;
			padding: 5px 0;
		}
		.rj-actions {
			grid-area: actions;
			gap: 0;
		}
		.rj-row-menu {
			display: none;
		}
	}
	@media (max-width: 639px) {
		.rj-brand-name {
			font-size: 18px;
		}
		.rj-utility {
			grid-template-columns: 1fr auto;
			padding: 0 24px;
			font-size: 11px;
		}
		.rj-utility-links {
			gap: 12px;
		}
		.rj-utility-right {
			display: none;
		}
		.rj-header-inner {
			grid-template-columns: 32px minmax(0, 1fr) auto;
			column-gap: 6px;
			padding: 8px 24px;
		}
		.rj-burger {
			width: 32px;
		}
		.rj-account,
		.rj-wishlist,
		.rj-cart {
			width: 32px;
		}
		.rj-search-panel {
			right: 24px;
			width: calc(100% - 48px);
		}

	}
	@media (max-width: 389px) {
		.rj-brand-name {
			font-size: 16px;
		}
	}
</style>
