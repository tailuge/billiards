import { expect } from "chai"
import { Color, Vector3 } from "three"
import { View } from "../../src/view/view"
import { Table } from "../../src/model/table"
import { Rack } from "../../src/utils/rack"
import { initDom, canvas3d } from "./dom"
import { State } from "../../src/model/ball"
import { Assets } from "../../src/view/assets"
import { BallMaterialFactory } from "../../src/view/ballmaterialfactory"

initDom()

describe("View", () => {
  const table = new Table(Rack.diamond())

  it("onBeforeCompile coverage", () => {
    const material = BallMaterialFactory.createProjectedMaterial(1, new Color(0xff0000))
    const shader = {
      uniforms: {} as any,
      vertexShader: "#include <common>\n#include <begin_vertex>",
      fragmentShader: "#include <common>\n#include <color_fragment>"
    }
    material.onBeforeCompile!(shader, {} as any)
    expect(shader.uniforms).to.have.property("invScale")
    expect(shader.vertexShader).to.contain("vLocalPosition")
    expect(shader.fragmentShader).to.contain("invScale")
  })

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

  it("ball mesh arrows coverage", () => {
    const ball = table.balls[0]
    ball.ballmesh.spinAxisArrow.visible = true
    ball.rvel.set(1, 0, 0)
    ball.state = State.Rolling
    ball.updateMesh(0.01)
    expect(ball.ballmesh.spinAxisArrow.position.x).to.equal(ball.pos.x)

    // Test stationary with arrows visible
    ball.rvel.set(0, 0, 0)
    ball.updateMesh(0.01)

    // Test sliding state
    ball.rvel.set(0.1, 0, 0)
    ball.state = State.Sliding
    ball.updateMesh(0.01)
  })

  it("table geometry coverage", () => {
    // Force a case where pocketGeometries are used
    table.hasPockets = true
    const view = new View(canvas3d, table, Assets.localAssets())
    expect(view).to.be.not.null
  })
})
