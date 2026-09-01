<script lang="ts">
	import { LoaderIcon, Mail, Phone } from '@lucide/svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { toast } from 'svelte-sonner'
	import { LoginModule } from '$lib/core/composables/index.js'
	import { authService } from '$lib/core/services/index.js'
	import { normalizePhone } from '$lib/theme/ryans-jewels/auth-flow.js'
	import RyansJewelsAuthShell from '$lib/theme/ryans-jewels/RyansJewelsAuthShell.svelte'

	const loginModule = new LoginModule()
	const userState = loginModule.userState
	let showPassword = $state(false)
	let resending = $state(false)

	function redirectTarget() {
		const stored = typeof sessionStorage === 'undefined' ? '' : sessionStorage.getItem('rj-auth-return-to') || ''
		const requested = page.url.searchParams.get('redirect') || stored
		try {
			const decoded = decodeURIComponent(requested)
			return decoded.startsWith('/') && !decoded.startsWith('//') ? decoded : '/my'
		} catch {
			return '/my'
		}
	}

	function authHref(path: string) {
		const redirect = page.url.searchParams.get('redirect')
		return redirect ? `${path}?redirect=${encodeURIComponent(redirect)}` : path
	}

	async function finishLogin() {
		if (!userState.user) return
		if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('rj-auth-return-to')
		await goto(redirectTarget(), { replaceState: true, invalidateAll: true })
	}

	async function handleLogin(event: SubmitEvent) {
		if (loginModule.isPhoneNumber) {
			event.preventDefault()
			const phone = normalizePhone(loginModule.identifier, page.data.store?.storeCountry?.dialCode || '+91')
			if (!/^\+[1-9]\d{7,14}$/.test(phone)) return toast.error('Please enter a valid phone number')
			loginModule.identifier = phone
			loginModule.isLoading = true
			try {
				await authService.getOtp({ phone })
				loginModule.step = 2
			} catch (error: any) {
				toast.error(error?.message || 'Unable to send the verification code')
			} finally {
				loginModule.isLoading = false
			}
			return
		}

		event.preventDefault()
		loginModule.isLoading = true
		try {
			const user = await authService.login({
				email: loginModule.identifier,
				password: loginModule.password,
				cartId: loginModule.cartState?.cart?.id
			})
			if (!user) return
			userState.user = user
			void loginModule.cartState?.updateEmail({ email: loginModule.identifier }).catch(() => undefined)
			loginModule.wishlistState.setState()
			await finishLogin()
		} catch (error: any) {
			toast.error(error?.message || 'Login failed')
		} finally {
			loginModule.isLoading = false
		}
	}

	async function verifyOtp(event: SubmitEvent) {
		event.preventDefault()
		if (loginModule.isLoading) return
		loginModule.isLoading = true
		try {
			const user = await authService.verifyOtp({ phone: loginModule.identifier, otp: loginModule.otp })
			if (!user) return
			userState.user = user
			loginModule.wishlistState.setState()
			await finishLogin()
		} catch (error: any) {
			toast.error(error?.message || 'The verification code is invalid or expired')
		} finally {
			loginModule.isLoading = false
		}
	}

	async function resendOtp() {
		if (resending) return
		resending = true
		try {
			await authService.getOtp({ phone: loginModule.identifier })
			toast.success('A new verification code has been sent')
		} catch (error: any) {
			toast.error(error?.message || 'Unable to resend the code')
		} finally {
			resending = false
		}
	}
</script>

<svelte:head>
	<title>Sign In | Ryan Jewelers</title>
	<meta name="description" content="Sign in to your Ryan Jewelers account for faster checkout, saved jewelry and order tracking." />
</svelte:head>

