import "mocha"
import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { Table } from "../../src/model/table"
import { Cue } from "../../src/view/cue"
import { Vector3 } from "three"
import { zero } from "../../src/utils/utils"

const t = 0.1
describe("Cue", () => {
  it("no intersection with cue ball", (done) => {
    const a = new Ball(zero)
    const b = new Ball(new Vector3(0, 1, 0))
    const table = new Table([a, b])
    table.advance(t)
    const cue = new Cue()
    cue.moveTo(table.balls[0].pos)
    expect(cue.intersectsAnything(table)).to.be.false
    done()
  })

  it("topspin applied", (done) => {
    const ball = new Ball(new Vector3(0, 1, 0))
    const cue = new Cue()
    cue.aim.verticalOffset = 0.4
    cue.aim.power = 1
    cue.aim.spinOnly = true
    cue.hit(ball)
    expect(ball.rvel.y).to.be.greaterThan(0)
    done()
  })
})
