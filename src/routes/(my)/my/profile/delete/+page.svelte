<script>
	import { page } from '$app/state'
	import Button from '$lib/components/ui/button/button.svelte'
	import { MyProfileDeleteModule } from '$lib/core/composables/index.js'

	const deleteModule = new MyProfileDeleteModule()
	const isRyansJewels = $derived(page.data?.theme?.name === 'ryans-jewels')
</script>

<svelte:head>
	<title>Delete Account | {isRyansJewels ? 'Ryan Jewelers' : 'Svelte Commerce'}</title>
</svelte:head>

<div class:rj-delete-page={isRyansJewels} class="mx-auto max-w-3xl py-8 md:py-12">
	<div class="rj-delete-heading mb-10">
		<h1 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Delete Account</h1>
		<p class="mt-2 text-lg text-gray-500">We're sorry to see you go. Please review the following information carefully.</p>
	</div>

	<div class="rj-delete-card overflow-hidden rounded-md border border-red-100 bg-white shadow-xl shadow-red-500/5">
		<div class="rj-delete-warning bg-red-50/50 p-6 md:p-8">
			<h2 class="text-xl font-bold text-red-600">Is this goodbye?</h2>
			<p class="mt-2 text-sm font-medium text-red-600/70">Are you sure you want to delete your account? This action is permanent.</p>
		</div>

		<div class="rj-delete-body p-6 md:p-8">
			<ul class="rj-delete-list space-y-6">
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">1</div>
					<div class="space-y-1">
						<p class="font-bold text-gray-900">Forfeit all benefits</p>
						<p class="text-sm leading-relaxed text-gray-500">
							You'll lose your order history, saved details, coupons, and benefits. These cannot be recovered. Please review our
							<a href="/privacy-policy" class="font-semibold text-primary hover:underline">Privacy Policy</a>.
						</p>
					</div>
				</li>
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">2</div>
					<div class="space-y-1">
						<p class="font-bold text-gray-900">Pending Transactions</p>
						<p class="text-sm leading-relaxed text-gray-500">
							Any pending orders, exchanges, returns, or refunds will no longer be accessible via your account. We will attempt to complete open
							transactions within 30 days.
						</p>
					</div>
				</li>
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">3</div>
					<div class="space-y-1">
						<p class="font-bold text-gray-900">Coupon Restrictions</p>
						<p class="text-sm leading-relaxed text-gray-500">
							We may not extend New User coupons if a new account is created with the same mobile number or email ID.
						</p>
					</div>
				</li>
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">4</div>
					<div class="space-y-1">
						<p class="font-bold text-gray-900">Data Retention</p>
						<p class="text-sm leading-relaxed text-gray-500">
							Certain data may be retained for legitimate reasons such as security, fraud prevention, and regulatory compliance.
						</p>
					</div>
				</li>
			</ul>

			<div class="rj-delete-consent mt-12 flex items-center gap-3 rounded-md bg-gray-50 p-4">
				<input
					type="checkbox"
					id="deleteAccount"
					class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
					bind:checked={deleteModule.iAgree}
				/>
				<label for="deleteAccount" class="text-sm font-semibold text-gray-700"> I understand and agree to all the terms and conditions* </label>
			</div>

			<div class="mt-8 flex justify-end">
				{#if isRyansJewels}
					<button class="rj-delete-submit" type="button" onclick={deleteModule.deleteUser} disabled={!deleteModule.iAgree}>Permanently Delete My Account</button>
				{:else}
					<Button onclick={deleteModule.deleteUser} variant="destructive" class="h-12 px-10" disabled={!deleteModule.iAgree}>Permanently Delete My Account</Button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.rj-delete-page { box-sizing: border-box; width: 100%; max-width: 1040px; padding: 35px 0 0; color: #202020; font-family: 'Lato', sans-serif; }
	.rj-delete-page .rj-delete-heading { margin-bottom: 24px; }
	.rj-delete-page .rj-delete-heading h1 { color: #202020; font: 700 30px/38px 'Lato', sans-serif; letter-spacing: 0; }
	.rj-delete-page .rj-delete-heading p { margin-top: 5px; color: #707070; font-size: 14px; line-height: 21px; }
	.rj-delete-page .rj-delete-card { border: 1px solid #c2c2c2; border-top: 3px solid #cca646; border-radius: 6px; box-shadow: none; }
	.rj-delete-page .rj-delete-warning { padding: 24px 30px; border-bottom: 1px solid #f2dada; background: #fff8f8; }
	.rj-delete-page .rj-delete-warning h2 { color: #d73535; font: 700 21px/27px 'Lato', sans-serif; }
	.rj-delete-page .rj-delete-warning p { margin-top: 5px; color: #b64a4a; font-size: 13px; line-height: 19px; }
	.rj-delete-page .rj-delete-body { padding: 8px 30px 28px; }
	.rj-delete-page .rj-delete-list { margin: 0; }
	.rj-delete-page .rj-delete-list li { gap: 16px; padding: 20px 0; border-bottom: 1px solid #ececec; }
	.rj-delete-page .rj-delete-list li > div:first-child { width: 26px; height: 26px; background: #f8edcf; color: #9b7420; font-size: 11px; }
	.rj-delete-page .rj-delete-list li > div:last-child { padding-top: 1px; }
	.rj-delete-page .rj-delete-list li p:first-child { color: #202020; font-size: 14px; line-height: 19px; }
	.rj-delete-page .rj-delete-list li p:last-child { margin-top: 5px; color: #707070; font-size: 13px; line-height: 20px; }
	.rj-delete-page .rj-delete-list a { color: #a67b1d; }
	.rj-delete-page .rj-delete-consent { margin-top: 24px; padding: 16px 18px; border: 1px solid #e6e6e6; background: #f9f9f9; }
	.rj-delete-page .rj-delete-consent input { accent-color: #cca646; }
	.rj-delete-page .rj-delete-consent label { color: #404040; font: 600 13px/19px 'Lato', sans-serif; cursor: pointer; }
	.rj-delete-page .rj-delete-submit { box-sizing: border-box; height: 48px; padding: 0 30px; border: 0; border-radius: 4px; background: #d73535; color: #fff; font: 600 14px/20px 'Lato', sans-serif; cursor: pointer; }
	.rj-delete-page .rj-delete-submit:hover { background: #bd2929; }
	.rj-delete-page .rj-delete-submit:disabled { background: #e8bcbc; cursor: not-allowed; }

	@media (max-width: 700px) {
		.rj-delete-page { padding-top: 20px; }
		.rj-delete-page .rj-delete-heading h1 { font-size: 25px; line-height: 32px; }
		.rj-delete-page .rj-delete-warning, .rj-delete-page .rj-delete-body { padding-inline: 18px; }
		.rj-delete-page .rj-delete-body > div:last-child { justify-content: stretch; }
		.rj-delete-page .rj-delete-submit { width: 100%; padding-inline: 16px; }
	}
</style>
