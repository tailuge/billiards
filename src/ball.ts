import { Vector3, Matrix4 } from "three"
import { Mesh, IcosahedronBufferGeometry, MeshPhongMaterial } from "three"

export enum State {
  Stationary,
  Rolling,
  Sliding,
  Falling
}

export class Ball {
  zero = new Vector3(0, 0, 0)
  up = new Vector3(0, 0, 1)

  pos: Vector3
  vel: Vector3 = this.zero.clone()
  rpos: Vector3 = this.up.clone()
  rvel: Vector3 = this.zero.clone()
  state: State = State.Stationary

  froll = 0.02
  mesh: Mesh
  material = {
    color: Math.random() * 0xffffff,
    emissive: Math.random() * 0x000000,
    flatShading: true
  }

  constructor(pos) {
    this.pos = pos.clone()
    this.vel
    this.rpos
    this.rvel
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
    let axis = this.up
      .clone()
      .cross(this.vel)
      .normalize()
    let angle = (this.vel.length() * t * Math.PI) / 2
    this.rpos.applyAxisAngle(axis, angle)
    let m = new Matrix4()
    m.identity().makeRotationAxis(axis, angle)
    this.mesh.geometry.applyMatrix(m)
  }

  onTable() {
    return this.state != State.Falling
  }

  private initialiseMesh() {
    var geometry = new IcosahedronBufferGeometry(0.5, 1)
    var material = new MeshPhongMaterial(this.material)
    this.mesh = new Mesh(geometry, material)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
  }

  serialise() {
    return { pos: this.pos, vel: this.vel, state: this.state }
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
