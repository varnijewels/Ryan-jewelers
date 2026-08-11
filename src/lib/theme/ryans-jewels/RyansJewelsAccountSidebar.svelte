<script lang="ts">
	import { page } from '$app/state'
	import { getUserState } from '$lib/core/stores/index.js'
	import { onMount } from 'svelte'

	const userState = getUserState()
	let sidebar: HTMLElement
	const items = [
		{ label: 'My Profile', href: '/my', icon: 'dashboard-profile.svg', match: (path: string) => path === '/my' || path.startsWith('/my/profile') },
		{ label: 'Order History', href: '/my/orders', icon: 'dashboard-order.svg' },
		{ label: 'My Wishlist', href: '/my/wishlist', icon: 'dashboard-wishlist.svg' },
		{ label: 'Track Orders', href: '/order-tracking', icon: 'dashboard-track.svg' },
		{ divider: true },
		{ label: 'Address Book', href: '/my/addresses', icon: 'dashboard-address.svg' },
		{ label: 'Chat with Expert', href: '/contact-us', icon: 'dashboard-chat.svg' },
		{ divider: true },
		{ label: 'FAQ', href: '/faqs', icon: 'dashboard-faq.svg' },
		{ label: 'Terms & Conditions', href: '/terms-and-conditions', icon: 'dashboard-terms.svg' },
		{ divider: true }
	]

	function isActive(item: any) {
		return item.match ? item.match(page.url.pathname) : item.href && page.url.pathname.startsWith(item.href)
	}

	onMount(() => {
		if (window.matchMedia('(max-width: 900px)').matches) sidebar.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' })
	})
</script>

<aside bind:this={sidebar} class="rj-account-sidebar" aria-label="My account navigation">
	<nav>
		{#each items as item}
			{#if item.divider}
				<hr />
			{:else if item.href}
				<a class:active={isActive(item)} href={item.href} aria-current={isActive(item) ? 'page' : undefined}>
					<img src="/ryans-jewels/account/{item.icon}" alt="" />
					<span>{item.label}</span>
				</a>
			{:else}
				<button type="button" onclick={item.action}>
					<img src="/ryans-jewels/account/{item.icon}" alt="" />
					<span>{item.label}</span>
				</button>
			{/if}
		{/each}
		<button class="logout" type="button" disabled={userState.loading} onclick={() => userState.logout()}>
			<img src="/ryans-jewels/account/dashboard-logout.svg" alt="" />
			<span>{userState.loading ? 'Logging out…' : 'Log out'}</span>
		</button>
	</nav>
</aside>

<style>
	.rj-account-sidebar { box-sizing: border-box; width: 100%; height: 614px; padding: 24px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; font-family: 'Lato', sans-serif; }
	nav { display: flex; flex-direction: column; gap: 25px; }
	a, button { display: flex; box-sizing: border-box; width: 100%; height: 24px; gap: 12px; align-items: center; padding: 0; border: 0; background: transparent; color: #606060; font: 400 16px/22px 'Lato', sans-serif; text-align: left; text-decoration: none; white-space: nowrap; cursor: pointer; }
	a img, button img { width: 24px; height: 24px; flex: 0 0 24px; filter: brightness(0); opacity: .62; }
	a.active { height: 40px; gap: 10px; justify-content: center; padding: 8px 10px; border-radius: 3px; background: #cca646; color: #fff; }
	a.active img { filter: brightness(0) invert(1); opacity: 1; }
	a:hover:not(.active), button:hover { color: #202020; }
	hr { width: 100%; height: 1px; margin: 0; border: 0; background: #d9d9d9; }
	.logout { color: #d73535; }
	.logout img { filter: none; opacity: 1; }
	.logout:hover { color: #d73535; }
	.logout:disabled { opacity: .55; cursor: wait; }

	@media (max-width: 900px) {
		.rj-account-sidebar { width: 100%; height: auto; padding: 12px; overflow-x: auto; }
		nav { width: max-content; flex-direction: row; gap: 10px; align-items: center; }
		a, button { width: auto; height: 40px; padding: 8px 10px; border-radius: 3px; }
		a.active { margin: 0; }
		hr { width: 1px; height: 28px; }
	}
</style>
