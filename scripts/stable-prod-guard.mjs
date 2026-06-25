/**
 * Garde-fous build PROD stable — pas de rebuild accidentel.
 */
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'

export const PROD_BUILD_HINT = [
  '',
  'Build PROD absente ou non publiee.',
  '',
  'Pour mettre a jour la PROD (volontairement) :',
  '  1. Dev stable, commit propre',
  '  2. git push (GitHub a jour)',
  '  3. npm run build:stable:prod',
  '  4. Relance le lanceur',
  '',
  'Le lanceur et serve:stable ne rebuildent jamais automatiquement.',
  '',
].join('\n')

export function requireProdDist(distIndex) {
  if (existsSync(distIndex)) return
  process.stderr.write(PROD_BUILD_HINT)
  process.exit(1)
}

function runGit(args) {
  return execSync(['git', ...args].join(' '), { encoding: 'utf8' }).trim()
}

export function assertProdBuildAllowed(repoRoot, { confirmProd = false } = {}) {
  const confirmed =
    confirmProd || process.env.STABLE_PROD_BUILD === '1' || process.env.STABLE_PROD_BUILD === 'true'

  if (!confirmed) {
    process.stderr.write(
      [
        '',
        '[build:stable:prod] Build PROD refusee — confirmation explicite requise.',
        '',
        '  npm run build:stable:prod',
        '',
        'Conditions : working tree propre + commits pushes sur GitHub.',
        '',
      ].join('\n'),
    )
    process.exit(1)
  }

  try {
    runGit(['rev-parse', '--is-inside-work-tree'])
  } catch {
    process.stderr.write('[build:stable:prod] Refus : pas un depot git.\n')
    process.exit(1)
  }

  const dirty = runGit(['status', '--porcelain'])
  if (dirty) {
    process.stderr.write(
      [
        '',
        '[build:stable:prod] Refus : modifications locales non commitees.',
        '',
        'Commit ou stash avant de publier la PROD.',
        '',
      ].join('\n'),
    )
    process.exit(1)
  }

  const branch = runGit(['rev-parse', '--abbrev-ref', 'HEAD'])
  let upstream = ''
  try {
    upstream = runGit(['rev-parse', '--abbrev-ref', `${branch}@{upstream}`])
  } catch {
    process.stderr.write(
      [
        '',
        '[build:stable:prod] Refus : branche sans upstream GitHub.',
        '',
        `  git push -u origin ${branch}`,
        '',
      ].join('\n'),
    )
    process.exit(1)
  }

  const unpushed = runGit(['rev-list', '--count', `${upstream}..HEAD`])
  if (unpushed !== '0') {
    process.stderr.write(
      [
        '',
        '[build:stable:prod] Refus : commits locaux non pushes.',
        '',
        `  git push   (${unpushed} commit(s) en avance sur ${upstream})`,
        '',
      ].join('\n'),
    )
    process.exit(1)
  }

  const unpulled = runGit(['rev-list', '--count', `HEAD..${upstream}`])
  if (unpulled !== '0') {
    process.stderr.write(
      [
        '',
        '[build:stable:prod] Refus : GitHub en avance sur ta branche locale.',
        '',
        `  git pull   (${unpulled} commit(s) sur ${upstream})`,
        '',
      ].join('\n'),
    )
    process.exit(1)
  }

  return {
    hash: runGit(['rev-parse', '--short', 'HEAD']),
    branch,
    upstream,
    remoteHash: runGit(['rev-parse', '--short', upstream]),
  }
}
