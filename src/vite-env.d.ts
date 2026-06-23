/// <reference types="vite/client" />

import type { AppBuildInfo } from './buildInfo.types'

declare global {
  const __APP_BUILD_INFO__: AppBuildInfo
}

export {}
