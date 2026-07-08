import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig, type Plugin } from 'vite'
import baseConfig from './vite.config'

const repoRoot = fileURLToPath(new URL('.', import.meta.url))
const LAYER_ALIGN_JSON = join(repoRoot, 'src/data/dialedColor/laharl-color2-layer-alignments.json')

function color2LayerAlignApiPlugin(): Plugin {
  return {
    name: 'color2-layer-align-api',
    configureServer(server) {
      server.middlewares.use('/dev-api/color2-layer-align', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'method-not-allowed' }))
          return
        }
        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => {
          try {
            const doc = JSON.parse(body)
            writeFileSync(LAYER_ALIGN_JSON, `${JSON.stringify(doc, null, 2)}\n`, 'utf8')
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, path: 'src/data/dialedColor/laharl-color2-layer-alignments.json' }))
          } catch (error) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                ok: false,
                error: error instanceof Error ? error.message : String(error),
              }),
            )
          }
        })
      })
    },
  }
}

function minigameLabRootPlugin(): Plugin {
  return {
    name: 'minigame-lab-html-root',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, _res, next) => {
          const raw = req.url ?? '/'
          const [pathname, search = ''] = raw.split('?')
          if (pathname === '/' || pathname === '/index.html') {
            req.url = `/minigames.html${search ? `?${search}` : ''}`
          }
          next()
        })
      }
    },
  }
}

/** Vite dev dédié aux mini-jeux WIP — port 5174, entrée `minigames.html`. */
export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [minigameLabRootPlugin(), color2LayerAlignApiPlugin()],
    define: {
      'import.meta.env.VITE_MINIGAME_LAB': JSON.stringify('true'),
    },
    optimizeDeps: {
      entries: ['minigames.html'],
      exclude: ['pixi.js', 'pixi-live2d-display', 'pixi-live2d-display/cubism4'],
    },
    server: {
      port: 5174,
      strictPort: true,
      open: false,
      /** Windows : sans host explicite Vite peut n’écouter que sur [::1], alors que le lanceur ouvre 127.0.0.1 */
      host: '127.0.0.1',
    },
  }),
)
