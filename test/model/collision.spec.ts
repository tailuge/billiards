import { expect } from "chai"
import { Ball, State } from "../../src/model/ball"
import { Collision } from "../../src/model/physics/collision"
import { Vector3 } from "three"
import { zero } from "../../src/utils/utils"
import { R } from "../../src/model/physics/constants"

const epsilon = 0.05
const t = 0.01
const v = 10 * R

describe("Collision", () => {
  it("seperated balls do not collide", (done) => {
    const pos = new Vector3(1, 1, 0)
    const a = new Ball(zero)
    const b = new Ball(pos)
    expect(Collision.willCollide(a, b, t)).to.be.false
    done()
  })

  it("balls travelling towards each other collide", (done) => {
    const pos = new Vector3(2 * R, 0, 0)
    const a = new Ball(zero)
    a.vel.x = v
    a.state = State.Sliding
    const b = new Ball(pos)
    expect(Collision.willCollide(a, b, t)).to.be.true
    done()
  })

  it("x velocity transfered from a to b", (done) => {
    const pos = new Vector3(2 * R, 0, 0)
    const a = new Ball(zero)
    a.vel.x = v
    a.state = State.Sliding
    const b = new Ball(pos)
    expect(Collision.willCollide(a, b, t)).to.be.true
    Collision.collide(a, b)
    expect(Collision.willCollide(a, b, t)).to.be.false
    expect(a.vel.x).to.be.below(epsilon)
    done()
  })

  it("y velocity transfered between a and b", (done) => {
    const a = new Ball(zero)
    a.vel.x = v
    a.state = State.Sliding
    const b = new Ball(new Vector3(2 * R, 0, 0))
    b.vel.x = -v
    b.state = State.Sliding
    expect(Collision.willCollide(a, b, t)).to.be.true
    Collision.collide(a, b)
    expect(Collision.willCollide(a, b, t)).to.be.false
    expect(a.vel.x).to.be.approximately(-v, 0.1)
    expect(b.vel.x).to.be.approximately(v, 0.1)
    done()
  })
})
