import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createDiamondGeometry } from './ring-3d.js'

export function createDiamondViewer(host: HTMLElement, shape: string, onUnavailable: () => void) {
 const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 renderer.toneMapping = THREE.ACESFilmicToneMapping
 renderer.toneMappingExposure = 1
 const scene = new THREE.Scene()
 scene.background = new THREE.Color('#e9e7e2')
 const camera = new THREE.PerspectiveCamera(35, 1, .1, 30)
 camera.position.set(0, 5.3, 1.9)
 const pmrem = new THREE.PMREMGenerator(renderer)
 const room = new RoomEnvironment()
 // Broad white softboxes and narrow strips give the facets contrasting studio reflections.
 const panels: THREE.Mesh[] = []
 for (const [x, y, z, width, height, intensity] of [
  [-3, 4, 2, 2, 4, 5], [4, 2, -2, 1, 5, 4],
  [0, 5, -3, 4, 2, 3], [-1, -3, 4, .4, 3, 6]
 ]) {
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(intensity), side: THREE.DoubleSide }))
  panel.position.set(x, y, z)
  panel.lookAt(0, 0, 0)
  room.add(panel)
  panels.push(panel)
 }
 // shortcut: small spectral reflection cards reinforce fire; use spectral ray tracing for accurate internal dispersion.
 for (const [colour, x, y, z] of [
  ['#658dff', -2, 3, -2], ['#ff9f55', 3, 1, 2], ['#b07aff', 1, -2, -3], ['#ff707b', -3, 1, 3]
 ] as const) {
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(.55, 1.8), new THREE.MeshBasicMaterial({ color: new THREE.Color(colour).multiplyScalar(3), side: THREE.DoubleSide }))
  panel.position.set(x, y, z)
  panel.lookAt(0, 0, 0)
  room.add(panel)
  panels.push(panel)
 }
 const environment = pmrem.fromScene(room, .005)
 for (const panel of panels) {
  room.remove(panel)
  panel.geometry.dispose()
  ;(panel.material as THREE.Material).dispose()
 }
 scene.environment = environment.texture
 room.dispose()
 pmrem.dispose()
 const geometry = createDiamondGeometry(shape)
 const material = new THREE.MeshPhysicalMaterial({
  color: '#ffffff', roughness: .008, metalness: 0, transmission: 1,
  thickness: 2.2, ior: 2.417, dispersion: .12, flatShading: true,
  envMapIntensity: 1, clearcoat: 0
 })
 // shortcut: inner mirrored facets approximate reflections; use optical ray tracing for gem certification imagery.
 const innerMaterial = new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 1, roughness: .035, envMapIntensity: 1.6, side: THREE.BackSide, flatShading: true })
 const stone = new THREE.Mesh(geometry, material)
 const inner = new THREE.Mesh(geometry, innerMaterial)
 inner.scale.setScalar(.995)
 stone.add(inner)
 stone.rotation.y = .2
 scene.add(stone)
 const controls = new OrbitControls(camera, renderer.domElement)
 controls.enableZoom = false
 controls.enablePan = false
 controls.enableDamping = true
 controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
 controls.autoRotateSpeed = .65
 controls.minPolarAngle = .2
 controls.maxPolarAngle = Math.PI - .2
 const canvas = renderer.domElement
 canvas.tabIndex = 0
 canvas.setAttribute('role', 'img')
 canvas.setAttribute('aria-label', `${shape} diamond 3D preview`)
 const keydown = (event: KeyboardEvent) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
  event.preventDefault()
  stone.rotation.y += event.key === 'ArrowLeft' ? -.15 : .15
 }
 canvas.addEventListener('keydown', keydown)
 const lost = (event: Event) => { event.preventDefault(); renderer.setAnimationLoop(null); onUnavailable() }
 canvas.addEventListener('webglcontextlost', lost)
 host.appendChild(canvas)
 const resize = () => {
  const { width, height } = host.getBoundingClientRect()
  if (!width || !height) return
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
 }
 const observer = new ResizeObserver(resize)
 observer.observe(host)
 resize()
 let inView = true
 const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting })
 visibility.observe(host)
 renderer.setAnimationLoop(() => {
  if (!inView || document.hidden) return
  controls.update()
  renderer.render(scene, camera)
 })
 return () => {
  renderer.setAnimationLoop(null)
  observer.disconnect()
  visibility.disconnect()
  controls.dispose()
  canvas.removeEventListener('keydown', keydown)
  canvas.removeEventListener('webglcontextlost', lost)
  geometry.dispose()
  material.dispose()
  innerMaterial.dispose()
  environment.dispose()
  renderer.dispose()
  canvas.remove()
 }
}
