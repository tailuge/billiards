import { expect } from "chai"
import { Vector3 } from "three"
import { CollisionThrowPlot } from "../../src/diagram/throw_gpt4o"
import { Ball } from "../../src/model/ball"
import { Collision } from "../../src/model/physics/collision"
import { R, setm, setR } from "../../src/model/physics/constants"
import { up, zero } from "../../src/utils/three-utils"

// Same parameter prelude as the other diagrams on the mathavan page, which
// resize the ball to Mathavan's 0.02625 m. The throw harness must pick this up.
setm(0.1406)
setR(0.02625)

const toRad = (x: number) => x * (Math.PI / 180)
const toDeg = (x: number) => x * (180 / Math.PI)

const speeds = [0.447, 1.341, 3.129]

function throwAt(v: number, alpha: number) {
  const a = new Ball(zero)
  a.vel.copy(new Vector3(0, v, 0))
  const bpos = new Vector3(0, 2 * CollisionThrowPlot.R).applyAxisAngle(
    up,
    toRad(alpha)
  )
  Collision.model.updateVelocities(a, new Ball(bpos))
  return toDeg(
    Math.atan2(
      Collision.model.tangentialImpulse,
      -Collision.model.normalImpulse
    )
  )
}

describe("CollisionThrowPlot", () => {
  it("uses the engine ball radius for the contact geometry", (done) => {
    expect(CollisionThrowPlot.R).to.equal(R)
    setR(0.03275)
    expect(CollisionThrowPlot.R).to.be.closeTo(0.03275, 1e-9)
    setR(0.02625)
    expect(CollisionThrowPlot.R).to.be.closeTo(R, 1e-9)
    done()
  })

  it("has no discontinuity in throw vs cut angle", (done) => {
    speeds.forEach((v) => {
      // Balls are placed exactly in contact, so the contact point must stay on
      // the line of centres at every cut angle - no jump at the angle where the
      // cue ball's path would no longer reach the object ball.
      for (let alpha = 40; alpha < 90; alpha += 0.25) {
        const step = Math.abs(throwAt(v, alpha + 0.25) - throwAt(v, alpha))
        expect(step).to.be.below(0.02)
      }
    })
    done()
  })

  it("throws more at medium cut angles than at very thin ones", (done) => {
    speeds.forEach((v) => {
      expect(throwAt(v, 35)).to.be.above(throwAt(v, 89))
    })
    done()
  })
})
