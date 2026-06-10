import { interpolateTrack } from './rmse.js'

export const HALF_W = 0.03275 * 92.36 / 2
export const HALF_H = 0.03275 * 46.18 / 2
const COLORS = ['#fff', '#ff0', '#f00']
const SIM_COLORS = ['rgba(255, 255, 255, 1)', 'rgba(255, 251, 0, 1)', 'rgba(255, 0, 0, 1)']

export function redraw(canvas, truth, simTracks, simStep, trackAll = false) {
  const W = canvas.width
  const H = canvas.height
  const ctx = canvas.getContext('2d')

  const tx = x => (x + HALF_W) / (2 * HALF_W) * W
  const ty = y => (HALF_H - y) / (2 * HALF_H) * H

  ctx.fillStyle = '#3b3f88ff'
  ctx.fillRect(0, 0, W, H)

  for (const { ball, x, y } of truth) {
    ctx.fillStyle = COLORS[ball] ?? '#888'
    ctx.fillRect(tx(x) - 1, ty(y) - 1, 2, 2)
  }

  if (simTracks) {
    for (const [id, track] of Object.entries(simTracks)) {
      ctx.fillStyle = SIM_COLORS[id]
      for (const { x, y } of track) {
        ctx.fillRect(tx(x) - 1, ty(y) - 1, 1, 1)
      }
    }

    ctx.lineWidth = 0.25
    for (const { ball, t, x, y } of truth) {
      if (!trackAll && ball !== 0) continue
      const track = simTracks[ball]
      if (!track) continue
      const s = interpolateTrack(track, t, simStep)
      ctx.strokeStyle = SIM_COLORS[ball] ?? '#888'
      ctx.beginPath()
      ctx.moveTo(tx(x), ty(y))
      ctx.lineTo(tx(s.x), ty(s.y))
      ctx.stroke()
    }
  }
}
