import { expect } from "chai"
import { Vector3 } from "three"
import {
  stronge,
  strongeAdapter,
  resolve,
} from "../../../src/model/physics/stronge"

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
      expect(v_tf).to.be.approximately(-1.81, 1e-7)
      expect(v_nf).to.be.approximately(0.7, 1e-7)
      done()
    })

    it("handles Moderate side-spin collision (Slip-stick-slip regime)", (done) => {
      const [v_tf, v_nf] = resolve(-0.5, -1.0, params)
      expect(v_tf).to.be.approximately(-0.30859459, 1e-7)
      expect(v_nf).to.be.approximately(0.7, 1e-7)
      done()
    })
  })

  describe("Vector stronge() checks", () => {
    it("resolves direct impact with normal vector", (done) => {
      const v = new Vector3(1.0, 0.0, 0.0)
      const w = new Vector3(0.0, 0.0, 0.0)
      // Normal points from cushion to ball (so -x direction if cushion is at +x)
      const n = new Vector3(-1.0, 0.0, 0.0)

      const state = stronge(v, w, n, params)
      // Normal component: v_n0 = n.dot(v) = -1.0. v_nf should be 0.7, so v_n_new = -0.7.
      // Reconstructed: v_n_new * n = -0.7 * (-1, 0, 0) = (0.7, 0, 0).
      // Tangent component: v_t0 = 0. v_tf = 0, so v_t_new = 0.
      expect(state.v.x).to.be.approximately(-0.7, 1e-7)
      expect(state.v.y).to.be.approximately(0.0, 1e-7)
      expect(state.v.z).to.be.approximately(0.0, 1e-7)
      expect(state.w.length()).to.be.approximately(0.0, 1e-7)
      done()
    })

    it("resolves moderate side-spin impact with spin transfer", (done) => {
      // Ball travelling at angle with spin
      const v = new Vector3(1.0, 0.5, 0.0) // travelling +x, +y
      const w = new Vector3(0.0, 0.0, 0.0)
      const n = new Vector3(-1.0, 0.0, 0.0)

      const state = stronge(v, w, n, params)
      // Tangent direction is +y direction (since V_c has +y velocity).
      // Rebound tangential velocity will be affected.
      expect(state.v.x).to.be.approximately(-0.7, 1e-7)
      expect(state.v.y).to.not.equal(0.5)
      expect(state.w.z).to.not.equal(0)
      done()
    })
  })

  describe("strongeAdapter() checks", () => {
    it("resolves using default constants from constants.ts", (done) => {
      const v = new Vector3(1.0, -0.5, 0.0)
      const w = new Vector3(0.0, 0.0, 0.0)
      const deltas = strongeAdapter(v, w)

      expect(deltas.v.length()).to.be.greaterThan(0)
      expect(deltas.w.length()).to.be.greaterThan(0)
      done()
    })

    // Convention matches bounceHan test in physics.spec.ts:
    // ball travels +x into cushion at +x wall, w.z = -5 = right-hand (clockwise) spin.
    // Friction at contact transfers momentum: ball should deflect in -y (delta.v.y < 0).
    it("right-hand spin (w.z < 0) deflects ball in -y on bounce", (done) => {
      const v = new Vector3(1.0, 0.0, 0.0)
      const w = new Vector3(0.0, 0.0, -5.0)
      const deltas = strongeAdapter(v, w)
      expect(deltas.v.y).to.be.lessThan(0)
      done()
    })
  })
})
