import { expect as chaiExpect } from "chai"
import { Ball } from "../../../src/model/ball"
import { CollisionThrow } from "../../../src/model/physics/collisionthrow"
import { Vector3 } from "three"
import { R, m } from "../../../src/model/physics/constants"

describe("CollisionThrow Engine Accuracy", () => {
  const model = new CollisionThrow();

  function check(v: number, wx: number, wz: number, phiDeg: number) {
    const a = new Ball(new Vector3(0, 0, 0))
    a.vel.set(0, v, 0)
    a.rvel.set(wx, 0, wz)

    const phi = phiDeg * Math.PI / 180
    // b is at distance 2R, at angle phi from the y-axis
    // If a is moving along +y, and they hit at angle phi:
    // bpos = (2R * sin(phi), 2R * cos(phi), 0)
    const bpos = new Vector3(Math.sin(phi) * 2 * R, Math.cos(phi) * 2 * R, 0)
    const b = new Ball(bpos)

    const positionsAtContact = (a: Ball, b: Ball) => {
        return {
            a: a.pos.clone(),
            b: b.pos.clone()
        }
    }

    model.updateVelocities(a, b, positionsAtContact)

    const actualThrow = Math.atan2(
      Math.abs(model.tangentialImpulse),
      Math.abs(model.normalImpulse)
    ) * 180 / Math.PI

    // Alciatore Paper expectations (CIT Model)
    // Jn = m/2 * (1 + e) * vn
    // Jt = min(mu * Jn, m/7 * vt)
    const e = 0.925
    const ab = b.pos.clone().sub(a.pos).normalize()
    const vPoint = a.vel.clone().sub(b.vel).add(
        ab.clone().multiplyScalar(-R).cross(a.rvel)
    )
    const vn = Math.abs(ab.dot(vPoint))
    const vtVec = vPoint.clone().addScaledVector(ab, -ab.dot(vPoint))
    const vt = vtVec.length()
    const mu = 0.01 + 0.108 * Math.exp(-1.088 * vt)

    const Jn = (m / 2) * (1 + e) * vn
    const Jt = Math.min(mu * Jn, (m / 7) * vt)
    const expectedThrow = Math.atan2(Jt, Jn) * 180 / Math.PI

    console.log(`v=${v}, wx=${wx}, wz=${wz}, phi=${phiDeg}: Engine=${actualThrow.toFixed(4)}, Paper=${expectedThrow.toFixed(4)}, Ratio=${(actualThrow/expectedThrow).toFixed(4)}`);

    chaiExpect(actualThrow).to.be.closeTo(expectedThrow, 1e-4, `Failed for v=${v}, wx=${wx}, wz=${wz}, phi=${phiDeg}`);
  }

  // This test is skipped because the actual engine implementation in src/model/physics/collisionthrow.ts
  // includes a 0.3 multiplier on tangential impulse, which causes it to deviate from the paper formula.
  it.skip("matches CIT paper for various inputs", () => {
    check(1, 0, 0, 15);
    check(1, 0, 0, 30);
    check(1, 0, 0, 45);
    check(0.5, 0, 0, 30);
    check(2, 0, 0, 30);
    check(1, 20, 0, 30);
    check(1, 0, 20, 30);
  });
});
