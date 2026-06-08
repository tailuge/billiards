export let TRIM_N = 5 // ignore first and last N points in RMSE comparison

export function setTrimN(n) {
  TRIM_N = n
}

export function computeRMSE(truth, simTracks, simStep) {
  const track0 = simTracks[0]
  if (!track0) return null
  const all = truth.filter(s => s.ball === 0)
  const mover = all.slice(TRIM_N, all.length - TRIM_N)
  if (mover.length === 0) return 0
  const sse = mover.reduce((sum, { t, x, y }) => {
    const s = track0[Math.min(Math.round(t / simStep), track0.length - 1)]
    return sum + (x - s.x) ** 2 + (y - s.y) ** 2
  }, 0)
  return Math.sqrt(sse / mover.length)
}
