import { expect } from "chai"
import { Vector3 } from "three"
import {
  isGripCushion,
  bounceHan,
  cueToSpin,
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
    const v = new Vector3(1.0, 0, 0)
    const w = new Vector3(0, 0, -5)
    const delta = bounceHan(v, w)
    expect(delta.v.y).to.be.greaterThan(0)
    expect(delta.w.z).to.be.greaterThan(0).and.lessThan(5)
    done()
  })

  it("cueToSpin with no offset has no angular velocity", (done) => {
    const v = new Vector3(10, 0, 0)
    const offset = new Vector3(0, 0, 0)
    const w = cueToSpin(offset, v)
    expect(w.length()).to.be.equals(0)
    done()
  })

  it("2R/5 above center gets natural roll", (done) => {
    const v = new Vector3(10, 0, 0)
    const offset = new Vector3(0, 2 / 5, 0)
    const w = cueToSpin(offset, v)
    expect(w.length()).to.be.approximately(v.length() / R, 0.01)
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
})
