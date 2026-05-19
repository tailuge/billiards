import { TableGeometry } from "../view/tablegeometry"
import { Table } from "../model/table"
import { upCross, unitAtAngle, norm, roundVec } from "../utils/three-utils"
import { atan2, sin } from "../utils/utils"
import { AimEvent } from "../events/aimevent"
import { AimInputs } from "./dom/aiminputs"
import { Ball, State } from "../model/ball"
import { cueStrike } from "../model/physics/physics"
import { CueMesh } from "./cuemesh"
import { Mesh, Vector3, Object3D } from "three"
import { R } from "../model/physics/constants"
import { cueIntersectsAnything } from "../utils/cueintersect"

export class Cue {
  mesh: Object3D
  tiltMesh: Object3D
  cueBody: Object3D
  helperMesh: Mesh
  placerMesh: Object3D
  shadowMesh: Mesh
  readonly offCenterLimit = 0.3
  readonly maxPower = 160 * R
  t = 0
  hittingAnimation = false
  aimInputs: AimInputs
  aim: AimEvent = new AimEvent()

  length = TableGeometry.tableX * 1

  private readonly tempVec = new Vector3()
  private readonly tempVec2 = new Vector3()
  private readonly tempVec3 = new Vector3()
  hitAnimationWeight: number = 0

  constructor() {
    const cue = CueMesh.createCue(
      (R * 0.07) / 0.5,
      (R * 0.23) / 0.5,
      this.length
    )
    this.mesh = cue.mesh
    this.tiltMesh = cue.tiltMesh
    this.cueBody = cue.cueBody
    this.helperMesh = CueMesh.createHelper()
    this.placerMesh = CueMesh.createPlacer()
    this.shadowMesh = CueMesh.createShadow(this.length)
  }

  rotateAim(angle, table: Table) {
    if (!this.aimInputs || this.aimInputs.isDisabled()) {
      return
    }
    this.aim.angle = Math.fround(this.aim.angle + angle)
    this.mesh.rotation.z = this.aim.angle
    this.helperMesh.rotation.z = this.aim.angle
    this.shadowMesh.rotation.z = this.aim.angle
    this.aimInputs.showOverlap()
    this.avoidCueTouchingOtherBall(table)
  }

  adjustPower(delta) {
    if (!this.aimInputs || this.aimInputs.isDisabled()) {
      return
    }
    this.aim.power = Math.fround(
      Math.min(this.maxPower, this.aim.power + delta)
    )
    this.updateAimInput()
  }

  setPower(value: number) {
    if (!this.aimInputs || this.aimInputs.isDisabled()) {
      return
    }
    this.aim.power = Math.fround(value * this.maxPower)
  }

  hit(ball: Ball) {
    const { angle, power, offset, elevation } = this.aim
    this.t = 0
    this.hittingAnimation = true
    ball.state = State.Sliding
    const strike = cueStrike(angle, power, offset, elevation)
    ball.vel.copy(strike.vel)
    ball.rvel.copy(strike.rvel)
  }

  aimAtNext(cueball, ball) {
    if (!ball) {
      return
    }
    const lineTo = norm(this.tempVec.copy(ball.pos).sub(cueball.pos))
    this.aim.angle = atan2(lineTo.y, lineTo.x)
  }

  adjustSpin(delta: Vector3, table: Table) {
    if (!this.aimInputs || this.aimInputs.isDisabled()) {
      return
    }
    const newOffset = this.tempVec3.copy(this.aim.offset).add(delta)
    this.setSpin(newOffset, table)
  }

  setSpin(offset: Vector3, table: Table) {
    if (!this.aimInputs || this.aimInputs.isDisabled()) {
      return
    }
    if (offset.length() > this.offCenterLimit) {
      offset.normalize().multiplyScalar(this.offCenterLimit)
    }
    this.aim.offset.copy(roundVec(offset))
    this.avoidCueTouchingOtherBall(table)
    this.updateAimInput()
  }

  avoidCueTouchingOtherBall(table: Table) {
    let n = 0
    while (n++ < 20 && this.intersectsAnything(table)) {
      this.aim.offset.y += 0.1
      if (this.aim.offset.length() > this.offCenterLimit) {
        this.aim.offset.normalize().multiplyScalar(this.offCenterLimit)
      }
    }

    if (n > 1) {
      this.updateAimInput()
    }
  }

  updateAimInput() {
    this.aimInputs?.updateVisualState(this.aim.offset.x, this.aim.offset.y)
    this.aimInputs?.updatePowerSlider(this.aim.power / this.maxPower)
    this.aimInputs?.updateTiltSlider?.(this.aim.elevation)
    this.aimInputs?.showOverlap()
  }

