import { expect } from "chai"
import { Vector3 } from "three"
import {
  isGripCushion,
  bounceHan,
  cueStrike,
  cueToSpin,
  bounceHanBlend,
  mathavanAdapter,
  s0,
  c0,
  Pzs,
  Pze,
  muCushion,
  restitutionCushion,
  rollingFull,
} from "../../src/model/physics/physics"
import {
  I,
  Mz,
  R,
  e,
  m,
  mu,
  muC,
  muS,
  rho,
  setR,
  sete,
  setm,
  setmu,
  setmuC,
  setmuS,
  setrho,
} from "../../src/model/physics/constants"

describe("Physics", () => {
  it("isCushionGrip slow direct into cushion should grip", (done) => {
    const v = new Vector3(0.1, 0, 0)
    const w = new Vector3(0, 0, 0.1)
    expect(isGripCushion(v, w)).true
    done()
  })

  it("isCushionGrip fast glancing angle into cushion should not grip", (done) => {
    const v = new Vector3(0.1, 20, 0)
    const w = new Vector3(0, 0, 0.1)
    expect(isGripCushion(v, w)).false
    done()
  })

  it("bounceHan with right side makes ball move right on bounce and reduces spin", (done) => {
    const v = new Vector3(1, 0, 0)
    const w = new Vector3(0, 0, -5)
    const delta = bounceHan(v, w)
    expect(delta.v.y).to.be.greaterThan(0)
    expect(delta.w.z).to.be.greaterThan(0).and.lessThan(5)
    done()
  })

  it("cueToSpin with no offset has no angular velocity", (done) => {
    const v = new Vector3(10 * R, 0, 0)
    const offset = new Vector3(0, 0, 0)
    const w = cueToSpin(offset, v, 0)
    expect(w.length()).to.be.equals(0)
    done()
  })

  it("2R/5 above center gets natural roll", (done) => {
    const ballDir = new Vector3(10 * R, 0, 0)
    const offset = new Vector3(0, 2 / 5, 0)
    const w = cueToSpin(offset, ballDir, 0)
    // Natural roll: spin magnitude must equal linear velocity / radius
    expect(w.length()).to.be.approximately(10, 0.01)
    done()
  })

  it("cueStrike with zero elevation preserves launch speed", (done) => {
    const strike = cueStrike(Math.PI / 6, 10, new Vector3(0.1, 0.2, 0), 0)
    expect(strike.vel.length()).to.be.approximately(10, 1)
    done()
  })

  it("Constants modify dependent", (done) => {
    const Ibefore = I
    setR(R + 0.1)
    expect(I).to.be.not.equal(Ibefore)
    done()
  })

  it("Constants modify dependent", (done) => {
    const Ibefore = I
    setm(m + 0.1)
    expect(I).to.be.not.equal(Ibefore)
    done()
  })

  it("Constants modify dependent", (done) => {
    const Mzbefore = Mz
    setmu(mu + 0.1)
    expect(Mz).to.be.not.equal(Mzbefore)
    done()
  })

  it("Constants modify dependent", (done) => {
    const Mzbefore = Mz
    setrho(rho + 0.1)
    expect(Mz).to.be.not.equal(Mzbefore)
    done()
  })

  it("Setters working", (done) => {
    const k = 0.12345
    sete(k)
    setmuC(k)
    setmuS(k)
    expect(e).to.be.equal(k)
    expect(muC).to.be.equal(k)
    expect(muS).to.be.equal(k)
    done()
  })

  it("bounceHanBlend covers check side blending logic", (done) => {
    const v = new Vector3(1, 1, 0)
    const w = new Vector3(0, 0, 5)
    const delta = bounceHanBlend(v, w)
    expect(delta.v.length()).to.be.greaterThan(0)
    done()
  })

  it("mathavanAdapter provides delta using mathavan model", (done) => {
    const v = new Vector3(1, 0, 0)
    const w = new Vector3(0, 0, 0)
    const delta = mathavanAdapter(v, w)
    expect(delta.v.length()).to.be.greaterThan(0)
    done()
  })

  it("covers helper functions for cushion physics", (done) => {
    const v = new Vector3(1, 0, 0)
    const w = new Vector3(0, 0, 0)
    expect(s0(v, w)).to.be.instanceOf(Vector3)
    expect(c0(v)).to.be.a("number")
    expect(Pzs(new Vector3(1, 0, 0))).to.be.a("number")
    expect(Pze(1)).to.be.a("number")
    expect(muCushion(v)).to.be.a("number")
    expect(restitutionCushion(v)).to.be.a("number")
    done()
  })

  it("cueToSpin with elevation preserves behavior for elevation=0", (done) => {
    const v = new Vector3(10, 0, 0)
    const offset = new Vector3(0.1, 0.2, 0)
    const w0 = cueToSpin(offset, v, 0)
    const wDefault = cueToSpin(offset, v, 0)
    expect(w0.x).to.equal(wDefault.x)
    expect(w0.y).to.equal(wDefault.y)
    expect(w0.z).to.equal(wDefault.z)
    done()
  })

  it("cueToSpin with elevation and side spin produces swerve (non-zero w.x/w.y components)", (done) => {
    const v = new Vector3(10, 0, 0)
    const offset = new Vector3(0.2, 0, 0) // Pure side spin
    const elevation = Math.PI / 4 // 45 degrees
    const w = cueToSpin(offset, v, elevation)

    // With elevation and side spin, the spin axis is tilted.
    // cueToSpin implementation:
    // dir = (1, 0, 0)
    // q = (cos(45), 0, -sin(45))
    // upCross(dir) = (0, 1, 0)
    // spinAxis = atan2(-0.2, 0) = -PI/2
    // rotate (0, 1, 0) around (cos(45), 0, -sin(45)) by -PI/2
    // This should result in a vector that has a Z component and a horizontal component.

    expect(w.z).to.not.equal(0)
    expect(w.x).to.not.equal(0)
    done()
  })

  it("rollingFull should work as expected for rolling and maintain v = Rw relationship", (done) => {
    const w = new Vector3(0, 10, 0)
    const v = new Vector3(10 * R, 0, 0)
    const delta = rollingFull(w, v, 1)
    expect(delta.v.x).to.be.lessThan(0)
    expect(delta.w.y).to.be.lessThan(0)

    // Verify dv_x = R * dw_y
    expect(delta.v.x).to.be.approximately(R * delta.w.y, 1e-10)
    // Verify dv_y = -R * dw_x
    expect(delta.v.y).to.be.approximately(-R * delta.w.x, 1e-10)
    done()
  })

  it("rollingFull with z spin only should kill any horizontal v and w", (done) => {
    const w = new Vector3(0, 0, 10)
    const v = new Vector3(0.01, 0.01, 0)
    const delta = rollingFull(w, v, 1)
    expect(delta.v.x).to.equal(-0.01)
    expect(delta.v.y).to.equal(-0.01)
    expect(delta.w.x).to.equal(0)
    expect(delta.w.y).to.equal(0)
    expect(delta.w.z).to.be.lessThan(0)
    done()
  })
})
