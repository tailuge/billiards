import { TableGeometry } from "../view/tablegeometry"
import { Table } from "../model/table"
import { up, upCross, unitAtAngle } from "../utils/utils"
import { AimEvent } from "../events/aimevent"
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
  limit = 0.4
  maxPower = 60.0
  t = 0

  aim: AimEvent = new AimEvent()

  length = TableGeometry.tableX * 1

  private static material = new MeshPhongMaterial({
    color: 0x885577,
    wireframe: false,
    flatShading: false,
  })

  constructor() {
    this.initialise(0.05, 0.15, this.length)
  }

  private initialise(tip, but, length) {
    var geometry = new CylinderGeometry(tip, but, length, 11)
    this.mesh = new Mesh(geometry, Cue.material)
    this.mesh.castShadow = true
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
  }

  rotateAim(angle) {
    this.aim.angle += angle
    this.mesh.rotation.z = this.aim.angle
  }

  adjustHeight(delta) {
    this.aim.verticalOffset = MathUtils.clamp(
      this.aim.verticalOffset + delta,
      -this.limit,
      this.limit
    )
    this.mesh.position.z = this.aim.verticalOffset
  }

  adjustSide(delta) {
    this.aim.sideOffset = MathUtils.clamp(
      this.aim.sideOffset + delta,
      -this.limit,
      this.limit
    )
  }

  adjustPower(delta) {
    this.aim.power = Math.min(this.maxPower, this.aim.power + delta)
  }

  setPower(value) {
    this.aim.power = value * this.maxPower
  }

  setSpin(x, y) {
    this.aim.verticalOffset = MathUtils.clamp(y, -this.limit, this.limit)
    this.aim.sideOffset = MathUtils.clamp(x, -this.limit, this.limit)
    return { x: this.aim.sideOffset, y: this.aim.verticalOffset }
  }

  moveTo(pos) {
    this.aim.pos.copy(pos)
    this.mesh.rotation.z = this.aim.angle
    let offset = upCross(unitAtAngle(this.aim.angle))
      .multiplyScalar(this.aim.sideOffset)
      .setZ(this.aim.verticalOffset)
    let swing = (Math.sin(this.t / 3) - 1) * 0.25
    let distanceToBall = unitAtAngle(this.aim.angle)
      .clone()
      .multiplyScalar(swing - (this.aim.power / this.maxPower) * 3)
    this.mesh.position.copy(pos.clone().add(offset).add(distanceToBall))
  }

  update(t) {
    this.t += t
    this.moveTo(this.aim.pos)
  }

  intersectsAnything(table: Table) {
    let origin = table.balls[0].pos
      .clone()
      .addScaledVector(unitAtAngle(this.aim.angle), -this.length / 2)
    origin.z = this.aim.verticalOffset
    let direction = unitAtAngle(this.aim.angle)
    let raycaster = new Raycaster(origin, direction, 0, this.length / 2 - 0.6)
    let intersections = raycaster.intersectObjects(
      table.balls.map((b) => b.ballmesh.mesh)
    )
    return intersections.length > 0
  }
}
