import { Vector3 } from "three";
import { Ball } from "../model/ball";
import { up, zero } from "../utils/utils";
import { Collision } from "../model/physics/collision";

export class CollisionThrowPlot {

  public static readonly R: number = 0.029; // ball radius in meters

  // Friction parameters
  private static readonly a: number = 0.01; // Minimum friction coefficient
  private static readonly b: number = 0.108;  // Range of friction variation
  private static readonly c: number = 1.088;  // Decay rate

  private readonly log;
  constructor(log: (...args: any[]) => void = () => { }) {
    this.log = log
  }

  private dynamicFriction(vRel: number): number {
    return CollisionThrowPlot.a + CollisionThrowPlot.b * Math.exp(-CollisionThrowPlot.c * vRel);
  }


  protected relativeVelocity(v: number, ωx: number, ωz: number, ϕ: number): number {
    return Math.sqrt(
      Math.pow(v * Math.sin(ϕ) - ωz * CollisionThrowPlot.R, 2) +
      Math.pow(Math.cos(ϕ) * ωx * CollisionThrowPlot.R, 2)
    );
  }


  public throwAngle(v: number, ωx: number, ωz: number, ϕ: number): number {
    const vRel = this.relativeVelocity(v, ωx, ωz, ϕ);
    const μ = this.dynamicFriction(vRel);
    const numerator = Math.min((μ * v * Math.cos(ϕ)) / vRel, 1 / 7) * (v * Math.sin(ϕ) - CollisionThrowPlot.R * ωz);
    const denominator = v * Math.cos(ϕ);
    this.log(`inputs:v=${v}, ωx=${ωx}, ωz=${ωz}, ϕ=${ϕ}`)
    this.log(`   v * Math.sin(ϕ) =${(v * Math.sin(ϕ))}`)
    this.log(`   CollisionThrow.R * ωz =${(CollisionThrowPlot.R * ωz)}`)
    this.log(`   Math.min((μ * v * Math.cos(ϕ)) / vRel, 1 / 7) =${Math.min((μ * v * Math.cos(ϕ)) / vRel, 1 / 7)}`)
    this.log(`   (v * Math.sin(ϕ) - CollisionThrow.R * ωz) =${(v * Math.sin(ϕ) - CollisionThrowPlot.R * ωz)}`)
    this.log("")
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

    const straight = new Vector3(0, 2 * CollisionThrowPlot.R)
    const bpos = straight.applyAxisAngle(up, ϕ)
    const b = new Ball(bpos);

    //this.log("---original---")
    //let result = this.throwAngle(v, ωx, ωz, ϕ)
    //this.log("")
    //this.log("---new code")
    const target:string = "plot"
    if (target == "actual") {
      Collision.model.updateVelocities(a, b)
      return Math.atan2(-Collision.model.tangentialImpulse, Collision.model.normalImpulse)
    }
    return this.updateVelocities(a, b)
  }

  private updateVelocities(a: Ball, b: Ball) {

    const ab = b.pos.clone().sub(a.pos).normalize();
    const abTangent = new Vector3(-ab.y, ab.x, 0);

    const R: number = 0.029
    const vPoint = a.vel.clone().sub(b.vel).add(
      ab.clone().multiplyScalar(-R).cross(a.rvel).sub(
        ab.clone().multiplyScalar(R).cross(b.rvel)
      )
    );

    const vRelNormalMag = ab.dot(vPoint);
    const vRel = vPoint.addScaledVector(ab, -vRelNormalMag)
    const vRelMag = vRel.length();
    const vRelTangential = abTangent.dot(vRel); // slip velocity perpendicular to line of impact

    const μ = this.dynamicFriction(vRelMag);

    let normalImpulse = vRelNormalMag;
    let tangentialImpulse =
      Math.min((μ * vRelNormalMag) / vRelMag, 1 / 7) * (-vRelTangential)

    let throwAngle = Math.atan2(tangentialImpulse, normalImpulse)

    this.log("vRelMag =", vRelMag);
    this.log("μ =", μ);
    this.log("tangentialImpulse (numerator)=", tangentialImpulse);
    this.log("normalImpulse (denominator)=", normalImpulse);
    this.log("throwAngle =", throwAngle);
    this.log("")
    this.log(`Math.min((μ * vRelNormalMag) / vRelMag, 1 / 7) = ${Math.min((μ * vRelNormalMag) / vRelMag, 1 / 7)}`)
    this.log(`(-vRelMag * Math.sign(vRelTangential)) = ${(-vRelMag * Math.sign(vRelTangential))}`)
    this.log("vRelNormalMag =", vRelNormalMag);
    this.log("vRelTangential =", vRelTangential);

    return throwAngle;
  }

}
