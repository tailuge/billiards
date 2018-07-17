import "mocha"
import { expect } from "chai"
import { Ball } from "../src/ball"
import { Vector3 } from "three"
import { zero } from "../src/utils"

let t = 0.1

describe("Ball", () => {
  it("serialise/deserialise", done => {
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

  it("initialises and is stationary", done => {
    let pos = new Vector3(1, 2, 0)
    let ball = new Ball(pos)
    expect(ball.pos).to.deep.equal(pos)
    expect(ball.vel).to.deep.equal(zero)
    expect(ball.rvel).to.deep.equal(zero)
    done()
  })

  it("stationary remains stationary after time step", done => {
    let pos = new Vector3(1, 2, 0)
    let ball = new Ball(pos)
    ball.update(1)
    expect(ball.pos).to.deep.equal(pos)
    expect(ball.vel).to.deep.equal(zero)
    expect(ball.rvel).to.deep.equal(zero)
    done()
  })

  it("friction stops ball", done => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 0.01
    ball.update(1)
    expect(ball.vel).to.deep.equal(zero)
    done()
  })

  it("ball moving with no spin is not rolling", done => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 1
    expect(ball.isRolling()).to.be.false
    done()
  })

  it("ball with matched rotational vel is rolling", done => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 1
    ball.rvel.y = 1
    expect(ball.isRolling()).to.be.true
    done()
  })

  it("ball close to matched rotational vel is rolling", done => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 1
    ball.rvel.y = 1.0001
    expect(ball.isRolling()).to.be.true
    done()
  })

  it("topspin accelerates ball", done => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 0
    ball.rvel.y = 1
    expect(ball.isRolling()).to.be.false
    ball.update(t)
    expect(ball.vel.x).to.be.above(0)
    done()
  })

  it("topspin spins less over time", done => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 0
    ball.rvel.y = 1
    expect(ball.isRolling()).to.be.false
    ball.update(t)
    expect(ball.rvel.y).to.be.below(1)
    done()
  })

  it("topspin ball eventualy starts to roll", done => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 0
    ball.rvel.y = 0.1
    let maxiter = 100
    let i = 0
    while (i++ < maxiter && !ball.isRolling()) {
      ball.update(t)
    }
    expect(i).to.be.below(maxiter)
    done()
  })

  it("rolling ball eventualy stops", done => {
    let ball = new Ball(new Vector3())
    ball.vel.x = 0.025
    ball.rvel.y = 0.025
    let maxiter = 100
    let i = 0
    while (i++ < maxiter && ball.isRolling()) {
      ball.update(t)
    }
    expect(i).to.be.below(maxiter)
    done()
  })
})
