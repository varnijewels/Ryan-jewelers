<script lang="ts">
 import { ArrowUpRight, ArrowRight } from '@lucide/svelte'
 import { menuChildren, menuHref, menuLabel, type AdminMenuItem } from './admin-menu.js'
 let { category, menuId, open = false, onNavigate }: { category: AdminMenuItem; menuId: string; open?: boolean; onNavigate?: () => void } = $props()
 const styles = $derived(menuChildren(category).flatMap(group => menuChildren(group).length ? menuChildren(group) : [group]))
</script>
<div class="rj-admin-mega" id={menuId} inert={!open} aria-label="{menuLabel(category)} subcategories">
 <div class="menu-intro"><p class="eyebrow">THE COLLECTION</p><h2>{menuLabel(category)}</h2><p>Find the details that feel like you.</p><a class="shop-all" href={menuHref(category)} onclick={onNavigate}>Shop all {menuLabel(category)} <ArrowUpRight size={17} /></a></div>
 <div class="menu-styles"><p class="eyebrow">EXPLORE BY STYLE</p><ul>{#each styles as item}<li><a href={menuHref(item)} onclick={onNavigate}><span>{menuLabel(item)}</span><ArrowRight size={15} strokeWidth={1.4} /></a></li>{/each}</ul></div>
</div>
<style>
 .rj-admin-mega { position: absolute; top: 100%; left: 50%; width: min(1000px, calc(100% - 64px)); display: grid; grid-template-columns: 260px 1fr; background: #fff; border: 1px solid #ece9e2; border-top: 2px solid var(--rj-gold, #cca646); border-radius: 0 0 8px 8px; box-shadow: 0 18px 35px #22222214; visibility: hidden; opacity: 0; pointer-events: none; transform: translate(-50%, 6px); transition: opacity 160ms, transform 160ms, visibility 160ms; color: #303030; }
 .menu-intro { padding: 32px; background: #f8f7f4; border-radius: 0 0 0 8px; }
 .eyebrow { margin: 0 0 20px; font-size: 10px; letter-spacing: 1.8px; color: #8b7545; }
 h2 { margin: 0 0 12px; font: 36px/1.1 'Libre Baskerville', serif; }
 .menu-intro > p:not(.eyebrow) { margin: 0; font-size: 13px; line-height: 1.7; color: #777; }
 .shop-all { display: inline-flex; align-items: center; gap: 12px; margin-top: 28px; padding-bottom: 7px; border-bottom: 1px solid #c9ae70; font-size: 12px; color: #303030; text-decoration: none; }
 .menu-styles { padding: 32px; }
 .menu-styles .eyebrow { margin-bottom: 12px; }
 ul { display: grid; grid-template-columns: 1fr 1fr; column-gap: 28px; list-style: none; margin: 0; padding: 0; }
 li a { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 43px; padding: 10px 9px; border-bottom: 1px solid #f0efeb; font-size: 13px; text-decoration: none; color: #454545; transition: background 150ms, color 150ms; }
 li a :global(svg) { color: #b49a60; opacity: 0; transition: opacity 150ms; flex-shrink: 0; }
 li a:hover, li a:focus-visible { color: #8c6c29; background: #faf8f3; }
 li a:hover :global(svg), li a:focus-visible :global(svg) { opacity: 1; }
 a:focus-visible { outline: 2px solid var(--rj-gold); outline-offset: 3px; }
 @media (prefers-reduced-motion: reduce) { .rj-admin-mega, li a { transition: none; } }
</style>
