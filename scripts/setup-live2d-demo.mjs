import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const repoBase =
  'https://api.github.com/repos/Live2D/CubismWebSamples/contents/Samples/Resources/Haru'
const rawBase =
  'https://raw.githubusercontent.com/Live2D/CubismWebSamples/develop/Samples/Resources/Haru'
const outHaru = path.join(root, 'public', 'live2d', 'haru')
const outCore = path.join(root, 'public', 'live2d')

async function listGithubDir(apiPath) {
  const res = await fetch(`${repoBase}/${apiPath}?ref=develop`)
  if (!res.ok) return []
  const items = await res.json()
  return items.filter((item) => item.type === 'file').map((item) => `${apiPath}/${item.name}`)
}

async function download(relativePath) {
  const url = `${rawBase}/${relativePath}`
  const dest = path.join(outHaru, relativePath.replace(/\//g, path.sep))
  await mkdir(path.dirname(dest), { recursive: true })
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`${url} -> ${res.status}`)
  }
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
  console.log('OK', relativePath)
}

await mkdir(outHaru, { recursive: true })

const coreRes = await fetch('https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js')
if (!coreRes.ok) throw new Error('Cubism core download failed')
await writeFile(path.join(outCore, 'live2dcubismcore.min.js'), Buffer.from(await coreRes.arrayBuffer()))
console.log('OK live2dcubismcore.min.js')

const rootFiles = [
  'Haru.model3.json',
  'Haru.moc3',
  'Haru.cdi3.json',
  'Haru.physics3.json',
  'Haru.pose3.json',
  'Haru.userdata3.json',
]

for (const file of rootFiles) {
  await download(file)
}

for (const file of await listGithubDir('Haru.2048')) {
  await download(file)
}

for (const file of await listGithubDir('motions')) {
  await download(file)
}

for (const file of await listGithubDir('expressions')) {
  await download(file)
}

console.log('Live2D Haru demo assets ready in public/live2d/')
