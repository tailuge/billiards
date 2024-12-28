import { expect } from "chai"
import { initDom } from "./dom"
import { Sliders } from "../../src/view/sliders"
import { fireEvent } from "@testing-library/dom"
import { R } from "../../src/model/physics/constants"

initDom()

describe("Sliders", () => {
  it("adjust slider", (done) => {
    const sliders = new Sliders(() => {})
    sliders.toggleVisibility()
    const slider = document.getElementById("R") as HTMLInputElement
    fireEvent.input(slider, { target: { value: 1 } })
    expect(R).to.be.equal(1)
    done()
  })
})
