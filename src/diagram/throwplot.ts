import { R } from "../model/physics/constants";
import { config, color, createTrace, layout } from "./plotlyconfig";
import { CollisionThrow } from "./throw_gpt4o";

export class ThrowPlot {


  public plot() {
    const angles: number[][] = []

    let deg: number[] = []

    for (let k = 1; k <= 3; k++) {
      const angle: number[] = []
      deg = []
      for (let alpha = 1; alpha < 90; alpha += 9) {
        deg.push(alpha)
        const model = new CollisionThrow() 
        const result = model.throwAngle(k, k/R, 0, alpha)
        angle.push(result)
      }
      angles.push(angle)
    }

    const x = deg

    layout.title.text = "Throw effect"

    window.Plotly.newPlot("collision-throw", [
      createTrace(x, angles[0], 'k=-1', color(0)),
      createTrace(x, angles[1], 'k=0', color(1)),
      createTrace(x, angles[2], 'k=1', color(2)),
      createTrace(x, angles[3], 'k=2', color(3)),
    ], layout, config)

  }
}
