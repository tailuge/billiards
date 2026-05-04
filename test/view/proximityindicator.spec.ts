import { expect } from "chai"
import { initDom } from "./dom"
import { ProximityIndicator } from "../../src/view/proximityindicator"
import { R } from "../../src/model/physics/constants"

initDom()

describe("ProximityIndicator", () => {
  let indicator: ProximityIndicator

  beforeEach(() => {
    indicator = new ProximityIndicator()
  })

  it("fills advance inward as distance decreases", () => {
    indicator.setProximity(3.5 * R) // inside 4R ring only
    expect(indicator["fills"][0].visible).to.be.true
    expect(indicator["fills"][1].visible).to.be.false
    expect(indicator["fills"][2].visible).to.be.false

    indicator.setProximity(2.5 * R) // inside 3R ring
    expect(indicator["fills"][1].visible).to.be.true
    expect(indicator["fills"][2].visible).to.be.false
  })

  it("ratchet: fills do not retreat when distance increases", () => {
    indicator.setProximity(2.5 * R) // inside 3R ring
    expect(indicator["fills"][0].visible).to.be.true
    expect(indicator["fills"][1].visible).to.be.true

    indicator.setProximity(3.5 * R) // ball moves away - should not reduce fills
    expect(indicator["fills"][0].visible).to.be.true
    expect(indicator["fills"][1].visible).to.be.true
  })

  it("hide resets ratchet", () => {
    indicator.setProximity(2.5 * R)
    indicator.hide()
    indicator.setProximity(3.5 * R) // after reset, only outer ring
    expect(indicator["fills"][0].visible).to.be.true
    expect(indicator["fills"][1].visible).to.be.false
  })
})
