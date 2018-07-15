import "mocha"
import { expect } from "chai"
import { Ball } from "../src/ball"
import { Vector3 } from "three"
import { zero } from "../src/utils"

describe("Ball", () => {
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
})
