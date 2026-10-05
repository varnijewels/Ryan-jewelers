<script lang="ts">
	import { ChevronRight, Menu, ShoppingBag, UserRound, Search, X } from '@lucide/svelte'
	import { tick } from 'svelte'
	import { page } from '$app/state'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { AuthButton } from '$lib/core/components/index.js'
	import { getCartState } from '$lib/core/stores/index.js'
	import { ryansJewelsNavContent as nav } from './nav-content.js'
	import { catalogMegaMenu } from './catalog-navigation.js'
	import RjAdminMegaMenu from './RjAdminMegaMenu.svelte'
	import RjProfileDropdown from './RjProfileDropdown.svelte'
	import { menuChildren, menuHref, menuLabel, resolveAdminMenu } from './admin-menu.js'

	let {
		navModule,
		wishlistPlugin,
		wishlistState,
		userState,
		storeData,
		pathname = ''
	}: {
		navModule: any
		wishlistPlugin?: any
		wishlistState?: any
		userState?: any
		storeData?: any
		pathname?: string
	} = $props()

	let searchOpen = $state(false)
	let searchInput: HTMLInputElement
	let searchToggle: HTMLButtonElement
	async function toggleSearch() {
		searchOpen = !searchOpen
		openMega = null
		await tick()
		if (searchOpen) searchInput?.focus()
	}
	function closeSearch() {
		searchOpen = false
		searchToggle?.focus()
	}
	let openMega = $state<string | null>(null)
	const cartState = getCartState()

	const activeUser = $derived(userState?.user?.role ? userState.user : (page.data as any)?.user)
	const isLoggedIn = $derived(!!activeUser?.role)
	const displayName = $derived(activeUser?.firstName || activeUser?.name || 'My Account')
	const serverMegaMenu = $derived((page.data as any)?.navigation?.megaMenu as any[] | undefined)
	const collectionProducts = $derived((page.data as any)?.navigation?.collectionProducts as any[] | undefined)
	const resolvedMenu = $derived(
		resolveAdminMenu(catalogMegaMenu, [], nav.home, [])
	)
	const homeLabel = 'Shop all'
	const homeHref = '/products'
</script>

<svelte:window onkeydown={(event) => { if (event.key === 'Escape') { openMega = null; if (searchOpen) closeSearch() } }} onscroll={() => (openMega = null)} />

<!-- Main header — Figma 63:83424 (logged out) / 63:83358 (logged in) -->
<header
	class="rj-header"
	onmouseleave={() => (openMega = null)}
	onfocusout={(event) => {
		if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) openMega = null
	}}
	onkeydown={(event) => {
		if (event.key === 'Escape') { openMega = null; if (searchOpen) closeSearch() }
	}}
