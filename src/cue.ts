import { TableGeometry } from "./tablegeometry"
import { Table } from "./table"
import { Vector3, Matrix4, ArrowHelper } from "three"
import { Mesh, CylinderGeometry, MeshPhongMaterial, Raycaster } from "three"
import { up } from "./utils"

export class Cue {
  mesh: Mesh
  aim = new Vector3(1, 0, 0)
  angle = 0
  height = 0
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
      .applyMatrix(new Matrix4().identity().makeRotationAxis(up, -Math.PI / 2))
      .applyMatrix(
        new Matrix4().identity().makeTranslation(-length / 2 - 1, 0, 0)
      )
    this.mesh.rotation.z = this.angle
  }

  rotateAim(angle) {
    this.angle += angle
    this.aim.applyAxisAngle(up, angle)
    this.mesh.rotation.z = this.angle
  }

  adjustHeight(delta) {
    this.height += delta
    let limit = 0.4
    if (this.height > limit) {
      this.height = limit
    } else if (this.height < -limit) {
      this.height = -limit
    }
    this.mesh.position.z = this.height
  }

  setPosition(pos) {
    this.mesh.position.copy(pos)
    this.mesh.position.z = this.height
  }

  showPointer(table, scene) {
    let origin = table.balls[0].pos
      .clone()
      .addScaledVector(this.aim, -this.length / 2)
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
    origin.z = this.height
    let direction = this.aim.clone().normalize()
    let raycaster = new Raycaster(origin, direction, 0, this.length / 2 - 0.6)
    let intersections = raycaster.intersectObjects(table.balls.map(b => b.mesh))
    return intersections.length > 0
  }
}
