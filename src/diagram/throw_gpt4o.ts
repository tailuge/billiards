import { Vector3 } from "three";
import { Ball } from "../model/ball";
import { up, zero } from "../utils/utils";

export class CollisionThrow {

  public static R: number = 0.029; // ball radius in meters

  // Friction parameters
  private static a: number = 0.01; // Minimum friction coefficient
  private static b: number = 0.108;  // Range of friction variation
  private static c: number = 1.088;  // Decay rate

  private log;
  constructor(log: (...args: any[]) => void = () => { }) {
    this.log = log
  }

  private dynamicFriction(vRel: number): number {
    return CollisionThrow.a + CollisionThrow.b * Math.exp(-CollisionThrow.c * vRel);
  }


  protected relativeVelocity(v: number, ωx: number, ωz: number, ϕ: number): number {
    return Math.sqrt(
      Math.pow(v * Math.sin(ϕ) - ωz * CollisionThrow.R, 2) +
      Math.pow(Math.cos(ϕ) * ωx * CollisionThrow.R, 2)
    );
  }


  public throwAngle(v: number, ωx: number, ωz: number, ϕ: number): number {
    const vRel = this.relativeVelocity(v, ωx, ωz, ϕ);
    const μ = this.dynamicFriction(vRel);
    const numerator = Math.min((μ * v * Math.cos(ϕ)) / vRel, 1 / 7) * (v * Math.sin(ϕ) - CollisionThrow.R * ωz);
    const denominator = v * Math.cos(ϕ);
    this.log(`(v * Math.sin(ϕ) - CollisionThrow.R * ωz)=${(v * Math.sin(ϕ) - CollisionThrow.R * ωz)}`)
    this.log(`inputs:v=${v}, ωx=${ωx}, ωz=${ωz}, ϕ=${ϕ}`)
    this.log("vRel = ", vRel)
    this.log("μ = ", μ)
    this.log("numerator = ", numerator)
    this.log("denominator = ", denominator)
    this.log("throw = ", Math.atan2(numerator, denominator))

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

    this.log("---original---")
    let result = this.throwAngle(v, ωx, ωz, ϕ)
    this.log("---new code")
    this.updateVelocities(a, b)
    return result
  }

  private updateVelocities(a: Ball, b: Ball) {

    const ab = b.pos.clone().sub(a.pos).normalize();
    const abTangent = new Vector3(-ab.y, ab.x, 0);

    const R: number = 0.029

    const vRel = a.vel.clone().sub(b.vel).add(
      ab.clone().multiplyScalar(-R).cross(a.rvel).sub(
        ab.clone().multiplyScalar(R).cross(b.rvel)
      )
    );

    const vRelNormal = ab.dot(vRel);
    const vRelTangential = abTangent.dot(vRel); // slip velocity tangential to impact
    const vRelz = vRel.z  // slip velocity in z direction

    const vRelMag = Math.sqrt(Math.pow(vRelz, 2) + Math.pow(vRelTangential, 2));
    const μ = this.dynamicFriction(vRelMag);

    const normalImpulse = vRelNormal;
    const tangentialImpulse =
      Math.min((μ * vRelNormal) / vRelMag, 1 / 7) * (-vRelMag * Math.sign(vRelTangential))

    let throwAngle = (Math.atan2(tangentialImpulse, normalImpulse) + 2 * Math.PI) % (2 * Math.PI);

    this.log(`a.vel = (${a.vel.x},${a.vel.y},0)`)
    this.log(`ab = (${ab.x},${ab.y},0)`)
    this.log("vRel.length() =", vRel.length());
    this.log("vRelMag =", vRelMag);
    this.log("vRelNormal =", vRelNormal);
    this.log("vRelTangential =", vRelTangential);
    this.log("μ =", μ);
    this.log("tangentialImpulse (numerator)=", tangentialImpulse);
    this.log("normalImpulse (denominator)=", normalImpulse);
    this.log("throwAngle =", throwAngle);

    return throwAngle;
  }

}
