import { R } from "../model/physics/claude/constants";
import { Mathaven } from "../model/physics/claude/qwen";
import { config, color, createTrace, layout } from "./plotlyconfig";

export class ReboundPlot {

  private getFinalState(v0, alpha, sidespin, topspin) {
    try {
      const calc = new Mathaven(v0, alpha, sidespin, topspin)
      calc.solve()
      return { beta: 1, speed: Math.sqrt(calc.vx * calc.vx + calc.vy * calc.vy) }
    } catch (error) {
      console.error(error)
      return { beta: NaN, speed: NaN }
    }
  }

  public plot(div, title, sidespin = (_) => 0, topspin = (k) => k / R) {
    const traces: number[][] = []
    const v0 = 1;

    let deg: number[] = []

    for (let k = -1; k <= 2; k++) {
      const trace: number[] = [];
      deg = []
      for (let alpha = 1; alpha < 90; alpha += 9) {
        deg.push(alpha)
        const result = this.getFinalState(v0, alpha * (Math.PI / 180), sidespin(k), topspin(k));
        trace.push(result.speed)
      }
      traces.push(trace);
    }

    const x = deg

    layout.title.text = title
    window.Plotly.newPlot(div, [
      createTrace(x, traces[0], 'k=-1', color(0)),
      createTrace(x, traces[1], 'k=0', color(1)),
      createTrace(x, traces[2], 'k=1', color(2)),
      createTrace(x, traces[3], 'k=2', color(3)),
    ], layout, config)

  }
}
