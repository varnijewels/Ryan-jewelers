<script lang="ts">
 import { onMount } from 'svelte'
 import { Play, Pause } from '@lucide/svelte'
 let { src, poster, label }: { src: string; poster: string; label: string } = $props()
 let video: HTMLVideoElement
 let playing = $state(false)
 let visible = false
 let userPaused = false
 let reduced = false
 let manuallyStarted = false
 async function play() {
  if (!video.src) { video.src = src; video.load() }
  try { await video.play() } catch { playing = false }
 }
 function toggle() { if (playing) { userPaused = true; video.pause() } else { userPaused = false; manuallyStarted = true; void play() } }
 onMount(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  reduced = motion.matches
  const update = () => { if (visible && !document.hidden && !userPaused && (!reduced || manuallyStarted)) void play(); else video.pause() }
  const onMotion = () => { reduced = motion.matches; manuallyStarted = false; update() }
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() }, { threshold: .2 })
  observer.observe(video)
  motion.addEventListener('change', onMotion)
  document.addEventListener('visibilitychange', update)
  return () => { observer.disconnect(); video.pause(); motion.removeEventListener('change', onMotion); document.removeEventListener('visibilitychange', update) }
 })
</script>
<div class="clip"><video bind:this={video} {poster} muted loop playsinline preload="none" aria-label={label} onplay={() => playing = true} onpause={() => playing = false}></video><button type="button" onclick={toggle} aria-label="{playing ? 'Pause' : 'Play'} {label}">{#if playing}<Pause size={15} fill="currentColor" />{:else}<Play size={15} fill="currentColor" />{/if}</button><span class="reel-label">REEL</span></div>
<style>
 .clip { position: relative; width: 100%; height: 100%; background: #f1efeb; }
 video { display: block; width: 100%; height: 100%; object-fit: cover; }
 button { position: absolute; right: 12px; bottom: 12px; width: 44px; height: 44px; display: grid; place-items: center; border: 1px solid #ffffff55; border-radius: 50%; color: #fff; background: #2228; cursor: pointer; }
 button:focus-visible { outline: 2px solid white; outline-offset: 3px; }
 .reel-label { position: absolute; top: 14px; left: 14px; font-size: 9px; letter-spacing: 1.8px; color: #fff; background: #2228; padding: 6px 8px; }
</style>
