import "mocha"
import { expect } from "chai"
import { Ball } from "../src/ball"
import { Cushion } from "../src/cushion"
import { Vector3 } from "three"

let t = 0.1

describe("Cushion", () => {
  it("bounces off X cushion", done => {
    let pos = new Vector3(Cushion.tableX, 0, 0)
    let ball = new Ball(pos)
    ball.vel.x = 1
    expect(Cushion.willBounce(ball, t)).to.be.true
    Cushion.bounce(ball, t)
    expect(Cushion.willBounce(ball, t)).to.be.false
    expect(ball.vel.x).to.be.below(0)
    done()
  })

  it("bounces off -X cushion", done => {
    let pos = new Vector3(-Cushion.tableX, 0, 0)
    let ball = new Ball(pos)
    ball.vel.x = -1
    expect(Cushion.willBounce(ball, t)).to.be.true
    Cushion.bounce(ball, t)
    expect(Cushion.willBounce(ball, t)).to.be.false
    expect(ball.vel.x).to.be.above(0)
    done()
  })

  it("bounces off Y cushion", done => {
    let pos = new Vector3(0, Cushion.tableY, 0)
    let ball = new Ball(pos)
    ball.vel.y = 1
    expect(Cushion.willBounce(ball, t)).to.be.true
    Cushion.bounce(ball, t)
    expect(Cushion.willBounce(ball, t)).to.be.false
    expect(ball.vel.y).to.be.below(0)
    done()
  })

  it("bounces off -Y cushion", done => {
    let pos = new Vector3(0, -Cushion.tableY, 0)
    let ball = new Ball(pos)
    ball.vel.y = -1
    expect(Cushion.willBounce(ball, t)).to.be.true
    Cushion.bounce(ball, t)
    expect(Cushion.willBounce(ball, t)).to.be.false
    expect(ball.vel.y).to.be.above(0)
    done()
  })
})
