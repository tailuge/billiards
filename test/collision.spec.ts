import "mocha"
import { expect } from "chai"
import { Ball } from "../src/ball"
import { Collision } from "../src/collision"
import { Vector3 } from "three"

let zero = new Vector3()
let epsilon = 0.001

describe("Collision", () => {
  it("seperated balls do not collide", done => {
    let pos = new Vector3(1, 1, 0)
    let a = new Ball(zero)
    let b = new Ball(pos)
    expect(Collision.collide(a, b)).to.be.false
    done()
  })

  it("close balls do collide", done => {
    let pos = new Vector3(0.9, 0, 0)
    let a = new Ball(zero)
    let b = new Ball(pos)
    expect(Collision.collide(a, b)).to.be.true
    expect(a.pos.distanceTo(b.pos)).to.be.above(1)
    done()
  })

  it("x velocity transfered from a to b", done => {
    let pos = new Vector3(0.9, 0, 0)
    let a = new Ball(zero)
    a.vel.x = 1
    let b = new Ball(pos)
    expect(Collision.collide(a, b)).to.be.true
    expect(a.vel.x).to.be.below(epsilon)
    done()
  })

  it("y velocity transfered between a and b", done => {
    let pos = new Vector3(0.9, 0, 0)
    let a = new Ball(zero)
    a.vel.x = 1
    let b = new Ball(pos)
    b.vel.x = -1
    expect(Collision.collide(a, b)).to.be.true
    expect(a.vel.x).to.be.equal(-1)
    expect(b.vel.x).to.be.equal(1)
    done()
  })
})
