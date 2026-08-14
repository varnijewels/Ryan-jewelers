<script lang="ts">
	import { LoaderIcon } from '@lucide/svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { toast } from 'svelte-sonner'
	import { getUserState } from '$lib/core/stores/index.js'
	import RyansJewelsAuthShell from '$lib/theme/ryans-jewels/RyansJewelsAuthShell.svelte'

	const userState = getUserState()
	let firstName = $state('')
	let lastName = $state('')
	let email = $state('')
	let password = $state('')
	let confirmPassword = $state('')
	let accepted = $state(false)
	let showPassword = $state(false)
	let isLoading = $state(false)
	const passwordsMismatch = $derived(confirmPassword.length > 0 && password !== confirmPassword)
	const passwordValid = $derived(password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password))

	function authHref(path: string) {
		const redirect = page.url.searchParams.get('redirect')
		return redirect ? `${path}?redirect=${encodeURIComponent(redirect)}` : path
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault()
		if (!passwordValid) return toast.error('Use 8+ characters with uppercase, lowercase, number and symbol')
		if (passwordsMismatch || password !== confirmPassword) return toast.error('Passwords do not match')
		if (!accepted) return toast.error('Please accept the Terms and Privacy Policy')
		isLoading = true
		try {
			const result = await userState.signup({ firstName, lastName, email, password, origin: page.url.origin })
			if (!result) return
			const redirect = page.url.searchParams.get('redirect')
			if (redirect && typeof sessionStorage !== 'undefined') sessionStorage.setItem('rj-auth-return-to', redirect)
			toast.success('Account created successfully')
			await goto(`/auth/signup/success?email=${encodeURIComponent(email)}`)
		} catch (error: any) {
			toast.error(error?.message || 'Unable to create your account')
		} finally {
			isLoading = false
		}
	}
</script>

<svelte:head>
	<title>Create Account | Ryan Jewelers</title>
	<meta name="description" content="Create your Ryan Jewelers account for saved jewelry, order updates and a faster secure checkout." />
</svelte:head>

