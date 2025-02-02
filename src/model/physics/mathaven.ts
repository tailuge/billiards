import { atan2, cos, pow, sin, sqrt } from "../../utils/utils"
import { cosθ, sinθ } from "./constants"

export class Mathaven {
  // work done
  P: number = 0
  WzI: number = 0

  // centroid velocity
  vx: number
  vy: number

  // angular velocity
  ωx: number
  ωy: number
  ωz: number

  // slip speed and angles at I and C
  s: number
  φ: number
  sʹ: number
  φʹ: number

  i: number = 0
  N = 100

  // physical constants
  M: number
  R: number
  μs: number
  μw: number
  ee: number

  constructor(M, R, ee, μs, μw) {
    this.M = M
    this.R = R
    this.ee = ee
    this.μs = μs
    this.μw = μw
  }

  private updateSlipSpeedsAndAngles(): void {
    const R = this.R

    // Calculate velocities at the cushion (I)
    const v_xI = this.vx + this.ωy * R * sinθ - this.ωz * R * cosθ
    const v_yI = -this.vy * sinθ + this.ωx * R

    // Calculate velocities at the table (C)
    const v_xC = this.vx - this.ωy * R
    const v_yC = this.vy + this.ωx * R

    // Update slip speeds and angles at the cushion (I)
    this.s = sqrt(pow(v_xI, 2) + pow(v_yI, 2))
    this.φ = atan2(v_yI, v_xI)
    if (this.φ < 0) {
      this.φ += 2 * Math.PI
    }
    // Update slip speeds and angles at the table (C)
    this.sʹ = sqrt(pow(v_xC, 2) + pow(v_yC, 2))
    this.φʹ = atan2(v_yC, v_xC)
    if (this.φʹ < 0) {
      this.φʹ += 2 * Math.PI
    }
  }

  public compressionPhase(): void {
    const ΔP = Math.max((this.M * this.vy) / this.N, 0.001)
    while (this.vy > 0) {
      this.updateSingleStep(ΔP)
    }
  }

  public restitutionPhase(targetWorkRebound: number): void {
    const ΔP = Math.max(targetWorkRebound / this.N, 0.001)
    this.WzI = 0
    while (this.WzI < targetWorkRebound) {
      this.updateSingleStep(ΔP)
    }
  }

  protected updateSingleStep(ΔP: number): void {
    this.updateSlipSpeedsAndAngles()
    this.updateVelocity(ΔP)
    this.updateAngularVelocity(ΔP)
    this.updateWorkDone(ΔP)
    if (this.i++ > 10 * this.N) {
      throw new Error("Solution not found")
    }
  }

  private updateVelocity(ΔP: number): void {
    const μs = this.μs
    const μw = this.μw
    const M = this.M

    // Update centroid velocity components
    this.vx -=
      (1 / M) *
      (μw * cos(this.φ) +
        μs * cos(this.φʹ) * (sinθ + μw * sin(this.φ) * cosθ)) *
      ΔP
    this.vy -=
      (1 / M) *
      (cosθ -
        μw * sinθ * sin(this.φ) +
        μs * sin(this.φʹ) * (sinθ + μw * sin(this.φ) * cosθ)) *
      ΔP
  }

  private updateAngularVelocity(ΔP: number): void {
    const μs = this.μs
    const μw = this.μw
    const M = this.M
    const R = this.R

    this.ωx +=
      -(5 / (2 * M * R)) *
      (μw * sin(this.φ) +
        μs * sin(this.φʹ) * (sinθ + μw * sin(this.φ) * cosθ)) *
      ΔP
    this.ωy +=
      -(5 / (2 * M * R)) *
      (μw * cos(this.φ) * sinθ -
        μs * cos(this.φʹ) * (sinθ + μw * sin(this.φ) * cosθ)) *
      ΔP
    this.ωz += (5 / (2 * M * R)) * (μw * cos(this.φ) * cosθ) * ΔP
  }

  private updateWorkDone(ΔP: number): void {
    const ΔWzI = ΔP * Math.abs(this.vy)
    this.WzI += ΔWzI
    this.P += ΔP
  }

  public solvePaper(v0: number, α: number, ω0S: number, ω0T: number) {
    this.solve(v0 * cos(α), v0 * sin(α), -ω0T * sin(α), ω0T * cos(α), ω0S)
  }

  public solve(vx, vy, ωx, ωy, ωz): void {
    this.vx = vx
    this.vy = vy
    this.ωx = ωx
    this.ωy = ωy
    this.ωz = ωz
    this.WzI = 0
    this.P = 0
    this.i = 0

    this.compressionPhase()
    const targetWorkRebound = this.ee * this.ee * this.WzI
    this.restitutionPhase(targetWorkRebound)
  }
}
