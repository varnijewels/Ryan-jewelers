<script lang="ts">
	import { onMount } from 'svelte'
	import { ArrowRight, ArrowUpRight } from '@lucide/svelte'
	import { diamondShapes } from './home-content.js'

	let { onEnquire }: { onEnquire?: (message: string) => void } = $props()
	// Match each photograph's cut outline so white facets stay opaque and the surrounding canvas is clear.
	const cutouts: Record<string, { size: number; path: string }> = {
		round: { size: 800, path: 'M80 386L90 329L103 285L136 216L162 188L203 156L233 136L259 121L278 113L306 104L377 89L415 89L486 104L529 120L559 136L591 157L611 174L629 192L652 219L687 276L703 334L711 377L711 427L707 451L697 491L691 509L673 547L649 583L613 623L571 655L555 665L518 684L486 696L470 700L394 711L345 704L282 687L266 681L244 670L216 652L188 632L171 616L135 574L115 540L101 511L84 446L80 409Z' },
		oval: { size: 800, path: 'M157 372L162 321L167 296L182 243L190 223L208 186L225 156L272 107L305 85L342 65L402 59L429 64L466 74L510 102L541 133L570 168L587 200L611 265L618 290L625 324L629 357L631 399L629 447L623 491L618 511L609 542L590 592L562 638L551 654L539 668L509 696L493 707L473 718L443 729L421 735L395 738L343 734L321 725L281 697L242 659L219 627L196 585L177 535L165 488L157 418Z' },
		radiant: { size: 800, path: 'M153 194L154 129L209 78L581 78L596 88L633 123L639 129L636 663L634 666L581 714L488 715L211 714L160 670L156 666L155 659Z' },
		pear: { size: 800, path: 'M172 460L177 416L187 360L209 298L240 219L267 184L321 120L353 87L394 54L396 54L430 81L469 120L498 153L533 201L569 263L585 302L606 360L617 428L620 464L620 498L617 527L611 558L603 582L591 607L569 642L557 657L531 683L513 699L493 712L478 719L452 729L405 739L391 739L366 735L328 725L304 715L284 703L225 655L192 589L181 557L176 533L172 493Z' },
		cushion: { size: 800, path: 'M104 380L111 315L129 229L135 211L146 187L170 153L185 136L222 117L249 106L294 97L331 92L369 89L409 89L471 94L537 104L562 112L588 125L609 140L628 157L644 176L666 223L671 241L688 338L692 382L692 407L686 473L673 549L668 569L655 606L633 637L619 652L606 662L573 678L550 687L470 706L443 709L401 711L337 707L289 699L236 687L207 673L189 660L152 628L141 607L126 561L108 460L104 416Z' },
		princess: { size: 800, path: 'M125 136L127 133L146 131L666 132L668 135L668 192L665 663L128 664L126 644L125 471Z' },
		asscher: { size: 800, path: 'M104 199L182 112L198 100L273 96L599 102L655 153L678 177L690 197L691 203L689 616L667 646L598 713L594 714L200 716L185 703L137 655L110 623L107 616Z' },
		emerald: { size: 800, path: 'M166 145L240 73L558 72L628 147L629 189L626 653L555 724L538 727L240 725L173 658L170 653Z' },
		marquise: { size: 800, path: 'M208 394L214 328L221 293L234 248L257 184L297 125L321 96L339 78L393 30L396 28L400 28L409 34L444 62L471 88L494 113L514 141L532 171L549 206L564 244L581 303L587 335L591 371L591 420L586 467L581 495L570 537L553 584L530 629L511 660L479 703L465 717L415 758L399 769L386 761L363 742L305 687L278 647L260 612L238 562L222 511L214 472L210 442Z' },
		heart: { size: 720, path: 'M484 117L508 120L523 124L540 131L561 144L572 153L591 173L599 185L606 198L614 220L620 250L620 280L617 302L611 328L602 355L584 394L557 435L523 477L481 519L435 558L381 597L359 611L353 612L292 571L259 545L234 523L190 478L167 450L150 426L125 380L107 329L102 306L99 279L99 252L104 223L111 202L119 186L130 169L149 150L164 139L196 123L221 118L250 119L269 125L293 136L315 151L334 168L384 168L408 146L428 133L454 122L459 122L461 120L470 118Z' }
	}
	let diamondIndex = $state(diamondShapes.findIndex((item) => item.key === 'radiant'))
	let direction = $state(1)
	let revealMode = $state(0)
	const shape = $derived(diamondShapes[diamondIndex])
	const cutout = $derived(cutouts[shape.key])

	let marqueeTrack: HTMLDivElement

	onMount(() => {
		let previousScroll = window.scrollY
		let resetTimer: ReturnType<typeof setTimeout> | undefined
		const followScroll = () => {
			const delta = window.scrollY - previousScroll
			previousScroll = window.scrollY
			if (Math.abs(delta) < 2) return
			const animation = marqueeTrack.getAnimations?.()[0]
			if (!animation) return
			const duration = animation.effect?.getTiming().duration
			if (delta < 0 && typeof animation.currentTime === 'number' && animation.currentTime < 2000 && typeof duration === 'number') animation.currentTime += duration
			animation.updatePlaybackRate((delta > 0 ? 1 : -1) * Math.min(3, 1 + Math.abs(delta) / 100))
			clearTimeout(resetTimer)
			resetTimer = setTimeout(() => animation.updatePlaybackRate(1), 600)
		}
		window.addEventListener('scroll', followScroll, { passive: true })
		return () => { window.removeEventListener('scroll', followScroll); clearTimeout(resetTimer) }
	})

	function changeDiamond(step: number) {
		direction = step
		diamondIndex = (diamondIndex + step + diamondShapes.length) % diamondShapes.length
		revealMode = (revealMode + 1) % 3
	}

	function enquire() {
		onEnquire?.(`I'm interested in a white ${shape.label.toLowerCase()}-cut diamond. Please share available stones and options.`)
	}
