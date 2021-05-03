import { Vector3 } from "three"
import {
  zero,
  vec,
  passesThroughZero,
  up,
  assertNotNaNVec,
} from "../utils/utils"
import {
  rollingFull,
  // forceRoll,
  sliding,
  surfaceVelocityFull,
} from "../model/physics/physics"
import { BallMesh } from "../view/ballmesh"
import { g } from "./physics/constants"
import { Pocket } from "./physics/pocket"

export enum State {
  Stationary = "Stationary",
  Rolling = "Rolling",
  Sliding = "Sliding",
  Falling = "Falling",
  InPocket = "InPocket",
}

// https://8080-lime-shark-3ky1mi9h.ws-eu03.gitpod.io/?&state=%7B%22init%22:%5B-11,0,10.74,0.024,11.722,0.556,11.697,-0.548,12.677,-0.022,12.631,-1.084,12.633,1.089,13.61,0.549,13.63,-0.533,14.558,-0.015%5D,%22shots%22:%5B%7B%22verticalOffset%22:0.212,%22sideOffset%22:-0.4,%22angle%22:0,%22power%22:60,%22pos%22:%7B%22x%22:-11,%22y%22:0,%22z%22:0%7D,%22spinOnly%22:true,%22type%22:3%7D,%7B%22verticalOffset%22:0.212,%22sideOffset%22:-0.4,%22angle%22:0,%22power%22:60,%22pos%22:%7B%22x%22:9.894,%22y%22:-0.012,%22z%22:0%7D,%22spinOnly%22:true,%22type%22:3%7D%5D%7D

export class Ball {
  pos: Vector3
  vel: Vector3 = zero.clone()
  rvel: Vector3 = zero.clone()
  state: State = State.Stationary
  pocket: Pocket
  futurePos: Vector3 = zero.clone()

  ballmesh: BallMesh

  readonly transition = 0.05

  constructor(pos, color?) {
    this.pos = pos.clone()
    this.ballmesh = new BallMesh(color ? color : 0x555555 * Math.random())
  }

  update(t) {
    this.updatePosition(t)
    this.updateVelocity(t)
    assertNotNaNVec(this.vel)
    assertNotNaNVec(this.rvel)

    if (this.state == State.Falling) {
      this.updateFalling(t)
    }
  }

  updateMesh(t) {
    this.ballmesh.updatePosition(this.pos)
    this.ballmesh.updateArrows(this.pos, this.rvel, this.state)
    if (this.rvel.lengthSq() != 0) {
      this.ballmesh.updateRotation(this.rvel, t)
    }
  }

  private updatePosition(t: number) {
    this.pos.addScaledVector(this.vel, t)
    assertNotNaNVec(this.pos)
  }

  private updateFalling(t: number) {
    this.vel.addScaledVector(up, -10 * t * g)
    if (this.pos.z < -2) {
      this.setStationary()
      this.state = State.InPocket
    }

    if (this.pos.distanceTo(this.pocket.pos) > this.pocket.radius - 0.5) {
      const toCentre = this.pocket.pos
        .clone()
        .sub(this.pos)
        .normalize()
        .multiplyScalar(this.vel.length() * 0.5)
      if (this.vel.dot(toCentre) < 0) {
        this.vel.x = toCentre.x
        this.vel.y = toCentre.y
      }
    }
  }

  private updateVelocity(t: number) {
    if (this.inMotion()) {
      if (this.isRolling()) {
        this.updateVelocityRolling(t)
        assertNotNaNVec(this.vel, this)
      } else {
        this.updateVelocitySliding(t)
        assertNotNaNVec(this.vel)
      }
    }
  }

  dv = new Vector3()
  dw = new Vector3()

  private updateVelocityRolling(t) {
    //    forceRoll(this.vel, this.rvel)
    rollingFull(this.rvel, this.dv, this.dw)
    assertNotNaNVec(this.dv, this)
    assertNotNaNVec(this.dw, this)
    this.dv.multiplyScalar(t)
    this.dw.multiplyScalar(t)
    if (
      passesThroughZero(this.rvel, this.dw) ||
      passesThroughZero(this.vel, this.dv)
    ) {
      this.setStationary()
    } else {
      this.vel.add(this.dv)
      this.rvel.add(this.dw)
      this.state = State.Rolling
    }
  }

  private updateVelocitySliding(t) {
    sliding(this.vel, this.rvel, this.dv, this.dw)
    this.dv.multiplyScalar(t)
    this.dw.multiplyScalar(t)
    if (
      passesThroughZero(this.rvel, this.dw) &&
      passesThroughZero(this.vel, this.dv)
    ) {
      this.setStationary()
    } else {
      this.vel.add(this.dv)
      this.rvel.add(this.dw)
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
      this.vel.lengthSq() != 0 &&
      this.rvel.lengthSq() != 0 &&
      surfaceVelocityFull(this.vel, this.rvel).length() < this.transition
    )
  }

  onTable() {
    return this.state !== State.Falling && this.state !== State.InPocket
  }

  inMotion() {
    return this.state == State.Rolling || this.state == State.Sliding
  }

  isFalling() {
    return this.state == State.Falling
  }

  futurePosition(t) {
    this.futurePos.copy(this.pos).addScaledVector(this.vel, t)
    return this.futurePos
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
