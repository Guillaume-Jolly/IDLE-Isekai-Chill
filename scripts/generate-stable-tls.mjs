/**
 * Génère un certificat TLS auto-signé pour le serveur stable (localhost + IP LAN).
 */
import { execSync, spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { networkInterfaces, platform } from 'node:os'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const certDir = join(repoRoot, 'deploy', 'stable', 'certs')
const certPath = join(certDir, 'cert.pem')
const keyPath = join(certDir, 'key.pem')

function generateWithOpenssl() {
  let openssl = 'openssl'
  try {
    if (platform() === 'win32') {
      const out = execSync('where openssl', { encoding: 'utf8', shell: true }).trim()
      openssl = out.split(/\r?\n/)[0]
    } else {
      openssl = execSync('which openssl', { encoding: 'utf8' }).trim()
    }
  } catch {
    return false
  }

  const ips = new Set(['127.0.0.1'])
  for (const entries of Object.values(networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family === 'IPv4' && !entry.internal) ips.add(entry.address)
    }
  }

  const altLines = ['DNS.1 = localhost']
  ;[...ips].forEach((ip, index) => altLines.push(`IP.${index + 1} = ${ip}`))
  const cnfPath = join(certDir, 'openssl.cnf')
  writeFileSync(
    cnfPath,
    `[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = req_ext
x509_extensions = req_ext

[dn]
CN = IDLE Isekai Chill Stable

[req_ext]
subjectAltName = @alt_names
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[alt_names]
${altLines.join('\n')}
`,
    'utf8',
  )

  const result = spawnSync(
    openssl,
    [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-sha256',
      '-nodes',
      '-days',
      '825',
      '-keyout',
      keyPath,
      '-out',
      certPath,
      '-config',
      cnfPath,
      '-extensions',
      'req_ext',
    ],
    { stdio: 'inherit' },
  )
  return result.status === 0
}

function main() {
  mkdirSync(certDir, { recursive: true })

  if (platform() === 'win32') {
    const ps1 = join(repoRoot, 'scripts', 'generate-stable-tls.ps1')
    const psExe = join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
    const result = spawnSync(
      psExe,
      ['-ExecutionPolicy', 'Bypass', '-File', ps1],
      { stdio: 'inherit' },
    )
    process.exit(result.status ?? 1)
  }

  if (!generateWithOpenssl()) {
    console.error('[tls] OpenSSL introuvable.')
    process.exit(1)
  }
}

main()
