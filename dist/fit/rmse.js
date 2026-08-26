export const RMSE_CUTOFF_T = 4
// Time window (s) beyond which truth samples are excluded from scoring.

export function interpolateTrack(track, t, lo) {
  // advance cursor forward while next frame's timestamp ≤ t
  while (lo + 1 < track.length && track[lo + 1].t <= t) lo++
  const hi = Math.min(lo + 1, track.length - 1)
  if (lo >= track.length - 1) return { point: track[track.length - 1], lo }
  const alpha = (t - track[lo].t) / (track[hi].t - track[lo].t)
  const a = track[lo], b = track[hi]
  return { point: { x: a.x + alpha * (b.x - a.x), y: a.y + alpha * (b.y - a.y) }, lo }
}

export function computeSSE(truth, simTracks, trackAll = false, cutoff = RMSE_CUTOFF_T) {
  const limit = cutoff == null || !Number.isFinite(cutoff) ? Infinity : cutoff
  const relevant = trackAll ? truth : truth.filter(s => s.ball === 0)
  if (relevant.length === 0) return { sse: 0, count: 0 }
  const cursors = {}
  let sse = 0
  let count = 0
  for (const { ball, t, x, y } of relevant) {
    if (t > limit) continue
    const track = simTracks[ball]
    if (!track || track.length === 0) continue
    let lo = cursors[ball] ?? 0
    const { point, lo: newLo } = interpolateTrack(track, t, lo)
    cursors[ball] = newLo
    // cue ball 1.5x other balls, decayed 1/(1+t) so early motion dominates
    const wi = (ball === 0 ? 1.5 : 1) / (1 + t)
    sse += wi * ((x - point.x) ** 2 + (y - point.y) ** 2)
    count += wi
  }
  return { sse, count }
}

export function computeRMSE(truth, simTracks, trackAll = false, cutoff = RMSE_CUTOFF_T) {
  const { sse, count } = computeSSE(truth, simTracks, trackAll, cutoff)
  return count > 0 ? Math.sqrt(sse / count) : null
}
