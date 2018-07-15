import { Vector3, Matrix4 } from "three"
import { Mesh, IcosahedronBufferGeometry, MeshPhongMaterial } from "three"
import { up, zero, vec } from "./utils"

export enum State {
  Stationary,
  Rolling,
  Sliding,
  Falling
}

export class Ball {
  pos: Vector3
  vel: Vector3 = zero.clone()
  rvel: Vector3 = zero.clone()
  state: State = State.Stationary

  froll = 0.02
  fslide = 0.1
  transition = 0.05

  mesh: Mesh
  material = {
    color: Math.random() * 0xffffff,
    emissive: 0,
    flatShading: true
  }

  constructor(pos) {
    this.pos = pos.clone()
    this.vel
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
      this.vel.copy(zero)
    } else {
      this.vel.add(deltaV)
    }
  }

  equilibrium() {
    return this.vel
      .clone()
      .multiplyScalar(5 / 7)
      .addScaledVector(this.rvel, 2 / 7)
  }

  private updateRotation(t: number) {
    let axis = up
      .clone()
      .cross(this.vel)
      .normalize()
    let angle = (this.vel.length() * t * Math.PI) / 2
    let m = new Matrix4()
    m.identity().makeRotationAxis(axis, angle)
    this.mesh.geometry.applyMatrix(m)
  }

  onTable() {
    return this.state != State.Falling
  }

  serialise() {
    return { pos: this.pos, vel: this.vel, state: this.state }
  }

  static fromSerialised(data) {
    let b = new Ball(vec(data.pos))
    b.vel.copy(vec(data.vel))
    return b
  }

  private initialiseMesh() {
    var geometry = new IcosahedronBufferGeometry(0.5, 1)
    var material = new MeshPhongMaterial(this.material)
    this.mesh = new Mesh(geometry, material)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.mesh.name = "ball"
  }
}
