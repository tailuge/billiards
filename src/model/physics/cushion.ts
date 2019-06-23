import { Ball } from "../ball"
import { TableGeometry } from "../../view/tablegeometry"
import { rotateApplyUnrotate, bounceWithoutSlipX } from "./physics"
import { Vector3 } from "three"

export class Cushion {
  static elasticity = 0.8

  static willBounce(ball: Ball, t: number): boolean {
    let futurePosition = ball.futurePosition(t)

    return (
      ball.onTable() &&
      (Cushion.willBounceLongSegment(
        TableGeometry.pockets.pocketNW.knuckleNE.pos.x,
        TableGeometry.pockets.pocketN.knuckleNW.pos.x,
        futurePosition
      ) ||
        Cushion.willBounceLongSegment(
          TableGeometry.pockets.pocketN.knuckleNE.pos.x,
          TableGeometry.pockets.pocketNE.knuckleNW.pos.x,
          futurePosition
        ) ||
        Cushion.willBounceShortSegment(
          TableGeometry.pockets.pocketNW.knuckleSW.pos.y,
          TableGeometry.pockets.pocketSW.knuckleNW.pos.y,
          futurePosition
        ))
    )
  }

  private static willBounceLongSegment(
    left: number,
    right: number,
    futurePosition: Vector3
  ): boolean {
    return (
      futurePosition.x > left &&
      futurePosition.x < right &&
      Math.abs(futurePosition.y) > TableGeometry.tableY
    )
  }

  private static willBounceShortSegment(
    top: number,
    bottom: number,
    futurePosition: Vector3
  ): boolean {
    return (
      futurePosition.y > bottom &&
      futurePosition.y < top &&
      Math.abs(futurePosition.x) > TableGeometry.tableX
    )
  }

  static bounce(ball: Ball, t: number) {
    let futurePosition = ball.futurePosition(t)
    if (futurePosition.x > TableGeometry.tableX) {
      Cushion.bounceIn(0, ball)
    }
    if (futurePosition.x < -TableGeometry.tableX) {
      Cushion.bounceIn(Math.PI, ball)
    }
    if (futurePosition.y > TableGeometry.tableY) {
      Cushion.bounceIn(-Math.PI / 2, ball)
    }
    if (futurePosition.y < -TableGeometry.tableY) {
      Cushion.bounceIn(Math.PI / 2, ball)
    }
  }

  private static bounceIn(rotation, ball) {
    let dv = new Vector3()
    let dw = new Vector3()
    rotateApplyUnrotate(
      rotation,
      ball.vel,
      ball.rvel,
      dv,
      dw,
      bounceWithoutSlipX
    )
    ball.vel.add(dv)
    ball.rvel.add(dw)
  }
}
