<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import RyansJewelsAuthShell from '$lib/theme/ryans-jewels/RyansJewelsAuthShell.svelte'

	let returnTo = $state('')
	const email = $derived(page.url.searchParams.get('email') || 'your email address')
	const loginHref = $derived(returnTo ? `/auth/login?redirect=${encodeURIComponent(returnTo)}` : '/auth/login')

	onMount(() => {
		returnTo = sessionStorage.getItem('rj-auth-return-to') || ''
	})
</script>

<svelte:head>
	<title>Verify Your Email | Ryan Jewelers</title>
	<meta name="description" content="Verify your email to complete your Ryan Jewelers registration." />
</svelte:head>

<RyansJewelsAuthShell eyebrow="ONE LAST STEP" title="Check your inbox" description="Your Ryan Jewelers account has been created successfully.">
	<div class="rj-success">
		<div class="rj-success-icon" aria-hidden="true">✓</div>
		<h2>Verify your email address</h2>
		<p>We sent a verification link to <strong>{email}</strong>. Open the email and select the verification link to activate your account.</p>
		<div class="rj-success-note"><span>◇</span><p>Can't find it? Please check your spam or promotions folder.</p></div>
		<a class="rj-success-button" href={loginHref}>Continue to sign in</a>
		<a class="rj-success-home" href="/">Return to store</a>
	</div>
</RyansJewelsAuthShell>

<style>
	.rj-success { text-align: center; }
	.rj-success-icon { display: grid; width: 62px; height: 62px; margin: 0 auto 18px; place-items: center; border: 1px solid #d6b45e; border-radius: 50%; background: #fff9ea; color: #b4861b; font: 500 25px 'Sarala', sans-serif; box-shadow: 0 8px 22px rgba(185, 139, 28, .12); }
	.rj-success h2 { margin: 0 0 8px; color: #34312b; font: 500 18px/1.4 'Sarala', sans-serif; }
	.rj-success > p { margin: 0 auto; color: #746f65; font-size: 13px; line-height: 1.7; }
	.rj-success strong { color: #3e3a32; overflow-wrap: anywhere; }
	.rj-success-note { display: flex; gap: 10px; align-items: center; margin: 22px 0; padding: 13px; border: 1px solid #ece5d8; border-radius: 6px; background: #faf8f3; color: #7e786e; text-align: left; }
	.rj-success-note span { color: #bd932d; font-size: 20px; }
	.rj-success-note p { margin: 0; font-size: 11px; line-height: 1.5; }
	.rj-success-button { display: flex; min-height: 50px; align-items: center; justify-content: center; border-radius: 6px; background: #d3ab42; color: #fff; font: 600 14px 'Sarala', sans-serif; text-decoration: none; box-shadow: 0 8px 20px rgba(193, 148, 35, .2); }
	.rj-success-button:hover { background: #bd932d; }
	.rj-success-home { display: inline-block; margin-top: 17px; color: #777064; font-size: 12px; text-decoration: none; }
	.rj-success-home:hover { color: #a77e1f; text-decoration: underline; }
</style>
