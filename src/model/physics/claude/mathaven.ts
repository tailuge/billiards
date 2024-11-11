import { State } from "./state"
import { R, sinTheta, cosTheta } from "./constants"

export class MathavenEquations {
  // Equation (12a) - Slip velocity at cushion along x-axis at I
  static cushionSlipVelocityX(state: State): number {
    const { xG_dot, θy_dot, θz_dot } = state

    return xG_dot + θy_dot * R * sinTheta - θz_dot * R * cosTheta
  }

  // Equation (12b) - Slip velocity at cushion along y-axis at I
  static cushionSlipVelocityY(state: State): number {
    const { yG_dot, zG_dot, θx_dot } = state

    return -yG_dot * sinTheta + zG_dot * cosTheta + θx_dot * R
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
    const slipX = this.cushionSlipVelocityX(state)
    const slipY = this.cushionSlipVelocityY(state)
    const tableSlip = this.tableSlipVelocities(state)

    const s = Math.sqrt(slipX * slipX + slipY * slipY)
    const sPrime = Math.sqrt(
      tableSlip.x * tableSlip.x + tableSlip.y * tableSlip.y
    )

    const phi = Math.atan2(slipY, slipX)
    const phiPrime = Math.atan2(tableSlip.y, tableSlip.x)

    return { s, sPrime, phi, phiPrime }
  }

  // Equation (16a) - Work done calculation
  static calculateWorkIncrement(
    state: State,
    prevState: State,
    deltaP: number
  ): number {
    const zI_curr = this.cushionSlipVelocityY(state)
    const zI_prev = this.cushionSlipVelocityY(prevState)
    return (deltaP * (zI_curr + zI_prev)) / 2
  }
}
