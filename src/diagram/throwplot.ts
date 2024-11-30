import { R } from "../model/physics/constants";
import { config, color, createTrace, layout } from "./plotlyconfig";
import { CollisionThrow } from "./throw_gpt4o";

export class ThrowPlot {

  private degToRad(x: number): number {
    return x * (Math.PI / 180);
  }


  public plot() {
    const velocities = [0.447, 1.341, 3.129];

    const mo = new CollisionThrow()
    console.log(mo.plot(1, 0.0, 0.0, 0.0))
    const angles: number[][] = []
    const anglesFull: number[][] = []

    let deg: number[] = []

    velocities.forEach(k => {
      const angle: number[] = []
      const angleFull: number[] = []
      deg = []
      for (let alpha = 1; alpha < 90; alpha += 0.1) {
        deg.push(alpha)
        const model = new CollisionThrow()
        angle.push(model.throwAngle(k, k / R, 0, this.degToRad(alpha)))
        angleFull.push(model.plot(k, k / R, 0, this.degToRad(alpha)))
      }
      angles.push(angle)
      anglesFull.push(angleFull)
    })

    const x = deg

    layout.title.text = "Throw effect (WIP) <br>from https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf "

    window.Plotly.newPlot("collision-throw", [
      createTrace(x, angles[0], 'k=1', color(0)),
      createTrace(x, angles[1], 'k=2', color(1)),
      createTrace(x, angles[2], 'k=3', color(2)),

      createTrace(x, anglesFull[0], 'f k=1', color(4)),
      createTrace(x, anglesFull[1], 'f k=2', color(5)),
      createTrace(x, anglesFull[2], 'f k=3', color(6)),


    ], layout, config)

  }
}
