import "mocha"
import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { TableGeometry } from "../../src/view/tablegeometry"
import { Table } from "../../src/model/table"
import { Vector3 } from "three"
import { zero } from "../../src/utils/utils"

let t = 0.1

describe("Table", () => {
  it("updates when all stationary", done => {
    let a = new Ball(zero)
    let b = new Ball(new Vector3(1, 0, 0))
    let c = new Ball(new Vector3(2, 0, 0))
    let table = new Table([a, b, c])
    expect(table.prepareAdvanceAll(t)).to.be.true
    expect(table.allStationary()).to.be.true
    done()
  })

  it("updates when single ball stationary", done => {
    let table = new Table([new Ball(zero)])
    expect(table.prepareAdvanceAll(t)).to.be.true
    expect(table.allStationary()).to.be.true
    done()
  })

  it("a momentum transferes to c", done => {
    let a = new Ball(zero)
    a.vel.x = 1
    let b = new Ball(new Vector3(1, 0, 0))
    let c = new Ball(new Vector3(2, 0, 0))
    let table = new Table([a, b, c])
    expect(table.allStationary()).to.be.false
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(c.vel.x).to.be.closeTo(1, 0.1)
    expect(table.prepareAdvanceAll(t)).to.be.true
    done()
  })

  it("c bounces by transfering momentum through b and a", done => {
    let a = new Ball(new Vector3(-TableGeometry.tableX, 0, 0))
    let b = new Ball(new Vector3(-TableGeometry.tableX + 1, 0, 0))
    let c = new Ball(new Vector3(-TableGeometry.tableX + 2, 0, 0))
    a.vel.x = -1
    let table = new Table([a, b, c])
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(c.vel.x).to.be.above(0)
    //    expect(table.prepareAdvanceAll(t)).to.be.true
    done()
  })

  it("a pots b", done => {
    let edge = -TableGeometry.PY + TableGeometry.middleRadius + 0.5
    let a = new Ball(new Vector3(0, edge + 1, 0))
    let b = new Ball(new Vector3(0, edge, 0))
    a.vel.y = -1
    let table = new Table([a, b])
    let s = table.prepareAdvanceAll(t)
    expect(s).to.be.false
    table.advance(t)
    expect(b.onTable()).to.be.false
    done()
  })

  it("collides with knuckle", done => {
    let a = new Ball(
      new Vector3(
        TableGeometry.middleKnuckleInset - 0.1,
        TableGeometry.tableY,
        0
      )
    )
    let b = new Ball(new Vector3())
    a.vel.y = 1
    let table = new Table([a, b])
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(a.vel.x).to.be.below(0)
    done()
  })

  it("serialise/deserialise", done => {
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

  it("serialise/updateFromDeserialise", done => {
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

  it("illegal state throws", done => {
    let a = new Ball(new Vector3(-TableGeometry.tableX, 0, 0))
    let b = new Ball(new Vector3(-TableGeometry.tableX + 0.5, 0, 0))
    let table = new Table([a, b])
    expect(() => {
      table.advance(t)
    }).to.throw()
    done()
  })

  // crash  {"pos":{"x":-13.999910173197184,"y":0.9674842540866305,"z":0},"vel":{"x":-0.06767024082189936,"y":0.30078369071593314,"z":0},"rvel":{"x":1.0712115095804875,"y":1.417600310070316,"z":0},"state":"Sliding"}
})
