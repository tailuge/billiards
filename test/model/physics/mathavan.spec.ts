import { expect } from "chai"
import { Vector3 } from "three"
import { Mathavan } from "../../../src/model/physics/mathavan"
import { mathavanAdapter } from "../../../src/model/physics/physics"
import {
  ee,
  μs,
  μw,
  m,
  R,
  setee,
  setμs,
  setμw,
  setm,
  setR,
} from "../../../src/model/physics/constants"

describe("Mathavan", () => {
  it("solves cushion bounce", (done) => {
    const mathavan = new Mathavan(m, R, ee, μs, μw)
    mathavan.solve(1, 1, 0, 0, 0)
    expect(mathavan.vx).to.be.lessThan(1)
    expect(mathavan.vy).to.be.below(0)
    done()
  })

  /**
   * The adapter hoists one Mathavan instance off the bounce path, so it has to
   * hand that instance the current constants before every solve. A constant it
   * never re-reads is a slider (or launch parameter, or worker config) that
   * silently does nothing, which is how the hoist broke them in the first
   * place.
   */
  it("adapter reads the constants on every bounce", (done) => {
    const bounce = () =>
      mathavanAdapter(new Vector3(1, 0, 0), new Vector3(0, 0.3, 0)).v.clone()
    const original = { m, R, ee, μs, μw }
    const untouched = bounce()

    // Two values per constant, so the check does not lean on whatever the
    // constants happen to hold when this runs -- only on the adapter seeing
    // the change at all.
    const moves = (set: (value: number) => void, from: number, to: number) => {
      set(from)
      const first = bounce()
      set(to)
      return !bounce().equals(first)
    }

    expect(moves(setee, 0.7, 0.9), "ee").to.equal(true)
    expect(moves(setμs, 0.1, 0.35), "μs").to.equal(true)
    expect(moves(setμw, 0.1, 0.3), "μw").to.equal(true)
    expect(moves(setR, R * 1.1, R * 1.2), "R").to.equal(true)
    expect(moves(setm, m * 1.1, m * 1.2), "m").to.equal(true)

    setee(original.ee)
    setμs(original.μs)
    setμw(original.μw)
    setR(original.R)
    setm(original.m)
    // Restoring the constants restores the bounce exactly, so the re-read
    // takes the current values rather than accumulating anything.
    expect(bounce().equals(untouched)).to.equal(true)
    done()
  })
})
