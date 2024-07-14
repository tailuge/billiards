import { Ball, State } from "../ball"
import { Vector3 } from "three"
import { R, g } from "./constants"
import { up, upCross, zero } from "../../utils/utils"

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
    const xypos = ball.pos.clone().setZ(0)
    const distToCentre = xypos.distanceTo(this.pos)
    if (distToCentre > this.radius - R) {
      const toCentre = this.pos.clone().sub(ball.pos).normalize().setZ(0)
      if (z > -R / 2) {
        ball.vel.addScaledVector(toCentre, R * 7 * t * g)
        ball.rvel.addScaledVector(upCross(toCentre), 7 * t * g)
      }
      if (ball.vel.dot(toCentre) < 0) {
        ball.ballmesh.trace.forceTrace(ball.pos)
        ball.vel.x = (toCentre.x * ball.vel.length()) / 2
        ball.vel.y = (toCentre.y * ball.vel.length()) / 2
      }
    }

    const restingDepth = this.restingDepth(ball)
    if (z < restingDepth && ball.rvel.length() !== 0) {
      ball.pos.z = restingDepth
      ball.vel.z = -R / 10
      ball.rvel.copy(zero)
    }

    if (z < restingDepth - R) {
      ball.pos.z = restingDepth - R
      ball.setStationary()
      ball.state = State.InPocket
    }
  }

  private restingDepth(ball) {
    return -3 * R - (R * ball.id) / 4
  }
  static findPocket(pocketCenters, ball: Ball, t: number) {
    const futurePosition = ball.futurePosition(t)
    return pocketCenters.find((p) => Pocket.willFall(p, futurePosition))
  }
}
