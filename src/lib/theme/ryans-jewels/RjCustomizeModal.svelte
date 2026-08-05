<script lang="ts">
	type Customization = { metal: string; carat: string; size: string; cut: string; stone: string }
	type Props = {
		open?: boolean
		initial: Customization
		metalType?: string
		metalOptions?: string[]
		caratOptions?: string[]
		sizeOptions?: string[]
		cutOptions?: string[]
		stoneOptions?: string[]
		loading?: boolean
		onapply?: (selection: Customization) => boolean | Promise<boolean>
		onchange?: (selection: Customization) => void
		onringview?: () => void
	}

	let {
		open = $bindable(false),
		initial,
		metalType = '',
		metalOptions = [],
		caratOptions = [],
		sizeOptions = [],
		cutOptions = [],
		stoneOptions = [],
		loading = false,
		onapply,
		onchange,
		onringview
	}: Props = $props()

	const cuts = [
		{ value: 'Round', image: '/ryans-jewels/diamonds/round.jpg' },
		{ value: 'Radiant', image: '/ryans-jewels/product/customizer/radiant.svg' },
		{ value: 'Asscher', image: '/ryans-jewels/product/customizer/asscher.svg' },
		{ value: 'Cushion', image: '/ryans-jewels/product/customizer/cushion.svg' },
		{ value: 'Princess', image: '/ryans-jewels/product/customizer/princess.svg' },
		{ value: 'Emerald', image: '/ryans-jewels/product/customizer/emerald.svg' },
		{ value: 'Marquise', image: '/ryans-jewels/product/customizer/marquise.svg' },
		{ value: 'Heart', image: '/ryans-jewels/product/customizer/heart.svg' },
		{ value: 'Oval', image: '/ryans-jewels/product/customizer/oval.svg' },
		{ value: 'Pear', image: '/ryans-jewels/product/customizer/pear.svg' }
	]
	const allStoneTypes = ['Natural Diamond', 'Lab Grown Diamond', 'Moissanite Diamond']
	const fallbackCarats = ['0.25 ct', '0.50 ct', '0.75 ct', '1.00 ct', '1.25 ct', '1.50 ct', '2.00 ct']
	const fallbackSizes = Array.from({ length: 22 }, (_, index) => String(3 + index * .5))

	let dialog: HTMLDialogElement
	let selectedMetal = $state('')
	let selectedCarat = $state('')
	let selectedSize = $state('')
	let selectedCut = $state('')
	let selectedStone = $state('')
	let submitting = $state(false)

	const displayedCarats = $derived(caratOptions.length ? caratOptions : fallbackCarats)
	const displayedSizes = $derived(sizeOptions.length ? sizeOptions : fallbackSizes)

	$effect(() => {
		if (open) {
			selectedMetal = initial.metal
			selectedCarat = initial.carat
			selectedSize = initial.size
			selectedCut = initial.cut
			selectedStone = initial.stone
			setTimeout(() => { if (dialog && !dialog.open) dialog.showModal() })
		} else if (dialog?.open) dialog.close()
	})

	function close() {
		if (submitting || loading) return
		open = false
	}

	function sameValue(left: string, right: string) {
		return left.trim().toLowerCase() === right.trim().toLowerCase()
	}

	function available(value: string, values: string[]) {
		return !values.length || values.some((item) => sameValue(item, value))
	}

	function metalImage(value: string) {
		const tone = /rose|pink|red/i.test(value) ? 'rose' : /white|silver|platinum/i.test(value) ? 'white' : 'yellow'
		return `/ryans-jewels/product/customizer/metal-${tone}.png`
	}

	function metalLabel(value: string) {
		return `${metalType} ${value}`.replace(/\s+/g, ' ').trim()
	}

	function caratLabel(value: string) {
		return value.replace(/\s*(?:ct|carat).*$/i, '')
	}

	function select(type: keyof Customization, value: string) {
		if (type === 'metal') selectedMetal = value
		else if (type === 'carat') selectedCarat = value
		else if (type === 'size') selectedSize = value
		else if (type === 'cut') selectedCut = value
		else selectedStone = value
		onchange?.({ metal: selectedMetal, carat: selectedCarat, size: selectedSize, cut: selectedCut, stone: selectedStone })
	}

	async function applyCustomization() {
		if (submitting || loading) return
		submitting = true
		try {
			const applied = await onapply?.({ metal: selectedMetal, carat: selectedCarat, size: selectedSize, cut: selectedCut, stone: selectedStone })
			if (applied !== false) open = false
		} finally {
			submitting = false
		}
	}

	function showRingView() {
		open = false
		onringview?.()
	}
</script>

