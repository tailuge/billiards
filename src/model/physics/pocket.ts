import { Ball, State } from "../ball"
import { MathUtils, Vector3 } from "three"
import { R, g } from "./constants"
import { up } from "../../utils/utils"

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

  public updateFall(ball, t) {
    ball.vel.addScaledVector(up, ((-R * 10) / 0.5) * t * g)
    if (ball.pos.z < (-R * 2) / 0.5) {
      ball.pos.z += MathUtils.randFloat(-R, R * 0.25)
      ball.setStationary()
      ball.state = State.InPocket
    }

    if (ball.pos.distanceTo(this.pos) > this.radius - R) {
      const toCentre = this.pos
        .clone()
        .sub(ball.pos)
        .normalize()
        .multiplyScalar(ball.vel.length() * R)
      if (ball.vel.dot(toCentre) < 0) {
        ball.vel.x = toCentre.x
        ball.vel.y = toCentre.y
      }
    }
  }

  static findPocket(pocketCenters, ball: Ball, t: number) {
    const futurePosition = ball.futurePosition(t)
    return pocketCenters.find((p) => Pocket.willFall(p, futurePosition))
  }
}
