import { config, color, createTrace, layout } from "./plotlyconfig"
import { CollisionThrowPlot } from "./throw_gpt4o"

export class ThrowPlot {
  private degToRad(x: number): number {
    return x * (Math.PI / 180)
  }

  private radToDeg(x: number): number {
    return x * (180 / Math.PI)
  }

  public plotCutAngle() {
    const R = CollisionThrowPlot.R
    this.plot("collision-throw-roll", [0.447, 1.341, 3.129], (k) => k / R)
    this.plot("collision-throw-stun", [0.447, 1.341, 3.129], (_) => 0)

    this.plotRolls(
      "collision-throw-varying-roll",
      [0, 0.25, 0.5, 1],
      (k) => k / R,
      (_) => 0,
      (phi) => phi
    )
    this.plotRolls(
      "collision-throw-varying-side",
      [0, 0.25, 0.5, 1],
      (k) => k / R,
      (z) => ((1 / R) * (z - 45)) / 45,
      (_) => 0
    )

    // test:
    const model = new CollisionThrowPlot(console.log)
    model.plot(0.5, -15, -10, Math.PI / 8)
  }

  public plot(div, ks, omegax) {
    const angles: number[][] = []
    let deg: number[] = []

    ks.forEach((k) => {
      const angle: number[] = []
      deg = []
      for (let alpha = 1; alpha < 90; alpha += 1) {
        deg.push(alpha)
        const model = new CollisionThrowPlot()
        const throwAngle = model.plot(k, omegax(k), 0, this.degToRad(alpha))
        angle.push(this.radToDeg(throwAngle))
      }
      angles.push(angle)
    })

    const myLayout = { ...layout }
    myLayout.title.text = `Throw effect (WIP)
    <br>throw vs. cut angle for various-speed ${div} shots
    <br>from https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf`

    window.Plotly.newPlot(
      div,
      [
        createTrace(deg, angles[0], "slow", color(4)),
        createTrace(deg, angles[1], "medium", color(5)),
        createTrace(deg, angles[2], "fast", color(6)),
      ],
      myLayout,
      config
    )
  }

  public plotRolls(div, ks, omegax, omegaz, phi) {
    const angles: number[][] = []
    let x: number[] = []

    ks.forEach((k) => {
      const angle: number[] = []
      x = []
      for (let alpha = 1; alpha < 90; alpha += 1) {
        x.push(alpha)
        const model = new CollisionThrowPlot()
        const throwAngle = model.plot(
          1,
          omegax(k),
          omegaz(alpha),
          this.degToRad(phi(alpha))
        )
        angle.push(this.radToDeg(throwAngle))
      }
      angles.push(angle)
    })

    const myLayout = { ...layout }
    myLayout.title.text = `Throw effect (WIP)
    <br>throw vs. cut angle for various-speed ${div} shots
    <br>from https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf`

    window.Plotly.newPlot(
      div,
      [
        createTrace(x, angles[0], "0", color(4)),
        createTrace(x, angles[1], "0.25", color(5)),
        createTrace(x, angles[2], "0.5", color(6)),
        createTrace(x, angles[3], "1.0", color(7)),
      ],
      myLayout,
      config
    )
  }
}
