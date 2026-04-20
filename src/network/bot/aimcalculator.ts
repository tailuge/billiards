import { Vector3 } from "three"
import { HitEvent } from "../../events/hitevent"
import { Table } from "../../model/table"
import { R } from "../../model/physics/constants"
import { atan2 } from "../../utils/utils"
import { Pocket } from "../../model/physics/pocket"
import { PocketGeometry } from "../../view/pocketgeometry"
import { Knuckle } from "../../model/physics/knuckle"

/**
 * AimCalculator provides logic for the bot to calculate shot angles and power.
 * It uses a "ghost ball" method to determine where the cue ball should hit the target ball
 * to send it into a pocket.
 */
export class AimCalculator {
  private static readonly POCKET_INSET_FACTOR = 0.94
  private static readonly GHOST_BALL_DISTANCE_FACTOR = 2.001
  private static readonly RANDOM_OFFSET_RANGE = 0.6

  static readonly DEFAULT_SHOT_POWER = 90 * R
  static readonly MAX_SHOT_POWER = 120 * R
  public readonly pockets: Vector3[]
  public readonly knuckles: Vector3[]

  constructor() {
    this.pockets = this.extractPocketPositions(PocketGeometry.pocketCenters)
    this.knuckles = this.extractPocketKnucklePositions(PocketGeometry.knuckles)
  }

  /**
   * Calculates the ideal position for the cue ball to be at the moment of impact
   * with the target ball to send it towards the best pocket.
   */
  public getAimPoint(
    cuePos: Vector3,
    targetPos: Vector3,
    pockets: Vector3[] = this.pockets
  ): Vector3 {
    const bestPocket = this.findBestPocket(cuePos, targetPos, pockets)
    return this.calculateGhostBallPos(targetPos, bestPocket)
  }

  /**
   * Adjusts pocket centers slightly inward to ensure balls don't just hit the corner.
   */
  private extractPocketPositions(pockets: Pocket[]): Vector3[] {
    return pockets.map((pocket) =>
      pocket.pos.clone().multiplyScalar(AimCalculator.POCKET_INSET_FACTOR)
    )
  }

  private extractPocketKnucklePositions(knuckles: []): Vector3[] {
    return knuckles
      .map((knuckle) => (knuckle as Knuckle).pos.clone())
      .map((pos) => {
        return pos.lerp(this.closestPocket(pos), 0.6)
      })
  }

  private closestPocket(pos) {
    return [...this.pockets].sort(
      (a, b) => pos.distanceTo(a) - pos.distanceTo(b)
    )[0]
  }

  public closestKnuckles(pos) {
    return [...this.knuckles]
      .sort((a, b) => pos.distanceTo(a) - pos.distanceTo(b))
      .slice(0, 2)
  }

  /**
   * Generates a HitEvent for a shot towards a target position, optionally adding noise.
   */
  public generateShot(
    table: Table,
    noise: number,
    power: number,
    targetPos: Vector3 = new Vector3().random(),
    spinOffset: Vector3 = AimCalculator.randomSpin()
  ): HitEvent {
    const { cueball, cue, balls } = table
    const { aim } = cue

    aim.pos.copy(cueball.pos)
    aim.i = balls.indexOf(cueball)

    const lineTo = targetPos.clone().sub(cueball.pos)
    aim.angle = atan2(lineTo.y, lineTo.x) + (Math.random() - 0.5) * noise
    aim.power = power
    aim.offset = spinOffset

    if (cue.intersectsAnything(table, aim)) {
      aim.offset.set(0, cue.offCenterLimit, 0)
    }

    return new HitEvent(table.serialiseHit())
  }

  /**
   * Finds the pocket that requires the smallest cut angle for the given shot.
   */
  public findBestPocket(
    cuePos: Vector3,
    targetPos: Vector3,
    pockets: Vector3[]
  ): Vector3 {
    return pockets
      .map((p) => ({
        pocket: p,
        score: this.calculateCutScore(cuePos, targetPos, p),
      }))
      .sort((a, b) => a.score - b.score)[0].pocket
  }

  /**
   * Calculates a score based on the cut angle.
   */
  private calculateCutScore(
    cuePos: Vector3,
    targetPos: Vector3,
    pocket: Vector3
  ): number {
    const shotLine = this.getDirectionVector(cuePos, targetPos)
    const pocketLine = this.getDirectionVector(targetPos, pocket)
    return 1 - shotLine.dot(pocketLine)
  }

  /**
   * Calculates the position where the cue ball should be to hit the target ball towards the pocket.
   */
  private calculateGhostBallPos(targetPos: Vector3, pocket: Vector3): Vector3 {
    const incidentVector = this.getDirectionVector(pocket, targetPos)
    return targetPos
      .clone()
      .add(
        incidentVector.multiplyScalar(
          R * AimCalculator.GHOST_BALL_DISTANCE_FACTOR
        )
      )
  }

  private getDirectionVector(from: Vector3, to: Vector3): Vector3 {
    return new Vector3().subVectors(to, from).normalize()
  }

  static randomSpin() {
    return new Vector3(
      0,
      (Math.random() - 0.5) * AimCalculator.RANDOM_OFFSET_RANGE
    )
  }

  /**
   * @param pos Current position of the moving ball
   * @param vel Velocity vector of the moving ball
   * @param target Center position of the stationary ball
   */
  static checkCollision(pos: Vector3, vel: Vector3, target: Vector3): boolean {
    // 1. Vector from moving ball to target
    const toTarget = new Vector3().subVectors(target, pos)

    // 2. Project toTarget onto the velocity vector to find the closest point's distance along the path
    const velNormalized = vel.clone().normalize()
    const dParallel = toTarget.dot(velNormalized)

    // 3. If dParallel is negative, the target is "behind" the moving ball
    if (dParallel < 0) return false

    // 4. Calculate the perpendicular distance squared using the Pythagorean theorem:
    // distSq = |toTarget|^2 - dParallel^2
    const distSq = toTarget.lengthSq() - dParallel * dParallel

    // 5. Collision occurs if the closest distance is within the combined radii
    return distSq <= 2 * R * 2 * R
  }
}
