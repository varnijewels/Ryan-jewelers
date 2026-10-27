import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

export type Ring3DOptions = {
	style: number
	side: number
	crown: number
	shape: string
	carat: number
	metal: string
}

function outline(shape: string, angle: number): [number, number] {
	const x = Math.cos(angle)
	const z = Math.sin(angle)
	switch (shape) {
		case 'Oval': return [x * .8, z * 1.16]
		case 'Emerald':
		case 'Radiant': {
			const corners = [[1, .68], [.68, 1], [-.68, 1], [-1, .68], [-1, -.68], [-.68, -1], [.68, -1], [1, -.68]]
			const segment = angle / (Math.PI / 4)
			const start = corners[Math.floor(segment) % 8]
			const end = corners[(Math.floor(segment) + 1) % 8]
			const fraction = segment - Math.floor(segment)
			return [(start[0] + (end[0] - start[0]) * fraction) * (shape === 'Emerald' ? .74 : .85), (start[1] + (end[1] - start[1]) * fraction) * 1.1]
		}
		case 'Princess': return [Math.sign(x) * Math.abs(x) ** .15 * .85, Math.sign(z) * Math.abs(z) ** .15 * .85]
		case 'Cushion': return [Math.sign(x) * Math.abs(x) ** .5 * .92, Math.sign(z) * Math.abs(z) ** .5]
		case 'Pear': return [x * .78 * (1 - .32 * z), z * 1.15]
		case 'Marquise': return [x * Math.abs(x) ** .4 * .65, z * 1.28]
		case 'Heart': return [Math.sin(angle) ** 3, (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) / 17]
		default: return [x, z]
	}
}

export function createDiamondGeometry(shape: string) {
	const count = shape === 'Emerald' || shape === 'Radiant' ? 8 : 32
	const layers = [
		{ y: .38, radius: .53 }, { y: .2, radius: .8 },
		{ y: .015, radius: 1 }, { y: -.015, radius: 1 },
		{ y: -.42, radius: .58 }, { y: -.8, radius: .015 }
	]
	const vertices: number[] = []
	const point = (layer: number, index: number) => {
		const sides = count === 8 ? 8 : layer === 0 ? 8 : layer === 1 || layer === 4 ? 16 : 32
		const offset = count === 8 || layer !== 1 && layer !== 4 ? 0 : .5
		const segment = (index % count) / count * sides + offset
		const start = outline(shape, Math.floor(segment) / sides * Math.PI * 2)
		const end = outline(shape, (Math.floor(segment) + 1) % sides / sides * Math.PI * 2)
		const fraction = segment - Math.floor(segment)
		const x = start[0] + (end[0] - start[0]) * fraction
		const z = start[1] + (end[1] - start[1]) * fraction
		return [x * layers[layer].radius, layers[layer].y, z * layers[layer].radius]
	}
	for (let i = 0; i < count; i++) {
		vertices.push(0, layers[0].y, 0, ...point(0, i + 1), ...point(0, i))
		for (let layer = 0; layer < layers.length - 1; layer++) {
			vertices.push(...point(layer, i), ...point(layer, i + 1), ...point(layer + 1, i))
			vertices.push(...point(layer, i + 1), ...point(layer + 1, i + 1), ...point(layer + 1, i))
		}
		vertices.push(0, layers.at(-1)!.y, 0, ...point(layers.length - 1, i), ...point(layers.length - 1, i + 1))
	}
	const geometry = new THREE.BufferGeometry()
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
	geometry.computeVertexNormals()
	geometry.computeBoundingSphere()
	return geometry
}

