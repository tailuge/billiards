import { Vector3, Matrix4 } from "three"
import { Mesh, IcosahedronGeometry, MeshPhongMaterial } from "three"
import { zero, vec, norm, sliding, surfaceVelocity } from "./utils"

export enum State {
  Stationary = "Stationary",
  Rolling = "Rolling",
  Sliding = "Sliding",
  Falling = "Falling"
}

export class Ball {
  pos: Vector3
  vel: Vector3 = zero.clone()
  rvel: Vector3 = zero.clone()
  state: State = State.Stationary
  mesh: Mesh

  fRoll = 0.02
  fSlide = 0.1
  transition = 0.05

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

  private updatePosition(t: number) {
    this.pos.addScaledVector(this.vel, t)
    this.mesh.position.copy(this.pos)
  }

  private updateVelocity(t: number) {
    if (this.inMotion()) {
      if (this.isRolling()) {
        this.updateVelocityRolling(t)
      } else {
        this.updateVelocitySliding(t)
      }
    }
  }

  private updateVelocityRolling(t) {
    let deltaV = norm(this.vel).multiplyScalar(-t * this.fRoll)
    let deltaW = norm(this.rvel).multiplyScalar(-t * this.fRoll)
    if (this.vel.length() < deltaV.length()) {
      this.color(0x000000)
      this.vel.copy(zero)
      this.rvel.copy(zero)
      this.state = State.Stationary
    } else {
      this.color(0x881111)
      this.vel.add(deltaV)
      this.rvel.add(deltaW)
      this.state = State.Rolling
    }
  }

  private updateVelocitySliding(t) {
    this.color(0x0000ff)
    let dv = new Vector3()
    let dw = new Vector3()
    sliding(this.vel, this.rvel, dv, dw)
    this.vel.addScaledVector(dv, t)
    this.rvel.addScaledVector(dw, t)
    this.state = State.Sliding
  }

  isRolling() {
    return (
      surfaceVelocity(this.vel, this.rvel).length() < this.transition &&
      this.vel.length() != 0
    )
  }

  private updateRotation(t: number) {
    let angle = (this.rvel.length() * t * Math.PI) / 2
    let m = new Matrix4().identity().makeRotationAxis(norm(this.rvel), angle)
    this.mesh.geometry.applyMatrix(m)
  }

  onTable() {
    return this.state != State.Falling
  }

  inMotion() {
    return this.onTable() && (this.vel.length() != 0 || this.rvel.length() != 0)
  }

  futurePosition(t) {
    return this.pos.clone().addScaledVector(this.vel, t)
  }

  serialise() {
    return { pos: this.pos, vel: this.vel, rvel: this.rvel, state: this.state }
  }

  static fromSerialised(data) {
    let b = new Ball(vec(data.pos))
    b.vel.copy(vec(data.vel))
    b.rvel.copy(vec(data.rvel))
    b.state = data.state
    return b
  }

  private initialiseMesh() {
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

  private color(hex) {
    ;(<MeshPhongMaterial>this.mesh.material).emissive.setHex(hex)
  }
}
