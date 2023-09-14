import "mocha"
import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { TableGeometry } from "../../src/view/tablegeometry"
import { Cushion } from "../../src/model/physics/cushion"
import { Knuckle } from "../../src/model/physics/knuckle"
import { Vector3 } from "three"

const t = 0.1

describe("Cushion", () => {
  it("bounces off X cushion", (done) => {
    const pos = new Vector3(TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.x = 1
    expect(Cushion.bounceAny(ball, t)).to.be.greaterThan(0)
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    expect(ball.vel.x).to.be.below(0)
    done()
  })

  it("bounces off -X cushion", (done) => {
    const pos = new Vector3(-TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.x = -1
    expect(Cushion.bounceAny(ball, t)).to.be.greaterThan(0)
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    expect(ball.vel.x).to.be.above(0)
    done()
  })

  it("bounces off Y cushion", (done) => {
    const pos = new Vector3(TableGeometry.tableX / 2, TableGeometry.tableY, 0)
    const ball = new Ball(pos)
    ball.vel.y = 1
    expect(Cushion.bounceAny(ball, t)).to.be.greaterThan(0)
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    expect(ball.vel.y).to.be.below(0)
    done()
  })

  it("bounces off -Y cushion", (done) => {
    const pos = new Vector3(TableGeometry.tableX / 2, -TableGeometry.tableY, 0)
    const ball = new Ball(pos)
    ball.vel.y = -1
    expect(Cushion.bounceAny(ball, t)).to.be.greaterThan(0)
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    expect(ball.vel.y).to.be.above(0)
    done()
  })

  it("bounces off X cushion on pocketless table", (done) => {
    const pos = new Vector3(TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.x = 1
    expect(Cushion.bounceAny(ball, t, false)).to.be.greaterThan(0)
    expect(Cushion.bounceAny(ball, t, false)).to.be.undefined
    expect(ball.vel.x).to.be.below(0)
    done()
  })

  function bounceInXWithSpin(rvel) {
    const pos = new Vector3(TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.x = 1
    ball.rvel.copy(rvel)
    Cushion.bounceAny(ball, t)
    return ball
  }

  it("bounces off X cushion with rhs spins", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, 0, 1))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.below(0)
    done()
  })

  it("bounces off X cushion with lhs spins", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, 0, -1))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.above(0)
    done()
  })

  it("bounces off X cushion with rolling spin", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, 1, 0))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.approximately(0, 0.01)
    done()
  })

  it("bounces off X cushion with top spin", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, 2, 0))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.approximately(0, 0.01)
    done()
  })

  it("bounces off X cushion with back spin", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, -2, 0))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.approximately(0, 0.01)
    done()
  })

  it("bounces off X cushion with top and rhs", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, 2, 1))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.below(0)
    done()
  })

  it("bounces off X cushion with corkscrew spin", (done) => {
    const ball = bounceInXWithSpin(new Vector3(1, 0, 0))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.approximately(0, 0.1)
    done()
  })

  it("bounces off X cushion 45 in 45 out", (done) => {
    const pos = new Vector3(TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.set(1, 1, 0)
    Cushion.bounceAny(ball, t)
    expect(ball.vel.y).to.be.approximately(-ball.vel.x, 0.2)
    done()
  })

  it("shallow angle slips, retains sidespin, retain y speed", (done) => {
    const pos = new Vector3(TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.set(0.1, -1, 0)
    ball.rvel.set(0, 0, -10)
    Cushion.bounceAny(ball, t)
    expect(ball.rvel.z).to.be.approximately(-10, 1)
    expect(ball.vel.y).to.be.approximately(-1, 0.1).and.greaterThan(-1)
    done()
  })

  it("does not bounce off pocket area", (done) => {
    const pos = new Vector3(0, -TableGeometry.tableY, 0)
    const ball = new Ball(pos)
    ball.vel.y = -1
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    done()
  })

  it("bounces off knuckle", (done) => {
    const pos = new Vector3(
      TableGeometry.middleKnuckleInset - 0.1,
      -TableGeometry.tableY,
      0
    )
    const ball = new Ball(pos)
    ball.vel.y = -1
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    const k = Knuckle.findBouncing(ball, t)
    expect(k).to.be.deep.equal(TableGeometry.pockets.pocketS.knuckleSE)
    k?.bounce(ball)
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.above(0)
    done()
  })

  it("geometry present", (done) => {
    const scene = { add: () => {} }
    TableGeometry.addToScene(scene)
    done()
  })
})