// shortcut: parametric proportions approximate a ring; replace with product CAD for an exact product preview.
export function createRingModel(options: Ring3DOptions) {
	const ring = new THREE.Group()
	const metal = new THREE.MeshPhysicalMaterial({
		name: options.metal,
		color: options.metal === 'Yellow gold' ? '#e8bd69' : options.metal === 'Rose gold' ? '#e3aea0' : '#e0e3e6',
		metalness: 1, roughness: .13, clearcoat: 1, clearcoatRoughness: .12, envMapIntensity: 1.5
	})
	const diamond = new THREE.MeshPhysicalMaterial({
		name: 'Diamond', color: '#ffffff', metalness: 0, roughness: .015,
		transmission: 1, thickness: .5, ior: 2.333, dispersion: .04,
		envMapIntensity: 1.8, clearcoat: 1, flatShading: true
	})
	// shortcut: mirrored back facets approximate internal reflections; use diamond ray tracing for optical accuracy.
	const facets = new THREE.MeshPhysicalMaterial({
		name: 'Diamond inner facets', color: '#e9f2ff', metalness: 1,
		roughness: .025, side: THREE.BackSide, flatShading: true, envMapIntensity: 1.2
	})
	const addMesh = (geometry: THREE.BufferGeometry, material = metal) => {
		const mesh = new THREE.Mesh(geometry, material)
		mesh.castShadow = material === metal
		mesh.receiveShadow = material === metal
		ring.add(mesh)
		return mesh
	}
	const addDiamond = (geometry: THREE.BufferGeometry) => {
		const stone = addMesh(geometry, diamond)
		const reflection = new THREE.Mesh(geometry, facets)
		reflection.scale.setScalar(.995)
		stone.add(reflection)
		return stone
	}
	const tube = (points: THREE.Vector3[], radius: number, closed = false) =>
		addMesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, closed), closed ? 192 : 32, radius, 12, closed))
	const strands = [2, 3, 4].includes(options.style) ? 2 : 1
	for (let strand = 0; strand < strands; strand++) {
		const points = Array.from({ length: 96 }, (_, i) => {
			const angle = i / 96 * Math.PI * 2
			const top = Math.max(0, Math.sin(angle))
			const phase = strand * Math.PI
			const radius = options.style === 2 ? 1 + .035 * Math.cos(angle * 3 + phase) : 1
			const spread = options.style === 2 ? .085 * Math.sin(angle * 3 + phase)
				: options.style === 3 ? (strand ? 1 : -1) * .14 * top ** 2
				: options.style === 4 ? (strand ? .13 : -.13) : 0
			return new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), spread)
		})
		const band = tube(points, strands === 1 ? .075 : .052, true)
		band.name = 'Band'
		if (strands === 1) band.geometry.scale(1, 1, 1.4)
		if (options.style === 5) {
			const positions = band.geometry.getAttribute('position')
			for (let i = 0; i < positions.count; i++) {
				positions.setZ(i, positions.getZ(i) * (1 - .65 * Math.max(0, positions.getY(i))))
			}
			band.geometry.computeVertexNormals()
		}
	}
	if (options.style === 1) {
		for (const side of [-1, 1]) tube([
			new THREE.Vector3(side * .86, .5, 0), new THREE.Vector3(side * .64, .94, 0),
			new THREE.Vector3(side * .28, 1.3, 0)
		], .05)
	}

	const radius = .34 * Math.cbrt(options.carat)
	const centreY = 1.18 + radius * .55
	const centre = addDiamond(createDiamondGeometry(options.shape))
	centre.name = 'Centre diamond'
	centre.scale.setScalar(radius)
	centre.position.y = centreY
	const settingRail = (radius: number, y: number) => tube(Array.from({ length: 64 }, (_, i) => {
		const [x, z] = outline(options.shape, i / 64 * Math.PI * 2)
		return new THREE.Vector3(x * radius, y, z * radius)
	}), .025, true)
	settingRail(radius * .77, centreY - radius * .25)
	for (let i = 0; i < 4; i++) {
		const angle = Math.PI / 4 + i * Math.PI / 2
		const [x, z] = outline(options.shape, angle)
		const prongX = x * radius * 1.02
		const prongZ = z * radius * 1.02
		tube([
			new THREE.Vector3(prongX * .45, 1.01, prongZ * .45),
			new THREE.Vector3(prongX, centreY - radius * .1, prongZ),
			new THREE.Vector3(prongX * .94, centreY + radius * .17, prongZ * .94)
		], .025)
		const tip = addMesh(new THREE.SphereGeometry(.031, 12, 8))
		tip.position.set(prongX * .94, centreY + radius * .17, prongZ * .94)
	}

	const smallDiamondGeometry = createDiamondGeometry('Round')
	let accentSeat: THREE.TorusGeometry | undefined
	const smallStone = (x: number, y: number, z: number, size: number) => {
		const stone = addDiamond(smallDiamondGeometry)
		stone.name = 'Accent diamond'
		stone.scale.setScalar(size)
		stone.position.set(x, y, z)
		accentSeat ||= new THREE.TorusGeometry(.9, .13, 8, 16)
		const seat = new THREE.Mesh(accentSeat, metal)
		seat.rotation.x = Math.PI / 2
		seat.position.y = -.18
		stone.add(seat)
		return stone
	}
	if (options.crown > 0) {
		const haloY = options.crown === 1 ? centreY - radius * .3 : centreY - .02
		const haloRadius = radius * (options.crown === 1 ? .84 : 1.27)
		settingRail(haloRadius, haloY - .03)
		for (let i = 0; i < 20; i++) {
			const angle = i / 20 * Math.PI * 2
			const [x, z] = outline(options.shape, angle)
			smallStone(x * haloRadius, haloY, z * haloRadius, radius * .13)
		}
	}
	if (options.side > 0) {
		for (const side of [-1, 1]) {
			for (let i = 0; i < 8; i++) {
				const angle = .37 + i * .105
				const stone = smallStone(side * Math.sin(angle) * 1.07, Math.cos(angle) * 1.07, 0, options.side === 2 ? .065 : .052)
				stone.rotation.z = -side * angle
			}
			if (options.side === 3) {
				for (const z of [-.078, .078]) tube(Array.from({ length: 24 }, (_, i) => {
					const angle = .3 + i / 23 * .9
					return new THREE.Vector3(side * Math.sin(angle) * 1.06, Math.cos(angle) * 1.06, z)
				}), .018)
			}
		}
	}
	if (!options.side && !options.crown) smallDiamondGeometry.dispose()
	ring.rotation.x = 1.25
	ring.position.y = -.65
	return ring
}

