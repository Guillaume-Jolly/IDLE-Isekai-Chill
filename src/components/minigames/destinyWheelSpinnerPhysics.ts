export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function easeOutBack(t: number): number {
  const c1 = 1.525
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

export function animateRotation(
  from: number,
  to: number,
  durationMs: number,
  easing: (t: number) => number,
  onFrame: (deg: number) => void,
): Promise<void> {
  if (durationMs <= 0 || Math.abs(to - from) < 0.01) {
    onFrame(to)
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      onFrame(from + (to - from) * easing(t))
      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

export function pointerKickStrength(speedDegPerFrame: number): number {
  const speed = Math.abs(speedDegPerFrame)
  if (speed < 0.35) return 2.4
  if (speed < 1.2) return 1.85
  if (speed < 3.5) return 1.35
  if (speed < 8) return 1.05
  return 0.82
}

/** Retourne le multiplicateur de vitesse après accrochage sur un taquet (plus bas = plus de galère). */
export function pegCrossingDrag(speedDegPerFrame: number): number {
  const speed = Math.abs(speedDegPerFrame)
  if (speed < 0.25) return 0.42
  if (speed < 0.7) return 0.55
  if (speed < 1.6) return 0.68
  if (speed < 3.5) return 0.82
  return 0.92
}

/** Animation fin de spin — chaque taquet freine la rotation et laisse la pointe « accrocher ». */
export function animateRotationWithPegSnag(
  from: number,
  to: number,
  durationMs: number,
  countCrossings: (prevPhysics: number, nextPhysics: number) => number,
  visualOffset: number,
  onFrame: (deg: number, speedDegPerFrame: number, crossings: number) => void,
): Promise<void> {
  const totalDelta = to - from
  if (durationMs <= 0 || Math.abs(totalDelta) < 0.01) {
    onFrame(to, 0, 0)
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const start = performance.now()
    let current = from
    let prevPhysics = from + visualOffset
    let lastTs = start
    const direction = Math.sign(totalDelta) || -1

    const step = (now: number) => {
      const dtMs = Math.max(1, now - lastTs)
      lastTs = now
      const t = Math.min(1, (now - start) / durationMs)
      const ideal = from + totalDelta * easeOutCubic(t)

      let stepDelta = ideal - current
      const maxStep = Math.max(0.04, Math.abs(totalDelta) * 0.14)
      if (Math.abs(stepDelta) > maxStep) stepDelta = direction * maxStep

      let next = current + stepDelta
      if (direction < 0 ? next <= to : next >= to) next = to

      const nextPhysics = next + visualOffset
      let crossings = countCrossings(prevPhysics, nextPhysics)

      if (crossings > 0) {
        const frameSpeed = Math.abs((stepDelta / dtMs) * 16.667)
        let drag = 1
        for (let i = 0; i < crossings; i += 1) {
          drag *= pegCrossingDrag(frameSpeed)
        }
        stepDelta *= drag
        next = current + stepDelta
        if (direction < 0 ? next <= to : next >= to) next = to
      }

      const speedDegPerFrame = ((next - current) / dtMs) * 16.667
      current = next
      prevPhysics = current + visualOffset
      onFrame(current, speedDegPerFrame, crossings)

      if (t < 1 && Math.abs(current - to) > 0.025) requestAnimationFrame(step)
      else {
        onFrame(to, 0, 0)
        resolve()
      }
    }

    requestAnimationFrame(step)
  })
}