  private updateCueRotation() {
    this.mesh.rotation.z = this.aim.angle
    this.tiltMesh.rotation.y = CueMesh.baseTilt + this.aim.elevation
    this.helperMesh.rotation.z = this.aim.angle
    this.shadowMesh.rotation.z = this.aim.angle
  }

  private applyHitAnimation(swing: number) {
    if (this.hittingAnimation) {
      this.hitAnimationWeight = 1
    } else {
      this.hitAnimationWeight *= 0.97
    }

    const curveVal = this.hitAnimationCurve(this.t)
    const hitOffset = this.hitAnimationWeight * curveVal * 2 * R
    const strokeX = (1 - this.hitAnimationWeight) * swing - hitOffset
    const strokeZ = (0.15 + Math.min(this.t / 5, 0.25)) * hitOffset

    this.cueBody.position.set(
      -this.length / 2 - R + strokeX,
      this.aim.offset.x * 2 * R,
      Math.max(-0.5 * R, strokeZ + this.aim.offset.y * 2 * R)
    )

    return strokeX
  }

  private updateCuePosition(pos: Vector3, strokeX: number) {
    this.mesh.position.copy(pos)

    // Project local strokeX through tilt onto the horizontal plane for shadow
    const unitToBall = unitAtAngle(this.aim.angle, this.tempVec)
    const sideVec = upCross(unitToBall).normalize()
    const elevation = this.tiltMesh.rotation.y as number

    const localX = strokeX - R
    const localZ = this.cueBody.position.z
    const projectedX =
      localX * Math.cos(elevation) + localZ * Math.sin(elevation)

    this.shadowMesh.position
      .copy(pos)
      .addScaledVector(sideVec, this.cueBody.position.y)
      .addScaledVector(unitToBall, projectedX + R * Math.cos(elevation))
    this.shadowMesh.position.z = -R * 0.99
    this.shadowMesh.scale.x = Math.cos(elevation)

    this.helperMesh.position.copy(pos)
    this.placerMesh.position.copy(pos)
    this.placerMesh.rotation.z = this.t
  }

  moveTo(pos) {
    this.aim.pos.copy(pos)
    this.updateCueRotation()
    const swing =
      (sin(this.t * 1.5 + Math.PI / 2) - 1) *
      2 *
      R *
      (this.aim.power / this.maxPower)
    const strokeX = this.applyHitAnimation(swing)
    this.updateCuePosition(pos, strokeX)
  }

  hitAnimationCurve(t: number) {
    const pts = [
      { t: 0, v: -2 },
      { t: 1, v: -1 },
      { t: 2, v: 1 },
      { t: 3, v: 2 },
    ]
    if (t <= pts[0].t) return pts[0].v
    if (t >= pts[pts.length - 1].t) return pts[pts.length - 1].v
    const i = pts.findIndex((p, idx) => t >= p.t && t <= pts[idx + 1]?.t)
    const p1 = pts[i],
      p2 = pts[i + 1]
    const p0 = pts[Math.max(0, i - 1)],
      p3 = pts[Math.min(pts.length - 1, i + 2)]
    const lt = (t - p1.t) / (p2.t - p1.t),
      lt2 = lt * lt,
      lt3 = lt2 * lt
    return (
      p0.v * (-0.5 * lt3 + lt2 - 0.5 * lt) +
      p1.v * (1.5 * lt3 - 2.5 * lt2 + 1) +
      p2.v * (-1.5 * lt3 + 2 * lt2 + 0.5 * lt) +
      p3.v * (0.5 * lt3 - 0.5 * lt2)
    )
  }

  update(t) {
    this.t += t
    this.moveTo(this.aim.pos)
  }

  placeBallMode() {
    this.mesh.visible = false
    this.shadowMesh.visible = false
    this.placerMesh.visible = true
    this.aim.angle = 0
  }

  aimMode() {
    this.mesh.visible = true
    this.shadowMesh.visible = true
    this.placerMesh.visible = false
  }

  spinOffset(aim: AimEvent = this.aim) {
    return upCross(unitAtAngle(aim.angle, this.tempVec2))
      .multiplyScalar(aim.offset.x * 2 * R)
      .setZ(aim.offset.y * 2 * R)
  }

  intersectsAnything(table: Table, aim: AimEvent = this.aim) {
    return cueIntersectsAnything(table, aim, this.spinOffset(aim))
  }

  showHelper(b) {
    this.helperMesh.visible = b
  }

  toggleHelper() {
    this.showHelper(!this.helperMesh.visible)
  }
}
