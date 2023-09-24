import { Ball } from "../ball"
import { TableGeometry } from "../../view/tablegeometry"
import { rotateApplyUnrotate } from "./physics"
import { Vector3 } from "three"
import { PocketGeometry } from "../../view/pocketgeometry"

export class Cushion {
  /**
   * Modify ball state reflecting in cushion if it impacts in time t.
   * Returns impact speed else undefined.
   *
   * Knuckle impacts are not part of this and handled elsewhere.
   */
  static bounceAny(
    ball: Ball,
    t: number,
    hasPockets: boolean = true
  ): number | undefined {
    const futurePosition = ball.futurePosition(t)

    if (Cushion.willBounceLong(futurePosition, hasPockets)) {
      const dir =
        futurePosition.y > TableGeometry.tableY ? -Math.PI / 2 : Math.PI / 2
      return Cushion.bounceIn(dir, ball)
    }

    if (Cushion.willBounceShort(futurePosition, hasPockets)) {
      const dir = futurePosition.x > TableGeometry.tableX ? 0 : Math.PI
      return Cushion.bounceIn(dir, ball)
    }

    return undefined
  }

  static willBounceShort(futurePosition, hasPockets) {
    if (!hasPockets) {
      return Cushion.willBounceShortSegment(
        TableGeometry.Y,
        -TableGeometry.Y,
        futurePosition
      )
    }
    return Cushion.willBounceShortSegment(
      PocketGeometry.pockets.pocketNW.knuckleSW.pos.y,
      PocketGeometry.pockets.pocketSW.knuckleNW.pos.y,
      futurePosition
    )
  }

  static willBounceLong(futurePosition, hasPockets) {
    if (!hasPockets) {
      return Cushion.willBounceLongSegment(
        -TableGeometry.X,
        TableGeometry.X,
        futurePosition
      )
    }
    return (
      Cushion.willBounceLongSegment(
        PocketGeometry.pockets.pocketNW.knuckleNE.pos.x,
        PocketGeometry.pockets.pocketN.knuckleNW.pos.x,
        futurePosition
      ) ||
      Cushion.willBounceLongSegment(
        PocketGeometry.pockets.pocketN.knuckleNE.pos.x,
        PocketGeometry.pockets.pocketNE.knuckleNW.pos.x,
        futurePosition
      )
    )
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
    const delta = rotateApplyUnrotate(rotation, ball.vel, ball.rvel)
    ball.vel.add(delta.v)
    ball.rvel.add(delta.w)
    return delta.v.length()
  }
}
