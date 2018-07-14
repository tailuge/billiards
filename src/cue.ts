import { TableGeometry } from "./tablegeometry"
import { Table } from "./table"
import { Vector3, Matrix4, ArrowHelper } from "three"
import { Mesh, CylinderGeometry, MeshPhongMaterial, Raycaster } from "three"

export class Cue {
  mesh: Mesh
  aim = new Vector3(1, 0, 0)
  angle = 0
  up = new Vector3(0, 0, 1)
  length = TableGeometry.tableX * 1

  private static material = new MeshPhongMaterial({
    color: 0x885577,
    wireframe: false,
    flatShading: false
  })

  constructor() {
    this.initialise(0.05, 0.1, this.length)
  }

  private initialise(tip, but, length) {
    var geometry = new CylinderGeometry(tip, but, length, 16)
    this.mesh = new Mesh(geometry, Cue.material)
    this.mesh.castShadow = true
    this.mesh.geometry
      .applyMatrix(
        new Matrix4().identity().makeRotationAxis(this.up, -Math.PI / 2)
      )
      .applyMatrix(
        new Matrix4().identity().makeTranslation(-length / 2 - 1, 0, 0)
      )
    this.mesh.rotation.z = this.angle
  }

  rotateAim(angle) {
    this.angle += angle
    this.aim.applyAxisAngle(this.up, angle)
    this.mesh.rotation.z = this.angle
  }

  setPosition(pos) {
    this.mesh.position.copy(pos)
  }

  showPointer(table, scene) {
    let origin = table.balls[0].pos
      .clone()
      .addScaledVector(this.aim, -this.length / 2)
    console.log(origin)
    let direction = this.aim.clone().normalize()
    scene.add(
      new ArrowHelper(direction, origin, this.length / 2 - 0.5, 0xffff00)
    )
  }

  t = 0
  update(t) {
    this.t += t
  }

  intersectsAnything(table: Table) {
    let origin = table.balls[0].pos
      .clone()
      .addScaledVector(this.aim, -this.length / 2)
    let direction = this.aim.clone().normalize()
    let raycaster = new Raycaster(origin, direction, 0, this.length / 2 - 1)
    let intersections = raycaster.intersectObjects(table.balls.map(b => b.mesh))
    console.log(raycaster.ray)
    console.log(table.balls.map(b => b.mesh.position))
    console.log(raycaster.far, intersections.map(o => o.distance))
    return intersections.length > 0
  }
}
