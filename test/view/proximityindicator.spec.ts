import { expect as chaiExpect } from "chai"
import { initDom } from "./dom"
import { ProximityIndicator } from "../../src/view/proximityindicator"
import { R } from "../../src/model/physics/constants"
import { Vector3 } from "three"

initDom()

describe("ProximityIndicator", () => {
  let indicator: ProximityIndicator

  beforeEach(() => {
    indicator = new ProximityIndicator()
  })

  it("fills advance inward as distance decreases", () => {
    indicator.setProximity(3.5 * R) // inside 4R ring only
    chaiExpect(indicator["fills"][0].visible).to.be.true
    chaiExpect(indicator["fills"][1].visible).to.be.false
    chaiExpect(indicator["fills"][2].visible).to.be.false

    indicator.setProximity(2.5 * R) // inside 3R ring
    chaiExpect(indicator["fills"][1].visible).to.be.true
    chaiExpect(indicator["fills"][2].visible).to.be.false
  })

  it("ratchet: fills do not retreat when distance increases", () => {
    indicator.setProximity(2.5 * R) // inside 3R ring
    chaiExpect(indicator["fills"][0].visible).to.be.true
    chaiExpect(indicator["fills"][1].visible).to.be.true

    indicator.setProximity(3.5 * R) // ball moves away - should not reduce fills
    chaiExpect(indicator["fills"][0].visible).to.be.true
    chaiExpect(indicator["fills"][1].visible).to.be.true
  })

  it("hide resets ratchet", () => {
    indicator.setProximity(2.5 * R)
    indicator.hide()
    indicator.setProximity(3.5 * R) // after reset, only outer ring
    chaiExpect(indicator["fills"][0].visible).to.be.true
    chaiExpect(indicator["fills"][1].visible).to.be.false
  })

  it("positions text at a fixed distance 4R from ball center toward table center", () => {
    const pos = new Vector3(1, 1, 0)
    indicator.showAt(pos)

    indicator["proximityTexts"].forEach((textMesh) => {
      // Distance from group center (ball center) to textMesh position (XY only)
      const distanceXY = Math.sqrt(
        textMesh.position.x ** 2 + textMesh.position.y ** 2
      )
      chaiExpect(distanceXY).to.be.closeTo(4 * R, 0.0001)

      // Direction should be toward (0,0,0) from (1,1,0), which is (-1,-1,0)
      const direction = new Vector3(
        textMesh.position.x,
        textMesh.position.y,
        0
      ).normalize()
      const expectedDirection = new Vector3(-1, -1, 0).normalize()
      chaiExpect(direction.x).to.be.closeTo(expectedDirection.x, 0.0001)
      chaiExpect(direction.y).to.be.closeTo(expectedDirection.y, 0.0001)
    })
  })
})
