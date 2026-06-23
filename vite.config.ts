import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { getGitBuildInfo, refreshPublicBuildInfo, syncPublicBuildInfo } from './vite.git-build-info'

const LEGACY_ASSET_REWRITES: Array<[RegExp, string]> = [
  [/^\/minigames\/enclosures\/(.+)$/, '/assets/minigames/dressage/enclosures/$1'],
  [/^\/minigames\/palmons\/chibi\/(.+)$/, '/assets/minigames/dressage/myrions/chibi/$1'],
  [/^\/minigames\/palmons\/silhouettes\/(.+)$/, '/assets/minigames/capture/myrions/silhouette/$1'],
  [/^\/minigames\/palmons\/(.+)$/, '/assets/minigames/capture/myrions/cutout/$1'],
  [/^\/minigames\/biomes\/(.+)$/, '/assets/minigames/capture/biomes/$1'],
  [/^\/minigames\/guides\/talia-point-(.+)\.png$/, '/assets/minigames/capture/companions/talia/point-$1.png'],
  [/^\/minigames\/guides\/talia-point\.png$/, '/assets/minigames/capture/companions/talia/point.png'],
  [/^\/minigames\/guides\/(.+)$/, '/assets/minigames/capture/companions/$1'],
  [/^\/minigames\/presentations\/(.+)$/, '/assets/minigames/hub/presentations/$1'],
  [/^\/minigames\/stages\/(.+)$/, '/assets/minigames/hub/stages/$1'],
  [/^\/companions\/(.+)$/, '/assets/companions/$1'],
]

function rewriteLegacyAssetUrl(pathname: string): string | null {
  for (const [pattern, replacement] of LEGACY_ASSET_REWRITES) {
    const next = pathname.replace(pattern, replacement)
    if (next !== pathname) {
      return next
    }
  }
  return null
}

function legacyPublicAssetPlugin(): Plugin {
  return {
    name: 'legacy-public-asset-rewrites',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const pathname = req.url?.split('?')[0]
        if (!pathname) {
          next()
          return
        }
        const rewritten = rewriteLegacyAssetUrl(pathname)
        if (rewritten) {
          const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
          req.url = `${rewritten}${query}`
        }
        next()
      })
    },
  }
}

function appBuildInfoPlugin(): Plugin {
  return {
    name: 'app-build-info',
    config(_config, { command }) {
      const info = syncPublicBuildInfo()
      if (command === 'serve') {
        console.log(`[Havre des Brumes] Version menu : ${info.versionLabel}`)
        console.log('[Havre des Brumes] Nouveau prompt → npm run version:prompt')
      }
      return {
        define: {
          __APP_BUILD_INFO__: JSON.stringify(info),
        },
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path !== '/build-info.json') {
          next()
          return
        }

        const info = getGitBuildInfo()
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
        res.setHeader('Pragma', 'no-cache')
        res.end(JSON.stringify(info))
      })
    },
    buildStart() {
      const info = syncPublicBuildInfo()
      console.log(`[Havre des Brumes] Build ${info.versionLabel} (${info.commitHash})`)
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('node_modules') || file.includes('vite.git-build-info')) {
        return
      }
      if (!file.replace(/\\/g, '/').includes('/src/')) {
        return
      }

      const info = refreshPublicBuildInfo('hmr')
      if (!info.changed) {
        return
      }

      server.ws.send({
        type: 'custom',
        event: 'app-build-info',
        data: info,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), legacyPublicAssetPlugin(), appBuildInfoPlugin()],
  build: {
    // Évite le conflit avec public/assets/ (images de jeu servies sous /assets/…)
    assetsDir: '_vite',
  },
  optimizeDeps: {
    include: ['pixi.js', 'pixi-live2d-display/cubism4'],
  },
  resolve: {
    dedupe: ['pixi.js'],
  },
  server: {
    allowedHosts: ['.lhr.life', '.loca.lt'],
    watch: {
      ignored: ['**/.tmp/**', '**/.tools/**', '**/assets/**', '**/AGENTS.md'],
    },
  },
})
