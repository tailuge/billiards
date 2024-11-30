import { Vector3 } from "three";
import { Ball } from "../model/ball";
import { up, zero } from "../utils/utils";

export class CollisionThrow {

  public static R: number = 0.029; // ball radius in meters

  // Friction parameters
  private static a: number = 0.01; // Minimum friction coefficient
  private static b: number = 0.108;  // Range of friction variation
  private static c: number = 1.088;  // Decay rate


  private static dynamicFriction(vRel: number): number {
    return CollisionThrow.a + CollisionThrow.b * Math.exp(-CollisionThrow.c * vRel);
  }


  protected relativeVelocity(v: number, ωx: number, ωz: number, ϕ: number): number {
    return Math.sqrt(
      Math.pow(v * Math.sin(ϕ) - ωz * CollisionThrow.R, 2) +
      Math.pow(v * Math.cos(ϕ) + ωx * CollisionThrow.R, 2)
    );
  }


  public throwAngle(v: number, ωx: number, ωz: number, ϕ: number): number {
    const vRel = this.relativeVelocity(v, ωx, ωz, ϕ);
    const μ = CollisionThrow.dynamicFriction(vRel);
    const numerator = Math.min((μ * v * Math.cos(ϕ)) / vRel, 1 / 7) * (v * Math.sin(ϕ) - CollisionThrow.R * ωz);
    const denominator = v * Math.cos(ϕ);
    return Math.atan2(numerator, denominator);
  }

  public plot(v: number, ωx: number, ωz: number, ϕ: number) {
    // assume balls in contact along y axis 
    // cue ball a is travelling +y only
    // object ball positioned so that collision angle is phi

    const a = new Ball(zero)
    a.vel.copy(new Vector3(0, v, 0))
    a.rvel.copy(new Vector3(ωx, 0, ωz))

    const straight = new Vector3(0, 2 * CollisionThrow.R)
    const bpos = straight.applyAxisAngle(up, ϕ)
    const b = new Ball(bpos);


    //    console.log(a.pos,b.pos)

     CollisionThrow.updateVelocities(a, b)
     return this.throwAngle(v, ωx, ωz, ϕ)
  }
  private static updateVelocities(a: Ball, b: Ball) {
    // Unit vector along the line of centers    
    const ab = b.pos.clone().sub(a.pos).normalize();
    // Perpendicular tangent vector
    const abTangent = new Vector3(-ab.y, ab.x, 0);

    const R: number = 0.029
    const m = 0.3

    // Relative velocity at contact point
    const vRel = a.vel.clone().sub(b.vel).add(
      ab.clone().multiplyScalar(-R).cross(a.rvel).sub(
        ab.clone().multiplyScalar(R).cross(b.rvel)
      )
    );

    // Decompose relative velocity into normal and tangential components
    const vRelNormal = ab.dot(vRel);
    const vRelTangential = abTangent.dot(vRel);


    // Compute the impulse along the line of centers
    const Jn = (2 * m * vRelNormal) / (1 / m + 1 / m);


    const μ = CollisionThrow.dynamicFriction(vRelTangential);

    const Ft_max = μ * Math.abs(Jn);

    // Compute impulse in the tangential direction considering the ft max
    const Jt = Math.min(Ft_max, Math.abs(vRelTangential)) * Math.sign(vRelTangential);

    return Math.atan2(Math.abs(Jt), Math.abs(Jn));
  }

}
