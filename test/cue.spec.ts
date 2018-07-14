import "mocha"
import { expect } from "chai"
import { Ball } from "../src/ball"
//import { TableGeometry } from "../src/tablegeometry"
import { Table } from "../src/table"
import { Cue } from "../src/cue"
import { Vector3 } from "three"

let zero = new Vector3()

let t = 0.1
describe("Cue", () => {
  it("no intersection with cue ball", done => {
    let a = new Ball(zero)
    let b = new Ball(new Vector3(0, 1, 0))
    let table = new Table([a, b])
    table.advance(t)
    let cue = new Cue()
    cue.setPosition(table.balls[0].pos)
    expect(cue.intersectsAnything(table)).to.be.false
    done()
  })
/*
  it("intersection with ball infront of cueball", done => {
    let a = new Ball(new Vector3(0, 3, 0))
    let b = new Ball(new Vector3(-1, 3, 0))
    let table = new Table([a, b])
    table.advance(t)
    let cue = new Cue()
    cue.setPosition(table.balls[0].pos)
    expect(cue.intersectsAnything(table)).to.be.true
    done()
  })
  */
})
