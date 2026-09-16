export interface InstagramMedia {
	id?: string
	caption?: string
	media_type?: string
	media_product_type?: string
	media_url?: string
	thumbnail_url?: string
	permalink?: string
}

export interface InstagramTile {
	src: string
	videoSrc?: string
	alt: string
	href: string
	isVideo: boolean
}

export function instagramTiles(media: InstagramMedia[], profileHref: string): InstagramTile[] {
	return media
		.map((item) => {
			const isVideo = item.media_type === 'VIDEO' || item.media_product_type === 'REELS'
			const mediaUrl = String(item.media_url || '').trim()
			const thumbnailUrl = String(item.thumbnail_url || '').trim()
			const videoSrc = isVideo && mediaUrl.startsWith('https://') ? mediaUrl : undefined
			const src = isVideo ? thumbnailUrl : mediaUrl || thumbnailUrl
			if ((!src.startsWith('https://') && !videoSrc) || (!isVideo && !src.startsWith('https://'))) return null

			return {
				src: src.startsWith('https://') ? src : '',
				...(videoSrc ? { videoSrc } : {}),
				alt: item.caption?.trim().slice(0, 160) || `Ryan Jewelers Instagram ${isVideo ? 'reel' : 'post'}`,
				href: item.permalink?.startsWith('https://www.instagram.com/') ? item.permalink : profileHref,
				isVideo
			}
		})
		.filter((item): item is InstagramTile => Boolean(item))
		.slice(0, 6)
}
