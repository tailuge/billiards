import "mocha"
import { expect } from "chai"
import { Ball, State } from "../../src/model/ball"
import { Vector3 } from "three"
import { zero, passesThroughZero } from "../../src/utils/utils"
import {
  sliding,
  slidingFull,
  forceRoll,
  surfaceVelocity,
} from "../../src/model/physics/physics"

let t = 0.1

describe("Ball", () => {
  it("serialise/deserialise", (done) => {
    let pos = new Vector3(1, 2, 0)
    let vel = new Vector3(3, 4, 0)
    let ball = new Ball(pos)
    ball.vel.copy(vel)
    let data = ball.serialise()
    let ball2 = Ball.fromSerialised(data)
    expect(ball2.pos).to.deep.equal(pos)
    expect(ball2.vel).to.deep.equal(vel)
    done()
  })

  it("initialises and is stationary", (done) => {
    let pos = new Vector3(1, 2, 0)
    let ball = new Ball(pos)
    expect(ball.pos).to.deep.equal(pos)
    expect(ball.vel).to.deep.equal(zero)
    expect(ball.rvel).to.deep.equal(zero)
    done()
  })

  it("stationary remains stationary after time step", (done) => {
    let pos = new Vector3(1, 2, 0)
    let ball = new Ball(pos)
    ball.update(1)
    expect(ball.pos).to.deep.equal(pos)
    expect(ball.vel).to.deep.equal(zero)
    expect(ball.rvel).to.deep.equal(zero)
    done()
  })

  it("friction slows ball", (done) => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 0.01
    ball.state = State.Sliding
    ball.update(0.01)
    expect(ball.vel.x).to.be.below(0.01)
    done()
  })

  it("ball moving with no spin is not rolling", (done) => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 1
    expect(ball.isRolling()).to.be.false
    done()
  })

  it("ball with matched rotational vel is rolling", (done) => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 1
    ball.rvel.y = 1
    expect(ball.isRolling()).to.be.true
    done()
  })

  it("ball close to matched rotational vel is rolling", (done) => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 1
    ball.rvel.y = 1.0001
    ball.state = State.Sliding
    expect(ball.isRolling()).to.be.true
    done()
  })

  it("topspin accelerates ball", (done) => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 0
    ball.rvel.y = 10
    ball.state = State.Sliding
    expect(ball.isRolling()).to.be.false
    ball.update(t)
    expect(ball.vel.x).to.be.above(0)
    done()
  })

  it("topspin spins less over time", (done) => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 0
    ball.rvel.y = 1
    ball.state = State.Sliding
    expect(ball.isRolling()).to.be.false
    ball.update(t)
    expect(ball.rvel.y).to.be.below(1)
    done()
  })
  /*
  it("topspin ball eventualy starts to roll", (done) => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 0
    ball.rvel.y = 2
    ball.state = State.Sliding
    let maxiter = 100
    let i = 0
    while (i++ < maxiter && !ball.isRolling()) {
      ball.update(t)
    }
    expect(i).to.be.below(maxiter)
    done()
  })
*/
  it("rolling ball eventualy stops", (done) => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 0.025
    ball.rvel.y = 0.025
    ball.state = State.Rolling
    let maxiter = 100
    let i = 0
    while (i++ < maxiter && ball.isRolling()) {
      ball.update(t)
    }
    expect(i).to.be.below(maxiter)
    done()
  })

  it("spinning ball eventualy stops", (done) => {
    let ball = new Ball(new Vector3())
    ball.rvel.z = 0.01
    ball.rvel.y = 0
    let maxiter = 20
    let i = 0
    while (i++ < maxiter && ball.inMotion()) {
      ball.update(t)
    }
    expect(i).to.be.below(maxiter)
    done()
  })

  it("stun ball does not roll back at end", (done) => {
    let ball = new Ball(new Vector3())
    ball.rvel.y = 0.1
    let maxiter = 100
    let i = 0
    while (i++ < maxiter && ball.inMotion()) {
      ball.update(t)
      expect(ball.vel.x).to.be.at.least(0)
    }
    expect(i).to.be.below(maxiter)
    done()
  })

  it("alternate sliding calc equivalent", (done) => {
    let v = new Vector3(1, 2, 0)
    let w = new Vector3(3, 4, 5)
    let dv = new Vector3()
    let dw = new Vector3()
    let fdv = new Vector3()
    let fdw = new Vector3()

    sliding(v, w, dv, dw)
    slidingFull(v, w, fdv, fdw)

    expect(dv.distanceTo(fdv)).to.be.below(0.001)
    expect(dw.distanceTo(fdw)).to.be.below(0.001)
    done()
  })

  it("halts at close to zero", (done) => {
    expect(passesThroughZero(new Vector3(1, 1, 0), new Vector3(-0.5, -0.5, 0)))
      .to.be.false
    expect(passesThroughZero(new Vector3(1, 1, 0), new Vector3(-2, -2, 0))).to
      .be.true
    expect(passesThroughZero(new Vector3(1, 1, 0), new Vector3(-1, -1, 0))).to
      .be.true
    done()
  })

  it("slightly rolling ball halts", (done) => {
    let b = Ball.fromSerialised({
      pos: { x: 0, y: 0, z: 0 },
      vel: { x: 0.0026704887947856175, y: -0.04722559231618879, z: 0 },
      rvel: { x: 0.00001806789773622572, y: -0.00008182140227559905, z: 0 },
      state: "Rolling",
    })
    forceRoll(b.vel, b.rvel)
    b.update(1)
    expect(b.inMotion()).to.be.false
    done()
  })

  it("force roll leaves roll unaffected", (done) => {
    let b = Ball.fromSerialised({
      pos: { x: 0, y: 0, z: 0 },
      vel: { x: 1, y: 0, z: 0 },
      rvel: { x: 0, y: 1, z: 0 },
      state: "Rolling",
    })
    forceRoll(b.vel, b.rvel)
    expect(surfaceVelocity(b.vel, b.rvel)).to.be.deep.equal(zero)
    expect(b.vel.x).to.be.equal(1)
    done()
  })

  it("force roll is at midpoint", (done) => {
    let b = Ball.fromSerialised({
      pos: { x: 0, y: 0, z: 0 },
      vel: { x: 1, y: 0, z: 0 },
      rvel: { x: 0, y: 2, z: 0 },
      state: "Rolling",
    })
    forceRoll(b.vel, b.rvel)
    expect(surfaceVelocity(b.vel, b.rvel)).to.be.deep.equal(zero)
    expect(b.vel.x).to.be.equal(1.5)
    done()
  })
  /*
  it.only("sliding ball at rolling conditions transitions to rolling", (done) => {
    let b = Ball.fromSerialised({
      pos: { x: 0, y: 0, z: 0 },
      vel: {x: -0.568691179646577, y: 0.19917980334600546, z: 0},
      rvel: {x: -0.2807500477302739, y: -0.4961088936915536, z: 0},
      state: "Sliding",
    })
    b.update(0.001953125 * 3)
    b.update(0.001953125 * 3)
    b.update(0.001953125 * 3)
    expect(b.isRolling()).to.be.true
    done()
  })
*/
})
