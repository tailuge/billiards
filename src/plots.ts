import { Ball } from "../src/ball"
import { TableGeometry } from "../src/tablegeometry"
import { Cushion } from "../src/cushion"
import { Vector3 } from "three"

export function stunToRoll() {
  let x: Array<number> = []
  let y: Array<number> = []

  let x2: Array<number> = []
  let y2: Array<number> = []

  let ball = new Ball(new Vector3())
  ball.vel.x = 2
  let ball2 = new Ball(new Vector3(1, 1))
  ball2.vel.x = 2
  ball2.rvel.y = -2

  let maxiter = 300
  let t = 0.3
  let i = 0
  while (i++ < maxiter && ball.inMotion()) {
    ball.update(t)
    ball2.update(t)
    y.push(ball.vel.x)
    x.push(i * t)
    y2.push(ball2.vel.x)
    x2.push(i * t)
  }
  return [{ x: x, y: y, name: "stun" }, { x: x2, y: y2, name: "backspin" }]
}

export function sideSpin() {
  let x: Array<number> = []
  let y: Array<number> = []
  let wz = -1
  while (wz <= 1) {
    let pos = new Vector3(TableGeometry.tableX, 0, 0)
    let ball = new Ball(pos)
    ball.vel.set(1, 1, 0)
    ball.rvel.set(0, 0, wz)
    Cushion.bounce(ball, 0.1)
    y.push(ball.vel.y)
    x.push(wz)
    wz += 0.1
  }
  return [{ x: x, y: y, name: "vel.y" }]
}

export const graphs = [stunToRoll(), sideSpin()]
