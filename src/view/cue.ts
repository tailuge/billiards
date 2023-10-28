import { TableGeometry } from "../view/tablegeometry"
import { Table } from "../model/table"
import {
  upCross,
  unitAtAngle,
  norm,
  round,
  roundVec2,
  round2,
} from "../utils/utils"
import { AimEvent } from "../events/aimevent"
import { AimInputs } from "./aiminputs"
import { Ball, State } from "../model/ball"
import { cueToSpin } from "../model/physics/physics"
import { CueMesh } from "./cuemesh"
import { Mesh, Raycaster, Vector3 } from "three"
import { R } from "../model/physics/constants"

export class Cue {
  mesh: Mesh
  helperMesh: Mesh
  placerMesh: Mesh
  readonly offCenterLimit = 0.3
  readonly maxPower = 150 * R
  t = 0
  aimInputs: AimInputs
  aim: AimEvent = new AimEvent()

  length = TableGeometry.tableX * 1

  constructor() {
    this.mesh = CueMesh.createCue(
      (R * 0.05) / 0.5,
      (R * 0.15) / 0.5,
      this.length
    )
    this.helperMesh = CueMesh.createHelper()
    this.placerMesh = CueMesh.createPlacer()
  }

  rotateAim(angle) {
    this.aim.angle = round(this.aim.angle + angle)
    this.mesh.rotation.z = this.aim.angle
    this.helperMesh.rotation.z = this.aim.angle
    this.aimInputs.showOverlap()
  }

  adjustPower(delta) {
    this.aim.power = round2(Math.min(this.maxPower, this.aim.power + delta))
    this.updateAimInput()
  }

  setPower(value: number) {
    this.aim.power = round2(value * this.maxPower)
  }

  hit(ball: Ball) {
    const aim = this.aim
    this.t = 0
    ball.state = State.Sliding
    ball.vel.copy(unitAtAngle(aim.angle).multiplyScalar(aim.power))
    ball.rvel.copy(cueToSpin(aim.offset, ball.vel))
  }

  aimAtNext(cueball, ball) {
    if (!ball) {
      return
    }
    const lineTo = norm(ball.pos.clone().sub(cueball.pos))
    this.aim.angle = Math.atan2(lineTo.y, lineTo.x)
  }

  adjustSpin(delta: Vector3) {
    const newOffset = this.aim.offset.clone().add(delta)
    this.setSpin(newOffset)
  }

  setSpin(offset: Vector3) {
    if (offset.length() > this.offCenterLimit) {
      offset.normalize().multiplyScalar(this.offCenterLimit)
    }
    this.aim.offset = roundVec2(offset)
    this.updateAimInput()
  }

  updateAimInput() {
    this.aimInputs?.updateVisualState(this.aim.offset.x, this.aim.offset.y)
    this.aimInputs?.updatePowerSlider(this.aim.power / this.maxPower)
  }

  moveTo(pos) {
    this.aim.pos.copy(pos)
    this.mesh.rotation.z = this.aim.angle
    this.helperMesh.rotation.z = this.aim.angle
    const offset = upCross(unitAtAngle(this.aim.angle))
      .multiplyScalar(this.aim.offset.x * 2 * R)
      .setZ(this.aim.offset.y * 2 * R)
    const swing =
      (Math.sin(this.t + Math.PI / 2) - 1) *
      3 *
      R *
      (this.aim.power / this.maxPower)
    const distanceToBall = unitAtAngle(this.aim.angle)
      .clone()
      .multiplyScalar(swing)
    this.mesh.position.copy(pos.clone().add(offset).add(distanceToBall))
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

  intersectsAnything(table: Table) {
    const origin = table.cueball.pos
      .clone()
      .addScaledVector(unitAtAngle(this.aim.angle), -this.length / 2)
    origin.z = this.aim.offset.y
    const direction = unitAtAngle(this.aim.angle)
    const raycaster = new Raycaster(origin, direction, 0, this.length / 2 - 0.6)
    const intersections = raycaster.intersectObjects(
      table.balls.map((b) => b.ballmesh.mesh)
    )
    return intersections.length > 0
  }

  showHelper(b) {
    this.helperMesh.visible = b
  }

  toggleHelper() {
    this.showHelper(!this.helperMesh.visible)
  }
}
