export function interpolateTrack(track, t, simStep) {
  const fi = t / simStep
  const lo = Math.floor(fi)
  const hi = Math.min(lo + 1, track.length - 1)
  if (lo >= track.length - 1) return track[track.length - 1]
  const alpha = fi - lo
  const a = track[lo], b = track[hi]
  return { x: a.x + alpha * (b.x - a.x), y: a.y + alpha * (b.y - a.y) }
}

export function computeRMSE(truth, simTracks, simStep, trackAll = false) {
  const relevant = trackAll ? truth : truth.filter(s => s.ball === 0)
  if (relevant.length === 0) return 0
  let sse = 0
  let count = 0
  for (const { ball, t, x, y } of relevant) {
    const track = simTracks[ball]
    if (!track) continue
    const s = interpolateTrack(track, t, simStep)
    sse += (x - s.x) ** 2 + (y - s.y) ** 2
    count++
  }
  return count > 0 ? Math.sqrt(sse / count) : null
}
