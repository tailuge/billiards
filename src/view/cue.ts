import { TableGeometry } from "../view/tablegeometry"
import { Table } from "../model/table"
import { upCross, unitAtAngle, norm, roundVec } from "../utils/three-utils"
import { atan2, sin } from "../utils/utils"
import { AimEvent } from "../events/aimevent"
import { AimInputs } from "./aiminputs"
import { Ball, State } from "../model/ball"
import { cueToSpin } from "../model/physics/physics"
import { CueMesh } from "./cuemesh"
import { Mesh, Vector3, Object3D } from "three"
import { R } from "../model/physics/constants"
import { cueIntersectsAnything } from "../utils/cueintersect"

export class Cue {
  mesh: Object3D
  helperMesh: Mesh
  placerMesh: Mesh
  readonly offCenterLimit = 0.3
  readonly maxPower = 160 * R
  t = 0
  aimInputs: AimInputs
  aim: AimEvent = new AimEvent()

  length = TableGeometry.tableX * 1

  private readonly tempVec = new Vector3()
  private readonly tempVec2 = new Vector3()
  private readonly tempVec3 = new Vector3()

  constructor() {
    this.mesh = CueMesh.createCue(
      (R * 0.07) / 0.5,
      (R * 0.23) / 0.5,
      this.length
    )
    this.helperMesh = CueMesh.createHelper()
    this.placerMesh = CueMesh.createPlacer()
  }

  rotateAim(angle, table: Table) {
    if (!this.aimInputs || this.aimInputs.isDisabled()) {
      return
    }
    this.aim.angle = Math.fround(this.aim.angle + angle)
    this.mesh.rotation.z = this.aim.angle
    this.helperMesh.rotation.z = this.aim.angle
    this.aimInputs.showOverlap()
    this.avoidCueTouchingOtherBall(table)
  }

  adjustPower(delta) {
    if (!this.aimInputs || this.aimInputs.isDisabled()) {
      return
    }
    this.aim.power = Math.fround(Math.min(this.maxPower, this.aim.power + delta))
    this.updateAimInput()
  }

  setPower(value: number) {
    if (!this.aimInputs || this.aimInputs.isDisabled()) {
      return
    }
    this.aim.power = Math.fround(value * this.maxPower)
  }

  hit(ball: Ball) {
    const aim = this.aim
    this.t = 0
    ball.state = State.Sliding
    ball.vel.copy(
      unitAtAngle(aim.angle, this.tempVec).multiplyScalar(aim.power)
    )
    ball.rvel.copy(cueToSpin(aim.offset, ball.vel))
  }

  aimAtNext(cueball, ball) {
    if (!ball) {
      return
    }
    const lineTo = norm(this.tempVec.copy(ball.pos).sub(cueball.pos))
    this.aim.angle = atan2(lineTo.y, lineTo.x)
  }

  adjustSpin(delta: Vector3, table: Table) {
    if (!this.aimInputs || this.aimInputs.isDisabled()) {
      return
    }
    const newOffset = this.tempVec3.copy(this.aim.offset).add(delta)
    this.setSpin(newOffset, table)
  }

  setSpin(offset: Vector3, table: Table) {
    if (!this.aimInputs || this.aimInputs.isDisabled()) {
      return
    }
    if (offset.length() > this.offCenterLimit) {
      offset.normalize().multiplyScalar(this.offCenterLimit)
    }
    this.aim.offset.copy(roundVec(offset))
    this.avoidCueTouchingOtherBall(table)
    this.updateAimInput()
  }

  avoidCueTouchingOtherBall(table: Table) {
    let n = 0
    while (n++ < 20 && this.intersectsAnything(table)) {
      this.aim.offset.y += 0.1
      if (this.aim.offset.length() > this.offCenterLimit) {
        this.aim.offset.normalize().multiplyScalar(this.offCenterLimit)
      }
    }

    if (n > 1) {
      this.updateAimInput()
    }
  }

  updateAimInput() {
    this.aimInputs?.updateVisualState(this.aim.offset.x, this.aim.offset.y)
    this.aimInputs?.updatePowerSlider(this.aim.power / this.maxPower)
    this.aimInputs?.showOverlap()
  }

  moveTo(pos) {
    this.aim.pos.copy(pos)
    this.mesh.rotation.z = this.aim.angle
    this.helperMesh.rotation.z = this.aim.angle
    const offset = this.spinOffset()
    const swing =
      (sin(this.t + Math.PI / 2) - 1) * 2 * R * (this.aim.power / this.maxPower)
    const distanceToBall = unitAtAngle(
      this.aim.angle,
      this.tempVec
    ).multiplyScalar(swing)
    this.mesh.position.copy(pos).add(offset).add(distanceToBall)
    this.helperMesh.position.copy(pos)
    this.placerMesh.position.copy(pos)
    this.placerMesh.rotation.z = this.t
  }

  update(t) {
    this.t += t
    this.moveTo(this.aim.pos)
  }

  placeBallMode() {
    this.mesh.visible = false
    this.placerMesh.visible = true
    this.aim.angle = 0
  }

  aimMode() {
    this.mesh.visible = true
    this.placerMesh.visible = false
  }

  spinOffset(aim: AimEvent = this.aim) {
    return upCross(unitAtAngle(aim.angle, this.tempVec2))
      .multiplyScalar(aim.offset.x * 2 * R)
      .setZ(aim.offset.y * 2 * R)
  }

  intersectsAnything(table: Table, aim: AimEvent = this.aim) {
    return cueIntersectsAnything(table, aim, this.spinOffset(aim))
  }

  showHelper(b) {
    this.helperMesh.visible = b
  }

  toggleHelper() {
    this.showHelper(!this.helperMesh.visible)
  }
}
