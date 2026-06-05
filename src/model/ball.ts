import { Vector3 } from "three"
import { zero, vec, passesThroughZero } from "../utils/three-utils"
import {
  forceRoll,
  rollingFull,
  sliding,
  surfaceVelocityFull,
} from "../model/physics/physics"
import { BallMesh } from "../view/ballmesh"
import { Pocket } from "./physics/pocket"
import { BallAppearance } from "../view/ballappearance"

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
  readonly ballmesh: BallMesh | undefined
  state: State = State.Stationary
  pocket: Pocket

  public static id = 0
  readonly id = Ball.id++
  readonly label: number | undefined
  readonly appearance: BallAppearance | undefined

  static readonly transition = 0.05

  constructor(pos, color?, label?: number, appearance?: BallAppearance) {
    this.pos = pos.clone()
    this.label = label
    this.appearance = appearance
    if (typeof document !== "undefined") {
      this.ballmesh = new BallMesh(
        color || 0xeeeeee * Math.random(),
        label,
        appearance
      )
    }
  }

  update(t) {
    this.updatePosition(t)
    if (this.state == State.Falling) {
      this.pocket?.updateFall(this, t)
    } else {
      this.updateVelocity(t)
    }
  }

  updateMesh(t) {
    this.ballmesh?.updateAll(this, t)
  }

  private updatePosition(t: number) {
    this.pos.addScaledVector(this.vel, t)
  }

  private updateVelocity(t: number) {
    if (this.inMotion()) {
      if (this.isRolling()) {
        this.state = State.Rolling
        forceRoll(this.vel, this.rvel)
        this.addDelta(t, rollingFull(this.rvel, this.vel, t))
      } else {
        this.state = State.Sliding
        this.addDelta(t, sliding(this.vel, this.rvel))
      }
    }
  }

  private addDelta(t: number, delta: { v: Vector3; w: Vector3 }) {
    // 1. Mutate by t upfront for the check, matching your existing structure
    delta.v.multiplyScalar(t)
    delta.w.multiplyScalar(t)

    // 2. Separate logic: Let passesZero handle the check, and handle the state mutation cleanly
    if (this.passesZero(delta)) {
      this.setStationary()
    } else {
      this.vel.add(delta.v)
      this.rvel.add(delta.w)
    }
  }

  private passesZero(delta: { v: Vector3; w: Vector3 }): boolean {
    // In Sliding state: Both linear and angular friction must overcome momentum to halt.
    // In Rolling state: Breaking traction on either side forces a transition or a halt.
    const vz = passesThroughZero(this.vel, delta.v)
    const wz = passesThroughZero(this.rvel, delta.w)
    const halts = this.state === State.Rolling ? vz || wz : vz && wz

    if (!halts) return false

    // Catch vertical spin (Z-axis) overshoot dynamically.
    // If the step size is larger than remaining angular velocity, it has spent its energy.
    return Math.abs(this.rvel.z) <= Math.abs(delta.w.z)
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
    return Ball.updateFromSerialised(new Ball(vec(data.pos)), data)
  }

  static updateFromSerialised(b, data) {
    b.pos.copy(data.pos)
    b.vel.copy(data?.vel ?? zero)
    b.rvel.copy(data?.rvel ?? zero)
    return b
  }
}
