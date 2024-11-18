import { R } from "../model/physics/claude/constants";
import { Mathaven } from "../model/physics/claude/qwen";
import { config, color, createTrace, layout } from "./plotlyconfig";

export class Figure9 {

  private getFinalState(v0, alpha, sidespin, topspin ) {
    try {
      const calc = new Mathaven(v0, alpha, sidespin, topspin )
      calc.solve()
      return { beta: 1, speed: Math.sqrt(calc.vx * calc.vx + calc.vy * calc.vy) }
    } catch (error) {
      console.error(error)
      return { beta: NaN, speed: NaN }
    }
  }

  public plot() {
    const traces: number[][] = []
    const v0 = 1;
    const sidespin = 0;

    let deg: number[] = []

    for (let k = -1; k <= 2; k++) {
      const trace: number[] = [];
      const topspin = (k * v0) / R;
      deg = []
      for (let alpha = 1; alpha < 90; alpha += 20) {
        deg.push(alpha)
        const result = this.getFinalState(v0, alpha * (Math.PI / 180), sidespin, topspin );
        trace.push(result.speed)
      }
      traces.push(trace);
    }

    const x = deg

    window.Plotly.newPlot("mathaven-figure9-speed", [
      createTrace(x, traces[0], 'k=-1', color(0)),
      createTrace(x, traces[1], 'k=0', color(1)),
      createTrace(x, traces[2], 'k=1', color(2)),
      createTrace(x, traces[3], 'k=2', color(3)),
    ], layout, config)

  }
}
