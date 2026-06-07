export function computeRMSE(truth, simTracks, simStep) {
  const track0 = simTracks[0]
  if (!track0) return null
  const mover = truth.filter(s => s.ball === 0)
  if (mover.length === 0) return 0
  const sse = mover.reduce((sum, { t, x, y }) => {
    const s = track0[Math.min(Math.round(t / simStep), track0.length - 1)]
    return sum + (x - s.x) ** 2 + (y - s.y) ** 2
  }, 0)
  return Math.sqrt(sse / mover.length)
}
