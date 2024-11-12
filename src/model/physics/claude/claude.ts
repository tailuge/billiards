import { MathavenEquations } from "./mathaven"
import { InitialConditions, State } from "./state"
import { M, R, ee, μs, μw, sinTheta, cosTheta, N } from "./constants"

export class CompressionPhase {
  private state: State
  private prevState: State
  private deltaP: number

  constructor(initial: InitialConditions) {
    this.state = this.setInitialConditions(initial)
    this.prevState = { ...this.state }
    this.deltaP = this.calculateInitialDeltaP(initial)
  }

  private setInitialConditions(initial: InitialConditions): State {
    const { V0, alpha, w0T, w0S } = initial
    return {
      P: 0,
      WzI: 0,
      xG_dot: V0 * Math.cos(alpha),
      yG_dot: V0 * Math.sin(alpha),
      zG_dot: 0,
      θx_dot: -w0T * Math.sin(alpha),
      θy_dot: w0T * Math.cos(alpha),
      θz_dot: w0S,
      s: 0,
      sPrime: 0,
      phi: 0,
      phiPrime: 0,
    }
  }

  private calculateInitialDeltaP(initial: InitialConditions): number {
    const { V0, alpha } = initial
    return ((1 + ee) * M * V0 * Math.sin(alpha)) / N
  }

  private updateVelocities(): void {
    const { phi, phiPrime } = this.state

    // Implementation of Equation (17a) for velocity increments
    const deltaXG =
      -(1 / M) *
      (μw * Math.cos(phi) +
        μs * Math.cos(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) *
      this.deltaP

    const deltaYG =
      -(1 / M) *
      (cosTheta -
        μw * sinTheta * Math.sin(phi) +
        μs * Math.sin(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) *
      this.deltaP

    // Update state with new velocities
    this.prevState = { ...this.state }
    this.state.xG_dot += deltaXG
    this.state.yG_dot += deltaYG
  }

  private updateAngularVelocities(): void {
    const { phi, phiPrime } = this.state

    // Implementation of equation 14d numerical approximation
    const deltaθx =
      -(5 / (2 * M * R)) *
      (μw * Math.sin(phi) +
        μs * Math.sin(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) *
      this.deltaP

    // Implementation of equation 14e numerical approximation
    const deltaθy =
      -(5 / (2 * M * R)) *
      (μw * Math.cos(phi) * sinTheta -
        μs * Math.cos(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) *
      this.deltaP

    // Implementation of equation 14f numerical approximation
    const deltaθz =
      (5 / (2 * M * R)) * (μw * Math.cos(phi) * cosTheta) * this.deltaP

    // Update angular velocities in state
    this.state.θx_dot += deltaθx
    this.state.θy_dot += deltaθy
    this.state.θz_dot += deltaθz
  }

  public completeCompressionPhase(): State {
    let count = 0
    console.log(count, this.state)
    while (this.state.yG_dot > 0) {
      count++
      const slipParams = MathavenEquations.calculateSlipParameters(this.state)
      this.state.s = slipParams.s
      this.state.sPrime = slipParams.sPrime
      this.state.phi = slipParams.phi
      this.state.phiPrime = slipParams.phiPrime

      this.updateVelocities()
      this.updateAngularVelocities()

      // Update work done
      this.state.WzI += MathavenEquations.calculateWorkIncrement(
        this.state,
        this.prevState,
        this.deltaP
      )

      this.state.P += this.deltaP
    }
    console.log(count, this.state)

    return this.state
  }
}
