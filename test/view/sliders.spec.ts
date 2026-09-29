import { expect } from "chai"
import { Sliders } from "../../src/view/sliders"
import { resolve, omega_ratio_bounds } from "../../src/model/physics/stronge"
import {
  stronge_omega_ratio,
  setstronge_omega_ratio,
} from "../../src/model/physics/constants"

/**
 * `stronge_omega_ratio` is the one constant the solver refuses to run outside
 * of an open interval, so it is also the one constant whose slider has to be
 * narrower than the generic `min(step, 4 x seeded, 2)` rule. These tests pin
 * that down: the failure they guard against is an uncaught throw from
 * `Cushion.bounceIn` on the first cushion contact, long after the user let go
 * of the slider, which makes it very hard to attribute back to the slider.
 */
describe("Sliders domain", () => {
  const step = 0.0001

  const setupDom = () => {
    document.body.innerHTML = `
      <input id="stronge_omega_ratio" type="range" />
      <label for="stronge_omega_ratio"></label>
    `
  }

  const slider = () =>
    document.getElementById("stronge_omega_ratio") as HTMLInputElement

  afterEach(() => {
    setstronge_omega_ratio(stronge_omega_ratio)
    window.history.replaceState({}, "", "/")
    document.body.innerHTML = ""
  })

  it("keeps the omega_ratio slider inside the solver's open interval", (done) => {
    setupDom()
    new Sliders()

    const min = Number.parseFloat(slider().min)
    const max = Number.parseFloat(slider().max)

    expect(min).to.be.greaterThan(omega_ratio_bounds.min)
    expect(max).to.be.lessThan(omega_ratio_bounds.max)
    done()
  })

  it("accepts every value the omega_ratio slider can reach", (done) => {
    // The regression, stated as a property rather than a single value: walk the
    // slider end to end and require the solver to accept all of it. With the
    // old domain of [0.0001, 2] the first and last steps threw.
    setupDom()
    new Sliders()

    const min = Number.parseFloat(slider().min)
    const max = Number.parseFloat(slider().max)
    const base = { m: 0.23, e_n: 0.7, μ: 0.2 }

    const rejected: number[] = []
    for (let v = min; v <= max; v += step) {
      try {
        resolve(-0.5, -1.0, { ...base, omega_ratio: v })
      } catch {
        rejected.push(v)
      }
    }

    expect(rejected).to.deep.equal([])
    done()
  })

  it("clamps a launch parameter that names an out-of-range value", (done) => {
    // `?stronge_omega_ratio=2` used to be handed straight to the setter: the
    // assignment to `input.value` clamped the control, but the constant kept
    // the out-of-range number, so the page threw on the first cushion contact.
    // The control and the physics have to end up agreeing on the same number.
    window.history.replaceState({}, "", "/?stronge_omega_ratio=2")
    setupDom()
    new Sliders()

    const seeded = Number.parseFloat(slider().value)
    expect(seeded).to.be.lessThan(omega_ratio_bounds.max)
    expect(() =>
      resolve(-0.5, -1.0, { m: 0.23, e_n: 0.7, μ: 0.2, omega_ratio: seeded })
    ).to.not.throw()
    done()
  })

  it("leaves the other constants on the generic domain", (done) => {
    // The bounds are a per-constant opt-in; nothing else should have moved.
    document.body.innerHTML = `
      <input id="ee" type="range" />
      <label for="ee"></label>
    `
    new Sliders()

    const ee = document.getElementById("ee") as HTMLInputElement
    expect(ee.min).to.equal(`${step}`)
    expect(Number.parseFloat(ee.max)).to.equal(
      Math.min(Number.parseFloat(ee.value) * 4, 2)
    )
    done()
  })
})
