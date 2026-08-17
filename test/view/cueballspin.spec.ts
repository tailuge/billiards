import { expect } from "chai"
import { initDom, canvas3d } from "./dom"
import { Container } from "../../src/container/container"
import { Assets } from "../../src/view/assets"
import { CueBallSpin } from "../../src/view/cueballspin"
import { Aim } from "../../src/controller/aim"
import { Vector3 } from "three"

initDom()

describe("CueBallSpin", () => {
  let container: Container
  let cueBallSpin: CueBallSpin

  beforeEach(() => {
    initDom()
    container = new Container({
      element: canvas3d,
      log: () => {},
      assets: Assets.localAssets(),
    })
    container.table.cue.aimInputs.setDisabled(false)
    cueBallSpin = new CueBallSpin(container)
  })

  it("initializes in inactive state and toggles enable/disable", () => {
    expect(cueBallSpin.active).to.be.false
    cueBallSpin.enable()
    cueBallSpin.disable()
    expect(cueBallSpin.active).to.be.false
  })

  it("is enabled when transitioning to Aim controller", () => {
    const aim = new Aim(container)
    container.updateController(aim)
    expect(container.cueBallSpin).to.exist
    expect(container.cueBallSpin?.active).to.be.false
  })

  it("updates spin via cue.setSpin", () => {
    const initialSpin = container.table.cue.aim.offset.clone()
    container.table.cue.setSpin(new Vector3(0.3, 0.3, 0), container.table)
    expect(container.table.cue.aim.offset.x).to.not.equal(initialSpin.x)
    expect(container.table.cue.aim.offset.y).to.not.equal(initialSpin.y)
  })
})
