import { R } from "../model/physics/claude/constants";
import { Mathaven } from "../model/physics/claude/qwen";
import { config, color, createTrace, layout } from "./plotlyconfig";

export class Figure12 {

  private extractValues<T>(history, selector: (s: Mathaven) => T): T[] {
    return history.map(selector)
  }
  
  public plot() {
    const v0 = 2
    const calc = new Mathaven(v0, Math.PI / 4, 2 * v0 / R, 1.5 * v0 / R)
  
    try {
      calc.solve()
    } catch (error) {
      console.error(error)
    }
  
    const vals = (selector: (s: Mathaven) => number): number[] => this.extractValues(calc.history, selector)
  
    const impulse = vals(h => h.P)
  
    window.Plotly.newPlot("mathaven-impulse", [
      createTrace(impulse, vals(h => h.s), 's', color(0)),
      createTrace(impulse, vals(h => h.φ), 'φ', color(1)),
      createTrace(impulse, vals(h => h.sʹ), "s'", color(2)),
      createTrace(impulse, vals(h => h.φʹ), "φʹ", color(3)),
      createTrace(impulse, vals(h => h.WzI), "WzI", color(4)),
      createTrace(impulse, vals(h => h.P), "P", color(5)),
    ], layout, config)
  
    window.Plotly.newPlot("mathaven-vel", [
      createTrace(impulse, vals(h => h.vx), 'vx', color(5)),
      createTrace(impulse, vals(h => h.vy), 'vy', color(6)),
      createTrace(impulse, vals(h => h.WzI), "WzI", color(4)),
    ], layout, config)
  
    window.Plotly.newPlot("mathaven-spin", [
      createTrace(impulse, vals(h => h.ωx), "ωx", color(2)),
      createTrace(impulse, vals(h => h.ωy), "ωy", color(3)),
      createTrace(impulse, vals(h => h.WzI), "WzI", color(4)),
    ], layout, config)  
  
  }
}
