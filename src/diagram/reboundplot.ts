import { ee, M, R, μs, μw } from "./constants"
import { Mathaven } from "../model/physics/mathaven"
import { config, color, createTrace, layout } from "./plotlyconfig"

export class ReboundPlot {
  private getFinalState(v0, alpha, sidespin, topspin) {
    try {
      const calc = new Mathaven(M, R, ee, μs, μw)
      calc.solvePaper(v0, alpha, sidespin, topspin)
      const vy = calc.vy
      const vx = calc.vx
      return {
        beta: Math.atan2(-vy, vx) * (180 / Math.PI),
        speed: Math.sqrt(vx * vx + vy * vy),
      }
    } catch (error) {
      console.error(error)
      return { beta: NaN, speed: NaN }
    }
  }

  public plot(
    divSpeed,
    divAngle,
    title,
    sidespin = (_) => 0,
    topspin = (k) => k / R
  ) {
    const speeds: number[][] = []
    const angles: number[][] = []
    const v0 = 1

    let deg: number[] = []

    for (let k = -1; k <= 2; k++) {
      const speed: number[] = []
      const angle: number[] = []
      deg = []
      for (let alpha = 1; alpha < 90; alpha += 9) {
        deg.push(alpha)
        const result = this.getFinalState(
          v0,
          alpha * (Math.PI / 180),
          sidespin(k),
          topspin(k)
        )
        speed.push(result.speed)
        angle.push(result.beta)
      }
      speeds.push(speed)
      angles.push(angle)
    }

    const x = deg

    layout.title.text = title
    window.Plotly.newPlot(
      divSpeed,
      [
        createTrace(x, speeds[0], "k=-1", color(0)),
        createTrace(x, speeds[1], "k=0", color(1)),
        createTrace(x, speeds[2], "k=1", color(2)),
        createTrace(x, speeds[3], "k=2", color(3)),
      ],
      layout,
      config
    )

    window.Plotly.newPlot(
      divAngle,
      [
        createTrace(x, angles[0], "k=-1", color(0)),
        createTrace(x, angles[1], "k=0", color(1)),
        createTrace(x, angles[2], "k=1", color(2)),
        createTrace(x, angles[3], "k=2", color(3)),
      ],
      layout,
      config
    )
  }
}
