export const HALF_W = 0.03275 * 92.36 / 2
export const HALF_H = 0.03275 * 46.18 / 2
const COLORS = ['#000', '#b8860b', '#c00']
const SIM_COLORS = ['rgba(0,100,255,0.5)', 'rgba(255,140,0,0.7)', 'rgba(200,0,0,0.7)']

export function redraw(canvas, truth, simTracks, simStep) {
  const W = canvas.width
  const H = canvas.height
  const ctx = canvas.getContext('2d')

  const tx = x => (x + HALF_W) / (2 * HALF_W) * W
  const ty = y => (HALF_H - y) / (2 * HALF_H) * H

  ctx.fillStyle = '#f5f5f0'
  ctx.fillRect(0, 0, W, H)

  for (const { ball, x, y } of truth) {
    ctx.fillStyle = COLORS[ball] ?? '#888'
    ctx.fillRect(tx(x) - 1, ty(y) - 1, 2, 2)
  }

  if (simTracks) {
    for (const [id, track] of Object.entries(simTracks)) {
      ctx.fillStyle = SIM_COLORS[id]
      for (const { x, y } of track) {
        ctx.fillRect(tx(x) - 1, ty(y) - 1, 2, 2)
      }
    }

    ctx.strokeStyle = 'rgba(255,0,0,0.25)'
    ctx.lineWidth = 1
    for (const { ball, t, x, y } of truth) {
      const track = simTracks[ball]
      if (!track) continue
      const i = Math.min(Math.round(t / simStep), track.length - 1)
      const s = track[i]
      if (s) {
        ctx.beginPath()
        ctx.moveTo(tx(x), ty(y))
        ctx.lineTo(tx(s.x), ty(s.y))
        ctx.stroke()
      }
    }
  }
}
