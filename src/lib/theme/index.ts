import { env } from '$env/dynamic/public'
export { getThemeHomepageContent, type ThemeHomepageContent } from './homepage-content.js'

export type StorefrontThemeName =
	| 'default'
	| 'sarab'
	| 'organic'
	| 'limelight'
	| 'noor'
	| 'boris-and-twins'
	| 'ryans-jewels'
	| string

export interface StorefrontTheme {
	name: StorefrontThemeName
	source: 'admin' | 'env' | 'default'
	available: string[]
}

const AVAILABLE_THEMES = ['default', 'sarab', 'organic', 'limelight', 'noor', 'boris-and-twins', 'ryans-jewels']
const DEFAULT_THEME = 'default'

const THEME_FONTS: Record<string, string> = {
	sarab:
		'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@700&display=swap',
	organic:
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Nunito:wght@400;600;700;900&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap',
	noor:
		'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Montserrat:wght@400;500;600;700&display=swap',
	'boris-and-twins':
		'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,400&family=Jost:wght@300;400;500;600&family=Chivo:wght@400;500&family=Chonburi&display=swap',
	'ryans-jewels':
		'https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,400&family=Afacad:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Red+Rose:wght@300;400;500;600;700&family=Rozha+One&family=Sarala:wght@400;700&display=swap'
}

export function getThemeFontsUrl(theme: string): string | null {
	return THEME_FONTS[theme] || null
}

/**
 * Admin theme fields can arrive as an empty object (`theme: {}`) or an object
 * wrapper (`theme: { name: 'x' }`) instead of a plain string. `{}` is truthy, so
 * a naive `||` chain would select it and stringify to "[object object]", which
 * matches no theme and silently blocks the env/default fallback. Only accept a
 * non-blank string here — anything else counts as "not configured".
 */
function readAdminThemeValue(value: unknown): string | null {
	if (typeof value === 'string') return value.trim() || null
	if (value && typeof value === 'object') {
		const nested = value as Record<string, unknown>
		return readAdminThemeValue(nested.name ?? nested.theme ?? nested.activeTheme ?? nested.themeName)
	}
	return null
}

export function resolveStorefrontTheme(store: any): StorefrontTheme {
	const adminTheme =
		readAdminThemeValue(store?.theme) ||
		readAdminThemeValue(store?.activeTheme) ||
		readAdminThemeValue(store?.themeName) ||
		readAdminThemeValue(store?.settings?.theme) ||
		readAdminThemeValue(store?.plugins?.themeSettings?.theme) ||
		readAdminThemeValue(store?.plugins?.themeSettings?.activeTheme)
	const envTheme = env.PUBLIC_STOREFRONT_THEME || env.PUBLIC_THEME || env.PUBLIC_ACTIVE_THEME
	const candidate = normalizeThemeName(adminTheme || envTheme || DEFAULT_THEME)

	return {
		name: candidate,
		source: adminTheme ? 'admin' : envTheme ? 'env' : 'default',
		available: AVAILABLE_THEMES
	}
}

export function normalizeThemeName(value: unknown): StorefrontThemeName {
	const name = String(value || '').trim().toLowerCase()
	return name || DEFAULT_THEME
}
