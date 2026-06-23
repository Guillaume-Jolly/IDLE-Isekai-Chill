import { useEffect, useState } from 'react'
import type { AppBuildInfo } from '../buildInfo.types'

declare const __APP_BUILD_INFO__: AppBuildInfo

function buildInfoUrl(): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`
  return `${base}build-info.json?t=${Date.now()}`
}

async function fetchBuildInfo(): Promise<AppBuildInfo | null> {
  try {
    const response = await fetch(buildInfoUrl(), {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return null
    return (await response.json()) as AppBuildInfo
  } catch {
    return null
  }
}

/** Version affichée dans le menu — rechargée depuis /build-info.json (pas figée au bundle). */
export function useAppBuildVersion(): string {
  const [version, setVersion] = useState(__APP_BUILD_INFO__.versionLabel)

  useEffect(() => {
    let cancelled = false

    const sync = async () => {
      const info = await fetchBuildInfo()
      if (!cancelled && info?.versionLabel) {
        setVersion(info.versionLabel)
      }
    }

    void sync()

    const pollMs = import.meta.env.DEV ? 5_000 : 30_000
    const timer = window.setInterval(sync, pollMs)

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void sync()
      }
    }

    window.addEventListener('focus', sync)
    document.addEventListener('visibilitychange', onVisible)

    const hot = import.meta.hot
    const onBuildInfo = (info: AppBuildInfo) => {
      if (!cancelled && info?.versionLabel) {
        setVersion(info.versionLabel)
      }
    }

    if (hot) {
      hot.on('app-build-info', onBuildInfo)
    }

    return () => {
      cancelled = true
      window.clearInterval(timer)
      window.removeEventListener('focus', sync)
      document.removeEventListener('visibilitychange', onVisible)
      if (hot) {
        hot.off('app-build-info', onBuildInfo)
      }
    }
  }, [])

  return version
}
