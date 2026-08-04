<script lang="ts">
	import { Heart, Menu, UserRound, ChevronDown } from '@lucide/svelte'
	import MsSearch from '$lib/components/nav/ms-search.svelte'
	import CartSidebar from '$lib/components/nav/cart-sidebar.svelte'
	import ProfileDropdown from '$lib/components/nav/profile-dropdown.svelte'
	import { AuthButton } from '$lib/core/components/index.js'

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

	const tagline = 'MADE TO ORDER : CRAFTED WITHIN 7-10 DAYS'

	// Mega-menu items (labels exact from source; links mapped to app routes)
	const navItems = [
		{ label: 'ALL JEWELRY', href: '/products', dropdown: true },
		{ label: 'VINTAGE JEWELRY', href: '/products?q=vintage' },
		{ label: 'CUSTOM JEWELRY', href: '/products?q=custom' },
		{ label: 'SERVICE', href: '/p/shipping-policy' },
		{ label: 'ABOUT', href: '/about-us' },
		{ label: 'CONTACT', href: '/contact-us' }
	]
</script>

<header class="bt-header">
	<!-- Announce bar (desktop/tablet) -->
	<div class="bt-announce"><p>{tagline}</p></div>

	<!-- Mobile row -->
	<div class="bt-row-mobile">
		<a href="/" class="bt-logo">BORIS &amp; TWINS</a>
		<div class="bt-icons">
			<MsSearch />
			{#if wishlistPlugin?.active}
				<a href="/my/wishlist" class="bt-icon-link" aria-label="Wishlist">
					<Heart class="h-5 w-5" />
					{#if wishlistState?.count > 0}<span class="bt-badge">{wishlistState.count}</span>{/if}
				</a>
			{/if}
			{#if !pathname.startsWith('/checkout')}
				<CartSidebar
					onClose={navModule.closeCartSidebar}
					onContinueShopping={navModule.handleContinueShoppingClick}
					onRemoveCartItem={navModule.removeCartItem}
				/>
			{/if}
			<button class="bt-icon-link" type="button" aria-label="Open menu" onclick={() => (navModule.openSidebar = true)}>
				<Menu class="h-5 w-5" />
			</button>
		</div>
	</div>

	<!-- Desktop row -->
	<div class="bt-row-desktop">
		<div class="bt-logo-group">
			<a href="/" class="bt-logo">BORIS &amp; TWINS</a>
			<span class="bt-vdiv"></span>
		</div>
		<p class="bt-tagline">{tagline}</p>
		<div class="bt-icons-desktop">
			<span class="bt-vdiv"></span>
			<div class="bt-icon-slot"><MsSearch /></div>
			<span class="bt-vdiv"></span>
			{#if !pathname.startsWith('/checkout')}
				<div class="bt-icon-slot">
					<CartSidebar
						onClose={navModule.closeCartSidebar}
						onContinueShopping={navModule.handleContinueShoppingClick}
						onRemoveCartItem={navModule.removeCartItem}
					/>
				</div>
				<span class="bt-vdiv"></span>
			{/if}
			{#if wishlistPlugin?.active}
				<a href="/my/wishlist" class="bt-icon-link" aria-label="Wishlist">
					<Heart class="h-5 w-5" />
					{#if wishlistState?.count > 0}<span class="bt-badge">{wishlistState.count}</span>{/if}
				</a>
				<span class="bt-vdiv"></span>
			{/if}
			<div class="bt-icon-slot">
				{#if userState?.user?.role}
					<ProfileDropdown onSignOut={navModule.handleSignOut} />
				{:else}
					<AuthButton aria-label="Login" type="login">
						<span class="bt-icon-link"><UserRound class="h-5 w-5" /></span>
					</AuthButton>
				{/if}
			</div>
			<span class="bt-vdiv"></span>
		</div>
	</div>

	<span class="bt-hline"></span>

	<!-- Mega menu -->
	<nav class="bt-mega" aria-label="Main navigation">
		<div class="bt-mega-inner">
			{#each navItems as item}
				<a class="bt-nav-item" href={item.href}>
					<span>{item.label}</span>
					{#if item.dropdown}<ChevronDown class="bt-nav-arrow h-[18px] w-[18px]" />{/if}
				</a>
			{/each}
		</div>
	</nav>
	<span class="bt-hline"></span>
</header>

<style>
	.bt-header {
		position: sticky;
		top: 0;
		z-index: 100;
		width: 100%;
		background: #fff;
		font-family: 'Chivo', var(--font-body, sans-serif);
	}

	.bt-hline {
		display: block;
		height: 1px;
		width: 100%;
		background: #e9e9e9;
	}

	.bt-vdiv {
		width: 1px;
		height: 80px;
		background: #d9d9d9;
		flex-shrink: 0;
	}

	.bt-logo {
		font-family: 'Chonburi', serif;
		color: #9e260e;
		white-space: nowrap;
		line-height: normal;
		text-decoration: none;
		display: block;
	}

	/* Announce bar */
	.bt-announce {
		border-bottom: 1px solid #e9e9e9;
	}

	.bt-announce p {
		font-family: 'Chivo', sans-serif;
		font-size: 13px;
		color: #202020;
		text-align: center;
		padding: 13px 16px;
		line-height: normal;
	}

	/* Icons shared */
	.bt-icon-link {
		position: relative;
		display: grid;
		place-items: center;
		background: none;
		border: none;
		padding: 0;
		color: #292d32;
		cursor: pointer;
		transition: opacity 0.18s;
	}

	.bt-icon-link:hover {
		opacity: 0.6;
	}

	.bt-badge {
		position: absolute;
		top: -5px;
		right: -6px;
		min-width: 15px;
		height: 15px;
		padding: 0 3px;
		font-size: 9px;
		line-height: 15px;
		text-align: center;
		border-radius: 9px;
		background: #9e260e;
		color: #fff;
	}

	/* Reused app components render their own icon buttons — normalize their size/color */
	.bt-icons :global(svg),
	.bt-icons-desktop :global(svg) {
		width: 20px;
		height: 20px;
		color: #292d32;
	}

	.bt-icon-slot :global(button) {
		display: grid;
		place-items: center;
		padding: 0;
	}

	/* Mobile row */
	.bt-row-mobile {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 14px 16px;
		width: 100%;
	}

	.bt-row-mobile .bt-logo {
		font-size: 18px;
	}

	.bt-icons {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	/* Desktop row */
	.bt-row-desktop {
		display: none;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 60px;
	}

	.bt-logo-group {
		display: flex;
		align-items: center;
		gap: 30px;
		flex-shrink: 0;
	}

	.bt-logo-group .bt-logo {
		font-size: 26px;
	}

	.bt-tagline {
		flex: 1;
		min-width: 0;
		text-align: center;
		font-family: 'Chivo', sans-serif;
		font-size: 16px;
		color: #202020;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 0 20px;
	}

	.bt-icons-desktop {
		display: flex;
		align-items: center;
		gap: 20px;
		flex-shrink: 0;
	}

	.bt-icon-slot {
		display: grid;
		place-items: center;
	}

	/* Mega menu */
	.bt-mega {
		display: none;
		width: 100%;
	}

	.bt-mega-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 60px;
	}

	.bt-nav-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 21px 27px;
		flex-shrink: 0;
		text-decoration: none;
		transition: background 0.15s;
	}

	.bt-nav-item:hover {
		background: #f9f9f9;
	}

	.bt-nav-item span {
		font-family: 'Chivo', sans-serif;
		font-size: 16px;
		color: #595454;
		white-space: nowrap;
		transition: color 0.15s;
	}

	.bt-nav-item:hover span {
		color: #9e260e;
	}

	.bt-nav-arrow {
		flex-shrink: 0;
		color: #595454;
		transition: color 0.15s;
	}

	.bt-nav-item:hover .bt-nav-arrow {
		color: #9e260e;
	}

	/* Breakpoints (source: mobile <768, desktop >=1024 shows rows + mega) */
	@media (min-width: 768px) {
		.bt-announce {
			display: none;
		}
		.bt-row-mobile {
			display: none;
		}
		.bt-row-desktop {
			display: flex;
			padding: 0 32px;
			border-top: 1px solid #e9e9e9;
		}
		.bt-mega {
			display: block;
		}
		.bt-mega-inner {
			padding: 0 32px;
		}
	}

	@media (min-width: 1024px) {
		.bt-row-desktop {
			padding: 0 60px;
		}
		.bt-mega-inner {
			padding: 0 60px;
		}
	}
</style>