<RyansJewelsAuthShell eyebrow="WELCOME BACK" title={loginModule.step === 2 ? 'Verify your number' : 'Sign in to your account'} description={loginModule.step === 2 ? `Enter the 4-digit code sent to ${loginModule.identifier}.` : 'Continue to your saved jewelry, orders and a faster checkout experience.'}>
	{#if loginModule.step === 1}
		{#if !page.data.store?.loginType || page.data.store.loginType === 'BOTH'}
			<div class="rj-auth-switch" aria-label="Choose a sign in method">
				<button type="button" class:active={loginModule.isPhoneNumber} onclick={() => !loginModule.isPhoneNumber && loginModule.switchLoginType()}><Phone size={16} />Phone</button>
				<button type="button" class:active={!loginModule.isPhoneNumber} onclick={() => loginModule.isPhoneNumber && loginModule.switchLoginType()}><Mail size={16} />Email</button>
			</div>
		{/if}

		<form class="rj-auth-form" onsubmit={handleLogin} aria-label="Sign in form">
			<label>
				<span>{loginModule.isPhoneNumber ? 'Phone number' : 'Email address'}</span>
				<input name="identifier" type={loginModule.isPhoneNumber ? 'tel' : 'email'} bind:value={loginModule.identifier} placeholder={loginModule.isPhoneNumber ? '+91 98765 43210' : 'you@example.com'} autocomplete={loginModule.isPhoneNumber ? 'tel' : 'email'} required />
			</label>

			{#if !loginModule.isPhoneNumber}
				<label>
					<span>Password</span>
					<div class="rj-password">
						<input name="password" type={showPassword ? 'text' : 'password'} bind:value={loginModule.password} placeholder="Enter your password" autocomplete="current-password" minlength="8" required />
						<button type="button" onclick={() => (showPassword = !showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
					</div>
				</label>
				<a class="rj-forgot" href={authHref('/auth/forgot-password')}>Forgot password?</a>
			{/if}

			<button class="rj-auth-submit" type="submit" disabled={loginModule.isLoading || userState.loading}>
				{#if loginModule.isLoading || userState.loading}<LoaderIcon size={18} class="spin" />{/if}
				{loginModule.isLoading || userState.loading ? 'Please wait...' : loginModule.isPhoneNumber ? 'Send verification code' : 'Sign in'}
			</button>
		</form>

		<div class="rj-auth-divider"><span>New to Ryan Jewelers?</span></div>
		<a class="rj-auth-secondary" href={authHref('/auth/signup')}>Create your account</a>
	{:else}
		<form class="rj-auth-form" onsubmit={verifyOtp} aria-label="Verify phone number">
			<label>
				<span>Verification code</span>
				<input class="rj-otp" name="otp" type="text" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" bind:value={loginModule.otp} placeholder="0000" autocomplete="one-time-code" required />
			</label>
			<button class="rj-auth-submit" type="submit" disabled={loginModule.otp.length !== 4 || loginModule.isLoading || userState.loading}>
				{#if loginModule.isLoading || userState.loading}<LoaderIcon size={18} class="spin" />{/if}
				{loginModule.isLoading || userState.loading ? 'Verifying...' : 'Verify & continue'}
			</button>
		</form>
		<div class="rj-otp-actions">
			<button type="button" onclick={() => { loginModule.step = 1; loginModule.otp = '' }}>Change number</button>
			<button type="button" disabled={resending} onclick={resendOtp}>{resending ? 'Sending...' : 'Resend code'}</button>
		</div>
	{/if}

	<p class="rj-auth-terms">By continuing, you agree to our <a href="/terms-and-conditions">Terms</a> and <a href="/privacy-policy">Privacy Policy</a>.</p>
</RyansJewelsAuthShell>

<style>
	.rj-auth-switch { display: grid; gap: 5px; margin-bottom: 20px; padding: 5px; border: 1px solid #e8e1d4; border-radius: 8px; background: #f7f4ee; grid-template-columns: 1fr 1fr; }
	.rj-auth-switch button { display: flex; min-height: 42px; align-items: center; justify-content: center; gap: 8px; border: 0; border-radius: 6px; background: transparent; color: #756f65; font: 600 13px 'Lato', sans-serif; cursor: pointer; }
	.rj-auth-switch button.active { background: #fff; color: #282722; box-shadow: 0 2px 10px rgba(45, 38, 25, .08); }
	.rj-auth-form { display: flex; flex-direction: column; gap: 16px; }
	.rj-auth-form label { display: flex; flex-direction: column; gap: 7px; color: #3e3b35; font: 600 12px/18px 'Lato', sans-serif; }
	.rj-auth-form input { box-sizing: border-box; width: 100%; height: 50px; padding: 0 14px; border: 1px solid #dcd6ca; border-radius: 6px; outline: 0; background: #fff; color: #262520; font: 400 14px 'Lato', sans-serif; transition: border-color .15s, box-shadow .15s; }
	.rj-auth-form input:focus { border-color: #c59b32; box-shadow: 0 0 0 3px rgba(197, 155, 50, .13); }
	.rj-auth-form input::placeholder { color: #aaa49a; }
	.rj-password { position: relative; }
	.rj-password input { padding-right: 62px; }
	.rj-password button { position: absolute; top: 0; right: 3px; height: 50px; padding: 0 12px; border: 0; background: transparent; color: #a67e1f; font: 600 11px 'Lato', sans-serif; cursor: pointer; }
	.rj-forgot { align-self: flex-end; margin-top: -8px; color: #756c5d; font-size: 12px; text-decoration: none; }
	.rj-forgot:hover { color: #af8420; text-decoration: underline; }
	.rj-auth-submit, .rj-auth-secondary { display: flex; box-sizing: border-box; width: 100%; min-height: 50px; align-items: center; justify-content: center; gap: 9px; border-radius: 6px; font: 600 14px 'Sarala', sans-serif; text-decoration: none; cursor: pointer; }
	.rj-auth-submit { margin-top: 2px; border: 1px solid #c9a23f; background: #d3ab42; color: #fff; box-shadow: 0 8px 20px rgba(193, 148, 35, .2); }
	.rj-auth-submit:hover:not(:disabled) { background: #bd932d; }
	.rj-auth-submit:disabled { cursor: wait; opacity: .62; }
	.rj-auth-secondary { border: 1px solid #bdb6aa; background: #fff; color: #37342e; }
	.rj-auth-secondary:hover { border-color: #c49a32; color: #9c7416; }
	.rj-auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0 12px; color: #938d83; font-size: 11px; }
	.rj-auth-divider::before, .rj-auth-divider::after { height: 1px; flex: 1; background: #e6e0d6; content: ''; }
	.rj-auth-divider span { white-space: nowrap; }
	.rj-auth-terms { margin: 18px 0 0; color: #969087; font-size: 10px; line-height: 1.7; text-align: center; }
	.rj-auth-terms a { color: #6b6458; }
	.rj-otp { font: 500 24px/1 'Sarala', sans-serif !important; letter-spacing: 12px; text-align: center; }
	.rj-otp-actions { display: flex; justify-content: space-between; margin-top: 16px; }
	.rj-otp-actions button { min-height: 36px; padding: 0; border: 0; background: transparent; color: #9b741b; font: 600 12px 'Lato', sans-serif; cursor: pointer; }
	.rj-otp-actions button:disabled { opacity: .55; }
	:global(.spin) { animation: rj-spin .8s linear infinite; }
	@keyframes rj-spin { to { transform: rotate(360deg); } }
</style>
