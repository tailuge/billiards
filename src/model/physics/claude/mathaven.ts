import { State } from "./state"
import { R, sinTheta, cosTheta } from "./constants"

export class MathavenEquations {
  // Equations (12a,b) - Slip velocities at cushion I
  static cushionSlipVelocities(state: State): { x: number; y: number } {
    const { xG_dot, yG_dot, zG_dot, θx_dot, θy_dot, θz_dot } = state
    return {
      x: xG_dot + θy_dot * R * sinTheta - θz_dot * R * cosTheta,
      y: -yG_dot * sinTheta + zG_dot * cosTheta + θx_dot * R
    }
  }

  // Equation (13a,b) - Slip velocities at table C
  static tableSlipVelocities(state: State): { x: number; y: number } {
    const { xG_dot, yG_dot, θx_dot, θy_dot } = state

    return {
      x: xG_dot - θy_dot * R,
      y: yG_dot + θx_dot * R,
    }
  }

  // Calculate slip speeds and angles
  static calculateSlipParameters(state: State): {
    s: number
    sPrime: number
    phi: number
    phiPrime: number
  } {
    const cushionSlip = this.cushionSlipVelocities(state)
    const tableSlip = this.tableSlipVelocities(state)

    const s = Math.sqrt(cushionSlip.x * cushionSlip.x + cushionSlip.y * cushionSlip.y)
    const sPrime = Math.sqrt(
      tableSlip.x * tableSlip.x + tableSlip.y * tableSlip.y
    )

    const phi = Math.atan2(cushionSlip.y, cushionSlip.x)
    const phiPrime = Math.atan2(tableSlip.y, tableSlip.x)

    return { s, sPrime, phi, phiPrime }
  }

  // Equation (16a) - Work done calculation
  static calculateWorkIncrement(
    state: State,
    prevState: State,
    deltaP: number
  ): number {
    const cushionSlip = this.cushionSlipVelocities(state)
    const prevCushionSlip = this.cushionSlipVelocities(prevState)
    return (deltaP * (cushionSlip.y + prevCushionSlip.y)) / 2
  }
}
