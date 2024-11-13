import { M, R, ee, μs, μw, sinTheta, cosTheta, N } from "./constants"

export class NumericCalculation {
  private state
  public readonly plot
  private previousZ_dot: number = 0
  private targetWorkRebound: number

  constructor(V0: number, alpha: number, w0T: number, w0S: number) {
    this.plot = {
      p: [],
      s: [],
      phi: [],
    }
    this.state = {
      P: 0,
      WzI: 0,
      xG_dot: V0 * Math.cos(alpha),
      yG_dot: V0 * Math.sin(alpha),
      zG_dot: 0,
      θx_dot: -w0T * Math.sin(alpha),
      θy_dot: w0T * Math.cos(alpha),
      θz_dot: w0S,
      s: 0,
      phi: 0,
      sPrime: 0,
      phiPrime: 0,
    }

    this.state.s = this.calculateSlipSpeed()
    this.state.phi = this.calculatePhi()
    this.state.sPrime = Math.abs(V0 - R * w0T)
    this.state.phiPrime = this.calculatePhiPrime(V0, alpha, w0T)
  }

  private calculateSlipSpeed(): number {
    const state = this.state
    const xI_dot =
      state.xG_dot + state.θy_dot * R * sinTheta - state.θz_dot * R * cosTheta
    const yI_dot = -state.yG_dot * sinTheta + state.θx_dot * R
    return Math.sqrt(xI_dot ** 2 + yI_dot ** 2)
  }

  private calculatePhi(): number {
    const state = this.state
    const xI_dot =
      state.xG_dot + state.θy_dot * R * sinTheta - state.θz_dot * R * cosTheta
    const yI_dot = -state.yG_dot * sinTheta + state.θx_dot * R
    return Math.atan2(yI_dot, xI_dot)
  }

  // Slip angle phiPrime at table contact point C
  private calculatePhiPrime(V0: number, alpha: number, w0T: number): number {
    return V0 > R * w0T ? alpha : Math.PI + alpha
  }

  private updateVelocities(deltaP: number): void {
    const { phi, phiPrime } = this.state
    const coeff = 1 / M
    this.state.xG_dot -=
      coeff *
      (μw * Math.cos(phi) +
        μs * Math.cos(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) *
      deltaP
    this.state.yG_dot -=
      coeff *
      (cosTheta -
        μw * sinTheta * Math.sin(phi) +
        μs * Math.sin(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) *
      deltaP
  }

  private updateAngularVelocities(deltaP: number): void {
    const { phi, phiPrime } = this.state
    const coeff = 5 / (2 * M * R)
    this.state.θx_dot -=
      coeff *
      (μw * Math.sin(phi) +
        μs * Math.sin(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) *
      deltaP
    this.state.θy_dot -=
      coeff *
      (μw * Math.cos(phi) * sinTheta -
        μs * Math.cos(phiPrime) * (sinTheta + μw * Math.sin(phi) * cosTheta)) *
      deltaP
    this.state.θz_dot += coeff * (μw * Math.cos(phi) * cosTheta) * deltaP
  }

  private updateWorkDone(deltaP: number): void {
    const zI_dot_avg = (this.state.zG_dot + this.previousZ_dot) / 2
    this.state.WzI += deltaP * zI_dot_avg
    this.previousZ_dot = this.state.zG_dot
  }

  public solution() {
    this.compressionPhase()
    this.restitutionPhase(this.targetWorkRebound)
    return this.state
  }

  public compressionPhase(): void {
    while (this.state.yG_dot > 0) {
      this.logDataForPlotting()
      this.updateSingleStep()
    }
    this.targetWorkRebound = (1 - ee ** 2) * this.state.WzI
  }

  public restitutionPhase(targetWorkRebound: number): void {
    while (this.state.WzI < targetWorkRebound) {
      this.logDataForPlotting()
      this.updateSingleStep()
    }
  }

  private logDataForPlotting(): void {
    this.plot.p.push(this.state.P)
    this.plot.s.push(this.state.s)
    this.plot.phi.push(this.state.phi)
  }

  private calculateDeltaP(): number {
    return ((1 + ee) * M * this.state.yG_dot) / N
  }

  private updateSingleStep(): void {
    const deltaP = this.calculateDeltaP()
    this.updateVelocities(deltaP)
    this.updateAngularVelocities(deltaP)
    this.updateWorkDone(deltaP)

    this.state.s = this.calculateSlipSpeed()
    this.state.phi = this.calculatePhi()
  }
}
