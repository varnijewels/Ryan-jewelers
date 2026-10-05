<script lang="ts">
	import { goto } from '$app/navigation'
	import { toast } from 'svelte-sonner'
	import { enquiryService } from '$lib/core/services'
	import { ryanContact } from './contact-content.js'
	import { enquiry } from './home-content.js'

	let name = $state('')
	let contact = $state('')
	let description = $state('')
	let loading = $state(false)

	const EMAIL = /[^\s,;]+@[^\s,;]+\.[^\s,;]+/
	const PHONE = /\+?\d[\d\s-]{7,}\d/

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault()
		if (loading) return

		const email = contact.match(EMAIL)?.[0] ?? ''
		const phone = contact.match(PHONE)?.[0]?.replace(/[\s-]/g, '') ?? ''
		if (!email && !phone) {
			toast.error('Please enter a valid email address or mobile number')
			return
		}

		const message = description

		try {
			loading = true
			await enquiryService.create({ name, email, phone, message, productId: '' })
			toast.success(enquiry.successMessage)
			await goto('/enquiry/success')
		} catch (error: any) {
			toast.error(error?.message || 'Failed to submit enquiry')
		} finally {
			loading = false
		}
	}
</script>

<section class="rj-enq" aria-labelledby="rj-enq-heading">

	<div class="rj-enq-inner">
		<div class="rj-enq-story">
			<p class="rj-enq-eyebrow">CUSTOM DESIGN</p>
			<h2 id="rj-enq-heading">Have a design in mind?</h2>
			<p class="rj-enq-intro">Tell us what you'd like to create. Our Salisbury team will get in touch to talk through the design, stones, and setting.</p>
			<img class="rj-enq-store" src="/ryans-jewels/store/store-interior.webp" alt="Jewelry displays inside our Salisbury store" loading="lazy" width="700" height="560" />
			<p class="rj-enq-call">Prefer to talk in person? <a href="/contact-us">Visit our store</a> or call <a href={ryanContact.phoneHref}>{ryanContact.phone}</a>.</p>
		</div>

		<form class="rj-enq-form" onsubmit={handleSubmit}>
			<div class="rj-enq-form-head"><h3>Tell us about your idea</h3><span>We'll contact you to discuss the next steps.</span></div>
			<div class="rj-enq-row">
				<div class="rj-enq-field">
					<label class="rj-enq-label" for="rj-enq-name">
						<span class="rj-enq-req" aria-hidden="true">*</span>Your name
					</label>
					<input
						class="rj-enq-input"
						id="rj-enq-name"
						name="name"
						type="text"
						autocomplete="given-name"
						required
						placeholder={enquiry.namePlaceholder}
						bind:value={name}
					/>
				</div>

				<div class="rj-enq-field">
					<label class="rj-enq-label" for="rj-enq-contact">
						<span class="rj-enq-req" aria-hidden="true">*</span>Email or phone number
					</label>
					<input
						class="rj-enq-input"
						id="rj-enq-contact"
						name="contact"
						type="text"
						autocomplete="email"
						required
						placeholder="Email address or phone number"
						bind:value={contact}
					/>
				</div>
			</div>

			<div class="rj-enq-field">
				<label class="rj-enq-label" for="rj-enq-description">
					<span class="rj-enq-req" aria-hidden="true">*</span>What would you like to create?
				</label>
				<textarea
					class="rj-enq-input rj-enq-textarea"
					id="rj-enq-description"
					name="description"
					required
					placeholder="A ring, a pendant, a gift - tell us about the style and occasion."
					bind:value={description}
				></textarea>
			</div>

			<div class="rj-enq-actions">

				<button class="rj-enq-submit" type="submit" disabled={loading} aria-busy={loading}>
					{#if loading}
						<span class="rj-enq-spinner" aria-hidden="true"></span>
					{/if}
					{loading ? 'Sending...' : 'Send enquiry'}
				</button>
			</div>
		</form>
	</div>
</section>

<style>
 .rj-enq { padding: 40px 48px 60px; background: #fff; color: #353535; }
 .rj-enq-inner { max-width: 1344px; margin: auto; display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #eae6dd; }
 .rj-enq-story { padding: 38px 40px 28px; background: #f8f7f3; }
 .rj-enq-eyebrow { font-size: 10px; letter-spacing: 2px; color: #9a7d3c; margin: 0 0 18px; }
 h2 { font: 48px/1.05 'Libre Baskerville', serif; margin: 0 0 18px; }
 .rj-enq-intro { font-size: 13px; line-height: 1.8; color: #777; max-width: 440px; margin: 0; }
 .rj-enq-form { padding: 38px 40px; display: flex; flex-direction: column; gap: 24px; justify-content: center; }
 .rj-enq-form-head p { font-size: 9px; letter-spacing: 1.6px; color: #9a7d3c; margin: 0 0 10px; }
 h3 { font: 30px/1.15 'Libre Baskerville', serif; margin: 0 0 9px; }
 .rj-enq-form-head > span { color: #888; font-size: 12px; }
 .rj-enq-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
 .rj-enq-field { display: flex; flex-direction: column; gap: 9px; min-width: 0; }
 .rj-enq-label { font-size: 11px; color: #555; }
 .rj-enq-req { color: #b1985d; margin-right: 4px; }
 .rj-enq-input { box-sizing: border-box; width: 100%; border: 1px solid #e4e0d8; background: #fff; border-radius: 3px; padding: 13px; font: 12px/1.5 Lato, sans-serif; color: #333; }
 .rj-enq-input::placeholder { color: #a0a0a0; }
 .rj-enq-input:focus { outline: 1px solid var(--rj-gold); border-color: var(--rj-gold); }
 .rj-enq-textarea { min-height: 130px; resize: vertical; }
 .rj-enq-submit { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 46px; background: var(--rj-gold, #cca646); color: white; border: 0; border-radius: 3px; font-size: 12px; cursor: pointer; transition: background 150ms; }
 .rj-enq-submit:hover { background: #b69238; }
 .rj-enq-submit:disabled { opacity: .6; cursor: wait; }
 .rj-enq-submit:focus-visible { outline: 2px solid #8c6c29; outline-offset: 4px; }
 .rj-enq-spinner { width: 14px; height: 14px; border: 2px solid #ffffff66; border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
 @keyframes spin { to { transform: rotate(360deg); } }
 @media (max-width: 1000px) { .rj-enq { padding-inline: 25px; } .rj-enq-story, .rj-enq-form { padding: 30px 25px; } h2 { font-size: 39px; } .rj-enq-row { grid-template-columns: 1fr; } }
 @media (max-width: 639px) { .rj-enq { padding: 24px 16px; } .rj-enq-inner { grid-template-columns: 1fr; } .rj-enq-form { gap: 22px; } }
 .rj-enq { padding-top: 35px; padding-bottom: 50px; }
 .rj-enq-inner { border: 0; grid-template-columns: 1fr 1fr; gap: 70px; border-top: 1px solid #e9e5dc; padding-top: 40px; }
 .rj-enq-story { background: white; padding: 0; }
 .rj-enq-eyebrow { letter-spacing: 1px; margin-bottom: 14px; }
 .rj-enq-intro { max-width: 480px; font-size: 14px; line-height: 1.7; }
 .rj-enq-store { display: block; width: 100%; height: 210px; object-fit: cover; object-position: center 65%; margin: 25px 0 16px; }
 .rj-enq-call { font-size: 12px; line-height: 1.7; color: #666; margin: 0; }
 .rj-enq-call a { color: #444; text-underline-offset: 3px; }
 .rj-enq-form { padding: 0; gap: 24px; }
 .rj-enq-form-head h3 { font-size: 20px; }
 .rj-enq-input { background: #fdfcfa; font-size: 14px; border-radius: 0; }
 .rj-enq-label { font-size: 13px; }
 .rj-enq-textarea { min-height: 155px; }
 .rj-enq-submit { width: auto; min-width: 170px; padding-inline: 25px; border-radius: 0; font-size: 13px; }
 @media (max-width: 1000px) { .rj-enq-inner { gap: 35px; } }
 @media (max-width: 639px) { .rj-enq-inner { grid-template-columns: 1fr; gap: 30px; padding-top: 30px; } .rj-enq-store { height: 175px; } .rj-enq-submit { width: 100%; } }
</style>
