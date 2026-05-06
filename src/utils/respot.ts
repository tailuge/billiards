import { Ball, State } from "../model/ball"
import { TableGeometry } from "../view/tablegeometry"
import { R } from "../model/physics/constants"
import { Table } from "../model/table"
import { Rack } from "./rack"
import { Vector3 } from "three"

export class Respot {
  static snookerD(table: Table): Vector3 {
    const preferred = new Vector3(Rack.baulk, -Rack.sixth / 2.6, 0)
    if (!table.overlapsAny(preferred, table.cueball)) {
      return preferred
    }
    const step = R / 4
    const pos = new Vector3(Rack.baulk, -Rack.sixth, 0)
    while (pos.y <= Rack.sixth) {
      if (!table.overlapsAny(pos, table.cueball)) {
        return pos
      }
      pos.y += step
    }
    return pos
  }

  static nineBall(table: Table) {
    const nineBall = table.balls.find((b) => b.id === 9)
    if (!nineBall) return

    const footSpot = new Vector3(TableGeometry.tableX / 2, 0, 0)
    Respot.respotBehind(footSpot, nineBall, table)
  }

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
    return Respot.byDistance(cueball, balls, (a, b) => a < b)
  }

  static furthest(cueball: Ball, balls: Ball[]) {
    return Respot.byDistance(cueball, balls, (a, b) => a > b)
  }

  private static byDistance(cueball: Ball, balls: Ball[], prefer: (a: number, b: number) => boolean) {
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
      (a, b) => (prefer(distanceToCueBall(a), distanceToCueBall(b)) ? a : b),
      onTable[0]
    )
  }
}
