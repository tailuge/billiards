export class CollisionThrow {

  protected relativeVelocity(v: number, ωx: number, ωz: number, ϕ: number): number {
    return Math.sqrt(
      Math.pow(v * Math.sin(ϕ) - ωz * CollisionThrow.R, 2) +
      Math.pow(v * Math.cos(ϕ) + ωx * CollisionThrow.R, 2)
    );
  }

  public throwAngle(v: number, ωx: number, ωz: number, ϕ: number): number {
    const vRel = this.relativeVelocity(v, ωx, ωz, ϕ);
    const μ = 0.06; // friction coefficient
    const vT = Math.min(μ * vRel, v * Math.cos(ϕ));
    const vN = v * Math.sin(ϕ);
    return Math.atan2(vT, vN);
  }

  static R: number = 0.029; // ball radius in meters
}
