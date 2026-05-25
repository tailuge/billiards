// ES module: telemetry parsing + ghost overlay for fit.html

const REAL_TABLE_WIDTH = 2.840
const REAL_TABLE_HEIGHT = 1.421
const SMOOTHING_WINDOW = 5

/**
 * Parse telemetry JSON (PathTracking.DataSets format).
 * Returns { balls, longestIdx, tracks } where:
 *   balls: [{normX, normY}, ...] up to 3, in dataset order (white/yellow/red)
 *   longestIdx: index into balls/tracks of the dataset with most coords
 *   tracks: array of [{timeMs, x, y}, ...] per dataset
 *   estimatedAngle: radians, from first few points of longest track
 */
export function parseTelemetry(json) {
  const dataSets = json?.PathTracking?.DataSets
  if (!Array.isArray(dataSets) || dataSets.length === 0) {
    throw new Error("Missing PathTracking.DataSets")
  }

  const tracks = []
  let longestIdx = 0
  let maxLen = -1

  dataSets.slice(0, 3).forEach((ds, i) => {
    if (!Array.isArray(ds?.Coords)) { tracks.push([]); return }
    const coords = ds.Coords.map(pt => ({
      timeMs: pt.DeltaT_500us * 0.5,
      x: pt.X,
      y: pt.Y,
    })).sort((a, b) => a.timeMs - b.timeMs)
    tracks.push(coords)
    if (coords.length > maxLen) { maxLen = coords.length; longestIdx = i }
  })

  const balls = tracks.map(t => t.length > 0
    ? { normX: t[0].x, normY: t[0].y }
    : null
  )

  const longest = tracks[longestIdx]
  const estimatedAngle = estimateAngle(longest)

  return { balls, longestIdx, tracks, estimatedAngle }
}

function estimateAngle(track) {
  if (!track || track.length < 2) return 0
  const n = Math.min(5, track.length - 1)
  let dx = 0, dy = 0
  for (let i = 1; i <= n; i++) {
    dx += (track[i].x - track[i - 1].x) * REAL_TABLE_WIDTH
    dy += -(track[i].y - track[i - 1].y) * REAL_TABLE_HEIGHT // flip Y
  }
  return Math.atan2(dy, dx)
}

/**
 * GhostOverlay: draws animated ball path on a canvas over #table-wrap.
 * The canvas must be absolutely positioned over the table-surface area.
 */
export class GhostOverlay {
  constructor(canvas, tableSurfaceEl) {
    this.canvas = canvas
    this.surface = tableSurfaceEl
    this.tracks = []
    this.startTime = null
    this.rafId = null
    this.totalTimeMs = 0
  }

  load(tracks) {
    this.tracks = tracks.filter(t => t.length > 0)
    this.totalTimeMs = Math.max(...this.tracks.map(t => t[t.length - 1].timeMs))
    this.clear()
  }

  start() {
    if (this.tracks.length === 0) return
    this.stop()
    this.startTime = performance.now()
    const tick = (now) => {
      const elapsed = now - this.startTime
      this._draw(elapsed)
      if (elapsed < this.totalTimeMs) {
        this.rafId = requestAnimationFrame(tick)
      }
    }
    this.rafId = requestAnimationFrame(tick)
  }

  stop() {
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null }
  }

  clear() {
    const ctx = this.canvas.getContext("2d")
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  _draw(elapsedMs) {
    const rect = this.surface.getBoundingClientRect()
    this.canvas.width = rect.width
    this.canvas.height = rect.height

    const ctx = this.canvas.getContext("2d")
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const COLORS = ["rgba(255,255,255,0.7)", "rgba(255,215,0,0.7)", "rgba(239,68,68,0.7)"]

    this.tracks.forEach((track, i) => {
      const color = COLORS[i] ?? "rgba(255,255,255,0.5)"
      this._drawTrack(ctx, track, elapsedMs, color, rect)
    })
  }

  _drawTrack(ctx, track, elapsedMs, color, rect) {
    const w = rect.width
    const h = rect.height

    // draw full path faintly
    ctx.strokeStyle = color.replace("0.7", "0.25")
    ctx.lineWidth = 1.5
    ctx.setLineDash([3, 4])
    ctx.beginPath()
    track.forEach((pt, i) => {
      const px = pt.x * w
      const py = pt.y * h
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
    })
    ctx.stroke()
    ctx.setLineDash([])

    // draw elapsed path
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    let moved = false
    for (const pt of track) {
      if (pt.timeMs > elapsedMs) break
      const px = pt.x * w
      const py = pt.y * h
      if (!moved) { ctx.moveTo(px, py); moved = true }
      else ctx.lineTo(px, py)
    }
    ctx.stroke()

    // draw current ball position
    const pos = interpolateTrack(track, elapsedMs)
    if (pos) {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(pos.x * w, pos.y * h, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function interpolateTrack(track, t) {
  if (!track.length) return null
  if (t <= track[0].timeMs) return track[0]
  if (t >= track[track.length - 1].timeMs) return track[track.length - 1]
  for (let i = 0; i < track.length - 1; i++) {
    if (track[i].timeMs <= t && t <= track[i + 1].timeMs) {
      const ratio = (t - track[i].timeMs) / (track[i + 1].timeMs - track[i].timeMs)
      return {
        x: track[i].x + (track[i + 1].x - track[i].x) * ratio,
        y: track[i].y + (track[i + 1].y - track[i].y) * ratio,
      }
    }
  }
  return track[track.length - 1]
}
