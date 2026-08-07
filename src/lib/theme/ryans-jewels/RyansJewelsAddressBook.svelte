<script lang="ts">
	import { toast } from 'svelte-sonner'
	import { tick } from 'svelte'
	import { addressService } from '$lib/core/services/index.js'

	let {
		addressesModule,
		ondelete
	}: {
		addressesModule: any
		ondelete: (address: any) => void
	} = $props()

	const addresses = $derived(addressesModule.addresses?.data || [])
	let showingForm = $state(false)
	let editingAddress = $state<any>(null)
	let addressType = $state('Home')
	let fullName = $state('')
	let phone = $state('')
	let addressLine = $state('')
	let zip = $state('')
	let receiverName = $state('')
	let receiverPhone = $state('')
	let saving = $state(false)

	function labelFor(address: any, index: number) {
		return address.label || address.addressType || address.type || (address.isOffice ? 'Office' : address.isHome ? 'Home' : index ? 'Office' : 'Home')
	}

	function nameFor(address: any) {
		return [address.firstName, address.lastName].filter((part) => part && part !== '--').join(' ') || address.name || 'Ryan Jewelers Customer'
	}

	function lineFor(address: any) {
		return [address.address_1 || address.address, address.address_2, address.city, address.state, address.zip]
			.filter((part) => part && part !== 'Not specified')
			.join(', ')
	}

	async function openForm(address: any = null) {
		editingAddress = address
		addressType = address ? labelFor(address, 0) : 'Home'
		fullName = address ? nameFor(address) : ''
		phone = address?.phone || ''
		addressLine = address?.address_1 || address?.address || ''
		zip = address?.zip || ''
		receiverName = address?.receiverName || fullName
		receiverPhone = address?.receiverPhone || phone
		showingForm = true
		await tick()
		const root = document.documentElement
		const scrollBehavior = root.style.scrollBehavior
		root.style.scrollBehavior = 'auto'
		window.scrollTo({ top: 0 })
		root.style.scrollBehavior = scrollBehavior
	}

	function closeForm() {
		showingForm = false
		editingAddress = null
	}

	function normalizePhone(value: string) {
		const digits = value.replace(/\D/g, '')
		return digits.length === 10 ? `+91${digits}` : `+${digits}`
	}

	async function saveAddress(event: SubmitEvent) {
		event.preventDefault()
		const names = fullName.trim().split(/\s+/)
		const phoneDigits = phone.replace(/\D/g, '')
		const receiverDigits = receiverPhone.replace(/\D/g, '')

		if (names.length < 2) return toast.error('Please enter first and last name')
		if (phoneDigits.length < 10 || phoneDigits.length > 15) return toast.error('Please enter a valid phone number')
		if (addressLine.trim().length < 5) return toast.error('Please enter a complete address')
		if (!/^[A-Z0-9]{3,10}$/i.test(zip.trim())) return toast.error('Please enter a valid ZIP code')
		if (receiverName.trim().length < 2) return toast.error('Please enter receiver name')
		if (receiverDigits.length < 10 || receiverDigits.length > 15) return toast.error('Please enter a valid receiver phone number')

		const lastName = names.pop() || ''
		const selectedType = addressType.toLowerCase()
		const address = {
			...(editingAddress || {}),
			firstName: names.join(' '),
			lastName,
			phone: normalizePhone(phone),
			address_1: addressLine.trim(),
			zip: zip.trim(),
			countryCode: editingAddress?.countryCode || 'IN',
			// ponytail: Figma has no city/state fields; retain saved values or use a non-misleading API fallback.
			city: editingAddress?.city || 'Not specified',
			state: editingAddress?.state || 'Not specified',
			receiverName: receiverName.trim(),
			receiverPhone: normalizePhone(receiverPhone),
			addressType,
			type: addressType,
			isHome: selectedType === 'home',
			isOffice: selectedType === 'office'
		}

		saving = true
		try {
			address.id ||= 'new'
			await addressService.saveAddress(address)
			await addressesModule.paginateAddress()
			toast.success('Address saved')
			closeForm()
		} catch (error: any) {
			toast.error(error?.message || 'Failed to save address')
		} finally {
			saving = false
		}
	}
</script>

