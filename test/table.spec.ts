import "mocha"
import { expect } from "chai"
import { Ball } from "../src/ball"
import { TableGeometry } from "../src/tablegeometry"
import { Table } from "../src/table"
import { Vector3 } from "three"

let zero = new Vector3()
let t = 0.1

describe("Table", () => {
  it("updates when all stationary", done => {
    let a = new Ball(zero)
    let b = new Ball(new Vector3(1, 0, 0))
    let c = new Ball(new Vector3(2, 0, 0))
    let table = new Table([a, b, c])
    expect(table.prepareAdvanceAll(t)).to.be.true
    done()
  })

  it("a momentum transferes to c", done => {
    let a = new Ball(zero)
    a.vel.x = 1
    let b = new Ball(new Vector3(1, 0, 0))
    let c = new Ball(new Vector3(2, 0, 0))
    let table = new Table([a, b, c])
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
    expect(table.prepareAdvanceAll(t)).to.be.true
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

  it("illegal state throws", done => {
    let a = new Ball(new Vector3(-TableGeometry.tableX, 0, 0))
    let b = new Ball(new Vector3(-TableGeometry.tableX + 0.5, 0, 0))
    let table = new Table([a, b])
    expect(() => {
      table.advance(t)
    }).to.throw()
    done()
  })

  it("aims", done => {
    let a = new Ball(new Vector3(-TableGeometry.tableX, 0, 0))
    let b = new Ball(new Vector3(-TableGeometry.tableX + 2, 0, 0))

    let table = new Table([a, b])

    expect(table.aim.x).to.be.equal(1)
    table.rotateAim(0.1)
    expect(table.aim.x).to.be.below(1)
    done()
  })

  it("hits", done => {
    let a = new Ball(new Vector3(-TableGeometry.tableX, 0, 0))
    let b = new Ball(new Vector3(-TableGeometry.tableX + 2, 0, 0))

    let table = new Table([a, b])

    table.hit(0.1)
    expect(table.balls[0].vel.x).to.be.above(0)
    done()
  })
})
