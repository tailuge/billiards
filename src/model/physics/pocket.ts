import { Ball, State } from "../ball"
import { Vector3 } from "three"
import { g } from "./constants"

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

  static findPocket(pocketCenters, ball: Ball, t: number) {
    const futurePosition = ball.futurePosition(t)
    return pocketCenters.find((p) => Pocket.willFall(p, futurePosition))
  }
}
