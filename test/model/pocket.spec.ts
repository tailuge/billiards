import "mocha"
import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { TableGeometry } from "../../src/view/tablegeometry"
import { Pocket } from "../../src/model/physics/pocket"
import { Vector3 } from "three"

const t = 0.1

describe("Pocket", () => {
  it("willFall", (done) => {
    const edge =
      TableGeometry.pockets.pocketS.pocket.pos.y +
      TableGeometry.middleRadius +
      0.01
    const pos = new Vector3(0, edge, 0)
    const ball = new Ball(pos)
    ball.vel.y = -1
    const p = Pocket.findPocket(ball, t)
    expect(p).to.be.not.null
    done()
  })
})
