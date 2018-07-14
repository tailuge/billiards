import { TableGeometry } from "./tablegeometry"
import { Vector3, Matrix4 } from "three"
import { Mesh, CylinderGeometry, MeshPhongMaterial } from "three"

export class Cue {
  mesh: Mesh
  aim = new Vector3(1, 0, 0)
  angle = 0
  up = new Vector3(0, 0, 1)

  private static material = new MeshPhongMaterial({
    color: 0x885577,
    wireframe: false,
    flatShading: false
  })

  constructor() {
    this.initialise(0.05, 0.1, TableGeometry.tableX * 1)
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

  t = 0
  update(t) {
    this.t += t
  }
}
