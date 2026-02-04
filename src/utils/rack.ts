import { Ball, State } from "../model/ball"
import { TableGeometry } from "../view/tablegeometry"
import { Vector3 } from "three"
import { roundVec, vec } from "./utils"
import { R } from "../model/physics/constants"
import { Table } from "../model/table"

export class Rack {
  static readonly noise = R * 0.0233
  static readonly gap = 2 * R + 2 * Rack.noise
  static readonly up = new Vector3(0, 0, -1)
  static readonly spot = new Vector3(-TableGeometry.X / 2, 0.0, 0)
  static readonly across = new Vector3(0, Rack.gap, 0)
  static readonly down = new Vector3(Rack.gap, 0, 0)
  static readonly diagonal = Rack.across
    .clone()
    .applyAxisAngle(Rack.up, (Math.PI * 1) / 3)

  static readonly BALL_COLORS = [
    "#FFFFFF", // 0: Cue Ball
    "#ffd900", // 1: Yellow
    "#0000FF", // 2: Blue
    "#FF0000", // 3: Red
    "#800080", // 4: Purple
    "#ff3300", // 5: Orange
    "#008000", // 6: Green
    "#600000", // 7: Maroon
    "#000000", // 8: Black
    "#FFFF00", // 9: Yellow (Striped)
    "#0000FF", // 10: Blue (Striped)
    "#FF0000", // 11: Red (Striped)
    "#800080", // 12: Purple (Striped)
    "#FF8000", // 13: Orange (Striped)
    "#008000", // 14: Green (Striped)
    "#600000", // 15: Maroon (Striped)
  ]
  private static jitter(pos) {
    return roundVec(
      pos
        .clone()
        .add(
          new Vector3(
            Rack.noise * (Math.random() - 0.5),
            Rack.noise * (Math.random() - 0.5),
            0
          )
        )
    )
  }

  static cueBall(pos, label?: number) {
    return new Ball(Rack.jitter(pos), 0xfaebd7, label)
  }

  static diamond() {
    const pos = new Vector3(TableGeometry.tableX / 2, 0, 0)
    const diamond: Ball[] = []
    const newball = (pos: Vector3, color: string, label: number) => {
      return new Ball(Rack.jitter(pos), color, label)
    }
    diamond.push(Rack.cueBall(Rack.spot))
    diamond.push(newball(pos, Rack.BALL_COLORS[1], 1)) // 1: Yellow
    pos.add(Rack.diagonal)
    diamond.push(newball(pos, Rack.BALL_COLORS[2], 2)) // 2: Blue
    pos.sub(Rack.across)
    diamond.push(newball(pos, Rack.BALL_COLORS[3], 3)) // 3: Red
    pos.add(Rack.diagonal)
    diamond.push(newball(pos, Rack.BALL_COLORS[4], 4)) // 4: Purple
    pos.sub(Rack.across)
    diamond.push(newball(pos, Rack.BALL_COLORS[5], 5)) // 5: Orange
    pos.addScaledVector(Rack.across, 2)
    diamond.push(newball(pos, Rack.BALL_COLORS[6], 6)) // 6: Green
    pos.add(Rack.diagonal).sub(Rack.across)
    diamond.push(newball(pos, Rack.BALL_COLORS[7], 7)) // 7: Maroon
    pos.sub(Rack.across)
    diamond.push(newball(pos, Rack.BALL_COLORS[8], 8)) // 8: Black
    pos.add(Rack.diagonal)
    diamond.push(newball(pos, Rack.BALL_COLORS[9], 9)) // 9: Yellow (Striped)

    // swap 9 ball to center
    const other = diamond[4].pos.clone()
    diamond[4].pos.copy(diamond[9].pos)
    diamond[9].pos.copy(other)
    return diamond
  }

  static triangle() {
    const tp = Rack.trianglePositions()
    const triangle: Ball[] = []
    triangle.push(Rack.cueBall(Rack.spot))

    tp.forEach((p, i) => {
      const label = i + 1
      triangle.push(new Ball(Rack.jitter(p), Rack.BALL_COLORS[label], label))
    })
    return triangle
  }

  static trianglePositions() {
    const triangle: Vector3[] = []
    const pos = new Vector3(TableGeometry.X / 2, 0, 0)
    triangle.push(vec(pos))
    // row 2
    pos.add(this.diagonal)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    // row 3
    pos.add(this.diagonal)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    pos.addScaledVector(this.across, 2)
    triangle.push(vec(pos))
    // row 4
    pos.add(this.diagonal)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    // row 5
    pos.add(this.diagonal).sub(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))

    return triangle
  }

  static rerack(key: Ball, table: Table) {
    const tp = Rack.trianglePositions()
    const first = tp.shift()!
    table.balls
      .filter((b) => b !== table.cueball)
      .filter((b) => b !== key)
      .forEach((b) => {
        b.pos.copy(Rack.jitter(tp.shift()))
        b.state = State.Stationary
      })
    if (table.overlapsAny(key.pos, key)) {
      key.pos.copy(first)
    }
    if (table.overlapsAny(table.cueball.pos)) {
      table.cueball.pos.copy(Rack.spot)
    }
  }

  static three() {
    const threeballs: Ball[] = []
    const dx = TableGeometry.X / 2
    const dy = TableGeometry.Y / 4
    threeballs.push(Rack.cueBall(Rack.jitter(new Vector3(-dx, -dy, 0)), 0)) // Ball 0: White
    threeballs.push(new Ball(Rack.jitter(new Vector3(-dx, 0, 0)), 0xe0de36, 1)) // Ball 1: Yellow
    threeballs.push(new Ball(Rack.jitter(new Vector3(dx, 0, 0)), 0xff0000, 2)) // Ball 2: Red
    return threeballs
  }

  static readonly sixth = (TableGeometry.Y * 2) / 6
  static readonly baulk = (-1.5 * TableGeometry.X * 2) / 5

  static snooker() {
    const balls: Ball[] = []
    const dy = TableGeometry.Y / 4
    balls.push(Rack.cueBall(Rack.jitter(new Vector3(Rack.baulk, -dy * 0.5, 0))))

    const colours = Rack.snookerColourPositions()
    balls.push(new Ball(Rack.jitter(colours[0]), 0xeede36))
    balls.push(new Ball(Rack.jitter(colours[1]), 0x0c9664))
    balls.push(new Ball(Rack.jitter(colours[2]), 0xbd723a))
    balls.push(new Ball(Rack.jitter(colours[3]), 0x0883ee))
    balls.push(new Ball(Rack.jitter(colours[4]), 0xffaacc))
    balls.push(new Ball(Rack.jitter(colours[5]), 0x010101))

    // change to 15 red balls
    const triangle = Rack.trianglePositions().slice(0, 15)
    triangle.forEach((p) => {
      balls.push(new Ball(Rack.jitter(p.add(Rack.down)), 0xee0000))
    })
    return balls
  }

  static snookerColourPositions() {
    const dx = TableGeometry.X / 2
    const black = TableGeometry.X - (TableGeometry.X * 2) / 11
    const positions: Vector3[] = []
    positions.push(new Vector3(Rack.baulk, -Rack.sixth, 0))
    positions.push(new Vector3(Rack.baulk, Rack.sixth, 0))
    positions.push(new Vector3(Rack.baulk, 0, 0))
    positions.push(new Vector3(0, 0, 0))
    positions.push(new Vector3(dx, 0, 0))
    positions.push(new Vector3(black, 0, 0))
    return positions
  }
}
