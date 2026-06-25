/**
 * Prépare icônes du tableau de bord lanceur (chibi Talia → PNG + ICO Windows).
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { runPowerShellFile } from './windows-shell.mjs'
import { buildLauncherGuiHost } from './build-launcher-gui-host.mjs'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const uiRoot = join(repoRoot, 'deploy', 'stable', 'launcher-ui')
const sourceChibi = join(repoRoot, 'public', 'assets', 'companions', 'talia', 'chibi.png')
const fallbackChibi = join(repoRoot, 'public', 'companions', 'talia', 'chibi.png')

export async function prepareLauncherUiAssets() {
  const src = existsSync(sourceChibi) ? sourceChibi : fallbackChibi
  if (!existsSync(src)) {
    console.warn('[launcher-ui] chibi Talia introuvable — icônes non générées')
  } else {
    mkdirSync(uiRoot, { recursive: true })

    const sizes = [
      { name: 'icon-192.png', size: 192 },
      { name: 'icon-512.png', size: 512 },
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'favicon-32.png', size: 32 },
    ]

    for (const { name, size } of sizes) {
      await sharp(src)
        .resize(size, size, { fit: 'contain', background: { r: 15, g: 20, b: 25, alpha: 0 } })
        .png()
        .toFile(join(uiRoot, name))
    }

    copyFileSync(src, join(uiRoot, 'icon-source.png'))

    if (process.platform === 'win32') {
      const ps1 = join(repoRoot, 'scripts', 'generate-launcher-icon.ps1')
      const png512 = join(uiRoot, 'icon-512.png')
      const icoPath = join(uiRoot, 'app.ico')
      try {
        runPowerShellFile(ps1, ['-PngPath', png512, '-IcoPath', icoPath], { stdio: 'ignore' })
        ensureWindowsShortcut()
      } catch {
        /* PNG suffit — icône .ico optionnelle */
      }
    }
  }

  if (process.platform === 'win32') {
    try {
      await buildLauncherGuiHost()
    } catch (error) {
      console.warn('[launcher-ui] fenêtre native :', error.message ?? error)
    }
  }

  return true
}

function ensureWindowsShortcut() {
  const shortcutScript = join(repoRoot, 'scripts', 'create-launcher-shortcut.ps1')
  if (!existsSync(shortcutScript)) return
  try {
    runPowerShellFile(shortcutScript, [], { stdio: 'ignore' })
  } catch {
    /* optional */
  }
}
