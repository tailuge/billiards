import { expect } from "chai"
import { View } from "../../src/view/view"
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"
import { initDom, canvas3d } from "./dom"
import { State } from "../../src/model/ball"
import { Assets } from "../../src/view/assets"

initDom()

describe("View", () => {
  const table = new Table(Rack.diamond())

  it("isInView", (done) => {
    table.hasPockets = true
    const view = new View(canvas3d, table, Assets.localAssets())
    expect(view.isInMotionNotVisible()).to.be.false
    done()
  })

  it("loads three cushion assets", (done) => {
    table.hasPockets = false
    const view = new View(canvas3d, table, Assets.localAssets("threecushion"))
    expect(view).to.be.not.null
    done()
  })

  it("without assets", (done) => {
    table.hasPockets = false
    const view = new View(canvas3d, table, Assets.localAssets())
    expect(view.isInMotionNotVisible()).to.be.false
    done()
  })

  it("ball not in view", (done) => {
    table.hasPockets = false
    const ball = table.balls[3]
    ball.pos.x = -1.2
    ball.pos.y = 0.62
    ball.state = State.Sliding
    ball.vel.x = 1
    ball.updateMesh(0.01)
    const view = new View(canvas3d, table, Assets.localAssets())
    view.render()
    view.ballToCheck = 3
    expect(view.isInMotionNotVisible()).to.be.false
    done()
  })
})
