import "mocha"
import { expect } from "chai"
import { Ball } from "../src/ball"
import { TableGeometry } from "../src/tablegeometry"
import { Pocket } from "../src/pocket"
import { Vector3 } from "three"

let t = 0.1

describe("Pocket", () => {
  it("willFall", done => {
    let pos = new Vector3(0, -TableGeometry.tableY, 0)
    let ball = new Ball(pos)
    ball.vel.y = -1
    let p = Pocket.willFallAny(ball, t)
    expect(p).to.be.not.null
    p && p.fall(ball, t)
    done()
  })
})
