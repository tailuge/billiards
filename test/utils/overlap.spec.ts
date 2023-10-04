import "mocha"
import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { Table } from "../../src/model/table"
import { Vector3 } from "three"
import { zero } from "../../src/utils/utils"
import { Overlap } from "../../src/utils/overlap"

const t = 0.01

describe("Overlap", () => {
  it("finds first overlap", (done) => {
    const a = new Ball(zero)
    const b = new Ball(new Vector3(1, 0, 0))
    const c = new Ball(new Vector3(2, 0, 0))
    const table = new Table([a, b, c])
    table.advance(0.1)
    table.updateBallMesh(0.1)
    b.ballmesh.mesh.updateWorldMatrix(false, false)
    const overlap = new Overlap(table.balls)
    expect(overlap.getOverlapOffset(a, new Vector3(0, 1, 0))).to.be.undefined
    const aim = new Vector3(1, 0.01, 0)
    expect(overlap.getOverlapOffset(a, aim)?.ball).to.be.equal(b)
    expect(overlap.getOverlapOffset(a, aim)?.overlap).to.be.greaterThan(0)
    aim.y = -0.01
    expect(overlap.getOverlapOffset(a, aim)?.overlap).to.be.lessThan(0)
    done()
  })
})
