<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { toast } from 'svelte-sonner'
	import { z } from 'zod'
	import { AddressSchema } from '$lib/core/components/index.js'
	import { CartModule, checkoutAddressSchema, emptyAddress } from '$lib/core/composables/index.js'
	import { addressService, cartService } from '$lib/core/services/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import * as Dialog from '$lib/components/ui/dialog/index.js'
	import { formatPrice } from '$lib/core/utils/index.js'
	import RjProductCard from './RjProductCard.svelte'
	import { checkoutGate } from './checkout-overview.logic.js'
	import { findAddressReplacement, groupSavedAddresses, savedAddressId, splitCustomerName } from './shipping-address.logic.js'

	let { addressModule, cartState }: { addressModule: any; cartState: any } = $props()

	const cartModule = new CartModule()
	let continueShoppingHref = $state('/products')
	let email = $state('')
	let password = $state('')
	let showPassword = $state(false)
	let processing = $state(false)
	let error = $state('')
	let otp = $state('')
	let couponCode = $state('')
	let fullName = $state('')
	let building = $state('')
	let street = $state('')
	let landmark = $state('')
	let countryCode = $state('')
	let region = $state('')
	let city = $state('')
	let zip = $state('')
	let addressType = $state('home')
	let shippingHydrated = $state(false)
	let contactSaving = $state(false)
	let otpSending = $state(false)
	let otpSent = $state(false)
	let otpSeconds = $state(0)
	let otpEmail = $state('')
	let verifiedEmail = $state('')
	let verifiedOtp = $state('')
	let otpError = $state('')
	let deletingAddressId = $state('')
	let deleteAddressError = $state('')
	let showRemoveAddressConfirmation = $state(false)
	let addressToRemove = $state<any>(null)
	let addingSavedAddress = $state(false)
	let otpTimer: ReturnType<typeof setInterval> | undefined
	let contactForm = $state<HTMLFormElement>()

	const items = $derived(cartState.cart?.lineItems || [])
	const currency = $derived(page.data?.store?.currency?.code || cartState.cart?.currencyCode || 'USD')
	const itemCount = $derived(items.reduce((sum: number, item: any) => sum + Number(item.qty || 0), 0))
	const subtotal = $derived(Number(cartState.cart?.subtotal || 0))
	const tax = $derived(Number(cartState.cart?.taxAmount || cartState.cart?.taxes || 0))
	const discount = $derived(Number(cartState.cart?.discountAmount || 0))
	const total = $derived(Number(cartState.cart?.total ?? subtotal + tax - discount))
	const products = $derived((page.data?.checkoutProducts || []).slice(0, 5))
	const isShippingStep = $derived(page.url.searchParams.get('step') === 'shipping')
	const guestCheckoutEnabled = $derived(Boolean(page.data?.store?.plugins?.isGuestCheckout?.active))
	const countries = $derived(page.data?.store?.countries || [])
	const savedAddresses = $derived(groupSavedAddresses(addressModule.addresses || [], cartState.cart?.shippingAddress))
	const hasSavedAddresses = $derived(savedAddresses.all.length > 0)
	const showSavedAddressList = $derived(hasSavedAddresses && !addingSavedAddress)
	const officeBaseAddress = $derived(savedAddresses.home[0] || null)
	const showOfficeAddressFlow = $derived(addingSavedAddress && addressType === 'office' && Boolean(officeBaseAddress))
	const otpVerified = $derived(verifiedEmail === addressModule.email?.trim().toLowerCase() && verifiedOtp === otp)
	const orderDate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())

	$effect(() => {
		const savedEmail = addressModule.userState?.user?.email || cartState.cart?.email
		if (!email && savedEmail) email = savedEmail
	})

	$effect(() => {
		if (!isShippingStep || shippingHydrated) return
		const saved = cartState.cart?.shippingAddress || addressModule.currentAddress || {}
		const user = addressModule.userState?.user || {}
		addressModule.email = cartState.cart?.email || user.email || email
		addressModule.phone = cartState.cart?.phone || saved.phone || user.phone || ''
		fullName = [saved.firstName || user.firstName, saved.lastName || user.lastName].filter(Boolean).join(' ')
		building = saved.address_1 || ''
		street = saved.address_2 || ''
		landmark = saved.locality || ''
		countryCode = saved.countryCode || page.data?.store?.country?.code || 'IN'
		region = saved.state || ''
		city = saved.city || ''
		zip = saved.zip || ''
		couponCode = cartState.cart?.couponCode || ''
		shippingHydrated = true
	})

	onMount(() => {
		continueShoppingHref = sessionStorage.getItem('rj-continue-shopping') || '/products'
		try {
			localStorage.removeItem('rj-hidden-address-ids')
		} catch {
			// Storage can be unavailable in privacy mode; deletion still uses the API.
		}
	})

	onDestroy(() => {
		if (otpTimer) clearInterval(otpTimer)
	})

	function itemDescription(item: any) {
		return String(item?.product?.description || item?.variant?.product?.description || item?.subtitle || 'A beautifully crafted piece designed with timeless detail and everyday elegance.')
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
	}

	async function addCoupon() {
		const code = window.prompt('Enter discount code', cartState.cart?.couponCode || '')?.trim()
		if (!code) return
		try {
			await cartState.applyCoupon(code)
			toast.success('Coupon applied')
		} catch {
			// Shared cart state displays the API error.
		}
	}

	async function applyShippingCoupon(event: SubmitEvent) {
		event.preventDefault()
		if (!couponCode.trim()) return
		await cartState.applyCoupon(couponCode.trim())
	}

	function startOtpTimer(seconds: number) {
		otpSeconds = seconds
		if (otpTimer) clearInterval(otpTimer)
		otpTimer = setInterval(() => {
			otpSeconds = Math.max(0, otpSeconds - 1)
			if (!otpSeconds && otpTimer) {
				clearInterval(otpTimer)
				otpTimer = undefined
			}
		}, 1000)
	}

	function handleOtpInput(value = otp) {
		otp = value
		otpError = ''
		if (!/^\d{6}$/.test(otp)) return
		if (otpTimer) clearInterval(otpTimer)
		otpTimer = undefined
		otpSeconds = 0
		if (!otpVerified && !contactSaving) queueMicrotask(() => contactForm?.requestSubmit())
	}

	async function sendEmailOtp() {
		const nextEmail = addressModule.email?.trim().toLowerCase() || ''
		if (!checkoutAddressSchema.email.safeParse(nextEmail).success || !nextEmail) {
			toast.error('Enter a valid email address')
			return
		}
		otpError = ''
		otpSending = true
		try {
			const response = await fetch('/checkout/email-otp', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ action: 'send', email: nextEmail })
			})
			const result = await response.json()
			if (!response.ok) throw new Error(result.message || 'Unable to send verification code')
			otp = result.devOtp || ''
			otpEmail = nextEmail
			verifiedEmail = ''
			verifiedOtp = ''
			otpSent = true
			if (result.devOtp) handleOtpInput()
			else startOtpTimer(Number(result.cooldownSeconds || 30))
			toast.success(result.devOtp ? `Development OTP: ${result.devOtp}` : `Verification code sent to ${nextEmail}`)
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Unable to send verification code')
		} finally {
			otpSending = false
		}
	}

	async function saveShippingContact(event: SubmitEvent) {
		event.preventDefault()
		const nextEmail = addressModule.email?.trim().toLowerCase() || ''
		const nextPhone = addressModule.phone?.trim() || ''
		if (!checkoutAddressSchema.email.safeParse(nextEmail).success || !checkoutAddressSchema.phone.safeParse(nextPhone).success) {
			toast.error('Enter valid contact information')
			return false
		}
		if (!otpSent || otpEmail !== nextEmail) {
			toast.error('Send a verification code to this email first')
			return false
		}
		if (!/^\d{6}$/.test(otp)) {
			toast.error('Enter the 6-digit verification code')
			return false
		}
		contactSaving = true
		const loadingStartedAt = Date.now()
		try {
			if (!otpVerified) {
				const response = await fetch('/checkout/email-otp', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ action: 'verify', email: nextEmail, otp })
				})
				const result = await response.json()
				if (!response.ok) {
					otpError = result.message === 'Incorrect verification code' ? 'Verification Code Dose Not Match. Please Try Again' : result.message || 'Unable to verify code'
					throw new Error(otpError)
				}
				verifiedEmail = nextEmail
				verifiedOtp = otp
				otpError = ''
			}
			await cartState.updateEmail({ email: nextEmail, phone: nextPhone })
			toast.success('Email verified and contact information saved')
			return true
		} catch (error) {
			if (!otpError) toast.error(error instanceof Error ? error.message : 'Unable to verify code')
			return false
		} finally {
			const remainingLoadingTime = 700 - (Date.now() - loadingStartedAt)
			if (remainingLoadingTime > 0) await new Promise((resolve) => setTimeout(resolve, remainingLoadingTime))
			contactSaving = false
		}
	}

	function resetShippingAddress() {
		fullName = ''
		building = ''
		street = ''
		landmark = ''
		region = ''
		city = ''
		zip = ''
	}

	function savedAddressLine(address: any) {
		return [address.address_1, address.address_2, address.locality, address.city, address.state, address.zip].filter(Boolean).join(', ')
	}

	function savedAddressName(address: any) {
		return [address?.firstName, address?.lastName].filter(Boolean).join(' ')
	}

	function savedCountryName(address: any) {
		return countries.find((country: any) => country.code === address?.countryCode)?.name || address?.country || address?.countryCode || ''
	}

	function isSelectedAddress(address: any) {
		const selected = cartState.cart?.shippingAddress
		const addressId = savedAddressId(address, cartState.cart, addressModule.addresses || [])
		return selected === address || Boolean(addressId && addressId === (cartState.cart?.shippingAddressId || selected?.id))
	}

	function addSavedAddress(type: 'home' | 'office') {
		addingSavedAddress = true
		addressType = type
		addressModule.currentAddress = { ...emptyAddress('new'), type }
		addressModule.currentAddressType = 'shipping'
		addressModule.isBillingAddressSameAsShipping = true
		addressModule.showAddressForm = false
		resetShippingAddress()
	}

	async function selectSavedAddress(address: any) {
		if (isSelectedAddress(address)) return
		addressModule.currentAddress = { ...address }
		addressModule.currentAddressType = 'shipping'
		addressModule.isBillingAddressSameAsShipping = true
		await addressModule.saveAddressToCart()
	}

	function confirmRemoveSavedAddress(address: any) {
		addressToRemove = address
		deleteAddressError = ''
		showRemoveAddressConfirmation = true
	}

	async function removeSavedAddress(address: any) {
		const addressId = savedAddressId(address, cartState.cart, addressModule.addresses || [])
		if (!addressId) {
			deleteAddressError = 'Unable to identify this saved address. Please refresh and try again.'
			toast.error(deleteAddressError)
			return false
		}
		deletingAddressId = addressId
		deleteAddressError = ''
		try {
			if (isSelectedAddress(address)) {
				const replacement = findAddressReplacement(savedAddresses.all, address)
				const cartId = cartState.cart?.id
				const isBillingAddress = addressModule.isBillingAddressSameAsShipping || cartState.cart?.billingAddressId === addressId || cartState.cart?.billingAddress?.id === addressId
				if (cartId) {
					await cartService.patch(`/api/carts/${cartId}`, {
						shippingAddressId: replacement?.id || null,
						...(isBillingAddress ? { billingAddressId: replacement?.id || null } : {})
					})
				}
				cartState.cart = {
					...cartState.cart,
					shippingAddressId: replacement?.id || null,
					shippingAddress: replacement || null,
					...(isBillingAddress ? { billingAddressId: replacement?.id || null, billingAddress: replacement || null } : {})
				}
				addressModule.currentAddress = replacement ? { ...replacement } : emptyAddress('new')
			}
			await addressService.deleteAddress(addressId)
			addressModule.addresses = (addressModule.addresses || []).filter((candidate: any) => candidate.id !== addressId)
			toast.success('Address removed')
			return true
		} catch (error) {
			deleteAddressError = (error as any)?.message || 'Unable to remove address'
			toast.error(deleteAddressError)
			return false
		} finally {
			deletingAddressId = ''
		}
	}

	async function handleRemoveAddressConfirmation() {
		try {
			if (!addressToRemove || !(await removeSavedAddress(addressToRemove))) return
			showRemoveAddressConfirmation = false
			addressToRemove = null
		} catch (error) {
			deleteAddressError = (error as any)?.message || 'Unable to remove address'
			toast.error(deleteAddressError)
		}
	}

	async function processSavedAddress() {
		const selected = cartState.cart?.shippingAddress?.address_1 ? cartState.cart.shippingAddress : savedAddresses.all[0]
		if (!selected) return
		processing = true
		try {
			await selectSavedAddress(selected)
			await proceedToPayment()
		} finally {
			processing = false
		}
	}

	async function proceedToPayment() {
		try {
			await addressModule.handleProceedToPayment()
		} catch (cause: any) {
			toast.error(cause?.message || 'Unable to open the payment page')
		}
	}

	async function processShippingAddress(event: SubmitEvent) {
		event.preventDefault()
		if (!otpVerified) {
			toast.error('Verify your email before continuing')
			return
		}
		const names = splitCustomerName(fullName)
		const nextAddress = {
			...addressModule.currentAddress,
			...names,
			phone: addressModule.phone?.trim() || '',
			address_1: building.trim(),
			address_2: street.trim(),
			locality: landmark.trim(),
			countryCode,
			state: region.trim(),
			city: city.trim(),
			zip: zip.trim(),
			type: addressType
		}
		const validation = z.object(AddressSchema).safeParse(nextAddress)
		if (!landmark.trim()) {
			toast.error('Landmark is required')
			return
		}
		if (!validation.success) {
			toast.error(validation.error.errors[0]?.message || 'Fill all address fields correctly')
			return
		}
		processing = true
		try {
			await cartState.updateEmail({ email: addressModule.email?.trim() || '', phone: addressModule.phone?.trim() || '' })
			addressModule.currentAddress = nextAddress
			addressModule.currentAddressType = 'shipping'
			addressModule.isBillingAddressSameAsShipping = true
			await addressModule.saveAddressToCart()
			await proceedToPayment()
		} finally {
			processing = false
		}
	}

	async function processCheckout() {
		error = ''
		const gate = checkoutGate({
			hasAddress: Boolean(cartState.cart?.shippingAddress),
			userId: addressModule.userState?.user?.userId,
			email,
			password,
			guestCheckout: guestCheckoutEnabled
		})
		if (gate === 'payment') {
			await goto('/checkout/address?step=shipping')
			return
		}

		if (gate === 'credentials') {
			error = guestCheckoutEnabled ? 'Enter a valid email to continue.' : 'Enter a valid email and password to continue.'
			return
		}

		if (gate === 'login') {
			processing = true
			const loggedIn = await addressModule.userState.login({ email: email.trim(), password, cartId: cartState.cart?.id })
			if (!loggedIn) {
				processing = false
				return
			}
		}

		const currentUser = addressModule.userState?.user
		addressModule.email = email.trim() || currentUser?.email || ''
		addressModule.phone = cartState.cart?.phone || currentUser?.phone || ''
		await cartState.updateEmail({ email: addressModule.email, phone: addressModule.phone })
		await addressModule.mount()
		processing = false
		await goto('/checkout/address?step=shipping')
	}
