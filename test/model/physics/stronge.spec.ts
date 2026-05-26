import { expect } from "chai"
import { Vector3 } from "three"
import { stronge, resolve } from "../../../src/model/physics/stronge"

describe("Stronge Cushion Model", () => {
  const params = {
    m: 0.23,
    R: 0.03275,
    I: 0.4 * 0.23 * 0.03275 * 0.03275,
    e_n: 0.7,
    μ: 0.2,
    omega_ratio: 1.7,
  }

  describe("Scalar resolve() checks", () => {
    it("handles Head-on collision (Initial stick regime)", (done) => {
      const [v_tf, v_nf] = resolve(0.0, -1.0, params)
      expect(v_tf).to.be.approximately(0.0, 1e-7)
      expect(v_nf).to.be.approximately(0.7, 1e-7)
      done()
    })

    it("handles High side-spin collision (Gross slip regime)", (done) => {
      const [v_tf, v_nf] = resolve(-3.0, -1.0, params)
      // Python output for v_t0=-3, v_n0=-1: vt=-1.8099999999999998, vn=0.7
      expect(v_tf).to.be.approximately(-1.81, 1e-7)
      expect(v_nf).to.be.approximately(0.7, 1e-7)
      done()
    })

    it("handles Moderate side-spin collision (Slip-stick-slip regime)", (done) => {
      const [v_tf, v_nf] = resolve(-0.5, -1.0, params)
      // Python output for v_t0=-0.5, v_n0=-1: vt=0.3291142832763286, vn=0.7
      expect(v_tf).to.be.approximately(0.329114283, 1e-7)
      expect(v_nf).to.be.approximately(0.7, 1e-7)
      done()
    })
  })

  describe("Vector stronge() checks against Python reference", () => {
    const n = new Vector3(-1.0, 0.0, 0.0)

    it("Case: Head-on", (done) => {
      const v = new Vector3(1.0, 0.0, 0.0)
      const w = new Vector3(0.0, 0.0, 0.0)
      const deltas = stronge(v, w, n, params)

      expect(deltas.v.x).to.be.approximately(-1.7, 1e-7)
      expect(deltas.v.y).to.be.approximately(0.0, 1e-7)
      expect(deltas.v.z).to.be.approximately(0.0, 1e-7)
      expect(deltas.w.x).to.be.approximately(0.0, 1e-7)
      expect(deltas.w.y).to.be.approximately(0.0, 1e-7)
      expect(deltas.w.z).to.be.approximately(0.0, 1e-7)
      done()
    })

    it("Case: High side-spin", (done) => {
      const v = new Vector3(1.0, 0.5, 0.0)
      const w = new Vector3(0.0, 0.0, -10.0)
      const deltas = stronge(v, w, n, params)

      // Delta v: (-1.7, -0.06819102304096644, -0.0)
      // Delta w: (0.0, 0.0, -5.205421606180644)
      expect(deltas.v.x).to.be.approximately(-1.7, 1e-7)
      expect(deltas.v.y).to.be.approximately(-0.068191023, 1e-7)
      expect(deltas.v.z).to.be.approximately(0.0, 1e-7)
      expect(deltas.w.x).to.be.approximately(0.0, 1e-7)
      expect(deltas.w.y).to.be.approximately(0.0, 1e-7)
      expect(deltas.w.z).to.be.approximately(-5.205421606, 1e-7)
      done()
    })

    it("Case: Moderate side-spin", (done) => {
      const v = new Vector3(1.0, 0.2, 0.0)
      const w = new Vector3(0.0, 0.0, -2.0)
      const deltas = stronge(v, w, n, params)

      // Delta v: (-1.7, -0.051606898062282594, -0.0)
      // Delta w: (0.0, 0.0, -3.939457867349816)
      expect(deltas.v.x).to.be.approximately(-1.7, 1e-7)
      expect(deltas.v.y).to.be.approximately(-0.051606898, 1e-7)
      expect(deltas.v.z).to.be.approximately(0.0, 1e-7)
      expect(deltas.w.x).to.be.approximately(0.0, 1e-7)
      expect(deltas.w.y).to.be.approximately(0.0, 1e-7)
      expect(deltas.w.z).to.be.approximately(-3.939457867, 1e-7)
      done()
    })

    it("Case: Side-spin with wy (3D)", (done) => {
      const v = new Vector3(1.0, 0.0, 0.0)
      const w = new Vector3(0.0, 5.0, 0.0)
      const deltas = stronge(v, w, n, params)

      // Delta v: (-1.7, 0.0, -0.0)
      // Delta w: (-0.0, -4.909064176164999, -0.0)
      expect(deltas.v.x).to.be.approximately(-1.7, 1e-7)
      expect(deltas.v.y).to.be.approximately(0.0, 1e-7)
      expect(deltas.v.z).to.be.approximately(0.0, 1e-7)
      expect(deltas.w.x).to.be.approximately(0.0, 1e-7)
      expect(deltas.w.y).to.be.approximately(-4.909064176, 1e-7)
      expect(deltas.w.z).to.be.approximately(0.0, 1e-7)
      done()
    })

    it("Case: Natural roll into cushion", (done) => {
      const v = new Vector3(1.0, 0.0, 0.0)
      const w = new Vector3(0.0, 1.0 / params.R, 0.0) // natural roll: wy = v/R
      const deltas = stronge(v, w, n, params)

      const vx_final = v.x + deltas.v.x
      expect(vx_final).to.be.approximately(-0.7, 0.01)
      done()
    })
  })
})
