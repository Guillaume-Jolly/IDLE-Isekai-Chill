/**
 * Compile LauncherGuiHost.exe — fenêtre native WebView2 (pas IE / pas navigateur).
 */
import { createWriteStream, existsSync, mkdirSync, copyFileSync, statSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pipeline } from 'node:stream/promises'
import { systemRoot } from './windows-shell.mjs'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const uiRoot = join(repoRoot, 'deploy', 'stable', 'launcher-ui')
const vendorRoot = join(repoRoot, 'scripts', 'vendor', 'webview2')
const nupkgCache = join(vendorRoot, 'package')
const WEBVIEW2_VERSION = '1.0.2903.40'
const HOST_EXE_NAME = 'IDLE Isekai Chill Launcher.exe'

export function launcherGuiHostExePath() {
  return join(uiRoot, HOST_EXE_NAME)
}

function cscExe() {
  const candidate = join(systemRoot(), 'Microsoft.NET', 'Framework64', 'v4.0.30319', 'csc.exe')
  return existsSync(candidate) ? candidate : null
}

async function downloadFile(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Téléchargement échoué (${res.status}) : ${url}`)
  await pipeline(res.body, createWriteStream(dest))
}

async function ensureWebView2Assemblies() {
  const coreDll = join(vendorRoot, 'Microsoft.Web.WebView2.Core.dll')
  const winFormsDll = join(vendorRoot, 'Microsoft.Web.WebView2.WinForms.dll')
  const loaderDll = join(vendorRoot, 'WebView2Loader.dll')

  if (existsSync(coreDll) && existsSync(winFormsDll) && existsSync(loaderDll)) {
    return { coreDll, winFormsDll, loaderDll }
  }

  mkdirSync(vendorRoot, { recursive: true })
  const nupkgPath = join(vendorRoot, `Microsoft.Web.WebView2.${WEBVIEW2_VERSION}.nupkg`)

  if (!existsSync(nupkgPath)) {
    console.log('[launcher-ui] téléchargement WebView2 SDK…')
    await downloadFile(
      `https://www.nuget.org/api/v2/package/Microsoft.Web.WebView2/${WEBVIEW2_VERSION}`,
      nupkgPath,
    )
  }

  mkdirSync(nupkgCache, { recursive: true })
  const extractMarker = join(nupkgCache, '.extracted')
  if (!existsSync(extractMarker)) {
    console.log('[launcher-ui] extraction WebView2 SDK…')
    const zipPath = join(vendorRoot, 'webview2.zip')
    copyFileSync(nupkgPath, zipPath)
    execFileSync(
      join(systemRoot(), 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'),
      [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-Command',
        `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${nupkgCache.replace(/'/g, "''")}' -Force`,
      ],
      { stdio: 'inherit', windowsHide: true },
    )
    writeFileSync(extractMarker, WEBVIEW2_VERSION, 'utf8')
  }

  const libRoot = join(nupkgCache, 'lib', 'net462')
  const nativeRoot = join(nupkgCache, 'runtimes', 'win-x64', 'native')
  copyFileSync(join(libRoot, 'Microsoft.Web.WebView2.Core.dll'), coreDll)
  copyFileSync(join(libRoot, 'Microsoft.Web.WebView2.WinForms.dll'), winFormsDll)
  copyFileSync(join(nativeRoot, 'WebView2Loader.dll'), loaderDll)

  return { coreDll, winFormsDll, loaderDll }
}

function needsRebuild(outExe, sources) {
  if (!existsSync(outExe)) return true
  const outMtime = statSync(outExe).mtimeMs
  return sources.some((file) => existsSync(file) && statSync(file).mtimeMs > outMtime)
}

export async function buildLauncherGuiHost() {
  if (process.platform !== 'win32') return null

  const csc = cscExe()
  if (!csc) {
    console.warn('[launcher-ui] csc.exe introuvable — LauncherGuiHost non compilé')
    return null
  }

  mkdirSync(uiRoot, { recursive: true })

  const csPath = join(repoRoot, 'scripts', 'LauncherGuiHost.cs')
  const icoPath = join(uiRoot, 'app.ico')
  const outExe = launcherGuiHostExePath()
  const { coreDll, winFormsDll, loaderDll } = await ensureWebView2Assemblies()

  const sources = [csPath, coreDll, winFormsDll, loaderDll]
  if (existsSync(icoPath)) sources.push(icoPath)

  if (!needsRebuild(outExe, sources)) {
    return outExe
  }

  console.log('[launcher-ui] compilation fenêtre native WebView2…')
  const args = [
    '/nologo',
    '/target:winexe',
    '/platform:anycpu',
    `/out:${outExe}`,
    `/reference:${coreDll}`,
    `/reference:${winFormsDll}`,
    '/reference:System.Windows.Forms.dll',
    '/reference:System.Drawing.dll',
  ]
  if (existsSync(icoPath)) args.push(`/win32icon:${icoPath}`)

  args.push(csPath)

  try {
    execFileSync(csc, args, { stdio: 'inherit', windowsHide: true })
  } catch (error) {
    const withoutIcon = args.filter((arg) => !arg.startsWith('/win32icon:'))
    if (withoutIcon.length === args.length) throw error
    console.warn('[launcher-ui] icône exe invalide — compilation sans /win32icon')
    execFileSync(csc, withoutIcon, { stdio: 'inherit', windowsHide: true })
  }
  copyFileSync(loaderDll, join(uiRoot, 'WebView2Loader.dll'))

  return outExe
}

const isMain = process.argv[1]?.endsWith('build-launcher-gui-host.mjs')
if (isMain) {
  buildLauncherGuiHost()
    .then((path) => {
      if (path) console.log('[launcher-ui] hôte GUI :', path)
      else process.exitCode = 1
    })
    .catch((error) => {
      console.error('[launcher-ui]', error.message ?? error)
      process.exitCode = 1
    })
}
