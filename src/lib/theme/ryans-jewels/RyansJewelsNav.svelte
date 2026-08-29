<script lang="ts">
	import { ChevronRight, Menu } from '@lucide/svelte'
	import { page } from '$app/state'
	import ProfileDropdown from '$lib/components/nav/profile-dropdown.svelte'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { AuthButton } from '$lib/core/components/index.js'
	import { MsSearchRenderer } from '$lib/core/composables/index.js'
	import { priceRoundUp } from '@misiki/kitcommerce-core/utils'
	import { getCartState } from '$lib/core/stores/index.js'
	import { ryansJewelsNavContent as nav } from './nav-content.js'
	import RjAdminMegaMenu from './RjAdminMegaMenu.svelte'
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

	let search = $state('')
	let openMega = $state<string | null>(null)
	const cartState = getCartState()

	const isLoggedIn = $derived(!!userState?.user?.role)
	const displayName = $derived(userState?.user?.firstName || userState?.user?.name || 'My Account')
	const isMobileRequest = $derived((page.data as any)?.navigation?.isMobileRequest === true)
	const serverMegaMenu = $derived((page.data as any)?.navigation?.megaMenu as any[] | undefined)
	const resolvedMenu = $derived(
		resolveAdminMenu(navModule.megaMenu.length ? navModule.megaMenu : serverMegaMenu, navModule.navMenu, nav.home, serverMegaMenu === undefined ? nav.menu : [])
	)
	const homeLabel = $derived(menuLabel(resolvedMenu.home))
	const homeHref = '/'
</script>

