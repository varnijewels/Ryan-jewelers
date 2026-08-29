export * from '@misiki/kitcommerce-core/types'

import type { Page as CorePage } from '@misiki/kitcommerce-core/types'

export type Page = CorePage & { layouts?: any[] }
