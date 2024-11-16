import { M, R, ee, μs, μw, sinθ, cosθ, N } from "./constants"

export class Mathaven {

  P: number = 0;
  WzI: number = 0;

  // centroid velocity
  vx: number;
  vy: number;

  //angualr velocity
  ωx: number;
  ωy: number;
  ωz: number;

  // slip speed and angles at I and C
  s: number;
  φ: number;
  sʹ: number;
  φʹ: number;

  constructor(v0: number, α: number, ω0S: number, ω0T: number) {
    this.vx = v0 * Math.cos(α);
    this.vy = v0 * Math.sin(α);
    this.ωx = -ω0S * Math.sin(α);
    this.ωy = ω0S * Math.cos(α);
    this.ωz = ω0T;
    // initialise φ φ' and s s' based on the initial conditions
  }

  public compressionPhase() {
    // Call updateSingleStep repeatedly until compression end condition
  }

  public restitutionPhase(targetWorkRebound): void {
    // Call updateSingleStep repeatedly until restitution end condition
  }

  private updateSingleStep(ΔP): void {
    // Common function to update velocities, angular velocities, and work done
    this.updateVelocity(ΔP);
    this.updateAngularVelocity(ΔP);
    this.updateWorkDone(ΔP);
  }

  private updateVelocity(ΔP) {
    // Implement velocity updates based on equations 17a and 17b
  }

  private updateAngularVelocity(ΔP) {
    // Implement angular velocity updates based on equations 14d, 14e, and 14f
  }

  private updateWorkDone(ΔP: number): void {
    // Compute work done based on equation 16a
  }

  public solve() {
    // compression phase followed by restitution phase
  }
}