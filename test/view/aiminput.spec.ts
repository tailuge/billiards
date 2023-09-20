import "mocha"
import { expect } from "chai"
import { AimInputs } from "../../src/view/aiminputs"
// @ts-ignore
import html from "../../dist/index.html"
document.body.innerHTML = html

describe("Trace", () => {
  const aiminputs = new AimInputs(null)

  it("initialise", (done) => {
    expect(aiminputs.cueHitElement).to.be.not.null
    done()
  })
})
