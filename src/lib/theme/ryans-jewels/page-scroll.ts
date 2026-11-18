import Lenis from 'lenis'

export function enableSmoothPageScroll() {
	const eligibility = window.matchMedia('(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
	let scroller: Lenis | undefined

	const syncBodyLock = () => {
		if (!scroller) return
		const style = getComputedStyle(document.body)
		if (['hidden', 'clip'].includes(style.overflowY || style.overflow)) scroller.stop()
		else scroller.start()
	}
	const update = () => {
		scroller?.destroy()
		scroller = eligibility.matches ? new Lenis({
			autoRaf: true,
			lerp: 0.05,
			anchors: true,
			allowNestedScroll: true,
			stopInertiaOnNavigate: true,
			respectReducedMotion: true
		}) : undefined
		syncBodyLock()
	}

	// Ryan drawers lock the body; keep their background still while inner panels scroll.
	const observer = new MutationObserver(syncBodyLock)
	observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] })
	eligibility.addEventListener('change', update)
	update()

	return {
		reset(target: HTMLElement | number) {
			if (!scroller) return false
			scroller.scrollTo(target, { immediate: true, force: true })
			return true
		},
		destroy() {
			observer.disconnect()
			eligibility.removeEventListener('change', update)
			scroller?.destroy()
			scroller = undefined
		}
	}
}
