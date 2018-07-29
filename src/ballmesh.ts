import { Matrix4 } from "three"
import {
  Mesh,
  IcosahedronGeometry,
  MeshPhongMaterial,
  ArrowHelper
} from "three"
import { norm, up, zero } from "./utils"

export class BallMesh {
  mesh: Mesh
  arrow: ArrowHelper

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
    this.arrow.setDirection(norm(rvel))
    this.arrow.position.copy(this.mesh.position)
    this.arrow.setLength(rvel.length() * 1 + 0.4)
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
    this.arrow = new ArrowHelper(up, zero, 2, 0xcc0000)
  }

  addToScene(scene) {
    scene.add(this.mesh)
    scene.add(this.arrow)
  }
}
