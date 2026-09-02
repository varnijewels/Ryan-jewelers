<script lang="ts">
	import { menuChildren, menuGroups, menuHref, type AdminMenuItem } from './admin-menu.js'

	let {
		category,
		menuId,
		onNavigate
	}: {
		category: AdminMenuItem
		menuId: string
		onNavigate?: () => void
	} = $props()
</script>

<div class="rj-admin-mega" id={menuId} aria-label="{category.name || 'Category'} menu">
	<div class="rj-admin-grid">
		{#each menuGroups(category) as group}
			<section class="rj-admin-group">
				<a class="rj-admin-heading" href={menuHref(group)} onclick={onNavigate}>
					{#if group.thumbnail}<img src={group.thumbnail} alt="" />{/if}
					<span>{group.name}</span>
				</a>

				{#if menuChildren(group).length}
					<ul>
						{#each menuChildren(group) as item}
							<li>
								<a href={menuHref(item)} onclick={onNavigate}>
									<span>{item.name}</span>
									<svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
										<path d="M4 2.25 7.25 5.5 4 8.75" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/each}

		{#if category.thumbnail}
			<a class="rj-admin-feature" href={menuHref(category)} onclick={onNavigate}>
				<img src={category.thumbnail} alt={category.name || ''} />
				<span>{category.name}</span>
			</a>
		{/if}
	</div>

	<a class="rj-admin-view-all" href={menuHref(category)} onclick={onNavigate}>
		<span>View All {category.name}</span>
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<path d="m6.75 3.75 5.25 5.25-5.25 5.25" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</a>
</div>

<style>
	.rj-admin-mega {
		position: absolute;
		top: 100%;
		left: 60px;
		right: 60px;
		display: flex;
		min-height: 260px;
		max-height: 440px;
		flex-direction: column;
		overflow: hidden;
		border-radius: 4px;
		background: #fff;
		box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
		visibility: hidden;
		opacity: 0;
		pointer-events: none;
		transform: translateY(8px);
		transition: opacity 0.16s ease, transform 0.16s ease, visibility 0.16s;
		z-index: 100;
	}

	.rj-admin-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0;
		min-height: 0;
		padding: 22px 35px;
		overflow-y: auto;
	}

	.rj-admin-group {
		min-width: 0;
		padding: 0 30px;
		border-right: 1px solid #f1f1f1;
	}

	.rj-admin-group:nth-child(4n),
	.rj-admin-group:last-child {
		border-right: 0;
	}

	.rj-admin-heading {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 39px;
		padding: 8px 0;
		border-bottom: 1px dashed #bcbcbc;
		font-family: 'Sarala', sans-serif;
		font-size: 16px;
		font-weight: 400;
		line-height: 23px;
		color: #202020;
		text-decoration: none;
	}

	.rj-admin-heading img {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		object-fit: cover;
		flex-shrink: 0;
	}

	.rj-admin-group ul {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 20px 0 0;
		padding: 0;
		list-style: none;
	}

	.rj-admin-group li a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		font-family: 'Sarala', sans-serif;
		font-size: 14px;
		line-height: 21px;
		color: #404040;
		text-decoration: none;
	}

	.rj-admin-group a:hover,
	.rj-admin-view-all:hover {
		color: var(--rj-gold, #cca646);
	}

	.rj-admin-feature {
		position: relative;
		display: block;
		min-height: 180px;
		overflow: hidden;
		border-radius: 8px;
		color: #fff;
		text-decoration: none;
	}

	.rj-admin-feature img {
		width: 100%;
		height: 100%;
		min-height: 180px;
		object-fit: cover;
	}

	.rj-admin-feature span {
		position: absolute;
		left: 16px;
		bottom: 14px;
		font-family: 'Sarala', sans-serif;
		font-size: 16px;
		text-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
	}

	.rj-admin-view-all {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 50px;
		margin-top: auto;
		border-top: 1px solid #f1f1f1;
		background: #fdfdfd;
		font-family: 'Sarala', sans-serif;
		font-size: 14px;
		line-height: 21px;
		color: #303030;
		text-decoration: none;
	}

	@media (max-width: 1279px) {
		.rj-admin-mega {
			left: 40px;
			right: 40px;
		}
	}

	@media (max-width: 1023px) {
		.rj-admin-mega {
			display: none;
		}
	}
</style>
