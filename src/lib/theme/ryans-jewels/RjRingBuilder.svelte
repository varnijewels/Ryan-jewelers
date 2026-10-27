<script lang="ts">
	import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, Download, Gem, Info, Minus, Plus, RotateCcw, Ruler } from '@lucide/svelte'
	import { tick } from 'svelte'
	import { Button } from '$lib/components/ui/button'
	import Input from '$lib/components/ui/input/input.svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Select from '$lib/components/ui/select'
	import RjRingPreview from './RjRingPreview.svelte'

	const steps = ['Setting', 'Diamond', 'Metal', 'Personalise', 'Review']
	const titles = [
		'Choose your setting.',
		'Find your diamond.',
		'Choose your gold.',
		'Make it personal.',
		'Every detail, together.',
	]
	const descriptions = [
		'Find the silhouette that feels right for you.',
		'A favourite shape. Just the right amount of sparkle.',
		'Find the colour and gold purity you love.',
		'Find your fit and add a few meaningful words.',
		'Every detail, beautifully brought together.',
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
	let previewReset = $state(0)
	let resetOpen = $state(false)
	let sizeGuideOpen = $state(false)
	let status = $state('')

	// shortcut: estimates illustrate the UI; replace with validated quotes before selling.
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
	const shapeImage = (shape: string) => shape === 'Heart'
		? '/ryans-jewels/product/customizer/heart.svg'
		: `/ryans-jewels/diamonds/${shape.toLowerCase()}.jpg`

	async function goToStep(index: number) {
		step = index
		status = ''
		await tick()
		document.getElementById('rb-step-heading')?.focus({ preventScroll: true })
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
	<nav class="rb-breadcrumb" aria-label="Breadcrumb">
		<a href="/">Home</a><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">Ring Builder</span>
	</nav>
	<div class="rb-heading">
		<div class="rb-heading-copy">
			<p class="rb-eyebrow">THE RYAN RING STUDIO</p>
			<h1 id="rb-title">Create Your Own Ring</h1>
			<p class="rb-intro">Choose a setting, find your diamond, and make it yours.</p>
		</div>
		<Button variant="ghost" class="rb-reset" title="Start over" onclick={() => (resetOpen = true)}><RotateCcw size={14} /> Start over</Button>
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
					<span class="rb-preview-tag"><Gem size={14} aria-hidden="true" /> YOUR LIVE DESIGN</span><span class="rb-counter">360° VIEW</span>
				</div>
				<RjRingPreview
					options={{ style: selection.style, side: selection.side, crown: selection.crown, shape: selection.shape, carat: Number(carats[selection.carat].size), metal: selection.metal }}
					{zoom}
					onzoom={(value) => (zoom = value)}
					resetKey={previewReset}
					poster={`/ryans-jewels/ring-builder/${previewImage}.webp`}
				/>
				<div class="rb-canvas-bottom">
					<div class="rb-view-tools" aria-label="Preview zoom">
						<button type="button" aria-label="Zoom out" disabled={zoom <= .7} onclick={() => (zoom = Math.max(.7, zoom - 0.2))}
							><Minus size={15} /></button
						>
						<button type="button" aria-label="Reset 3D view" onclick={() => { zoom = 1; previewReset += 1 }}><RotateCcw size={14} /></button>
						<button type="button" aria-label="Zoom in" disabled={zoom >= 1.8} onclick={() => (zoom = Math.min(1.8, zoom + 0.2))}
							><Plus size={15} /></button
						>
					</div>
				</div>
			</div>
			<div class="rb-preview-caption">
				<div>
					<p>DESIGNED BY YOU</p>
					<h2>{selection.shape} {crowns[selection.crown].name.toLowerCase()} ring</h2>
				</div>
				<span class="rb-specs"><b>{carats[selection.carat].size} ct</b><span>{selection.purity} {selection.metal.toLowerCase()}</span></span>
			</div>
			<div class="rb-design-note">
				<Gem size={17} aria-hidden="true" />
				<p>A design as individual as you.<br /><span>Final proportions and pricing confirmed by our team.</span></p>
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
									aria-label={style.name}
									aria-describedby={`rb-style-detail-${index}`}
									class:selected={selection.style === index}
									aria-pressed={selection.style === index}
									onclick={() => (selection.style = index)}
								>
									<img src={`/ryans-jewels/ring-builder/options/style-${style.name.toLowerCase().replaceAll(' ', '-')}.webp`} alt="" width="300" height="180" />
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
	.rb-studio { --rb-gold: var(--rj-gold, #cca646); --rb-ink: #29251f; --rb-muted: #756f65; --rb-line: #e8e3da; box-sizing: border-box; width: 100%; max-width: 1564px; margin: 0 auto; padding: 0 32px 64px; background: #fff; color: var(--rb-ink); font: 400 14px/1.6 'Sarala', sans-serif; }
	.rb-studio :is(h1, h2, p) { margin: 0; }
	.rb-studio :is(h1, h2) { letter-spacing: normal; }
	.rb-breadcrumb { display: flex; min-height: 48px; align-items: center; gap: 8px; color: var(--rb-muted); font: 12px 'Lato', sans-serif; }
	.rb-breadcrumb a { color: var(--rb-muted); text-decoration: none; }
	.rb-breadcrumb a:hover { text-decoration: underline; }
	.rb-breadcrumb > span { color: var(--rb-ink); }
	.rb-heading { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 16px 0 26px; }
	.rb-heading-copy { min-width: 0; }
	.rb-eyebrow { color: #876917; font-size: 13px; }
	.rb-heading .rb-eyebrow { margin-bottom: 5px; color: #8b713e; font: 11px/20px 'Lato', sans-serif; letter-spacing: 2px; }
	.rb-heading h1 { color: var(--rb-ink); font: 400 clamp(30px, 2.4vw, 40px)/1.2 'Rozha One', serif; }
	.rb-intro { margin-top: 10px !important; color: var(--rb-muted); font: 14px/22px 'Lato', sans-serif; }
	:global(.rb-reset) { min-height: 42px; gap: 8px; padding: 8px 14px; border: 1px solid #e5dfd4; border-radius: 7px; background: #fff; color: #756f65; font: 12px 'Lato', sans-serif; }
	:global(.rb-reset:hover) { border-color: #cca646; color: #202020; }
	.rb-progress { margin: 0 0 24px; padding: 5px; border: 1px solid var(--rb-line); border-radius: 10px; background: #faf9f6; }
	.rb-progress ol { display: flex; width: 100%; margin: 0; padding: 0; gap: 4px; list-style: none; }
	.rb-progress li { position: relative; flex: 1; min-width: 0; }
	.rb-progress li::after { display: none; }
	.rb-progress li.current::after { display: none; }
	.rb-progress button { display: flex; width: 100%; min-height: 52px; align-items: center; justify-content: center; gap: 10px; padding: 10px 6px; border: 1px solid transparent; border-radius: 7px; background: none; color: var(--rb-muted); font: 13px 'Lato', sans-serif; cursor: pointer; }
	.rb-step-number { display: grid; width: 25px; height: 25px; flex-shrink: 0; place-items: center; border: 1px solid #dcd6cb; border-radius: 50%; font: 11px 'Lato', sans-serif; }
	.rb-progress .current button { border-color: #e5dcc9; background: #fff; color: var(--rb-ink); box-shadow: 0 2px 6px #352b1810; }
	.current .rb-step-number { border-color: #8b713e; background: #8b713e; color: #fff; }
	.complete .rb-step-number { border-color: #dfd4bc; background: #f5efdf; color: #856b37; }
	.rb-workspace { display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(430px, 1fr); align-items: start; gap: 0; border: 1px solid var(--rb-line); border-radius: 14px; background: #faf9f6; box-shadow: 0 10px 38px #362c1810; }
	.rb-preview-column { position: sticky; top: 146px; min-width: 0; padding: 24px; }
	.rb-canvas { position: relative; display: flex; height: clamp(400px, 31vw, 520px); flex-direction: column; overflow: hidden; border: 1px solid #e8e2d7; border-radius: 10px; background: radial-gradient(ellipse at 48% 38%, #fff 0%, #f6f4ef 65%, #eeeae1 100%); }
	.rb-canvas-top { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 20px; pointer-events: none; }
	.rb-preview-tag { display: flex; align-items: center; gap: 7px; color: #75684f; font: 10px 'Lato', sans-serif; letter-spacing: 1.2px; }
	.rb-preview-tag :global(svg) { color: #876917; }
	.rb-counter { padding: 5px 9px; border: 1px solid #e4dfd4; border-radius: 20px; background: #ffffffa6; color: #72654f; font: 9px 'Lato', sans-serif; letter-spacing: .6px; }
	.rb-canvas-bottom { position: relative; z-index: 1; display: flex; align-items: center; justify-content: flex-end; margin-top: auto; padding: 16px; pointer-events: none; }
	.rb-view-tools { pointer-events: auto; display: flex; gap: 2px; padding: 3px; border: 1px solid #e4dfd5; border-radius: 8px; background: #ffffffed; box-shadow: 0 3px 12px #3a2c1510; }
	.rb-view-tools button { display: grid; width: 38px; height: 38px; place-items: center; border: 0; border-radius: 5px; background: none; color: #665a46; cursor: pointer; }
	.rb-view-tools button:hover { background: #f4f4f4; }
	.rb-view-tools button:disabled { opacity: .35; cursor: default; }
	.rb-preview-caption { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 23px 3px 20px; border-bottom: 1px solid var(--rb-line); }
	.rb-preview-caption p { margin-bottom: 6px; color: #7d663d; font: 9px 'Lato', sans-serif; letter-spacing: 1.6px; }
	.rb-preview-caption h2 { font: 400 23px/1.4 'Inria Serif', serif; text-transform: capitalize; }
	.rb-preview-caption > span { display: flex; align-items: center; gap: 7px; color: #766b57; font: 11px/20px 'Lato', sans-serif; white-space: nowrap; }
	.rb-design-note { display: flex; align-items: center; gap: 10px; padding: 19px 3px 2px; color: #a78c54; }
	.rb-design-note :global(svg) { flex-shrink: 0; }
	.rb-design-note p { color: #746b5e; font: 12px/21px 'Lato', sans-serif; }
	.rb-design-note p span { color: #756d60; font-size: 11px; }
	.rb-panel { min-width: 0; min-height: 100%; padding: 28px; border-left: 1px solid var(--rb-line); border-radius: 0 14px 14px 0; background: #fff; }
	.rb-panel-heading { margin-bottom: 23px; }
	.rb-panel-heading .rb-eyebrow { color: #806a3d; font: 10px 'Lato', sans-serif; letter-spacing: 1.5px; }
	.rb-panel-heading h2 { margin-top: 8px; font: 400 27px/1.3 'Inria Serif', serif; }
	.rb-panel-heading h2:focus { outline: none; }
	.rb-panel-heading p { margin-top: 7px; color: var(--rb-muted); font: 13px/21px 'Lato', sans-serif; }
	.rb-panel fieldset { min-width: 0; margin: 0 0 23px; padding: 0; border: 0; }
	.rb-panel legend { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 11px; padding: 0; color: #40382c; font-size: 14px; }
	.rb-panel legend > span { color: #786540; font: 11px 'Lato', sans-serif; }
	.rb-style-grid, .rb-crown-grid, .rb-shape-grid, .rb-metal-grid, .rb-purity-grid, .rb-carats { display: grid; gap: 10px; }
	.rb-style-grid, .rb-crown-grid, .rb-metal-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	.rb-style-option, .rb-crown-option, .rb-shape-option, .rb-metal-option, .rb-purity-grid button, .rb-segments button, .rb-carats button { position: relative; min-width: 0; border: 1px solid #e5e0d7; border-radius: 7px; background: #fff; color: #403a31; font: inherit; cursor: pointer; transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease; }
	.rb-style-option { display: flex; min-height: 130px; flex-direction: column; align-items: center; overflow: hidden; padding: 0; }
	.rb-style-option > span { padding: 8px 5px 2px; color: #423a2f; font: 13px/19px 'Lato', sans-serif; }
	.rb-panel :global(.rb-option-check) { position: absolute; top: 7px; right: 7px; width: 17px; height: 17px; padding: 3px; border-radius: 50%; background: #a88a48; color: #fff; }
	.rb-panel button.selected { border-color: #b69a5e; background: #fffdf9; color: #443b29; box-shadow: 0 0 0 1px #b69a5e; }
	.rb-style-option:hover, .rb-crown-option:hover, .rb-shape-option:hover, .rb-metal-option:hover, .rb-purity-grid button:hover, .rb-segments button:hover, .rb-carats button:hover { border-color: var(--rb-gold); }
	.rb-segments { display: flex; gap: 8px; padding: 3px; border: 1px solid #ece7de; border-radius: 8px; background: #f7f5f1; }
	.rb-segments button { flex: 1; min-height: 38px; padding: 6px 5px; border-color: transparent; background: transparent; color: #7a7265; font: 12px 'Lato', sans-serif; }
	.rb-shape-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
	.rb-shape-option { display: flex; min-height: 93px; flex-direction: column; align-items: center; justify-content: center; gap: 9px; padding: 12px 3px; }
	.rb-shape-option img { width: 42px; height: 42px; object-fit: contain; mix-blend-mode: multiply; }
	.rb-shape-option span { font: 11px 'Lato', sans-serif; }
	.rb-carats { grid-template-columns: repeat(6, minmax(0, 1fr)); }
	.rb-carats button { min-height: 57px; padding: 8px 3px; font: 13px 'Lato', sans-serif; }
	.rb-carats small { display: block; color: var(--rb-muted); font: 11px 'Lato', sans-serif; }
	.rb-help { display: flex; align-items: flex-start; gap: 9px; padding: 13px 14px; border: 1px solid #ece7de; border-radius: 7px; background: #faf9f6; color: #a08a5c; }
	.rb-help :global(svg) { flex-shrink: 0; margin-top: 3px; }
	.rb-help p { color: var(--rb-muted); font: 12px/20px 'Lato', sans-serif; }
	.rb-metal-option { display: flex; min-height: 121px; flex-direction: column; align-items: center; gap: 12px; padding: 18px 5px 14px; font: 13px 'Lato', sans-serif; }
	.rb-metal-swatch { width: 76px; height: 51px; object-fit: contain; mix-blend-mode: multiply; }
	.rb-metal-option :global(svg) { position: absolute; top: 9px; right: 9px; color: #876917; }
	.rb-purity-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	.rb-purity-grid button { display: flex; min-height: 83px; flex-direction: column; gap: 6px; padding: 15px; text-align: left; }
	.rb-purity-grid strong { font: 400 15px 'Lato', sans-serif; }
	.rb-purity-grid span { color: var(--rb-muted); font: 12px 'Lato', sans-serif; }
	.rb-purity-grid :global(svg) { position: absolute; top: 17px; right: 12px; color: #876917; }
	.rb-field-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
	.rb-field-header label, .rb-engraving-field label { color: #303030; font-size: 15px; }
	.rb-field-header button { display: flex; min-height: 44px; align-items: center; gap: 6px; padding: 5px 0 5px 8px; border: 0; background: none; color: #876917; font: 13px 'Lato', sans-serif; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
	:global(.rb-size-select), :global(.rb-engraving-input) { height: 48px; border-color: #c2c2c2; border-radius: 5px; background: #fff; color: #303030; font: 16px 'Lato', sans-serif; box-shadow: none; }
	.rb-field-note { margin-top: 8px !important; color: var(--rb-muted); font: 12px/20px 'Lato', sans-serif; }
	.rb-engraving-field { margin-top: 28px; }
	.rb-engraving-field label { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
	.rb-engraving-field label > span { color: var(--rb-muted); font: 12px/24px 'Lato', sans-serif; }
	.rb-input-wrap { position: relative; }
	:global(.rb-engraving-input) { padding-right: 60px; }
	.rb-input-wrap > span { position: absolute; top: 15px; right: 14px; color: var(--rb-muted); font: 12px 'Lato', sans-serif; }
	.rb-inscription { margin-top: 26px; padding: 24px 16px; border: 1px solid var(--rj-rule, #e1d6be); border-radius: 5px; background: var(--rj-cream, #faf6ea); text-align: center; }
	.rb-inscription > span { color: #876917; font: 11px 'Lato', sans-serif; letter-spacing: 1px; }
	.rb-inscription p { margin: 14px 0; color: #685225; font: italic 28px 'Inria Serif', serif; overflow-wrap: anywhere; }
	.rb-inscription small { color: var(--rb-muted); font: 12px 'Lato', sans-serif; }
	.rb-review-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 16px; border: 1px solid var(--rj-rule, #e1d6be); border-radius: 5px; background: var(--rj-cream, #faf6ea); }
	.rb-review-header > span { display: grid; width: 34px; height: 34px; flex-shrink: 0; place-items: center; border: 1px solid var(--rb-gold); border-radius: 50%; color: #876917; }
	.rb-review-header strong { font-size: 15px; font-weight: 400; }
	.rb-review-header p { margin-top: 4px; color: var(--rb-muted); font: 13px/21px 'Lato', sans-serif; }
	.rb-review { margin: 0 0 22px; }
	.rb-review > div { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 5px 16px; padding: 15px 0; border-bottom: 1px solid var(--rb-line); }
	.rb-review dt { color: var(--rb-muted); font: 12px 'Lato', sans-serif; }
	.rb-review dd { grid-column: 1; margin: 0; font-size: 15px; overflow-wrap: anywhere; }
	.rb-review button { grid-column: 2; grid-row: 1 / 3; align-self: center; min-height: 44px; padding: 8px; border: 0; background: none; color: #876917; font: 13px 'Lato', sans-serif; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
	.rb-panel-footer { display: grid; grid-template-columns: minmax(110px, .85fr) minmax(0, 1.2fr); column-gap: 16px; margin-top: 25px; padding-top: 22px; border-top: 1px solid var(--rb-line); }
	.rb-estimate { grid-column: 1; grid-row: 1; }
	.rb-estimate > div > span { display: block; margin-bottom: 5px; color: var(--rb-muted); font: 11px 'Lato', sans-serif; }
	.rb-estimate strong { display: block; color: var(--rb-ink); font: 500 28px/1.3 'Lato', sans-serif; }
	.rb-breakdown { grid-column: 1; grid-row: 2; margin: 2px 0 0; }
	.rb-breakdown summary { display: flex; width: fit-content; min-height: 29px; align-items: center; gap: 5px; color: #786642; font: 11px 'Lato', sans-serif; list-style: none; cursor: pointer; }
	.rb-breakdown summary::-webkit-details-marker { display: none; }
	.rb-breakdown[open] summary :global(svg) { transform: rotate(180deg); }
	.rb-breakdown > div { padding: 10px 0 0; }
	.rb-breakdown p { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 9px; color: var(--rb-muted); font: 13px/21px 'Lato', sans-serif; }
	.rb-breakdown b { color: #303030; font-weight: 400; white-space: nowrap; }
	.rb-breakdown small { display: block; margin-top: 12px; color: var(--rb-muted); font: 12px/20px 'Lato', sans-serif; }
	.rb-step-actions { display: flex; grid-column: 2; grid-row: 1 / 3; align-self: center; gap: 8px; }
	:global(.rb-next) { flex: 1; min-width: 0; height: 48px; justify-content: space-between; gap: 10px; padding: 0 16px; border: 1px solid #b99a54; border-radius: 7px; background: linear-gradient(110deg, #d3b36d, #c7a254); color: #302715; font: 13px 'Lato', sans-serif; box-shadow: 0 3px 8px #a88b3c18; }
	:global(.rb-next:hover) { border-color: #a88b43; background: #c4a052; }
	:global(.rb-back) { width: 42px; height: 48px; flex-shrink: 0; padding: 0; border-color: #e1dbd0; border-radius: 7px; background: #fff; color: #837354; box-shadow: none; }
	:global(.rb-back:hover) { border-color: #cca646; }
	.rb-status { grid-column: 1 / -1; margin-top: 12px !important; color: #5e5a4f; font: 12px/21px 'Lato', sans-serif; }
	.rb-status:empty { display: none; }
	.rb-studio :is(button, summary, a):focus-visible { outline: 2px solid #876917; outline-offset: 3px; }
	:global(.rb-dialog) { border-color: #d9d9d9; border-radius: 5px; background: #fff; color: #303030; font-family: 'Sarala', sans-serif; }
	:global(.rb-dialog h2) { font-family: 'Sarala', sans-serif; letter-spacing: normal; }
	:global(.rb-dialog button:focus-visible) { outline: 2px solid #876917; outline-offset: 3px; }
	:global(.rb-dialog button:not([data-dialog-close])) { min-height: 44px; }
	.rb-dialog-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
	.rb-size-tips { display: grid; gap: 14px; padding-left: 20px; color: #606060; font: 14px/23px 'Lato', sans-serif; }
	.rb-size-tip { color: #606060; font: 13px/22px 'Lato', sans-serif; }

	.rb-style-option img, .rb-crown-option img { display: block; width: 100%; height: 83px; object-fit: contain; background: #f7f7f7; }
	.rb-style-option small { display: block; width: 100%; padding: 0 6px 10px; overflow: hidden; color: #746d63; font: 10px/16px 'Lato', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
	.rb-crown-option { display: flex; flex-direction: column; align-items: center; overflow: hidden; padding: 0; }
	.rb-crown-option img { height: 67px; }
	.rb-crown-option > span { display: block; padding: 8px 4px; font: 12px/18px 'Lato', sans-serif; }
	.rb-segments button.selected { border-color: #e2d7bc; background: #fff; box-shadow: 0 1px 4px #5c471719; }
	.rb-specs > b, .rb-specs > span { padding: 4px 8px; border: 1px solid #e4ded2; border-radius: 5px; background: #fffdf8; font-weight: 400; }
	@media (max-width: 1350px) {
		.rb-preview-column { padding: 20px; }
		.rb-panel { padding: 24px; }
		.rb-preview-caption { align-items: flex-start; flex-direction: column; gap: 12px; }
		.rb-panel-footer { display: block; }
		.rb-breakdown { margin: 3px 0 14px; }
		.rb-style-option small { font-size: 9px; }
		.rb-shape-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
		.rb-carats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	}
	@media (max-width: 1100px) {
		.rb-studio { padding-inline: 24px; }
		.rb-workspace { grid-template-columns: minmax(0, 1fr); max-width: 760px; margin: 0 auto; }
		.rb-preview-column { position: static; padding: 22px; }
		.rb-canvas { height: 440px; }
		.rb-preview-caption { flex-direction: row; align-items: center; }
		.rb-panel { padding: 26px; border-top: 1px solid var(--rb-line); border-left: 0; border-radius: 0 0 14px 14px; }
		.rb-design-note { display: none; }
		.rb-style-option img { height: 105px; }
		.rb-style-option small { font-size: 11px; }
		.rb-crown-option img { height: 86px; }
		.rb-shape-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
		.rb-carats { grid-template-columns: repeat(6, minmax(0, 1fr)); }
		.rb-panel-footer { display: grid; }
		.rb-breakdown { margin: 2px 0 0; }
	}
	@media (max-width: 639px) {
		.rb-studio { padding: 0 16px 36px; }
		.rb-breadcrumb { min-height: 42px; font-size: 11px; }
		.rb-heading { display: block; padding: 14px 0 22px; }
		.rb-heading .rb-eyebrow { font-size: 9px; letter-spacing: 1.6px; }
		.rb-heading h1 { padding-right: 38px; font-size: 28px; }
		.rb-intro { max-width: 300px; margin-top: 9px !important; font-size: 12px; line-height: 20px; }
		:global(.rb-reset) { position: absolute; top: 24px; right: 0; width: 34px; min-height: 36px; padding: 0; font-size: 0; }
		:global(.rb-reset svg) { width: 15px; height: 15px; }
		.rb-progress { margin-bottom: 18px; padding: 4px; border-radius: 8px; }
		.rb-progress ol { gap: 2px; }
		.rb-progress button { min-height: 64px; flex-direction: column; gap: 6px; padding: 7px 1px; font-size: 10px; }
		.rb-step-number { width: 22px; height: 22px; font-size: 10px; }
		.rb-workspace { border-radius: 11px; }
		.rb-preview-column { padding: 12px; }
		.rb-canvas { height: 295px; border-radius: 8px; }
		.rb-canvas-top { padding: 13px; gap: 6px; }
		.rb-preview-tag { font-size: 8px; letter-spacing: .8px; }
		.rb-counter { padding: 4px 7px; font-size: 8px; }
		.rb-canvas-bottom { padding: 10px; }
		.rb-view-tools { padding: 2px; }
		.rb-view-tools button { width: 33px; height: 36px; }
		.rb-preview-caption { flex-direction: column; align-items: flex-start; gap: 10px; padding: 16px 2px 5px; border-bottom: 0; }
		.rb-preview-caption h2 { font-size: 21px; }
		.rb-preview-caption p { font-size: 8px; }
		.rb-preview-caption > span { font-size: 10px; }
		.rb-panel { padding: 21px 16px; border-radius: 0 0 11px 11px; }
		.rb-panel-heading { margin-bottom: 20px; }
		.rb-panel-heading h2 { font-size: 25px; }
		.rb-panel-heading p { font-size: 12px; }
		.rb-panel fieldset { margin-bottom: 21px; }
		.rb-panel legend { font-size: 13px; }
		.rb-panel legend > span { font-size: 10px; }
		.rb-style-grid, .rb-crown-grid, .rb-segments { gap: 7px; }
		.rb-style-option { min-height: 102px; }
		.rb-style-option img { height: 71px; }
		.rb-style-option > span { padding: 7px 2px; font-size: 11px; }
		.rb-style-option small { display: none; }
		.rb-crown-option img { height: 57px; }
		.rb-crown-option > span { padding: 7px 2px; font-size: 10px; }
		.rb-panel :global(.rb-option-check) { top: 5px; right: 5px; width: 15px; height: 15px; padding: 2px; }
		.rb-segments { gap: 2px; padding: 2px; }
		.rb-segments button { min-height: 40px; font-size: 11px; }
		.rb-shape-grid, .rb-carats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
		.rb-metal-grid { gap: 7px; }
		.rb-metal-option { min-height: 111px; font-size: 11px; }
		.rb-metal-swatch { width: 65px; height: 43px; }
		.rb-engraving-field label { font-size: 13px; }
		.rb-panel-footer { position: sticky; z-index: 3; bottom: 0; display: block; margin-top: 24px; padding-top: 17px; padding-bottom: 4px; background: #fff; }
		.rb-estimate strong { font-size: 27px; }
		.rb-breakdown { margin: 1px 0 12px; }
		.rb-review dd { font-size: 13px; }
		:global(.rb-next) { padding-inline: 14px; font-size: 13px; }
		.rb-dialog-actions { flex-wrap: wrap; }
	}
	@media (prefers-reduced-motion: reduce) {
		.rb-studio button { transition: none; }
	}
</style>
