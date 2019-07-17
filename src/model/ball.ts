import { Vector3 } from "three"
import { zero, vec, passesThroughZero } from "../utils/utils"
import { sliding, surfaceVelocity, rollingFull, forceRoll } from "../model/physics/physics"
import { BallMesh } from "../view/ballmesh"

export enum State {
  Stationary = "Stationary",
  Rolling = "Rolling",
  Sliding = "Sliding",
  Falling = "Falling",
  InPocket = "InPocket"
}

export class Ball {
  pos: Vector3
  vel: Vector3 = zero.clone()
  rvel: Vector3 = zero.clone()
  state: State = State.Stationary

  mesh: BallMesh

  transition = 0.05

  constructor(pos) {
    this.pos = pos.clone()
    this.mesh = new BallMesh()
  }

  update(t) {
    this.updatePosition(t)
    this.updateVelocity(t)
    this.mesh.updateRotation(this.rvel, t)
  }

  private updatePosition(t: number) {
    this.pos.addScaledVector(this.vel, t)
    this.mesh.updatePosition(this.pos)
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
    forceRoll(this.vel, this.rvel)
    let dv = new Vector3()
    let dw = new Vector3()
    rollingFull(this.rvel, dv, dw)
    dv.multiplyScalar(t)
    dw.multiplyScalar(t)
    if (passesThroughZero(this.rvel, dw) || passesThroughZero(this.vel, dv)) {
      this.setStationary()
    } else {
      this.vel.add(dv)
      this.rvel.add(dw)
      this.state = State.Rolling
    }
  }

  private updateVelocitySliding(t) {
    let dv = new Vector3()
    let dw = new Vector3()
    sliding(this.vel, this.rvel, dv, dw)
    dv.multiplyScalar(t)
    dw.multiplyScalar(t)
    if (passesThroughZero(this.rvel, dw) && passesThroughZero(this.vel, dv)) {
      this.setStationary()
    } else {
      this.vel.add(dv)
      this.rvel.add(dw)
      this.state = State.Sliding
    }
  }

  private setStationary() {
    this.vel.copy(zero)
    this.rvel.copy(zero)
    this.state = State.Stationary
  }

  isRolling() {
    return (
      surfaceVelocity(this.vel, this.rvel).length() < this.transition &&
      this.vel.length() != 0
    )
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
    return Ball.updateFromSerialised(new Ball(vec(data.pos)), data)
  }

  static updateFromSerialised(b, data) {
    b.pos.copy(data.pos)
    b.vel.copy(vec(data.vel))
    b.rvel.copy(vec(data.rvel))
    b.state = data.state
    return b
  }

}
