import { expect } from "chai"
import { AimInputs } from "../../src/view/aiminputs"
import { initDom, canvas3d } from "./dom"
import { Container } from "../../src/container/container"
import { fireEvent } from "@testing-library/dom"
import { Assets } from "../../src/view/assets"
import { Session } from "../../src/network/client/session"

initDom()

describe("AimInput", () => {
  let container: Container
  let aiminputs: AimInputs

  beforeEach(function (done) {
    initDom()
    container = new Container({
      element: canvas3d,
      log: (_) => {},
      assets: Assets.localAssets(),
    })
    aiminputs = container.table.cue.aimInputs
    done()
  })

  it("adjust spin", (done) => {
    const e = { buttons: 1, offsetX: 1, offsetY: 1 }
    fireEvent.click(aiminputs.cueBallElement)
    aiminputs.mousemove(e)
    expect(aiminputs.cueHitElement).to.be.not.null
    done()
  })

  it("adjust power", (done) => {
    aiminputs.setDisabled(false)
    aiminputs.cuePowerElement.value = "1"
    fireEvent.input(aiminputs.cuePowerElement, { target: { value: "1" } })
    expect(container.table.cue.aim.power).to.be.greaterThan(0)
    expect(
      aiminputs.cuePowerElement.style.getPropertyValue("--progress")
    ).to.equal("100%")
    done()
  })

  it("click hit button", (done) => {
    aiminputs.setDisabled(false)
    document.getElementById("cueHit")?.click()
    expect(aiminputs.container.inputQueue).to.be.not.empty
    done()
  })

  it("mouse wheel updates power", (done) => {
    aiminputs.setDisabled(false)
    const initialPower = Number(aiminputs.cuePowerElement.value)
    aiminputs.mousewheel({ deltaY: 10 })
    expect(Number(aiminputs.cuePowerElement.value)).to.not.equal(initialPower)
    expect(aiminputs.cuePowerElement.style.getPropertyValue("--progress")).to
      .not.be.empty
    done()
  })

  it("spectator mode disables hit button, power and spin controls", (done) => {
    Session.init("id", "name", "table", true)
    const spectatorAimInputs = new AimInputs(container)
    expect(spectatorAimInputs.cueHitElement.disabled).to.be.true
    expect(spectatorAimInputs.cuePowerElement.disabled).to.be.true
    expect(spectatorAimInputs.cueBallElement.style.pointerEvents).to.equal(
      "none"
    )
    spectatorAimInputs.setDisabled(false)
    expect(spectatorAimInputs.cueHitElement.disabled).to.be.true
    expect(spectatorAimInputs.cuePowerElement.disabled).to.be.true
    expect(spectatorAimInputs.cueBallElement.style.pointerEvents).to.equal(
      "none"
    )
    Session.reset()
    done()
  })

  it("setDisabled toggles hit, spin and power controls", (done) => {
    aiminputs.setDisabled(true)
    expect(aiminputs.cueHitElement.disabled).to.be.true
    expect(aiminputs.cuePowerElement.disabled).to.be.true
    expect(aiminputs.cueBallElement.style.pointerEvents).to.equal("none")

    aiminputs.setDisabled(false)
    expect(aiminputs.cueHitElement.disabled).to.be.false
    expect(aiminputs.cuePowerElement.disabled).to.be.false
    expect(aiminputs.cueBallElement.style.pointerEvents).to.equal("auto")
    done()
  })

  it("disabled controls ignore spin and power input events", (done) => {
    aiminputs.setDisabled(true)
    const initialPower = container.table.cue.aim.power
    const initialOffset = container.table.cue.aim.offset.clone()

    aiminputs.cuePowerElement.value = 1
    aiminputs.powerChanged({})
    aiminputs.mousewheel({ deltaY: 10 })
    aiminputs.adjustSpin({ offsetX: 1, offsetY: 1 })

    expect(container.table.cue.aim.power).to.equal(initialPower)
    expect(container.table.cue.aim.offset.equals(initialOffset)).to.be.true
    done()
  })
})
