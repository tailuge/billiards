import "mocha"
import { expect } from "chai"
import { Ball } from "../src/ball"
import { Cushion } from "../src/cushion"
import { Vector3 } from "three"

let epsilon = 0.0001
let zero = new Vector3()

describe("Ball", () => {
  it("initialises and is stationary", done => {
    let pos = new Vector3(1, 2, 0)
    let ball = new Ball(pos)
    expect(ball.pos).to.deep.equal(pos)
    expect(ball.vel).to.deep.equal(zero)
    expect(ball.rpos).to.deep.equal(new Vector3(0, 0, 1))
    expect(ball.rvel).to.deep.equal(zero)
    done()
  })

  it("stationary remains stationary after time step", done => {
    let pos = new Vector3(1, 2, 0)
    let ball = new Ball(pos)
    ball.update(1)
    expect(ball.pos).to.deep.equal(pos)
    expect(ball.vel).to.deep.equal(zero)
    expect(ball.rpos.distanceTo(new Vector3(0, 0, 1))).to.be.below(epsilon)
    expect(ball.rvel).to.deep.equal(zero)
    done()
  })

  it("bounces off X cushion", done => {
    let pos = new Vector3(Cushion.tableX, 0, 0)
    let ball = new Ball(pos)
    ball.vel.x = 1
    ball.update(0.1)
    expect(ball.vel.x).to.be.below(0)
    done()
  })
  
  it("bounces off Y cushion", done => {
    let pos = new Vector3(0, Cushion.tableY, 0)
    let ball = new Ball(pos)
    ball.vel.y = 1
    ball.update(0.1)
    expect(ball.vel.y).to.be.below(0)
    done()
  })

})
