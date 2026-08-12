import { expect } from "chai"
import { Ball } from "../../src/model/ball"
import { Table } from "../../src/model/table"
import { Cue } from "../../src/view/cue"
import { CueMesh } from "../../src/view/cuemesh"
import { Mesh, MeshPhongMaterial, Object3D, Quaternion, Vector3 } from "three"
import { zero } from "../../src/utils/three-utils"
import { maxPower, offCenterLimit, R } from "../../src/model/physics/constants"

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

function aimInputsStub(extra: Record<string, unknown> = {}) {
  return {
    isDisabled: () => false,
    updateVisualState: () => {},
    updatePowerSlider: () => {},
    showOverlap: () => {},
    ...extra,
  } as any
}

describe("Cue", () => {
  beforeEach(() => {
    Cue.helperEnabled = true
  })

  test("cue intersection with ball infront of cueball", () => {
    const { cue, table } = createCueAndTable(new Vector3(-3 * R, 0, 0))
    expect(cue.intersectsAnything(table)).to.be.true
  })

  test("cue intersection with high elevation angles over the ball", () => {
    const { cue, table } = createCueAndTable(new Vector3(-3 * R, 0, 0))
    cue.aim.elevation = 1.2
    expect(cue.intersectsAnything(table)).to.be.false
  })

  test("cue does not intersect cueball", () => {
    const { cue, table } = createCueAndTable(new Vector3(0, 1, 0))
    expect(cue.intersectsAnything(table)).to.be.false
  })

  test("topspin applied", () => {
    const { cue, table } = createCueAndTable(new Vector3(0, 1, 0))
    cue.aimInputs = {
      isDisabled: () => false,
      updateVisualState: () => {},
      updatePowerSlider: () => {},
      showOverlap: () => {},
    } as any
    cue.setPower(1)
    cue.setSpin(new Vector3(0, 0.4), table)
    cue.hit(table.balls[0])
    expect(table.balls[0].rvel.y).to.be.greaterThan(0)
  })

  test("adjustPower increases power when enabled", () => {
    const { cue } = createCueAndTable(new Vector3(0, 1, 0))
    cue.aimInputs = {
      isDisabled: () => false,
      updateVisualState: () => {},
      updatePowerSlider: () => {},
      showOverlap: () => {},
    } as any
    const powerBefore = cue.aim.power
    cue.adjustPower(10 * R)
    expect(cue.aim.power).to.equal(Math.fround(powerBefore + 10 * R))
  })

  test("adjustPower returns early when disabled", () => {
    const { cue } = createCueAndTable(new Vector3(0, 1, 0))
    cue.aimInputs = { isDisabled: () => true } as any
    const powerBefore = cue.aim.power
    cue.adjustPower(10 * R)
    expect(cue.aim.power).to.equal(powerBefore)
  })

  test("setPower updates power when enabled", () => {
    const { cue } = createCueAndTable(new Vector3(0, 1, 0))
    cue.aimInputs = {
      isDisabled: () => false,
      updateVisualState: () => {},
      updatePowerSlider: () => {},
      showOverlap: () => {},
    } as any
    cue.setPower(0.5)
    expect(cue.aim.power).to.equal(Math.fround(0.5 * maxPower))
  })

  test("setPower returns early when disabled", () => {
    const { cue } = createCueAndTable(new Vector3(0, 1, 0))
    cue.aimInputs = { isDisabled: () => true } as any
    const powerBefore = cue.aim.power
    cue.setPower(0.5)
    expect(cue.aim.power).to.equal(powerBefore)
  })

  test("adjustSpin updates offset when enabled", () => {
    const { cue, table } = createCueAndTable(new Vector3(0, 1, 0))
    cue.aimInputs = {
      isDisabled: () => false,
      updateVisualState: () => {},
      updatePowerSlider: () => {},
      showOverlap: () => {},
    } as any
    const offsetBefore = cue.aim.offset.clone()
    cue.adjustSpin(new Vector3(0.1, 0.1), table)
    expect(cue.aim.offset.x).to.equal(Math.fround(offsetBefore.x + 0.1))
  })

  test("adjustSpin returns early when disabled", () => {
    const { cue, table } = createCueAndTable(new Vector3(0, 1, 0))
    cue.aimInputs = { isDisabled: () => true } as any
    const offsetBefore = cue.aim.offset.clone()
    cue.adjustSpin(new Vector3(0.1, 0.1), table)
    expect(cue.aim.offset.equals(offsetBefore)).to.be.true
  })

  test("moveTo applies aim elevation to cue tilt", () => {
    const { cue, table } = createCueAndTable(new Vector3(0, 1, 0))
    cue.aim.elevation = 0.5
    cue.moveTo(table.cueball.pos)
    expect(cue.tiltMesh.rotation.y).to.be.closeTo(
      CueMesh.baseTilt + 0.5,
      0.0001
    )
  })

  test("setSpin returns early when disabled", () => {
    const { cue, table } = createCueAndTable(new Vector3(0, 1, 0))
    cue.aimInputs = { isDisabled: () => true } as any
    const offsetBefore = cue.aim.offset.clone()
    cue.setSpin(new Vector3(0.1, 0.1), table)
    expect(cue.aim.offset.equals(offsetBefore)).to.be.true
  })

  test("toggleHelper toggles helper visibility", () => {
    const cue = new Cue()
    const visibleBefore = cue.helperMesh.visible
    cue.toggleHelper()
    expect(cue.helperMesh.visible).to.equal(!visibleBefore)
  })

  test("cue root groups both mesh sets and the shared sub-objects", () => {
    const cue = new Cue()
    expect(cue.root.children).to.have.lengthOf(5)
    expect(cue.root.children).to.include(cue.p1)
    expect(cue.root.children).to.include(cue.p2)
    expect(cue.root.children).to.include(cue.helperMesh)
    expect(cue.root.children).to.include(cue.placerMesh)
    expect(cue.root.children).to.include(cue.shadowMesh)
    expect(cue.p1.children).to.include(cue.mesh)
    expect(cue.p2.children).to.have.lengthOf(1)
    // p1 shown from startup; p2 shown only on the opponent's turn
    expect(cue.p1.visible).to.be.true
    expect(cue.p2.visible).to.be.false
  })

  test("p1 and p2 cue bodies are built from each player's params", () => {
    const cue = new Cue({ buttColour: "#ff0000" }, { buttColour: "#00ff00" })
    const colours = (cueBody: Object3D) =>
      cueBody.children
        .map((c) => (c as Mesh).material)
        .filter((m) => m instanceof MeshPhongMaterial)
        .map((m) => (m as MeshPhongMaterial).color.getHexString())
    expect(colours(cue.cueBody)).to.include("ff0000")
    expect(colours(cue.cues[1].cueBody)).to.include("00ff00")
    expect(colours(cue.cueBody)).not.to.include("00ff00")
  })

  test("aim transforms are hoisted onto the root", () => {
    const cue = new Cue()
    cue.aim.angle = 0.7
    cue.moveTo(new Vector3(1.5, -2.5, 0))
    expect(cue.root.position.x).to.be.closeTo(1.5, 0.0001)
    expect(cue.root.position.y).to.be.closeTo(-2.5, 0.0001)
    expect(cue.root.rotation.z).to.be.closeTo(0.7, 0.0001)
    // the children no longer carry the shared aim transforms
    expect(cue.mesh.rotation.z).to.equal(0)
    expect(cue.helperMesh.rotation.z).to.equal(0)
    expect(cue.shadowMesh.rotation.z).to.equal(0)
    expect(cue.mesh.position.length()).to.equal(0)
    expect(cue.helperMesh.position.length()).to.equal(0)
    expect(cue.shadowMesh.position.z).to.be.closeTo(-R * 0.99, 0.0001)
  })

  test("shadow world orientation follows the aim angle through the root", () => {
    const cue = new Cue()
    cue.aim.angle = 0.7
    cue.moveTo(new Vector3(1, -2, 0))
    cue.root.updateMatrixWorld(true)
    const quat = new Quaternion()
    cue.shadowMesh.getWorldQuaternion(quat)
    const dir = new Vector3(1, 0, 0).applyQuaternion(quat)
    expect(dir.x).to.be.closeTo(Math.cos(0.7), 0.0001)
    expect(dir.y).to.be.closeTo(Math.sin(0.7), 0.0001)
    // the shadow lies flat just above the table surface
    const world = new Vector3()
    cue.shadowMesh.getWorldPosition(world)
    expect(world.z).to.be.closeTo(-R * 0.99, 0.0001)
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
    cue.aim.offset.set(0, offCenterLimit, 0)
    cue.avoidCueTouchingOtherBall(table)
    expect(cue.aim.offset.length()).to.be.closeTo(offCenterLimit, 0.001)
  })

  test("avoidCueTouchingOtherBall raises elevation for a real intersection", () => {
    const { cue, table } = createCueAndTable(new Vector3(-4 * R, 0, 0))
    cue.aimInputs = aimInputsStub()
    // Offset clamped at offCenterLimit and the cue still intersects the ball
    // ahead, so the elevation phase must raise elevation to clear it (the
    // raise needed here is ~0.02, within the 0.05 cap)
    cue.aim.offset.set(0, offCenterLimit, 0)
    cue.avoidCueTouchingOtherBall(table)
    expect(cue.aim.elevation).to.be.greaterThan(0)
    expect(cue.aim.elevation).to.be.at.most(0.05)
    // The cue should now be clear of the ball
    expect(cue.intersectsAnything(table)).to.be.false
  })
})
