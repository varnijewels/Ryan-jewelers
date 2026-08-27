<script lang="ts">
	type Customization = { metal: string; carat: string; size: string; cut: string; stone: string }
	type Props = {
		initial: Customization
		metalType?: string
		metalOptions?: string[]
		caratOptions?: string[]
		sizeOptions?: string[]
		cutOptions?: string[]
		stoneOptions?: string[]
		onchange?: (selection: Customization) => void
		onringview?: () => void
	}

	let {
		initial,
		metalType = '',
		metalOptions = [],
		caratOptions = [],
		sizeOptions = [],
		cutOptions = [],
		stoneOptions = [],
		onchange,
		onringview
	}: Props = $props()

	const cutImages: Record<string, string> = {
		round: '/ryans-jewels/diamonds/round.jpg',
		radiant: '/ryans-jewels/product/customizer/radiant.svg',
		asscher: '/ryans-jewels/product/customizer/asscher.svg',
		cushion: '/ryans-jewels/product/customizer/cushion.svg',
		princess: '/ryans-jewels/product/customizer/princess.svg',
		emerald: '/ryans-jewels/product/customizer/emerald.svg',
		marquise: '/ryans-jewels/product/customizer/marquise.svg',
		heart: '/ryans-jewels/product/customizer/heart.svg',
		oval: '/ryans-jewels/product/customizer/oval.svg',
		pear: '/ryans-jewels/product/customizer/pear.svg'
	}

	let selectedMetal = $state('')
	let selectedCarat = $state('')
	let selectedSize = $state('')
	let selectedCut = $state('')
	let selectedStone = $state('')
	let isOpen = $state(false)

	$effect(() => {
		selectedMetal = initial.metal
		selectedCarat = initial.carat
		selectedSize = initial.size
		selectedCut = initial.cut
		selectedStone = initial.stone
	})

	function sameValue(left: string, right: string) {
		return left.trim().toLowerCase() === right.trim().toLowerCase()
	}

	function metalImage(value: string) {
		const tone = /rose|pink|red/i.test(value) ? 'rose' : /white|silver|platinum/i.test(value) ? 'white' : 'yellow'
		return `/ryans-jewels/product/customizer/metal-${tone}.webp`
	}

	function metalLabel(value: string) {
		return `${metalType} ${value}`.replace(/\s+/g, ' ').trim()
	}

	function cutImage(value: string) {
		const normalized = value.toLowerCase().replace(/[^a-z]/g, '')
		return Object.entries(cutImages).find(([name]) => normalized.includes(name))?.[1] || ''
	}

	function select(type: keyof Customization, value: string) {
		if (type === 'metal') selectedMetal = value
		else if (type === 'carat') selectedCarat = value
		else if (type === 'size') selectedSize = value
		else if (type === 'cut') selectedCut = value
		else selectedStone = value
		onchange?.({ metal: selectedMetal, carat: selectedCarat, size: selectedSize, cut: selectedCut, stone: selectedStone })
	}

</script>

