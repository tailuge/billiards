import {
  IcosahedronGeometry,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  CircleGeometry,
  MeshBasicMaterial,
} from "three"
import { norm } from "./../utils/utils"

export class BallMesh {
  mesh: Mesh
  shadow: Mesh
  constructor(color) {
    this.initialiseMesh(color)
  }

  updatePosition(pos) {
    this.mesh.position.copy(pos)
    this.shadow.position.copy(pos)
  }

  m = new Matrix4()

  updateRotation(rvel, t) {
    let angle = (rvel.length() * t * Math.PI) / 2
    let m = this.m.identity().makeRotationAxis(norm(rvel), angle)
    this.mesh.geometry.applyMatrix4(m)
  }

  initialiseMesh(color) {
    var geometry = new IcosahedronGeometry(0.5, 1)
    var material = new MeshPhongMaterial({
      color: color,
      emissive: 0,
      flatShading: true,
    })
    this.mesh = new Mesh(geometry, material)
    this.mesh.name = "ball"

    const shadowGeometry = new CircleGeometry(0.45, 9)
    shadowGeometry.applyMatrix4(
      new Matrix4().identity().makeTranslation(0, 0, -0.49)
    )
    const shadowMaterial = new MeshBasicMaterial({ color: 0x111122 })
    this.shadow = new Mesh(shadowGeometry, shadowMaterial)
  }
}
