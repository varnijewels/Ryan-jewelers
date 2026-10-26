<script lang="ts">
	import { ArrowLeft, ArrowRight, Check, ChevronDown, Download, Gem, Info, Minus, Plus, RotateCcw, Ruler, Sparkles } from '@lucide/svelte'
	import { tick } from 'svelte'
	import { Button } from '$lib/components/ui/button'
	import Input from '$lib/components/ui/input/input.svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Select from '$lib/components/ui/select'

	const steps = ['Setting', 'Diamond', 'Metal', 'Personalise', 'Review']
	const titles = [
		'Start with a silhouette.',
		'Find your kind of brilliance.',
		'Choose your golden touch.',
		'The little things. Made personal.',
		'A ring that tells your story.',
	]
	const descriptions = [
		'Choose the band and setting that feel like you.',
		'A favourite shape. Just the right amount of sparkle.',
		'Find the colour and gold purity you love.',
		'Find your fit and add a few meaningful words.',
		'Every detail, beautifully brought together.',
	]
	const styles = [
		{ name: 'Classic', detail: 'A timeless, clean band', price: 430, path: 'M8 32 Q40 46 72 32 M8 32 Q40 18 72 32' },
		{ name: 'Cathedral', detail: 'An elegantly raised centre', price: 490, path: 'M8 34 Q40 48 72 34 M8 34 Q26 34 34 20 M72 34 Q54 34 46 20' },
		{ name: 'Twist', detail: 'Two beautifully woven lines', price: 550, path: 'M8 30 C26 52 54 12 72 34 M8 34 C26 12 54 52 72 30' },
		{
			name: 'Split shank',
			detail: 'A graceful, open silhouette',
			price: 590,
			path: 'M8 32 Q40 50 72 32 M8 32 Q25 15 35 22 M8 32 Q28 34 35 25 M72 32 Q55 15 45 22 M72 32 Q52 34 45 25',
		},
		{ name: 'Double band', detail: 'A little more presence', price: 650, path: 'M8 28 Q40 42 72 28 M8 35 Q40 49 72 35 M8 28 Q40 12 72 28' },
		{ name: 'Pinched', detail: 'Soft lines, a tapered finish', price: 490, path: 'M8 34 Q40 48 72 34 M8 34 L34 25 M72 34 L46 25' },
	]
	const sides = [
		{ name: 'Plain', price: 0 },
		{ name: 'Pavé', price: 180 },
		{ name: 'Prong', price: 220 },
		{ name: 'Channel', price: 160 },
	]
	const crowns = [
		{ name: 'Solitaire', price: 0 },
		{ name: 'Hidden halo', price: 120 },
		{ name: 'Halo', price: 260 },
	]
	const shapes = ['Round', 'Oval', 'Emerald', 'Radiant', 'Pear', 'Princess', 'Cushion', 'Marquise', 'Heart']
	const carats = [
		{ size: '0.50', price: 420 },
		{ size: '0.75', price: 620 },
		{ size: '1.00', price: 850 },
		{ size: '1.50', price: 1250 },
		{ size: '2.00', price: 1750 },
		{ size: '3.00', price: 2750 },
	]
	const metals = ['White gold', 'Yellow gold', 'Rose gold']
	const sizes = Array.from({ length: 21 }, (_, index) => String(3 + index * 0.5))
	const defaults = { style: 0, side: 0, crown: 0, shape: 'Round', carat: 2, metal: 'White gold', purity: '14K', size: '6', engraving: '' }
	let selection = $state({ ...defaults })
	let step = $state(0)
	let zoom = $state(1)
	let resetOpen = $state(false)
	let sizeGuideOpen = $state(false)
	let status = $state('')

	// shortcut: prices and photographs illustrate the UI; replace with validated quotes and matching 3D assets before selling.
	const settingEstimate = $derived(
		styles[selection.style].price + sides[selection.side].price + crowns[selection.crown].price + (selection.purity === '18K' ? 210 : 0),
	)
	const estimate = $derived(settingEstimate + carats[selection.carat].price)
	const previewImage = $derived(selection.crown === 2 ? 'halo' : selection.style === 4 ? 'cluster' : 'solitaire')
	const summary = $derived([
		{ label: 'Setting', value: `${styles[selection.style].name} · ${sides[selection.side].name} · ${crowns[selection.crown].name}`, step: 0 },
		{ label: 'Diamond', value: `${selection.shape} · ${carats[selection.carat].size} ct · Lab grown`, step: 1 },
		{ label: 'Metal', value: `${selection.purity} ${selection.metal.toLowerCase()}`, step: 2 },
		{ label: 'Ring size', value: `US ${selection.size}`, step: 3 },
		{ label: 'Engraving', value: selection.engraving || 'No engraving', step: 3 },
	])
	const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
	const shapeImage = (shape: string) =>
		shape === 'Round' ? '/ryans-jewels/diamonds/round.jpg' : `/ryans-jewels/product/customizer/${shape.toLowerCase()}.svg`

	async function goToStep(index: number) {
		step = index
		status = ''
		await tick()
		document.getElementById('rb-step-heading')?.focus({ preventScroll: true })
	}

	function reset() {
		selection = { ...defaults }
		zoom = 1
		resetOpen = false
		goToStep(0)
	}

	function downloadDesign() {
		try {
			const content = [
				'RYAN JEWELERS — YOUR RING DESIGN',
				'',
				...summary.map((item) => `${item.label}: ${item.value}`),
				'',
				`Illustrative estimate: ${money(estimate)}`,
				'Final design, availability and price are confirmed by Ryan Jewelers.',
			].join('\n')
			const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
			const link = document.createElement('a')
			link.href = url
			link.download = 'ryan-jewelers-ring-design.txt'
			link.click()
			URL.revokeObjectURL(url)
			status = 'Your design summary has been downloaded.'
		} catch {
			status = 'Your design could not be downloaded. Please try again.'
		}
	}
