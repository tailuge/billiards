import { Ball, State } from "../model/ball"
import { TableGeometry } from "../view/tablegeometry"
import { R } from "../model/physics/constants"
import { Table } from "../model/table"
import { Rack } from "./rack"

export class Respot {
  static respot(ball: Ball, table: Table) {
    const positions = Rack.snookerColourPositions()
    positions.push(positions[ball.id - 1])
    positions.reverse()

    const placed = positions.some((p) => {
      if (!table.overlapsAny(p, ball)) {
        ball.pos.copy(p)
        ball.state = State.Stationary
        return true
      }
      return false
    })
    if (!placed) {
      Respot.respotBehind(positions[0], ball, table)
    }
    return ball
  }

  static respotBehind(targetpos, ball, table) {
    const pos = targetpos.clone()
    while (pos.x < TableGeometry.tableX && table.overlapsAny(pos, ball)) {
      pos.x += R / 8
    }
    while (pos.x > -TableGeometry.tableX && table.overlapsAny(pos, ball)) {
      pos.x -= R / 8
    }
    ball.pos.copy(pos)
    ball.state = State.Stationary
  }

  static closest(cueball: Ball, balls: Ball[]) {
    const onTable = balls
      .filter((ball) => ball.onTable())
      .filter((ball) => ball !== cueball)
    if (onTable.length === 0) {
      return
    }
    const distanceToCueBall = (b) => {
      return cueball.pos.distanceTo(b.pos)
    }
    return onTable.reduce(
      (a, b) => (distanceToCueBall(a) < distanceToCueBall(b) ? a : b),
      onTable[0]
    )
  }
}
