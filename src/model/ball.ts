import { Vector3 } from "three"
import { zero, vec, passesThroughZero } from "../utils/utils"
import {
  forceRoll,
  rollingFull,
  sliding,
  surfaceVelocityFull,
} from "../model/physics/physics"
import { BallMesh } from "../view/ballmesh"
import { Pocket } from "./physics/pocket"

export enum State {
  Stationary = "Stationary",
  Rolling = "Rolling",
  Sliding = "Sliding",
  Falling = "Falling",
  InPocket = "InPocket",
}

export class Ball {
  readonly pos: Vector3
  readonly vel: Vector3 = zero.clone()
  readonly rvel: Vector3 = zero.clone()
  readonly futurePos: Vector3 = zero.clone()
  readonly ballmesh: BallMesh
  state: State = State.Stationary
  pocket: Pocket

  public static id = 0
  readonly id: number

  static resetId() {
    Ball.id = 0
  }
  readonly label: number | undefined

  static readonly transition = 0.05

  constructor(pos, color?, label?: number, id?: number) {
    this.id = id ?? Ball.id++
    this.pos = pos.clone()
    this.label = label
    this.ballmesh = new BallMesh(color || 0xeeeeee * Math.random(), label)
  }

  update(t) {
    this.updatePosition(t)
    if (this.state == State.Falling) {
      this.pocket.updateFall(this, t)
    } else {
      this.updateVelocity(t)
    }
  }

  updateMesh(t) {
    this.ballmesh.updateAll(this, t)
  }

  private updatePosition(t: number) {
    this.pos.addScaledVector(this.vel, t)
  }

  private updateVelocity(t: number) {
    if (this.inMotion()) {
      if (this.isRolling()) {
        this.state = State.Rolling
        forceRoll(this.vel, this.rvel)
        this.addDelta(t, rollingFull(this.rvel))
      } else {
        this.state = State.Sliding
        this.addDelta(t, sliding(this.vel, this.rvel))
      }
    }
  }

  private addDelta(t, delta) {
    delta.v.multiplyScalar(t)
    delta.w.multiplyScalar(t)
    if (!this.passesZero(delta)) {
      this.vel.add(delta.v)
      this.rvel.add(delta.w)
    }
  }

  private passesZero(delta) {
    const vz = passesThroughZero(this.vel, delta.v)
    const wz = passesThroughZero(this.rvel, delta.w)
    const halts = this.state === State.Rolling ? vz || wz : vz && wz
    if (halts && Math.abs(this.rvel.z) < 0.01) {
      this.setStationary()
      return true
    }
    return false
  }

  setStationary() {
    this.vel.copy(zero)
    this.rvel.copy(zero)
    this.state = State.Stationary
  }

  isRolling() {
    return (
      this.vel.lengthSq() !== 0 &&
      this.rvel.lengthSq() !== 0 &&
      surfaceVelocityFull(this.vel, this.rvel).length() < Ball.transition
    )
  }

  onTable() {
    return this.state !== State.Falling && this.state !== State.InPocket
  }

  inMotion() {
    return (
      this.state === State.Rolling ||
      this.state === State.Sliding ||
      this.isFalling()
    )
  }

  isFalling() {
    return this.state === State.Falling
  }

  futurePosition(t) {
    this.futurePos.copy(this.pos).addScaledVector(this.vel, t)
    return this.futurePos
  }

  fround() {
    this.pos.x = Math.fround(this.pos.x)
    this.pos.y = Math.fround(this.pos.y)
    this.vel.x = Math.fround(this.vel.x)
    this.vel.y = Math.fround(this.vel.y)
    this.rvel.x = Math.fround(this.rvel.x)
    this.rvel.y = Math.fround(this.rvel.y)
    this.rvel.z = Math.fround(this.rvel.z)
  }

  serialise() {
    return {
      pos: this.pos.clone(),
      id: this.id,
    }
  }

  static fromSerialised(data) {
    return Ball.updateFromSerialised(new Ball(vec(data.pos), undefined, undefined, data.id), data)
  }

  static updateFromSerialised(b, data) {
    b.pos.copy(data.pos)
    b.vel.copy(data?.vel ?? zero)
    b.rvel.copy(data?.rvel ?? zero)
    return b
  }
}
