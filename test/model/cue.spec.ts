import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { Table } from "../../src/model/table"
import { Cue } from "../../src/view/cue"
import { Vector3 } from "three"
import { zero } from "../../src/utils/three-utils"
import { R } from "../../src/model/physics/constants"

const t = 0.1

function updateMatrix(table: Table) {
  table.updateBallMesh(t)
  table.balls.forEach((b) => b.ballmesh.mesh.updateMatrixWorld(true))
}

function createCueAndTable(ballPosition: Vector3) {
  const a = new Ball(zero)
  const b = new Ball(ballPosition)
  const table = new Table([a, b])
  updateMatrix(table)
  const cue = new Cue()
  cue.aim.angle = 0
  cue.moveTo(table.cueball.pos)
  return { cue, table }
}

describe("Cue", () => {
  test("cue intersection with ball infront of cueball", () => {
    const { cue, table } = createCueAndTable(new Vector3(-3 * R, 0, 0))
    expect(cue.intersectsAnything(table)).to.be.true
  })

  test("cue does not intersect cueball", () => {
    const { cue, table } = createCueAndTable(new Vector3(0, 1, 0))
    expect(cue.intersectsAnything(table)).to.be.false
  })

  test("topspin applied", () => {
    const { cue, table } = createCueAndTable(new Vector3(0, 1, 0))
    cue.setPower(1)
    cue.setSpin(new Vector3(0, 0.4), table)
    cue.hit(table.balls[0])
    expect(table.balls[0].rvel.y).to.be.greaterThan(0)
  })

  test("rotateAim calls showOverlap if aimInputs present", () => {
    const { cue, table } = createCueAndTable(new Vector3(0, 1, 0))
    let called = false
    cue.aimInputs = {
      isDisabled: () => false,
      showOverlap: () => {
        called = true
      },
      updateVisualState: () => {},
      updatePowerSlider: () => {},
    } as any
    cue.rotateAim(0.1, table)
    expect(called).to.be.true
  })

  test("rotateAim returns early if aimInputs isDisabled", () => {
    const { cue, table } = createCueAndTable(new Vector3(0, 1, 0))
    cue.aimInputs = {
      isDisabled: () => true,
    } as any
    const angleBefore = cue.aim.angle
    cue.rotateAim(0.1, table)
    expect(cue.aim.angle).to.equal(angleBefore)
  })

  test("avoidCueTouchingOtherBall normalizes offset if too large", () => {
    const { cue, table } = createCueAndTable(new Vector3(-3 * R, 0, 0))
    // Trigger the while loop in avoidCueTouchingOtherBall
    // By setting offset such that it intersects and then grows
    cue.aim.offset.set(0, cue.offCenterLimit)
    cue.avoidCueTouchingOtherBall(table)
    expect(cue.aim.offset.length()).to.be.closeTo(cue.offCenterLimit, 0.001)
  })
})
