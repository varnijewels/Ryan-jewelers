<script lang="ts">
	/**
	 * Ryan Jewelers footer.
	 *
	 * Source frames
	 *   desktop 1:6335 — USP strip 1:6338 (five items split by 1×130 rules),
	 *           columns 1:6379, gold legal bar 1:6416
	 *   tablet  63:40969 — USPs wrap 3 + 2, newsletter input goes full width
	 *   mobile  77:107710 — USPs wrap 2 + 2 + 1, legal bar centres over two rows
	 *
	 * Copy and links come from ./footer-content.ts. The newsletter form is live
	 * app logic — it goes through the shared `NewsletterRenderer`, the same
	 * composable the stock footer uses, so nothing is reimplemented here.
	 */
	import { NewsletterRenderer } from '$lib/core/composables/index.js'
	import { ryansJewelsFooter } from './footer-content.js'

	let {
		description = ryansJewelsFooter.description,
		brandName = ryansJewelsFooter.brandName
	}: { description?: string; brandName?: string } = $props()

	let email = $state('')
	let agreed = $state(false)

	const { logo, usps, columns, newsletter, legal } = ryansJewelsFooter
</script>

<footer class="rj-foot">
	<div class="rj-foot-main">
		<div class="rj-foot-inner">
			<div class="rj-foot-usps">
				<ul class="rj-foot-usp-row">
					{#each usps as usp (usp.key)}
						<li
							class="rj-foot-usp"
							style="--w:{usp.width}px; --tw:{usp.titleWidth}px; --gap:{usp.iconGap}px"
						>
							<span class="rj-foot-usp-head">
								{#if usp.icon === 'verify'}
									<span class="rj-foot-verify" aria-hidden="true">
										<img src="/ryans-jewels/footer/verify-ring.svg" alt="" />
										<span>%</span>
									</span>
								{:else}
									<img
										class="rj-foot-usp-icon"
										src={usp.icon}
										alt=""
										aria-hidden="true"
										style="width:{usp.iconWidth}px; height:{usp.iconHeight}px"
									/>
								{/if}
								<span class="rj-foot-usp-title">{usp.title}</span>
							</span>
							<span class="rj-foot-usp-text">{usp.text}</span>
						</li>
					{/each}
				</ul>
			</div>

			<div class="rj-foot-cols">
				<div class="rj-foot-left">
					<div class="rj-foot-brand">
						<a class="rj-foot-brand-link" href="/">
							<span class="rj-foot-mark" aria-hidden="true"><img src={logo} alt="" /></span>
							<span class="rj-foot-brand-name">{brandName}</span>
						</a>
						<p class="rj-foot-brand-text">{description}</p>
					</div>

					{#each columns as column (column.title)}
						<nav
							class="rj-foot-nav"
							style="--w:{column.width}px; --gap:{column.gap}px"
							aria-label={column.title}
						>
							<h2 class="rj-foot-nav-title">{column.title}</h2>
							<ul class="rj-foot-nav-list">
								{#each column.links as link (link.href + link.label)}
									<li><a class="rj-foot-link" href={link.href}>{link.label}</a></li>
								{/each}
							</ul>
						</nav>
					{/each}
				</div>

				<NewsletterRenderer bind:email>
					{#snippet content({ loadingForSubmitting, subscribeToNewsletter })}
						<div class="rj-foot-news">
							<div class="rj-foot-news-block">
								<h2 class="rj-foot-news-title">{newsletter.title}</h2>
								<form
									class="rj-foot-news-form"
									onsubmit={(event) => {
										event.preventDefault()
										subscribeToNewsletter()
									}}
								>
									<label class="sr-only" for="rj-foot-email">{newsletter.placeholder}</label>
									<input
										class="rj-foot-news-input"
										id="rj-foot-email"
										type="email"
										autocomplete="email"
										required
										placeholder={newsletter.placeholder}
										bind:value={email}
									/>
									<button
										class="rj-foot-news-button"
										type="submit"
										disabled={loadingForSubmitting || !agreed}
										aria-busy={loadingForSubmitting}
									>
										{#if loadingForSubmitting}
											<span class="rj-foot-spinner" aria-hidden="true"></span>
										{/if}
										{newsletter.button}
									</button>
								</form>
							</div>

							<div class="rj-foot-news-block">
								<label class="rj-foot-consent">
									<input class="rj-foot-check" type="checkbox" bind:checked={agreed} />
									<span>{newsletter.consent}</span>
								</label>
								<p class="rj-foot-note">
									{newsletter.note}<a class="rj-foot-note-link" href={newsletter.noteHref}
										>{newsletter.noteLink}</a
									>
								</p>
							</div>
						</div>
					{/snippet}
				</NewsletterRenderer>
			</div>
		</div>
	</div>

	<div class="rj-foot-legal">
		<div class="rj-foot-legal-inner">
			<p class="rj-foot-copy">
				<span>{legal.year}</span>
				<span aria-hidden="true">©</span>
				<span>{brandName} {legal.rights}</span>
			</p>
			<nav class="rj-foot-legal-links" aria-label="Legal">
				{#each legal.links as link (link.label)}
					<a href={link.href}>{link.label}</a>
				{/each}
			</nav>
		</div>
	</div>
</footer>

<style>
	/* 1:6336 — the footer body shares the #fafafa band with the Instagram strip. */
	.rj-foot {
		width: 100%;
		background: #fafafa;
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

	/* 1:6337 — 59/28 gutters, 40 between the USP strip and the columns. */
	.rj-foot-inner {
		display: flex;
		flex-direction: column;
		gap: 40px;
		margin: 0 auto;
		padding: 28px 59px 32px;
	}

	/* ---- USP strip ------------------------------------------------------ */
	.rj-foot-usps {
		display: flex;
		flex-direction: column;
		gap: 25px;
		width: 100%;
		padding-bottom: 25px;
		border-bottom: 1px solid #e1e1e1;
	}

	/* 1:6339 — five columns separated by 1×130 #d9d9d9 rules, gap 35. */
	.rj-foot-usp-row {
		display: flex;
		align-items: flex-start;
		gap: 35px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rj-foot-usp {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1 1 var(--w);
		min-width: 0;
	}

	.rj-foot-usp + .rj-foot-usp {
		border-left: 1px solid #d9d9d9;
		padding-left: 35px;
		margin-left: 0;
	}

	.rj-foot-usp-head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--gap);
		width: var(--tw);
	}

	.rj-foot-usp-icon {
		display: block;
		flex-shrink: 0;
		object-fit: contain;
		object-position: left center;
	}

	/* 1:6352 — a %-sign centred in the vuesax verify rosette. */
	.rj-foot-verify {
		position: relative;
		display: block;
		width: 30px;
		height: 30px;
		flex-shrink: 0;
	}

	.rj-foot-verify img {
		position: absolute;
		inset: 8.3%;
		width: 83.4%;
		height: 83.4%;
	}

	.rj-foot-verify span {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 16px;
		line-height: 1;
		color: var(--rj-gold, #cca646);
	}

	.rj-foot-usp-title {
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 18px;
		line-height: normal;
		color: #000;
	}

	.rj-foot-usp-text {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 14px;
		line-height: normal;
		color: var(--rj-ink, #404040);
	}

	/* ---- columns -------------------------------------------------------- */
	.rj-foot-cols {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 40px;
		row-gap: 30px;
		width: 100%;
	}

	.rj-foot-left {
		display: flex;
		align-items: flex-start;
		gap: 45px;
	}

	.rj-foot-brand {
		display: flex;
		flex-direction: column;
		gap: 15px;
		width: 314px;
		flex-shrink: 0;
	}

	.rj-foot-brand-link {
		display: flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
	}

	/* Same crop as the header mark (1:6383). */
	.rj-foot-mark {
		position: relative;
		display: block;
		width: 55px;
		height: 52px;
		flex-shrink: 0;
		overflow: hidden;
	}

	.rj-foot-mark img {
		position: absolute;
		left: -59.69%;
		top: -39%;
		width: 206.72%;
		height: 221.3%;
		max-width: none;
	}

	.rj-foot-brand-name {
		font-family: 'Inria Serif', var(--font-heading, serif);
		font-size: 26px;
		line-height: normal;
		color: var(--rj-gold, #cca646);
		white-space: nowrap;
	}

	.rj-foot-brand-text {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: normal;
		color: #505050;
	}

	.rj-foot-nav {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: var(--w);
		flex-shrink: 0;
	}

	.rj-foot-nav-title {
		margin: 0;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 25px;
		font-weight: 400;
		line-height: normal;
		letter-spacing: 0.75px;
		text-transform: uppercase;
		color: var(--rj-heading, #202020);
	}

	.rj-foot-nav-list {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.rj-foot-link {
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: normal;
		color: #505050;
		text-decoration: none;
		white-space: nowrap;
		transition: color 0.18s ease;
	}

	.rj-foot-link:hover {
		color: var(--rj-gold, #cca646);
	}

	/* ---- newsletter ----------------------------------------------------- */
	/*
	 * 397 / 1321 of the row. `min-width` is what makes the column drop to its
	 * own line once the fixed link columns stop leaving it enough room —
	 * without it the footer overflowed the viewport around 1024.
	 */
	.rj-foot-news {
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 0 1 30.0530%;
		min-width: min(340px, 100%);
	}

	.rj-foot-news-block {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
	}

	.rj-foot-news-title {
		margin: 0;
		font-family: 'Rozha One', var(--font-heading, serif);
		font-size: 23px;
		font-weight: 400;
		line-height: normal;
		letter-spacing: normal;
		text-transform: uppercase;
		color: var(--rj-heading, #202020);
	}

	/* 1:6407 — 285×45 field beside a 106×45 gold button, gap 5, radius 3. */
	.rj-foot-news-form {
		display: flex;
		align-items: center;
		gap: 5px;
		width: 100%;
	}

	.rj-foot-news-input {
		flex: 1 1 auto;
		min-width: 0;
		height: 45px;
		padding: 0 14px;
		border: 1px solid #e1e1e1;
		border-radius: 3px;
		background: #fff;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 14px;
		color: var(--rj-heading, #202020);
	}

	.rj-foot-news-input::placeholder {
		color: #a8a8a8;
	}

	.rj-foot-news-input:focus-visible {
		outline: none;
		border-color: var(--rj-gold, #cca646);
	}

	.rj-foot-news-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 106px;
		height: 45px;
		flex-shrink: 0;
		padding: 10px 14px;
		border: 0;
		border-radius: 3px;
		background: var(--rj-gold, #cca646);
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 14px;
		font-weight: 700;
		line-height: 24px;
		letter-spacing: -0.084px;
		color: #fff;
		cursor: pointer;
		white-space: nowrap;
		transition: filter 0.18s ease;
	}

	.rj-foot-news-button:hover:not(:disabled) {
		filter: brightness(0.94);
	}

	.rj-foot-news-button:disabled {
		opacity: 1;
		cursor: not-allowed;
	}

	.rj-foot-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.4);
		border-top-color: #fff;
		border-radius: 50%;
		animation: rj-foot-spin 0.7s linear infinite;
	}

	@keyframes rj-foot-spin {
		to {
			transform: rotate(360deg);
		}
	}

	.rj-foot-consent {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 14px;
		line-height: normal;
		color: #505050;
	}

	/* 1:6413 — 17×17 white box, 1px #505050, radius 3. */
	.rj-foot-check {
		width: 17px;
		height: 17px;
		flex-shrink: 0;
		margin: 0;
		border: 1px solid #505050;
		border-radius: 3px;
		accent-color: var(--rj-gold, #cca646);
	}

	.rj-foot-note {
		margin: 0;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 14px;
		line-height: normal;
		color: #505050;
	}

	.rj-foot-note-link {
		color: var(--rj-gold, #cca646);
		text-decoration: none;
	}

	.rj-foot-note-link:hover {
		text-decoration: underline;
	}

	/* ---- legal bar ------------------------------------------------------ */
	/* 1:6416 — gold band, 61/12 padding, 16px white capitalised text. */
	.rj-foot-legal {
		width: 100%;
		padding: 12px 61px;
		background: var(--rj-gold, #cca646);
	}

	.rj-foot-legal-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		width: 100%;
		margin: 0 auto;
		font-family: 'Sarala', var(--font-body, sans-serif);
		font-size: 16px;
		line-height: normal;
		text-transform: capitalize;
		color: #fff;
	}

	.rj-foot-copy {
		display: flex;
		align-items: center;
		gap: 5px;
		margin: 0;
	}

	.rj-foot-legal-links {
		display: flex;
		align-items: center;
		gap: 25px;
	}

	.rj-foot-legal-links a {
		color: inherit;
		text-decoration: none;
		white-space: nowrap;
	}

	.rj-foot-legal-links a:hover {
		text-decoration: underline;
	}

	@media (prefers-reduced-motion: reduce) {
		.rj-foot-spinner {
			animation-duration: 1.6s;
		}
	}

	@media (max-width: 1279px) {
		.rj-foot-inner {
			padding: 28px 40px 32px;
		}

		.rj-foot-left {
			flex: 1 1 auto;
			gap: 32px;
		}

		.rj-foot-usp-row {
			flex-wrap: wrap;
			row-gap: 25px;
		}
	}

	/* ---- tablet 744 (63:40969) ------------------------------------------ */
	@media (max-width: 1023px) {
		.rj-foot-inner {
			max-width: 744px;
			gap: 20px;
			padding: 25px 24px;
		}

		/* 63:40974 + 63:41001 — the strip wraps 3 + 2. */
		.rj-foot-usps {
			padding-bottom: 16px;
		}

		.rj-foot-usp-row {
			display: grid;
			grid-template-columns: repeat(6, 1fr);
			column-gap: 24px;
			row-gap: 16px;
		}

		.rj-foot-usp {
			position: relative;
			grid-column: span 2;
			width: auto;
			min-width: 0;
		}

		.rj-foot-usp + .rj-foot-usp {
			padding-left: 0;
			border-left: 0;
		}

		.rj-foot-usp:nth-child(4) {
			grid-column: 2 / span 2;
		}

		.rj-foot-usp:nth-child(5) {
			grid-column: 4 / span 2;
		}

		.rj-foot-usp:nth-child(2)::before,
		.rj-foot-usp:nth-child(3)::before,
		.rj-foot-usp:nth-child(5)::before {
			content: '';
			position: absolute;
			top: 0;
			left: -12px;
			width: 1px;
			height: 130px;
			background: #d9d9d9;
		}

		.rj-foot-usp-head {
			width: auto;
		}

		.rj-foot-usp-title {
			font-size: 16px;
		}

		.rj-foot-usp-text {
			font-size: 12px;
		}

		.rj-foot-cols {
			flex-direction: column;
			gap: 30px;
		}

		.rj-foot-left {
			display: grid;
			width: 100%;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 25px;
		}

		.rj-foot-brand {
			grid-column: 1 / -1;
			width: 293px;
		}

		.rj-foot-brand-name {
			font-size: 24px;
		}

		.rj-foot-brand-text {
			font-size: 14px;
		}

		.rj-foot-link {
			font-size: 12px;
		}

		.rj-foot-nav {
			width: auto;
		}

		.rj-foot-nav-title {
			font-size: 22px;
		}

		/* 63:41043 — the field spans the row with the button pinned right. */
		.rj-foot-news {
			width: 100%;
		}

		.rj-foot-news-title {
			font-size: 21px;
		}

		.rj-foot-news-button {
			width: 142px;
		}

		.rj-foot-legal {
			padding: 13px 25px;
		}

		.rj-foot-legal-inner {
			max-width: 694px;
			font-size: 14px;
		}

		.rj-foot-legal-links {
			gap: 15px;
			font-size: 12px;
		}
	}

	/* ---- mobile 412 (77:107710) ----------------------------------------- */
	@media (max-width: 639px) {
		.rj-foot {
			display: flex;
			flex-direction: column;
			gap: 20px;
		}

		.rj-foot-inner {
			gap: 20px;
			padding: 0 20px;
		}

		.rj-foot-usps {
			padding-bottom: 20px;
		}

		/* 77:107713 → exact 2 + 2 + 1 USP grid. */
		.rj-foot-usp-row {
			grid-template-columns: 154px 159px;
			justify-content: space-between;
			column-gap: 0;
			row-gap: 20px;
		}

		.rj-foot-usp {
			grid-column: auto;
		}

		.rj-foot-usp:nth-child(1),
		.rj-foot-usp:nth-child(3) {
			width: 154px;
		}

		.rj-foot-usp:nth-child(2),
		.rj-foot-usp:nth-child(5) {
			width: 159px;
		}

		.rj-foot-usp:nth-child(5) {
			grid-column: auto;
		}

		.rj-foot-usp:nth-child(4) {
			grid-column: 2;
			width: 136px;
		}

		.rj-foot-usp:nth-child(3)::before,
		.rj-foot-usp:nth-child(5)::before {
			display: none;
		}

		.rj-foot-usp:nth-child(2)::before,
		.rj-foot-usp:nth-child(4)::before {
			content: '';
			position: absolute;
			top: 0;
			display: block;
			left: -30px;
			width: 1px;
			height: 96px;
			background: #d9d9d9;
		}

		.rj-foot-usp-title {
			font-size: 16px;
		}

		.rj-foot-usp-text {
			font-size: 10px;
			line-height: 16px;
		}

		.rj-foot-usp:first-child .rj-foot-usp-text {
			line-height: 15.5px;
		}

		.rj-foot-verify {
			width: 28px;
			height: 28px;
		}

		.rj-foot-cols {
			gap: 20px;
		}

		.rj-foot-left {
			flex-direction: column;
			gap: 20px;
		}

		.rj-foot-brand,
		.rj-foot-nav {
			width: 100%;
		}

		/* Link columns sit side by side below the full-width brand block. */
		.rj-foot-left {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			column-gap: 10px;
			row-gap: 20px;
		}

		.rj-foot-brand {
			grid-column: 1 / -1;
			gap: 12px;
		}

		.rj-foot-nav:nth-of-type(1) {
			grid-column: 1;
		}

		.rj-foot-nav:nth-of-type(2) {
			grid-column: 2;
		}

		.rj-foot-nav:nth-of-type(3) {
			grid-column: 3;
		}

		.rj-foot-mark {
			width: 32px;
			height: 30px;
		}

		.rj-foot-brand-name {
			font-size: 18px;
		}

		.rj-foot-brand-text {
			font-size: 12px;
		}

		.rj-foot-nav-title {
			font-size: 18px;
		}

		.rj-foot-nav-list {
			gap: 10px;
		}

		.rj-foot-nav:first-of-type .rj-foot-nav-list {
			gap: 4px;
		}

		.rj-foot-nav-list li {
			font-size: 12px;
			line-height: 20px;
		}

		.rj-foot-link {
			font-size: 12px;
			white-space: normal;
		}

		.rj-foot-news-title {
			font-size: 16px;
		}

		.rj-foot-news-block {
			gap: 10px;
		}

		.rj-foot-news-input,
		.rj-foot-news-button {
			height: 40px;
		}

		.rj-foot-news-button {
			width: 124px;
		}

		.rj-foot-note,
		.rj-foot-consent {
			font-size: 12px;
		}

		/* 77:107789 — the legal bar centres over two rows. */
		.rj-foot-legal {
			padding: 16.75px 20px;
		}

		.rj-foot-legal-inner {
			flex-direction: column;
			gap: 10px;
			font-size: 12px;
			text-align: center;
		}

		.rj-foot-copy {
			justify-content: center;
			flex-wrap: wrap;
		}

		.rj-foot-legal-links {
			gap: 15px;
		}
	}
</style>
