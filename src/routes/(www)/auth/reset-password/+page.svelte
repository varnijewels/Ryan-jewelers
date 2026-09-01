<script lang="ts">
	import { page } from '$app/state'
	import { AlertCircle, ArrowLeft, CheckCircle2, LoaderIcon } from '@lucide/svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Input from '$lib/components/ui/input/input.svelte'
	import Label from '$lib/components/ui/label/label.svelte'
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card/index.js'
	import { authService } from '$lib/core/services/index.js'
	import { resetPasswordError } from '$lib/theme/ryans-jewels/auth-flow.js'
	import { toast } from 'svelte-sonner'

	let password = $state('')
	let confirmation = $state('')
	let error = $state('')
	let isLoading = $state(false)
	let success = $state(false)
	const token = $derived(page.url.searchParams.get('token') || '')
	const userId = $derived(page.url.searchParams.get('id') || '')
	const validLink = $derived(Boolean(token && userId))

	async function resetPassword(event: SubmitEvent) {
		event.preventDefault()
		if (isLoading) return
		error = resetPasswordError(token, userId, password, confirmation)
		if (error) return

		isLoading = true
		try {
			await authService.resetPassword({ userId, token, password })
			success = true
			toast.success('Password reset successfully')
		} catch (cause: any) {
			error = cause?.message || 'Unable to reset your password. The link may have expired.'
		} finally {
			isLoading = false
		}
	}
</script>

<svelte:head>
	<title>Reset Password | Ryan Jewelers</title>
	<meta name="description" content="Create a new password for your Ryan Jewelers account." />
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<Card class="mx-auto w-full max-w-md">
	<CardHeader>
		<CardTitle>Reset Password</CardTitle>
		<CardDescription>{success ? 'Your password has been updated.' : 'Enter a secure new password for your account.'}</CardDescription>
	</CardHeader>
	<CardContent>
		{#if success}
			<div class="space-y-4 text-center" role="status">
				<CheckCircle2 class="mx-auto h-10 w-10 text-green-600" />
				<p class="text-green-700">Your password was reset successfully. You can now sign in.</p>
				<Button href="/auth/login" class="w-full">Sign in</Button>
			</div>
		{:else}
			<form onsubmit={resetPassword}>
				<div class="space-y-4">
					<div class="space-y-2">
						<Label for="new-password">New Password</Label>
						<Input id="new-password" name="password" bind:value={password} type="password" autocomplete="new-password" minlength={8} required disabled={isLoading || !validLink} />
					</div>
					<div class="space-y-2">
						<Label for="confirm-password">Confirm Password</Label>
						<Input id="confirm-password" name="confirmation" bind:value={confirmation} type="password" autocomplete="new-password" minlength={8} required disabled={isLoading || !validLink} />
					</div>
					{#if error || !validLink}
						<div class="flex items-center space-x-2 text-red-600" role="alert">
							<AlertCircle size={16} />
							<span class="text-sm">{error || 'This password reset link is invalid or incomplete.'}</span>
						</div>
					{/if}
					<Button type="submit" class="w-full" disabled={isLoading || !validLink}>
						{#if isLoading}<LoaderIcon class="mr-2 h-4 w-4 animate-spin" />Resetting...{:else}Reset Password{/if}
					</Button>
				</div>
			</form>
		{/if}
	</CardContent>
	<CardFooter>
		<a href="/auth/login" class="flex items-center text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16} class="mr-2" />Back to Login</a>
	</CardFooter>
</Card>
