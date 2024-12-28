import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { Table } from "../../src/model/table"
import { Vector3 } from "three"
import { Rack } from "../../src/utils/rack"
import { Respot } from "../../src/utils/respot"
import { R } from "../../src/model/physics/constants"

describe("Respot", () => {
  it("place behind", (done) => {
    Ball.id = 0
    const table = new Table(Rack.snooker())
    const black = table.balls[6]
    const blackSpot = black.pos.clone()
    table.cueball.pos.copy(blackSpot)
    black.pos.z = 100
    Respot.respot(black, table)
    expect(black.pos.x).to.be.greaterThan(blackSpot.x)
    done()
  })

  it("place infront if no space behind", (done) => {
    Ball.id = 0
    const table = new Table(Rack.snooker())
    const black = table.balls[6]
    const blackSpot = black.pos.clone()
    const r3 = new Vector3(3.75 * R, 0, 0)
    const behind = blackSpot.clone().add(r3)
    table.cueball.pos.copy(blackSpot)
    black.pos.z = 100
    table.balls[7].pos.copy(behind)
    table.balls[8].pos.copy(behind.add(r3))
    Respot.respot(black, table)
    expect(black.pos.x).to.be.lessThan(blackSpot.x)
    done()
  })
})
