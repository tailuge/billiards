import { Cushion } from "./physics/cushion"
import { Collision } from "./physics/collision"
import { Knuckle } from "./physics/knuckle"
import { Pocket } from "./physics/pocket"
import { Cue } from "../view/cue"
import { Ball, State } from "./ball"
import { AimEvent } from "../events/aimevent"
import { TableGeometry } from "../view/tablegeometry"
import { Outcome } from "./outcome"
import { PocketGeometry } from "../view/pocketgeometry"
import { bounceHanBlend } from "./physics/physics"
import { zero } from "../utils/three-utils"
import { R } from "./physics/constants"
import { ProximityIndicator } from "../view/proximityindicator"
import { checkProximity } from "../utils/proximity"

interface Pair {
  a: Ball
  b: Ball
}

export class Table {
  balls: Ball[]
  cue = new Cue()
  proximityIndicator = new ProximityIndicator()
  proximityEnabled = false
  pairs: Pair[]
  outcome: Outcome[] = []
  cueball: Ball
  cushionModel = bounceHanBlend
  mesh

  constructor(balls: Ball[]) {
    this.cueball = balls[0]
    this.initialiseBalls(balls)
  }

  initialiseBalls(balls: Ball[]) {
    this.balls = balls
    this.pairs = []
    for (let a = 0; a < balls.length; a++) {
      for (let b = 0; b < balls.length; b++) {
        if (a < b) {
          this.pairs.push({ a: balls[a], b: balls[b] })
        }
      }
    }
  }

  updateBallMesh(t) {
    this.balls.forEach((a) => {
      a.updateMesh(t)
    })
  }

  advance(t: number) {
    let depth = 0
    while (!this.prepareAdvanceAll(t)) {
      if (depth++ > 100) {
        console.log(
          "Depth exceeded resolving collisions",
          JSON.stringify(this.shortSerialise())
        )
        throw new Error("Depth exceeded resolving collisions")
      }
    }
    this.balls.forEach((a) => {
      a.update(t)
      a.fround()
    })
    if (this.proximityEnabled) {
      checkProximity(
        this.outcome,
        this.cueball,
        this.balls,
        this.proximityIndicator
      )
    }
  }

  /**
   * Returns true if all balls can advance by t without collision
   *
   */
  prepareAdvanceAll(t: number) {
    return (
      this.pairs.every((pair) => this.prepareAdvancePair(pair.a, pair.b, t)) &&
      this.balls.every((ball) => this.prepareAdvanceToCushions(ball, t))
    )
  }

  /**
   * Returns true if a pair of balls can advance by t without any collision.
   * If there is a collision, adjust velocity appropriately.
   *
   */
  private prepareAdvancePair(a: Ball, b: Ball, t: number) {
    if (Collision.willCollide(a, b, t)) {
      const incidentSpeed = Collision.collide(a, b)
      this.outcome.push(Outcome.collision(a, b, incidentSpeed))
      return false
    }
    return true
  }

  /**
   * Returns true if ball can advance by t without hitting cushion, knuckle or pocket.
   * If there is a collision, adjust velocity appropriately.
   *
   */
  private prepareAdvanceToCushions(a: Ball, t: number): boolean {
    if (!a.onTable()) {
      return true
    }
    const futurePosition = a.futurePosition(t)
    if (
      Math.abs(futurePosition.y) < TableGeometry.tableY &&
      Math.abs(futurePosition.x) < TableGeometry.tableX
    ) {
      return true
    }

    const incidentSpeed = Cushion.bounceAny(
      a,
      t,
      TableGeometry.hasPockets,
      this.cushionModel
    )
    if (incidentSpeed) {
      this.outcome.push(Outcome.cushion(a, incidentSpeed))
      return false
    }

    const k = Knuckle.findBouncing(a, t)
    if (k) {
      const knuckleIncidentSpeed = k.bounce(a)
      this.outcome.push(Outcome.cushion(a, knuckleIncidentSpeed))
      return false
    }
    const p = Pocket.findPocket(PocketGeometry.pocketCenters, a, t)
    if (p) {
      const pocketIncidentSpeed = p.fall(a, t)
      this.outcome.push(Outcome.pot(a, pocketIncidentSpeed))
      return false
    }

    return true
  }

  allStationary() {
    return this.balls.every((b) => !b.inMotion())
  }

  inPockets(): number {
    return this.balls.reduce((acc, b) => (b.onTable() ? acc : acc + 1), 0)
  }

  hit() {
    this.cue.hit(this.cueball)
    this.balls.forEach((b) => {
      b.ballmesh.trace.reset()
    })
  }

  serialise() {
    return {
      balls: this.balls.map((b) => b.serialise()),
      aim: this.cue.aim.copy(),
    }
  }

  serialiseHit() {
    const aim = this.cue.aim.copy()
    aim.pos.copy(this.cueball.pos)

    return {
      balls: [this.balls[0].serialise()],
      aim,
    }
  }

  static fromSerialised(data) {
    const table = new Table(data.balls.map((b) => Ball.fromSerialised(b)))
    table.updateFromSerialised(data)
    return table
  }

  updateFromSerialised(data) {
    if (data.balls) {
      data.balls.forEach((b) => Ball.updateFromSerialised(this.balls[b.id], b))
    }
    if (data.aim) {
      this.cue.aim = AimEvent.fromJson(data.aim)
    }
  }

  shortSerialise() {
    return this.balls
      .map((b) => [b.pos.x, b.pos.y])
      .reduce((acc, val) => acc.concat(val), [])
  }

  updateFromShortSerialised(data) {
    this.balls.forEach((b, i) => {
      b.pos.x = data[i * 2]
      b.pos.y = data[i * 2 + 1]
      b.pos.z = 0
      b.vel.copy(zero)
      b.rvel.copy(zero)
      b.state = State.Stationary
    })
  }

  addToScene(scene) {
    this.balls.forEach((b) => {
      b.ballmesh.addToScene(scene)
    })
    scene.add(this.cue.mesh)
    scene.add(this.cue.helperMesh)
    scene.add(this.cue.placerMesh)
    scene.add(this.cue.shadowMesh)
    scene.add(this.proximityIndicator.group)
  }

  showTraces(bool) {
    this.balls.forEach((b) => {
      b.ballmesh.trace.line.visible = bool
      b.ballmesh.trace.reset()
    })
  }

  showSpin(bool) {
    this.balls.forEach((b) => {
      b.ballmesh.spinAxisArrow.visible = bool
    })
  }

  halt() {
    this.balls.forEach((b) => {
      b.vel.copy(zero)
      b.rvel.copy(zero)
      b.state = State.Stationary
    })
  }

  overlapsAny(pos, excluding = this.cueball) {
    return this.balls
      .filter((b) => b !== excluding)
      .some((b) => b.pos.distanceTo(pos) < 2 * R)
  }
}
