import { TableGeometry } from "../view/tablegeometry"
import { Table } from "../model/table"
import { up, upCross, unitAtAngle, zero } from "../utils/utils"
import { AimEvent } from "../events/aimevent"
import { AimInputs } from "./aiminputs"
import { Ball, State } from "../model/ball"
import {
  Matrix4,
  Mesh,
  CylinderGeometry,
  MeshPhongMaterial,
  Raycaster,
  Vector3,
  MathUtils,
} from "three"

export class Cue {
  mesh: Mesh
  helperMesh: Mesh
  limit = 0.4
  maxPower = 60.0
  t = 0
  aimInputs: AimInputs
  aim: AimEvent = new AimEvent()

  length = TableGeometry.tableX * 1

  private static material = new MeshPhongMaterial({
    color: 0x885577,
    wireframe: false,
    flatShading: false,
  })

  private static helpermaterial = new MeshPhongMaterial({
    color: 0x885577,
    wireframe: false,
    flatShading: true,
    transparent: true,
    opacity: 0.3,
  })

  constructor() {
    this.initialise(0.05, 0.15, this.length)
  }

  private createHelper() {
    const geometry = new CylinderGeometry(0.5, 0.5, 30, 12)
    this.helperMesh = new Mesh(geometry, Cue.helpermaterial)
    this.helperMesh.geometry
      .applyMatrix4(new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2))
      .applyMatrix4(new Matrix4().identity().makeTranslation(15, 0, 0))
    this.helperMesh.visible = false
  }

  private initialise(tip, but, length) {
    const geometry = new CylinderGeometry(tip, but, length, 11)
    this.mesh = new Mesh(geometry, Cue.material)
    this.mesh.castShadow = false
    this.mesh.geometry
      .applyMatrix4(
        new Matrix4()
          .identity()
          .makeRotationAxis(new Vector3(1.0, 0.0, 0.0), -0.1)
      )
      .applyMatrix4(new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2))
      .applyMatrix4(
        new Matrix4().identity().makeTranslation(-length / 2 - 0.5, 0, 1)
      )
    this.mesh.rotation.z = this.aim.angle
    this.createHelper()
  }

  rotateAim(angle) {
    this.aim.angle += angle
    this.mesh.rotation.z = this.aim.angle
    this.helperMesh.rotation.z = this.aim.angle
  }

  adjustHeight(delta) {
    this.aim.verticalOffset = MathUtils.clamp(
      this.aim.verticalOffset + delta,
      -this.limit,
      this.limit
    )
    this.mesh.position.z = this.aim.verticalOffset
    this.updateAimInput()
  }

  adjustSide(delta) {
    this.aim.sideOffset = MathUtils.clamp(
      this.aim.sideOffset + delta,
      -this.limit,
      this.limit
    )
    this.updateAimInput()
  }

  adjustPower(delta) {
    this.aim.power = Math.min(this.maxPower, this.aim.power + delta)
    this.aimInputs.updatePowerSlider(this.aim.power / this.maxPower)
  }

  setPower(value: number) {
    this.aim.power = value * this.maxPower
  }

  hit(ball: Ball) {
    const aim = this.aim
    ball.vel.copy(unitAtAngle(aim.angle).multiplyScalar(aim.power))
    if (aim.spinOnly) {
      ball.vel.copy(zero)
    }
    ball.state = State.Sliding

    if (aim.verticalOffset == 0 && aim.sideOffset == 0) {
      ball.rvel.copy(zero)
    } else {
      const spinAxis = Math.atan2(-aim.sideOffset, aim.verticalOffset)
      const spinPower = Math.sqrt(
        aim.verticalOffset * aim.verticalOffset +
          aim.sideOffset * aim.sideOffset
      )
      const dir = unitAtAngle(aim.angle)
      const rvel = upCross(dir)
        .applyAxisAngle(dir, spinAxis)
        .multiplyScalar(spinPower * aim.power * 4)
      ball.rvel.copy(rvel)
    }
    aim.power = 0
  }

  setSpin(x: number, y: number) {
    this.aim.verticalOffset = MathUtils.clamp(y, -this.limit, this.limit)
    this.aim.sideOffset = MathUtils.clamp(x, -this.limit, this.limit)
    this.updateAimInput()
  }

  updateAimInput() {
    this.aimInputs?.updateVisualState(
      this.aim.sideOffset,
      this.aim.verticalOffset
    )
  }

  moveTo(pos) {
    this.aim.pos.copy(pos)
    this.mesh.rotation.z = this.aim.angle
    const offset = upCross(unitAtAngle(this.aim.angle))
      .multiplyScalar(this.aim.sideOffset)
      .setZ(this.aim.verticalOffset)
    const swing = (Math.sin(this.t / 3) - 1) * 0.25
    const distanceToBall = unitAtAngle(this.aim.angle)
      .clone()
      .multiplyScalar(swing - (this.aim.power / this.maxPower) * 3)
    this.mesh.position.copy(pos.clone().add(offset).add(distanceToBall))
    this.helperMesh.position.copy(pos)
  }

  update(t) {
    this.t += t
    this.moveTo(this.aim.pos)
  }

  intersectsAnything(table: Table) {
    const origin = table.balls[0].pos
      .clone()
      .addScaledVector(unitAtAngle(this.aim.angle), -this.length / 2)
    origin.z = this.aim.verticalOffset
    const direction = unitAtAngle(this.aim.angle)
    const raycaster = new Raycaster(origin, direction, 0, this.length / 2 - 0.6)
    const intersections = raycaster.intersectObjects(
      table.balls.map((b) => b.ballmesh.mesh)
    )
    return intersections.length > 0
  }
}
