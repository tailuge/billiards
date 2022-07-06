import "mocha"
import { expect } from "chai"
import { Ball, State } from "../../src/model/ball"
import { TableGeometry } from "../../src/view/tablegeometry"
import { Table } from "../../src/model/table"
import { Vector3 } from "three"
import { zero } from "../../src/utils/utils"
import { Rack } from "../../src/utils/rack"

const t = 0.1

describe("Table", () => {
  it("updates when all stationary", (done) => {
    const a = new Ball(zero)
    const b = new Ball(new Vector3(1, 0, 0))
    const c = new Ball(new Vector3(2, 0, 0))
    const table = new Table([a, b, c])
    expect(table.prepareAdvanceAll(t)).to.be.true
    expect(table.allStationary()).to.be.true
    done()
  })

  it("updates when single ball stationary", (done) => {
    const table = new Table([new Ball(zero)])
    expect(table.prepareAdvanceAll(t)).to.be.true
    expect(table.allStationary()).to.be.true
    done()
  })

  it("a momentum transferes to c", (done) => {
    const a = new Ball(zero)
    a.vel.x = 1.5
    a.state = State.Sliding
    const b = new Ball(new Vector3(1.1, 0, 0))
    const c = new Ball(new Vector3(2.2, 0, 0))
    const table = new Table([a, b, c])
    expect(table.allStationary()).to.be.false
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(c.vel.x).to.be.closeTo(1, 0.5)
    expect(table.prepareAdvanceAll(t)).to.be.true
    done()
  })

  it("c bounces by transfering momentum through b and a", (done) => {
    const a = new Ball(new Vector3(-TableGeometry.tableX, 0, 0))
    const b = new Ball(new Vector3(-TableGeometry.tableX + 1, 0, 0))
    const c = new Ball(new Vector3(-TableGeometry.tableX + 2, 0, 0))
    a.vel.x = -1
    a.state = State.Sliding
    const table = new Table([a, b, c])
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(c.vel.x).to.be.above(0)
    //    expect(table.prepareAdvanceAll(t)).to.be.true
    done()
  })

  it("a pots b", (done) => {
    const edge =
      TableGeometry.pockets.pocketS.pocket.pos.y +
      TableGeometry.middleRadius +
      0.01
    const a = new Ball(new Vector3(0, edge + 1, 0))
    const b = new Ball(new Vector3(0, edge, 0))
    a.vel.y = -2
    a.state = State.Sliding
    const table = new Table([a, b])
    const s = table.prepareAdvanceAll(t)
    expect(s).to.be.false
    table.advance(t)
    expect(b.onTable()).to.be.false
    expect(b.isFalling()).to.be.true

    const maxiter = 10
    let i = 0
    while (i++ < maxiter && b.state != State.InPocket) {
      table.advance(t)
    }
    expect(b.isFalling()).to.be.false
    expect(b.state).to.be.equal(State.InPocket)
    done()
  })

  it("collides with knuckle", (done) => {
    const a = new Ball(
      new Vector3(
        TableGeometry.middleKnuckleInset - 0.1,
        TableGeometry.tableY,
        0
      )
    )
    const b = new Ball(new Vector3())
    a.vel.y = 10
    a.state = State.Sliding
    const table = new Table([a, b])
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(a.vel.x).to.be.below(0)
    done()
  })

  it("serialise/deserialise", (done) => {
    const a = new Ball(new Vector3(-TableGeometry.tableX, 0, 0))
    const b = new Ball(new Vector3(-TableGeometry.tableX + 1, 0, 0))
    const c = new Ball(new Vector3(-TableGeometry.tableX + 2, 0, 0))
    a.vel.x = -1
    const table = new Table([a, b, c])
    const data = JSON.stringify(table.serialise())
    const obj = JSON.parse(data)
    const table2 = Table.fromSerialised(obj)
    expect(table2.balls.length).to.be.equal(3)
    done()
  })

  it("serialise/updateFromDeserialise", (done) => {
    const a = new Ball(new Vector3(0, 0, 0))
    const b = new Ball(new Vector3(1, 0, 0))
    const c = new Ball(new Vector3(2, 0, 0))
    a.vel.x = -1
    const table = new Table([a, b, c])
    const data = JSON.stringify(table.serialise())
    table.balls[0].pos.x = 4
    const obj = JSON.parse(data)
    table.updateFromSerialised(obj)
    expect(table.balls[0].pos.x).to.be.equal(0)
    done()
  })

  it("starts stationary", (done) => {
    const table = new Table(Rack.diamond())
    expect(table.allStationary()).to.be.true
    done()
  })
})
