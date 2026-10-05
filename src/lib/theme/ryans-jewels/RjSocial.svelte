<script lang="ts">
 import { ArrowUpRight } from '@lucide/svelte'
 import RjSocialClip from './RjSocialClip.svelte'
 const profile = 'https://www.instagram.com/ryan.jewelers/'
 const posts = [
  { image: 'reel-2.webp', video: 'reel-2.mp4', label: 'Made personal', alt: 'Custom Ryan Jewelers diamond pendant' },
  { image: 'opal-ring.webp', video: '', label: 'A little color', alt: 'Gold ring with a colorful opal center' },
  { image: 'reel-3.webp', video: 'reel-3.mp4', label: '', alt: 'Diamond basketball pendant' },
  { image: 'reel-1.webp', video: 'reel-1.mp4', label: 'In the spotlight', alt: 'Diamond star pendant close-up' }
 ]
</script>
<section class="rj-social" aria-labelledby="rj-social-heading"><header><div><p class="eyebrow">A CLOSER LOOK</p><h2 id="rj-social-heading">From our Instagram</h2></div><a class="profile" href={profile} target="_blank" rel="noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>@ryan.jewelers <ArrowUpRight size={16} /></a></header>
 <div class="social-grid">{#each posts as post}<article><div class="social-media">{#if post.video}<RjSocialClip src={'/ryans-jewels/social/' + post.video} poster={'/ryans-jewels/social/' + post.image} label={post.alt} />{:else}<a href={profile} target="_blank" rel="noreferrer" aria-label="See our jewelry on Instagram"><img src={'/ryans-jewels/social/' + post.image} alt={post.alt} loading="lazy" width="480" height="480" /></a>{/if}</div>{#if post.label}<a class="caption" href={profile} target="_blank" rel="noreferrer">{post.label}<ArrowUpRight size={15} /></a>{/if}</article>{/each}</div>
</section>
<style>
 .rj-social { max-width: 1440px; margin: 0 auto; padding: 15px 48px 60px; color: #353535; }
 header { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 28px; }
 .eyebrow { color: #9a7d3c; font-size: 10px; letter-spacing: 2px; margin: 0 0 12px; }
 h2 { font: 40px/1.1 'Libre Baskerville', serif; margin: 0; }
 a { color: inherit; text-decoration: none; }
 .profile { display: inline-flex; align-items: center; gap: 10px; font-size: 12px; white-space: nowrap; padding-bottom: 5px; }
 .social-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
 .social-media { aspect-ratio: 4 / 5; overflow: hidden; border-radius: 4px; }
 .social-media > a, .social-media img { display: block; width: 100%; height: 100%; object-fit: cover; }
 .caption { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 13px; font-size: 12px; }
 .caption :global(svg) { color: #a88a45; }
 a:hover { color: #9a7d3c; }
 a:focus-visible { outline: 2px solid var(--rj-gold); outline-offset: 4px; }
 @media (max-width: 1000px) { .rj-social { padding-inline: 25px; } h2 { font-size: 34px; } .social-grid { gap: 12px; } }
 @media (max-width: 639px) { .rj-social { padding: 10px 16px 35px; } header { align-items: start; flex-direction: column; gap: 15px; margin-bottom: 22px; } .social-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 12px; } h2 { font-size: 32px; } .caption { font-size: 10px; } }
</style>
