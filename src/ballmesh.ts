import { Matrix4 } from "three"
import { Mesh, IcosahedronGeometry, MeshPhongMaterial } from "three"
import { norm } from "./utils"

export class BallMesh {

  mesh: Mesh

  constructor() {
    this.initialiseMesh()
  }

  updatePosition(pos) {
    this.mesh.position.copy(pos)
  }

  updateRotation(rvel, t) {
    let angle = (rvel.length() * t * Math.PI) / 2
    let m = new Matrix4().identity().makeRotationAxis(norm(rvel), angle)
    this.mesh.geometry.applyMatrix(m)
  }

  initialiseMesh() {
    var geometry = new IcosahedronGeometry(0.5, 1)
    var material = new MeshPhongMaterial({
      color: 0x555555,
      emissive: 0,
      flatShading: true
    })
    this.mesh = new Mesh(geometry, material)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.mesh.name = "ball"
  }
}
