import { Ball } from "../ball"
import { TableGeometry } from "../../view/tablegeometry"
import { rotateApplyUnrotate } from "./physics"
import { Vector3 } from "three"

export class Cushion {
  /**
   * Modify ball state reflecting in cushion if it impacts in time t.
   * Returns impact speed else undefined.
   *
   * Knuckle impacts are not part of this and handled elsewhere.
   */
  static bounceAny(ball: Ball, t: number): number | undefined {
    const futurePosition = ball.futurePosition(t)

    const willBounceLong =
      Cushion.willBounceLongSegment(
        TableGeometry.pockets.pocketNW.knuckleNE.pos.x,
        TableGeometry.pockets.pocketN.knuckleNW.pos.x,
        futurePosition
      ) ||
      Cushion.willBounceLongSegment(
        TableGeometry.pockets.pocketN.knuckleNE.pos.x,
        TableGeometry.pockets.pocketNE.knuckleNW.pos.x,
        futurePosition
      )

    if (willBounceLong) {
      const dir =
        futurePosition.y > TableGeometry.tableY ? -Math.PI / 2 : Math.PI / 2
      return Cushion.bounceIn(dir, ball)
    }

    const willBounceShort = Cushion.willBounceShortSegment(
      TableGeometry.pockets.pocketNW.knuckleSW.pos.y,
      TableGeometry.pockets.pocketSW.knuckleNW.pos.y,
      futurePosition
    )

    if (willBounceShort) {
      const dir = futurePosition.x > TableGeometry.tableX ? 0 : Math.PI
      return Cushion.bounceIn(dir, ball)
    }

    return undefined
  }

  /**
   * Long Cushion refers to longest dimention of table (skipping middle pocket),
   * in this model that is oriented along the X axis.
   */
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

  private static bounceIn(rotation, ball) {
    const dv = new Vector3()
    const dw = new Vector3()

    rotateApplyUnrotate(rotation, ball.vel, ball.rvel, dv, dw)
    ball.vel.add(dv)
    ball.rvel.add(dw)
    return dv.length()
  }
}
