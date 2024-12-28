import { ImpulsePlot } from "./diagram/impulseplot"
import { ReboundPlot } from "./diagram/reboundplot"
import { ThrowPlot } from "./diagram/throwplot"
import { R } from "./diagram/constants"

declare global {
  interface Window {
    Plotly: any
  }
}

new ImpulsePlot().plot()
const figure9 = `<b>Figure.9</b> Rebound speed and rebound angle versus incident angle <br>
    for different topspins of the ball, ωT0 = kV0/R and V0 = 1 m/s with no sidespin`
new ReboundPlot().plot(
  "mathaven-figure9-speed",
  "mathaven-figure9-angle",
  figure9
)
const figure10 = `<b>Figure.10</b> Rebound speed and rebound angle versus incident angle <br>
for different sidespins of the ball,ωS0 = kV0/R and V0 = 1 m/s with the ball rolling (ωT0 = V0/R)`
new ReboundPlot().plot(
  "mathaven-figure10-speed",
  "mathaven-figure10-angle",
  figure10,
  (k) => k / R,
  (_) => 1 / R
)

new ThrowPlot().plotCutAngle()