{#if showingForm}
	<section class="rj-address-form-page">
		<form onsubmit={saveAddress}>
			<header class="rj-form-header">
				<div class="rj-form-heading">
					<div class="rj-form-title">
						<button type="button" onclick={closeForm} aria-label="Back to address book"><img src="/ryans-jewels/account/address-back.svg" alt="" /></button>
						<h1>{editingAddress ? 'Edit Address' : 'Add New Address'}</h1>
					</div>
					<p>Complete address would assist better us in serving you.</p>
				</div>
				<button class="rj-save-address" type="submit" disabled={saving}>{saving ? 'SAVING…' : 'SAVE ADDRESS'}</button>
			</header>

			<div class="rj-divider"></div>

			<div class="rj-form-body">
				<div class="rj-type-field">
					<span>Select address type</span>
					<div class="rj-type-controls" role="group" aria-label="Address type">
						<button class="rj-type-add" type="button" aria-label="Add custom address type"><img src="/ryans-jewels/account/address-type-add.svg" alt="" /></button>
						<i></i>
						{#each [
							['Home', '/ryans-jewels/account/address-home-outline.svg'],
							['Office', '/ryans-jewels/account/address-office-outline.svg'],
							['Other address', '/ryans-jewels/account/address-other.svg']
						] as option}
							<button class:active={addressType === option[0]} type="button" onclick={() => (addressType = option[0])}>
								<img src={option[1]} alt="" /><span>{option[0]}</span>
							</button>
						{/each}
					</div>
				</div>

				<div class="rj-address-fields">
					<div class="rj-fields-row">
						<label><span>Full name <b>*</b></span><input bind:value={fullName} type="text" autocomplete="name" placeholder="Enter full name" required /></label>
						<label><span>Phone number <b>*</b></span><input bind:value={phone} type="tel" autocomplete="tel" placeholder="+91  |  00000 00000" required /></label>
					</div>
					<label><span>Address (House no/Apartment name/area &amp; Landmark) <b>*</b></span><textarea bind:value={addressLine} autocomplete="street-address" placeholder="Enter House No/ Apartment" required></textarea></label>
					<label class="rj-zip"><span>Zip code <b>*</b></span><input bind:value={zip} type="text" inputmode="numeric" autocomplete="postal-code" placeholder="Enter zip code" required /></label>
					<div class="rj-divider"></div>
					<div class="rj-fields-row">
						<label><span>Receiver name <b>*</b></span><input bind:value={receiverName} type="text" placeholder="Enter receiver name" required /></label>
						<label><span>Phone number <b>*</b></span><input bind:value={receiverPhone} type="tel" placeholder="+91  |  00000 00000" required /></label>
					</div>
				</div>
			</div>
		</form>
	</section>
{:else}
	<section class="rj-address-book">
		<header class="rj-address-heading">
			<h1>Address Book</h1>
			<p>Enter a your address don’t worry information will be safe</p>
		</header>

		<div class="rj-address-holder">
			<h2>Types of Address</h2>

			{#if addressesModule.loading}
				<div class="rj-address-state" aria-live="polite"><span class="rj-address-spinner"></span>Loading addresses…</div>
			{:else if addressesModule.error}
				<div class="rj-address-state error">Unable to load your addresses. Please try again.</div>
			{:else}
				<div class="rj-address-grid">
					{#each addresses as address, index (address.id || index)}
						{@const label = labelFor(address, index)}
						<article class="rj-address-card">
							<header>
								<div class="rj-address-type">
									<img src={label.toLowerCase().includes('office') ? '/ryans-jewels/account/address-office.svg' : '/ryans-jewels/account/address-home.svg'} alt="" />
									<span>{label}</span>
								</div>
								<details class="rj-address-menu">
									<summary aria-label="Address options"><img src="/ryans-jewels/account/address-more.svg" alt="" /></summary>
									<div>
										<button type="button" onclick={() => openForm(address)}>Edit</button>
										<button class="delete" type="button" onclick={() => ondelete(address)}>Delete</button>
									</div>
								</details>
							</header>
							<div class="rj-address-copy">
								<strong>{nameFor(address)}</strong>
								<p>{lineFor(address)}</p>
								<span>{address.phone || ''}</span>
							</div>
						</article>
					{/each}

					<button class="rj-add-address" type="button" onclick={() => openForm()} aria-label="Add new address">
						<span><img src="/ryans-jewels/account/address-add.svg" alt="" /></span>
					</button>
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
	:global(body) { background: #fff; }
	.rj-address-book, .rj-address-form-page { width: 100%; color: #202020; font-family: 'Lato', sans-serif; }
	.rj-address-heading { box-sizing: border-box; height: 56px; padding-left: 6px; }
	.rj-address-heading h1 { margin: 0; font: 600 22px/22px 'Lato', sans-serif; }
	.rj-address-heading p { margin: 12px 0 0; color: #606060; font: 400 19px/22px 'Lato', sans-serif; }
	.rj-address-holder { box-sizing: border-box; width: calc(100% - 1px); min-height: 279px; margin-top: 31px; margin-left: 1px; padding: 24px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; }
	.rj-address-holder h2 { position: relative; width: max-content; margin: 0; padding-bottom: 7px; color: #cca646; font: 400 16px/22px 'Lato', sans-serif; }
	.rj-address-holder h2::after { position: absolute; bottom: 0; left: 0; width: 45px; height: 1px; background: #cca646; content: ''; }
	.rj-address-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 325px)); gap: 20px; margin-top: 30px; }
	.rj-address-card, .rj-add-address { box-sizing: border-box; min-width: 0; height: 170px; border-radius: 6px; }
	.rj-address-card { position: relative; padding: 16.5px 13px; border: 1px solid #c2c2c2; background: #fff; }
	.rj-address-card > header { display: flex; height: 22px; align-items: center; justify-content: space-between; }
	.rj-address-type { display: flex; gap: 6px; align-items: center; }
	.rj-address-type img { width: 22px; height: 22px; flex: 0 0 22px; }
	.rj-address-type span { color: #202020; font: 500 15px/normal 'Lato', sans-serif; }
	.rj-address-menu { position: relative; width: 22px; height: 22px; }
	.rj-address-menu summary { display: grid; width: 22px; height: 22px; padding: 0; place-items: center; border: 0; cursor: pointer; list-style: none; }
	.rj-address-menu summary::-webkit-details-marker { display: none; }
	.rj-address-menu summary img { width: 22px; height: 22px; transform: rotate(90deg); }
	.rj-address-menu > div { position: absolute; z-index: 5; top: 26px; right: 0; display: flex; width: 88px; flex-direction: column; padding: 4px; border: 1px solid #dedede; border-radius: 5px; background: #fff; box-shadow: 0 5px 15px rgb(0 0 0 / 10%); }
	.rj-address-menu button { height: 30px; padding: 0 8px; border: 0; border-radius: 3px; background: transparent; color: #404040; font: 400 13px/18px 'Lato', sans-serif; text-align: left; cursor: pointer; }
	.rj-address-menu button:hover { background: #f5f5f5; }
	.rj-address-menu button.delete { color: #d73535; }
	.rj-address-copy { display: flex; width: calc(100% - 28px); flex-direction: column; margin-top: 18px; }
	.rj-address-copy strong { overflow: hidden; font: 500 16px/22px 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rj-address-copy p, .rj-address-copy span { color: #606060; font: 400 13px/18px 'Sarala', sans-serif; }
	.rj-address-copy p { display: -webkit-box; min-height: 36px; margin: 9px 0 0; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
	.rj-address-copy span { min-height: 18px; margin-top: 12px; }
	.rj-add-address { display: grid; padding: 0; place-items: center; border: 2.5px dashed #c2c2c2; background: #fbfbfb; cursor: pointer; }
	.rj-add-address > span { display: grid; width: 50px; height: 50px; place-items: center; border-radius: 50%; background: #eee; transition: transform .2s ease, background .2s ease; }
	.rj-add-address img { width: 32px; height: 32px; }
	.rj-add-address:hover > span { background: #e8e8e8; transform: scale(1.04); }
	.rj-add-address:focus-visible, .rj-address-menu summary:focus-visible { outline: 2px solid #cca646; outline-offset: 3px; }
	.rj-address-state { display: flex; min-height: 170px; gap: 10px; align-items: center; justify-content: center; margin-top: 30px; color: #606060; font-size: 14px; }
	.rj-address-state.error { color: #d73535; }
	.rj-address-spinner { width: 20px; height: 20px; border: 2px solid #eee; border-top-color: #cca646; border-radius: 50%; animation: rj-address-spin .7s linear infinite; }

	.rj-address-form-page form { width: 100%; }
	.rj-form-header { display: flex; width: 100%; align-items: flex-start; justify-content: space-between; }
	.rj-form-heading { width: 435px; }
	.rj-form-title { display: flex; gap: 12px; align-items: center; }
	.rj-form-title button { display: grid; width: 26px; height: 26px; flex: 0 0 26px; padding: 0; place-items: center; border: 0; background: transparent; cursor: pointer; }
	.rj-form-title img { width: 26px; height: 26px; }
	.rj-form-title h1 { margin: 0; font: 600 22px/22px 'Lato', sans-serif; }
	.rj-form-heading p { margin: 10px 0 0; color: #606060; font: 400 18px/22px 'Lato', sans-serif; }
	.rj-save-address { min-width: 134px; height: 42px; padding: 12px 18px; border: 0; border-radius: 5px; background: #003176; color: #fff; font: 500 14px/18px 'Lato', sans-serif; cursor: pointer; }
	.rj-save-address:disabled { cursor: wait; opacity: .65; }
	.rj-divider { width: 100%; height: 1px; background: #e6e6e6; }
	.rj-address-form-page > form > .rj-divider { margin-top: 25px; }
	.rj-form-body { display: flex; width: calc(100% - 11px); flex-direction: column; gap: 32px; margin-top: 20px; }
	.rj-type-field { display: flex; width: 100%; flex-direction: column; gap: 6px; }
	.rj-type-field > span { color: #606060; font: 400 12px/22px 'Lato', sans-serif; }
	.rj-type-controls { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
	.rj-type-controls button { display: flex; height: 36px; box-sizing: border-box; gap: 6px; align-items: center; padding: 7px 10px; border: 1px solid #c2c2c2; border-radius: 6px; background: #fff; color: #606060; font: 500 15px/20px 'Lato', sans-serif; cursor: pointer; }
	.rj-type-controls button.active { border-color: #cca646; background: #fffaf0; color: #202020; }
	.rj-type-controls button img { width: 22px; height: 22px; }
	.rj-type-controls .rj-type-add { width: 36px; padding: 7px; border-radius: 5px; }
	.rj-type-controls i { width: 1px; height: 36px; background: #d9d9d9; }
	.rj-address-fields { display: flex; width: 100%; flex-direction: column; gap: 20px; }
	.rj-fields-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px; }
	.rj-address-fields label { display: flex; min-width: 0; flex-direction: column; gap: 8px; color: #606060; font: 400 14px/normal 'Sarala', sans-serif; }
	.rj-address-fields label b { color: #c3110c; font-weight: 400; }
	.rj-address-fields input, .rj-address-fields textarea { box-sizing: border-box; width: 100%; border: 1px solid #c2c2c2; border-radius: 4px; outline: none; background: #fff; color: #202020; font: 400 14px/20px 'Lato', sans-serif; }
	.rj-address-fields input { height: 45px; padding: 12px; }
	.rj-address-fields textarea { height: 70px; padding: 15px 12px; resize: none; }
	.rj-address-fields input::placeholder, .rj-address-fields textarea::placeholder { color: #bdbdbd; opacity: 1; }
	.rj-address-fields input:focus, .rj-address-fields textarea:focus { border-color: #003176; box-shadow: 0 0 0 1px #003176; }
	.rj-address-fields .rj-zip { width: calc((100% - 26px) / 2); }
	.rj-address-fields > .rj-divider { margin: 4px 0; }
	.rj-form-title button:focus-visible, .rj-save-address:focus-visible, .rj-type-controls button:focus-visible { outline: 2px solid #cca646; outline-offset: 2px; }

	@keyframes rj-address-spin { to { transform: rotate(360deg); } }

	@media (max-width: 1100px) {
		.rj-address-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}

	@media (min-width: 1600px) {
		.rj-address-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	}

	@media (max-width: 900px) {
		.rj-address-book, .rj-address-form-page { margin-top: 24px; }
	}

	@media (max-width: 640px) {
		.rj-address-heading { height: auto; padding-left: 0; }
		.rj-address-heading p { max-width: 100%; font-size: 16px; line-height: 22px; }
		.rj-address-holder { min-height: 0; margin-top: 24px; padding: 18px 16px; }
		.rj-address-grid, .rj-fields-row { grid-template-columns: minmax(0, 1fr); }
		.rj-address-grid { margin-top: 24px; }
		.rj-address-card, .rj-add-address { height: 170px; }
		.rj-address-copy { width: 100%; }
		.rj-form-header { flex-direction: column; gap: 20px; }
		.rj-form-heading { width: 100%; }
		.rj-form-heading p { font-size: 16px; }
		.rj-save-address { width: 100%; }
		.rj-form-body { width: 100%; }
		.rj-type-controls { gap: 8px; }
		.rj-type-controls button { padding-inline: 8px; font-size: 14px; }
		.rj-address-fields .rj-zip { width: 100%; }
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-add-address > span { transition: none; }
		.rj-address-spinner { animation-duration: 1.5s; }
	}
</style>
