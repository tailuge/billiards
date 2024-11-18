import { R } from "../model/physics/claude/constants";
import { Mathaven } from "../model/physics/claude/qwen";
import { config, color, createTrace, layout } from "./plotlyconfig";

export class ImpulsePlot {

  private extractValues<T>(history, selector: (s: Mathaven) => T): T[] {
    return history.map(selector)
  }

  public plot(v0 = 2, alpha = Math.PI / 4, wS = 2 * v0 / R, wT = 1.5 * v0 / R) {
    const calc = new Mathaven(v0, alpha, wS, wT)
    try {
      calc.solve()
    } catch (error) {
      console.error(error)
    }

    const vals = (selector: (s: Mathaven) => number): number[] => this.extractValues(calc.history, selector)

    const impulse = vals(h => h.P)
    layout.title.text = `<b>Figure.12</b> Slip–impulse curves 
for V0 = 2 m/s, α = 45◦,ωS0 = 2V0/R, and ωT0 = 1.5V0/R 
<br>(s and φ are for the slip at the cushion, 
and sʹ and φʹ are for the slip at the table)`

    window.Plotly.newPlot("mathaven-impulse", [
      createTrace(impulse, vals(h => h.s), 's', color(0)),
      createTrace(impulse, vals(h => h.φ), 'φ', color(1)),
      createTrace(impulse, vals(h => h.sʹ), "s'", color(2)),
      createTrace(impulse, vals(h => h.φʹ), "φʹ", color(3)),
      createTrace(impulse, vals(h => h.WzI), "WzI", color(4)),
      createTrace(impulse, vals(h => h.P), "P", color(5)),
    ], layout, config)

    layout.title.text = ""
        
    const index = vals(h => h.i)
        window.Plotly.newPlot("mathaven-vel", [
          createTrace(index, vals(h => h.vy), 'vy', color(6)),
          createTrace(index, vals(h => h.WzI), "WzI", color(4)),
          createTrace(index, vals(h => h.P), "P", color(5)),
        ], layout, config)
  }
}
