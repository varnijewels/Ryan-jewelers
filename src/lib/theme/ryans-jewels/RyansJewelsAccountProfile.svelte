<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	let { profileModule }: { profileModule: any } = $props()
	let editing = $state(false)
	let notificationsEnabled = $state(true)
	let bellRing = $state(0)
	const profile = $derived(profileModule.profile || {})
	const fullName = $derived(`${profile.firstName || ''} ${profile.lastName || ''}`.trim() || '—')
	const memberSince = $derived(profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—')
	const currency = $derived(page.data?.store?.currency?.code || 'USD')
	const verified = $derived(Boolean(profile.emailVerified || profile.verified || profile.isVerified))
	const active = $derived(profile.active !== false && profile.isActive !== false)
	const accountStatus = $derived(verified ? 'Active & Verified' : active ? 'Active' : 'Inactive')

	async function editProfile() {
		if (!editing) return (editing = true)
		await profileModule.saveProfile()
		editing = false
	}

	function toggleNotifications() {
		notificationsEnabled = !notificationsEnabled
		if (notificationsEnabled) bellRing += 1
	}
</script>

<svelte:head><title>Account Profile | Ryan Jewelers</title></svelte:head>

<section class="rj-account-profile">
	<header class="rj-profile-heading">
		<a href="/my"><img src="/ryans-jewels/account/profile-back.svg" alt="" />Account Profile</a>
		<button class="rj-delete-account" type="button" onclick={() => goto('/my/profile/delete')}><img src="/ryans-jewels/account/profile-trash.svg" alt="" />Delete Account</button>
	</header>

	<div class="rj-profile-card">
		<aside class="rj-profile-rail">
			<div class="rj-avatar-card">
				<span><img src="/ryans-jewels/account/profile-user.svg" alt="" /></span>
				<strong>{fullName}</strong>
				<small>{profile.email || '—'}</small>
			</div>

			<button class="rj-profile-action" type="button" onclick={editProfile}><img src="/ryans-jewels/account/profile-edit.svg" alt="" />{editing ? 'Save Profile' : 'Edit Profile'}</button>
			<button class="rj-profile-action notification" type="button" aria-pressed={notificationsEnabled} onclick={toggleNotifications}>
				<span>{#key bellRing}<img class:ringing={bellRing > 0} src="/ryans-jewels/account/profile-notification.svg" alt="" />{/key}Notification</span><i class:on={notificationsEnabled}><b></b></i>
			</button>
		</aside>

		<div class="rj-profile-main">
			<form class="rj-personal-card" oninput={() => editing && profileModule.handleDetailsChange()} onsubmit={(event) => { event.preventDefault(); editProfile() }}>
				<header><div><strong>Personal Information</strong><small>Manage your contact and identity details</small></div><span><i></i>{accountStatus}</span></header>
				<div class="rj-profile-fields">
					<label><span>First Name</span><input bind:value={profile.firstName} readonly={!editing} /></label>
					<label><span>Last Name</span><input bind:value={profile.lastName} readonly={!editing} /></label>
					<label><span>Email Address</span><input type="email" bind:value={profile.email} readonly={!editing} /></label>
					<label><span>Phone Number</span><input type="tel" bind:value={profile.phone} readonly={!editing} /></label>
				</div>
				<button class="rj-hidden-submit" type="submit">Save profile</button>
			</form>

			<section class="rj-overview-card">
				<header><div><strong>Account Overview</strong><small>Your membership and shopping preferences</small></div></header>
				<div class="rj-overview-grid">
					<div><span>Account Status</span><strong class:active><i></i>{accountStatus}</strong></div>
					<div><span>Member Since</span><strong>{memberSince}</strong></div>
					<div><span>Preferred Currency</span><strong>{currency}</strong></div>
					<div><span>Communication</span><strong>{notificationsEnabled ? 'Notifications Enabled' : 'Notifications Paused'}</strong></div>
				</div>
			</section>
		</div>
	</div>
</section>

<style>
	.rj-account-profile { width: 100%; color: #202020; font-family: 'Lato', sans-serif; }
	.rj-profile-heading { display: flex; height: 36px; align-items: flex-start; justify-content: space-between; margin-top: -10px; }
	.rj-profile-heading > a { display: flex; height: 26px; gap: 12px; align-items: center; margin-top: 10px; color: #202020; font-size: 22px; font-weight: 700; line-height: 26px; text-decoration: none; }
	.rj-profile-heading > a img { width: 26px; height: 26px; }
	.rj-delete-account { display: flex; box-sizing: border-box; height: 46px; gap: 10px; align-items: center; padding: 12px 10px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; color: #606060; font: 500 16px/19px 'Lato', sans-serif; cursor: pointer; }
	.rj-delete-account img { width: 22px; height: 22px; }
	.rj-profile-card { display: grid; box-sizing: border-box; width: 100%; height: 468px; grid-template-columns: 207px minmax(0, 1fr); gap: 20px; margin-top: 19px; padding: 29px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; }
	.rj-profile-rail { display: flex; flex-direction: column; gap: 15px; }
	.rj-avatar-card { display: flex; box-sizing: border-box; height: 180px; flex-direction: column; align-items: center; justify-content: center; padding: 12px; border-radius: 6px; background: #f9f9f9; text-align: center; }
	.rj-avatar-card > span { display: grid; width: 71px; height: 71px; border-radius: 50%; background: #fff; place-items: center; }
	.rj-avatar-card > span img { width: 57px; height: 57px; }
	.rj-avatar-card strong { max-width: 175px; margin-top: 8px; overflow: hidden; font: 600 15px/20px 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rj-avatar-card small { max-width: 175px; margin-top: 2px; overflow: hidden; color: #707070; font-size: 11px; line-height: 15px; text-overflow: ellipsis; white-space: nowrap; }
	.rj-profile-action { display: flex; box-sizing: border-box; width: 207px; height: 41px; gap: 10px; align-items: center; justify-content: center; padding: 10px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; color: #606060; font: 500 16px/19px 'Lato', sans-serif; cursor: pointer; }
	.rj-profile-action img { width: 21px; height: 21px; }
	.rj-profile-action.notification { justify-content: space-between; }
	.rj-profile-action.notification > span { display: flex; gap: 10px; align-items: center; }
	.rj-profile-action.notification img.ringing { transform-origin: 50% 12%; animation: rj-bell-ring .62s ease-out; }
	.rj-profile-action.notification > i { position: relative; box-sizing: border-box; width: 40px; height: 20px; padding: 1px; border: .5px solid #c2c2c2; border-radius: 39px; background: #f7f7f7; transition: background .28s ease, border-color .28s ease; }
	.rj-profile-action.notification > i b { display: block; width: 20px; height: 18px; border-radius: 45px; background: #e2e2e2; transition: transform .36s cubic-bezier(.34, 1.56, .64, 1), background .2s ease; }
	.rj-profile-action.notification > i.on { background: #eaf8ef; }
	.rj-profile-action.notification > i.on b { transform: translateX(18px); background: #2fb85b; }
	.rj-profile-main { display: grid; min-width: 0; grid-template-rows: 180px 213px; gap: 15px; }
	.rj-personal-card, .rj-overview-card { box-sizing: border-box; min-width: 0; border-radius: 6px; background: #f9f9f9; }
	.rj-personal-card { position: relative; padding: 17px 20px; }
	.rj-personal-card > header, .rj-overview-card > header { display: flex; align-items: flex-start; justify-content: space-between; }
	.rj-personal-card > header > div, .rj-overview-card > header > div { display: flex; flex-direction: column; gap: 2px; }
	.rj-personal-card header strong, .rj-overview-card header strong { font-size: 16px; line-height: 19px; }
	.rj-personal-card header small, .rj-overview-card header small { color: #707070; font-size: 11px; line-height: 15px; }
	.rj-personal-card header > span { display: flex; gap: 6px; align-items: center; color: #238b45; font-size: 11px; font-weight: 600; }
	.rj-personal-card header > span i { width: 7px; height: 7px; border-radius: 50%; background: #2fb85b; }
	.rj-profile-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 18px; margin-top: 13px; }
	.rj-profile-fields label { display: grid; box-sizing: border-box; height: 48px; grid-template-columns: 95px minmax(0, 1fr); align-items: center; padding: 7px 11px; border: 1px solid #e6e6e6; border-radius: 5px; background: #fff; }
	.rj-profile-fields label > span { color: #707070; font-size: 11px; line-height: 14px; }
	.rj-profile-fields input { min-width: 0; padding: 0; border: 0; outline: 0; background: transparent; color: #202020; font: 600 13px/18px 'Lato', sans-serif; text-overflow: ellipsis; }
	.rj-profile-fields input:not(:read-only) { border-bottom: 1px solid #cca646; }
	.rj-hidden-submit { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; }
	.rj-overview-card { padding: 18px 20px; }
	.rj-overview-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 18px; margin-top: 14px; }
	.rj-overview-grid > div { display: flex; box-sizing: border-box; height: 62px; flex-direction: column; gap: 6px; justify-content: center; padding: 10px 13px; border: 1px solid #ececec; border-radius: 5px; background: #fff; }
	.rj-overview-grid span { color: #707070; font-size: 11px; line-height: 14px; }
	.rj-overview-grid strong { overflow: hidden; font-size: 13px; line-height: 17px; text-overflow: ellipsis; white-space: nowrap; }
	.rj-overview-grid strong.active { display: flex; gap: 6px; align-items: center; color: #238b45; }
	.rj-overview-grid strong.active i { width: 7px; height: 7px; border-radius: 50%; background: #2fb85b; }

	@keyframes rj-bell-ring {
		0%, 100% { transform: rotate(0); }
		18% { transform: rotate(18deg); }
		36% { transform: rotate(-16deg); }
		54% { transform: rotate(11deg); }
		72% { transform: rotate(-7deg); }
		88% { transform: rotate(3deg); }
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-profile-action.notification img.ringing { animation: none; }
		.rj-profile-action.notification > i, .rj-profile-action.notification > i b { transition: none; }
	}

	@media (max-width: 1100px) {
		.rj-profile-card { height: auto; grid-template-columns: 180px minmax(0, 1fr); padding: 20px; }
		.rj-profile-action { width: 180px; }
		.rj-profile-main { grid-template-rows: auto auto; }
		.rj-personal-card, .rj-overview-card { min-height: 180px; }
	}

	@media (max-width: 700px) {
		.rj-profile-heading { height: auto; gap: 14px; }
		.rj-profile-heading > a { font-size: 19px; }
		.rj-delete-account { height: 40px; padding: 8px; font-size: 12px; }
		.rj-profile-card { display: block; margin-top: 15px; padding: 14px; }
		.rj-profile-rail { align-items: stretch; }
		.rj-profile-action { width: 100%; }
		.rj-profile-main { display: block; margin-top: 15px; }
		.rj-personal-card, .rj-overview-card { margin-top: 15px; }
		.rj-profile-fields, .rj-overview-grid { grid-template-columns: 1fr; }
		.rj-personal-card, .rj-overview-card { height: auto; }
	}
</style>
