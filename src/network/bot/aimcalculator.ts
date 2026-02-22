import { Vector3 } from "three"
import { Pocket } from "../../model/physics/pocket"

export class AimCalculator {
  private readonly ballRadius: number

  constructor(ballRadius: number) {
    this.ballRadius = ballRadius
  }

  /**
   * Main entry point: Determines the optimal aim point (Ghost Ball position).
   * Note: The source of the pocket list is typically PocketGeometry.pocketCenters.
   */
  public getAimPoint(
    cuePos: Vector3,
    targetPos: Vector3,
    pockets: Vector3[]
  ): Vector3 | null {
    const bestPocket = this.findBestPocket(cuePos, targetPos, pockets)

    if (!bestPocket) return null
    return this.calculateGhostBallPos(targetPos, bestPocket)
  }

  /**
   * Extracts positions from a list of Pocket objects.
   * Note: The source of the pocket list is typically PocketGeometry.pocketCenters.
   */
  public extractPocketPositions(pockets: Pocket[]): Vector3[] {
    return pockets.map((pocket) => pocket.pos)
  }

  /**
   * Filters pockets that are 'forward' relative to the shot line,
   * then selects the closest one to the target ball.
   */
  private findBestPocket(
    cuePos: Vector3,
    targetPos: Vector3,
    pockets: Vector3[]
  ): Vector3 | undefined {
    return pockets
      .filter((pocket) => this.isPocketAhead(cuePos, targetPos, pocket))
      .sort(
        (a, b) => this.distanceSq(targetPos, a) - this.distanceSq(targetPos, b)
      )[0]
  }

  /**
   * Checks if a pocket is reachable (ahead of the cue-to-target line).
   * Uses dot product: (Cue->Target) . (Target->Pocket) > 0
   */
  private isPocketAhead(
    cuePos: Vector3,
    targetPos: Vector3,
    pocket: Vector3
  ): boolean {
    const shotLine = this.getDirectionVector(cuePos, targetPos)
    const pocketLine = this.getDirectionVector(targetPos, pocket)
    return shotLine.dot(pocketLine) > 0
  }

  /**
   * Calculates the Ghost Ball position (Aim Point).
   * Logic: TargetPos + (Normalized(Pocket->Target) * 2 * Radius)
   */
  private calculateGhostBallPos(targetPos: Vector3, pocket: Vector3): Vector3 {
    // Vector pointing FROM pocket TO target ball
    const incidentVector = this.getDirectionVector(pocket, targetPos)

    // Offset target position by 2 radii along that vector
    return targetPos
      .clone()
      .add(incidentVector.multiplyScalar(this.ballRadius * 2))
  }

  // --- Low-level Helpers ---

  private getDirectionVector(from: Vector3, to: Vector3): Vector3 {
    return new Vector3().subVectors(to, from).normalize() // subVectors is immutable to inputs
  }

  private distanceSq(v1: Vector3, v2: Vector3): number {
    return v1.distanceToSquared(v2) // Squared is faster than sqrt for sorting
  }
}
