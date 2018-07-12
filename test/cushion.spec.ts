import "mocha"
import { expect } from "chai"
import { Ball } from "../src/ball"
import { TableGeometry } from "../src/tablegeometry"
import { Cushion } from "../src/cushion"
import { Knuckle } from "../src/knuckle"
import { Vector3 } from "three"

let t = 0.1

describe("Cushion", () => {
  it("bounces off X cushion", done => {
    let pos = new Vector3(TableGeometry.tableX, 0, 0)
    let ball = new Ball(pos)
    ball.vel.x = 1
    expect(Cushion.willBounce(ball, t)).to.be.true
    Cushion.bounce(ball, t)
    expect(Cushion.willBounce(ball, t)).to.be.false
    expect(ball.vel.x).to.be.below(0)
    done()
  })

  it("bounces off -X cushion", done => {
    let pos = new Vector3(-TableGeometry.tableX, 0, 0)
    let ball = new Ball(pos)
    ball.vel.x = -1
    expect(Cushion.willBounce(ball, t)).to.be.true
    Cushion.bounce(ball, t)
    expect(Cushion.willBounce(ball, t)).to.be.false
    expect(ball.vel.x).to.be.above(0)
    done()
  })

  it("bounces off Y cushion", done => {
    let pos = new Vector3(TableGeometry.tableX / 2, TableGeometry.tableY, 0)
    let ball = new Ball(pos)
    ball.vel.y = 1
    expect(Cushion.willBounce(ball, t)).to.be.true
    Cushion.bounce(ball, t)
    expect(Cushion.willBounce(ball, t)).to.be.false
    expect(ball.vel.y).to.be.below(0)
    done()
  })

  it("bounces off -Y cushion", done => {
    let pos = new Vector3(TableGeometry.tableX / 2, -TableGeometry.tableY, 0)
    let ball = new Ball(pos)
    ball.vel.y = -1
    expect(Cushion.willBounce(ball, t)).to.be.true
    Cushion.bounce(ball, t)
    expect(Cushion.willBounce(ball, t)).to.be.false
    expect(ball.vel.y).to.be.above(0)
    done()
  })

  it("does not bounce off pocket area", done => {
    let pos = new Vector3(0, -TableGeometry.tableY, 0)
    let ball = new Ball(pos)
    ball.vel.y = -1
    expect(Cushion.willBounce(ball, t)).to.be.false
    done()
  })

  it("bounces off knuckle", done => {
    let pos = new Vector3(TableGeometry.middleKnuckleInset-0.1, -TableGeometry.tableY, 0)
    let ball = new Ball(pos)
    ball.vel.y = -1
    expect(Cushion.willBounce(ball, t)).to.be.false
    let k = Knuckle.willBounceAny(ball, t) 
    expect(k).to.be.deep.equal(TableGeometry.pockets.pocketS.knuckleSE)
    k && k.bounce(ball)
    expect(ball.vel.x).to.be.below(0)
    expect(ball.vel.y).to.be.above(0)
    done()
  })

  it("geometry present", done => {
    var scene = { add: ({}) => {} }
    TableGeometry.addToScene(scene)
    done()
  })
})
