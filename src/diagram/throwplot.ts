
import { config, color, createTrace, layout } from "./plotlyconfig";
import { CollisionThrow } from "./throw_gpt4o";

export class ThrowPlot {

  private degToRad(x: number): number {
    return x * (Math.PI / 180);
  }

  private radToDeg(x: number): number {
    return x * (180 / Math.PI);
  }

  public plotCutAngle() {
    const R = CollisionThrow.R
    this.plot("collision-throw-roll", k => (k / R))
    this.plot("collision-throw-stun", _ => 0)

 // test:
    const model = new CollisionThrow()
    model.plot(0.5, 0, 0, Math.PI/8)
  }
  
  public plot(div, omegax) {

    const angles: number[][] = []

    let deg: number[] = []

    const velocities = [0.447, 1.341, 3.129];
    velocities.forEach(k => {
      const angle: number[] = []
      deg = []
      for (let alpha = 1; alpha < 90; alpha += 1) {
        deg.push(alpha)
        const model = new CollisionThrow()
        const throwAngle = model.plot(k, omegax(k), 0, this.degToRad(alpha))
        angle.push(this.radToDeg(throwAngle))
      }
      angles.push(angle)
    })

    const myLayout = { ...layout }
    myLayout.title.text = `Throw effect (WIP)
    <br>throw vs. cut angle for various-speed ${div} shots
    <br>from https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf`

    window.Plotly.newPlot(div, [
      createTrace(deg, angles[0], 'slow', color(4)),
      createTrace(deg, angles[1], 'medium', color(5)),
      createTrace(deg, angles[2], 'fast', color(6)),
    ], myLayout, config)

  }
}
