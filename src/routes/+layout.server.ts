import { layoutServer } from '$lib/core/load-functions/index.js'
import { UserService } from '$lib/core/services/index.js'
import { resolveStorefrontTheme } from '$lib/theme/index.js'

export async function load(event: any) {
	const data = await layoutServer(event)
	let user = null

	if (event.cookies.get('connect.sid')) {
		try {
			user = await new UserService(event.fetch).getMe()
		} catch {
			// An expired session is the same as being signed out.
		}
	}

	return {
		...data,
		user,
		theme: resolveStorefrontTheme(data?.store)
	}
}
