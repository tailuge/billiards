import "mocha"
import { expect } from "chai"
import { Ball, State } from "../../src/model/ball"
import { TableGeometry } from "../../src/view/tablegeometry"
import { Table } from "../../src/model/table"
import { Vector3 } from "three"
import { zero } from "../../src/utils/utils"
import { Rack } from "../../src/utils/rack"
import { R } from "../../src/model/physics/constants"
import { PocketGeometry } from "../../src/view/pocketgeometry"
import { Collision } from "../../src/model/physics/collision"

const t = 0.01

describe("Table", () => {
  beforeEach(function (done) {
    Ball.id = 0
    done()
  })

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

  it("halt all", (done) => {
    const table = new Table(Rack.diamond())
    table.balls[0].vel.x = 10 * R
    expect(table.prepareAdvanceAll(t)).to.be.true
    table.halt()
    expect(table.allStationary()).to.be.true
    done()
  })

  it("overlap balls thows exception", (done) => {
    const a = new Ball(zero)
    a.vel.x = 1
    a.state = State.Sliding
    const b = new Ball(new Vector3(R * 0.9, 0, 0))
    const table = new Table([a, b])
    expect(() => {
      table.advance(t)
    }).to.throw(Error)
    done()
  })

  it("a momentum transferes to c", (done) => {
    const a = new Ball(zero)
    a.vel.x = 100 * R
    a.state = State.Sliding
    const b = new Ball(new Vector3(2.0 * R, 0, 0))
    const c = new Ball(new Vector3(4.0 * R, 0, 0))
    const table = new Table([a, b, c])
    expect(table.allStationary()).to.be.false
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(c.vel.x).to.be.closeTo(100 * R, 10 * R)
    expect(table.prepareAdvanceAll(t)).to.be.true
    done()
  })

  it("c moves by transfering momentum through b and a after bounce", (done) => {
    const a = new Ball(new Vector3(-TableGeometry.tableX, 0, 0))
    const b = new Ball(new Vector3(-TableGeometry.tableX + 2.01 * R, 0, 0))
    const c = new Ball(new Vector3(-TableGeometry.tableX + 4.02 * R, 0, 0))
    a.vel.x = -100 * R
    a.state = State.Sliding
    const table = new Table([a, b, c])
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(c.vel.x).to.be.above(0)
    done()
  })

  it("a pots b", (done) => {
    const edge =
      PocketGeometry.pockets.pocketS.pocket.pos.y +
      PocketGeometry.middleRadius +
      0.01 * R
    const a = new Ball(new Vector3(0, edge + R * 2, 0))
    const b = new Ball(new Vector3(0, edge, 0))
    a.vel.y = -18 * R
    a.state = State.Sliding
    const table = new Table([a, b])
    expect(Collision.willCollide(a, b, t)).to.be.true
    const s = table.prepareAdvanceAll(t)
    expect(s).to.be.false
    table.advance(t)
    expect(b.onTable()).to.be.false
    expect(b.isFalling()).to.be.true
    b.rvel.x = 0.1
    const maxiter = 10
    let i = 0
    while (i++ < maxiter && b.state != State.InPocket) {
      table.advance(10 * t)
    }
    expect(b.isFalling()).to.be.false
    expect(b.state).to.be.equal(State.InPocket)
    expect(table.inPockets()).to.be.equal(1)

    done()
  })

  it("three cushion table has no pocket", (done) => {
    const a = new Ball(new Vector3(0, TableGeometry.tableY - 0.01 * R, 0))
    const b = new Ball(zero)
    a.vel.y = 8 * R
    a.state = State.Sliding
    const table = new Table([a, b])
    TableGeometry.hasPockets = false
    const s = table.prepareAdvanceAll(t)
    expect(s).to.be.false
    table.advance(t)
    expect(b.onTable()).to.be.true
    done()
  })

  it("collides with knuckle", (done) => {
    const a = new Ball(
      new Vector3(
        PocketGeometry.middleKnuckleInset - 0.1 * R,
        TableGeometry.tableY,
        0
      )
    )
    const b = new Ball(new Vector3())
    a.vel.y = 10 * R
    a.state = State.Sliding
    const table = new Table([a, b])
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(a.vel.x).to.be.below(0)
    done()
  })

  it("rounds cueball position safely", (done) => {
    const a = new Ball(new Vector3(0.00001 + 2 * R, 0, 0))
    const b = new Ball(new Vector3(0.00001 + 0, 0, 0))
    const c = new Ball(new Vector3(0.00001 + 4 * R, 0, 0))
    const table = new Table([a, b, c])
    table.cueball = a
    expect(table.overlapsAny(table.cueball.pos)).to.be.false
    table.roundCueBallPosition()
    expect(table.overlapsAny(table.cueball.pos)).to.be.false
    b.pos.y = 1
    table.roundCueBallPosition()
    expect(table.overlapsAny(table.cueball.pos)).to.be.false
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
    table.cueball.pos.x = 4
    const obj = JSON.parse(data)
    table.updateFromSerialised(obj)
    expect(table.cueball.pos.x).to.be.equal(0)
    done()
  })

  it("starts stationary", (done) => {
    const table = new Table(Rack.diamond())
    expect(table.allStationary()).to.be.true
    done()
  })

  it("shortSerialise", (done) => {
    const table = new Table(Rack.diamond())
    expect(table.shortSerialise()).to.be.length((9 + 1) * 2)
    done()
  })
})
