import "mocha"
import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { TableGeometry } from "../../src/view/tablegeometry"
import { Pocket } from "../../src/model/physics/pocket"
import { Vector3 } from "three"

let t = 0.1

describe("Pocket", () => {
  it("willFall", done => {
    let edge = -TableGeometry.PY + TableGeometry.middleRadius + 0.5
    let pos = new Vector3(0, edge, 0)
    let ball = new Ball(pos)
    ball.vel.y = -1
    let p = Pocket.willFallAny(ball, t)
    expect(p).to.be.not.null
    p && p.fall(ball, t)
    expect(Pocket.willFallAny(ball, t)).to.be.false
    done()
  })
})
