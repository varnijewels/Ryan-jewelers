import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { execSync } from 'node:child_process'

// `version.name` is baked into BOTH the client and server bundles, and SvelteKit derives its
// per-app `__sveltekit_<hash>` global from it. The two are built in SEPARATE passes, so this MUST
// resolve to the SAME value in both: a per-build timestamp does not, and the client then reads a
// `__sveltekit_<hash>` global the server never defined, throwing "Cannot read properties of
// undefined (reading 'env')" on every page in production. Pinning it to the commit keeps it
// identical across passes AND changes on a real deploy, which is what makes the stale-client
// protection in +layout.svelte actually fire (a frozen constant means `updated` never flips).
function resolveAppVersion() {
	if (process.env.GIT_SHA) return process.env.GIT_SHA
	try {
		return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
	} catch {
		// No GIT_SHA and no .git (the Docker build .dockerignores it): use a STABLE constant. A
		// per-build unique value here would reintroduce the client/server mismatch; pass GIT_SHA
		// as a build arg to restore per-deploy versioning.
		return 'app'
	}
}
const appVersion = resolveAppVersion()

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// @misiki/kitcommerce-core >= 0.1.33 imports its whole service layer from the bare specifier
		// 'kitcommerce.config'. Nothing resolves that by default — this alias is what points it at the
		// root kitcommerce.config.ts, which names the backend connector.
		alias: {
			'kitcommerce.config': './kitcommerce.config.ts'
		},
		adapter: adapter(),
		csrf: {
			trustedOrigins: ['*']
		},
		version: {
			name: appVersion,
			// Poll _app/version.json every 60s so a new deploy is detected quickly.
			pollInterval: 60_000
		}
	}
}

export default config
