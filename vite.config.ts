import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { getGitBuildInfo, refreshPublicBuildInfo, syncPublicBuildInfo } from './vite.git-build-info'

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
  plugins: [react(), appBuildInfoPlugin()],
  optimizeDeps: {
    include: ['pixi.js', 'pixi-live2d-display/cubism4'],
  },
  resolve: {
    dedupe: ['pixi.js'],
  },
  server: {
    allowedHosts: ['.lhr.life', '.loca.lt'],
    watch: {
      ignored: ['**/.tmp/**', '**/.tools/**', '**/assets/**'],
    },
  },
})
