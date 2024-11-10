import { MathavenEquations } from "./mathaven"
import { InitialConditions, State } from "./state"
import { constants } from "./constants"

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
    }
  }

  private calculateInitialDeltaP(initial: InitialConditions): number {
    const { V0, alpha } = initial
    const { M, ee, N } = constants
    return ((1 + ee) * M * V0 * Math.sin(alpha)) / N
  }

  private updateVelocities(slipParams: {
    s: number
    sPrime: number
    phi: number
    phiPrime: number
  }): void {
    const { s, sPrime, phi, phiPrime } = slipParams
    const { M, μw, μs, sinTheta, cosTheta } = constants

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

    this.updateAngularVelocities(slipParams)
  }

  private updateAngularVelocities(slipParams: {
    s: number
    sPrime: number
    phi: number
    phiPrime: number
  }): void {
    // implement using equations 14d,e,f
  }

  public completeCompressionPhase(): State {
    let count = 0
    console.log(count, this.state)
    while (this.state.yG_dot > 0) {
      count++
      const slipParams = MathavenEquations.calculateSlipParameters(this.state)

      this.updateVelocities(slipParams)

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
