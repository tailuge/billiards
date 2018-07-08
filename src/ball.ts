import { Vector3, Matrix4 } from "three"
import { Mesh, IcosahedronBufferGeometry, MeshPhongMaterial } from "three"

export class Ball {
  material = {
    color: Math.random() * 0xffffff,
    emissive: Math.random() * 0xffffff,
    flatShading: true
  }

  pos: Vector3
  vel: Vector3
  rpos: Vector3
  rvel: Vector3
  mesh: Mesh

  constructor(pos) {
    this.pos = pos
    this.vel = new Vector3(0, 0, 0)
    this.rpos = new Vector3(0, 0, 1)
    this.rvel = new Vector3(0, 0, 0)
    this.initialiseMesh()
  }

  update(t) {
    this.updatePosition(t)
    this.updateRotation(t)
  }

  futurePosition(t) {
    return this.pos.clone().addScaledVector(this.vel, t)
  }

  private updatePosition(t: number) {
    this.pos.addScaledVector(this.vel, t)
    this.mesh.position.copy(this.pos)
  }

  private updateRotation(t: number) {
    let axis = new Vector3(0, 0, 1)
    let angle = 0.05 * t
    this.rpos.applyAxisAngle(axis, angle)
    let m = new Matrix4()
    m.identity().makeRotationAxis(axis, angle)
    this.mesh.geometry.applyMatrix(m)
  }

  private initialiseMesh() {
    var geometry = new IcosahedronBufferGeometry(0.5, 2)
    var material = new MeshPhongMaterial(this.material)
    this.mesh = new Mesh(geometry, material)
  }
}
