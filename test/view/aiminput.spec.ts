import "mocha"
import { expect } from "chai"
import { AimInputs } from "../../src/view/aiminputs"
import { initDom } from "./dom"

initDom()

describe("Trace", () => {
  const aiminputs = new AimInputs(null)

  it("initialise", (done) => {
    expect(aiminputs.cueHitElement).to.be.not.null
    done()
  })
})
