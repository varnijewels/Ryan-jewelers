<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import type { Snippet } from 'svelte'

	interface Props {
		onSignOut?: any
		trigger: Snippet
	}

	const { onSignOut, trigger }: Props = $props()
	const wishlistPlugin = $derived(page.data?.store?.plugins?.isWishlist)
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger aria-label="User Profile" class="rj-guest-trigger">
		{@render trigger()}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end" sideOffset={8} class="rj-guest-menu">
		<DropdownMenu.Item class="rj-guest-item" onSelect={() => goto('/my')}>
			<span class="rj-guest-row"><img class="rj-guest-icon" src="/ryans-jewels/account/profile.svg" alt="" /><span>My Profile</span><img class="rj-member-arrow" src="/ryans-jewels/account/arrow-right.svg" alt="" /></span>
		</DropdownMenu.Item>
		<DropdownMenu.Item class="rj-guest-item" onSelect={() => goto('/my/orders')}>
			<span class="rj-guest-row"><img class="rj-guest-icon" src="/ryans-jewels/account/order-history.svg" alt="" /><span>Order History</span><img class="rj-member-arrow" src="/ryans-jewels/account/arrow-right.svg" alt="" /></span>
		</DropdownMenu.Item>

		<div class="rj-guest-rule"></div>

		{#if wishlistPlugin?.active}
			<DropdownMenu.Item class="rj-guest-item" onSelect={() => goto('/my/wishlist')}>
				<span class="rj-guest-row"><img class="rj-guest-icon" src="/ryans-jewels/account/heart.svg" alt="" /><span>My Wishlist</span><img class="rj-member-arrow" src="/ryans-jewels/account/arrow-right.svg" alt="" /></span>
			</DropdownMenu.Item>
		{/if}
		<DropdownMenu.Item class="rj-guest-item" onSelect={() => goto('/my/addresses')}>
			<span class="rj-guest-row"><img class="rj-guest-icon" src="/ryans-jewels/account/address.svg" alt="" /><span>My Address</span><img class="rj-member-arrow" src="/ryans-jewels/account/arrow-right.svg" alt="" /></span>
		</DropdownMenu.Item>

		<div class="rj-guest-rule"></div>

		<DropdownMenu.Item class="rj-guest-item" onSelect={() => goto('/order-tracking')}>
			<span class="rj-guest-row"><img class="rj-guest-icon" src="/ryans-jewels/account/track-order.svg" alt="" /><span>Track Order</span><img class="rj-member-arrow" src="/ryans-jewels/account/arrow-right.svg" alt="" /></span>
		</DropdownMenu.Item>
		<DropdownMenu.Item class="rj-member-logout-item" onclick={onSignOut}>
			<span class="rj-member-logout-surface"><img class="rj-guest-icon" src="/ryans-jewels/account/logout.svg" alt="" /><span>Log Out</span><img class="rj-member-arrow" src="/ryans-jewels/account/arrow-right.svg" alt="" /></span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<style>
	:global(.rj-guest-menu .rj-member-logout-item) {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		height: 42px;
		align-items: center;
		gap: 0;
		padding: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: #d73535;
		font-family: 'Sarala', sans-serif;
		font-size: 16px;
		font-weight: 400;
		line-height: 24px;
		cursor: pointer;
	}

	:global(.rj-guest-menu .rj-member-logout-surface) {
		display: grid;
		box-sizing: border-box;
		grid-template-columns: 21px minmax(0, 1fr) 12px;
		width: calc(100% - 4px);
		height: 42px;
		align-items: center;
		gap: 10px;
		margin: 0 2px;
		padding: 0 2px;
		border-radius: 4px;
		background: #fff5f5;
	}

	:global(.rj-guest-menu .rj-member-logout-surface > span) {
		color: #d73535;
	}

	:global(.rj-guest-menu .rj-member-logout-item[data-highlighted]) {
		background: transparent;
		color: #d73535;
	}

	:global(.rj-guest-menu .rj-member-arrow) {
		display: block;
		width: 12px;
		height: 12px;
		justify-self: end;
		margin-right: 2px;
	}

	:global(.rj-guest-menu .rj-member-logout-surface .rj-member-arrow) {
		margin-right: 0;
	}
</style>
