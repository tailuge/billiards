import { Ball, State } from "../model/ball"
import { SnookerConfig } from "./snookerconfig"
import { TableGeometry } from "../view/tablegeometry"
import { PocketGeometry } from "../view/pocketgeometry"
import { Vector3 } from "three"
import { roundVec, vec } from "./three-utils"
import { R } from "../model/physics/constants"
import { Table } from "../model/table"

export class Rack {
  static readonly noise = Math.fround(R * 0.023 + 0.0015 * Math.random())
  static readonly gap = 2 * R + 2 * Rack.noise
  static readonly up = new Vector3(0, 0, -1)
  static readonly spot = new Vector3(-TableGeometry.X / 2, 0, 0)
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

  static swapBallPositions(b1: Ball, b2: Ball) {
    const temp = b1.pos.clone()
    b1.pos.copy(b2.pos)
    b2.pos.copy(temp)
  }

  static diamond() {
    const pos = new Vector3(TableGeometry.tableX / 2, 0, 0)
    const diamond: Ball[] = []
    const newball = (pos: Vector3, color: string, label: number) => {
      return new Ball(Rack.jitter(pos), color, label)
    }
    diamond.push(Rack.cueBall(Rack.spot), newball(pos, Rack.BALL_COLORS[1], 1)) // 1: Yellow
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
    Rack.swapBallPositions(diamond[4], diamond[9])
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
    Rack.swapBallPositions(triangle[4], triangle[9])
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
    const dx = TableGeometry.X / 2
    const dy = TableGeometry.Y / 4
    const threeballs: Ball[] = [
      Rack.cueBall(Rack.jitter(new Vector3(-dx, -dy, 0))), // Ball 0: White
      new Ball(Rack.jitter(new Vector3(-dx, 0, 0)), 0xe0de36), // Ball 1: Yellow
      new Ball(Rack.jitter(new Vector3(dx, 0, 0)), 0xff0000), // Ball 2: Red
    ]
    return threeballs
  }

  static readonly sixth = (TableGeometry.Y * 2) / 6
  static readonly baulk = (-1.5 * TableGeometry.X * 2) / 5

  static snooker() {
    const balls: Ball[] = []
    const dy = TableGeometry.Y / 4
    balls.push(Rack.cueBall(Rack.jitter(new Vector3(Rack.baulk, -dy * 0.5, 0))))

    const colours = Rack.snookerColourPositions()
    balls.push(
      new Ball(Rack.jitter(colours[0]), 0xeede36),
      new Ball(Rack.jitter(colours[1]), 0x0c9664),
      new Ball(Rack.jitter(colours[2]), 0xbd723a),
      new Ball(Rack.jitter(colours[3]), 0x0883ee),
      new Ball(Rack.jitter(colours[4]), 0xffaacc),
      new Ball(Rack.jitter(colours[5]), 0x010101)
    )

    const redsToPlay = Math.min(SnookerConfig.reds, 15)
    const triangle = Rack.trianglePositions().slice(0, 15)
    const pocketPos = PocketGeometry.pockets.pocketS.pocket.pos
    triangle.forEach((p, i) => {
      const ball = new Ball(Rack.jitter(p.add(Rack.down)), 0xee0000)
      if (i >= redsToPlay) {
        ball.pos.copy(pocketPos)
        ball.pos.setZ(-8.5 * R)
        ball.state = State.InPocket
      }
      balls.push(ball)
    })
    return balls
  }

  static snookerColourPositions() {
    const dx = TableGeometry.X / 2
    const black = TableGeometry.X - (TableGeometry.X * 2) / 11
    const positions: Vector3[] = [
      new Vector3(Rack.baulk, -Rack.sixth, 0),
      new Vector3(Rack.baulk, Rack.sixth, 0),
      new Vector3(Rack.baulk, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(dx, 0, 0),
      new Vector3(black, 0, 0),
    ]
    return positions
  }

  static eightBall() {
    const triangle = this.triangle()
    Rack.swapBallPositions(triangle[4], triangle[9])
    Rack.swapBallPositions(triangle[4], triangle[8])
    Rack.swapBallPositions(triangle[3], triangle[11])
    Rack.swapBallPositions(triangle[6], triangle[14])
    return triangle
  }

  static fromInitParam(balls: Ball[]): Ball[] {
    const params = new URLSearchParams(globalThis.location?.search)
    if (!params.has("practice") || !params.has("init")) {
      return balls
    }
    const data: number[] = JSON.parse(params.get("init")!)
    balls.forEach((b, i) => {
      b.pos.x = data[i * 2]
      b.pos.y = data[i * 2 + 1]
      b.pos.z = 0
    })
    return balls
  }
}