<!-- Utility bar — Figma 1:5409 -->
<div class="rj-utility">
	<div class="rj-utility-inner">
		<div class="rj-utility-group">
			<a class="rj-utility-link" href={nav.utility.dailyDeals.href}>{nav.utility.dailyDeals.label}</a>

			<a class="rj-utility-link rj-utility-link--icon" href={nav.utility.giftCard.href}>
				<svg class="rj-i20" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M16.6417 8.33333H3.30833V15C3.30833 17.5 4.14167 18.3333 6.64167 18.3333H13.3083C15.8083 18.3333 16.6417 17.5 16.6417 15V8.33333Z"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-miterlimit="10"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M17.9167 5.83333V6.66667C17.9167 7.58333 17.475 8.33333 16.25 8.33333H3.75C2.475 8.33333 2.08333 7.58333 2.08333 6.66667V5.83333C2.08333 4.91667 2.475 4.16667 3.75 4.16667H16.25C17.475 4.16667 17.9167 4.91667 17.9167 5.83333Z"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-miterlimit="10"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M9.7 4.16667H5.1C4.81667 3.85833 4.825 3.38333 5.125 3.08333L6.30833 1.9C6.61667 1.59167 7.125 1.59167 7.43333 1.9L9.7 4.16667Z"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-miterlimit="10"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M14.8917 4.16667H10.2917L12.5583 1.9C12.8667 1.59167 13.375 1.59167 13.6833 1.9L14.8667 3.08333C15.1667 3.38333 15.175 3.85833 14.8917 4.16667Z"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-miterlimit="10"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M7.45 8.33333V12.6167C7.45 13.2833 8.18333 13.675 8.74167 13.3167L9.525 12.8C9.80833 12.6167 10.1667 12.6167 10.4417 12.8L11.1833 13.3C11.7333 13.6667 12.475 13.275 12.475 12.6083V8.33333H7.45Z"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-miterlimit="10"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span>{nav.utility.giftCard.label}</span>
			</a>

			<a class="rj-utility-link rj-utility-link--icon" href={nav.utility.helpContact.href}>
				<svg class="rj-i20" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M4.65828 18.9167C2.70828 18.9167 1.05827 17.2667 1.05827 15.3167V10.1834C1.00827 7.75836 1.91662 5.46671 3.59996 3.74171C5.28329 2.02504 7.54995 1.08337 9.97495 1.08337C14.9416 1.08337 18.9749 5.12504 18.9749 10.0917V15.2251C18.9749 17.2084 17.3583 18.8251 15.375 18.8251C13.3916 18.8251 11.775 17.2084 11.775 15.2251V12.8834C11.775 11.6917 12.7416 10.725 13.9333 10.725C15.125 10.725 16.0916 11.6917 16.0916 12.8834V15.4084C16.0916 15.75 15.8083 16.0334 15.4666 16.0334C15.1249 16.0334 14.8416 15.75 14.8416 15.4084V12.8834C14.8416 12.3167 14.3833 11.975 13.9333 11.975C13.3666 11.975 13.025 12.4334 13.025 12.8834V15.2251C13.025 16.5001 14.1 17.5751 15.375 17.5751C16.65 17.5751 17.7249 16.5001 17.7249 15.2251V10.0917C17.7249 5.8167 14.25 2.33337 9.97495 2.33337C7.88329 2.33337 5.94163 3.1417 4.49163 4.6167C3.04163 6.0917 2.26661 8.06673 2.30827 10.1667V15.3084C2.30827 16.5834 3.38328 17.6584 4.65828 17.6584C5.93328 17.6584 7.00829 16.5834 7.00829 15.3084V12.9667C7.00829 12.4 6.54996 12.0584 6.09996 12.0584C5.53329 12.0584 5.19163 12.5167 5.19163 12.9667V15.4C5.19163 15.7417 4.90829 16.025 4.56663 16.025C4.22496 16.025 3.94163 15.7417 3.94163 15.4V12.9667C3.94163 11.7584 4.89162 10.8084 6.09996 10.8084C7.29162 10.8084 8.25829 11.775 8.25829 12.9667V15.3084C8.25829 17.3 6.64161 18.9167 4.65828 18.9167Z"
						fill="currentColor"
					/>
					<path
						d="M10.9831 9.88332C10.6498 9.88332 10.3498 9.70002 10.2081 9.40002L8.99976 6.99168L8.64978 7.64165C8.45811 7.99999 8.07478 8.225 7.66645 8.225H7.05811C6.71644 8.225 6.43311 7.94166 6.43311 7.6C6.43311 7.25833 6.71644 6.975 7.05811 6.975H7.59143L8.24977 5.75831C8.4081 5.47498 8.69976 5.32499 9.02476 5.29999C9.34976 5.29999 9.64144 5.49166 9.79144 5.77499L10.9831 8.15832L11.2664 7.58331C11.4581 7.19998 11.8331 6.96665 12.2664 6.96665H12.9414C13.2831 6.96665 13.5664 7.24999 13.5664 7.59165C13.5664 7.93332 13.2831 8.21665 12.9414 8.21665H12.3498L11.7581 9.39168C11.6081 9.70002 11.3164 9.88332 10.9831 9.88332Z"
						fill="currentColor"
					/>
				</svg>
				<span>{nav.utility.helpContact.label}</span>
			</a>
		</div>

		<div class="rj-utility-group rj-utility-group--end">
			<div class="rj-utility-postal">
				<svg class="rj-i21" width="21" height="21" viewBox="0 0 21 21" fill="none" aria-hidden="true">
					<g stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
						<path d="M10.5 12.25H11.375C12.3375 12.25 13.125 11.4625 13.125 10.5V1.75H5.25C3.9375 1.75 2.79126 2.47624 2.19626 3.54374" />
						<path
							d="M1.75 14.875C1.75 16.3275 2.9225 17.5 4.375 17.5H5.25C5.25 16.5375 6.0375 15.75 7 15.75C7.9625 15.75 8.75 16.5375 8.75 17.5H12.25C12.25 16.5375 13.0375 15.75 14 15.75C14.9625 15.75 15.75 16.5375 15.75 17.5H16.625C18.0775 17.5 19.25 16.3275 19.25 14.875V12.25H16.625C16.1437 12.25 15.75 11.8563 15.75 11.375V8.75C15.75 8.26875 16.1437 7.875 16.625 7.875H17.7537L16.2575 5.25876C15.9425 4.71626 15.365 4.375 14.735 4.375H13.125V10.5C13.125 11.4625 12.3375 12.25 11.375 12.25H10.5"
						/>
						<path d="M7 19.25C7.9665 19.25 8.75 18.4665 8.75 17.5C8.75 16.5335 7.9665 15.75 7 15.75C6.0335 15.75 5.25 16.5335 5.25 17.5C5.25 18.4665 6.0335 19.25 7 19.25Z" />
						<path d="M14 19.25C14.9665 19.25 15.75 18.4665 15.75 17.5C15.75 16.5335 14.9665 15.75 14 15.75C13.0335 15.75 12.25 16.5335 12.25 17.5C12.25 18.4665 13.0335 19.25 14 19.25Z" />
						<path d="M19.25 10.5V12.25H16.625C16.1437 12.25 15.75 11.8563 15.75 11.375V8.75C15.75 8.26875 16.1437 7.875 16.625 7.875H17.7537L19.25 10.5Z" />
						<path d="M1.75 7H7" />
						<path d="M1.75 9.625H5.25" />
						<path d="M1.75 12.25H3.5" />
					</g>
				</svg>
				<span>{nav.utility.postalCodeLabel}</span>
			</div>

			<div class="rj-utility-locale">
				<svg class="rj-i21" width="21" height="21" viewBox="0 0 21 21" fill="none" aria-hidden="true">
					<g stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
						<path d="M10.5 19.25C15.3325 19.25 19.25 15.3325 19.25 10.5C19.25 5.66751 15.3325 1.75 10.5 1.75C5.66751 1.75 1.75 5.66751 1.75 10.5C1.75 15.3325 5.66751 19.25 10.5 19.25Z" />
						<path d="M7 2.625H7.875C6.16875 7.735 6.16875 13.265 7.875 18.375H7" />
						<path d="M13.125 2.625C14.8312 7.735 14.8312 13.265 13.125 18.375" />
						<path d="M2.625 14V13.125C7.735 14.8312 13.265 14.8312 18.375 13.125V14" />
						<path d="M2.625 7.875C7.735 6.16875 13.265 6.16875 18.375 7.875" />
					</g>
				</svg>
				<div class="rj-utility-locale-value">
					<span>{nav.utility.countryCode}</span>
					<span class="rj-locale-divider"></span>
					<span>{nav.utility.language}</span>
					<svg class="rj-i18" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
						<path
							d="M14.94 6.7125L10.05 11.6025C9.4725 12.18 8.5275 12.18 7.95 11.6025L3.06 6.7125"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-miterlimit="10"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Main header — Figma 63:83424 (logged out) / 63:83358 (logged in) -->
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
	<div class="rj-header-inner">
		<!-- Row 1 -->
		<div class="rj-row-primary" onmouseenter={() => (openMega = null)}>
			<button class="rj-burger" type="button" aria-label="Open menu" onclick={() => (navModule.openSidebar = true)}>
				<Menu class="h-5 w-5" />
			</button>

			<a class="rj-brand" href="/" aria-label="{nav.brandName} home">
				<span class="rj-brand-mark">
					<img src={nav.logo} alt="" />
				</span>
				<span class="rj-brand-name">{nav.brandName}</span>
			</a>

			<MsSearchRenderer bind:search>
				{#snippet content({ searchResults, showSearchResults, loading, searchPlugin, closeSearch, handleKeyDown, handleResultClick, toggleSearchResults })}
					<div class="rj-search">
						<input
							class="rj-search-input"
							type="search"
							bind:value={search}
							placeholder={searchPlugin?.placeholder || nav.searchPlaceholder}
							aria-label={searchPlugin?.placeholder || nav.searchPlaceholder}
							autocomplete="off"
							enterkeyhint="search"
							onfocus={() => toggleSearchResults(true)}
							onkeydown={handleKeyDown}
						/>
						<span class="rj-search-icon" aria-hidden="true">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M10 6.00077C8.93913 6.00077 7.92172 6.42219 7.17157 7.17234C6.42143 7.92248 6 8.9399 6 10.0008C6 11.0616 6.42143 12.079 7.17157 12.8292C7.92172 13.5793 8.93913 14.0008 10 14.0008C11.0609 14.0008 12.0783 13.5793 12.8284 12.8292C13.5786 12.079 14 11.0616 14 10.0008C14 8.9399 13.5786 7.92248 12.8284 7.17234C12.0783 6.42219 11.0609 6.00077 10 6.00077ZM4 10.0008C3.99988 9.05647 4.22264 8.12548 4.65017 7.28351C5.0777 6.44154 5.69792 5.71236 6.4604 5.15529C7.22287 4.59822 8.10606 4.22898 9.03815 4.0776C9.97023 3.92622 10.9249 3.99698 11.8245 4.28412C12.724 4.57126 13.5432 5.06667 14.2152 5.73006C14.8872 6.39346 15.3931 7.2061 15.6919 8.1019C15.9906 8.9977 16.0737 9.95136 15.9343 10.8853C15.795 11.8193 15.4372 12.7072 14.89 13.4768L19.707 18.2938C19.8892 18.4824 19.99 18.735 19.9877 18.9972C19.9854 19.2594 19.8802 19.5102 19.6948 19.6956C19.5094 19.881 19.2586 19.9862 18.9964 19.9884C18.7342 19.9907 18.4816 19.8899 18.293 19.7078L13.477 14.8918C12.5794 15.53 11.5233 15.9089 10.4247 15.9869C9.326 16.0648 8.22707 15.8389 7.2483 15.3337C6.26953 14.8286 5.44869 14.0638 4.87572 13.1231C4.30276 12.1824 3.99979 11.1022 4 10.0008V10.0008Z"
									fill="#B0BABF"
								/>
							</svg>
						</span>

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
					</div>
				{/snippet}
			</MsSearchRenderer>

			<div class="rj-actions">
				<a class="rj-order" href={nav.orderReturn.href}>
					<span class="rj-order-icon" aria-hidden="true">
						<svg width="21.55" height="19.3" viewBox="0 0 21.55 19.3" fill="none">
							<g stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
								<path
									d="M8.65 13.15L11.65 14.15C11.65 14.15 19.15 12.65 20.15 12.65C21.15 12.65 21.15 13.65 20.15 14.65C19.15 15.65 15.65 18.65 12.65 18.65C9.65 18.65 7.65 17.15 5.65 17.15H0.65"
								/>
								<path
									d="M0.65 11.15C1.65 10.15 3.65 8.65 5.65 8.65C7.65 8.65 12.4 10.65 13.15 11.65C13.9 12.65 11.65 14.15 11.65 14.15M6.65 5.65V1.65C6.65 1.38478 6.75536 1.13043 6.94289 0.942893C7.13043 0.755357 7.38478 0.65 7.65 0.65H19.65C19.9152 0.65 20.1696 0.755357 20.3571 0.942893C20.5446 1.13043 20.65 1.38478 20.65 1.65V9.65"
								/>
								<path d="M11.15 0.65H16.15V5.15H11.15V0.65Z" />
							</g>
						</svg>
					</span>
					<span class="rj-order-text">
						<span class="rj-order-top">{nav.orderReturn.top}</span>
						<span class="rj-order-bottom">{nav.orderReturn.bottom}</span>
					</span>
				</a>

				<a class="rj-cart" class:rj-cart--empty={!cartState.cart?.qty} href="/checkout/cart" aria-label="Open cart">
					{#if (cartState.cart?.qty || 0) > 0}
									<span class="rj-cart-icon rj-cart-icon--count">
										<svg width="27" height="27" viewBox="0 0 27 27" fill="none" aria-hidden="true">
											<path
												d="M9.99805 25C10.93 25 11.6855 24.2445 11.6855 23.3125C11.6855 22.3805 10.93 21.625 9.99805 21.625C9.06607 21.625 8.31055 22.3805 8.31055 23.3125C8.31055 24.2445 9.06607 25 9.99805 25Z"
												fill="currentColor"
											/>
											<path
												d="M20.25 25C21.182 25 21.9375 24.2445 21.9375 23.3125C21.9375 22.3805 21.182 21.625 20.25 21.625C19.318 21.625 18.5625 22.3805 18.5625 23.3125C18.5625 24.2445 19.318 25 20.25 25Z"
												fill="currentColor"
											/>
											<path
												d="M22.4999 11.125H22.1849L21.2474 15.25H9.99737L6.56987 4.39751C6.5328 4.28235 6.46842 4.17787 6.38222 4.09298C6.29603 4.00809 6.19058 3.94532 6.07487 3.91001L2.99987 2.96501C2.90532 2.93595 2.80597 2.9258 2.7075 2.93514C2.60902 2.94448 2.51335 2.97313 2.42595 3.01944C2.24943 3.11297 2.1173 3.2728 2.05862 3.46376C1.99994 3.65471 2.01952 3.86116 2.11305 4.03768C2.20659 4.21419 2.36641 4.34633 2.55737 4.40501L5.24987 5.23001L8.69237 16.105L7.46237 17.11L7.36487 17.2075C7.06062 17.5581 6.88817 18.0039 6.87722 18.468C6.86627 18.932 7.0175 19.3854 7.30487 19.75C7.50929 19.9986 7.76905 20.1959 8.06337 20.3261C8.3577 20.4564 8.67841 20.5159 8.99987 20.5H21.5174C21.7163 20.5 21.907 20.421 22.0477 20.2803C22.1884 20.1397 22.2674 19.9489 22.2674 19.75C22.2674 19.5511 22.1884 19.3603 22.0477 19.2197C21.907 19.079 21.7163 19 21.5174 19H8.87987C8.7935 18.9971 8.70936 18.9719 8.63556 18.9269C8.56177 18.882 8.50081 18.8187 8.45859 18.7433C8.41637 18.6679 8.3943 18.5829 8.39453 18.4965C8.39475 18.4101 8.41726 18.3252 8.45987 18.25L10.2674 16.75H21.8474C22.0207 16.7542 22.1902 16.6983 22.327 16.5916C22.4637 16.4849 22.5593 16.3342 22.5974 16.165L23.7749 10.9825C23.3567 11.0784 22.9289 11.1262 22.4999 11.125Z"
												fill="currentColor"
											/>
										</svg>
							<span class="rj-cart-count">{cartState.cart.qty}</span>
									</span>
								{:else}
									<span class="rj-cart-icon">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
											<g clip-path="url(#rj-cart-clip)">
												<path
													d="M8.88667 21.3333C9.71509 21.3333 10.3867 20.6618 10.3867 19.8333C10.3867 19.0049 9.71509 18.3333 8.88667 18.3333C8.05824 18.3333 7.38667 19.0049 7.38667 19.8333C7.38667 20.6618 8.05824 21.3333 8.88667 21.3333Z"
													fill="currentColor"
												/>
												<path
													d="M18 21.3333C18.8284 21.3333 19.5 20.6618 19.5 19.8333C19.5 19.0049 18.8284 18.3333 18 18.3333C17.1716 18.3333 16.5 19.0049 16.5 19.8333C16.5 20.6618 17.1716 21.3333 18 21.3333Z"
													fill="currentColor"
												/>
												<path d="M15.0467 4.66667C15.0163 4.44573 15.0007 4.22301 15 4C15.0007 3.77699 15.0163 3.55427 15.0467 3.33333H7.66L8.09333 4.66667H15.0467Z" fill="currentColor" />
												<path
													d="M20 9H19.72L18.8867 12.6667H8.88667L5.84 3.02C5.80705 2.91764 5.74982 2.82477 5.6732 2.74931C5.59658 2.67386 5.50285 2.61805 5.4 2.58667L2.66667 1.74667C2.58262 1.72084 2.49431 1.71182 2.40678 1.72012C2.31925 1.72842 2.23421 1.75389 2.15652 1.79505C1.99961 1.87819 1.88216 2.02026 1.83 2.19C1.77784 2.35974 1.79525 2.54325 1.87839 2.70015C1.96153 2.85706 2.10359 2.97451 2.27333 3.02667L4.66667 3.76L7.72667 13.4267L6.63333 14.32L6.54667 14.4067C6.27622 14.7183 6.12293 15.1145 6.1132 15.5271C6.10346 15.9396 6.23789 16.3426 6.49333 16.6667C6.67504 16.8876 6.90594 17.063 7.16756 17.1788C7.42918 17.2945 7.71426 17.3475 8 17.3333H19.1267C19.3035 17.3333 19.473 17.2631 19.5981 17.1381C19.7231 17.013 19.7933 16.8435 19.7933 16.6667C19.7933 16.4899 19.7231 16.3203 19.5981 16.1953C19.473 16.0702 19.3035 16 19.1267 16H7.89333C7.81656 15.9974 7.74177 15.975 7.67617 15.935C7.61058 15.8951 7.55639 15.8389 7.51886 15.7718C7.48133 15.7048 7.46172 15.6292 7.46192 15.5524C7.46212 15.4756 7.48212 15.4002 7.52 15.3333L9.12667 14H19.42C19.5741 14.0038 19.7248 13.954 19.8463 13.8592C19.9679 13.7644 20.0528 13.6304 20.0867 13.48L21.1333 8.87333C20.7616 8.95858 20.3814 9.00108 20 9V9Z"
													fill="currentColor"
												/>
												<path d="M20 7.33333C21.8409 7.33333 23.3333 5.84095 23.3333 4C23.3333 2.15905 21.8409 0.666666 20 0.666666C18.1591 0.666666 16.6667 2.15905 16.6667 4C16.6667 5.84095 18.1591 7.33333 20 7.33333Z" fill="currentColor" />
											</g>
											<defs><clipPath id="rj-cart-clip"><rect width="24" height="24" fill="white" /></clipPath></defs>
										</svg>
									</span>
					{/if}
					<span class="rj-cart-label">{nav.cartLabel}</span>
				</a>

				{#if isLoggedIn}
					<ProfileDropdown onSignOut={navModule.handleSignOut}>
						{#snippet trigger()}
							<span class="rj-account">
								<span class="rj-account-icon" aria-hidden="true">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
										<path
											opacity="0.4"
											d="M12 22.01C17.5228 22.01 22 17.5328 22 12.01C22 6.48715 17.5228 2.01 12 2.01C6.47715 2.01 2 6.48715 2 12.01C2 17.5328 6.47715 22.01 12 22.01Z"
											fill="currentColor"
										/>
										<path
											d="M12 6.94C9.93 6.94 8.25 8.62 8.25 10.69C8.25 12.72 9.84 14.37 11.95 14.43C11.98 14.43 12.02 14.43 12.04 14.43C12.06 14.43 12.09 14.43 12.11 14.43C12.12 14.43 12.13 14.43 12.13 14.43C14.15 14.36 15.74 12.72 15.75 10.69C15.75 8.62 14.07 6.94 12 6.94Z"
											fill="currentColor"
										/>
										<path
											d="M18.78 19.36C17 21 14.62 22.01 12 22.01C9.38 22.01 7 21 5.22 19.36C5.46 18.45 6.11 17.62 7.06 16.98C9.79 15.16 14.23 15.16 16.94 16.98C17.9 17.62 18.54 18.45 18.78 19.36Z"
											fill="currentColor"
										/>
									</svg>
								</span>
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
					</ProfileDropdown>
				{:else}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger aria-label="Open account menu" class="rj-guest-trigger">
							<span class="rj-account">
							<span class="rj-account-icon" aria-hidden="true">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path
										d="M12 12.25C11.2583 12.25 10.5333 12.0301 9.91661 11.618C9.29993 11.206 8.81928 10.6203 8.53545 9.93506C8.25162 9.24984 8.17736 8.49584 8.32205 7.76841C8.46675 7.04098 8.8239 6.3728 9.34835 5.84835C9.8728 5.3239 10.541 4.96675 11.2684 4.82206C11.9958 4.67736 12.7498 4.75162 13.4351 5.03545C14.1203 5.31928 14.706 5.79993 15.118 6.41661C15.5301 7.0333 15.75 7.75832 15.75 8.5C15.75 9.49456 15.3549 10.4484 14.6517 11.1517C13.9484 11.8549 12.9946 12.25 12 12.25ZM12 6.25C11.555 6.25 11.12 6.38196 10.75 6.62919C10.38 6.87643 10.0916 7.22783 9.92127 7.63896C9.75097 8.0501 9.70642 8.5025 9.79323 8.93895C9.88005 9.37541 10.0943 9.77632 10.409 10.091C10.7237 10.4057 11.1246 10.62 11.561 10.7068C11.9975 10.7936 12.4499 10.749 12.861 10.5787C13.2722 10.4084 13.6236 10.12 13.8708 9.75003C14.118 9.38002 14.25 8.94501 14.25 8.5C14.25 7.90326 14.0129 7.33097 13.591 6.90901C13.169 6.48705 12.5967 6.25 12 6.25V6.25ZM19 19.25C18.8019 19.2474 18.6126 19.1676 18.4725 19.0275C18.3324 18.8874 18.2526 18.6981 18.25 18.5C18.25 16.55 17.19 15.25 12 15.25C6.81 15.25 5.75 16.55 5.75 18.5C5.75 18.6989 5.67098 18.8897 5.53033 19.0303C5.38968 19.171 5.19891 19.25 5 19.25C4.80109 19.25 4.61032 19.171 4.46967 19.0303C4.32902 18.8897 4.25 18.6989 4.25 18.5C4.25 13.75 9.68 13.75 12 13.75C14.32 13.75 19.75 13.75 19.75 18.5C19.7474 18.6981 19.6676 18.8874 19.5275 19.0275C19.3874 19.1676 19.1981 19.2474 19 19.25Z"
										fill="currentColor"
									/>
								</svg>
							</span>
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

		<!-- Row 2 -->
		{#if !isMobileRequest}
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
								<RjAdminMegaMenu category={item} {menuId} onNavigate={() => (openMega = null)} />
							</div>
						{:else}
							<a class="rj-menu-item" {href} aria-current={pathname === href ? 'page' : undefined} onmouseenter={() => (openMega = null)}>
								<span>{label}</span>
							</a>
						{/if}
					{/each}
				</div>
			</nav>

			<a class="rj-offers" href={nav.offers.href} onmouseenter={() => (openMega = null)}>
				<span class="rj-offers-gift" aria-hidden="true">
					<img class="rj-offers-gift-base" src={isLoggedIn ? '/ryans-jewels/icons/gift-box-3d-premium.webp' : '/ryans-jewels/icons/gift-box-3d.webp'} alt="" />
					<img class="rj-offers-gift-top" src="/ryans-jewels/icons/gift-box-3d.webp" alt="" />
				</span>
				<span class="rj-offers-label">{nav.offers.label}</span>
				<svg class="rj-i18" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
					<path
						d="M6.6825 14.94L11.5725 10.05C12.15 9.4725 12.15 8.5275 11.5725 7.95L6.6825 3.06"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-miterlimit="10"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</a>
		</div>
		{/if}
	</div>
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

	.rj-search {
		position: relative;
		flex: 1 1 auto;
		min-width: 0;
		/* 186:56711 lets the field fill the row at 1920 — no cap. */
		height: 40px;
	}

	.rj-search-input {
		width: 100%;
		height: 40px;
		padding: 8px 39px 8px 15px;
		background: #fff;
		border: 1px solid var(--rj-line-2, #d9d9d9);
		border-radius: 6px;
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		font-weight: 400;
		line-height: 24px;
		letter-spacing: -0.084px;
		color: var(--rj-input-text, #252c32);
		outline: none;
		appearance: none;
	}

	.rj-search-input::placeholder {
		color: var(--rj-input-text, #252c32);
		opacity: 1;
	}

	.rj-search-input:focus {
		border-color: var(--rj-gold, #cca646);
	}

	.rj-search-input::-webkit-search-cancel-button {
		display: none;
	}

	.rj-search-icon {
		position: absolute;
		top: 7px;
		right: 7px;
		display: block;
		width: 24px;
		height: 24px;
		pointer-events: none;
	}

	.rj-search-backdrop {
		position: fixed;
		inset: 0;
		z-index: 70;
		border: 0;
		background: transparent;
		cursor: default;
	}

	.rj-search-results {
		position: absolute;
		z-index: 80;
		top: calc(100% + 6px);
		left: 0;
		right: 0;
		max-height: 60vh;
		overflow-y: auto;
		padding: 6px;
		background: #fff;
		border: 1px solid var(--rj-line-2, #d9d9d9);
		border-radius: 6px;
		box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.28);
	}

	.rj-search-results ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.rj-search-results li button {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 8px;
		border: 0;
		background: none;
		text-align: left;
		cursor: pointer;
	}

	.rj-search-results li button:hover {
		background: var(--rj-cream, #faf6ea);
	}

	.rj-search-thumb {
		display: block;
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		overflow: hidden;
		border-radius: 4px;
		background: var(--rj-surface, #f4f4f4);
	}

	.rj-search-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.rj-search-meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.rj-search-title {
		font-size: 14px;
		color: var(--rj-ink, #404040);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.rj-search-price {
		font-size: 13px;
		font-weight: 700;
		color: var(--rj-gold, #cca646);
	}

	.rj-search-skeleton {
		height: 56px;
		margin: 4px;
		border-radius: 4px;
		background: var(--rj-surface, #f4f4f4);
		animation: rj-pulse 1.4s ease-in-out infinite;
	}

	.rj-search-empty {
		padding: 24px 12px;
		font-size: 14px;
		text-align: center;
		color: var(--rj-ink-2, #606060);
	}

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
		width: 24px;
		height: 24px;
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
		font-size: 14px;
		font-weight: 700;
		color: var(--rj-ink, #404040);
		white-space: nowrap;
	}

	/* Source: logged-out cart is w-[86px] justify-between (63:83444),
	   logged-in collapses to gap-[4px] (63:83378). */
	.rj-cart--empty {
		justify-content: space-between;
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
		transform: translateY(0);
	}

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
			overflow-x: auto;
			scrollbar-width: none;
		}

		.rj-menu-list::-webkit-scrollbar {
			display: none;
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
				'brand actions'
				'search search';
			align-items: center;
			gap: 11px;
			justify-content: space-between;
		}

		/* Burger sits inside the brand cluster (gap 18) on tablet. */
		.rj-burger {
			display: flex;
			width: 26px;
			height: 26px;
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

		.rj-search {
			grid-area: search;
			min-width: 0;
			height: 44px;
			max-width: none;
		}

		.rj-search-input {
			height: 44px;
			padding: 10px 48px 10px 16px;
			border-color: var(--rj-line-3, #c2c2c2);
			font-family: 'Sarala', var(--font-body, sans-serif);
			color: var(--rj-ink, #404040);
		}

		.rj-search-input::placeholder {
			color: var(--rj-placeholder, #bdbdbd);
		}

		.rj-search-icon {
			top: 10px;
			right: 16px;
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
			min-width: 0;
			align-items: center;
			gap: 0;
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
				'brand actions'
				'search search';
			gap: 11px;
		}

		.rj-burger {
			width: 26px;
			height: 26px;
			place-self: center start;
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
</style>
