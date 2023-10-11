import { Ball, State } from "../ball"
import { MathUtils, Vector3 } from "three"
import { R, g } from "./constants"
import { up, zero } from "../../utils/utils"

export class Pocket {
  pos: Vector3
  radius: number

  constructor(pos, radius) {
    this.pos = pos
    this.radius = radius
  }

  private static willFall(pocket, futurePosition) {
    return futurePosition.distanceTo(pocket.pos) < pocket.radius
  }

  public fall(ball, t) {
    ball.vel.z = -g * t
    ball.state = State.Falling
    ball.pocket = this
    return ball.vel.length()
  }

  public updateFall(ball: Ball, t) {
    ball.vel.addScaledVector(up, -R * 10 * t * g)
    const z = ball.pos.z
    const distToCentre = ball.pos.distanceTo(this.pos)
    if (distToCentre > this.radius - R) {
      const toCentre = this.pos.clone().sub(ball.pos).normalize().setZ(0)
      if (z > -R / 2) {
        ball.vel.addScaledVector(toCentre, R * 7 * t * g)
      }
      if (ball.vel.dot(toCentre) < 0) {
        ball.ballmesh.trace.forceTrace(ball.pos)
        ball.vel.x = (toCentre.x * ball.vel.length()) / 2
        ball.vel.y = (toCentre.y * ball.vel.length()) / 2
      }
    }

    if (z < -3.5 * R) {
      ball.vel.z = -R / 4
      ball.rvel.copy(zero)
    }

    if (z < -4 * R) {
      ball.pos.z += MathUtils.randFloat(-R, R * 0.25)
      ball.setStationary()
      ball.state = State.InPocket
    }
  }

  static findPocket(pocketCenters, ball: Ball, t: number) {
    const futurePosition = ball.futurePosition(t)
    return pocketCenters.find((p) => Pocket.willFall(p, futurePosition))
  }
}
