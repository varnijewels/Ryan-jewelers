import { cleanup, render, screen } from '@testing-library/svelte'
import { tick } from 'svelte'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import RjChatWidget from '../src/lib/theme/ryans-jewels/RjChatWidget.svelte'

const play = vi.fn()
const pause = vi.fn()
beforeEach(() => {
 vi.useFakeTimers()
 play.mockReset().mockResolvedValue(undefined)
 pause.mockReset()
 vi.stubGlobal('Audio', class { volume = 1; play = play; pause = pause })
 vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
})
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals() })

it('waits five seconds, then shows the help links and plays one chime', async () => {
 render(RjChatWidget)
 await tick()
 vi.advanceTimersByTime(4999)
 await tick()
 expect(screen.queryAllByRole('link')).toHaveLength(0)
 expect(play).not.toHaveBeenCalled()
 vi.advanceTimersByTime(1)
 await tick()
 expect(screen.getAllByRole('link')).toHaveLength(2)
 expect(play).toHaveBeenCalledTimes(1)
 vi.advanceTimersByTime(10000)
 expect(play).toHaveBeenCalledTimes(1)
})

it('still shows when autoplay is blocked', async () => {
 play.mockRejectedValue(new Error('Autoplay blocked'))
 render(RjChatWidget)
 await tick()
 vi.advanceTimersByTime(5000)
 await tick()
 expect(screen.getAllByRole('link')).toHaveLength(2)
})

it('cancels the reveal and sound when leaving the homepage', async () => {
 const { unmount } = render(RjChatWidget)
 await tick()
 unmount()
 vi.advanceTimersByTime(5000)
 expect(play).not.toHaveBeenCalled()
 expect(pause).toHaveBeenCalled()
 expect(vi.getTimerCount()).toBe(0)
})

it('keeps the chime silent while the widget is hidden on mobile', async () => {
 vi.mocked(window.matchMedia).mockReturnValue({ matches: false } as MediaQueryList)
 render(RjChatWidget)
 await tick()
 vi.advanceTimersByTime(5000)
 await tick()
 expect(play).not.toHaveBeenCalled()
})
