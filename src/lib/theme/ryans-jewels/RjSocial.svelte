<script lang="ts">
 import { onMount } from 'svelte'
 import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from '@lucide/svelte'
 import emblaCarouselSvelte from 'embla-carousel-svelte'
 import AutoScroll from 'embla-carousel-auto-scroll'
 import type { EmblaCarouselType } from 'embla-carousel'
 import type { InstagramTile } from './instagram-feed.js'
 import RjSocialClip from './RjSocialClip.svelte'
 const profile = 'https://www.instagram.com/ryan.jewelers/'
 // shortcut: public previews are cached locally; refresh this list when newer Instagram posts are needed.
 const posts: (InstagramTile & { label?: string })[] = [
  { src: '/ryans-jewels/social/instagram-De7FmKxyypJ.jpg', isVideo: true, href: 'https://www.instagram.com/reel/De7FmKxyypJ/', alt: 'Ryan Jewelers custom jewelry reel' },
  { src: '/ryans-jewels/social/instagram-Def5HA1AaqB.jpg', videoSrc: '/ryans-jewels/social/instagram-Def5HA1AaqB.mp4', isVideo: true, href: 'https://www.instagram.com/reel/Def5HA1AaqB/', alt: 'Ryan Jewelers custom grillz reel' },
  { src: '/ryans-jewels/social/instagram-Deah4HTgELI.jpg', isVideo: true, href: 'https://www.instagram.com/reel/Deah4HTgELI/', alt: 'Ryan Jewelers engagement ring reel' },
  { src: '/ryans-jewels/social/instagram-DeQBea9hd3P.jpg', isVideo: true, href: 'https://www.instagram.com/reel/DeQBea9hd3P/', alt: 'A custom piece from Ryan Jewelers' },
  { src: '/ryans-jewels/social/instagram-Dd-FCG5skCo.jpg', videoSrc: '/ryans-jewels/social/instagram-Dd-FCG5skCo.mp4', isVideo: true, href: 'https://www.instagram.com/reel/Dd-FCG5skCo/', alt: 'Ryan Jewelers jewelry reel from Salisbury' },
  { src: '/ryans-jewels/social/instagram-Dd37dEpshix.jpg', videoSrc: '/ryans-jewels/social/instagram-Dd37dEpshix.mp4', isVideo: true, href: 'https://www.instagram.com/reel/Dd37dEpshix/', alt: 'A closer look at Ryan Jewelers jewelry' },
  { src: '/ryans-jewels/social/reel-2.webp', videoSrc: '/ryans-jewels/social/reel-2.mp4', isVideo: true, href: profile, label: 'Made personal', alt: 'Custom Ryan Jewelers diamond pendant' },
  { src: '/ryans-jewels/social/opal-ring.webp', isVideo: false, href: profile, label: 'A little color', alt: 'Gold ring with a colorful opal center' },
  { src: '/ryans-jewels/social/reel-3.webp', videoSrc: '/ryans-jewels/social/reel-3.mp4', isVideo: true, href: profile, alt: 'Diamond basketball pendant' },
  { src: '/ryans-jewels/social/reel-1.webp', videoSrc: '/ryans-jewels/social/reel-1.mp4', isVideo: true, href: profile, label: 'In the spotlight', alt: 'Diamond star pendant close-up' }
 ]
 let carouselApi = $state<EmblaCarouselType>()
 const autoScroll = AutoScroll({ speed: 1, startDelay: 1500, playOnInit: false, stopOnMouseEnter: true, stopOnInteraction: true })
 const carouselConfig = { options: { loop: true, align: 'start' as const }, plugins: [autoScroll] }
 let paused = $state(false)
 let hovered = $state(false)
 let focused = $state(false)
 let touching = $state(false)
 let reducedMotion = $state(false)
 let atStart = $state(true)
 let atEnd = $state(true)

 onMount(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  const updatePreference = () => { reducedMotion = preference.matches; if (reducedMotion) paused = true }
  updatePreference()
  preference.addEventListener('change', updatePreference)
  return () => preference.removeEventListener('change', updatePreference)
 })

 $effect(() => {
  const api = carouselApi
  if (!api) return
  const refresh = () => { updateScrollState(); syncPlayback() }
  api.on('select', updateScrollState).on('reInit', refresh)
  document.addEventListener('visibilitychange', syncPlayback)
  refresh()
  return () => {
   api.off('select', updateScrollState).off('reInit', refresh)
   document.removeEventListener('visibilitychange', syncPlayback)
  }
 })

 $effect(syncPlayback)

 function updateScrollState() {
  atStart = !carouselApi?.canScrollPrev()
  atEnd = !carouselApi?.canScrollNext()
 }

 function syncPlayback() {
  if (!carouselApi) return
  if (paused || hovered || focused || touching || document.hidden || (atStart && atEnd)) autoScroll.stop()
  else autoScroll.play()
 }

 function scrollPosts(direction: -1 | 1) {
  autoScroll.stop()
  if (direction < 0) carouselApi?.scrollPrev(reducedMotion)
  else carouselApi?.scrollNext(reducedMotion)
  syncPlayback()
 }
