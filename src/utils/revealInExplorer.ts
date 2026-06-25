export type RevealInExplorerResult = {
  ok: boolean
  absolutePath?: string
  error?: string
}

export async function revealInExplorer(repoPath: string): Promise<RevealInExplorerResult> {
  if (!import.meta.env.DEV) {
    return { ok: false, error: 'dev-only' }
  }

  const response = await fetch('/dev-api/reveal-in-explorer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoPath }),
  })

  const data = (await response.json()) as RevealInExplorerResult
  if (!response.ok) {
    return { ok: false, error: data.error ?? 'request-failed', absolutePath: data.absolutePath }
  }
  return data
}
