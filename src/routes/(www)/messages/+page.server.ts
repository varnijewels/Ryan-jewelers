import { UserService } from '$lib/core/services/index.js'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types.js'

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
	const sid = cookies.get('connect.sid')
	if (sid) {
		try {
			const user = await new UserService(fetch).getMe()
			if (user?.id || (user as { userId?: string })?.userId) return { user }
		} catch {
			// Expired sessions use the normal login flow.
		}
	}

	const params = new URLSearchParams({
		show_auth: 'true',
		login: 'true',
		redirect: `${url.pathname}${url.search}`
	})
	redirect(307, `/?${params}`)
}
