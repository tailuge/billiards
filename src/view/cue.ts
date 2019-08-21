import { TableGeometry } from "../view/tablegeometry"
import { Table } from "../model/table"
import {
  Math as Math2,
  Matrix4,
  Mesh,
  CylinderGeometry,
  MeshPhongMaterial,
  Raycaster,
  Vector3
} from "three"
import { up, upCross } from "../utils/utils"
import { AimEvent } from "../events/aimevent"

export class Cue {
  mesh: Mesh
  limit = 0.3
  maxPower = 5.0
  t = 0

  aim: AimEvent = new AimEvent()

  length = TableGeometry.tableX * 1

  private static material = new MeshPhongMaterial({
    color: 0x885577,
    wireframe: false,
    flatShading: false
  })

  constructor() {
    this.initialise(0.05, 0.15, this.length)
  }

  private initialise(tip, but, length) {
    var geometry = new CylinderGeometry(tip, but, length, 16)
    this.mesh = new Mesh(geometry, Cue.material)
    this.mesh.castShadow = true
    this.mesh.geometry
      .applyMatrix(
        new Matrix4()
          .identity()
          .makeRotationAxis(new Vector3(1.0, 0.0, 0.0), -0.075)
      )
      .applyMatrix(new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2))
      .applyMatrix(
        new Matrix4().identity().makeTranslation(-length / 2 - 0.5, 0, 0.75)
      )
    this.mesh.rotation.z = this.aim.angle
  }

  rotateAim(angle) {
    this.aim.angle += angle
    this.aim.dir.applyAxisAngle(up, angle)
    this.mesh.rotation.z = this.aim.angle
  }

  adjustHeight(delta) {
    this.aim.verticalOffset = Math2.clamp(
      this.aim.verticalOffset + delta,
      -this.limit,
      this.limit
    )
    this.mesh.position.z = this.aim.verticalOffset
  }

  adjustSide(delta) {
    this.aim.sideOffset = Math2.clamp(
      this.aim.sideOffset + delta,
      -this.limit,
      this.limit
    )
  }

  adjustPower(delta) {
    this.aim.power = Math.min(this.maxPower, this.aim.power + delta)
  }

  moveTo(pos) {
    this.aim.pos.copy(pos)
    this.mesh.rotation.z = this.aim.angle
    let offset = upCross(this.aim.dir)
      .multiplyScalar(this.aim.sideOffset)
      .setZ(this.aim.verticalOffset)
    let swing = (Math.sin(this.t / 3) - 1) * 0.25
    let distanceToBall = this.aim.dir
      .clone()
      .multiplyScalar(swing - this.aim.power / 2)
    this.mesh.position.copy(
      pos
        .clone()
        .add(offset)
        .add(distanceToBall)
    )
  }

  update(t) {
    this.t += t
    this.moveTo(this.aim.pos)
  }

  intersectsAnything(table: Table) {
    let origin = table.balls[0].pos
      .clone()
      .addScaledVector(this.aim.dir, -this.length / 2)
    origin.z = this.aim.verticalOffset
    let direction = this.aim.dir.clone().normalize()
    let raycaster = new Raycaster(origin, direction, 0, this.length / 2 - 0.6)
    let intersections = raycaster.intersectObjects(
      table.balls.map(b => b.ballmesh.mesh)
    )
    return intersections.length > 0
  }
}