</script>

<section class="rj-diamond-collection" aria-labelledby="rj-diamond-collection-heading">
	<div class="collection-marquee" aria-hidden="true">
		<div class="marquee-track" bind:this={marqueeTrack}>
			{#each [0, 1] as group (group)}
				<div class="marquee-group">
					{#each [0, 1, 2] as repeat (repeat)}
						{#each ['Any shape', 'Natural white', 'Timeless brilliance'] as phrase (phrase)}
							<span class="marquee-item"><span>{phrase}</span><svg width="20" height="24" viewBox="0 0 20 24" fill="none"><path d="M5 1h10l4 4v14l-4 4H5l-4-4V5zM5 1l3 4h4l3-4M1 5l7 0v14l-7 0m7 0h4l3 4m-3-4V5h7" stroke="currentColor" stroke-width=".65" /></svg></span>
						{/each}
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<div class="collection-stage">
		<header class="collection-intro">
			<h2 id="rj-diamond-collection-heading"><span>Diamond <br />collection in </span><em>natural white.</em></h2>
		</header>
		<div class="diamond-display" style="--diamond-direction: {direction}">
			<button class="diamond-arrow previous" type="button" aria-label="Previous diamond" onclick={() => changeDiamond(-1)}><svg width="86" height="24" viewBox="0 0 86 24" fill="none" aria-hidden="true"><path d="M85 12H3m8-8-8 8 8 8" stroke="currentColor" stroke-width="1" /></svg></button>
			<div class="gem-art">
				{#key shape.key}
					<div class="gem-reveal reveal-{revealMode}">
						<svg class="diamond-preview" viewBox="0 0 {cutout.size} {cutout.size}" role="img" aria-label="{shape.label} diamond">
							<defs><clipPath id="rj-diamond-cutout"><path d={cutout.path} /></clipPath></defs>
							<image href="/ryans-jewels/shapes/real/{shape.key}.jpg" width={cutout.size} height={cutout.size} clip-path="url(#rj-diamond-cutout)" />
						</svg>
						<span class="gem-sparkle sparkle-one" aria-hidden="true">✧</span>
						<span class="gem-sparkle sparkle-two" aria-hidden="true">✧</span>
					</div>
				{/key}
			</div>
			<button class="diamond-arrow next" type="button" aria-label="Next diamond" onclick={() => changeDiamond(1)}><svg width="86" height="24" viewBox="0 0 86 24" fill="none" aria-hidden="true"><path d="M1 12h82M75 4l8 8-8 8" stroke="currentColor" stroke-width="1" /></svg></button>
		</div>
		<div class="collection-details">
			<dl><div class="detail-cut"><dt>Form</dt><dd>{shape.label} cut</dd></div><div class="detail-colour"><dt>Colour</dt><dd>Natural white</dd></div><div class="detail-feeling"><dt>Selected for</dt><dd>Your next chapter</dd></div></dl>
			<p class="diamond-count"><span>{String(diamondIndex + 1).padStart(2, '0')}</span> / {diamondShapes.length}</p>
		</div>
		<div class="diamond-caption" aria-live="polite" aria-atomic="true">
			{#key shape.key}<p><span class="caption-the">Natural</span><span class="caption-name">{shape.label}</span></p>{/key}
		</div>
	</div>
	<div class="collection-footer">
		<div class="collection-actions">
			<a class="enquire-diamond" href="#rj-enq" onclick={enquire}>Enquire about this diamond <ArrowUpRight size={16} aria-hidden="true" /></a>
			<a class="shop-shape" href={shape.href}>Explore {shape.label} designs <ArrowRight size={17} aria-hidden="true" /></a>
		</div>
	</div>
</section>

<style>
	.rj-diamond-collection { --collection-display: 'Helvetica Neue', Arial, sans-serif; position: relative; width: 100%; margin: 0 0 50px; overflow: hidden; background: #080807; color: #f2efe8; }
	.collection-marquee { display: flex; height: 86px; align-items: center; overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent); }
	.marquee-track { display: flex; width: max-content; animation: diamond-marquee 70s linear infinite; will-change: transform; }
	.marquee-group { display: flex; flex: 0 0 auto; align-items: center; gap: 70px; padding-right: 70px; }
	.marquee-item { display: flex; flex: 0 0 auto; align-items: center; gap: 70px; white-space: nowrap; }
	.marquee-item > span { color: #c7c5c0; font: 500 14px/1.5 var(--font-body, sans-serif); text-transform: uppercase; }
	.marquee-item > svg { color: #a58950; opacity: .7; }
	.collection-marquee:hover .marquee-track { animation-play-state: paused; }
	.collection-stage { position: relative; height: calc(100svh - 180px); min-height: 620px; max-height: 800px; }
	.collection-intro { position: absolute; z-index: 2; top: 15%; left: 80px; max-width: 260px; }
	.collection-intro h2 { display: flex; flex-direction: column; gap: 2px; margin: 0; color: #a7a6a2; font: 300 clamp(29px, 2.1vw, 38px)/1.15 var(--collection-display); letter-spacing: -.045em; }
	.collection-intro h2 em { color: #bd964c; font-style: normal; font-weight: 300; }
	.collection-intro h2, .collection-intro h2 > span, .collection-intro h2 > em { font-family: var(--collection-display) !important; font-weight: 300 !important; }
	.diamond-display { position: absolute; z-index: 2; top: 45%; left: 0; right: 0; transform: translateY(-50%); }
	.gem-art { position: relative; width: min(440px, 48vw); aspect-ratio: 1; margin: auto; perspective: 1000px; }
	.gem-reveal { position: absolute; inset: 0; }
	.diamond-preview { display: block; width: 100%; height: 100%; transform: scale(1.1); transform-origin: 50% 55%; }
	.reveal-0 .diamond-preview { animation: diamond-prism 900ms cubic-bezier(.16, 1, .3, 1) both; }
	.reveal-1 .diamond-preview { animation: diamond-orbit 1000ms cubic-bezier(.16, 1, .3, 1) both; }
	.reveal-2 .diamond-preview { animation: diamond-focus 950ms cubic-bezier(.16, 1, .3, 1) both; }
	.gem-sparkle { position: absolute; color: #cdb680; pointer-events: none; opacity: 0; animation: facet-sparkle 850ms ease-out 200ms both; }
	.sparkle-one { top: 18%; left: 20%; font-size: 34px; }.sparkle-two { bottom: 21%; right: 18%; font-size: 22px; animation-delay: 380ms; }
	.diamond-arrow { position: absolute; z-index: 4; top: 50%; display: grid; width: 100px; height: 48px; place-items: center; padding: 0; border: 0; background: transparent; color: #777773; transform: translateY(-50%); cursor: pointer; transition: color .2s, opacity .2s; }
	.diamond-arrow:hover { color: #e6d5b7; }.previous { left: 65px; }.next { right: 65px; }
	.collection-details { position: absolute; z-index: 3; inset: 0; pointer-events: none; }
	.collection-details dl { margin: 0; }.collection-details dl > div { position: absolute; }
	.detail-cut { top: 42%; right: calc(50% + 190px); }.detail-colour { top: 23%; left: calc(50% + 190px); }.detail-feeling { top: 61%; left: calc(50% + 200px); }
	.collection-details dt { margin-bottom: 5px; color: #70706b; font: 300 12px/1.5 var(--font-body, sans-serif); letter-spacing: -.02em; text-transform: uppercase; }
	.collection-details dd { margin: 0; color: #e0dfda; font: 500 13px/1.5 var(--font-body, sans-serif); text-transform: uppercase; }
	.diamond-count { position: absolute; bottom: 28px; left: 80px; margin: 0; color: #5e5b51; font: 10px/1.5 var(--font-body, sans-serif); letter-spacing: .15em; }.diamond-count > span { color: #a48b57; }
	.diamond-caption { position: absolute; z-index: 1; left: 0; right: 0; top: calc(45% + 210px); pointer-events: none; text-align: center; }
	.diamond-caption p { margin: 0; animation: caption-reveal 650ms cubic-bezier(.16, 1, .3, 1) both; }
	.caption-the, .caption-name { color: #41413c; font: 300 clamp(44px, 5.6vw, 96px)/1.12 var(--collection-display); letter-spacing: -.065em; }.caption-the { margin-right: .18em; }
	.collection-footer { display: flex; justify-content: flex-end; padding: 10px 65px 40px; }
	.collection-actions { display: flex; align-items: center; gap: 32px; }
	.collection-actions a { display: inline-flex; align-items: center; justify-content: center; gap: 14px; min-height: 42px; font: 12px/1.5 var(--font-body, sans-serif); text-decoration: none; }
	.shop-shape { padding: 10px 28px; border: 1px solid #d3d1c9; border-radius: 99px; color: #f2efe8; text-transform: uppercase; transition: color .25s, background .25s; }.shop-shape:hover { background: #f2efe8; color: #141410; }
	.enquire-diamond { color: #b39963; }.enquire-diamond:hover { color: #e2c88e; }
	.rj-diamond-collection :is(a, button):focus-visible { outline: 2px solid #c2a568; outline-offset: 5px; }
	@keyframes diamond-marquee { to { transform: translateX(-50%); } }
	@keyframes diamond-prism { 0% { opacity: 0; clip-path: polygon(48% 0, 52% 0, 58% 100%, 42% 100%); transform: rotate(calc(var(--diamond-direction) * -10deg)) scale(.92); filter: blur(6px) brightness(1.2); } 65% { opacity: 1; } 100% { opacity: 1; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: scale(1.1); filter: none; } }
	@keyframes diamond-orbit { 0% { opacity: 0; transform: perspective(900px) translateX(calc(var(--diamond-direction) * 65px)) rotateY(calc(var(--diamond-direction) * 60deg)) rotateZ(calc(var(--diamond-direction) * 9deg)) scale(.82); filter: blur(5px); } 100% { opacity: 1; transform: perspective(900px) translateX(0) rotateY(0) rotateZ(0) scale(1.1); filter: none; } }
	@keyframes diamond-focus { 0% { opacity: 0; clip-path: circle(8% at 50% 50%); transform: scale(1.4) rotate(calc(var(--diamond-direction) * -7deg)); filter: blur(9px) brightness(1.3); } 100% { opacity: 1; clip-path: circle(75% at 50% 50%); transform: scale(1.1); filter: none; } }
	@keyframes facet-sparkle { 0%, 100% { opacity: 0; transform: scale(.3) rotate(-30deg); } 45% { opacity: .8; transform: scale(1) rotate(30deg); } }
	@keyframes caption-reveal { from { opacity: 0; transform: translateY(12px); filter: blur(3px); } to { opacity: 1; transform: none; filter: none; } }
	@media (max-width: 1200px) { .collection-intro { left: 40px; max-width: 220px; }.collection-intro h2 { font-size: 30px; }.previous { left: 28px; }.next { right: 28px; }.diamond-count { left: 40px; }.collection-footer { padding-inline: 40px; }.detail-cut { right: calc(50% + 150px); }.detail-colour { left: calc(50% + 150px); }.detail-feeling { left: calc(50% + 160px); }.collection-details dd { font-size: 12px; } }
	@media (max-width: 900px) { .collection-intro { top: 7%; left: 32px; }.collection-intro h2 { font-size: 28px; }.collection-stage { min-height: 640px; }.gem-art { width: min(480px, 64vw); }.diamond-display { top: 48%; }.detail-cut { top: 78%; right: calc(50% + 55px); }.detail-colour { top: 78%; left: calc(50% + 25px); }.detail-feeling { display: none; }.diamond-caption { top: auto; bottom: 6px; }.diamond-count { bottom: 12px; left: 32px; font-size: 9px; }.collection-footer { padding: 24px 32px 35px; } }
	@media (max-width: 639px) { .rj-diamond-collection { margin-bottom: 30px; }.collection-marquee { height: 66px; }.marquee-group, .marquee-item { gap: 40px; }.marquee-group { padding-right: 40px; }.marquee-item > span { font-size: 11px; }.marquee-item > svg { width: 16px; height: 20px; }.collection-stage { height: 630px; min-height: 630px; }.collection-intro { top: 18px; left: 24px; max-width: 240px; }.collection-intro h2 { font-size: 27px; }.diamond-display { top: 49%; }.gem-art { width: min(400px, calc(100vw - 36px)); }.diamond-arrow { width: 48px; }.diamond-arrow > svg { width: 42px; }.previous { left: 8px; }.next { right: 8px; }.collection-details dt { font-size: 10px; }.collection-details dd { font-size: 11px; }.detail-cut, .detail-colour { top: 80%; }.detail-cut { right: calc(50% + 30px); }.detail-colour { left: calc(50% + 20px); }.diamond-count { display: none; }.diamond-caption { bottom: 14px; }.caption-the, .caption-name { font-size: clamp(34px, 10.8vw, 48px); }.collection-footer { justify-content: center; padding: 18px 24px 32px; }.collection-actions { width: 100%; flex-direction: column-reverse; gap: 8px; }.collection-actions a { font-size: 11px; }.shop-shape { width: 100%; max-width: 340px; }.enquire-diamond { min-height: 38px; } }
	@media (prefers-reduced-motion: reduce) { .marquee-track, .diamond-preview, .diamond-caption p { animation: none !important; clip-path: none !important; filter: none !important; }.gem-sparkle { display: none; }.diamond-arrow, .shop-shape { transition: none; } }
</style>