<dialog bind:this={dialog} class="rj-customizer" aria-labelledby="rj-customizer-title" onclose={() => open = false} oncancel={() => open = false} onclick={(event) => (event.target === dialog || event.target === dialog.querySelector('.rj-customizer-wrap')) && close()}>
	<div class="rj-customizer-wrap">
		<button class="rj-customizer-close" type="button" onclick={close} aria-label="Close customizer">
			<img src="/ryans-jewels/product/customizer/close.png" alt="" />
			<span>Close</span>
		</button>

		<form class="rj-customizer-panel" onsubmit={(event) => { event.preventDefault(); applyCustomization() }}>
			<div class="rj-customizer-card">
				<header>
					<img src="/ryans-jewels/product/customizer/header-ring.png" alt="" />
					<h2 id="rj-customizer-title">Create your Customise</h2>
				</header>

				<div class="rj-customizer-body">
					<fieldset>
						<legend><img src="/ryans-jewels/product/detail-info.svg" alt="" />Select Metal :</legend>
						<div class="rj-customizer-options rj-customizer-metals">
							{#each metalOptions as value}
								<button type="button" class:selected={sameValue(selectedMetal, value)} onclick={() => select('metal', value)} aria-pressed={sameValue(selectedMetal, value)}>
									<img src={metalImage(value)} alt="" /><span>{metalLabel(value)}</span>
								</button>
							{/each}
						</div>
					</fieldset>

					<fieldset>
						<legend><img src="/ryans-jewels/product/detail-info.svg" alt="" />Select Carat Weight :</legend>
						<div class="rj-customizer-options rj-customizer-values">
							{#each displayedCarats as value}
								<button type="button" class:selected={sameValue(selectedCarat, value)} onclick={() => select('carat', value)} aria-pressed={sameValue(selectedCarat, value)}>{caratLabel(value)}</button>
							{/each}
						</div>
					</fieldset>

					<fieldset>
						<legend><img src="/ryans-jewels/product/detail-info.svg" alt="" />Select Size :</legend>
						<div class="rj-customizer-options rj-customizer-values">
							{#each displayedSizes as value}
								<button type="button" class:selected={sameValue(selectedSize, value)} onclick={() => select('size', value)} aria-pressed={sameValue(selectedSize, value)}>{value}</button>
							{/each}
						</div>
					</fieldset>

					<fieldset>
						<legend><img src="/ryans-jewels/product/detail-info.svg" alt="" />Select Diamond Cut :</legend>
						<div class="rj-customizer-options rj-customizer-cuts">
							{#each cuts as cut}
								<button type="button" class:selected={sameValue(selectedCut, cut.value)} disabled={!available(cut.value, cutOptions)} onclick={() => select('cut', cut.value)} aria-pressed={sameValue(selectedCut, cut.value)}>
									<img class:round={cut.value === 'Round'} src={cut.image} alt="" /><span>{cut.value}</span>
								</button>
							{/each}
						</div>
					</fieldset>

					<fieldset>
						<legend><img src="/ryans-jewels/product/detail-info.svg" alt="" />Stone Type :</legend>
						<div class="rj-customizer-options rj-customizer-stones">
							{#each allStoneTypes as value}
								<button type="button" class:selected={sameValue(selectedStone, value)} disabled={!available(value, stoneOptions)} onclick={() => select('stone', value)} aria-pressed={sameValue(selectedStone, value)}>{value}</button>
							{/each}
						</div>
					</fieldset>
				</div>

				<footer>
					<button class="rj-ring-view" type="button" onclick={showRingView}><img src="/ryans-jewels/product/customizer/ring-view.png" alt="" /><span>Ring View</span><img src="/ryans-jewels/product/customizer/arrow-right.svg" alt="" /></button>
					<button class="rj-customizer-submit" type="submit" disabled={submitting || loading}>{submitting || loading ? 'APPLYING...' : 'CUSTOMISE'}</button>
				</footer>
			</div>
		</form>
	</div>
</dialog>

<style>
	.rj-customizer { width: 100vw; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; overflow: auto; border: 0; background: transparent; color: #404040; font-family: 'Lato', sans-serif; }
	.rj-customizer::backdrop { background: rgb(255 255 255 / 12%); backdrop-filter: blur(3px); }
	.rj-customizer-wrap { display: flex; min-height: 100%; flex-direction: column; gap: 20px; align-items: center; justify-content: center; padding: 28px 20px; }
	.rj-customizer-close { display: flex; min-height: 38px; gap: 5px; align-items: center; padding: 6px 10px; border: 0; border-radius: 35px; background: rgb(218 218 218 / 20%); color: #565656; font: 500 16px/normal 'Lato', sans-serif; cursor: pointer; }
	.rj-customizer-close img { width: 20px; height: 20px; }
	.rj-customizer-panel { box-sizing: border-box; width: min(787px, 100%); padding: 15px; border-radius: 12px; background: rgb(221 221 221 / 15%); box-shadow: 0 25px 40px rgb(0 0 0 / 20%); }
	.rj-customizer-card { display: flex; min-height: 750px; flex-direction: column; padding: 20px; border-radius: 10px; background: #fff; }
	.rj-customizer-card > header { display: flex; height: 75px; flex: 0 0 75px; gap: 18px; align-items: center; padding: 7px 20px; border-radius: 5px; background: #f9f8f6; }
	.rj-customizer-card > header img { width: 50px; height: 61px; object-fit: contain; }
	.rj-customizer-card h2 { margin: 0; color: #303030; font: 500 18px/normal 'Lato', sans-serif; letter-spacing: normal; }
	.rj-customizer-body { display: flex; flex: 1; flex-direction: column; gap: 18px; padding-top: 18px; }
	.rj-customizer fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
	.rj-customizer legend { display: flex; gap: 5px; align-items: center; margin-bottom: 10px; color: #454545; font: 400 14px/normal 'Lato', sans-serif; }
	.rj-customizer legend img { width: 15px; height: 15px; }
	.rj-customizer-options { display: flex; flex-wrap: wrap; gap: 10px; }
	.rj-customizer-options button { display: flex; min-height: 37px; align-items: center; justify-content: center; padding: 8px 12px; border: 1px solid var(--border-color, #c2c2c2); border-radius: 2px; background: #fff; color: #404040; font: 400 14px/normal 'Lato', sans-serif; cursor: pointer; }
	.rj-customizer-options button.selected { border-color: var(--rj-gold, #cca646); background: rgb(255 234 183 / 40%); }
	.rj-customizer-options button:focus-visible, .rj-customizer-close:focus-visible, .rj-ring-view:focus-visible, .rj-customizer-submit:focus-visible { outline: 2px solid var(--rj-gold, #cca646); outline-offset: 2px; }
	.rj-customizer-options button:disabled { opacity: .35; cursor: not-allowed; }
	.rj-customizer-metals { gap: 15px; }
	.rj-customizer-metals button { height: 41px; gap: 12px; padding: 9px 13px; border-radius: 4px; font-size: 15px; font-weight: 500; }
	.rj-customizer-metals img { width: 28px; height: 22px; object-fit: contain; }
	.rj-customizer-values button { min-width: 51px; padding-inline: 10px; }
	.rj-customizer-cuts button { height: 51px; gap: 10px; padding: 8px 12px; border-radius: 4px; font-size: 16px; font-weight: 500; }
	.rj-customizer-cuts img { width: 25px; height: 30px; object-fit: contain; }
	.rj-customizer-cuts img.round { width: 28px; height: 28px; border-radius: 50%; }
	.rj-customizer-stones button { padding-inline: 12px; }
	.rj-customizer-card > footer { display: flex; min-height: 55px; align-items: flex-end; justify-content: space-between; padding-top: 14px; }
	.rj-customizer-card > footer button { border: 0; cursor: pointer; }
	.rj-ring-view { display: flex; gap: 10px; align-items: center; padding: 6px 12px; background: transparent; color: #a6a6a6; font: 400 14px/normal 'Lato', sans-serif; }
	.rj-ring-view img:first-child { width: 25px; height: 20px; }
	.rj-ring-view img:last-child { width: 16px; height: 16px; }
	.rj-customizer-submit { min-width: 155px; height: 40px; padding: 10px 32px; border-radius: 5px; background: var(--rj-gold, #cca646); color: #fff; font: 500 16px/normal 'Lato', sans-serif; }
	.rj-customizer-submit:disabled { opacity: .6; cursor: wait; }

	@media (max-width: 767px) {
		.rj-customizer-wrap { justify-content: flex-start; gap: 12px; padding: 14px 10px; }
		.rj-customizer-panel { padding: 8px; }
		.rj-customizer-card { min-height: 0; padding: 12px; }
		.rj-customizer-card > header { height: 62px; flex-basis: 62px; padding: 5px 12px; }
		.rj-customizer-card > header img { width: 42px; height: 52px; }
		.rj-customizer-body { gap: 16px; padding-top: 16px; }
		.rj-customizer-options { gap: 8px; }
		.rj-customizer-metals { gap: 8px; }
		.rj-customizer-metals button { flex: 1 1 145px; justify-content: flex-start; }
		.rj-customizer-cuts button { flex: 1 1 110px; justify-content: flex-start; }
		.rj-customizer-card > footer { position: sticky; bottom: -12px; margin: 0 -12px -12px; padding: 12px; background: #fff; }
	}

</style>