export function disposeRingModel(model: THREE.Object3D) {
	const geometries = new Set<THREE.BufferGeometry>()
	const materials = new Set<THREE.Material>()
	model.traverse((object) => {
		if (object instanceof THREE.Mesh) {
			geometries.add(object.geometry)
			for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material)
		}
	})
	geometries.forEach((geometry) => geometry.dispose())
	materials.forEach((material) => material.dispose())
}

export function createRingViewer(host: HTMLElement, onUnavailable: () => void, onZoom: (zoom: number) => void) {
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.toneMapping = THREE.AgXToneMapping
	renderer.toneMappingExposure = 1.1
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.VSMShadowMap
	renderer.transmissionResolutionScale = .75
	const canvas = renderer.domElement
	canvas.tabIndex = 0
	canvas.setAttribute('role', 'img')
	canvas.setAttribute('aria-label', '3D ring. Drag to rotate, pinch to zoom. Use arrow keys to rotate, plus or minus to zoom, and Home to reset.')
	canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab;outline-offset:-4px'
	host.append(canvas)

	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(32, 1, .1, 50)
	camera.position.set(1.5, 2.2, 3.4)
	const controls = new OrbitControls(camera, canvas)
	controls.target.set(0, -.55, .3)
	const initialDistance = camera.position.distanceTo(controls.target)
	controls.enablePan = false
	controls.enableDamping = true
	controls.dampingFactor = .12
	controls.rotateSpeed = .65
	controls.minDistance = initialDistance / 1.8
	controls.maxDistance = initialDistance / .7
	controls.minPolarAngle = .12
	controls.maxPolarAngle = Math.PI - .12
	// Keep one-finger vertical scrolling available on mobile; horizontal drags rotate the ring.
	canvas.style.touchAction = 'pan-y'
	controls.update()
	controls.saveState()

	const environment = new RoomEnvironment()
	const pmrem = new THREE.PMREMGenerator(renderer)
	const environmentMap = pmrem.fromScene(environment, .025)
	scene.environment = environmentMap.texture
	environment.dispose()
	pmrem.dispose()
	const light = new THREE.DirectionalLight('#ffffff', 3)
	light.position.set(-3, 6, 5)
	light.castShadow = true
	light.shadow.mapSize.set(1024, 1024)
	light.shadow.camera.left = light.shadow.camera.bottom = -3
	light.shadow.camera.right = light.shadow.camera.top = 3
	light.shadow.normalBias = .025
	light.shadow.radius = 4
	light.shadow.blurSamples = 8
	scene.add(light)
	const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .09 }))
	floor.rotation.x = -Math.PI / 2
	floor.position.y = -1.13
	floor.receiveShadow = true
	scene.add(floor)

	let model: THREE.Group | null = null
	let frame = 0
	let disposed = false
	const requestRender = () => {
		if (frame || disposed) return
		frame = requestAnimationFrame(() => {
			frame = 0
			if (controls.update()) requestRender()
			renderer.render(scene, camera)
		})
	}
	let previousZoom = 1
	const change = () => {
		const zoom = Math.round(initialDistance / camera.position.distanceTo(controls.target) * 1000) / 1000
		if (zoom !== previousZoom) { previousZoom = zoom; onZoom(zoom) }
		requestRender()
	}
	controls.addEventListener('change', change)
	const resize = new ResizeObserver(() => {
		const { width, height } = host.getBoundingClientRect()
		if (!width || !height) return
		camera.aspect = width / height
		camera.updateProjectionMatrix()
		renderer.setSize(width, height, false)
		requestRender()
	})
	resize.observe(host)
	const resetView = () => {
		controls.enableDamping = false
		controls.update()
		controls.reset()
		controls.enableDamping = true
	}
	const keydown = (event: KeyboardEvent) => {
		if (event.altKey || event.metaKey || event.ctrlKey) return
		switch (event.key) {
			case 'ArrowLeft': controls.rotateLeft(.2); break
			case 'ArrowRight': controls.rotateLeft(-.2); break
			case 'ArrowUp': controls.rotateUp(.15); break
			case 'ArrowDown': controls.rotateUp(-.15); break
			case '+': case '=': controls.dollyIn(.9); break
			case '-': controls.dollyOut(.9); break
			case 'Home': resetView(); break
			default: return
		}
		event.preventDefault()
		requestRender()
	}
	const contextLost = (event: Event) => { event.preventDefault(); onUnavailable() }
	canvas.addEventListener('keydown', keydown)
	canvas.addEventListener('webglcontextlost', contextLost)
	let lastReset = 0
	return {
		update(options: Ring3DOptions) {
			if (model) { scene.remove(model); disposeRingModel(model) }
			model = createRingModel(options)
			scene.add(model)
			requestRender()
		},
		setView(zoom: number, reset: number) {
			if (lastReset !== reset) { resetView(); lastReset = reset }
			camera.position.sub(controls.target).setLength(initialDistance / zoom).add(controls.target)
			controls.update()
			requestRender()
		},
		dispose() {
			disposed = true
			cancelAnimationFrame(frame)
			resize.disconnect()
			controls.dispose()
			canvas.removeEventListener('keydown', keydown)
			canvas.removeEventListener('webglcontextlost', contextLost)
			if (model) disposeRingModel(model)
			disposeRingModel(floor)
			light.shadow.dispose()
			environmentMap.dispose()
			renderer.dispose()
			canvas.remove()
		}
	}
}

export type RingViewer = ReturnType<typeof createRingViewer>
