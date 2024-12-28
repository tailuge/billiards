import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { Pocket } from "../../src/model/physics/pocket"
import { Vector3 } from "three"
import { PocketGeometry } from "../../src/view/pocketgeometry"

const t = 0.1

describe("Pocket", () => {
  it("willFall", (done) => {
    const edge =
      PocketGeometry.pockets.pocketS.pocket.pos.y +
      PocketGeometry.middleRadius +
      0.01
    const pos = new Vector3(0, edge, 0)
    const ball = new Ball(pos)
    ball.vel.y = -1
    const p = Pocket.findPocket(PocketGeometry.pocketCenters, ball, t)
    expect(p).to.be.not.null
    done()
  })
})
