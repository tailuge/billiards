export function interpolateTrack(track, t, simStep) {
  const fi = t / simStep
  const lo = Math.floor(fi)
  const hi = Math.min(lo + 1, track.length - 1)
  if (lo >= track.length - 1) return track[track.length - 1]
  const alpha = fi - lo
  const a = track[lo], b = track[hi]
  return { x: a.x + alpha * (b.x - a.x), y: a.y + alpha * (b.y - a.y) }
}

export function computeRMSE(truth, simTracks, simStep) {
  const track0 = simTracks[0]
  if (!track0) return null
  const mover = truth.filter(s => s.ball === 0)
  if (mover.length === 0) return 0
  const sse = mover.reduce((sum, { t, x, y }) => {
    const s = interpolateTrack(track0, t, simStep)
    return sum + (x - s.x) ** 2 + (y - s.y) ** 2
  }, 0)
  return Math.sqrt(sse / mover.length)
}
