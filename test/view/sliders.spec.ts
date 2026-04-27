import { expect } from "chai"
import { initDom } from "./dom"
import { Sliders } from "../../src/view/sliders"
import { fireEvent } from "@testing-library/dom"
import { R } from "../../src/model/physics/constants"

initDom()

describe("Sliders", () => {
  it("initialise from query params", () => {
    window.history.pushState({}, "Test", "?R=0.5&m=0.3")

    new Sliders(() => {})
    const rSlider = document.getElementById("R") as HTMLInputElement
    const mSlider = document.getElementById("m") as HTMLInputElement
    expect(rSlider.value).to.be.equal("0.5")
    expect(mSlider.value).to.be.equal("0.3")
  })

  it("adjust slider", (done) => {
    const sliders = new Sliders(() => {})
    sliders.toggleVisibility()
    const slider = document.getElementById("R") as HTMLInputElement
    fireEvent.input(slider, { target: { value: 1 } })
    expect(R).to.be.equal(1)
    done()
  })
})
