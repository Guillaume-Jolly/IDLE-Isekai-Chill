/** Suivi des opérations longues (démarrage / redémarrage Vite, build, etc.). */

/** @typedef {{ id: string, label: string, weight: number }} OperationStepDef */

/** @typedef {'running' | 'done' | 'error'} OperationStatus */

const operations = new Map()
let operationSeq = 0
const FINISH_TTL_MS = 90_000

/**
 * @param {object} spec
 * @param {string} spec.kind
 * @param {string} spec.label
 * @param {string | null} [spec.serverId]
 * @param {OperationStepDef[]} spec.steps
 */
export function beginOperation({ kind, label, serverId = null, steps }) {
  const id = `op-${Date.now()}-${++operationSeq}`
  const normalizedSteps = steps.map((step, index) => ({
    id: step.id ?? `step-${index}`,
    label: step.label,
    weight: step.weight ?? Math.round(100 / steps.length),
  }))
  const op = {
    id,
    kind,
    label,
    serverId,
    status: /** @type {OperationStatus} */ ('running'),
    progress: 0,
    stepIndex: 0,
    steps: normalizedSteps,
    currentStep: normalizedSteps[0]?.label ?? 'En cours…',
    blocker: null,
    error: null,
    stepDetail: null,
    lastProgressAt: Date.now(),
    lastProgressValue: 0,
    startedAt: Date.now(),
    updatedAt: Date.now(),
    finishedAt: null,
  }
  operations.set(id, op)
  return id
}

/**
 * @param {string} id
 * @param {string} stepId
 * @param {{ blocker?: string | null, partialInStep?: number, detail?: string }} [patch]
 */
export function advanceOperation(id, stepId, patch = {}) {
  const op = operations.get(id)
  if (!op || op.status !== 'running') return op ?? null

  const stepIndex = op.steps.findIndex((step) => step.id === stepId)
  if (stepIndex >= 0) {
    op.stepIndex = stepIndex
    op.currentStep = op.steps[stepIndex].label
  }

  let progress = 0
  for (let i = 0; i < op.stepIndex; i += 1) {
    progress += op.steps[i].weight
  }
  if (op.stepIndex >= 0 && op.steps[op.stepIndex]) {
    const partial = Math.max(0, Math.min(1, patch.partialInStep ?? 0))
    progress += op.steps[op.stepIndex].weight * partial
  }

  const totalWeight = op.steps.reduce((sum, step) => sum + step.weight, 0) || 100
  const prevProgress = op.progress
  op.progress = Math.min(99, Math.round((progress / totalWeight) * 100))
  if (patch.blocker !== undefined) op.blocker = patch.blocker
  if (patch.detail !== undefined) op.stepDetail = patch.detail
  const now = Date.now()
  if (op.progress !== prevProgress) {
    op.lastProgressAt = now
    op.lastProgressValue = op.progress
  }
  op.updatedAt = now
  return op
}

/** @param {string} id @param {{ detail?: string }} [result] */
export function completeOperation(id, result = {}) {
  const op = operations.get(id)
  if (!op) return null
  op.status = 'done'
  op.progress = 100
  op.currentStep = result.detail ?? 'Terminé'
  op.blocker = null
  op.error = null
  op.finishedAt = Date.now()
  op.updatedAt = op.finishedAt
  setTimeout(() => operations.delete(id), FINISH_TTL_MS)
  return op
}

/** @param {string} id @param {string} message @param {string | null} [blocker] */
export function failOperation(id, message, blocker = null) {
  const op = operations.get(id)
  if (!op) return null
  op.status = 'error'
  op.error = message
  op.blocker = blocker ?? message
  op.finishedAt = Date.now()
  op.updatedAt = op.finishedAt
  setTimeout(() => operations.delete(id), FINISH_TTL_MS)
  return op
}

/** @param {string} id */
export function getOperation(id) {
  const op = operations.get(id)
  return op ? serializeOperation(op) : null
}

/** @param {{ activeOnly?: boolean }} [opts] */
export function listOperations({ activeOnly = false } = {}) {
  const list = [...operations.values()].map(serializeOperation)
  if (activeOnly) return list.filter((op) => op.status === 'running')
  return list.sort((a, b) => b.startedAt - a.startedAt)
}

function serializeOperation(op) {
  const elapsedMs = Date.now() - op.startedAt
  const sinceLast = Math.max(1, Date.now() - (op.lastProgressAt ?? op.startedAt))
  const progressPerSec =
    op.progress > 0 ? Math.round((op.progress / (elapsedMs / 1000)) * 10) / 10 : 0
  const recentPerSec =
    op.progress > op.lastProgressValue
      ? Math.round(((op.progress - op.lastProgressValue) / (sinceLast / 1000)) * 10) / 10
      : progressPerSec
  const etaMs =
    recentPerSec > 0.2 && op.progress < 100
      ? Math.round(((100 - op.progress) / recentPerSec) * 1000)
      : null

  const stepIndex = op.stepIndex >= 0 ? op.stepIndex : 0
  const steps = op.steps.map((step, index) => ({
    id: step.id,
    label: step.label,
    weight: step.weight,
    status: index < stepIndex ? 'done' : index === stepIndex ? 'active' : 'pending',
  }))

  return {
    id: op.id,
    kind: op.kind,
    label: op.label,
    serverId: op.serverId,
    status: op.status,
    progress: op.progress,
    stepIndex,
    stepCount: op.steps.length,
    steps,
    currentStep: op.currentStep,
    stepDetail: op.stepDetail,
    blocker: op.blocker,
    error: op.error,
    startedAt: op.startedAt,
    updatedAt: op.updatedAt,
    finishedAt: op.finishedAt,
    elapsedMs,
    progressPerSec: recentPerSec,
    etaMs,
  }
}
