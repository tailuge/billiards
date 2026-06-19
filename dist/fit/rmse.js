export function interpolateTrack(track, t, lo) {
  // advance cursor forward while next frame's timestamp ≤ t
  while (lo + 1 < track.length && track[lo + 1].t <= t) lo++
  const hi = Math.min(lo + 1, track.length - 1)
  if (lo >= track.length - 1) return { point: track[track.length - 1], lo }
  const alpha = (t - track[lo].t) / (track[hi].t - track[lo].t)
  const a = track[lo], b = track[hi]
  return { point: { x: a.x + alpha * (b.x - a.x), y: a.y + alpha * (b.y - a.y) }, lo }
}

export function computeSSE(truth, simTracks, trackAll = false) {
  const relevant = trackAll ? truth : truth.filter(s => s.ball === 0)
  if (relevant.length === 0) return { sse: 0, count: 0 }
  const cursors = {}
  let sse = 0
  let count = 0
  for (const { ball, t, x, y } of relevant) {
    const track = simTracks[ball]
    if (!track || track.length === 0) continue
    let lo = cursors[ball] ?? 0
    const { point, lo: newLo } = interpolateTrack(track, t, lo)
    cursors[ball] = newLo
    sse += (x - point.x) ** 2 + (y - point.y) ** 2
    count++
  }
  return { sse, count }
}

export function computeRMSE(truth, simTracks, trackAll = false) {
  const { sse, count } = computeSSE(truth, simTracks, trackAll)
  return count > 0 ? Math.sqrt(sse / count) : null
}