>
	<div class="rj-header-inner">
		<!-- Row 1 -->
		<div class="rj-row-primary">
			<button class="rj-burger" type="button" aria-label="Open menu" onclick={() => (navModule.openSidebar = true)}>
				<Menu class="h-5 w-5" />
			</button>

			<a class="rj-brand" href="/" aria-label="{nav.brandName} home">
				<span class="rj-brand-mark">
					<img src={nav.logo} alt="" />
				</span>
				<span class="rj-brand-name">{nav.brandName}</span>
			</a>

		<!-- Product categories -->
		<div class="rj-row-menu">
			<nav class="rj-menu" aria-label="Main navigation">
				<a class="rj-menu-home" href={homeHref} aria-current={pathname === homeHref ? 'page' : undefined} onmouseenter={() => (openMega = null)}>
					{homeLabel}
				</a>
				<span class="rj-menu-divider"></span>
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
										<path d="M10.9329 0.75L6.74143 4.94143C6.24643 5.43643 5.43643 5.43643 4.94143 4.94143L0.75 0.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
			<div class="rj-actions" onmouseenter={() => (openMega = null)}>
				<button bind:this={searchToggle} class="rj-search-toggle" type="button" aria-label="Search products" aria-expanded={searchOpen} aria-controls="rj-header-search" onclick={toggleSearch}><Search size={21} strokeWidth={1.5} /></button>


				<a class="rj-cart" href="/checkout/cart" aria-label="Open cart">
					<span class="rj-cart-icon"><ShoppingBag size={21} strokeWidth={1.5} />{#if (cartState.cart?.qty || 0) > 0}<span class="rj-bag-badge">{cartState.cart.qty}</span>{/if}</span>
					<span class="rj-cart-label">{nav.cartLabel}</span>
				</a>

				{#if isLoggedIn}
					<RjProfileDropdown onSignOut={navModule.handleSignOut}>
						{#snippet trigger()}
							<span class="rj-account">
								<span class="rj-account-icon" aria-hidden="true"><UserRound size={21} strokeWidth={1.5} /></span>
								<span class="rj-account-text">
									<span class="rj-account-greeting">{nav.account.greetingLoggedIn}</span>
									<span class="rj-account-line">
										<span class="rj-account-name">{displayName}</span>
										<svg class="rj-i14" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
											<path
												d="M11.62 5.22083L7.81667 9.02417C7.3675 9.47333 6.6325 9.47333 6.18333 9.02417L2.38 5.22083"
												stroke="#292D32"
												stroke-width="1.2"
												stroke-miterlimit="10"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</span>
								</span>
							</span>
						{/snippet}
					</RjProfileDropdown>
				{:else}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger aria-label="Open account menu" class="rj-guest-trigger">
							<span class="rj-account">
							<span class="rj-account-icon" aria-hidden="true"><UserRound size={21} strokeWidth={1.5} /></span>
							<span class="rj-account-text rj-account-text--guest">
								<span class="rj-account-greeting">{nav.account.greeting}</span>
								<span class="rj-account-line">
									<span class="rj-account-auth">
										<span class="rj-account-link">{nav.account.signIn}</span><span class="rj-account-or">{nav.account.divider}</span><span
											class="rj-account-link">{nav.account.register}</span
										>
									</span>
									<svg class="rj-i14" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
										<path
											d="M11.62 5.22083L7.81667 9.02417C7.3675 9.47333 6.6325 9.47333 6.18333 9.02417L2.38 5.22083"
											stroke="#292D32"
											stroke-width="1.2"
											stroke-miterlimit="10"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</span>
							</span>
							</span>
						</DropdownMenu.Trigger>

						<DropdownMenu.Content align="end" sideOffset={8} class="rj-guest-menu">
							<DropdownMenu.Item class="rj-guest-item">
								<AuthButton class="rj-guest-signin" type="login">Sign in / Create Account</AuthButton>
							</DropdownMenu.Item>
							<div class="rj-guest-rule"></div>
							<DropdownMenu.Item class="rj-guest-item">
								<AuthButton class="rj-guest-row" type="login"><img class="rj-guest-icon" src="/ryans-jewels/icons/order-history.svg" alt="" /><span>Order History</span><ChevronRight /></AuthButton>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="rj-guest-item">
								<a class="rj-guest-row" href="/order-tracking"><img class="rj-guest-icon" src="/ryans-jewels/icons/track-order.svg" alt="" /><span>Track Order</span><ChevronRight /></a>
							</DropdownMenu.Item>
							<div class="rj-guest-rule"></div>
							<DropdownMenu.Item class="rj-guest-item">
								<AuthButton class="rj-guest-row" type="login"><img class="rj-guest-icon" src="/ryans-jewels/icons/rewards.svg" alt="" /><span>Rewards</span><ChevronRight /></AuthButton>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="rj-guest-item">
								<AuthButton class="rj-guest-row" type="login"><img class="rj-guest-icon" src="/ryans-jewels/icons/my-profile.svg" alt="" /><span>My Profile</span><ChevronRight /></AuthButton>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/if}
			</div>
		</div>


	</div>
	{#if searchOpen}
		<form id="rj-header-search" class="rj-header-search" role="search" action="/products" method="GET">
			<label class="sr-only" for="rj-search-query">Search products</label>
			<Search size={20} strokeWidth={1.5} />
			<input bind:this={searchInput} id="rj-search-query" name="search" type="search" placeholder="Search diamonds, rings, and more" required />
			<button type="submit" class="rj-search-submit">Search</button>
			<button type="button" class="rj-search-toggle" aria-label="Close search" onclick={closeSearch}><X size={20} /></button>
		</form>
	{/if}
</header>

<style>
	/* ------------------------------------------------------------------ *
	 * Source contract (Figma 1:5408 @1440):
	 *   utility bar  h 56, px 61, py 17, bg #cca646, inner 1318
	 *   header       h 155, px 61, py 22, column gap 22, inner 1318
	 * ------------------------------------------------------------------ */

	.rj-utility {
		position: relative;
		z-index: 60;
		background: var(--rj-gold, #cca646);
		color: #fff;
		font-family: 'Afacad', var(--font-body, sans-serif);
	}

	.rj-utility-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		min-height: 56px;
		margin: 0 auto;
		/* 186:56688 (1920 frame) keeps the gutters fixed and stretches the content. */
		padding: 17px 61px;
	}

	.rj-utility-group {
		display: flex;
		align-items: center;
		gap: 25px;
		min-width: 0;
	}

	.rj-utility-group--end {
		flex-shrink: 0;
	}

	.rj-utility-link,
	.rj-utility-postal,
	.rj-utility-locale {
		display: flex;
		align-items: center;
		font-size: 16px;
		line-height: normal;
		color: #fff;
		text-decoration: none;
		white-space: nowrap;
	}

	.rj-utility-link--icon {
		gap: 10px;
	}

	.rj-utility-link:hover {
		text-decoration: underline;
	}

	.rj-utility-postal {
		gap: 12px;
	}

	.rj-utility-locale {
		gap: 10px;
	}

	.rj-utility-locale-value {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.rj-locale-divider {
		width: 1px;
		height: 19px;
		background: #fff;
		flex-shrink: 0;
	}

	.rj-i20 {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
	}

	.rj-i21 {
		width: 21px;
		height: 21px;
		flex-shrink: 0;
	}

	.rj-i18 {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
	}

	.rj-i14 {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}

	/* ------------------------------- header ------------------------------- */

	.rj-header {
		position: sticky;
		top: 0;
		z-index: 50;
		width: 100%;
		min-height: 155px;
		background: #fff;
		border-bottom: 1px solid var(--rj-line, #e5e5e5);
		color: var(--rj-ink, #404040);
		font-family: 'Sarala', var(--font-body, sans-serif);
	}

	.rj-header-inner {
		display: flex;
		flex-direction: column;
		gap: 22px;
		margin: 0 auto;
		padding: 22px 61px;
	}

	/* -------------------------------- row 1 ------------------------------- */

	.rj-row-primary {
		display: flex;
		align-items: center;
		gap: 30px;
	}

	.rj-burger {
		display: none;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		padding: 0;
		border: 0;
		background: none;
		color: var(--rj-ink, #404040);
		cursor: pointer;
	}

	.rj-brand {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-shrink: 0;
		text-decoration: none;
	}

	/* Crop values are the source node's own image transform (63:83428). */
	.rj-brand-mark {
		position: relative;
		display: block;
		width: 55px;
		height: 52px;
		overflow: hidden;
		flex-shrink: 0;
		pointer-events: none;
	}

	.rj-brand-mark img {
		position: absolute;
		left: -59.69%;
		top: -39%;
		width: 206.72%;
		height: 221.3%;
		max-width: none;
	}

	.rj-brand-name {
		font-family: 'Inria Serif', var(--font-heading, serif);
		font-size: 26px;
		font-weight: 400;
		line-height: normal;
		color: var(--rj-gold, #cca646);
		white-space: nowrap;
	}

	/* -------------------------------- search ------------------------------ */

	@keyframes rj-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* ------------------------------- actions ------------------------------ */

	.rj-actions {
		display: flex;
		align-items: center;
		gap: 25px;
		flex-shrink: 0;
	}

	.rj-order {
		display: flex;
		align-items: flex-start;
		gap: 6px;
		text-decoration: none;
		color: var(--rj-ink, #404040);
	}

	.rj-order-icon {
		display: block;
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		padding-top: 2px;
	}

	.rj-order-icon svg {
		width: 21.55px;
		height: 19.3px;
	}

	/*
	 * 63:83441 is 67×24: the source trims both lines to cap height (8 and 11)
	 * with a 5 gap. Without that the block runs 51 tall and the icon drifts to
	 * the top instead of sitting against both lines.
	 */
	.rj-order-text {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.rj-order-top {
		font-size: 12px;
		font-weight: 400;
		line-height: 8px;
		color: var(--rj-ink-2, #606060);
	}

	.rj-order-bottom {
		font-size: 16px;
		font-weight: 700;
		line-height: 11px;
		color: var(--rj-ink, #404040);
		white-space: nowrap;
	}

	.rj-cart {
		display: flex;
		align-items: flex-end;
		gap: 4px;
		min-width: 86px;
		padding: 0;
		border: 0;
		background: none;
		color: var(--rj-ink, #404040);
		cursor: pointer;
		text-decoration: none;
	}

	.rj-cart-icon {
		position: relative;
		display: block;
		width: 27px;
		height: 27px;
		flex-shrink: 0;
	}

	.rj-cart-icon--count {
		width: 27px;
		height: 27px;
	}

	/* Count box mirrors the source text node inset (63:83383) inside the 27px icon. */
	.rj-cart-count {
		position: absolute;
		left: 41.67%;
		right: 25%;
		top: 7.87%;
		bottom: 49.54%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		font-weight: 700;
		line-height: normal;
		color: var(--rj-gold, #cca646);
	}

	.rj-cart-label {
		font-size: 16px;
		font-weight: 700;
		color: var(--rj-ink, #404040);
		white-space: nowrap;
	}

	.rj-account {
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--rj-ink, #404040);
		text-align: left;
	}

	.rj-account-icon {
		display: block;
		width: 24px;
		height: 24px;
		flex-shrink: 0;
	}

	/* 63:83456 is 118×28 — "Hello!" trimmed to 10, the auth line 14, gap 4. */
	.rj-account-text {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-family: 'Afacad', var(--font-body, sans-serif);
	}

	.rj-account-text--guest {
		width: 118px;
	}

	.rj-account-greeting {
		font-size: 16px;
		font-weight: 400;
		line-height: 10px;
		color: var(--rj-ink, #404040);
		white-space: nowrap;
	}

	.rj-account-line {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.rj-account-auth {
		font-family: 'Sarala', sans-serif;
		line-height: 10px;
		white-space: nowrap;
	}

	.rj-account-link {
		font-size: 14px;
		color: var(--rj-gold, #cca646);
		text-decoration: underline;
		text-underline-position: from-font;
		text-decoration-skip-ink: none;
	}

	.rj-account-or {
		font-size: 16px;
		color: var(--rj-ink-2, #606060);
	}

	.rj-account-name {
		font-size: 16px;
		color: var(--rj-gold, #cca646);
		white-space: nowrap;
	}

	:global(.rj-guest-trigger) {
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
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

	/* -------------------------------- row 2 ------------------------------- */

	.rj-row-menu {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
	}

	.rj-menu {
		display: flex;
		align-items: center;
		gap: 15px;
		min-width: 0;
	}

	.rj-menu-divider {
		width: 1px;
		height: 20px;
		flex-shrink: 0;
		background: var(--rj-gold, #cca646);
	}

	.rj-menu-list {
		display: flex;
		align-items: center;
		gap: 22px;
		min-width: 0;
	}

	.rj-menu-entry {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.rj-menu-entry.is-open :global(.rj-lab-mega),
	.rj-menu-entry.is-open :global(.rj-all-mega),
	.rj-menu-entry.is-open :global(.rj-rings-mega),
	.rj-menu-entry.is-open :global(.rj-admin-mega) {
		visibility: visible;
		opacity: 1;
		pointer-events: auto;
		transform: translate(-50%, 0);
	}

	.rj-menu-entry:hover .rj-menu-caret,
	.rj-menu-entry:focus-within .rj-menu-caret,
	.rj-menu-entry.is-open .rj-menu-caret {
		transform: rotate(180deg);
	}

	.rj-menu-home,
	.rj-menu-item {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
		font-size: 16px;
		font-weight: 400;
		line-height: normal;
		color: var(--rj-ink, #404040);
		text-decoration: none;
		white-space: nowrap;
		transition: color 0.18s ease;
	}

	/* Source keeps every menu label at #404040 — gold is reserved for hover. */
	.rj-menu-home:hover,
	.rj-menu-item:hover {
		color: var(--rj-gold, #cca646);
	}

	.rj-menu-caret {
		width: 10.183px;
		height: 4.563px;
		flex-shrink: 0;
		transition: transform 0.16s ease;
	}

	.rj-offers {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
		color: var(--rj-ink, #404040);
		text-decoration: none;
	}

	/* Two-layer gift composition from the source node (63:83484). */
	.rj-offers-gift {
		position: relative;
		display: block;
		width: 36px;
		height: 31px;
		flex-shrink: 0;
	}

	.rj-offers-gift-base {
		position: absolute;
		left: 0;
		top: 0;
		width: 27px;
		height: 31px;
		object-fit: cover;
	}

	.rj-offers-gift-top {
		position: absolute;
		left: 19px;
		top: 12px;
		width: 17px;
		height: 19px;
		object-fit: cover;
		transform: rotate(180deg) scaleY(-1);
	}

	.rj-offers-label {
		font-size: 16px;
		line-height: normal;
		white-space: nowrap;
	}

	.rj-offers:hover .rj-offers-label,
	.rj-offers:hover .rj-i18 {
		color: var(--rj-gold, #cca646);
	}

	/* Reused app components render their own wrappers — keep them inline. */
	.rj-actions :global(button),
	.rj-actions :global([data-slot='dropdown-menu-trigger']) {
		display: flex;
		align-items: center;
		padding: 0;
		background: none;
		border: 0;
	}


	/* --------------------------- responsive ------------------------------- *
	 * Three source frames drive these breakpoints — no derived values:
	 *   mobile  412  `77:106781`  (bar 77:106799, header 77:106821)
	 *   tablet  744  `63:40011`   (bar 63:40012,  header 63:41063)
	 *   desktop 1440 `1:5407`     (bar 1:5409,    header 63:83424)
	 * Both smaller frames drop the category row entirely — it lives in the
	 * mobile drawer — and collapse the action cluster to icons only.
	 * --------------------------------------------------------------------- */

	@media (max-width: 1279px) {
		.rj-utility-inner,
		.rj-header-inner {
			padding-left: 40px;
			padding-right: 40px;
		}

		.rj-menu-list {
			gap: 18px;
		}
	}

	/* ------------------------------ tablet 744 ---------------------------- */

	@media (max-width: 1023px) {
		.rj-utility-inner {
			min-height: 56px;
			padding: 17px 40px;
		}

		.rj-utility-group {
			gap: 19px;
		}

		.rj-utility-link,
		.rj-utility-postal,
		.rj-utility-locale {
			font-size: 15px;
		}

		.rj-i20 {
			width: 17px;
			height: 17px;
		}

		.rj-i21 {
			width: 18px;
			height: 19px;
		}

		.rj-header {
			min-height: 125px;
		}

		.rj-header-inner {
			gap: 11px;
			padding: 20px 25px;
		}

		.rj-row-primary {
			display: grid;
			grid-template-columns: auto auto;
			grid-template-areas:
				'brand actions';
			align-items: center;
			gap: 11px;
			justify-content: space-between;
		}

		/* Burger sits inside the brand cluster (gap 18) on tablet. */
		.rj-burger {
			display: flex;
			width: 40px;
			height: 40px;
			grid-area: brand;
			place-self: center start;
		}

		.rj-brand {
			grid-area: brand;
			gap: 12px;
			margin-left: 44px;
		}

		.rj-brand-mark {
			width: 32px;
			height: 30px;
		}

		.rj-brand-name {
			font-size: 22px;
		}

		.rj-actions {
			grid-area: actions;
			gap: 18px;
		}

		/* Source keeps only the three glyphs at 28px — no labels. */
		.rj-order-text,
		.rj-cart-label,
		.rj-account-text {
			display: none;
		}

		.rj-order-icon,
		.rj-cart-icon,
		.rj-account-icon {
			width: 28px;
			height: 28px;
			padding-top: 0;
		}

		.rj-order-icon svg {
			width: 25.14px;
			height: 22.52px;
		}

		.rj-account-icon svg {
			width: 27px;
			height: 27px;
		}

		.rj-cart-icon--count {
			width: 28px;
			height: 28px;
		}

		.rj-cart,
		.rj-order {
			justify-content: center;
			width: 40px;
			height: 40px;
			min-width: 40px;
			align-items: center;
			gap: 0;
		}

		:global(.rj-guest-trigger) {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 40px;
			height: 40px;
		}

		.rj-row-menu {
			display: none;
		}
	}

	/* ------------------------------ mobile 412 ---------------------------- */

	@media (max-width: 639px) {
		/* Gold bar becomes two centred rows (77:106801 / 77:106809). */
		.rj-utility-inner {
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			min-height: 83px;
			padding: 17px 20px;
			gap: 9px;
		}

		.rj-utility-group {
			width: 100%;
			justify-content: space-between;
			gap: 0;
			padding: 0 33px;
		}

		.rj-utility-group--end {
			padding: 0 60px;
		}

		.rj-utility-link,
		.rj-utility-postal,
		.rj-utility-locale {
			font-size: 13px;
		}

		.rj-utility-postal {
			gap: 10px;
		}

		.rj-utility-postal .rj-i21 {
			width: 16px;
			height: 16px;
		}

		.rj-utility-locale .rj-i21 {
			width: 15px;
			height: 15px;
		}

		.rj-utility-locale .rj-i18 {
			width: 14px;
			height: 14px;
		}

		.rj-header {
			min-height: 121px;
		}

		.rj-header-inner {
			gap: 11px;
			padding: 18px 20px;
		}

		/* 77:106824 — burger and brand share a fixed 193px justify-between block.
		   `minmax(0, …)` lets it give way on phones narrower than the 412 frame. */
		.rj-row-primary {
			grid-template-columns: minmax(0, 193px) minmax(0, auto);
			grid-template-areas:
				'brand actions';
			gap: 11px;
		}

		.rj-brand {
			gap: 10px;
			margin-left: 0;
			justify-self: end;
		}

		.rj-brand-name {
			font-size: 18px;
		}

		/* 77:106829 — three 28px glyphs justify-between inside 120px. */
		.rj-actions {
			width: 120px;
			justify-content: space-between;
			gap: 0;
		}
	}

	/* Compact navigation refresh; original logo and gold accents are retained. */
	.rj-header { min-height: 0; box-shadow: 0 3px 14px #20202004; }
	.rj-header-inner { max-width: 1440px; padding: 0 48px; gap: 0; }
	.rj-row-primary { height: 86px; gap: 45px; justify-content: space-between; }
	.rj-brand-mark { width: 46px; height: 44px; }
	.rj-brand-name { font-size: 25px; }
	.rj-actions { gap: 24px; }
	.rj-cart { gap: 9px; min-height: 44px; }
	.rj-cart-icon { position: relative; width: 24px; height: 24px; padding: 0; }
	.rj-cart-label, .rj-account-name, .rj-account-link { font-size: 12px; font-weight: 400; }
	.rj-bag-badge { position: absolute; right: -6px; top: -7px; min-width: 15px; height: 15px; padding: 0 3px; border-radius: 50%; background: #404040; color: #fff; font: 9px/15px Inter, sans-serif; text-align: center; }
	.rj-account { min-height: 44px; gap: 9px; }
	.rj-account-icon { width: 22px; height: 22px; }
	.rj-account-text--guest { width: auto; }
	.rj-account-greeting, .rj-account-or, .rj-account-link:last-child { display: none; }
	.rj-account-link { color: #404040; text-decoration: none; }
	.rj-row-menu { min-height: 50px; border-top: 1px solid #f0efed; gap: 30px; }
	.rj-menu, .rj-menu-list { gap: 32px; }
	.rj-menu-divider { display: none; }
	.rj-menu-home, .rj-menu-item { min-height: 50px; position: relative; font-size: 12px; letter-spacing: .2px; gap: 7px; }
	.rj-menu-home::after, .rj-menu-item::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--rj-gold); transform: scaleX(0); transition: transform 180ms; }
	.rj-menu-home:hover::after, .rj-menu-entry.is-open .rj-menu-item::after { transform: scaleX(1); }
	.rj-visit { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; text-decoration: none; color: #686868; white-space: nowrap; }
	.rj-visit:hover { color: var(--rj-gold); }
	.rj-header a:focus-visible, .rj-header button:focus-visible { outline: 2px solid var(--rj-gold); outline-offset: 4px; }
	@media (max-width: 1100px) { .rj-header-inner { padding-inline: 25px; } .rj-row-primary { gap: 24px; } .rj-actions { gap: 16px; } .rj-menu, .rj-menu-list { gap: 25px; } }
	@media (max-width: 767px), (min-width: 768px) and (max-width: 1100px) and (orientation: portrait) {
		.rj-header-inner { padding: 14px 20px; }
		.rj-row-primary { height: auto; display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: 'brand actions'; gap: 13px; }
		.rj-brand { margin-left: 35px; justify-self: start; gap: 8px; }
		.rj-brand-mark { width: 34px; height: 33px; }
		.rj-brand-name { font-size: 22px; }
		.rj-actions { width: auto; gap: 8px; }
		.rj-cart-icon { width: 24px; height: 24px; }
		.rj-account-icon { width: 22px; height: 22px; }
		.rj-row-menu { display: none; }
	}
	@media (max-width: 400px) { .rj-header-inner { padding-inline: 15px; } .rj-brand-name { font-size: 18px; } .rj-brand { margin-left: 30px; gap: 6px; } }
	@media (prefers-reduced-motion: reduce) { .rj-menu-home::after, .rj-menu-item::after { transition: none; } }


	/* One aligned row for the brand, catalog, and account actions. */
	.rj-header-inner { max-width: 1600px; padding-inline: 32px; }
	.rj-row-primary { display: flex; height: 82px; gap: 28px; }
	.rj-row-menu { display: flex; flex: 1; justify-content: center; border: 0; min-height: 0; }
	.rj-menu, .rj-menu-list { gap: 22px; }
	.rj-menu-home, .rj-menu-item { min-height: 82px; white-space: nowrap; }
	.rj-brand-name { font-size: 23px; }
	.rj-actions { flex-shrink: 0; gap: 20px; align-items: center; }
	.rj-cart, .rj-account { align-items: center; min-width: 0; height: 44px; gap: 7px; }
	.rj-cart-icon, .rj-account-icon { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0; }
	.rj-cart-label, .rj-account-link, .rj-account-name { line-height: 20px; }
	.rj-account-text, .rj-account-line, .rj-account-auth { align-items: center; gap: 5px; }
	.rj-search-toggle { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 44px; flex-shrink: 0; border: 0; padding: 0; background: transparent; color: #404040; cursor: pointer; }
	.rj-header-search { display: flex; align-items: center; gap: 14px; width: min(680px, calc(100% - 40px)); margin: 0 auto; padding: 12px 0 18px; }
	.rj-header-search input { width: 100%; min-width: 0; border: 0; border-bottom: 1px solid #ddd; padding: 12px 0; outline: none; font-size: 14px; background: #fff; }
	.rj-header-search input:focus { border-color: var(--rj-gold); }
	.rj-search-submit { border: 0; border-radius: 3px; padding: 10px 16px; background: var(--rj-gold); color: white; font-size: 12px; cursor: pointer; }
	@media (min-width: 1101px) and (max-width: 1279px) {
		.rj-header-inner { padding-inline: 24px; }
		.rj-row-primary { gap: 18px; }
		.rj-brand-name { font-size: 20px; }
		.rj-menu, .rj-menu-list { gap: 14px; }
		.rj-actions { gap: 12px; }
	}
	@media (max-width: 1100px) {
		.rj-header-inner { padding: 10px 20px; }
		.rj-row-primary { height: 52px; display: flex; gap: 12px; }
		.rj-burger { display: flex; width: 24px; height: 44px; }
		.rj-brand { margin: 0; gap: 6px; }
		.rj-brand-mark { width: 34px; height: 33px; }
		.rj-brand-name { font-size: 20px; }
		.rj-row-menu { display: none; }
		.rj-actions { margin-left: auto; width: auto; gap: 8px; }
		.rj-account-text, .rj-cart-label { display: none; }
		.rj-search-toggle { width: 30px; }
	}
	@media (max-width: 400px) {
		.rj-header-inner { padding-inline: 12px; }
		.rj-row-primary { gap: 7px; }
		.rj-brand-name { font-size: 17px; }
		.rj-actions { gap: 5px; }
	}
	@media (max-width: 360px) { .rj-brand-name { font-size: 15px; } .rj-row-primary { gap: 5px; } }
</style>
