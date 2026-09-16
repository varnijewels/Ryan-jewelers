import { env } from '$env/dynamic/private'
import { instagramTiles } from '$lib/theme/ryans-jewels/instagram-feed.js'
import { instagramStrip } from '$lib/theme/ryans-jewels/footer-content.js'
import { json } from '@sveltejs/kit'

const API_ROOT = 'https://graph.instagram.com/v26.0'
const CACHE = { 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' }
const EMPTY_CACHE = { 'Cache-Control': 'public, max-age=0, s-maxage=60' }
const emptyFeed = () => json({ items: [] }, { headers: EMPTY_CACHE })

export const GET = async ({ fetch }) => {
	const accessToken = env.INSTAGRAM_ACCESS_TOKEN?.trim()
	if (!accessToken) return emptyFeed()

	try {
		const profileUrl = new URL(`${API_ROOT}/me`)
		profileUrl.searchParams.set('fields', 'user_id,username')
		profileUrl.searchParams.set('access_token', accessToken)
		const profileResponse = await fetch(profileUrl)
		if (!profileResponse.ok) return emptyFeed()
		const profile = await profileResponse.json()
		const userId = String(profile.user_id || profile.id || '')
		if (!userId || profile.username !== 'ryan.jewelers') return emptyFeed()

		const mediaUrl = new URL(`${API_ROOT}/${encodeURIComponent(userId)}/media`)
		mediaUrl.searchParams.set('fields', 'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink')
		mediaUrl.searchParams.set('limit', '12')
		mediaUrl.searchParams.set('access_token', accessToken)
		const mediaResponse = await fetch(mediaUrl)
		if (!mediaResponse.ok) return emptyFeed()

		const payload = await mediaResponse.json()
		return json({ items: instagramTiles(Array.isArray(payload.data) ? payload.data : [], instagramStrip.href) }, { headers: CACHE })
	} catch {
		return emptyFeed()
	}
}