<details class="rj-customizer" bind:open={isOpen}>
	<summary>
		<span><img src="/ryans-jewels/product/customize.svg" alt="" />Select your Customise variation</span>
		<span>+ Customise<img src="/ryans-jewels/product/customizer/arrow-right.svg" alt="" /></span>
	</summary>
	{#if isOpen}
		<header>
			<img src="/ryans-jewels/product/customizer/header-ring.png" alt="" />
			<div><small>MAKE IT YOURS</small><h2 id="rj-customizer-title">Customize Your Jewelry</h2><p>Explore our in-stock and made-to-order metal, carat and diamond options.</p></div>
		</header>

		<div class="rj-customizer-form">
		<div class="rj-customizer-body">
			{#if metalOptions.length}
				<fieldset>
					<legend>Select Metal</legend>
					<div class="rj-customizer-options rj-customizer-metals">
						{#each metalOptions as value}
							<button type="button" class:selected={sameValue(selectedMetal, value)} onclick={() => select('metal', value)} aria-pressed={sameValue(selectedMetal, value)}><img src={metalImage(value)} alt="" /><span>{metalLabel(value)}</span></button>
						{/each}
					</div>
				</fieldset>
			{/if}

			{#if caratOptions.length}
				<fieldset>
					<legend>Select Carat Weight</legend>
					<div class="rj-customizer-options rj-customizer-values">{#each caratOptions as value}<button type="button" class:selected={sameValue(selectedCarat, value)} onclick={() => select('carat', value)} aria-pressed={sameValue(selectedCarat, value)}>{value}</button>{/each}</div>
				</fieldset>
			{/if}

			{#if sizeOptions.length}
				<fieldset>
					<legend>Select Ring Size</legend>
					<div class="rj-customizer-options rj-customizer-values">{#each sizeOptions as value}<button type="button" class:selected={sameValue(selectedSize, value)} onclick={() => select('size', value)} aria-pressed={sameValue(selectedSize, value)}>{value}</button>{/each}</div>
				</fieldset>
			{/if}

			{#if cutOptions.length}
				<fieldset>
					<legend>Select Diamond Shape</legend>
					<div class="rj-customizer-options rj-customizer-cuts">
						{#each cutOptions as value}
							<button type="button" class:selected={sameValue(selectedCut, value)} onclick={() => select('cut', value)} aria-pressed={sameValue(selectedCut, value)}>{#if cutImage(value)}<img src={cutImage(value)} alt="" />{/if}<span>{value}</span></button>
						{/each}
					</div>
				</fieldset>
			{/if}

			{#if stoneOptions.length}
				<fieldset>
					<legend>Select Stone Type</legend>
					<div class="rj-customizer-options">{#each stoneOptions as value}<button type="button" class:selected={sameValue(selectedStone, value)} onclick={() => select('stone', value)} aria-pressed={sameValue(selectedStone, value)}>{value}</button>{/each}</div>
				</fieldset>
			{/if}
		</div>

		<footer>
			<div><button class="rj-ring-view" type="button" onclick={() => onringview?.()}><img src="/ryans-jewels/product/customizer/ring-view.png" alt="" /><span>View Ring</span><img src="/ryans-jewels/product/customizer/arrow-right.svg" alt="" /></button><small>Made-to-order pricing and delivery are confirmed separately.</small></div>
		</footer>
		</div>
	{/if}
</details>

<style>
	.rj-customizer { box-sizing: border-box; width: calc(100% - 20px); margin-left: 10px; overflow: hidden; border: 1px solid #ece8df; border-radius: 5px; background: #fff; color: #404040; font-family: 'Lato', sans-serif; }
	.rj-customizer > summary { display: flex; min-height: 35px; align-items: center; justify-content: space-between; gap: 16px; padding: 6px 10px; color: #606060; font: 400 14px/normal 'Sarala', sans-serif; cursor: pointer; list-style: none; }
	.rj-customizer > summary::-webkit-details-marker { display: none; }
	.rj-customizer > summary span { display: flex; align-items: center; gap: 5px; }
	.rj-customizer > summary span:last-child { flex: 0 0 auto; color: #cca646; }
	.rj-customizer > summary img { width: 19px; height: 19px; object-fit: contain; }
	.rj-customizer > summary span:last-child img { width: 16px; height: 16px; transition: transform .15s ease; }
	.rj-customizer[open] > summary span:last-child img { transform: rotate(90deg); }
	.rj-customizer:not([open]) > .rj-customizer-form { display: none; }
	.rj-customizer > header { display: none; gap: 14px; align-items: center; padding: 14px 18px; border-bottom: 1px solid #eeeae2; background: #fbfaf7; }
	.rj-customizer > header > img { width: 44px; height: 52px; object-fit: contain; }
	.rj-customizer > header div { min-width: 0; flex: 1; }
	.rj-customizer > header small { color: #a80139; font: 600 10px/14px 'Sarala', sans-serif; letter-spacing: 1.2px; }
	.rj-customizer h2 { margin: 0; color: #202020; font: 500 19px/26px 'Sarala', sans-serif; letter-spacing: 0; }
	.rj-customizer header p { margin: 1px 0 0; color: #777; font-size: 12px; }
	.rj-customizer-form { padding: 0 18px 15px; }
	.rj-customizer-body { display: flex; flex-direction: column; gap: 18px; padding-top: 16px; }
	.rj-customizer fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
	.rj-customizer legend { padding: 0; color: #404040; font: 500 14px/20px 'Sarala', sans-serif; }
	.rj-customizer-options { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 10px; }
	.rj-customizer-options button { display: flex; min-height: 40px; align-items: center; justify-content: center; gap: 8px; padding: 8px 12px; border: 1px solid #d7d7d7; border-radius: 4px; background: #fff; color: #484848; font: 400 13px/18px 'Lato', sans-serif; cursor: pointer; transition: border-color .15s ease, background .15s ease; }
	.rj-customizer-options button.selected { border-color: #cca646; background: #fff9eb; box-shadow: inset 0 0 0 1px #cca646; color: #202020; }
	.rj-customizer-options button:hover { border-color: #cca646; }
	.rj-customizer-options button:focus-visible, .rj-ring-view:focus-visible { outline: 2px solid #cca646; outline-offset: 2px; }
	.rj-customizer-metals button { min-width: 150px; justify-content: flex-start; }
	.rj-customizer-metals img { width: 28px; height: 22px; object-fit: contain; }
	.rj-customizer-values button { min-width: 48px; }
	.rj-customizer-cuts button { min-width: 98px; }
	.rj-customizer-cuts img { width: 25px; height: 27px; object-fit: contain; }
	.rj-customizer footer { display: flex; gap: 14px; align-items: center; justify-content: space-between; padding-top: 16px; }
	.rj-customizer footer > div { display: flex; min-width: 0; flex-direction: column; gap: 2px; }
	.rj-customizer footer small { color: #8a8a8a; font: 10px/14px 'Lato', sans-serif; }
	.rj-customizer footer button { cursor: pointer; }
	.rj-ring-view { display: flex; gap: 8px; align-items: center; padding: 6px 0; border: 0; background: transparent; color: #707070; font: 400 13px 'Sarala', sans-serif; }
	.rj-ring-view img:first-child { width: 25px; height: 20px; }
	.rj-ring-view img:last-child { width: 15px; height: 15px; }

	@media (max-width: 639px) {
		.rj-customizer { width: 100%; margin-left: 0; }
		.rj-customizer > summary { display: flex; min-height: 38px; padding: 6px 0; border: 0; }
		.rj-customizer[open] > header { display: flex; padding: 12px 14px; }
		.rj-customizer > header > img { width: 38px; height: 46px; }
		.rj-customizer h2 { font-size: 17px; line-height: 23px; }
		.rj-customizer-form { padding: 0 14px 15px; }
		.rj-customizer fieldset { padding: 0; }
		.rj-customizer-options { gap: 8px; padding-left: 0; }
		.rj-customizer-metals button { flex: 1 1 135px; min-width: 0; }
		.rj-customizer-cuts button { flex: 1 1 100px; min-width: 0; justify-content: flex-start; }
		.rj-customizer footer { align-items: stretch; flex-direction: column-reverse; }
		.rj-ring-view { align-self: flex-start; }
	}
</style>
