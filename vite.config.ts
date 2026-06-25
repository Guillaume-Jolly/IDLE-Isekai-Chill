import { createReadStream, existsSync, statSync } from 'node:fs'
import { dirname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { getGitBuildInfo, refreshPublicBuildInfo, syncPublicBuildInfo } from './vite.git-build-info'
import { legacyPublicAssetPlugin, repoAssetsPlugin } from './vite.repo-assets'

const repoRoot = fileURLToPath(new URL('.', import.meta.url))

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

function resolveEventDisagreaDevAsset(relative: string, baseDir: string, companionsDir: string): string | null {
  const integratedMatch = /^integrated\/companions\/([^/]+)\/(.+\.png)$/.exec(relative)
  if (integratedMatch) {
    const companionId = integratedMatch[1]
    const fileName = integratedMatch[2]
    const candidates = [
      join(companionsDir, companionId, 'Autres', 'disagrea-integrated', fileName),
    ]
    if (fileName.includes('nsfw')) {
      candidates.unshift(join(companionsDir, companionId, 'NSFW', 'affinity-4-nsfw.png'))
    } else {
      const levelMatch = fileName.match(/affinity-(\d{2})/)
      if (levelMatch) {
        candidates.unshift(
          join(companionsDir, companionId, 'affinite', `affinity-${parseInt(levelMatch[1], 10)}.png`),
        )
      }
    }
    for (const integratedPath of candidates.map((p) => normalize(p))) {
      if (
        integratedPath.startsWith(companionsDir) &&
        existsSync(integratedPath) &&
        statSync(integratedPath).isFile()
      ) {
        return integratedPath
      }
    }
  }

  const filePath = normalize(join(baseDir, relative))
  if (!filePath.startsWith(baseDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    return null
  }
  return filePath
}

function repoEventDisagreaAssetsPlugin(): Plugin {
  const baseDir = join(repoRoot, 'assets', 'event-disagrea')
  const companionsDir = join(repoRoot, 'assets', 'Compagnons')

  return {
    name: 'repo-event-disagrea-dev-assets',
    configureServer(server) {
      server.middlewares.use('/dev-assets/event-disagrea', (req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? '/'
        const relative = decodeURIComponent(pathname.replace(/^\/+/, ''))
        const filePath = resolveEventDisagreaDevAsset(relative, baseDir, companionsDir)
        if (!filePath) {
          next()
          return
        }
        if (filePath.endsWith('.png')) {
          res.setHeader('Content-Type', 'image/png')
        } else if (filePath.endsWith('.json')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
        }
        createReadStream(filePath).pipe(res)
      })
    },
  }
}

function repoStagingCompanionVisualPackPlugin(): Plugin {
  const baseDir = join(repoRoot, 'staging', 'companion-visual-pack')

  return {
    name: 'repo-staging-companion-visual-pack-dev-assets',
    configureServer(server) {
      server.middlewares.use('/dev-assets/staging-companion-visual-pack', (req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? '/'
        const relative = decodeURIComponent(pathname.replace(/^\/+/, ''))
        const filePath = normalize(join(baseDir, relative))
        if (!filePath.startsWith(baseDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
          next()
          return
        }
        if (filePath.endsWith('.png')) {
          res.setHeader('Content-Type', 'image/png')
        }
        createReadStream(filePath).pipe(res)
      })
    },
  }
}

const execFileAsync = promisify(execFile)

function devRevealInExplorerPlugin(): Plugin {
  return {
    name: 'dev-reveal-in-explorer',
    configureServer(server) {
      server.middlewares.use('/dev-api/reveal-in-explorer', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ ok: false, error: 'method-not-allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')

          try {
            const parsed = JSON.parse(body) as { repoPath?: string }
            const repoPath = parsed.repoPath?.replace(/\\/g, '/')
            if (!repoPath || repoPath.includes('..')) {
              res.statusCode = 400
              res.end(JSON.stringify({ ok: false, error: 'invalid-path' }))
              return
            }

            const absolutePath = normalize(join(repoRoot, repoPath))
            if (!absolutePath.startsWith(repoRoot)) {
              res.statusCode = 403
              res.end(JSON.stringify({ ok: false, error: 'forbidden' }))
              return
            }
            if (!existsSync(absolutePath)) {
              res.statusCode = 404
              res.end(JSON.stringify({ ok: false, error: 'not-found', absolutePath }))
              return
            }

            if (process.platform === 'win32') {
              await execFileAsync('explorer.exe', [`/select,${absolutePath}`])
            } else if (process.platform === 'darwin') {
              await execFileAsync('open', ['-R', absolutePath])
            } else {
              await execFileAsync('xdg-open', [dirname(absolutePath)])
            }

            res.end(JSON.stringify({ ok: true, absolutePath }))
          } catch {
            res.statusCode = 500
            res.end(JSON.stringify({ ok: false, error: 'server-error' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacyPublicAssetPlugin(),
    repoAssetsPlugin(repoRoot),
    repoEventDisagreaAssetsPlugin(),
    repoStagingCompanionVisualPackPlugin(),
    devRevealInExplorerPlugin(),
    appBuildInfoPlugin(),
  ],
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
      ignored: [
        '**/.tmp/**',
        '**/.tools/**',
        '**/assets/**',
        '**/old_assets/**',
        '**/staging/**',
        '**/Input chatgpt/**',
        '**/To check manually/**',
        '**/scripts/vendor/**',
        '**/AGENTS.md',
      ],
    },
  },
})