</script>

<section class="rj-checkout-overview">
	{#await cartState.hasLoaded}
		<div class="rj-checkout-loading" aria-live="polite">Loading your checkout…</div>
	{:then _}
		{#if items.length}
			{#if isShippingStep}
				<div class="rj-shipping-grid" class:has-saved-addresses={showSavedAddressList}>
					<div class="rj-shipping-left">
						<a class="rj-continue" href={continueShoppingHref}>
							<span><img src="/ryans-jewels/cart/arrow-left.svg" alt="" /><img src="/ryans-jewels/cart/arrow-left.svg" alt="" /></span>
							Continue Shopping
						</a>

						<ol class="rj-checkout-steps rj-shipping-steps" aria-label="Checkout progress">
							<li class="complete"><b>1</b><span>Information</span></li>
							<li aria-hidden="true">----</li>
							<li class="active"><b>2</b><span>Shipping Address</span></li>
							<li aria-hidden="true">----</li>
							<li><b>3</b><span>Payment Method</span></li>
						</ol>

						<hr class="rj-checkout-rule" />

						{#if showSavedAddressList}
							<div class="rj-saved-addresses">
								{#each [
									{ type: 'home', icon: 'saved-home.svg', subtitle: 'Delivered to Home', addresses: savedAddresses.home },
									{ type: 'office', icon: 'saved-office.svg', subtitle: 'Delivered to Office', addresses: savedAddresses.office }
								] as group (group.type)}
									<section class="rj-saved-address-group">
										<header>
											<div><img src="/ryans-jewels/checkout/shipping/{group.icon}" alt="" /><span><b>Your Address’s</b><small>{group.subtitle}</small></span></div>
											<button type="button" onclick={() => addSavedAddress(group.type as 'home' | 'office')}>+Add Address</button>
										</header>
										<div class="rj-saved-address-panel">
											{#if group.addresses.length}
												<div class="rj-saved-address-cards">
													{#each group.addresses as address (address.id || savedAddressLine(address))}
														<article class="rj-saved-address-card" class:selected={isSelectedAddress(address)}>
															<button class="rj-address-select" type="button" aria-label="Deliver to {address.firstName} {address.lastName}" aria-pressed={isSelectedAddress(address)} onclick={() => selectSavedAddress(address)}></button>
															<div class="rj-saved-address-copy">
																<div><b>{[address.firstName, address.lastName].filter(Boolean).join(' ') || 'Saved Address'}</b>{#if isSelectedAddress(address)}<small>Default</small>{/if}</div>
																<p>{savedAddressLine(address)}</p>
															</div>
															<footer>
																<span><img src="/ryans-jewels/checkout/shipping/saved-call.svg" alt="" />{address.phone || cartState.cart?.phone || 'Phone unavailable'}</span>
																<button type="button" disabled={addressModule.loadingForSaveToCart || deletingAddressId === savedAddressId(address, cartState.cart, addressModule.addresses || [])} onclick={() => confirmRemoveSavedAddress(address)}><img src="/ryans-jewels/checkout/shipping/saved-trash.svg" alt="" />{deletingAddressId === savedAddressId(address, cartState.cart, addressModule.addresses || []) ? 'Removing…' : 'Remove'}</button>
															</footer>
														</article>
													{/each}
												</div>
											{:else}
												<button class="rj-empty-address" type="button" onclick={() => addSavedAddress(group.type as 'home' | 'office')}>+ Add {group.type} address</button>
											{/if}
										</div>
									</section>
								{/each}
							</div>
						{:else}
						<form bind:this={contactForm} class="rj-customer-card" class:has-otp-error={Boolean(otpError)} onsubmit={saveShippingContact}>
							<h1><img src="/ryans-jewels/checkout/shipping/user-search.svg" alt="" />Customer Information</h1>
							<div class="rj-customer-fields">
								<label><img src="/ryans-jewels/checkout/shipping/sms.svg" alt="" /><input type="email" autocomplete="email" bind:value={addressModule.email} placeholder="Example1@Email.Com" aria-label="Email address" /></label>
								<label><img src="/ryans-jewels/checkout/shipping/call-add.svg" alt="" /><input type="tel" autocomplete="tel" bind:value={addressModule.phone} placeholder="Enter Phone Number" aria-label="Phone number" /></label>
								<div class="rj-otp-field">
									<label class="otp" class:verified={otpVerified} class:error={Boolean(otpError)}><img src="/ryans-jewels/checkout/shipping/message-tick.svg" alt="" /><input inputmode="numeric" autocomplete="one-time-code" maxlength="6" bind:value={otp} oninput={(event) => handleOtpInput(event.currentTarget.value)} placeholder="Enter 6-Digit Verification OTP Code" aria-label="Verification OTP code" aria-invalid={Boolean(otpError)} aria-describedby={otpError ? 'rj-otp-error' : undefined} />{#if otpVerified}<span class="rj-otp-verified"><img src="/ryans-jewels/checkout/shipping/otp-verified.svg" alt="" />Verify</span>{/if}</label>
									{#if otpError}<p id="rj-otp-error" class="rj-otp-error" role="alert"><img src="/ryans-jewels/checkout/shipping/otp-error.svg" alt="" />{otpError}</p>{/if}
								</div>
							</div>
							<div class="rj-customer-actions">
								<p><b>{otpSeconds.toFixed(2)}</b> Second</p>
								<div>
									<button class="resend" type="button" disabled={otpSending || otpSeconds > 0} onclick={sendEmailOtp}><img src="/ryans-jewels/checkout/shipping/refresh.svg" alt="" />{otpSending ? 'Sending…' : otpSent ? 'Resend Code' : 'Send Code'}</button>
									<button class="submit" type="submit" disabled={contactSaving}>{#if contactSaving}<span class="rj-otp-spinner" aria-hidden="true"></span>VERIFYING<span class="rj-otp-loading-dots" aria-hidden="true">...</span>{:else}SUBMIT{/if}</button>
								</div>
							</div>
						</form>

						<form id="rj-shipping-address-form" class="rj-address-card" class:office-address={showOfficeAddressFlow} onsubmit={processShippingAddress}>
							<header>
								<h2><img src="/ryans-jewels/checkout/shipping/home.svg" alt="" />Shipping Address</h2>
								<span><img src="/ryans-jewels/checkout/shipping/saved.svg" alt="" />{addressModule.loadingForSaveToCart || !cartState.cart?.shippingAddress ? 'Saving..' : 'Saved'}</span>
							</header>

							{#if showOfficeAddressFlow}
								<div class="rj-address-fields rj-existing-address-fields">
									<label><b>Full Name<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/user.svg" alt="" /><input value={savedAddressName(officeBaseAddress)} aria-label="Existing home address full name" readonly /></span></label>
									<label><b>Flat / Building No / Apartment.<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/building.svg" alt="" /><input value={officeBaseAddress?.address_1 || ''} aria-label="Existing home building" readonly /></span></label>
									<label><b>Street / Area / Address<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/map.svg" alt="" /><input value={officeBaseAddress?.address_2 || ''} aria-label="Existing home street" readonly /></span></label>
									<label><b>Landmark<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/gps.svg" alt="" /><input value={officeBaseAddress?.locality || officeBaseAddress?.landmark || ''} aria-label="Existing home landmark" readonly /></span></label>
									<div class="rj-address-pair">
										<label><b>Country<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/global.svg" alt="" /><input value={savedCountryName(officeBaseAddress)} aria-label="Existing home country" readonly /></span></label>
										<label><b>State<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/state.svg" alt="" /><input value={officeBaseAddress?.state || ''} aria-label="Existing home state" readonly /><img class="arrow" src="/ryans-jewels/checkout/shipping/arrow-down.svg" alt="" /></span></label>
									</div>
									<div class="rj-address-pair">
										<label><b>City<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/map.svg" alt="" /><input value={officeBaseAddress?.city || ''} aria-label="Existing home city" readonly /><img class="arrow" src="/ryans-jewels/checkout/shipping/arrow-down.svg" alt="" /></span></label>
										<label><b>Zip Code<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/zip.svg" alt="" /><input value={officeBaseAddress?.zip || ''} aria-label="Existing home zip code" readonly /></span></label>
									</div>
								</div>

								<footer>
									<button class="different" type="button" onclick={resetShippingAddress}><img src="/ryans-jewels/checkout/shipping/add.svg" alt="" />Ship to a different address?</button>
									<div class="rj-address-types">
										<button type="button" onclick={() => (addressType = 'home')}><img src="/ryans-jewels/checkout/shipping/home-inactive.svg" alt="" />Home</button>
										<i></i>
										<button class="active" type="button"><img src="/ryans-jewels/checkout/shipping/office-active.svg" alt="" />Office</button>
									</div>
								</footer>
							{/if}

							<div class="rj-address-fields">
								<label><b>Full Name<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/user.svg" alt="" /><input autocomplete="name" bind:value={fullName} placeholder="Enter Full Name" required /></span></label>
								<label><b>Flat / Building No / Apartment.<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/building.svg" alt="" /><input autocomplete="address-line1" bind:value={building} placeholder="Flat / Building / Apartment" required /></span></label>
								<label><b>Street / Area / Address<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/map.svg" alt="" /><input autocomplete="address-line2" bind:value={street} placeholder="Enter Street / Area" required /></span></label>
								<label><b>Landmark<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/gps.svg" alt="" /><input bind:value={landmark} placeholder="Landmark" required /></span></label>
								<div class="rj-address-pair">
									<label><b>Country<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/global.svg" alt="" /><select bind:value={countryCode} required aria-label="Country"><option value="" disabled>Enter Your Country</option>{#each countries as country}<option value={country.code}>{country.name || country.title || country.code}</option>{/each}</select></span></label>
									<label><b>State<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/state.svg" alt="" /><input autocomplete="address-level1" bind:value={region} placeholder="Enter State" required /><img class="arrow" src="/ryans-jewels/checkout/shipping/arrow-down.svg" alt="" /></span></label>
								</div>
								<div class="rj-address-pair">
									<label><b>City<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/map.svg" alt="" /><input autocomplete="address-level2" bind:value={city} placeholder="Select Your City" required /><img class="arrow" src="/ryans-jewels/checkout/shipping/arrow-down.svg" alt="" /></span></label>
									<label><b>Zip Code<em>*</em></b><span><img src="/ryans-jewels/checkout/shipping/zip.svg" alt="" /><input autocomplete="postal-code" bind:value={zip} placeholder="Enter Zip Code" required /></span></label>
								</div>
							</div>

							{#if !showOfficeAddressFlow}
								<footer>
									<button class="different" type="button" onclick={resetShippingAddress}><img src="/ryans-jewels/checkout/shipping/add.svg" alt="" />Ship to a different address?</button>
									<div class="rj-address-types">
										<button class:active={addressType === 'home'} type="button" onclick={() => (addressType = 'home')}><img src="/ryans-jewels/checkout/shipping/home-type.svg" alt="" />Home</button>
										<i></i>
										<button class:active={addressType === 'office'} type="button" onclick={() => (addressType = 'office')}><img src="/ryans-jewels/checkout/shipping/office.svg" alt="" />Office</button>
									</div>
								</footer>
							{/if}
						</form>

						<div class="rj-safe-info"><img src="/ryans-jewels/checkout/shipping/safe.png" alt="" />Your information is safe</div>
						{/if}
					</div>

					<div class="rj-shipping-right">
						<aside class="rj-order-summary">
							<div class="rj-order-card">
								<h2>Order Summary #{String(cartState.cart?.id || '0258741').slice(-7).toUpperCase()}</h2>
								<div class="rj-order-date"><span>Date &amp; Time</span><b>{orderDate}</b></div>
								<hr />
								<div class="rj-order-prices">
									<p><span>Total Item &amp; Price</span><b>{itemCount} ({formatPrice(subtotal, currency)})</b></p>
									<p><span>Subtotal</span><b>{formatPrice(subtotal, currency)}</b></p>
									<p><span>Taxes</span><b>{formatPrice(tax, currency)}</b></p>
								</div>
								<hr />
								<label class="rj-coupon-title" for="rj-shipping-coupon">Discount Code</label>
								<form class="rj-shipping-coupon" onsubmit={applyShippingCoupon}>
									<img src="/ryans-jewels/checkout/shipping/coupon.svg" alt="" />
									<input id="rj-shipping-coupon" bind:value={couponCode} placeholder="Enter coupon code" />
									<button type="submit">APPLY COUPON</button>
								</form>
								<div class="rj-order-total">
									<p class="discount"><span>Discount</span><b>-{formatPrice(discount, currency)}</b></p>
									<p><span>Total</span><b>{formatPrice(total, currency)}</b></p>
								</div>
							</div>
							{#if showSavedAddressList}
								<button class="rj-shipping-process" type="button" disabled={processing || addressModule.loadingForCheckout || addressModule.loadingForSaveToCart} onclick={processSavedAddress}>{processing ? 'PROCESSING…' : 'PROCESS TO CHECKOUT'}</button>
							{:else}
								<button class="rj-shipping-process" type="submit" form="rj-shipping-address-form" disabled={processing || addressModule.loadingForCheckout || addressModule.loadingForSaveToCart}>{processing ? 'PROCESSING…' : 'PROCESS TO CHECKOUT'}</button>
							{/if}
						</aside>

						<div class="rj-order-assurance">
							<div class="rj-assurance-row">
								<div><img src="/ryans-jewels/checkout/shipping/free-shipping.svg" alt="" /><span><b>Free Shipping</b><small>Free Shipping All order</small></span></div>
								<div><img src="/ryans-jewels/checkout/shipping/support.svg" alt="" /><span><b>24/7 Support</b><small>Free Shipping All order</small></span></div>
								<div><img src="/ryans-jewels/checkout/shipping/security.svg" alt="" /><span><b>Payment Security</b><small>Free Shipping All order</small></span></div>
							</div>
							<div class="rj-payment-brands">
								<div><img src="/ryans-jewels/checkout/shipping/mastercard.png" alt="Mastercard" /><img src="/ryans-jewels/checkout/shipping/paypal.png" alt="PayPal" /><img src="/ryans-jewels/checkout/shipping/visa.png" alt="Visa" /><img src="/ryans-jewels/checkout/shipping/amex.png" alt="American Express" /><img src="/ryans-jewels/checkout/shipping/apple-pay.png" alt="Apple Pay" /><img src="/ryans-jewels/checkout/shipping/discover.png" alt="Discover" /></div>
								<p>Learn more about our <a href="/p/terms-and-conditions">TERMS &amp; POLICIES</a></p>
							</div>
						</div>
					</div>
				</div>
			{:else}
			<div class="rj-checkout-grid">
				<div class="rj-checkout-cart">
					<a class="rj-continue" href={continueShoppingHref}>
						<span><img src="/ryans-jewels/cart/arrow-left.svg" alt="" /><img src="/ryans-jewels/cart/arrow-left.svg" alt="" /></span>
						Continue Shopping
					</a>

					<ol class="rj-checkout-steps" aria-label="Checkout progress">
						<li class="active"><b>1</b><span>Information</span></li>
						<li aria-hidden="true">----</li>
						<li><b>2</b><span>Shipping Address</span></li>
						<li aria-hidden="true">----</li>
						<li><b>3</b><span>Payment Method</span></li>
					</ol>

					<hr class="rj-checkout-rule" />

					<header class="rj-checkout-title">
						<div><h1>Your Shopping Cart</h1><span>{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span></div>
						<small>Select one</small>
					</header>

					<div class="rj-checkout-items">
						{#each items as item (item.id)}
							<article class="rj-checkout-item">
								<a class="rj-checkout-image" href="/products/{item.slug}"><img src={item.thumbnail || '/placeholder.svg'} alt={item.title} /></a>
								<div class="rj-checkout-details">
									<div class="rj-checkout-copy">
										<div><a href="/products/{item.slug}">{item.title}</a><strong>{formatPrice(item.price * item.qty, currency)}</strong></div>
										<p>{itemDescription(item)}</p>
									</div>
									<div class="rj-checkout-actions">
										<div class="rj-checkout-quantity" aria-label="Quantity for {item.title}">
											<button type="button" disabled={cartState.updatingItem[item.id]} onclick={(event) => cartModule.increaseQty(event, item)} aria-label="Increase quantity"><img src="/ryans-jewels/cart/plus.svg" alt="" /></button>
											<span aria-live="polite">{cartState.updatingItem[item.id] ? '…' : item.qty}</span>
											<button type="button" disabled={cartState.updatingItem[item.id]} onclick={(event) => cartModule.decreaseQty(event, item)} aria-label="Decrease quantity"><img src="/ryans-jewels/cart/minus.svg" alt="" /></button>
										</div>
										<div class="rj-checkout-links">
											<button type="button" disabled={cartModule.isMovingToWishlist[item.productId]} onclick={() => cartModule.moveToWishlist(item)}><img src="/ryans-jewels/cart/wishlist.svg" alt="" />{cartModule.isMovingToWishlist[item.productId] ? 'Moving…' : 'Move to Wishlist'}</button>
											<button class="remove" type="button" disabled={cartState.updatingItem[item.id]} onclick={(event) => cartModule.removeItem(event, item)}><img src="/ryans-jewels/cart/trash.svg" alt="" />Remove</button>
										</div>
									</div>
								</div>
							</article>
						{/each}
					</div>

					<div class="rj-discount">
						<div class="rj-discount-copy">
							<span class="rj-discount-icon"><img src="/ryans-jewels/checkout/coupon-polygon.svg" alt="" /><img src="/ryans-jewels/checkout/coupon-wallet.svg" alt="" /></span>
							<span><b>Discount Code</b><small>Save 20% withe code</small></span>
						</div>
						<button type="button" onclick={addCoupon}><img src="/ryans-jewels/checkout/coupon-ticket.svg" alt="" />Add Code</button>
					</div>
				</div>

				<aside class="rj-checkout-summary">
					<div class="rj-summary-account">
						<div class="rj-summary-intro">
							<h2>Cart Summary</h2>
							<p>You will be forwarded to a page where you will be asked to provide your contact and delivery information.</p>
						</div>

						<div class="rj-login-fields">
							<label for="checkout-email">Email Address</label>
							<div><img src="/ryans-jewels/checkout/sms.svg" alt="" /><input id="checkout-email" type="email" autocomplete="email" bind:value={email} placeholder="Enter Your Email Address" /></div>
							<label for="checkout-password">{guestCheckoutEnabled ? 'Password (optional)' : 'Password'}</label>
							<div class="rj-password-field">
								<input id="checkout-password" type={showPassword ? 'text' : 'password'} autocomplete="current-password" bind:value={password} placeholder="Enter Your Password" />
								<button class="rj-password-eye" type="button" onclick={() => showPassword = !showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-describedby="checkout-password-rules"><img src="/ryans-jewels/checkout/eye-slash.svg" alt="" /></button>
								<div class="rj-password-rules" id="checkout-password-rules" role="tooltip">
									<img class="rj-password-rules-bg" src="/ryans-jewels/checkout/password-tooltip.svg" alt="" />
									<p class="rj-password-rules-title">Your Password Must Have:</p>
									<p class="rj-password-rule rule-one"><img src="/ryans-jewels/checkout/password-check.svg" alt="" />At Least 8 Characters</p>
									<p class="rj-password-rule rule-two"><img src="/ryans-jewels/checkout/password-close.svg" alt="" />Upper And Lowercase Characters</p>
									<p class="rj-password-rule rule-three"><img src="/ryans-jewels/checkout/password-check.svg" alt="" />At Least One Number</p>
								</div>
							</div>
						</div>
					</div>

					<hr />

					<div class="rj-price-details">
						<h3>Price Details</h3>
						<div>
							<p><span>Total Item &amp; Price</span><b>{itemCount} ({formatPrice(subtotal, currency)})</b></p>
							<p><span>Subtotal</span><b>{formatPrice(subtotal, currency)}</b></p>
							<p><span>Taxes</span><b>{formatPrice(tax, currency)}</b></p>
							<p class="discount"><span>Discount</span><b>-{formatPrice(discount, currency)}</b></p>
							<hr />
							<p class="total"><span>Total</span><b>{formatPrice(total, currency)}</b></p>
						</div>
					</div>

					{#if error}<p class="rj-checkout-error" role="alert">{error}</p>{/if}
					<button class="rj-process" type="button" disabled={processing || addressModule.loadingForCheckout || cartState.isUpdatingCart} onclick={processCheckout}>{processing ? 'PROCESSING…' : 'PROCESS TO CHECKOUT'}</button>
				</aside>
			</div>
			{/if}

			<section class="rj-checkout-products" aria-labelledby="rj-checkout-products-title">
				<header class="rj-section-heading">
					<div><i></i><h2 id="rj-checkout-products-title">Dazzling &amp; Stylish...</h2><i></i></div>
					<p>Explore our most loved pieces, handpicked for you.</p>
				</header>

				<div class="rj-recommend-grid">
					{#each products as product (product.id)}
						<div class="rj-recommend-card"><RjProductCard {product} size="listing" /></div>
					{/each}
				</div>

				<div class="rj-view-more">
					<i></i>
					<a href="/products">View More <img src="/ryans-jewels/checkout/view-more-arrow.svg" alt="" /></a>
					<i></i>
				</div>
			</section>

		{:else}
			<div class="rj-checkout-empty"><p>Your cart is empty</p><a href={continueShoppingHref}>Continue Shopping</a></div>
		{/if}
	{/await}
</section>

<Dialog.Root bind:open={showRemoveAddressConfirmation}>
	<Dialog.Content class="w-[calc(100%_-_30px)] max-w-[460px] gap-0 overflow-hidden border-[#cca646] bg-white p-0 shadow-[0_18px_50px_rgba(48,48,48,0.18)] sm:rounded-[6px]">
		<Dialog.Header class="flex flex-col items-center gap-0 px-8 pb-7 pt-8 text-center">
			<span class="mb-4 grid size-[58px] place-items-center rounded-full bg-[#fff4f4]"><img class="size-7" src="/ryans-jewels/checkout/shipping/saved-trash.svg" alt="" /></span>
			<Dialog.Title class="font-['Lato'] text-[22px] font-semibold leading-[26px] tracking-normal text-[#303030]">Remove Address?</Dialog.Title>
			<Dialog.Description class="mt-3 max-w-[340px] font-['Sarala'] text-[14px] leading-[22px] text-[#707070]">Are you sure you want to remove this address? This action cannot be undone.</Dialog.Description>
		</Dialog.Header>
		{#if deleteAddressError}<p class="mx-8 mb-5 rounded-[5px] border border-[#ffd4d4] bg-[#fff8f8] px-4 py-3 text-center font-['Sarala'] text-[13px] leading-5 text-[#c92121]" role="alert">{deleteAddressError}</p>{/if}
		<Dialog.Footer class="grid grid-cols-2 gap-3 border-t border-[#ececec] bg-[#fafafa] px-8 py-5">
			<Button variant="plain" class="h-11 rounded-[5px] border border-[#cca646] bg-white font-['Lato'] text-[14px] font-semibold text-[#9f7e2c] hover:bg-[#fffaf0]" disabled={Boolean(deletingAddressId)} onclick={() => { showRemoveAddressConfirmation = false; addressToRemove = null; deleteAddressError = '' }}>Cancel</Button>
			<Button variant="plain" class="h-11 rounded-[5px] border border-[#a80139] bg-[#a80139] font-['Lato'] text-[14px] font-semibold text-white hover:bg-[#8f0030]" disabled={Boolean(deletingAddressId)} onclick={handleRemoveAddressConfirmation}>{deletingAddressId ? 'Removing…' : 'Remove Address'}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style>
	:global(.theme-ryans-jewels main.inter-gap:has(> .rj-checkout-overview)) { min-height: auto; }
	.rj-checkout-overview { min-height: 708px; background: #fff; color: #202020; font-family: 'Lato', sans-serif; }
	.rj-checkout-overview :is(input, select):autofill,
	.rj-checkout-overview :is(input, select):-webkit-autofill,
	.rj-checkout-overview :is(input, select):-webkit-autofill:hover,
	.rj-checkout-overview :is(input, select):-webkit-autofill:focus { box-shadow: 0 0 0 1000px #fff inset; -webkit-text-fill-color: #404040; caret-color: #404040; }
	.rj-checkout-grid { display: grid; width: min(calc(100% - clamp(120px, 8.333vw, 160px)), 1760px); grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 1.667vw, 32px); margin: 0 auto 70px; }
	.rj-checkout-cart { min-width: 0; padding-top: 30px; }
	.rj-continue { display: flex; width: max-content; gap: 5px; align-items: center; color: #004ed5; font-size: 18px; line-height: 22px; text-decoration: none; }
	.rj-continue > span { display: flex; width: 34px; align-items: center; }
	.rj-continue img { width: 22px; height: 22px; }
	.rj-continue img:first-child { margin-right: -10px; }
	.rj-checkout-steps { display: flex; height: 34px; gap: 12px; align-items: center; margin: 30px 0; padding: 0 0 0 21px; color: #989898; font: 16px/normal 'Sarala', sans-serif; list-style: none; white-space: nowrap; }
	.rj-checkout-steps li { display: flex; gap: 10px; align-items: center; }
	.rj-checkout-steps li[aria-hidden='true'] { display: block; color: #989898; font-size: 22px; letter-spacing: -1px; }
	.rj-checkout-steps b { display: grid; box-sizing: border-box; width: 34px; height: 34px; place-items: center; border: 1.5px solid #989898; border-radius: 50%; font-size: 16px; font-weight: 400; }
	.rj-checkout-steps .active, .rj-shipping-steps .complete { color: #00a80b; }
	.rj-checkout-steps .active b, .rj-shipping-steps .complete b { border-color: #00a80b; background: #00a80b; color: #fff; font-size: 18px; }
	.rj-checkout-rule { width: 100%; margin: 0; border: 0; border-top: 1px solid #c2c2c2; }
	.rj-shipping-grid { display: grid; width: min(calc(100% - clamp(120px, 8.333vw, 160px)), 1760px); grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 1.667vw, 32px); align-items: start; margin: 0 auto 50px; }
	.rj-shipping-grid.has-saved-addresses { margin-bottom: 60px; }
	.rj-shipping-left { min-width: 0; padding-top: 30px; }
	.rj-saved-addresses { display: flex; flex-direction: column; gap: 30px; margin: 29px clamp(10px, .694vw, 13px) 0; }
	.rj-saved-address-group { display: flex; height: 218px; flex-direction: column; gap: 12px; }
	.rj-saved-address-group > header { display: flex; height: 26px; flex: 0 0 26px; align-items: center; justify-content: space-between; }
	.rj-saved-address-group > header > div { display: flex; gap: 6px; align-items: center; }
	.rj-saved-address-group > header img { width: 26px; height: 26px; }
	.rj-saved-address-group > header span { display: flex; width: 106px; flex-direction: column; gap: 3px; }
	.rj-saved-address-group > header b { color: #303030; font: 400 16px/normal 'Sarala', sans-serif; white-space: nowrap; }
	.rj-saved-address-group > header small { color: #878787; font: 400 10px/normal 'Lato', sans-serif; text-transform: capitalize; }
	.rj-saved-address-group > header button { padding: 0; border: 0; background: transparent; color: #0045ce; font: 400 14px/normal 'Inter', sans-serif; cursor: pointer; }
	.rj-saved-address-panel { box-sizing: border-box; height: 180px; flex: 0 0 180px; padding: 12px 14px; overflow: hidden; border: 1px solid #c2c2c2; border-radius: 5px; background: #fcfcfc; }
	.rj-saved-address-cards { display: flex; height: 156px; gap: 12px; overflow-x: auto; scrollbar-width: thin; }
	.rj-saved-address-card { position: relative; display: flex; box-sizing: border-box; height: 156px; flex: 0 0 calc((100% - 12px) / 2); flex-direction: column; justify-content: space-between; padding: 15px 12px; overflow: hidden; border-radius: 6px; background: #fff5f5; }
	.rj-address-select { position: absolute; z-index: 1; inset: 0; padding: 0; border: 0; border-radius: inherit; background: transparent; cursor: pointer; }
	.rj-address-select:focus-visible { outline: 2px solid #67bbff; outline-offset: -2px; }
	.rj-saved-address-copy { position: relative; z-index: 0; display: flex; min-width: 0; flex-direction: column; gap: 11px; pointer-events: none; }
	.rj-saved-address-copy > div { display: flex; gap: 10px; align-items: flex-start; }
	.rj-saved-address-copy b { overflow: hidden; color: #202020; font: 500 16px/19px 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rj-saved-address-copy small { display: inline-flex; height: 20px; flex: 0 0 auto; box-sizing: border-box; align-items: center; justify-content: center; padding: 4px 8px; border: 1px solid #67bbff; border-radius: 3px; background: #dcefff; color: #67bbff; font: 400 10px/normal 'Lato', sans-serif; }
	.rj-saved-address-copy p { display: -webkit-box; margin: 0; overflow: hidden; color: #404040; font: 400 12px/19px 'Sarala', sans-serif; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
	.rj-saved-address-card > footer { position: relative; z-index: 2; display: flex; height: 20px; align-items: center; justify-content: space-between; }
	.rj-saved-address-card > footer span, .rj-saved-address-card > footer button { display: flex; gap: 6px; align-items: center; white-space: nowrap; }
	.rj-saved-address-card > footer span { overflow: hidden; color: #404040; font: 500 12px/14px 'Lato', sans-serif; text-overflow: ellipsis; }
	.rj-saved-address-card > footer span img { width: 14px; height: 14px; flex: 0 0 14px; }
	.rj-saved-address-card > footer button { padding: 0; border: 0; background: transparent; color: #d73535; font: 400 14px/20px 'Lato', sans-serif; cursor: pointer; }
	.rj-saved-address-card > footer button img { width: 18px; height: 18px; }
	.rj-saved-address-card > footer button:disabled { opacity: .5; cursor: wait; }
	.rj-empty-address { display: grid; width: 100%; height: 100%; place-items: center; border: 1px dashed #d8d8d8; border-radius: 6px; background: #fff; color: #0045ce; font: 14px/20px 'Lato', sans-serif; cursor: pointer; }
	.rj-customer-card { display: flex; box-sizing: border-box; height: 261px; flex-direction: column; margin-top: 24px; padding: 20px 25px; border: 1px solid #c2c2c2; border-radius: 5px; background: #fff; }
	.rj-customer-card.has-otp-error { height: 289px; }
	.rj-customer-card h1, .rj-address-card h2 { display: flex; gap: 10px; align-items: center; margin: 0; color: #353535; font: 400 22px/24px 'Lato', sans-serif; letter-spacing: normal; text-transform: capitalize; }
	.rj-customer-card h1 img, .rj-address-card h2 img { width: 24px; height: 24px; }
	.rj-customer-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 15px 26px; margin-top: 24px; }
	.rj-customer-fields label { display: flex; box-sizing: border-box; height: 52px; min-width: 0; gap: 10px; align-items: center; padding: 14px 10px; border: 1px solid #c2c2c2; border-radius: 5px; }
	.rj-otp-field { display: flex; grid-column: 1 / -1; flex-direction: column; gap: 6px; }
	.rj-customer-fields label.otp.verified { padding-right: 25px; border-color: #00935c; box-shadow: -2px 4px 20px rgba(0, 202, 40, .3); }
	.rj-customer-fields label.otp.verified input { color: #202020; font-weight: 600; }
	.rj-customer-fields label.otp.error { border-color: rgba(215, 53, 53, .4); box-shadow: 0 4px 7px rgba(255, 118, 107, .25); }
	.rj-customer-fields label.otp.error input { color: #202020; font-weight: 600; }
	.rj-customer-fields img { width: 24px; height: 24px; flex: 0 0 24px; }
	.rj-otp-verified { display: flex; flex: 0 0 auto; gap: 5px; align-items: center; color: #00ca28; font: 400 14px/22px 'Lato', sans-serif; text-transform: capitalize; }
	.rj-otp-verified img { width: 24px; height: 24px; flex: 0 0 24px; }
	.rj-otp-error { display: flex; height: 22px; gap: 6px; align-items: center; margin: 0; color: #ff766b; font: 400 16px/22px 'Lato', sans-serif; text-transform: capitalize; }
	.rj-otp-error img { width: 18px; height: 18px; flex: 0 0 18px; }
	.rj-customer-fields input, .rj-address-fields input, .rj-address-fields select, .rj-shipping-coupon input { min-width: 0; flex: 1; border: 0; outline: 0; background: transparent; color: #404040; font: 14px/22px 'Lato', sans-serif; text-transform: capitalize; }
	.rj-customer-fields input::placeholder, .rj-address-fields input::placeholder, .rj-shipping-coupon input::placeholder { color: #bdbdbd; opacity: 1; }
	.rj-customer-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; }
	.rj-customer-actions > p { margin: 0; color: #606060; font: 14px/normal 'Lato', sans-serif; letter-spacing: .28px; }
	.rj-customer-actions > p b { color: #a80139; font-weight: 400; }
	.rj-customer-actions > div { display: flex; gap: 20px; align-items: center; }
	.rj-customer-actions button { border: 0; font: 14px/22px 'Lato', sans-serif; letter-spacing: .28px; cursor: pointer; }
	.rj-customer-actions .resend { display: flex; gap: 10px; align-items: center; padding: 0; background: transparent; color: #4d9cff; }
	.rj-customer-actions .resend img { width: 20px; height: 20px; }
	.rj-customer-actions .resend:disabled { opacity: .5; cursor: wait; }
	.rj-customer-actions .submit { display: inline-flex; min-width: 88px; height: 34px; gap: 7px; align-items: center; justify-content: center; padding: 6px 17px; border-radius: 4px; background: #003176; color: #fff; }
	.rj-customer-actions .submit:disabled { opacity: .6; }
	.rj-otp-spinner { width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, .4); border-top-color: #fff; border-radius: 50%; animation: rj-otp-spin .7s linear infinite; }
	.rj-otp-loading-dots { display: inline-block; width: 0; overflow: hidden; animation: rj-otp-dots 1s steps(4, end) infinite; }
	@keyframes rj-otp-spin { to { transform: rotate(360deg); } }
	@keyframes rj-otp-dots { to { width: 12px; } }
	.rj-address-card { display: flex; box-sizing: border-box; height: 774px; flex-direction: column; margin-top: 25px; padding: 20px 25px; border: 1px solid #c2c2c2; border-radius: 5px; background: #fff; }
	.rj-address-card.office-address { height: 1413px; }
	.rj-address-card > header { display: flex; height: 24px; align-items: center; justify-content: space-between; }
	.rj-address-card > header > span { display: flex; gap: 5px; align-items: center; color: #909090; font: 14px/22px 'Lato', sans-serif; }
	.rj-address-card > header > span img { width: 24px; height: 24px; }
	.rj-address-fields { display: flex; height: 604px; flex-direction: column; gap: 20px; margin-top: 30px; }
	.rj-address-fields label { display: flex; height: 84px; min-width: 0; flex-direction: column; gap: 10px; color: #303030; font: 500 16px/22px 'Lato', sans-serif; text-transform: capitalize; }
	.rj-address-fields label > b { font: inherit; }
	.rj-address-fields label em { color: #d73535; font-style: normal; }
	.rj-address-fields label > span { display: flex; box-sizing: border-box; height: 52px; gap: 10px; align-items: center; padding: 14px 10px; border: 1px solid #c2c2c2; border-radius: 5px; background: #fff; }
	.rj-address-fields label > span > img:not(.arrow) { width: 24px; height: 24px; flex: 0 0 24px; }
	.rj-address-fields .arrow { width: 22px; height: 22px; flex: 0 0 22px; }
	.rj-address-fields select { width: 100%; appearance: none; color: #404040; }
	.rj-existing-address-fields input[readonly] { cursor: default; }
	.rj-address-pair { display: grid; height: 84px; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; }
	.rj-address-card > footer { display: flex; box-sizing: border-box; height: 46px; align-items: flex-end; justify-content: space-between; margin-top: 30px; padding-top: 16px; border-top: 1px solid #dbdbdb; }
	.rj-address-card > footer button { border: 0; background: transparent; cursor: pointer; }
	.rj-address-card .different { display: flex; gap: 12px; align-items: center; padding: 0; color: #505050; font: 14px/22px 'Lato', sans-serif; }
	.rj-address-card .different img { width: 24px; height: 24px; }
	.rj-address-types { display: flex; gap: 15px; align-items: center; }
	.rj-address-types button { display: flex; gap: 5px; align-items: center; padding: 0; color: #828282; font: 500 16px/22px 'Lato', sans-serif; }
	.rj-address-types button.active { color: #202020; }
	.rj-address-types button img { width: 20px; height: 20px; }
	.rj-address-types i { width: 1px; height: 30px; background: #c2c2c2; }
	.rj-safe-info { display: flex; height: 30px; gap: 5px; align-items: center; margin-top: 12px; color: #848484; font: 14px/22px 'Lato', sans-serif; }
	.rj-safe-info img { width: 30px; height: 30px; }
	.rj-shipping-right { min-width: 0; }
	.rj-order-summary { display: flex; box-sizing: border-box; height: 708px; flex-direction: column; padding: 25px 30px; border-radius: 0 0 5px 5px; background: #fcfcfc; }
	.rj-order-card { display: flex; box-sizing: border-box; height: 584px; flex-direction: column; padding: 30px 26px 20px; border: 1px solid #c2c2c2; border-radius: 5px; background: #fff; }
	.rj-order-card h2 { margin: 0 0 54px; color: #404040; font: 600 22px/26px 'Lato', sans-serif; letter-spacing: normal; text-transform: capitalize; }
	.rj-order-date, .rj-order-prices p, .rj-order-total p { display: flex; align-items: center; justify-content: space-between; margin: 0; color: #505050; font: 14px/22px 'Lato', sans-serif; text-transform: capitalize; }
	.rj-order-date b, .rj-order-prices b, .rj-order-total b { color: #303030; font-weight: 600; }
	.rj-order-card > hr { width: 100%; margin: 20px 0; border: 0; border-top: 1px solid #c2c2c2; }
	.rj-order-prices { display: flex; flex-direction: column; gap: 10px; }
	.rj-order-prices + hr { margin: 24px 0 20px; }
	.rj-coupon-title { color: #303030; font: 16px/22px 'Lato', sans-serif; }
	.rj-shipping-coupon { display: flex; box-sizing: border-box; height: 60px; gap: 10px; align-items: center; margin-top: 10px; padding: 16px 15px; border: 1px solid #c2c2c2; border-radius: 5px; }
	.rj-shipping-coupon > img { width: 26px; height: 26px; }
	.rj-shipping-coupon input { font-size: 18px; }
	.rj-shipping-coupon button { padding: 0; border: 0; background: transparent; color: #00935c; font: 600 14px/22px 'Lato', sans-serif; cursor: pointer; white-space: nowrap; }
	.rj-order-total { display: flex; flex-direction: column; gap: 12px; margin-top: auto; }
	.rj-order-total .discount { color: #2fb3ff; }
	.rj-order-total .discount b { color: #2fb3ff; }
	.rj-order-total p:last-child { color: #303030; }
	.rj-shipping-process { width: 100%; height: 50px; flex: 0 0 50px; margin-top: 24px; border: 0; border-radius: 5px; background: #cca646; color: #fff; font: 500 16px/22px 'Lato', sans-serif; cursor: pointer; }
	.rj-shipping-process:disabled { opacity: .6; cursor: wait; }
	.rj-order-assurance { display: flex; height: 157px; flex-direction: column; gap: 26px; margin-top: 25px; }
	.rj-assurance-row { display: flex; height: 40px; align-items: center; justify-content: space-between; padding-inline: 12px; }
	.rj-assurance-row > div { display: flex; gap: 12px; align-items: center; }
	.rj-assurance-row > div > img { width: 40px; height: 40px; }
	.rj-assurance-row span { display: flex; min-width: 124px; flex-direction: column; gap: 4px; }
	.rj-assurance-row b { color: #000; font: 600 16px/18px 'Lato', sans-serif; }
	.rj-assurance-row small { color: #666; font: 12px/18px 'Sarala', sans-serif; }
	.rj-payment-brands { display: flex; box-sizing: border-box; height: 91px; flex-direction: column; gap: 10px; align-items: center; justify-content: center; border-radius: 4px; background: #f9f9f9; }
	.rj-payment-brands > div { display: flex; height: 27px; gap: 15px; align-items: center; }
	.rj-payment-brands img { object-fit: contain; }
	.rj-payment-brands img:nth-child(1) { width: 36px; height: 27px; }
	.rj-payment-brands img:nth-child(2) { width: 47px; height: 16px; }
	.rj-payment-brands img:nth-child(3) { width: 38px; height: 27px; }
	.rj-payment-brands img:nth-child(4) { width: 35px; height: 26px; }
	.rj-payment-brands img:nth-child(5) { width: 35px; height: 23px; }
	.rj-payment-brands img:nth-child(6) { width: 38px; height: 23px; }
	.rj-payment-brands p { margin: 0; color: #303030; font: 12px/24px 'Sarala', sans-serif; }
	.rj-payment-brands a { color: #a80139; font-family: 'Lato', sans-serif; font-weight: 700; text-decoration: none; }
	.rj-checkout-title { display: flex; height: 61px; align-items: center; justify-content: space-between; margin-top: 20px; }
	.rj-checkout-title > div { display: flex; gap: 15px; align-items: center; }
	.rj-checkout-title h1 { margin: 0; font: 700 20px/normal 'Lato', sans-serif; letter-spacing: normal; }
	.rj-checkout-title span { display: inline-flex; min-width: 60px; height: 24px; align-items: center; justify-content: center; padding-inline: 8px; border-radius: 15px; background: #f8f2e5; color: #cca646; font-size: 14px; }
	.rj-checkout-title small { color: #505050; font-size: 14px; }
	.rj-checkout-items { display: flex; flex-direction: column; gap: 20px; }
	.rj-checkout-item { display: flex; box-sizing: border-box; height: 170px; gap: 15px; padding: 10px; border: 1px solid #c2c2c2; border-radius: 7px; background: #fcfcfc; }
	.rj-checkout-image { display: block; width: 150px; height: 150px; flex: 0 0 150px; overflow: hidden; border-radius: 8px; background: rgb(232 232 232 / 20%); }
	.rj-checkout-image img { width: 100%; height: 100%; object-fit: contain; }
	.rj-checkout-details { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 15px; padding-block: 10px; }
	.rj-checkout-copy { display: flex; height: 80px; flex-direction: column; justify-content: space-between; }
	.rj-checkout-copy > div { display: flex; gap: 20px; align-items: center; justify-content: space-between; font-size: 20px; line-height: normal; text-transform: capitalize; }
	.rj-checkout-copy a { overflow: hidden; color: #202020; font-weight: 500; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
	.rj-checkout-copy strong { flex: 0 0 auto; font-weight: 700; }
	.rj-checkout-copy p { display: -webkit-box; width: 386px; max-width: 100%; margin: 0; overflow: hidden; color: #707070; font-size: 14px; line-height: 20px; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
	.rj-checkout-actions { display: flex; align-items: center; justify-content: space-between; }
	.rj-checkout-quantity { display: flex; box-sizing: border-box; height: 35px; gap: 15px; align-items: center; padding: 6px 11px; border: 1px solid #d5d5d5; border-radius: 4px; background: #fff; font: 14px/normal 'Sarala', sans-serif; }
	.rj-checkout-quantity button { display: grid; width: 15px; height: 15px; place-items: center; padding: 0; border: 0; background: transparent; cursor: pointer; }
	.rj-checkout-quantity img { width: 15px; height: 15px; }
	.rj-checkout-links { display: flex; gap: 16px; align-items: center; }
	.rj-checkout-links button { display: flex; gap: 7px; align-items: center; padding: 0; border: 0; background: transparent; color: #505050; font: 14px/20px 'Lato', sans-serif; cursor: pointer; white-space: nowrap; }
	.rj-checkout-links img { width: 18px; height: 18px; }
	.rj-checkout-links button:first-child img { width: 16px; height: 13px; }
	.rj-checkout-links .remove { color: #d73535; }
	.rj-checkout-links button:disabled, .rj-checkout-quantity button:disabled { opacity: .45; cursor: wait; }
	.rj-discount { position: relative; display: flex; box-sizing: border-box; height: 94px; align-items: center; justify-content: space-between; margin-top: 20px; padding: 14px 25px; overflow: hidden; border: 1px solid #c2c2c2; border-radius: 6px; background: linear-gradient(rgb(255 255 255 / 80%), rgb(255 255 255 / 80%)), url('/ryans-jewels/checkout/coupon-bg.png') center/cover; }
	.rj-discount-copy { display: flex; gap: 10px; align-items: center; }
	.rj-discount-icon { position: relative; display: grid; width: 66px; height: 66px; place-items: center; }
	.rj-discount-icon img:first-child { position: absolute; width: 66px; height: 66px; }
	.rj-discount-icon img:last-child { position: relative; width: 28px; height: 28px; }
	.rj-discount-copy > span:last-child { display: flex; flex-direction: column; gap: 5px; }
	.rj-discount-copy b { color: #202020; font-size: 15px; line-height: normal; }
	.rj-discount-copy small { color: #808080; font-size: 14px; line-height: normal; }
	.rj-discount > button { display: flex; height: 40px; gap: 6px; align-items: center; padding: 10px; border: 1px solid #bcbcbc; border-radius: 6px; background: rgb(255 255 255 / 40%); color: #555; font: 14px/normal 'Lato', sans-serif; cursor: pointer; }
	.rj-discount > button img { width: 20px; height: 20px; }
	.rj-checkout-summary { position: relative; display: flex; box-sizing: border-box; height: 708px; flex-direction: column; padding: 30px 30px 25px; border-radius: 0 0 5px 5px; background: #fcfcfc; }
	.rj-summary-account { display: flex; flex-direction: column; gap: 40px; }
	.rj-summary-intro { display: flex; flex-direction: column; gap: 20px; }
	.rj-summary-intro h2 { margin: 0; color: #404040; font: 700 22px/normal 'Lato', sans-serif; letter-spacing: normal; text-transform: capitalize; }
	.rj-summary-intro p { width: 457px; max-width: 100%; margin: 0; color: #505050; font-size: 16px; line-height: 22px; text-transform: capitalize; }
	.rj-login-fields { display: grid; gap: 10px; }
	.rj-login-fields label { color: #404040; font-size: 16px; line-height: 22px; }
	.rj-login-fields > div { display: flex; box-sizing: border-box; height: 52px; align-items: center; gap: 10px; padding: 14px 15px; border: 1px solid #c2c2c2; border-radius: 5px; background: #fff; }
	.rj-login-fields > div:first-of-type { margin-bottom: 10px; }
	.rj-login-fields > div > img { width: 24px; height: 24px; }
	.rj-login-fields input { min-width: 0; flex: 1; border: 0; outline: 0; background: transparent; color: #303030; font: 14px/22px 'Lato', sans-serif; }
	.rj-login-fields input::placeholder { color: #bdbdbd; }
	.rj-login-fields button { display: grid; width: 24px; height: 24px; place-items: center; padding: 0; border: 0; background: transparent; cursor: pointer; }
	.rj-login-fields button img { width: 24px; height: 24px; }
	.rj-login-fields > .rj-password-field { position: relative; }
	.rj-password-rules { position: absolute; z-index: 10; top: calc(100% + 4px); right: -31px; display: none; width: 296px; height: 135px; color: #303030; pointer-events: none; }
	.rj-password-eye:hover + .rj-password-rules, .rj-password-eye:focus-visible + .rj-password-rules { display: block; }
	.rj-password-rules-bg { position: absolute; top: -1.5px; left: -1.5px; width: 299px; height: 136.66px; filter: drop-shadow(-2px 20px 15px rgb(54 53 53 / 30%)); }
	.rj-password-rules p { position: absolute; margin: 0; white-space: nowrap; }
	.rj-password-rules-title { top: 40px; left: 12px; color: #222; font: 12px/normal 'Sarala', sans-serif; text-transform: capitalize; }
	.rj-password-rule { left: 12px; display: flex; gap: 5px; align-items: center; font: 11px/normal 'Lato', sans-serif; text-transform: capitalize; }
	.rj-password-rule img { width: 12px; height: 12px; }
	.rj-password-rule.rule-one { top: 66px; }
	.rj-password-rule.rule-two { top: 87px; color: #505050; }
	.rj-password-rule.rule-three { top: 108px; }
	.rj-checkout-summary > hr { width: 100%; margin: 25px 0 15px; border: 0; border-top: 1px solid #c2c2c2; }
	.rj-price-details { display: flex; flex-direction: column; gap: 10px; }
	.rj-price-details h3 { margin: 0; color: #303030; font: 500 16px/22px 'Lato', sans-serif; letter-spacing: normal; text-transform: capitalize; }
	.rj-price-details > div { display: flex; box-sizing: border-box; min-height: 191px; flex-direction: column; gap: 14px; padding: 18px 14px; border: 1px solid #c2c2c2; border-radius: 5px; background: #f9f9f9; }
	.rj-price-details p { display: flex; align-items: center; justify-content: space-between; margin: 0; color: #505050; font-size: 16px; line-height: 22px; text-transform: capitalize; }
	.rj-price-details b { font-weight: 600; }
	.rj-price-details .discount { color: #2fb3ff; }
	.rj-price-details hr { width: 100%; margin: 0; border: 0; border-top: 1px solid #c2c2c2; }
	.rj-price-details .total { color: #303030; font-weight: 700; }
	.rj-price-details .total b { font-weight: 700; }
	.rj-checkout-error { position: absolute; right: 30px; bottom: 82px; left: 30px; margin: 0; color: #d73535; font-size: 13px; }
	.rj-process { display: flex; width: 100%; min-height: 50px; align-items: center; justify-content: center; margin-top: 25px; padding: 14px; border: 0; border-radius: 5px; background: #cca646; color: #fff; font: 600 16px/22px 'Lato', sans-serif; cursor: pointer; }
	.rj-process:disabled { opacity: .6; cursor: wait; }
	.rj-checkout-loading, .rj-checkout-empty { display: flex; min-height: 708px; flex-direction: column; gap: 16px; align-items: center; justify-content: center; }
	.rj-checkout-empty a { color: #004ed5; }
	.rj-checkout-products { width: min(calc(100% - clamp(120px, 8.333vw, 160px)), 1760px); margin: 0 auto; }
	.rj-section-heading { height: 56px; }
	.rj-section-heading > div { display: grid; grid-template-columns: 65px auto minmax(0, 1fr); gap: 10px; align-items: center; height: 34px; }
	.rj-section-heading i { height: 2px; background: #a80139; }
	.rj-section-heading h2 { margin: 0; color: #202020; font: 600 28px/34px 'Lato', sans-serif; letter-spacing: normal; white-space: nowrap; }
	.rj-section-heading p { margin: 2px 0 0 7px; color: #5c5c5c; font: 12px/20px 'Sarala', sans-serif; }
	.rj-recommend-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(24px, 1.667vw, 32px); margin-top: 35px; padding-bottom: 16px; }
	.rj-recommend-card:nth-child(5) { display: none; }
	.rj-view-more { display: grid; height: 50px; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 10px; align-items: center; margin: 68px 4px 0; }
	.rj-view-more > i { height: 1px; background: #c2c2c2; }
	.rj-view-more a { display: flex; box-sizing: border-box; height: 50px; gap: 8px; align-items: center; justify-content: center; padding: 12px; border: 1px solid #c2c2c2; border-radius: 5px; color: #303030; font: 22px/26px 'Lato', sans-serif; text-decoration: none; }
	.rj-view-more img { width: 23px; height: 23px; }
	@media (min-width: 1600px) {
		.rj-recommend-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
		.rj-recommend-card:nth-child(5) { display: block; }
	}

	@media (max-width: 1100px) {
		.rj-checkout-grid, .rj-shipping-grid { width: calc(100% - 80px); grid-template-columns: minmax(0, 1fr); }
		.rj-checkout-summary { width: min(100%, 720px); }
		.rj-shipping-right { width: min(100%, 720px); }
		.rj-checkout-products { width: calc(100% - 80px); }
		.rj-recommend-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}

	@media (max-width: 700px) {
		.rj-checkout-grid, .rj-shipping-grid { width: calc(100% - 30px); }
		.rj-customer-card, .rj-address-card, .rj-order-summary { height: auto; }
		.rj-customer-fields { grid-template-columns: minmax(0, 1fr); }
		.rj-otp-field { grid-column: auto; }
		.rj-customer-actions { gap: 16px; align-items: flex-start; }
		.rj-customer-actions > div { gap: 10px; }
		.rj-saved-addresses { margin-inline: 0; }
		.rj-saved-address-card { flex-basis: min(294px, 100%); }
		.rj-address-fields { height: auto; }
		.rj-address-pair { height: auto; grid-template-columns: minmax(0, 1fr); }
		.rj-address-card > footer { height: auto; gap: 16px; align-items: flex-start; }
		.rj-address-types { margin-left: auto; }
		.rj-order-card { height: 584px; }
		.rj-order-summary { padding-inline: 15px; }
		.rj-assurance-row { height: auto; flex-wrap: wrap; gap: 20px; }
		.rj-order-assurance { height: auto; }
		.rj-checkout-products { width: calc(100% - 30px); }
		.rj-section-heading > div { grid-template-columns: 25px auto minmax(0, 1fr); gap: 6px; }
		.rj-section-heading h2 { font-size: 20px; line-height: 26px; }
		.rj-section-heading p { margin-left: 0; font-size: 10px; }
		.rj-recommend-grid { gap: 12px; }
		.rj-view-more { margin-top: 35px; }
		.rj-checkout-steps { gap: 7px; padding-left: 0; overflow-x: auto; font-size: 12px; }
		.rj-checkout-steps li { gap: 5px; }
		.rj-checkout-steps li[aria-hidden='true'] { font-size: 15px; }
		.rj-checkout-steps b { width: 28px; height: 28px; flex: 0 0 28px; }
		.rj-checkout-title h1 { font-size: 17px; }
		.rj-checkout-item { height: 154px; gap: 10px; padding: 8px; }
		.rj-checkout-image { width: 100px; height: 136px; flex-basis: 100px; }
		.rj-checkout-details { gap: 10px; padding-block: 4px; }
		.rj-checkout-copy { height: 82px; }
		.rj-checkout-copy > div { align-items: flex-start; gap: 8px; font-size: 14px; }
		.rj-checkout-copy a { white-space: normal; }
		.rj-checkout-copy strong { font-size: 13px; }
		.rj-checkout-copy p { font-size: 11px; line-height: 16px; }
		.rj-checkout-links { gap: 9px; }
		.rj-checkout-links button { font-size: 0; }
		.rj-checkout-links button::after { font-size: 11px; }
		.rj-checkout-links button:first-child::after { content: 'Wishlist'; }
		.rj-checkout-links .remove::after { content: 'Remove'; }
		.rj-discount { padding-inline: 12px; }
		.rj-discount-icon { width: 52px; height: 52px; }
		.rj-discount-icon img:first-child { width: 52px; height: 52px; }
		.rj-discount-copy small { display: none; }
		.rj-checkout-summary { height: auto; min-height: 708px; gap: 30px; justify-content: flex-start; padding-inline: 18px; }
	}
</style>
