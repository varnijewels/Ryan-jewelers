<script lang="ts">
	/**
	 * Section 14 — "Create Your Signature Piece" enquiry form.
	 *
	 * Source frames
	 *   desktop 207:41979 (1440×700) · content inset 59 · two fields · 3 uploads
	 *   tablet  63:40742 (0,5608 · 744×605) — single column, marble plate
	 *   mobile  77:107636 (0,4565 · 412×613) — single column, full-width submit
	 *
	 * Submission reuses the app's existing `enquiryService.create` — the same
	 * call the product-page enquiry modal makes — so no new backend is invented.
	 * The source has one "Email & Mobile number" field, so the value is split
	 * into the service's `email` and `phone` arguments.
	 *
	 * The three upload wells are real file pickers with thumbnail previews. The
	 * enquiry API takes no attachments, so the chosen file names are appended to
	 * the message rather than being silently dropped.
	 */
	import { goto } from '$app/navigation'
	import { toast } from 'svelte-sonner'
	import { enquiryService } from '$lib/core/services'
	import RjDiamondCluster from './RjDiamondCluster.svelte'
	import { enquiry } from './home-content.js'

	let name = $state('')
	let contact = $state('')
	let description = $state('')
	let loading = $state(false)
	let files = $state<(File | null)[]>(Array(enquiry.uploadCount).fill(null))
	let previews = $state<(string | null)[]>(Array(enquiry.uploadCount).fill(null))

	const EMAIL = /[^\s,;]+@[^\s,;]+\.[^\s,;]+/
	const PHONE = /\+?\d[\d\s-]{7,}\d/

	function pickFile(index: number, event: Event) {
		const input = event.currentTarget as HTMLInputElement
		const file = input.files?.[0] ?? null
		const previous = previews[index]
		if (previous) URL.revokeObjectURL(previous)
		files[index] = file
		previews[index] = file ? URL.createObjectURL(file) : null
	}

	$effect(() => () => previews.forEach((url) => url && URL.revokeObjectURL(url)))

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault()
		if (loading) return

		const email = contact.match(EMAIL)?.[0] ?? ''
		const phone = contact.match(PHONE)?.[0]?.replace(/[\s-]/g, '') ?? ''
		if (!email && !phone) {
			toast.error('Please enter a valid email address or mobile number')
			return
		}

		const attached = files.filter(Boolean).map((file) => (file as File).name)
		const message = attached.length
			? `${description}\n\nAttached: ${attached.join(', ')}`
			: description

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
	<img class="rj-enq-plate" src={enquiry.background} alt="" aria-hidden="true" />

	<div class="rj-enq-inner">
		<div class="rj-enq-head">
			<span class="rj-enq-mark" aria-hidden="true">
				<img src={enquiry.logo} alt="" />
			</span>
			<span class="rj-enq-cluster">
				<RjDiamondCluster color="var(--rj-gold, #cca646)" width={43.5} />
			</span>
			<div class="rj-enq-head-text">
				<h2 class="rj-enq-title" id="rj-enq-heading">{enquiry.title}</h2>
				<p class="rj-enq-sub">{enquiry.subtitle}</p>
			</div>
		</div>

		<form class="rj-enq-form" onsubmit={handleSubmit} novalidate>
			<div class="rj-enq-row">
				<div class="rj-enq-field">
					<label class="rj-enq-label" for="rj-enq-name">
						<span class="rj-enq-req" aria-hidden="true">*</span>{enquiry.nameLabel}
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
						<span class="rj-enq-req" aria-hidden="true">*</span>{enquiry.contactLabel}
					</label>
					<input
						class="rj-enq-input"
						id="rj-enq-contact"
						name="contact"
						type="text"
						autocomplete="email"
						required
						placeholder={enquiry.contactPlaceholder}
						bind:value={contact}
					/>
				</div>
			</div>

			<div class="rj-enq-field">
				<label class="rj-enq-label" for="rj-enq-description">
					<span class="rj-enq-req" aria-hidden="true">*</span>{enquiry.descriptionLabel}
				</label>
				<textarea
					class="rj-enq-input rj-enq-textarea"
					id="rj-enq-description"
					name="description"
					required
					placeholder={enquiry.descriptionPlaceholder}
					bind:value={description}
				></textarea>
			</div>

			<div class="rj-enq-actions">
				<ul class="rj-enq-uploads">
					{#each files as file, i (i)}
						<li class="rj-enq-upload">
							<label class="rj-enq-well">
								<input
									class="rj-enq-file"
									type="file"
									accept="image/*"
									onchange={(event) => pickFile(i, event)}
								/>
								<span class="sr-only">{enquiry.uploadHint} {i + 1}</span>
								{#if previews[i]}
									<img class="rj-enq-thumb" src={previews[i]} alt={file?.name ?? ''} />
								{:else}
									<img class="rj-enq-add" src="/ryans-jewels/home/add.svg" alt="" aria-hidden="true" />
								{/if}
							</label>
						</li>
					{/each}
				</ul>

				<button class="rj-enq-submit" type="submit" disabled={loading} aria-busy={loading}>
					{#if loading}
						<span class="rj-enq-spinner" aria-hidden="true"></span>
					{/if}
					{enquiry.submitLabel}
				</button>
			</div>
		</form>
	</div>
</section>

<style>
	/* ---- shell ---------------------------------------------------------- */
	/* 207:41979 — full-width 700px marble plate with 51px vertical insets. */
	.rj-enq {
		position: relative;
		width: 100%;
		min-height: 700px;
		padding: 51px 0;
		background: #fff;
		overflow: hidden;
	}

	.rj-enq-plate {
		position: absolute;
		top: 50%;
		left: 50%;
		display: block;
		width: 700px;
		height: 100vw;
		max-width: none;
		object-fit: cover;
		transform: translate(-50%, -50%) rotate(-90deg);
	}

	.rj-enq-inner {
		position: relative;
		margin: 0 auto;
		padding: 0 59px;
	}

	/* ---- head ----------------------------------------------------------- */
	.rj-enq-head {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 52px;
	}

	/* 1:6427 — the logo cropped to the RJ mark, same transform as the header. */
	.rj-enq-mark {
		position: relative;
		display: block;
		width: 55px;
		height: 52px;
		flex-shrink: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.rj-enq-mark img {
		position: absolute;
		left: -59.69%;
		top: -39%;
		width: 206.72%;
		height: 221.3%;
		max-width: none;
	}

	.rj-enq-cluster {
		display: none;
	}

	.rj-enq-head-text {
		display: flex;
		flex-direction: column;
	}

	.rj-enq-title {
		margin: 0;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 32px;
		font-weight: 400;
		line-height: 38px;
		/* app.css tracks all h1–h6 at 0.8px; this source node has none. */
		letter-spacing: normal;
		color: var(--rj-heading, #202020);
	}

	.rj-enq-sub {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: 27px;
		color: var(--rj-gold, #cca646);
	}

	/* ---- form ----------------------------------------------------------- */
	.rj-enq-form {
		display: flex;
		flex-direction: column;
		gap: 25px;
	}

	/* 207:42020 — two equal columns with the source frame's 24px gutter. */
	.rj-enq-row {
		display: flex;
		gap: 24px;
	}

	.rj-enq-field {
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1 1 0;
		min-width: 0;
	}

	.rj-enq-label {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: 27px;
		color: var(--rj-ink, #404040);
	}

	.rj-enq-req {
		color: #ff0004;
	}

	/* 1:6457 — white, 1px #e1d6be, radius 5, 21/18 padding. */
	.rj-enq-input {
		width: 100%;
		/* 1:6457 is 63 tall: 18 + a 27 line + 18, with the rule drawn inside. */
		height: 63px;
		padding: 18px 21px;
		border: 1px solid var(--rj-rule, #e1d6be);
		border-radius: 5px;
		background: #fff;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: 27px;
		color: var(--rj-heading, #202020);
		transition: border-color 0.18s ease;
	}

	.rj-enq-input::placeholder {
		color: #c7c7c7;
	}

	.rj-enq-input:focus-visible {
		outline: none;
		border-color: var(--rj-gold, #cca646);
	}

	/* 207:42039 — 95 tall with 18px top and 50px bottom padding. */
	.rj-enq-textarea {
		height: 95px;
		padding-bottom: 50px;
		resize: vertical;
	}

	/*
	 * 1:6467 (y6585) then 1:6319 (y6725) — on desktop the submit sits *below*
	 * the upload wells, aligned to the right edge. Tablet puts them on one row.
	 */
	.rj-enq-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 40px;
		margin-top: 5px;
	}

	.rj-enq-uploads {
		align-self: flex-start;
	}

	.rj-enq-uploads {
		display: flex;
		align-items: center;
		gap: 20px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rj-enq-well {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100px;
		height: 100px;
		padding: 20px;
		border: 1px solid var(--rj-rule, #e1d6be);
		border-radius: 5px;
		background: #fff;
		cursor: pointer;
		overflow: hidden;
		transition: border-color 0.18s ease;
	}

	.rj-enq-well:hover,
	.rj-enq-well:focus-within {
		border-color: var(--rj-gold, #cca646);
	}

	.rj-enq-file {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}

	.rj-enq-add {
		width: 60px;
		height: 60px;
		flex-shrink: 0;
	}

	.rj-enq-thumb {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* 1:6319 — 151×52 gold rectangle, radius 2. */
	.rj-enq-submit {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 10px 30px;
		border: 0;
		border-radius: 2px;
		background: var(--rj-gold, #cca646);
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 24px;
		font-weight: 700;
		line-height: 32px;
		letter-spacing: 0.12px;
		color: #fff;
		cursor: pointer;
		white-space: nowrap;
		transition: filter 0.18s ease;
	}

	.rj-enq-submit:hover:not(:disabled) {
		filter: brightness(0.94);
	}

	.rj-enq-submit:disabled {
		cursor: progress;
		opacity: 0.85;
	}

	.rj-enq-spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(255, 255, 255, 0.4);
		border-top-color: #fff;
		border-radius: 50%;
		animation: rj-enq-spin 0.7s linear infinite;
	}

	@keyframes rj-enq-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 1279px) {
		.rj-enq-inner {
			padding: 0 40px;
		}
	}

	/* ---- tablet 744 (63:40742) ------------------------------------------ */
	@media (max-width: 1023px) {
		.rj-enq {
			min-height: 0;
			padding: 0;
		}

		.rj-enq-plate {
			inset: 0;
			width: 100%;
			height: 100%;
			max-width: 100%;
			object-fit: cover;
			transform: none;
		}

		.rj-enq-inner {
			max-width: 744px;
			padding: 60px 25px;
		}

		.rj-enq-head {
			margin-bottom: 25px;
		}

		/* the gold cluster replaces the logo mark below 1024 (63:40745) */
		.rj-enq-mark {
			display: none;
		}

		.rj-enq-cluster {
			display: block;
		}

		.rj-enq-title {
			font-size: 25px;
		}

		.rj-enq-sub {
			font-size: 14px;
		}

		.rj-enq-form {
			gap: 20px;
		}

		.rj-enq-row {
			flex-direction: column;
			gap: 20px;
		}

		.rj-enq-field {
			gap: 8px;
		}

		.rj-enq-label,
		.rj-enq-input {
			font-size: 14px;
		}

		.rj-enq-input {
			height: 55px;
			padding: 18px 21px;
		}

		/* 63:40770 — 18 top, one 27 line, 25 bottom. */
		.rj-enq-textarea {
			height: 72px;
			padding-bottom: 25px;
		}

		/* 63:40772 — wells and submit share one row on tablet. */
		.rj-enq-actions {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 20px;
			margin-top: 2px;
		}

		.rj-enq-uploads {
			align-self: auto;
		}

		.rj-enq-well {
			width: 48px;
			height: 48px;
			padding: 10px;
		}

		.rj-enq-add {
			width: 26px;
			height: 26px;
		}

		.rj-enq-submit {
			padding: 8px 24px;
			border-radius: 6px;
			font-size: 20px;
			font-weight: 400;
			letter-spacing: 0.1px;
		}
	}

	/* ---- mobile 412 (77:107636) ----------------------------------------- */
	@media (max-width: 639px) {
		.rj-enq-inner {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 40px 16px;
		}

		.rj-enq-head {
			margin-bottom: 20px;
		}

		/*
		 * The source keeps this on one line, but 25px Rozha One plus the cluster
		 * is wider than the 380 content box, so it wraps here instead of causing
		 * a horizontal scroll.
		 */
		.rj-enq-title {
			line-height: 32px;
		}

		.rj-enq-form {
			gap: 16px;
			width: 100%;
			max-width: 383px;
		}

		.rj-enq-row {
			gap: 16px;
		}

		/* 77:107666 — the wells stretch and the submit goes full width. */
		.rj-enq-actions {
			flex-direction: column;
			align-items: stretch;
			gap: 20px;
		}

		.rj-enq-uploads {
			width: 100%;
		}

		.rj-enq-upload {
			flex: 1 1 0;
			min-width: 0;
		}

		.rj-enq-well {
			width: 100%;
		}

		.rj-enq-submit {
			width: 100%;
			padding: 10px 24px;
			font-size: 18px;
			letter-spacing: 0.09px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-enq-spinner {
			animation-duration: 1.6s;
		}
	}
</style>