</script>
<section class="rj-social" aria-labelledby="rj-social-heading" onmouseenter={() => hovered = true} onmouseleave={() => hovered = false} ontouchstart={() => touching = true} ontouchend={() => touching = false} ontouchcancel={() => touching = false}>
 <header>
  <div><p class="eyebrow">A CLOSER LOOK</p><h2 id="rj-social-heading">From our Instagram</h2></div>
  <div class="social-actions">
   <a class="profile" href={profile} target="_blank" rel="noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>Follow on Instagram <ArrowUpRight size={16} /></a>
   <div class="social-controls">
    <button class="social-playback" type="button" aria-label="Previous Instagram posts" disabled={atStart} onclick={() => scrollPosts(-1)}><ChevronLeft size={16} aria-hidden="true" /></button>
    <button class="social-playback" type="button" aria-label={paused ? 'Resume Instagram scrolling' : 'Pause Instagram scrolling'} disabled={atStart && atEnd} onclick={() => { paused = !paused; if (!paused) focused = false }}>
     {#if paused}<Play size={14} aria-hidden="true" />{:else}<Pause size={14} aria-hidden="true" />{/if}
    </button>
    <button class="social-playback" type="button" aria-label="Next Instagram posts" disabled={atEnd} onclick={() => scrollPosts(1)}><ChevronRight size={16} aria-hidden="true" /></button>
   </div>
  </div>
 </header>
 <div class="social-viewport" use:emblaCarouselSvelte={carouselConfig} onemblaInit={(event) => carouselApi = event.detail} onfocusin={() => focused = true} onfocusout={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) focused = false }}>
  <div class="social-grid">
   {#each posts as post (post.videoSrc || post.src || post.href)}
    <article>
     <div class="social-media">
      {#if post.isVideo && post.videoSrc}
       <RjSocialClip src={post.videoSrc} poster={post.src} label={post.alt} />
      {:else}
       <a href={post.href} target="_blank" rel="noreferrer" aria-label={post.isVideo ? 'Watch reel on Instagram' : 'See our jewelry on Instagram'}><img src={post.src} alt={post.alt} loading="lazy" width="480" height="480" />{#if post.isVideo}<span class="social-preview-play" aria-hidden="true"><Play size={26} fill="currentColor" /></span>{/if}</a>
      {/if}
      {#if post.isVideo && post.videoSrc}<a class="social-open" href={post.href} target="_blank" rel="noreferrer" aria-label="Open reel on Instagram"><ArrowUpRight size={18} aria-hidden="true" /></a>{/if}
     </div>
    </article>
   {/each}
  </div>
 </div>
</section>
<style>
 .rj-social { width: 100%; margin: 0; padding: 15px 40px 60px; color: #353535; }
 header { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 28px; }
 .eyebrow { color: #9a7d3c; font-size: 10px; letter-spacing: 2px; margin: 0 0 12px; }
 h2 { font: 40px/1.1 'Libre Baskerville', serif; margin: 0; }
 a { color: inherit; text-decoration: none; }
 .profile { display: inline-flex; align-items: center; gap: 10px; padding: 12px 18px; border: 1px solid currentColor; font-size: 12px; white-space: nowrap; }
 .social-actions { display: flex; flex-shrink: 0; align-items: center; gap: 28px; }
 .social-controls { display: flex; align-items: center; gap: 12px; }
 .social-playback { display: grid; width: 36px; height: 40px; place-items: center; padding: 0; border: 0; background: transparent; color: inherit; cursor: pointer; }
 .social-playback:disabled { opacity: .25; cursor: default; }
 .social-playback:focus-visible { outline: 2px solid var(--rj-gold); outline-offset: 3px; }
 .social-viewport { width: 100%; overflow: hidden; }
 .social-grid { --social-gap: 18px; display: flex; align-items: flex-start; gap: var(--social-gap); touch-action: pan-y pinch-zoom; will-change: transform; }
 .social-grid > article { flex: 0 0 calc((100% - 5 * var(--social-gap)) / 6); min-width: 0; }
 .social-grid > article:last-child { margin-right: var(--social-gap); }
 .social-media { position: relative; aspect-ratio: 9 / 16; overflow: hidden; }
 .social-media > a:not(.social-open), .social-media img { display: block; width: 100%; height: 100%; object-fit: cover; }
 .social-preview-play { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; background: linear-gradient(transparent, #0002); pointer-events: none; }
 .social-open { position: absolute; z-index: 1; top: 10px; right: 10px; display: grid; width: 32px; height: 32px; place-items: center; border-radius: 50%; background: #2228; color: #fff; }
 a:hover { color: #9a7d3c; }
 a:focus-visible { outline: 2px solid var(--rj-gold); outline-offset: 4px; }
 @media (max-width: 1000px) { h2 { font-size: 34px; } .social-actions { gap: 18px; } .social-grid { --social-gap: 12px; } .social-grid > article { flex-basis: calc((100% - 2 * var(--social-gap)) / 3); } }
 @media (max-width: 639px) { .rj-social { padding: 10px 24px 35px; } header { align-items: start; flex-direction: column; gap: 15px; margin-bottom: 22px; } .social-actions { width: 100%; flex-wrap: wrap; justify-content: space-between; gap: 8px; } .social-controls { gap: 0; } .social-grid > article { flex-basis: calc((100% - var(--social-gap)) / 2); } h2 { font-size: 32px; } }
</style>
