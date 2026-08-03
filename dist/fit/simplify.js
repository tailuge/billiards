const R = 0.03275

/**
 * Checks if a point (x, y) is within 3*R of any of the four cushions of the three-cushion billiard table.
 */
export function isWithin3ROfCushion(x, y) {
  const tableX = R * 45.18
  const tableY = R * 22.09
  const limit = 3 * R

  const distToCushionX = tableX - Math.abs(x)
  const distToCushionY = tableY - Math.abs(y)

  return distToCushionX <= limit || distToCushionY <= limit
}

/**
 * Linearly interpolates a ball's position at a specific timestamp.
 */
export function getBallPosAtTime(samples, t) {
  if (!samples || samples.length === 0) return null
  if (t <= samples[0].t) {
    return { x: samples[0].x, y: samples[0].y }
  }
  if (t >= samples[samples.length - 1].t) {
    return { x: samples[samples.length - 1].x, y: samples[samples.length - 1].y }
  }

  let low = 0
  let high = samples.length - 1
  while (low <= high) {
    const mid = (low + high) >> 1
    if (samples[mid].t === t) {
      return { x: samples[mid].x, y: samples[mid].y }
    } else if (samples[mid].t < t) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  const p1 = samples[high]
  const p2 = samples[low]
  if (!p1 || !p2) return null
  const dt = p2.t - p1.t
  if (dt === 0) return { x: p1.x, y: p1.y }
  const alpha = (t - p1.t) / dt
  return {
    x: p1.x + alpha * (p2.x - p1.x),
    y: p1.y + alpha * (p2.y - p1.y)
  }
}

/**
 * Checks if a ball is within 3*R proximity of any other ball at that time.
 */
export function isNearOtherBall(currentBallId, p, t, ballGroups) {
  const limit = 3 * R

  for (const [otherBallIdStr, otherSamples] of Object.entries(ballGroups)) {
    const otherBallId = parseInt(otherBallIdStr, 10)
    if (otherBallId === currentBallId) continue

    const otherPos = getBallPosAtTime(otherSamples, t)
    if (!otherPos) continue

    const dist = Math.hypot(p.x - otherPos.x, p.y - otherPos.y)
    if (dist <= limit) {
      return true
    }
  }
  return false
}

/**
 * Simplifies the multi-ball trajectory data to have equal density along the path,
 * except that it preserves points within 3*R of cushions and other balls.
 *
 * @param {Array} truth - Original flat trajectory array of [{ball, t, x, y}, ...].
 * @param {number} minDistanceInMm - Configurable minimum distance between points in millimeters.
 * @returns {Array} The simplified flat trajectory array.
 */
export function simplifyTruth(truth, minDistanceInMm) {
  if (!truth || truth.length === 0) return []

  const minDistanceInMeters = minDistanceInMm / 1000

  // Group by ball ID
  const groups = {}
  for (const s of truth) {
    groups[s.ball] ??= []
    groups[s.ball].push(s)
  }

  // Sort groups by t
  for (const ballStr of Object.keys(groups)) {
    groups[ballStr].sort((a, b) => a.t - b.t)
  }

  const simplifiedGroups = []
  for (const [ballStr, samples] of Object.entries(groups)) {
    const ballId = parseInt(ballStr, 10)
    if (samples.length <= 2) {
      simplifiedGroups.push(samples)
      continue
    }

    const simplified = []
    // Always keep the first point
    simplified.push(samples[0])
    let lastKept = samples[0]

    for (let i = 1; i < samples.length - 1; i++) {
      const p = samples[i]
      if (isWithin3ROfCushion(p.x, p.y)) {
        simplified.push(p)
        lastKept = p
        continue
      }
      if (isNearOtherBall(ballId, p, p.t, groups)) {
        simplified.push(p)
        lastKept = p
        continue
      }

      // Check distance from lastKept to p
      const dist = Math.hypot(p.x - lastKept.x, p.y - lastKept.y)
      if (dist >= minDistanceInMeters) {
        simplified.push(p)
        lastKept = p
      }
    }

    // Always keep the last point
    simplified.push(samples[samples.length - 1])
    simplifiedGroups.push(simplified)
  }

  // Concatenate simplified trajectories, preserving ball grouping order
  return simplifiedGroups.flat()
}