<RyansJewelsAuthShell eyebrow="JOIN THE RYAN EXPERIENCE" title="Create your account" description="Save your favorites, track every order and enjoy a beautifully simple checkout.">
	<form class="rj-signup-form" onsubmit={handleSubmit} aria-label="Create account form">
		<div class="rj-name-row">
			<label><span>First name</span><input name="firstName" bind:value={firstName} autocomplete="given-name" minlength="2" placeholder="First name" required /></label>
			<label><span>Last name</span><input name="lastName" bind:value={lastName} autocomplete="family-name" minlength="2" placeholder="Last name" required /></label>
		</div>
		<label><span>Email address</span><input name="email" type="email" bind:value={email} autocomplete="email" placeholder="you@example.com" required /></label>
		<label>
			<span>Password</span>
			<div class="rj-password">
				<input name="password" type={showPassword ? 'text' : 'password'} bind:value={password} autocomplete="new-password" minlength="8" placeholder="Create a secure password" required />
				<button type="button" onclick={() => (showPassword = !showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
			</div>
		</label>
		<label><span>Confirm password</span><input class:error={passwordsMismatch} name="confirmPassword" type={showPassword ? 'text' : 'password'} bind:value={confirmPassword} autocomplete="new-password" minlength="8" placeholder="Repeat your password" required /></label>
		<div class="rj-password-note" class:valid={passwordValid && !passwordsMismatch}>
			<span>{passwordValid && !passwordsMismatch ? '✓' : '◇'}</span>
			{passwordsMismatch ? 'Your passwords do not match.' : 'Use 8+ characters with uppercase, lowercase, a number and a symbol.'}
		</div>
		<label class="rj-consent">
			<input type="checkbox" bind:checked={accepted} required />
			<span>I agree to the <a href="/terms-and-conditions">Terms & Conditions</a> and <a href="/privacy-policy">Privacy Policy</a>.</span>
		</label>
		<button class="rj-auth-submit" type="submit" disabled={isLoading || !accepted || !passwordValid || password !== confirmPassword}>
			{#if isLoading}<LoaderIcon size={18} class="spin" />{/if}
			{isLoading ? 'Creating your account...' : 'Create account'}
		</button>
	</form>

	<div class="rj-auth-divider"><span>Already have an account?</span></div>
	<a class="rj-auth-secondary" href={authHref('/auth/login')}>Sign in</a>
</RyansJewelsAuthShell>

<style>
	.rj-signup-form { display: flex; flex-direction: column; gap: 12px; }
	.rj-name-row { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; }
	.rj-signup-form label { display: flex; flex-direction: column; gap: 6px; color: #3e3b35; font: 600 12px/18px 'Lato', sans-serif; }
	.rj-signup-form input { box-sizing: border-box; width: 100%; height: 47px; padding: 0 13px; border: 1px solid #dcd6ca; border-radius: 6px; outline: 0; background: #fff; color: #262520; font: 400 14px 'Lato', sans-serif; transition: border-color .15s, box-shadow .15s; }
	.rj-signup-form input:focus { border-color: #c59b32; box-shadow: 0 0 0 3px rgba(197, 155, 50, .13); }
	.rj-signup-form input.error { border-color: #b84f61; }
	.rj-signup-form input::placeholder { color: #aaa49a; }
	.rj-password { position: relative; }
	.rj-password input { padding-right: 62px; }
	.rj-password button { position: absolute; top: 0; right: 3px; height: 47px; padding: 0 12px; border: 0; background: transparent; color: #a67e1f; font: 600 11px 'Lato', sans-serif; cursor: pointer; }
	.rj-password-note { display: flex; align-items: flex-start; gap: 8px; padding: 9px 11px; border-radius: 5px; background: #f8f5ef; color: #7c7569; font-size: 10px; line-height: 1.5; }
	.rj-password-note > span { color: #b28a28; font-size: 13px; }
	.rj-password-note.valid { background: #f4f8f2; color: #61705d; }
	.rj-password-note.valid > span { color: #66835e; }
	.rj-consent { display: grid !important; align-items: start; color: #817b71 !important; font-weight: 400 !important; font-size: 10px !important; line-height: 1.55 !important; grid-template-columns: 17px 1fr; }
	.rj-consent input { width: 15px; height: 15px; margin-top: 1px; accent-color: #c69e38; }
	.rj-consent a { color: #665e51; }
	.rj-auth-submit, .rj-auth-secondary { display: flex; box-sizing: border-box; width: 100%; min-height: 49px; align-items: center; justify-content: center; gap: 9px; border-radius: 6px; font: 600 14px 'Sarala', sans-serif; text-decoration: none; cursor: pointer; }
	.rj-auth-submit { border: 1px solid #c9a23f; background: #d3ab42; color: #fff; box-shadow: 0 8px 20px rgba(193, 148, 35, .2); }
	.rj-auth-submit:hover:not(:disabled) { background: #bd932d; }
	.rj-auth-submit:disabled { cursor: wait; opacity: .62; }
	.rj-auth-secondary { border: 1px solid #bdb6aa; background: #fff; color: #37342e; }
	.rj-auth-secondary:hover { border-color: #c49a32; color: #9c7416; }
	.rj-auth-divider { display: flex; align-items: center; gap: 12px; margin: 17px 0 11px; color: #938d83; font-size: 11px; }
	.rj-auth-divider::before, .rj-auth-divider::after { height: 1px; flex: 1; background: #e6e0d6; content: ''; }
	.rj-auth-divider span { white-space: nowrap; }
	:global(.spin) { animation: rj-spin .8s linear infinite; }
	@keyframes rj-spin { to { transform: rotate(360deg); } }
	@media (max-width: 420px) { .rj-name-row { grid-template-columns: 1fr; } }
</style>
