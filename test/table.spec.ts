import "mocha"
import { expect } from "chai"
import { Ball } from "../src/ball"
import { Cushion } from "../src/cushion"
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
    expect(c.vel.x).to.be.equal(1)
    expect(table.prepareAdvanceAll(t)).to.be.true
    done()
  })

  it("c bounces by transfering momentum through b and a", done => {
    let a = new Ball(new Vector3(-Cushion.tableX, 0, 0))
    let b = new Ball(new Vector3(-Cushion.tableX + 1, 0, 0))
    let c = new Ball(new Vector3(-Cushion.tableX + 2, 0, 0))
    a.vel.x = -1
    let table = new Table([a, b, c])
    expect(table.prepareAdvanceAll(t)).to.be.false
    table.advance(t)
    expect(c.vel.x).to.be.above(0)
    expect(table.prepareAdvanceAll(t)).to.be.true
    done()
  })
})
