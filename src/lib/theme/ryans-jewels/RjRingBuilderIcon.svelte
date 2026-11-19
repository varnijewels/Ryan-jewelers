<script lang="ts">
	type Point = [number, number, number]
	const ring = (radius: number, y: number): Point[] => Array.from({ length: 8 }, (_, index) => {
		const angle = (index + .5) * Math.PI / 4
		return [Math.sin(angle) * radius, y, Math.cos(angle) * radius]
	})
	const table = ring(4.8, -8.5)
	const girdle = ring(10.5, -3)
	const triangles: Point[][] = []
	for (let index = 0; index < 8; index++) {
		const next = (index + 1) % 8
		triangles.push(
			[[0, -8.5, 0], table[index], table[next]],
			[table[index], girdle[index], table[next]],
			[table[next], girdle[index], girdle[next]],
			[girdle[index], [0, 11, 0], girdle[next]]
		)
	}
	const facets = triangles.map(([a, b, c], index) => {
		const edge = (point: Point) => point.map((value, axis) => value - a[axis])
		let u = edge(b), v = edge(c)
		let normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
		if (normal.reduce((sum, value, axis) => sum + value * a[axis], 0) < 0) {
			[u, v] = [v, u]
			normal = normal.map(value => -value)
		}
		const length = Math.hypot(...normal)
		normal = normal.map(value => value / length)
		const light = Math.max(0, Math.min(1, .55 + (-normal[0] * .4 - normal[1] * .65 + normal[2] * .65) * .45 + (index % 4 === 1 ? -.12 : 0)))
		const color = `rgb(${Math.round(105 + light * 132)}, ${Math.round(121 + light * 124)}, ${Math.round(141 + light * 110)})`
		return `transform: matrix3d(${[...u.map(value => value / 64), 0, ...v.map(value => value / 64), 0, ...normal, 0, ...a, 1].join(',')}); --facet-color: ${color}; --facet-gold: color-mix(in srgb, var(--rj-gold, #cca646) ${Math.round(100 - light * 55)}%, var(--rj-cream, #faf6ea)); --facet-delay: ${-Math.floor(index / 4) * .75}s`
	})
</script>

<span class="rj-diamond-icon" aria-hidden="true">
	<span class="rj-diamond-glow"></span>
	<span class="rj-diamond-model">
		{#each facets as style}<span class="rj-diamond-facet" {style}></span>{/each}
	</span>
</span>

<style>
	.rj-diamond-icon { position: relative; display: inline-block; width: 26px; height: 26px; flex-shrink: 0; perspective: 160px; transform-origin: center; transition: transform 450ms cubic-bezier(.2, 1.3, .3, 1); }
	.rj-diamond-glow { position: absolute; inset: -4px; pointer-events: none; background: radial-gradient(circle, color-mix(in srgb, var(--rj-gold, #cca646) 24%, transparent), transparent 70%); opacity: 0; transform: scale(.65); transition: opacity 400ms ease, transform 600ms ease; }
	.rj-diamond-model { position: absolute; top: 50%; left: 50%; width: 0; height: 0; transform-origin: 0 0; transform-style: preserve-3d; animation: rj-diamond-rotate 6s linear infinite; }
	.rj-diamond-facet { position: absolute; top: 0; left: 0; width: 64px; height: 64px; transform-origin: 0 0; background-color: var(--facet-color); clip-path: polygon(0 0, 100% 0, 0 100%); backface-visibility: hidden; animation: rj-facet-shine 6s ease-in-out var(--facet-delay) infinite; transition: background-color 350ms ease; }
	.rj-diamond-icon::before, .rj-diamond-icon::after { content: ''; position: absolute; z-index: 1; width: 7px; height: 7px; pointer-events: none; background: #fff; clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%); filter: drop-shadow(0 0 1px #6989a6); opacity: 0; animation: rj-diamond-sparkle 6s ease-in-out infinite; }
	.rj-diamond-icon::before { top: 3px; right: 1px; animation-delay: -1.7s; }
	.rj-diamond-icon::after { bottom: 7px; left: 1px; width: 5px; height: 5px; animation-delay: -4s; }
	:global(.rj-ring-builder:is(:hover, :focus-visible)) .rj-diamond-icon { transform: scale(1.12); }
	:global(.rj-ring-builder:is(:hover, :focus-visible)) .rj-diamond-facet { background-color: var(--facet-gold); }
	:global(.rj-ring-builder:is(:hover, :focus-visible)) .rj-diamond-glow { opacity: 1; transform: scale(1.2); }
	:global(.rj-ring-builder:is(:hover, :focus-visible)) .rj-diamond-icon::before,
	:global(.rj-ring-builder:is(:hover, :focus-visible)) .rj-diamond-icon::after { animation-duration: 2.4s; background: var(--rj-cream, #faf6ea); filter: drop-shadow(0 0 1px var(--rj-gold, #cca646)); }
	@keyframes rj-diamond-rotate { from { transform: rotateX(-12deg) rotateY(0deg); } to { transform: rotateX(-12deg) rotateY(360deg); } }
	@keyframes rj-facet-shine { 0%, 18%, 100% { filter: brightness(1); } 8% { filter: brightness(1.65) contrast(1.12); } }
	@keyframes rj-diamond-sparkle { 0%, 12%, 28%, 100% { opacity: 0; transform: scale(.2) rotate(0deg); } 19% { opacity: .95; transform: scale(1) rotate(30deg); } }
	@media (prefers-reduced-motion: reduce) {
		.rj-diamond-model { animation: none; transform: rotateX(-12deg) rotateY(25deg); }
		.rj-diamond-facet, .rj-diamond-icon::before, .rj-diamond-icon::after { animation: none; }
		.rj-diamond-icon, .rj-diamond-glow, .rj-diamond-facet { transition: none; }
		.rj-diamond-icon { transform: none !important; }
	}
</style>
