import "mocha"
import { expect } from "chai"
import { Ball, State } from "../../src/model/ball"
import { TableGeometry } from "../../src/view/tablegeometry"
import { Table } from "../../src/model/table"
import { Vector3 } from "three"
import { zero } from "../../src/utils/utils"

let t = 0.1

describe("Table", () => {
  it("updates when all stationary", (done) => {
    let a = new Ball(zero)
    let b = new Ball(new Vector3(1, 0, 0))
    let c = new Ball(new Vector3(2, 0, 0))
    let table = new Table([a, b, c])
    expect(table.prepareAdvanceAll(t)).to.be.true
    expect(table.allStationary()).to.be.true
    done()
  })

  it("updates when single ball stationary", (done) => {
    let table = new Table([new Ball(zero)])
    expect(table.prepareAdvanceAll(t)).to.be.true
    expect(table.allStationary()).to.be.true
    done()
  })

  it("a momentum transferes to c", (done) => {
    let a = new Ball(zero)
    a.vel.x = 2
    a.state = State.Sliding
    let b = new Ball(new Vector3(1, 0, 0))
    let c = new Ball(new Vector3(2, 0, 0))
    let table = new Table([a, b, c])
    expect(table.allStationary()).to.be.false
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(c.vel.x).to.be.closeTo(1, 0.5)
    expect(table.prepareAdvanceAll(t)).to.be.true
    done()
  })

  it("c bounces by transfering momentum through b and a", (done) => {
    let a = new Ball(new Vector3(-TableGeometry.tableX, 0, 0))
    let b = new Ball(new Vector3(-TableGeometry.tableX + 1, 0, 0))
    let c = new Ball(new Vector3(-TableGeometry.tableX + 2, 0, 0))
    a.vel.x = -1
    a.state = State.Sliding
    let table = new Table([a, b, c])
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(c.vel.x).to.be.above(0)
    //    expect(table.prepareAdvanceAll(t)).to.be.true
    done()
  })

  it("a pots b", (done) => {
    let edge = TableGeometry.pockets.pocketS.pocket.pos.y + TableGeometry.middleRadius + 0.01
    let a = new Ball(new Vector3(0, edge + 1, 0))
    let b = new Ball(new Vector3(0, edge, 0))
    a.vel.y = -2
    a.state = State.Sliding
    let table = new Table([a, b])
    let s = table.prepareAdvanceAll(t)
    expect(s).to.be.false
    table.advance(t)
    expect(b.onTable()).to.be.false
    done()
  })

  it("collides with knuckle", (done) => {
    let a = new Ball(
      new Vector3(
        TableGeometry.middleKnuckleInset - 0.1,
        TableGeometry.tableY,
        0
      )
    )
    let b = new Ball(new Vector3())
    a.vel.y = 10
    a.state = State.Sliding
    let table = new Table([a, b])
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(a.vel.x).to.be.below(0)
    done()
  })

  it("serialise/deserialise", (done) => {
    let a = new Ball(new Vector3(-TableGeometry.tableX, 0, 0))
    let b = new Ball(new Vector3(-TableGeometry.tableX + 1, 0, 0))
    let c = new Ball(new Vector3(-TableGeometry.tableX + 2, 0, 0))
    a.vel.x = -1
    let table = new Table([a, b, c])
    let data = JSON.stringify(table.serialise())
    let obj = JSON.parse(data)
    let table2 = Table.fromSerialised(obj)
    expect(table2.balls.length).to.be.equal(3)
    done()
  })

  it("serialise/updateFromDeserialise", (done) => {
    let a = new Ball(new Vector3(0, 0, 0))
    let b = new Ball(new Vector3(1, 0, 0))
    let c = new Ball(new Vector3(2, 0, 0))
    a.vel.x = -1
    let table = new Table([a, b, c])
    let data = JSON.stringify(table.serialise())
    table.balls[0].pos.x = 4
    let obj = JSON.parse(data)
    table.updateFromSerialised(obj)
    expect(table.balls[0].pos.x).to.be.equal(0)
    done()
  })

})
