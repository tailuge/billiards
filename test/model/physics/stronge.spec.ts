import { expect } from "chai"
import { spawnSync } from "node:child_process"
import { Vector3 } from "three"
import { stronge, resolve } from "../../../src/model/physics/stronge"
import {
  R,
  I,
  m,
  stronge_e_n,
  stronge_μ,
  stronge_omega_ratio,
} from "../../../src/model/physics/constants"

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

  const describePythonReference =
    process.env.STRONGE_PYTHON_REFERENCE === "1" ? describe : describe.skip

  describePythonReference("Python conductor comparison", () => {
    const gameParams = {
      m,
      R,
      I,
      e_n: stronge_e_n,
      μ: stronge_μ,
      omega_ratio: stronge_omega_ratio,
    }
    const n = new Vector3(-1.0, 0.0, 0.0)

    function runPythonReference(v: Vector3, w: Vector3) {
      const payload = {
        v: v.toArray(),
        w: w.toArray(),
        n: n.toArray(),
        params: {
          m: gameParams.m,
          R: gameParams.R,
          I: gameParams.I,
          e_n: gameParams.e_n,
          mu: gameParams.μ,
          omega_ratio: gameParams.omega_ratio,
        },
      }

      const result = spawnSync(
        "/usr/bin/python3",
        ["conductor/stronge_reference.py", JSON.stringify(payload)],
        {
          cwd: process.cwd(),
          encoding: "utf8",
        }
      )

      if (result.status !== 0) {
        throw new Error(result.stderr || result.stdout)
      }

      return JSON.parse(result.stdout) as {
        v: [number, number, number]
        w: [number, number, number]
        diagnostics: { dv_y: number; dv_t: number; v_t0: number }
      }
    }

    it.each([
      ["pure right-hand side", new Vector3(0.0, 0.0, (1.25 * 0.8) / R)],
      [
        "right-hand side with natural roll",
        new Vector3(0.0, 0.8 / R, (1.25 * 0.8) / R),
      ],
    ])(
      "matches Python for direct X-cushion moderate pace full %s spin",
      (_, w) => {
        const v = new Vector3(0.8, 0.0, 0.0)
        const ts = stronge(v, w, n, gameParams)
        const py = runPythonReference(v, w)

        expect(ts.v.y).to.be.approximately(py.v[1], 1e-10)
        expect(ts.w.z).to.be.approximately(py.w[2], 1e-10)
      }
    )

    it.each([
      [0, new Vector3(0.42, -0.31, 0), new Vector3(1.2, 8.5, -14.0)],
      [1, new Vector3(0.88, 0.17, 0), new Vector3(-3.4, 22.0, 31.0)],
      [2, new Vector3(1.36, -0.64, 0), new Vector3(5.1, -18.0, -46.0)],
      [3, new Vector3(0.71, 0.52, 0), new Vector3(-7.3, 4.0, 12.0)],
      [4, new Vector3(1.92, -0.08, 0), new Vector3(0.6, 33.0, -21.0)],
      [5, new Vector3(0.29, 0.74, 0), new Vector3(9.0, -7.5, 39.0)],
      [6, new Vector3(1.14, -0.27, 0), new Vector3(-1.8, 14.2, 5.5)],
      [7, new Vector3(0.57, 0.03, 0), new Vector3(4.7, -28.0, -33.0)],
      [8, new Vector3(1.63, 0.41, 0), new Vector3(-6.2, 2.8, 47.0)],
      [9, new Vector3(0.96, -0.55, 0), new Vector3(2.5, 19.0, -8.0)],
    ])("matches Python for fixed random sample %s", (_, v, w) => {
      const ts = stronge(v, w, n, gameParams)
      const py = runPythonReference(v, w)

      expect(ts.v.x).to.be.approximately(py.v[0], 1e-8)
      expect(ts.v.y).to.be.approximately(py.v[1], 1e-8)
      expect(ts.v.z).to.be.approximately(py.v[2], 1e-8)
      expect(ts.w.x).to.be.approximately(py.w[0], 1e-8)
      expect(ts.w.y).to.be.approximately(py.w[1], 1e-8)
      expect(ts.w.z).to.be.approximately(py.w[2], 1e-8)
    })
  })
})
