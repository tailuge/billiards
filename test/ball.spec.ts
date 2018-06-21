import "mocha"
import { expect } from "chai"
import { Ball } from "../src/ball"
import { Vector3 } from "three"

describe("Ball", () => {
  it("initialises and is stationary", done => {
    let ball = new Ball(new Vector3(1, 2, 0))
    expect(ball.pos).to.deep.equal(new Vector3(1, 2, 0))
    expect(ball.vel).to.deep.equal(new Vector3(0, 0, 0))
    expect(ball.rpos).to.deep.equal(new Vector3(0, 0, 1))
    expect(ball.rvel).to.deep.equal(new Vector3(0, 0, 0))
    done()
  })
})
