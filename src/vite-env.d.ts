/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STABLE_PRESET?: string
  /** Prod uniquement — injectés au build (CI / hébergement privé). */
  readonly VITE_HAVRE_LOGIN_USER?: string
  readonly VITE_HAVRE_LOGIN_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

import type { AppBuildInfo } from './buildInfo.types'

declare global {
  const __APP_BUILD_INFO__: AppBuildInfo
}

export {}
