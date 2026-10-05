<script lang="ts">
	import { ChevronLeft, X, ChevronRight } from '@lucide/svelte'
	import { catalogNavigation } from './catalog-navigation.js'
	let { category, onBack, onClose, onNavigate }: { category: (typeof catalogNavigation)[number]; onBack: () => void; onClose: () => void; onNavigate: (href: string) => void } = $props()
</script>
<div class="rj-catalog-mobile">
	<div class="menu-head"><button onclick={onBack} aria-label="Back to categories"><ChevronLeft size={20} /></button><span>{category.name}</span><button onclick={onClose} aria-label="Close menu"><X size={20} /></button></div>
	<nav aria-label="{category.name} subcategories"><a class="all" href={category.href} onclick={(event) => { event.preventDefault(); onNavigate(category.href) }}>View All {category.name}<ChevronRight size={16} /></a>{#each category.children as item}<a href={item.href} onclick={(event) => { event.preventDefault(); onNavigate(item.href) }}>{item.name}<ChevronRight size={15} /></a>{/each}</nav>
</div>
<style>
	.rj-catalog-mobile { height: 100%; overflow: auto; background: #fff; color: #404040; font-family: 'Afacad', sans-serif; }
	.menu-head { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e1e1e1; padding: 18px 15px; gap: 15px; }
	.menu-head span { flex: 1; font: 24px 'Inria Serif', serif; }
	.menu-head button { min-width: 40px; height: 40px; display: grid; place-items: center; }
	nav { padding: 15px 25px 35px; }
	a { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 0; border-bottom: 1px solid #eee; font-size: 19px; color: inherit; text-decoration: none; }
	a.all { color: #a18148; }
	a:hover { color: #a18148; }
	a:focus-visible, button:focus-visible { outline: 2px solid #a18148; outline-offset: 3px; }
nav { padding: 18px 22px 35px; } a { padding: 16px 12px; font: 14px/1.5 Lato, sans-serif; border-bottom-color: #efede7; } a.all { margin-bottom: 12px; border: 1px solid #e8dfca; background: #faf8f3; color: #8c7137; border-radius: 4px; } .menu-head span { font-family: 'Libre Baskerville', serif; font-size: 28px; } a:hover { background: #faf8f3; } </style>
