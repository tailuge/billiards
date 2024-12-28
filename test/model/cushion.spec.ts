import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { TableGeometry } from "../../src/view/tablegeometry"
import { TableMesh } from "../../src/view/tablemesh"
import { Cushion } from "../../src/model/physics/cushion"
import { Knuckle } from "../../src/model/physics/knuckle"
import { Vector3 } from "three"
import { PocketGeometry } from "../../src/view/pocketgeometry"
import { R } from "../../src/model/physics/constants"
import { bounceHan, bounceHanBlend } from "../../src/model/physics/physics"

const t = 0.1

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
})

describe("Cushion", () => {
  it("bounces off X cushion", (done) => {
    const pos = new Vector3(TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.x = 1
    expect(Cushion.bounceAny(ball, t)).to.be.greaterThan(0)
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    expect(ball.vel.x).to.be.below(0)
    done()
  })

  it("bounces off -X cushion", (done) => {
    const pos = new Vector3(-TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.x = -1
    expect(Cushion.bounceAny(ball, t)).to.be.greaterThan(0)
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    expect(ball.vel.x).to.be.above(0)
    done()
  })

  it("bounces off Y cushion", (done) => {
    const pos = new Vector3(TableGeometry.tableX / 2, TableGeometry.tableY, 0)
    const ball = new Ball(pos)
    ball.vel.y = 1
    expect(Cushion.bounceAny(ball, t)).to.be.greaterThan(0)
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    expect(ball.vel.y).to.be.below(0)
    done()
  })

  it("bounces off -Y cushion", (done) => {
    const pos = new Vector3(TableGeometry.tableX / 2, -TableGeometry.tableY, 0)
    const ball = new Ball(pos)
    ball.vel.y = -1
    expect(Cushion.bounceAny(ball, t)).to.be.greaterThan(0)
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    expect(ball.vel.y).to.be.above(0)
    done()
  })

  it("bounces off X cushion on pocketless table", (done) => {
    const pos = new Vector3(TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.x = 1
    expect(Cushion.bounceAny(ball, t, false)).to.be.greaterThan(0)
    expect(Cushion.bounceAny(ball, t, false)).to.be.undefined
    expect(ball.vel.x).to.be.below(0)
    done()
  })

  function bounceInXWithSpin(rvel) {
    const pos = new Vector3(TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.x = 1
    ball.rvel.copy(rvel)
    Cushion.bounceAny(ball, t)
    return ball
  }

  it("bounces off X cushion with rhs spins", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, 0, 1))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.below(0)
    done()
  })

  it("bounces off X cushion with lhs spins", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, 0, -1))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.above(0)
    done()
  })

  it("bounces off X cushion with rolling spin", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, 1, 0))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.approximately(0, 0.01)
    done()
  })

  it("bounces off X cushion with top spin", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, 2, 0))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.approximately(0, 0.01)
    done()
  })

  it("bounces off X cushion with back spin", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, -2, 0))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.approximately(0, 0.01)
    done()
  })

  it("bounces off X cushion with top and rhs", (done) => {
    const ball = bounceInXWithSpin(new Vector3(0, 2, 1))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.below(0)
    done()
  })

  it("bounces off X cushion with corkscrew spin", (done) => {
    const ball = bounceInXWithSpin(new Vector3(1, 0, 0))
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.approximately(0, 0.1)
    done()
  })

  it("bounces off X cushion 45 in 45 out", (done) => {
    const pos = new Vector3(TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.set(1, 1, 0)
    Cushion.bounceAny(ball, t)
    expect(ball.vel.y).to.be.approximately(-ball.vel.x, 0.2)
    done()
  })

  it("shallow angle slips, retains sidespin, retain y speed", (done) => {
    const pos = new Vector3(TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    ball.vel.set(0.1, -1, 0)
    ball.rvel.set(0, 0, -10)
    Cushion.bounceAny(ball, t)
    expect(ball.rvel.z).to.be.approximately(-8, 1)
    expect(ball.vel.y).to.be.approximately(-1, 0.1)
    done()
  })

  it("does not bounce off pocket area", (done) => {
    const pos = new Vector3(0, -TableGeometry.tableY, 0)
    const ball = new Ball(pos)
    ball.vel.y = -1
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    done()
  })

  it("bounces off knuckle", (done) => {
    const pos = new Vector3(
      PocketGeometry.middleKnuckleInset - 0.1 * R,
      -TableGeometry.tableY,
      0
    )
    const ball = new Ball(pos)
    ball.vel.y = -10 * R
    expect(Cushion.bounceAny(ball, t)).to.be.undefined
    const k = Knuckle.findBouncing(ball, t)
    expect(k).to.be.deep.equal(PocketGeometry.pockets.pocketS.knuckleSE)
    k?.bounce(ball)
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.above(0)
    done()
  })

  it("geometry present", (done) => {
    new TableMesh().generateTable(true)
    new TableMesh().generateTable(false)
    done()
  })

  function ballAtXCushion() {
    const pos = new Vector3(TableGeometry.tableX, 0, 0)
    const ball = new Ball(pos)
    return ball
  }

  it.each([
    ["bounceHan", bounceHan],
    ["bounceHanBlend", bounceHanBlend],
  ])(
    `mirror image slip bounce into X cushion should have mirror outcome %s`,
    (_, model) => {
      const av = new Vector3(0.1, 1)
      const aw = new Vector3()
      const bv = av.clone().setY(-av.y)
      const bw = aw.clone()
      const deltaA = model(av, aw)
      const deltaB = model(bv, bw)
      expect(deltaB.v.x).to.be.equal(deltaA.v.x)
      expect(deltaB.v.y).to.be.equal(-deltaA.v.y)
    }
  )

  it.each([
    ["bounceHan", bounceHan],
    ["bounceHanBlend", bounceHanBlend],
  ])(
    `mirror image grip bounce into X cushion should have mirror outcome %s`,
    (_, model) => {
      const av = new Vector3(1, 0.1)
      const aw = new Vector3()
      const bv = av.clone().setY(-av.y)
      const bw = aw.clone()
      const deltaA = model(av, aw)
      const deltaB = model(bv, bw)
      expect(deltaB.v.x).to.be.equal(deltaA.v.x)
      expect(deltaB.v.y).to.be.equal(-deltaA.v.y)
    }
  )

  it("expect abs(x) velocity to be reduced after bounce", (done) => {
    const a = ballAtXCushion()
    a.vel.x = 0.3322011634120897
    a.vel.y = 0.09830558592076499
    a.rvel.x = -3.0016972800233583
    a.rvel.y = 10.143546974414955
    a.rvel.z = 128.04759946487678
    const deltaA = bounceHan(a.vel, a.rvel)
    const afterv = a.vel.clone().add(deltaA.v)
    // fix this
    expect(Math.abs(a.vel.x)).to.be.lessThan(Math.abs(afterv.x))
    done()
  })
})
