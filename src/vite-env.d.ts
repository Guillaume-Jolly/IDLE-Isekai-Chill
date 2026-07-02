/// <reference types="vite/client" />

/** Augmentation Vite — vars lues via import.meta.env */
export interface ImportMetaEnv {
  readonly VITE_STABLE_PRESET?: string
  /** Prod uniquement — injectés au build (CI / hébergement privé). */
  readonly VITE_HAVRE_LOGIN_USER?: string
  readonly VITE_HAVRE_LOGIN_PASSWORD?: string
}

import type { AppBuildInfo } from './buildInfo.types'

declare global {
  const __APP_BUILD_INFO__: AppBuildInfo
}

export {}
