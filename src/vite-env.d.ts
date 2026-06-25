/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STABLE_PRESET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

import type { AppBuildInfo } from './buildInfo.types'

declare global {
  const __APP_BUILD_INFO__: AppBuildInfo
}

export {}
