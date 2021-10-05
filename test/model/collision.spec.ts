import "mocha"
import { expect } from "chai"
import { Ball, State } from "../../src/model/ball"
import { Collision } from "../../src/model/physics/collision"
import { Vector3 } from "three"
import { zero } from "../../src/utils/utils"

let epsilon = 0.001
let t = 0.1

describe("Collision", () => {
  it("seperated balls do not collide", (done) => {
    let pos = new Vector3(1, 1, 0)
    let a = new Ball(zero)
    let b = new Ball(pos)
    expect(Collision.willCollide(a, b, t)).to.be.false
    done()
  })

  it("balls travelling towards each other collide", (done) => {
    let pos = new Vector3(1, 0, 0)
    let a = new Ball(zero)
    a.vel.x = 1
    a.state = State.Sliding
    let b = new Ball(pos)
    expect(Collision.willCollide(a, b, t)).to.be.true
    done()
  })

  it("x velocity transfered from a to b", (done) => {
    let pos = new Vector3(1, 0, 0)
    let a = new Ball(zero)
    a.vel.x = 1
    a.state = State.Sliding
    let b = new Ball(pos)
    expect(Collision.willCollide(a, b, t)).to.be.true
    Collision.collide(a, b)
    expect(Collision.willCollide(a, b, t)).to.be.false
    expect(a.vel.x).to.be.below(epsilon)
    done()
  })

  it("y velocity transfered between a and b", (done) => {
    let pos = new Vector3(0.9, 0, 0)
    let a = new Ball(zero)
    a.vel.x = 1
    a.state = State.Sliding
    let b = new Ball(pos)
    b.vel.x = -1
    b.state = State.Sliding
    expect(Collision.willCollide(a, b, t)).to.be.true
    Collision.collide(a, b)
    expect(Collision.willCollide(a, b, t)).to.be.false
    expect(a.vel.x).to.be.equal(-1)
    expect(b.vel.x).to.be.equal(1)
    done()
  })
})