</script>

<section class="rb-studio" aria-labelledby="rb-title">
	<div class="rb-heading">
		<div>
			<p class="rb-eyebrow"><Sparkles size={13} aria-hidden="true" /> THE RYAN RING STUDIO</p>
			<h1 id="rb-title">A little sparkle. <em>All you.</em></h1>
			<p class="rb-intro">Create a ring as individual as your story, one beautiful detail at a time.</p>
		</div>
		<Button variant="ghost" class="rb-reset" onclick={() => (resetOpen = true)}><RotateCcw size={14} /> Start over</Button>
	</div>

	<nav class="rb-progress" aria-label="Ring design steps">
		<ol>
			{#each steps as label, index}
				<li class:current={step === index} class:complete={step > index}>
					<button
						type="button"
						aria-current={step === index ? 'step' : undefined}
						onclick={() => goToStep(index)}
						aria-label={`Step ${index + 1}: ${label}`}
					>
						<span class="rb-step-number"
							>{#if step > index}<Check size={15} aria-hidden="true" />{:else}{index + 1}{/if}</span
						><span>{label}</span>
					</button>
				</li>
			{/each}
		</ol>
	</nav>

	<div class="rb-workspace">
		<div class="rb-preview-column">
			<div class="rb-canvas">
				<div class="rb-canvas-top">
					<span class="rb-preview-tag"><span></span> YOUR DESIGN</span><span class="rb-counter">0{step + 1} <i>/ 05</i></span>
				</div>
				<div class="rb-ring-image">
					<img
						src={`/ryans-jewels/ring-builder/${previewImage}.webp`}
						alt={`${crowns[selection.crown].name} ring style reference`}
						style:transform={`scale(${zoom})`}
						fetchpriority="high"
					/>
				</div>
				{#if selection.engraving}<p class="rb-engraving-preview">“{selection.engraving}”<span>A LITTLE MEANING, FOREVER YOURS</span></p>{/if}
				<div class="rb-canvas-bottom">
					<span>Illustrative style preview</span>
					<div class="rb-view-tools" aria-label="Preview zoom">
						<button type="button" aria-label="Zoom out" disabled={zoom <= 1} onclick={() => (zoom = Math.max(1, zoom - 0.2))}
							><Minus size={15} /></button
						>
						<button type="button" aria-label="Reset preview zoom" onclick={() => (zoom = 1)}><RotateCcw size={14} /></button>
						<button type="button" aria-label="Zoom in" disabled={zoom >= 1.6} onclick={() => (zoom = Math.min(1.6, zoom + 0.2))}
							><Plus size={15} /></button
						>
					</div>
				</div>
			</div>
			<div class="rb-preview-caption">
				<div>
					<p>MADE TO BE YOURS</p>
					<h2>{selection.shape} {crowns[selection.crown].name.toLowerCase()} ring</h2>
				</div>
				<span>{carats[selection.carat].size} ct <i>·</i> {selection.purity} {selection.metal.toLowerCase()}</span>
			</div>
			<div class="rb-design-note">
				<Gem size={17} aria-hidden="true" />
				<p>A thoughtful beginning to something extraordinary.<br /><span>Explore the details. Make them your own.</span></p>
			</div>
		</div>

		<div class="rb-panel">
			<div class="rb-panel-body">
				<div class="rb-panel-heading">
					<span class="rb-eyebrow">STEP 0{step + 1} / 05</span>
					<h2 id="rb-step-heading" tabindex="-1">{titles[step]}</h2>
					<p>{descriptions[step]}</p>
				</div>

				{#if step === 0}
					<fieldset>
						<legend>Band style <span>{styles[selection.style].name}</span></legend>
						<div class="rb-style-grid">
							{#each styles as style, index}
								<button
									type="button"
									class="rb-style-option"
									class:selected={selection.style === index}
									aria-pressed={selection.style === index}
									onclick={() => (selection.style = index)}
								>
									<svg viewBox="0 0 80 60" fill="none" aria-hidden="true"
										><path d={style.path} stroke="currentColor" stroke-width="2.3" stroke-linecap="round" /><path
											d="M34 18 L40 13 L46 18 L43 25 H37 Z"
											fill="#f6f4ee"
											stroke="currentColor"
											stroke-width="1.2"
										/><path d="M34 18 H46 M37 18 L40 13 L43 18 L40 25 Z" stroke="currentColor" stroke-width=".7" /></svg
									>
									<span>{style.name}</span>{#if selection.style === index}<Check class="rb-option-check" size={12} aria-hidden="true" />{/if}
								</button>
							{/each}
						</div>
					</fieldset>
					<fieldset>
						<legend>Band detail <span>{sides[selection.side].name}</span></legend>
						<div class="rb-segments">
							{#each sides as side, index}<button
									type="button"
									class:selected={selection.side === index}
									aria-pressed={selection.side === index}
									onclick={() => (selection.side = index)}>{side.name}</button
								>{/each}
						</div>
					</fieldset>
					<fieldset>
						<legend>Centre setting <span>{crowns[selection.crown].name}</span></legend>
						<div class="rb-segments">
							{#each crowns as crown, index}<button
									type="button"
									class:selected={selection.crown === index}
									aria-pressed={selection.crown === index}
									onclick={() => (selection.crown = index)}>{crown.name}</button
								>{/each}
						</div>
					</fieldset>
				{:else if step === 1}
					<fieldset>
						<legend>Diamond shape <span>{selection.shape}</span></legend>
						<div class="rb-shape-grid">
							{#each shapes as shape}<button
									type="button"
									class="rb-shape-option"
									class:selected={selection.shape === shape}
									aria-pressed={selection.shape === shape}
									onclick={() => (selection.shape = shape)}><img src={shapeImage(shape)} alt="" /><span>{shape}</span></button
								>{/each}
						</div>
					</fieldset>
					<fieldset>
						<legend>Centre diamond weight <span>{carats[selection.carat].size} ct</span></legend>
						<div class="rb-carats">
							{#each carats as carat, index}<button
									type="button"
									class:selected={selection.carat === index}
									aria-pressed={selection.carat === index}
									onclick={() => (selection.carat = index)}>{carat.size}<small>ct</small></button
								>{/each}
						</div>
					</fieldset>
					<div class="rb-help">
						<Info size={15} aria-hidden="true" />
						<p>Carat is a diamond’s weight. Shape and setting also influence how it looks on your hand.</p>
					</div>
				{:else if step === 2}
					<fieldset>
						<legend>Gold colour <span>{selection.metal}</span></legend>
						<div class="rb-metal-grid">
							{#each metals as metal, index}<button
									type="button"
									class="rb-metal-option"
									class:selected={selection.metal === metal}
									aria-pressed={selection.metal === metal}
									onclick={() => (selection.metal = metal)}
									><span class="rb-metal-swatch" class:white={index === 0} class:yellow={index === 1} class:rose={index === 2}></span><span
										>{metal}</span
									>{#if selection.metal === metal}<Check size={12} aria-hidden="true" />{/if}</button
								>{/each}
						</div>
					</fieldset>
					<fieldset>
						<legend>Gold purity <span>{selection.purity}</span></legend>
						<div class="rb-purity-grid">
							{#each ['14K', '18K'] as purity}<button
									type="button"
									class:selected={selection.purity === purity}
									aria-pressed={selection.purity === purity}
									onclick={() => (selection.purity = purity)}
									><strong>{purity} gold</strong><span>{purity === '14K' ? '58.5% pure gold' : '75% pure gold'}</span
									>{#if selection.purity === purity}<Check size={14} aria-hidden="true" />{/if}</button
								>{/each}
						</div>
					</fieldset>
					<div class="rb-help">
						<Info size={15} aria-hidden="true" />
						<p>Choose a colour you love. Your final finish and material details will be confirmed with your design.</p>
					</div>
				{:else if step === 3}
					<div class="rb-field-header">
						<label for="rb-size">Your ring size</label><button type="button" onclick={() => (sizeGuideOpen = true)}
							><Ruler size={14} /> Size help</button
						>
					</div>
					<Select.Root type="single" bind:value={selection.size}
						><Select.Trigger id="rb-size" class="rb-size-select" aria-label="US ring size">US {selection.size}</Select.Trigger><Select.Content
							>{#each sizes as size}<Select.Item value={size} label={`US ${size}`}>US {size}</Select.Item>{/each}</Select.Content
						></Select.Root
					>
					<p class="rb-field-note">Sizes shown in the US ring-size standard.</p>
					<div class="rb-engraving-field">
						<label for="rb-engraving">A word, a date, a little meaning. <span>Optional</span></label>
						<div class="rb-input-wrap">
							<Input
								id="rb-engraving"
								class="rb-engraving-input"
								placeholder="e.g. Always, 24.06.26"
								maxlength={18}
								bind:value={selection.engraving}
							/><span>{selection.engraving.length}/18</span>
						</div>
						<p class="rb-field-note">Up to 18 characters, including spaces.</p>
					</div>
					<div class="rb-inscription">
						<span>YOUR ENGRAVING</span>
						<p>{selection.engraving || 'Your story goes here'}</p>
						<small>A personal touch, tucked inside the band.</small>
					</div>
				{:else}
					<div class="rb-review-header">
						<span><Check size={17} /></span>
						<div>
							<strong>Beautifully put together.</strong>
							<p>Review your details before saving your design.</p>
						</div>
					</div>
					<dl class="rb-review">
						{#each summary as item}<div>
								<dt>{item.label}</dt>
								<dd>{item.value}</dd>
								<button type="button" aria-label={`Edit ${item.label.toLowerCase()}`} onclick={() => goToStep(item.step)}>Edit</button>
							</div>{/each}
					</dl>
					<div class="rb-help">
						<Info size={15} aria-hidden="true" />
						<p>Your saved summary includes every selection. Final design, availability and pricing are confirmed by Ryan Jewelers.</p>
					</div>
				{/if}
			</div>

			<div class="rb-panel-footer">
				<div class="rb-estimate">
					<div><span>Illustrative estimate</span><strong data-testid="ring-estimate">{money(estimate)}</strong></div>
					<span class="rb-estimate-tag">YOUR RING, YOUR WAY</span>
				</div>
				<details class="rb-breakdown">
					<summary>View estimate details <ChevronDown size={13} /></summary>
					<div>
						<p><span>Setting &amp; metal</span><b>{money(settingEstimate)}</b></p>
						<p><span>Lab-grown centre diamond</span><b>{money(carats[selection.carat].price)}</b></p>
						<small>Illustrative pricing for this design preview. Your final quote is confirmed separately.</small>
					</div>
				</details>
				<div class="rb-step-actions">
					{#if step > 0}<Button variant="outline" class="rb-back" aria-label="Previous step" onclick={() => goToStep(step - 1)}
							><ArrowLeft size={17} /></Button
						>{/if}{#if step < 4}<Button class="rb-next" onclick={() => goToStep(step + 1)}
							>{step === 3 ? 'Review your ring' : `Continue to ${steps[step + 1].toLowerCase()}`}<ArrowRight size={16} /></Button
						>{:else}<Button class="rb-next" onclick={downloadDesign}><Download size={16} /> Download your design</Button>{/if}
				</div>
				<p class="rb-status" role="status">{status}</p>
			</div>
		</div>
	</div>
</section>

<Dialog.Root bind:open={resetOpen}
	><Dialog.Content class="rb-dialog"
		><Dialog.Title>Start a new ring?</Dialog.Title><Dialog.Description>Your current selections and engraving will be cleared.</Dialog.Description>
		<div class="rb-dialog-actions">
			<Button variant="outline" onclick={() => (resetOpen = false)}>Keep my design</Button><Button onclick={reset}>Start over</Button>
		</div></Dialog.Content
	></Dialog.Root
>

<Dialog.Root bind:open={sizeGuideOpen}
	><Dialog.Content class="rb-dialog"
		><Dialog.Title>A comfortable fit starts here.</Dialog.Title><Dialog.Description
			>Use a ring that fits the finger you have in mind.</Dialog.Description
		>
		<ol class="rb-size-tips">
			<li>Choose a ring that feels comfortable throughout the day.</li>
			<li>Measure straight across its inside edges in millimetres.</li>
			<li>Share the measurement with our team to confirm your US size.</li>
		</ol>
		<p class="rb-size-tip">Not sure? You can refine the size with us when your design is confirmed.</p>
		<Button onclick={() => (sizeGuideOpen = false)}>Back to my ring</Button></Dialog.Content
	></Dialog.Root
>

<style>
	.rb-studio {
		--rb-gold: var(--rj-gold, #cca646);
		--rb-ink: #292825;
		--rb-muted: #77746e;
		--rb-line: #e9e6df;
		width: 100%;
		padding: 26px 3.2% 54px;
		background: #fff;
		color: var(--rb-ink);
		font-family: 'Sarala', sans-serif;
	}
	.rb-studio :is(h1, h2, p) {
		margin: 0;
	}
	.rb-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		max-width: 1580px;
		margin: 0 auto;
	}
	.rb-eyebrow {
		display: flex;
		align-items: center;
		gap: 7px;
		color: #8b7132;
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 1.8px;
	}
	.rb-heading h1 {
		margin-top: 8px;
		font:
			400 39px/1.2 'Inria Serif',
			Georgia,
			serif;
		letter-spacing: -0.7px;
	}
	.rb-heading h1 em {
		color: #9a7c34;
		font-weight: 400;
	}
	.rb-intro {
		margin-top: 6px !important;
		color: var(--rb-muted);
		font-size: 12px;
		line-height: 21px;
	}
	:global(.rb-reset) {
		gap: 8px;
		padding: 8px 0 8px 12px;
		color: #77746e;
		font:
			400 12px 'Sarala',
			sans-serif;
	}
	.rb-progress {
		max-width: 1580px;
		margin: 25px auto 24px;
		padding: 15px 0;
		border-top: 1px solid var(--rb-line);
		border-bottom: 1px solid var(--rb-line);
	}
	.rb-progress ol {
		display: flex;
		justify-content: center;
		max-width: 900px;
		margin: 0 auto;
		padding: 0;
		list-style: none;
	}
	.rb-progress li {
		position: relative;
		flex: 1;
	}
	.rb-progress li:not(:last-child)::after {
		position: absolute;
		top: 15px;
		right: -12%;
		width: 24%;
		height: 1px;
		background: var(--rb-line);
		content: '';
	}
	.rb-progress button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		padding: 0;
		border: 0;
		background: none;
		color: #77746e;
		font-size: 12px;
		cursor: pointer;
	}
	.rb-step-number {
		display: grid;
		place-items: center;
		width: 31px;
		height: 31px;
		border: 1px solid #e2dfd7;
		border-radius: 50%;
		background: #fff;
		font:
			400 11px 'Sarala',
			sans-serif;
	}
	.rb-progress .current button {
		color: #383122;
	}
	.current .rb-step-number {
		border-color: #ac8b3f;
		background: #ac8b3f;
		color: #2c2416;
	}
	.complete .rb-step-number {
		border-color: #ddd0ad;
		background: #faf6eb;
		color: #96772d;
	}
	.rb-workspace {
		display: grid;
		grid-template-columns: minmax(0, 1.45fr) minmax(380px, 1fr);
		gap: clamp(28px, 4.2vw, 72px);
		max-width: 1420px;
		margin: 0 auto;
		align-items: start;
	}
	.rb-preview-column {
		position: sticky;
		top: 148px;
		min-width: 0;
	}
	.rb-canvas {
		position: relative;
		display: flex;
		min-height: 460px;
		height: clamp(400px, 31vw, 540px);
		flex-direction: column;
		overflow: hidden;
		border: 1px solid #eeece7;
		border-radius: 12px;
		background: #f5f5f3;
	}
	.rb-canvas-top {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 22px 24px;
	}
	.rb-preview-tag {
		display: flex;
		align-items: center;
		gap: 7px;
		color: #696961;
		font-size: 9px;
		letter-spacing: 1.2px;
	}
	.rb-preview-tag > span {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #ac8b3f;
	}
	.rb-counter {
		color: #49453c;
		font-size: 11px;
		letter-spacing: 1px;
	}
	.rb-counter i {
		color: #aba89f;
		font-style: normal;
	}
	.rb-ring-image {
		position: absolute;
		inset: 20px 0 0;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.rb-ring-image img {
		width: 88%;
		max-width: 650px;
		aspect-ratio: 1;
		object-fit: contain;
		mix-blend-mode: multiply;
		mask-image: radial-gradient(ellipse at center, #000 43%, transparent 72%);
		transition: transform 0.3s ease;
	}
	.rb-canvas-bottom {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-top: auto;
		padding: 16px 22px;
	}
	.rb-canvas-bottom > span {
		color: #84827c;
		font-size: 10px;
	}
	.rb-view-tools {
		display: flex;
		gap: 5px;
		padding: 3px;
		border: 1px solid #e9e6dd;
		border-radius: 8px;
		background: #ffffffbd;
	}
	.rb-view-tools button {
		display: grid;
		place-items: center;
		width: 31px;
		height: 31px;
		border: 0;
		border-radius: 5px;
		background: none;
		color: #5d594f;
		cursor: pointer;
	}
	.rb-view-tools button:hover {
		background: #eeeae1;
	}
	.rb-view-tools button:disabled {
		opacity: 0.3;
		cursor: default;
	}
	.rb-engraving-preview {
		position: absolute;
		z-index: 1;
		bottom: 76px;
		left: 0;
		width: 100%;
		color: #71603c;
		text-align: center;
		font:
			italic 20px 'Inria Serif',
			serif;
	}
	.rb-engraving-preview span {
		display: block;
		margin-top: 7px;
		color: #99938a;
		font:
			8px 'Sarala',
			sans-serif;
		letter-spacing: 1.5px;
	}
	.rb-preview-caption {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 20px 3px 18px;
		border-bottom: 1px solid var(--rb-line);
	}
	.rb-preview-caption p {
		margin-bottom: 5px;
		color: #a28c56;
		font-size: 8px;
		letter-spacing: 1.5px;
	}
	.rb-preview-caption h2 {
		font:
			400 24px/1.2 'Inria Serif',
			Georgia,
			serif;
		letter-spacing: -0.3px;
		text-transform: capitalize;
	}
	.rb-preview-caption > span {
		color: #77736c;
		font-size: 10px;
		white-space: nowrap;
	}
	.rb-preview-caption i {
		margin: 0 5px;
		font-style: normal;
		color: #baaa84;
	}
	.rb-design-note {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12px;
		padding: 18px 8px;
		color: #a88b45;
	}
	.rb-design-note p {
		color: #625e55;
		font-size: 10px;
		line-height: 19px;
	}
	.rb-design-note p span {
		color: #99948a;
	}
	.rb-panel {
		min-width: 0;
	}
	.rb-panel-heading {
		margin-bottom: 25px;
	}
	.rb-panel-heading h2 {
		margin-top: 9px;
		color: #332e25;
		font:
			400 29px/1.2 'Inria Serif',
			Georgia,
			serif;
		letter-spacing: -0.5px;
	}
	.rb-panel-heading h2:focus {
		outline: none;
	}
	.rb-panel-heading p {
		margin-top: 8px;
		color: var(--rb-muted);
		font-size: 11px;
		line-height: 20px;
	}
	.rb-panel fieldset {
		min-width: 0;
		margin: 0 0 23px;
		padding: 0;
		border: 0;
	}
	.rb-panel legend {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-bottom: 11px;
		padding: 0;
		color: #49443b;
		font-size: 13px;
	}
	.rb-panel legend > span {
		color: #756e60;
		font-size: 11px;
	}
	.rb-style-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 9px;
	}
	.rb-style-option {
		position: relative;
		display: flex;
		min-height: 87px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 6px;
		border: 1px solid #e6e3dc;
		border-radius: 7px;
		background: #fff;
		color: #a9a18e;
		cursor: pointer;
	}
	.rb-style-option svg:not(.rb-option-check) {
		width: 73px;
		height: 48px;
	}
	.rb-style-option > span {
		color: #6c665b;
		font-size: 12px;
	}
	.rb-style-option :global(.rb-option-check) {
		position: absolute;
		top: 7px;
		right: 7px;
		color: #9d7d31;
	}
	.rb-panel button.selected {
		border-color: #b59958;
		background: #fcfaf4;
		color: #9a7a2c;
		box-shadow: inset 0 0 0 0.3px #b59958;
	}
	.rb-panel button.selected > span:not(.rb-metal-swatch) {
		color: #57492b;
	}
	.rb-style-option:hover,
	.rb-shape-option:hover,
	.rb-metal-option:hover,
	.rb-purity-grid button:hover,
	.rb-segments button:hover,
	.rb-carats button:hover {
		border-color: #bca66f;
	}
	.rb-segments {
		display: flex;
		gap: 7px;
	}
	.rb-segments button {
		flex: 1;
		min-width: 0;
		min-height: 38px;
		padding: 7px 4px;
		border: 1px solid #e6e3dc;
		border-radius: 5px;
		background: #fff;
		color: #797164;
		font:
			400 12px 'Sarala',
			sans-serif;
		cursor: pointer;
	}
	.rb-shape-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 8px;
	}
	.rb-shape-option {
		display: flex;
		min-height: 77px;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 7px;
		padding: 9px 3px;
		border: 1px solid #e6e3dc;
		border-radius: 7px;
		background: #fff;
		color: #777064;
		cursor: pointer;
	}
	.rb-shape-option img {
		width: 27px;
		height: 30px;
		object-fit: contain;
		mix-blend-mode: multiply;
	}
	.rb-shape-option span {
		font-size: 11px;
	}
	.rb-carats {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 7px;
	}
	.rb-carats button {
		min-height: 47px;
		padding: 5px 3px;
		border: 1px solid #e6e3dc;
		border-radius: 5px;
		background: #fff;
		color: #615a4d;
		font-size: 11px;
		cursor: pointer;
	}
	.rb-carats small {
		display: block;
		margin-top: 3px;
		color: #a6a093;
		font-size: 9px;
	}
	.rb-help {
		display: flex;
		align-items: flex-start;
		gap: 9px;
		padding: 13px 14px;
		border-radius: 6px;
		background: #f8f7f3;
		color: #a08b57;
	}
	.rb-help :global(svg) {
		flex-shrink: 0;
		margin-top: 2px;
	}
	.rb-help p {
		color: #827b6e;
		font-size: 10px;
		line-height: 19px;
	}
	.rb-metal-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
	}
	.rb-metal-option {
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 12px;
		min-height: 115px;
		padding: 16px 6px 12px;
		border: 1px solid #e6e3dc;
		border-radius: 7px;
		background: #fff;
		color: #726a5b;
		font-size: 10px;
		cursor: pointer;
	}
	.rb-metal-swatch {
		width: 42px;
		height: 42px;
		border: 3px solid #fff;
		border-radius: 50%;
		box-shadow: 0 0 0 1px #e8e5df;
	}
	.rb-metal-swatch.white {
		background: linear-gradient(135deg, #fff 5%, #c2c4c5 45%, #f1f1f1 70%, #afb0b1);
	}
	.rb-metal-swatch.yellow {
		background: linear-gradient(135deg, #f7e9b7 5%, #d1b36b 45%, #f3e0a9 70%, #b6964e);
	}
	.rb-metal-swatch.rose {
		background: linear-gradient(135deg, #fbe4dc 5%, #d6a497 45%, #f5d0c2 70%, #ba8d81);
	}
	.rb-metal-option :global(svg) {
		position: absolute;
		right: 8px;
		top: 8px;
	}
	.rb-purity-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}
	.rb-purity-grid button {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 5px;
		min-height: 75px;
		padding: 15px;
		border: 1px solid #e6e3dc;
		border-radius: 6px;
		background: #fff;
		text-align: left;
		cursor: pointer;
	}
	.rb-purity-grid strong {
		color: #61594a;
		font:
			400 13px 'Sarala',
			sans-serif;
	}
	.rb-purity-grid span {
		color: #989081;
		font-size: 10px;
	}
	.rb-purity-grid :global(svg) {
		position: absolute;
		top: 15px;
		right: 12px;
	}
	.rb-field-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 11px;
	}
	.rb-field-header label,
	.rb-engraving-field label {
		color: #49443b;
		font-size: 11px;
	}
	.rb-field-header button {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 0;
		border: 0;
		background: none;
		color: #9b7a2e;
		font-size: 10px;
		cursor: pointer;
	}
	:global(.rb-size-select) {
		height: 43px;
		border-color: #e2ded4;
		background: #fff;
		color: #60584a;
		font:
			400 12px 'Sarala',
			sans-serif;
		box-shadow: none;
	}
	.rb-field-note {
		margin-top: 7px !important;
		color: #9a9285;
		font-size: 9px;
		line-height: 18px;
	}
	.rb-engraving-field {
		margin-top: 26px;
	}
	.rb-engraving-field label {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 11px;
	}
	.rb-engraving-field label > span {
		color: #a29a8a;
		font-size: 10px;
	}
	.rb-input-wrap {
		position: relative;
	}
	:global(.rb-engraving-input) {
		height: 44px;
		padding-right: 52px;
		border-color: #e2ded4;
		border-radius: 6px;
		background: #fff;
		color: #60584a;
		font:
			400 12px 'Sarala',
			sans-serif;
		box-shadow: none;
	}
	.rb-input-wrap > span {
		position: absolute;
		right: 13px;
		top: 15px;
		color: #a9a090;
		font-size: 9px;
	}
	.rb-inscription {
		margin-top: 25px;
		padding: 22px 12px;
		border: 1px dashed #dcd2bc;
		border-radius: 8px;
		background: #fcfbf7;
		text-align: center;
	}
	.rb-inscription > span {
		color: #ac9a71;
		font-size: 8px;
		letter-spacing: 1.6px;
	}
	.rb-inscription p {
		margin: 13px 0;
		color: #7d6b41;
		font:
			italic 25px 'Inria Serif',
			Georgia,
			serif;
		overflow-wrap: anywhere;
	}
	.rb-inscription small {
		color: #726b60;
		font-size: 9px;
	}
	.rb-review-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
		padding: 13px;
		border: 1px solid #e3e7dc;
		border-radius: 7px;
		background: #f6f8f2;
	}
	.rb-review-header > span {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: #e8eddf;
		color: #6f7b56;
	}
	.rb-review-header strong {
		color: #606c4d;
		font-size: 11px;
		font-weight: 400;
	}
	.rb-review-header p {
		margin-top: 4px;
		color: #929685;
		font-size: 9px;
	}
	.rb-review {
		margin: 0 0 18px;
	}
	.rb-review > div {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 5px 12px;
		padding: 13px 0;
		border-bottom: 1px solid var(--rb-line);
	}
	.rb-review dt {
		color: #a09684;
		font-size: 9px;
	}
	.rb-review dd {
		grid-column: 1;
		margin: 0;
		color: #5e5545;
		font-size: 11px;
		overflow-wrap: anywhere;
	}
	.rb-review button {
		grid-column: 2;
		grid-row: 1 / 3;
		align-self: center;
		padding: 7px;
		border: 0;
		background: none;
		color: #9c7b30;
		font-size: 10px;
		cursor: pointer;
	}
	.rb-panel-footer {
		margin-top: 26px;
		padding-top: 18px;
		border-top: 1px solid var(--rb-line);
	}
	.rb-estimate {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}
	.rb-estimate > div > span {
		display: block;
		margin-bottom: 5px;
		color: #8a8273;
		font-size: 10px;
	}
	.rb-estimate strong {
		display: block;
		color: #393024;
		font:
			400 29px/1.2 'Inria Serif',
			Georgia,
			serif;
		letter-spacing: -0.4px;
	}
	.rb-estimate-tag {
		padding: 7px 9px;
		border-radius: 4px;
		background: #f7f4eb;
		color: #7d652d;
		font-size: 7px;
		letter-spacing: 1px;
	}
	.rb-breakdown {
		margin: 11px 0 19px;
	}
	.rb-breakdown summary {
		display: flex;
		align-items: center;
		gap: 7px;
		width: fit-content;
		color: #969080;
		font-size: 9px;
		list-style: none;
		cursor: pointer;
	}
	.rb-breakdown summary::-webkit-details-marker {
		display: none;
	}
	.rb-breakdown > div {
		padding: 13px 0 0;
	}
	.rb-breakdown p {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
		color: #8d8270;
		font-size: 10px;
	}
	.rb-breakdown b {
		color: #69604f;
		font-weight: 400;
	}
	.rb-breakdown small {
		display: block;
		margin-top: 11px;
		color: #726b60;
		font-size: 9px;
		line-height: 17px;
	}
	.rb-step-actions {
		display: flex;
		gap: 10px;
	}
	:global(.rb-next) {
		flex: 1;
		height: 45px;
		justify-content: space-between;
		padding: 0 18px;
		border: 1px solid #a98b42;
		border-radius: 6px;
		background: #b3964d;
		color: #2c2416;
		font:
			400 12px 'Sarala',
			sans-serif;
		box-shadow: none;
	}
	:global(.rb-next:hover) {
		background: #987b38;
	}
	:global(.rb-back) {
		width: 45px;
		height: 45px;
		padding: 0;
		border-color: #e2ded4;
		border-radius: 6px;
		background: #fff;
		color: #8e8063;
		box-shadow: none;
	}
	.rb-status {
		margin-top: 9px !important;
		color: #76785c;
		font-size: 10px;
		line-height: 18px;
	}
	.rb-status:empty {
		display: none;
	}
	.rb-studio :is(button, summary):focus-visible {
		outline: 2px solid #8e7130;
		outline-offset: 3px;
	}
	:global(.rb-dialog) {
		border-color: #e7e0d0;
		border-radius: 12px;
		background: #fff;
		color: #514735;
		font-family: 'Sarala', sans-serif;
	}
	.rb-dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 8px;
	}
	.rb-size-tips {
		display: grid;
		gap: 16px;
		padding-left: 20px;
		color: #7d7362;
		font-size: 13px;
		line-height: 22px;
	}
	.rb-size-tip {
		color: #7d652d;
		font-size: 12px;
		line-height: 21px;
	}
	@media (min-width: 1600px) {
		.rb-heading,
		.rb-progress {
			max-width: 1580px;
		}
		.rb-workspace {
			max-width: 1420px;
			grid-template-columns: minmax(0, 1.65fr) minmax(420px, 1fr);
		}
	}
	@media (max-width: 1100px) {
		.rb-workspace {
			gap: 28px;
			grid-template-columns: minmax(0, 1fr) minmax(350px, 1fr);
		}
		.rb-canvas {
			min-height: 390px;
		}
		.rb-preview-caption {
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
		}
		.rb-shape-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (min-width: 768px) {
		.rb-panel {
			display: flex;
			flex-direction: column;
			max-height: max(500px, calc(100svh - 370px));
		}
		.rb-panel-body {
			overflow-y: auto;
			padding-right: 6px;
			scrollbar-width: thin;
			scrollbar-color: #ddd5c4 transparent;
		}
		.rb-panel-footer {
			flex-shrink: 0;
			margin-top: 16px;
		}
		.rb-canvas {
			min-height: 360px;
			height: clamp(360px, calc(100svh - 500px), 500px);
		}
	}
	@media (max-width: 767px) {
		.rb-studio {
			padding: 22px 18px 35px;
		}
		.rb-heading {
			align-items: flex-start;
			gap: 12px;
		}
		.rb-eyebrow {
			font-size: 8px;
			letter-spacing: 1.2px;
		}
		.rb-heading h1 {
			margin-top: 9px;
			font-size: 28px;
		}
		.rb-intro {
			max-width: 285px;
			font-size: 10px;
			line-height: 18px;
		}
		:global(.rb-reset) {
			gap: 5px;
			min-width: 0;
			padding: 0;
			font-size: 0;
		}
		:global(.rb-reset svg) {
			width: 17px;
			height: 17px;
		}
		.rb-progress {
			margin: 20px 0 18px;
			padding: 13px 0;
		}
		.rb-progress ol {
			gap: 3px;
		}
		.rb-progress button {
			flex-direction: column;
			gap: 7px;
			min-height: 48px;
			font-size: 9px;
		}
		.rb-progress li:not(:last-child)::after {
			top: 13px;
			right: -17%;
			width: 34%;
		}
		.rb-step-number {
			width: 28px;
			height: 28px;
			font-size: 10px;
		}
		.rb-workspace {
			display: flex;
			flex-direction: column;
			gap: 23px;
		}
		.rb-preview-column {
			position: static;
			width: 100%;
		}
		.rb-canvas {
			min-height: 0;
			height: 300px;
			border-radius: 9px;
		}
		.rb-canvas-top {
			padding: 16px;
		}
		.rb-ring-image {
			inset: 2px 0 -5px;
		}
		.rb-ring-image img {
			width: 88%;
			max-width: 340px;
		}
		.rb-canvas-bottom {
			padding: 12px;
		}
		.rb-canvas-bottom > span {
			font-size: 8px;
		}
		.rb-preview-caption {
			flex-direction: row;
			align-items: center;
			gap: 12px;
			padding: 16px 0;
		}
		.rb-preview-caption h2 {
			font-size: 20px;
		}
		.rb-preview-caption > span {
			max-width: 110px;
			font-size: 9px;
			white-space: normal;
			text-align: right;
			line-height: 17px;
		}
		.rb-design-note {
			display: none;
		}
		.rb-panel {
			width: 100%;
		}
		.rb-panel-heading h2 {
			font-size: 28px;
		}
		.rb-panel-heading p {
			font-size: 11px;
		}
		.rb-panel legend {
			font-size: 12px;
		}
		.rb-style-option {
			min-height: 95px;
		}
		.rb-style-option > span,
		.rb-segments button {
			font-size: 11px;
		}
		.rb-segments button {
			min-height: 44px;
		}
		.rb-shape-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.rb-shape-option {
			min-height: 85px;
		}
		.rb-shape-option span {
			font-size: 11px;
		}
		.rb-carats {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.rb-help p {
			font-size: 11px;
		}
		.rb-panel-footer {
			position: sticky;
			bottom: 0;
			z-index: 4;
			margin: 24px -18px -35px;
			padding: 14px 18px 16px;
			background: #fff;
			box-shadow: 0 -5px 18px #3026100a;
		}
		:global(.rb-next),
		:global(.rb-back) {
			height: 48px;
			font-size: 12px;
		}
		.rb-engraving-preview {
			bottom: 63px;
			font-size: 19px;
		}
		.rb-estimate strong {
			font-size: 30px;
		}
		.rb-field-header label,
		.rb-engraving-field label {
			font-size: 12px;
		}
		.rb-review dd {
			font-size: 12px;
			line-height: 21px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.rb-ring-image img {
			transition: none;
		}
	}
</style>
