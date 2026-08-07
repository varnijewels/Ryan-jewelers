<script lang="ts">
	import RyansJewelsAccountSidebar from '$lib/theme/ryans-jewels/RyansJewelsAccountSidebar.svelte'
	import RyansJewelsOrderDetailsPage from '$lib/theme/ryans-jewels/RyansJewelsOrderDetailsPage.svelte'
</script>

<div class="rj-public-order-shell">
	<RyansJewelsAccountSidebar />
	<main><RyansJewelsOrderDetailsPage /></main>
</div>

<style>
	.rj-public-order-shell {
		display: grid;
		box-sizing: border-box;
		grid-template-columns: clamp(225px, 15.625vw, 300px) minmax(0, 1fr);
		width: min(calc(100% - clamp(120px, 8.333vw, 160px)), 1760px);
		gap: clamp(24px, 1.667vw, 32px);
		align-items: start;
		margin: 44px auto 60px;
	}

	main { min-width: 0; }

	@media (max-width: 900px) {
		.rj-public-order-shell { display: block; width: calc(100% - 32px); margin: 24px auto 40px; }
	}
</style>
