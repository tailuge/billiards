export class CollisionThrow {
    protected relativeVelocity(v: number, ωx: number, ωz: number, ϕ: number, R: number): number {
      return v * Math.sin(ϕ) + R * ωz - (R * ωx) ** 2 * Math.cos(ϕ);
    }
  
    public throwAngle(v: number, ωx: number, ωz: number, ϕ: number, R: number): number {
      const v_rel = this.relativeVelocity(v, ωx, ωz, ϕ, R);
      const throwAngle = v_rel === 0 ? 0 : Math.atan(v_rel / (v * Math.cos(ϕ)));
      return Math.max(throwAngle, 0);
    }
  }