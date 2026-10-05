import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'
import base from './vitest.config'

export default defineConfig({
	...base,
	resolve: {
		conditions: ['browser'],
		alias: {
			'$app/state': resolve('./tests/mocks/checkout-page.ts'),
			'$app/navigation': resolve('./tests/mocks/checkout-navigation.ts'),
			...base.resolve?.alias
		}
	},
	test: {
		...base.test,
		exclude: ['node_modules', '.svelte-kit', 'src'],
		include: ['tests/ryans-checkout-ui.test.ts', 'tests/ryans-cart-flow.test.ts', 'tests/ryans-checkout-auth.test.ts', 'tests/ryans-checkout-process.test.ts', 'tests/ryans-shipping-checkout.test.ts']
	}
})
