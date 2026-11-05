<script lang="ts">
	import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleDot, ClipboardCheck, Download, Gem, Info, Minus, Palette, PencilLine, Plus, RotateCcw, Ruler } from '@lucide/svelte'
	import { tick } from 'svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import Input from '$lib/components/ui/input/input.svelte'
	import * as Dialog from '$lib/components/ui/dialog/index.js'
	import * as Select from '$lib/components/ui/select/index.js'
	import RjRingPreview from './RjRingPreview.svelte'

	const steps = ['Setting', 'Diamond', 'Metal', 'Personalise', 'Review']
	const stepIcons = [CircleDot, Gem, Palette, PencilLine, ClipboardCheck]
	const titles = [
		'Choose a setting',
		'Choose a diamond',
		'Choose your metal',
		'Size & engraving',
		'Review your design',
	]
	const descriptions = [
		'Select the band, side detail and centre setting.',
		'Choose the shape and weight of your centre diamond.',
		'Compare gold colours and choose the purity.',
		'Choose a US ring size and an optional engraving.',
		'Check each selection before saving your design.',
	]
	const styles = [
		{ name: 'Classic', detail: 'A timeless, clean band', price: 430 },
		{ name: 'Cathedral', detail: 'An elegantly raised centre', price: 490 },
		{ name: 'Twist', detail: 'Two beautifully woven lines', price: 550 },
		{
			name: 'Split shank',
			detail: 'A graceful, open silhouette',
			price: 590,
		},
		{ name: 'Double band', detail: 'A little more presence', price: 650 },
		{ name: 'Pinched', detail: 'Soft lines, a tapered finish', price: 490 },
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
	let livePreview = $state(true)
	let previewReset = $state(0)
	let resetOpen = $state(false)
	let sizeGuideOpen = $state(false)
	let status = $state('')

	// shortcut: estimates illustrate the UI; replace with validated quotes before selling.
	const settingEstimate = $derived(
		styles[selection.style].price + sides[selection.side].price + crowns[selection.crown].price + (selection.purity === '18K' ? 210 : 0),
	)
	const estimate = $derived(settingEstimate + carats[selection.carat].price)
	const summary = $derived([
		{ label: 'Setting', value: `${styles[selection.style].name} · ${sides[selection.side].name} · ${crowns[selection.crown].name}`, step: 0 },
		{ label: 'Diamond', value: `${selection.shape} · ${carats[selection.carat].size} ct · Lab grown`, step: 1 },
		{ label: 'Metal', value: `${selection.purity} ${selection.metal.toLowerCase()}`, step: 2 },
		{ label: 'Ring size', value: `US ${selection.size}`, step: 3 },
		{ label: 'Engraving', value: selection.engraving || 'No engraving', step: 3 },
	])
	const stepDetails = $derived([styles[selection.style].name, `${selection.shape} · ${carats[selection.carat].size} ct`, `${selection.purity} ${selection.metal.toLowerCase()}`, `US ${selection.size}${selection.engraving ? ' · Engraved' : ''}`, 'Save your design'])
	const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
	const shapeImage = (shape: string) => shape === 'Heart'
		? '/ryans-jewels/product/customizer/heart.svg'
		: `/ryans-jewels/diamonds/${shape.toLowerCase()}.jpg`

	const styleImage = (name: string) => `/ryans-jewels/ring-builder/options/realistic/${name.toLowerCase().replaceAll(' ', '-')}.webp`

	async function goToStep(index: number) {
		step = index
		status = ''
		await tick()
		const heading = document.getElementById('rb-step-heading')
		heading?.focus({ preventScroll: true })
		heading?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
	}

	function reset() {
		selection = { ...defaults }
		zoom = 1
		previewReset += 1
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
	<header class="rb-header">
		<div class="rb-heading">
			<a class="rb-return" href="/products" aria-label="Back to jewellery"><ArrowLeft size={19} aria-hidden="true" /></a>
			<div><p class="rb-eyebrow">RYAN JEWELERS</p><h1 id="rb-title">Design your ring</h1></div>
		</div>
		<div class="rb-header-actions">
			<a class="rb-header-help" href="/contact-us">Talk to a jewellery expert <ArrowRight size={14} aria-hidden="true" /></a>
			<Button variant="ghost" class="rb-reset" title="Start over" onclick={() => (resetOpen = true)}><RotateCcw size={14} aria-hidden="true" /> Start over</Button>
		</div>
	</header>

	<div class="rb-workspace">
		<nav class="rb-progress" aria-label="Ring design steps">
			<p class="rb-progress-label">Your design</p>
			<ol>
				{#each steps as label, index}
					{@const StepIcon = stepIcons[index]}
					<li class:current={step === index} class:complete={step > index}>
						<button type="button" aria-current={step === index ? 'step' : undefined} onclick={() => goToStep(index)} aria-label={`Step ${index + 1}: ${label}`}>
							<span class="rb-step-icon" aria-hidden="true">{#if step > index}<Check size={18} strokeWidth={1.6} />{:else}<StepIcon size={18} strokeWidth={1.5} />{/if}</span>
							<span class="rb-step-copy"><span>{label}</span><small>{stepDetails[index]}</small></span>
						</button>
					</li>
				{/each}
			</ol>
			<div class="rb-rail-note"><button type="button" aria-label="Open ring size guide" onclick={() => (sizeGuideOpen = true)}><Ruler size={18} strokeWidth={1.5} aria-hidden="true" /><span><b>Size guide</b><small>Find your fit</small></span><ArrowRight size={13} aria-hidden="true" /></button></div>
		</nav>

		<div class="rb-preview-column">
			<div class="rb-preview-top">
				<div><p>YOUR RING</p><h2>{selection.shape} {crowns[selection.crown].name.toLowerCase()}</h2></div>
				<span class="rb-view-label">{livePreview ? '360° LIVE PREVIEW' : 'STYLE REFERENCE'}</span>
			</div>
			<div class="rb-canvas">
				{#if livePreview}
					<RjRingPreview
						options={{ style: selection.style, side: selection.side, crown: selection.crown, shape: selection.shape, carat: Number(carats[selection.carat].size), metal: selection.metal }}
						{zoom}
						onzoom={(value) => (zoom = value)}
						resetKey={previewReset}
						poster={styleImage(styles[selection.style].name)}
					/>
				{:else}
					<img class="rb-style-reference" src={styleImage(styles[selection.style].name)} alt={`${styles[selection.style].name} band style reference`} width="480" height="480" />
				{/if}
			</div>
			<div class="rb-viewer-tools">
				<div class="rb-preview-mode" aria-label="Ring preview mode">
					<button type="button" aria-pressed={livePreview} onclick={() => (livePreview = true)}><RotateCcw size={13} aria-hidden="true" />360° preview</button>
					<button type="button" aria-pressed={!livePreview} onclick={() => (livePreview = false)}>Style reference</button>
				</div>
				{#if livePreview}<div class="rb-view-tools" aria-label="Preview zoom">
					<button type="button" aria-label="Zoom out" disabled={zoom <= .7} onclick={() => (zoom = Math.max(.7, zoom - 0.2))}><Minus size={15} aria-hidden="true" /></button>
					<button type="button" aria-label="Reset 3D view" onclick={() => { zoom = 1; previewReset += 1 }}><RotateCcw size={14} aria-hidden="true" /></button>
					<button type="button" aria-label="Zoom in" disabled={zoom >= 1.8} onclick={() => (zoom = Math.min(1.8, zoom + 0.2))}><Plus size={15} aria-hidden="true" /></button>
				</div>{/if}
			</div>
			<div class="rb-preview-caption"><span>{styles[selection.style].name} band</span><span><b>{carats[selection.carat].size} ct</b><i aria-hidden="true"></i>{selection.purity} {selection.metal.toLowerCase()}</span></div>
			<p class="rb-reference-note">{livePreview ? '3D visualisation. Final proportions are confirmed with your design.' : 'Illustrative style reference. Your selected diamond and metal are shown in the 360° preview.'}</p>
		</div>

		<div class="rb-panel">
			<div class="rb-panel-body" id="rb-options" role="region" aria-labelledby="rb-step-heading">
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
									aria-label={style.name}
									aria-describedby={`rb-style-detail-${index}`}
									class:selected={selection.style === index}
									aria-pressed={selection.style === index}
									onclick={() => (selection.style = index)}
								>
									<img src={styleImage(style.name)} alt="" width="480" height="480" />
									<span>{style.name}</span><small id={`rb-style-detail-${index}`}>{style.detail}</small>
									{#if selection.style === index}<Check class="rb-option-check" size={12} aria-hidden="true" />{/if}
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
						<div class="rb-crown-grid">
							{#each crowns as crown, index}<button
									type="button"
									class="rb-crown-option"
									aria-label={crown.name}
									class:selected={selection.crown === index}
									aria-pressed={selection.crown === index}
									onclick={() => (selection.crown = index)}><img src={`/ryans-jewels/ring-builder/options/crown-${crown.name.toLowerCase().replaceAll(' ', '-')}.webp`} alt="" width="300" height="180" /><span>{crown.name}</span>{#if selection.crown === index}<Check class="rb-option-check" size={12} aria-hidden="true" />{/if}</button
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
									aria-label={`${carat.size} ct`}
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
									><img class="rb-metal-swatch" src={`/ryans-jewels/product/customizer/metal-${['white', 'yellow', 'rose'][index]}.webp`} alt="" /><span
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
						><Select.Trigger id="rb-size" class="rb-size-select" aria-label="US ring size">US {selection.size}</Select.Trigger><Select.Content class="rb-size-options"
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
	.rb-studio { --rb-gold: var(--rj-gold, #cca646); --rb-ink: var(--rj-ink, #404040); --rb-muted: #707070; --rb-line: #e7e5df; --rb-site-header: 130px; width: 100%; max-width: 1800px; margin: 0 auto; padding: 0 32px 32px; color: var(--rb-ink); font: 400 13px/1.5 'Sarala', var(--font-body, sans-serif); }
	.rb-studio :is(h1, h2, p) { margin: 0; }
	.rb-studio :is(h1, h2) { letter-spacing: 0; }
	.rb-header { display: flex; min-height: 88px; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid var(--rb-line); }
	.rb-heading, .rb-header-actions { display: flex; align-items: center; gap: 18px; }
	.rb-return { display: grid; width: 40px; height: 44px; place-items: center; border-right: 1px solid var(--rb-line); color: #606060; }
	.rb-eyebrow { color: #876917; font: 10px/18px 'Sarala', var(--font-body, sans-serif); letter-spacing: 1.1px; }
	.rb-header h1 { color: #202020; font: 400 29px/1.25 'Rozha One', var(--font-heading, serif); }
	.rb-header-help { display: flex; min-height: 44px; align-items: center; gap: 8px; color: #6f5b2f; font-size: 12px; }
	.rb-header-help:hover { text-decoration: underline; text-underline-offset: 4px; }
	:global(.rb-reset) { min-height: 40px; gap: 7px; padding: 8px 12px; border: 1px solid #d9d5ca; border-radius: 4px; background: #fff; color: #606060; font: 12px 'Sarala', var(--font-body, sans-serif); box-shadow: none; }
	:global(.rb-reset:hover) { border-color: #b3995c; background: #fcfaf4; color: #404040; }
	.rb-workspace { display: grid; grid-template-columns: 164px minmax(0, 1fr) 400px; height: calc(100svh - 250px); min-height: 620px; max-height: 850px; overflow: clip; border: 1px solid var(--rb-line); border-top: 0; }
	.rb-progress { display: flex; min-height: 0; flex-direction: column; padding: 23px 10px 18px; border-right: 1px solid var(--rb-line); background: #fff; }
	.rb-progress-label { margin: 0 9px 18px !important; padding-bottom: 15px; border-bottom: 1px solid var(--rb-line); color: #404040; font: 14px/22px 'Sarala', sans-serif; }
	.rb-progress ol { display: grid; gap: 9px; margin: 0; padding: 0; list-style: none; }
	.rb-progress li { min-width: 0; }
	.rb-progress button { display: flex; width: 100%; min-height: 73px; align-items: center; gap: 10px; padding: 12px 9px; border: 1px solid transparent; border-radius: 4px; background: #fff; text-align: left; cursor: pointer; }
	.rb-progress .current > button { border-color: #b99435; background: var(--rb-gold); }
	.rb-progress li:not(.current) > button:hover { border-color: #e1d8c2; background: #fcfbf8; }
	.rb-step-icon { display: grid; width: 31px; height: 34px; flex-shrink: 0; place-items: center; border: 1px solid #e7e3d9; border-radius: 4px; background: #faf9f5; color: #8c805f; }
	.rb-step-copy { display: flex; min-width: 0; flex-direction: column; gap: 4px; }
	.rb-step-copy > span { color: #505050; font: 13px/20px 'Sarala', sans-serif; }
	.rb-step-copy small { color: #747474; font-size: 10px; line-height: 15px; overflow-wrap: anywhere; }
	.complete .rb-step-icon { border-color: #dfd3b5; background: #faf6ea; color: #876917; }
	.current .rb-step-icon { border-color: #ffffff70; background: #ffffff75; color: #493b1c; }
	.current .rb-step-copy > span { color: #302711; }
	.current .rb-step-copy small { color: #493b1c; }
	.rb-rail-note { margin-top: auto; padding-top: 19px; border-top: 1px solid var(--rb-line); }
	.rb-rail-note > button { min-height: 67px; gap: 8px; padding: 10px 8px; border-color: #e5ddc9; background: #faf6ea; color: #876917; }
	.rb-rail-note > button:hover { border-color: #c9b579; background: #f6f0df; }
	.rb-rail-note > button > :global(svg) { flex-shrink: 0; }
	.rb-rail-note > button > :global(svg:last-child) { margin-left: auto; }
	.rb-rail-note span { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
	.rb-rail-note b { color: #62512b; font: 400 12px/18px 'Sarala', sans-serif; }
	.rb-rail-note small { color: #81765e; font: 10px/15px 'Sarala', var(--font-body, sans-serif); }
	.rb-preview-column { position: relative; display: flex; min-width: 0; min-height: 0; flex-direction: column; background: #faf9f6; }
	.rb-preview-top { display: flex; min-height: 77px; flex-shrink: 0; align-items: center; justify-content: space-between; gap: 16px; padding: 17px 24px; }
	.rb-preview-top p { margin-bottom: 4px; color: #8c8067; font-size: 8px; letter-spacing: 1.5px; }
	.rb-preview-top h2 { color: #403b31; font: 400 21px/1.25 'Sarala', var(--font-body, sans-serif); text-transform: capitalize; }
	.rb-view-label { display: flex; flex-shrink: 0; align-items: center; gap: 6px; color: #847655; font-size: 8px; letter-spacing: .8px; }
	.rb-view-label::before { width: 4px; height: 4px; border-radius: 50%; background: #b29550; content: ''; }
	.rb-canvas { position: relative; flex: 1; min-height: 0; overflow: hidden; }
	.rb-style-reference { position: absolute; inset: 0; width: 100%; height: 100%; padding: 10px 30px; object-fit: contain; }
	.rb-viewer-tools { display: flex; min-height: 52px; flex-shrink: 0; align-items: center; justify-content: space-between; gap: 10px; padding: 5px 20px; }
	.rb-preview-mode { display: flex; gap: 18px; }
	.rb-preview-mode > button { display: flex; min-height: 40px; align-items: center; gap: 6px; padding: 4px 0; border: 0; border-bottom: 1px solid transparent; background: transparent; color: #827b6d; font: 11px 'Sarala', var(--font-body, sans-serif); cursor: pointer; }
	.rb-preview-mode > button[aria-pressed='true'] { border-bottom-color: #a98a3c; color: #584722; }
	.rb-view-tools { display: flex; gap: 2px; }
	.rb-view-tools > button { display: grid; width: 36px; height: 40px; place-items: center; border: 0; background: transparent; color: #796c50; cursor: pointer; }
	.rb-view-tools > button:hover { background: #eee9dd; }
	.rb-view-tools > button:disabled { opacity: .35; cursor: default; }
	.rb-preview-caption { display: flex; flex-shrink: 0; align-items: center; justify-content: space-between; gap: 14px; padding: 15px 24px 8px; border-top: 1px solid #eae6dc; color: #6e6554; font-size: 11px; }
	.rb-preview-caption > span:first-child { color: #4f4738; font: 14px 'Sarala', sans-serif; }
	.rb-preview-caption > span:last-child { display: flex; align-items: center; gap: 9px; text-align: right; }
	.rb-preview-caption b { font-weight: 400; white-space: nowrap; }
	.rb-preview-caption i { width: 1px; height: 12px; flex-shrink: 0; background: #d9d1bf; }
	.rb-reference-note { flex-shrink: 0; padding: 0 24px 18px; color: #827b6d; font-size: 10px; line-height: 17px; }
	.rb-panel { display: flex; min-width: 0; min-height: 0; flex-direction: column; border-left: 1px solid var(--rb-line); background: #fff; }
	.rb-panel-body { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 25px 23px 22px; scrollbar-width: thin; scrollbar-color: #d5c9ad transparent; }
	.rb-panel-body::-webkit-scrollbar { width: 4px; }
	.rb-panel-body::-webkit-scrollbar-thumb { border-radius: 3px; background: #d5c9ad; }
	.rb-panel-heading { margin-bottom: 24px; }
	.rb-panel-heading .rb-eyebrow { color: #97865f; font-size: 9px; }
	.rb-panel-heading h2 { margin-top: 5px; color: #292929; font: 400 23px/1.35 'Sarala', sans-serif; }
	.rb-panel-heading h2:focus { outline: none; }
	.rb-panel-heading p { margin-top: 5px; color: #777; font-size: 12px; line-height: 19px; }
	.rb-panel fieldset { min-width: 0; margin: 0 0 24px; padding: 0; border: 0; }
	.rb-panel fieldset:last-child { margin-bottom: 0; }
	.rb-panel legend { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; padding: 0; color: #424242; font: 13px 'Sarala', sans-serif; }
	.rb-panel legend > span { color: #887340; font: 11px 'Sarala', var(--font-body, sans-serif); }
	.rb-style-grid, .rb-crown-grid, .rb-shape-grid, .rb-metal-grid, .rb-purity-grid, .rb-carats { display: grid; gap: 8px; }
	.rb-style-grid, .rb-crown-grid, .rb-shape-grid, .rb-metal-grid, .rb-carats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	.rb-style-option, .rb-crown-option, .rb-shape-option, .rb-metal-option, .rb-purity-grid button, .rb-segments button, .rb-carats button { position: relative; min-width: 0; border: 1px solid #e2dfd7; border-radius: 4px; background: #fff; color: #57534a; cursor: pointer; transition: border-color .15s ease, background-color .15s ease; }
	.rb-panel button.selected { border-color: #b8994a; background: #fcf8ed; box-shadow: inset 0 0 0 .5px #b8994a; color: #40351c; }
	.rb-panel :is(.rb-style-option, .rb-crown-option, .rb-shape-option, .rb-metal-option, .rb-purity-grid button, .rb-segments button, .rb-carats button):not(.selected):hover { border-color: #baaf96; background-color: #fcfbf8; }
	.rb-style-option, .rb-crown-option { display: flex; min-height: 104px; flex-direction: column; align-items: stretch; overflow: hidden; padding: 0; }
	.rb-style-option > img { display: block; width: 100%; height: 82px; object-fit: contain; background: #f4eee6; }
	.rb-style-option > span, .rb-crown-option > span { display: block; padding: 8px 2px; font: 11px/17px 'Sarala', var(--font-body, sans-serif); text-align: center; }
	.rb-style-option small { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
	.rb-panel :global(.rb-option-check) { position: absolute; top: 5px; right: 5px; width: 15px; height: 15px; padding: 2px; border-radius: 50%; background: #a78a42; color: #fff; }
	.rb-segments { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; }
	.rb-segments button { min-height: 44px; padding: 7px 3px; font: 11px 'Sarala', var(--font-body, sans-serif); }
	.rb-crown-option { min-height: 91px; }
	.rb-crown-option > img { display: block; width: 100%; height: 58px; object-fit: contain; mix-blend-mode: multiply; background: #fafafa; }
	.rb-shape-option { display: flex; min-height: 85px; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 12px 4px; }
	.rb-shape-option > img { width: 34px; height: 34px; object-fit: contain; mix-blend-mode: multiply; }
	.rb-shape-option > span { font: 11px 'Sarala', var(--font-body, sans-serif); }
	.rb-carats button { min-height: 53px; padding: 8px 4px; font: 14px 'Sarala', var(--font-body, sans-serif); }
	.rb-carats small { display: inline; margin-left: 3px; color: #777; font-size: 10px; }
	.rb-help { display: flex; align-items: flex-start; gap: 9px; padding: 12px; border-radius: 3px; background: #f8f6f0; color: #9b8347; }
	.rb-help :global(svg) { flex-shrink: 0; margin-top: 2px; }
	.rb-help p { color: #7b7567; font-size: 11px; line-height: 18px; }
	.rb-metal-option { display: flex; min-height: 112px; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 16px 3px 12px; font: 11px 'Sarala', var(--font-body, sans-serif); }
	.rb-metal-swatch { width: 62px; height: 42px; object-fit: contain; mix-blend-mode: multiply; }
	.rb-metal-option :global(svg) { position: absolute; top: 7px; right: 7px; color: #98792d; }
	.rb-purity-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	.rb-purity-grid button { display: flex; min-height: 84px; flex-direction: column; gap: 6px; padding: 15px 12px; text-align: left; }
	.rb-purity-grid strong { font: 400 16px 'Sarala', sans-serif; }
	.rb-purity-grid span { color: #777; font: 10px 'Sarala', var(--font-body, sans-serif); }
	.rb-purity-grid :global(svg) { position: absolute; top: 17px; right: 9px; color: #98792d; }
	.rb-field-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
	.rb-field-header label, .rb-engraving-field label { color: #424242; font: 13px 'Sarala', sans-serif; }
	.rb-field-header > button { display: flex; min-height: 44px; align-items: center; gap: 5px; padding: 5px 0; border: 0; background: transparent; color: #8b6d28; font: 11px 'Sarala', var(--font-body, sans-serif); cursor: pointer; }
	:global(.rb-size-select), :global(.rb-engraving-input) { height: 46px; border-color: #d8d2c3; border-radius: 4px; background: #fff; color: #404040; font: 16px 'Sarala', var(--font-body, sans-serif); box-shadow: none; }
	:global(.rb-size-options) { font-family: 'Sarala', var(--font-body, sans-serif); }
	.rb-field-note { margin-top: 7px !important; color: #777; font-size: 10px; line-height: 18px; }
	.rb-engraving-field { margin-top: 26px; }
	.rb-engraving-field label { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 11px; }
	.rb-engraving-field label > span { color: #777; font: 10px/21px 'Sarala', var(--font-body, sans-serif); }
	.rb-input-wrap { position: relative; }
	:global(.rb-engraving-input) { padding-right: 53px; }
	.rb-input-wrap > span { position: absolute; top: 15px; right: 12px; color: #888; font-size: 10px; }
	.rb-inscription { margin-top: 24px; padding: 25px 15px; border-top: 1px solid #e6dfcd; border-bottom: 1px solid #e6dfcd; background: #fbf9f3; text-align: center; }
	.rb-inscription > span { color: #98814a; font-size: 8px; letter-spacing: 1.4px; }
	.rb-inscription p { margin: 13px 0; color: #725a27; font: 400 25px 'Sarala', var(--font-body, sans-serif); overflow-wrap: anywhere; }
	.rb-inscription small { color: #827a68; font-size: 10px; }
	.rb-review-header { display: flex; align-items: center; gap: 11px; margin-bottom: 12px; padding: 14px 0; }
	.rb-review-header > span { display: grid; width: 30px; height: 30px; flex-shrink: 0; place-items: center; border: 1px solid #c5b075; border-radius: 50%; color: #94752c; }
	.rb-review-header strong { color: #4b4434; font: 14px 'Sarala', sans-serif; }
	.rb-review-header p { margin-top: 4px; color: #777; font-size: 11px; line-height: 18px; }
	.rb-review { margin: 0 0 20px; }
	.rb-review > div { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 5px 12px; padding: 15px 0; border-bottom: 1px solid var(--rb-line); }
	.rb-review dt { color: #888; font-size: 10px; }
	.rb-review dd { grid-column: 1; margin: 0; color: #48443c; font: 13px/1.6 'Sarala', sans-serif; overflow-wrap: anywhere; }
	.rb-review button { grid-column: 2; grid-row: 1 / 3; align-self: center; min-height: 44px; padding: 6px; border: 0; background: transparent; color: #8b6d28; font: 11px 'Sarala', var(--font-body, sans-serif); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
	.rb-panel-footer { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) auto; flex-shrink: 0; gap: 12px; padding: 18px 23px 20px; border-top: 1px solid var(--rb-line); background: #fff; }
	.rb-estimate { grid-column: 1; grid-row: 1; }
	.rb-estimate > div > span { display: block; margin-bottom: 3px; color: #888; font-size: 10px; }
	.rb-estimate strong { display: block; color: #303030; font: 400 26px/1.25 'Sarala', sans-serif; }
	.rb-breakdown { grid-column: 2; grid-row: 1; align-self: end; }
	.rb-breakdown > summary { display: flex; min-height: 35px; align-items: center; gap: 5px; color: #8b6d28; font-size: 10px; list-style: none; cursor: pointer; }
	.rb-breakdown > summary::-webkit-details-marker { display: none; }
	.rb-breakdown[open] summary :global(svg) { transform: rotate(180deg); }
	.rb-breakdown > div { position: absolute; z-index: 6; right: 15px; bottom: calc(100% + 8px); left: 15px; padding: 18px; border: 1px solid #dfd7c3; border-radius: 4px; background: #fff; box-shadow: 0 6px 24px #40361c14; }
	.rb-breakdown p { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 10px; color: #777; font-size: 11px; line-height: 19px; }
	.rb-breakdown b { color: #404040; font-weight: 400; white-space: nowrap; }
	.rb-breakdown small { display: block; color: #888; font-size: 10px; line-height: 17px; }
	.rb-step-actions { display: flex; grid-column: 1 / -1; grid-row: 2; gap: 8px; }
	:global(.rb-next) { flex: 1; min-width: 0; height: 46px; justify-content: space-between; gap: 10px; padding: 0 16px; border: 1px solid #ad8b37; border-radius: 4px; background: var(--rj-gold, #cca646); color: #302710; font: 13px 'Sarala', var(--font-body, sans-serif); box-shadow: none; }
	:global(.rb-next:hover) { border-color: #9d7d2d; background: #bf9c42; }
	:global(.rb-back) { width: 44px; height: 46px; flex-shrink: 0; padding: 0; border-color: #ded8c9; border-radius: 4px; background: #fff; color: #8a7750; box-shadow: none; }
	:global(.rb-back:hover) { border-color: #b69a58; background: #faf7ef; }
	.rb-status { grid-column: 1 / -1; color: #6e6656; font-size: 11px; line-height: 19px; }
	.rb-status:empty { display: none; }
	.rb-studio :is(button, summary, a):focus-visible { outline: 2px solid #876917; outline-offset: 3px; }
	:global(.rb-dialog) { border-color: #d8cdb6; border-radius: 4px; background: #fff; color: #404040; font-family: 'Sarala', var(--font-body, sans-serif); }
	:global(.rb-dialog h2) { font: 23px 'Sarala', sans-serif; letter-spacing: 0; }
	:global(.rb-dialog button:focus-visible) { outline: 2px solid #876917; outline-offset: 3px; }
	:global(.rb-dialog button:not([data-dialog-close])) { min-height: 44px; }
	.rb-dialog-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
	.rb-size-tips { display: grid; gap: 14px; padding-left: 20px; color: #606060; font-size: 13px; line-height: 22px; }
	.rb-size-tip { color: #707070; font-size: 12px; line-height: 21px; }
	@media (max-width: 1250px) {
		.rb-studio { padding-inline: 24px; }
		.rb-workspace { grid-template-columns: 146px minmax(0, 1fr) 360px; }
		.rb-progress { padding-inline: 7px; }
		.rb-progress button { gap: 8px; padding-inline: 7px; }
		.rb-step-icon { width: 28px; height: 32px; }
		.rb-step-copy > span { font-size: 12px; }
		.rb-preview-top { padding-inline: 20px; }
		.rb-preview-top h2 { font-size: 19px; }
		.rb-view-label { display: none; }
		.rb-viewer-tools { padding-inline: 14px; }
		.rb-preview-mode { gap: 12px; }
		.rb-preview-mode > button { font-size: 10px; }
		.rb-view-tools > button { width: 31px; }
		.rb-panel-body { padding-inline: 18px; }
		.rb-panel-footer { padding-inline: 18px; }
	}
	@media (max-width: 1000px) {
		.rb-studio { padding-inline: 20px; }
		.rb-header { min-height: 76px; }
		.rb-header h1 { font-size: 27px; }
		.rb-header-help { font-size: 11px; }
		.rb-workspace { grid-template-columns: minmax(0, 1fr) 360px; grid-template-rows: auto minmax(0, 1fr); height: calc(100svh - 220px); min-height: 640px; }
		.rb-progress { grid-column: 1 / -1; display: block; padding: 5px 8px; border-right: 0; border-bottom: 1px solid var(--rb-line); }
		.rb-progress-label, .rb-rail-note, .rb-step-copy small { display: none; }
		.rb-progress ol { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 5px; }
		.rb-progress button { min-height: 53px; align-items: center; justify-content: center; gap: 8px; padding: 8px 4px; border: 1px solid transparent; border-radius: 4px; }
		.rb-progress .current > button { border-color: #b99435; }
		.rb-preview-column { grid-column: 1; grid-row: 2; }
		.rb-panel { grid-column: 2; grid-row: 2; }
	}
	@media (max-width: 760px) {
		.rb-studio { --rb-compact-view: clamp(220px, 33svh, 290px); padding: 0 0 25px; }
		.rb-header { min-height: 75px; gap: 12px; padding: 0 16px; }
		.rb-heading { gap: 10px; }
		.rb-return { width: 27px; padding-right: 8px; }
		.rb-header h1 { font-size: 25px; }
		.rb-header .rb-eyebrow { font-size: 8px; line-height: 16px; }
		.rb-header-help { display: none; }
		.rb-header-actions { gap: 0; }
		:global(.rb-reset) { min-height: 40px; padding: 8px 9px; font-size: 11px; }
		.rb-workspace { display: flex; height: auto; min-height: 0; max-height: none; flex-direction: column; overflow: visible; border-right: 0; border-left: 0; }
		.rb-progress { padding: 6px 8px; }
		.rb-progress button { min-height: 64px; flex-direction: column; gap: 5px; padding: 6px 1px; }
		.rb-step-icon { width: 25px; height: 25px; }
		.rb-step-icon :global(svg) { width: 15px; height: 15px; }
		.rb-step-copy > span { font-size: 11px; line-height: 18px; }
		.rb-preview-column { position: sticky; z-index: 3; top: var(--rb-site-header); height: var(--rb-compact-view); min-height: var(--rb-compact-view); border-bottom: 1px solid var(--rb-line); }
		.rb-preview-top { min-height: 44px; padding: 9px 16px 4px; }
		.rb-preview-top p { display: none; }
		.rb-preview-top h2 { font-size: 18px; }
		.rb-view-label { display: flex; font-size: 7px; }
		.rb-style-reference { padding: 0 35px; }
		.rb-viewer-tools { min-height: 43px; padding: 0 12px; }
		.rb-preview-mode { gap: 18px; }
		.rb-preview-mode > button { min-height: 40px; font-size: 10px; }
		.rb-view-tools > button { width: 34px; }
		.rb-preview-caption { gap: 9px; padding: 9px 16px 6px; font-size: 10px; }
		.rb-preview-caption > span:first-child { font-size: 11px; }
		.rb-preview-caption > span:last-child { gap: 6px; }
		.rb-preview-caption i { height: 9px; }
		.rb-reference-note { padding: 0 16px 10px; font-size: 8px; line-height: 13px; }
		.rb-panel { overflow: visible; border-left: 0; }
		.rb-panel-body { overflow: visible; padding: 24px 20px; }
		.rb-panel-heading h2 { scroll-margin-top: calc(var(--rb-site-header) + var(--rb-compact-view) + 24px); }
		.rb-panel-footer { position: sticky; z-index: 4; bottom: 0; padding: 15px 20px 17px; box-shadow: 0 -5px 18px #40361c08; }
		.rb-style-option > img { height: 82px; }
		.rb-panel-heading { margin-bottom: 22px; }
		.rb-panel-heading h2 { font-size: 23px; }
		.rb-panel fieldset { margin-bottom: 23px; }
		.rb-dialog-actions { flex-wrap: wrap; }
	}
	@media (max-width: 639px) {
		.rb-studio { --rb-site-header: 165px; --rb-compact-view: clamp(295px, 36svh, 325px); }
		.rb-header h1 { font-size: 24px; }
		.rb-step-copy > span { font-size: 10px; }
		.rb-preview-top h2 { font-size: 17px; }
		.rb-preview-top { min-height: 39px; padding-top: 7px; }
		.rb-reference-note { display: none; }
		.rb-panel-body { padding-inline: 16px; }
		.rb-panel-footer { padding-inline: 16px; }
		.rb-style-option > img { height: 75px; }
		.rb-style-option > span { font-size: 11px; }
	}
	@media (max-width: 380px) {
		.rb-header h1 { font-size: 22px; }
		:global(.rb-reset) { width: 36px; padding: 0; font-size: 0; }
		.rb-progress { padding-inline: 3px; }
		.rb-preview-caption { padding-inline: 12px; font-size: 9px; }
		.rb-preview-caption > span:first-child { font-size: 10px; }
		.rb-preview-mode { gap: 11px; }
	}
	@media (prefers-reduced-motion: reduce) {
		.rb-studio button { transition: none; }
	}
</style>
