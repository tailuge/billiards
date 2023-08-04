import { Ball } from "../ball"
import { TableGeometry } from "../../view/tablegeometry"
import { rotateApplyUnrotate } from "./physics"
import { Vector3 } from "three"

export class Cushion {
  static willBounce(ball: Ball, t: number): boolean {
    const futurePosition = ball.futurePosition(t)

    if (
      Math.abs(futurePosition.y) < TableGeometry.tableY &&
      Math.abs(futurePosition.x) < TableGeometry.tableX
    ) {
      return false
    }

    return (
      Cushion.willBounceLongSegment(
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
      )
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
    const futurePosition = ball.futurePosition(t)
    if (futurePosition.x > TableGeometry.tableX) {
      return Cushion.bounceIn(0, ball)
    }
    if (futurePosition.x < -TableGeometry.tableX) {
      return Cushion.bounceIn(Math.PI, ball)
    }
    if (futurePosition.y > TableGeometry.tableY) {
      return Cushion.bounceIn(-Math.PI / 2, ball)
    }
    if (futurePosition.y < -TableGeometry.tableY) {
      return Cushion.bounceIn(Math.PI / 2, ball)
    }

    return null;
  }

  private static bounceIn(rotation, ball) {
    const dv = new Vector3()
    const dw = new Vector3()

    rotateApplyUnrotate(rotation, ball.vel, ball.rvel, dv, dw)
    ball.vel.add(dv)
    ball.rvel.add(dw)
    return dv.length()
  }
}
