import { Vector3, Matrix4 } from "three"
import { Mesh, IcosahedronBufferGeometry, MeshPhongMaterial } from "three"

export class Ball {
  material = {
    color: Math.random() * 0xffffff,
    emissive: Math.random() * 0x000000,
    flatShading: true
  }

  froll = 0.02
  pos: Vector3
  vel: Vector3
  rpos: Vector3
  rvel: Vector3
  mesh: Mesh
  zero = new Vector3(0, 0, 0)
  constructor(pos) {
    this.pos = pos.clone()
    this.vel = this.zero.clone()
    this.rpos = new Vector3(0, 0, 1)
    this.rvel = this.zero.clone()
    this.initialiseMesh()
  }

  update(t) {
    this.updatePosition(t)
    this.updateVelocity(t)
    this.updateRotation(t)
  }

  futurePosition(t) {
    return this.pos.clone().addScaledVector(this.vel, t)
  }

  private updatePosition(t: number) {
    this.pos.addScaledVector(this.vel, t)
    this.mesh.position.copy(this.pos)
  }

  private updateVelocity(t: number) {
    let deltaV = this.vel
      .clone()
      .normalize()
      .multiplyScalar(-t * this.froll)
    if (this.vel.length() < deltaV.length()) {
      this.vel.copy(this.zero)
    } else {
      this.vel.add(deltaV)
    }
  }

  private updateRotation(t: number) {
    let axis = new Vector3(0, 0, 1).cross(this.vel).normalize()
    let angle = (this.vel.length() * t * Math.PI) / 2
    this.rpos.applyAxisAngle(axis, angle)
    let m = new Matrix4()
    m.identity().makeRotationAxis(axis, angle)
    this.mesh.geometry.applyMatrix(m)
  }

  private initialiseMesh() {
    var geometry = new IcosahedronBufferGeometry(0.5, 1)
    var material = new MeshPhongMaterial(this.material)
    this.mesh = new Mesh(geometry, material)
    this.mesh.castShadow = true
  }

  serialise() {
    return { pos: this.pos, vel: this.vel }
  }

  static fromSerialised(data) {
    let b = new Ball(this.vec(data.pos))
    b.vel.copy(this.vec(data.vel))
    return b
  }

  static vec(v) {
    return new Vector3(v.x, v.y, v.z)
  }
}
