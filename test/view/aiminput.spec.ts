import "mocha"
import { expect } from "chai"
import { AimInputs } from "../../src/view/aiminputs"
describe("Trace", () => {
  
  document.body.innerHTML = `<button id="cueHit" type="button"></button>
  <div>
    <div id="cueBall">
      <div id="cueTip"></div>
    </div>
  </div>
  <input id="cuePower"/>`

  const aiminputs = new AimInputs(null)

  it("initialise", (done) => {
    expect(aiminputs.cueHitElement).to.be.not.null
    done()
  })
})
