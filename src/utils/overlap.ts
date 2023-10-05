import { Line3, Vector3 } from "three"
import { norm } from "./utils"
import { Ball } from "../model/ball"
import { R } from "../model/physics/constants"
import { TableGeometry } from "../view/tablegeometry"

export class Overlap {
  line = new Line3()
  balls: Ball[]

  constructor(balls) {
    this.balls = balls
  }

  getFirst(cueball: Ball, direction: Vector3) {
    this.line.set(
      cueball.pos,
      norm(direction)
        .multiplyScalar(TableGeometry.X * 4)
        .add(cueball.pos)
    )
    const res = new Vector3()
    const projected = this.balls.map((ball) => {
      this.line.closestPointToPoint(ball.pos, true, res)
      return {
        ball,
        perpendicular: res.distanceTo(ball.pos),
        distance: res.distanceTo(cueball.pos),
      }
    })

    const inPath = projected
      .filter((info) => info.perpendicular < 2 * R)
      .filter((info) => info.ball !== cueball)

    return inPath.reduce(
      (best, current) => (best.distance < current.distance ? best : current),
      inPath[0]
    )
  }

  getOverlapOffset(cueball: Ball, direction: Vector3) {
    const closest = this.getFirst(cueball, direction)
    if (!closest) {
      return undefined
    }
    const centers = closest.ball.pos.clone().sub(cueball.pos)
    const overlap =
      (closest.perpendicular * Math.sign(centers.cross(direction).z)) / R
    return { ball: closest.ball, overlap }
  }
}
