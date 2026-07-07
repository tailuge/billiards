import { cos, sin, sqrt } from "../../utils/utils"
import { cosθ, sinθ } from "./constants"

export class Mathavan {
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
  sʹ: number
  cos_phi: number
  sin_phi: number
  cos_phi_prime: number
  sin_phi_prime: number

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
    this.s = sqrt(v_xI * v_xI + v_yI * v_yI)
    if (this.s > 1e-9) {
      this.cos_phi = v_xI / this.s
      this.sin_phi = v_yI / this.s
    } else {
      this.cos_phi = 0
      this.sin_phi = 0
    }

    // Update slip speeds and angles at the table (C)
    this.sʹ = sqrt(v_xC * v_xC + v_yC * v_yC)
    if (this.sʹ > 1e-9) {
      this.cos_phi_prime = v_xC / this.sʹ
      this.sin_phi_prime = v_yC / this.sʹ
    } else {
      this.cos_phi_prime = 0
      this.sin_phi_prime = 0
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
    const vyPrev = this.vy
    this.updateVelocity(ΔP)
    this.updateAngularVelocity(ΔP)
    this.updateWorkDone(ΔP, vyPrev)
    if (this.i++ > 10 * this.N) {
      throw new Error("Solution not found")
    }
  }

  private updateVelocity(ΔP: number): void {
    const μs = this.μs
    const μw = this.μw
    const invM = 1 / this.M

    const common = sinθ + μw * this.sin_phi * cosθ

    // Update centroid velocity components
    this.vx -=
      invM * (μw * this.cos_phi + μs * this.cos_phi_prime * common) * ΔP
    this.vy -=
      invM *
      (cosθ - μw * sinθ * this.sin_phi + μs * this.sin_phi_prime * common) *
      ΔP
  }

  private updateAngularVelocity(ΔP: number): void {
    const μs = this.μs
    const μw = this.μw
    const inv2MR5 = 5 / (2 * this.M * this.R)

    const common = sinθ + μw * this.sin_phi * cosθ

    this.ωx += -inv2MR5 * (μw * this.sin_phi + μs * this.sin_phi_prime * common) * ΔP
    this.ωy +=
      -inv2MR5 * (μw * this.cos_phi * sinθ - μs * this.cos_phi_prime * common) * ΔP
    this.ωz += inv2MR5 * (μw * this.cos_phi * cosθ) * ΔP
  }

  private updateWorkDone(ΔP: number, vyPrev: number): void {
    const ΔWzI = (ΔP / 2) * (Math.abs(vyPrev) + Math.abs(this.vy)) * cosθ
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
