import { constants, Constants } from "./constants"
import { State } from "./state"

export class MathavenEquations {
  // Equation (12a) - Slip velocity at cushion along x-axis
  static calculateSlipVelocityX(state: State, constants: Constants): number {
    const { xG_dot, θy_dot, θz_dot } = state
    const { R, sinTheta, cosTheta } = constants
    return xG_dot + θy_dot * R * sinTheta - θz_dot * R * cosTheta
  }

  // Equation (12b) - Slip velocity at cushion along y-axis
  static calculateSlipVelocityY(state: State, constants: Constants): number {
    const { yG_dot, zG_dot, θx_dot } = state
    const { R, sinTheta, cosTheta } = constants
    return -yG_dot * sinTheta + zG_dot * cosTheta + θx_dot * R
  }

  // Equation (13a,b) - Slip velocities at table
  static calculateTableSlipVelocities(
    state: State,
    constants: Constants
  ): { x: number; y: number } {
    const { xG_dot, yG_dot, θx_dot, θy_dot } = state
    const { R } = constants
    return {
      x: xG_dot - θy_dot * R,
      y: yG_dot + θx_dot * R,
    }
  }

  // Calculate slip speeds and angles
  static calculateSlipParameters(
    state: State,
    constants: Constants
  ): {
    s: number
    sPrime: number
    phi: number
    phiPrime: number
  } {
    const slipX = this.calculateSlipVelocityX(state, constants)
    const slipY = this.calculateSlipVelocityY(state, constants)
    const tableSlip = this.calculateTableSlipVelocities(state, constants)

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
    const zI_curr = this.calculateSlipVelocityY(state, constants)
    const zI_prev = this.calculateSlipVelocityY(prevState, constants)
    return (deltaP * (zI_curr + zI_prev)) / 2
  }
}
