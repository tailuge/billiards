import { Vector3 } from "three"
import { HitEvent } from "../../events/hitevent"
import { Table } from "../../model/table"
import { R } from "../../model/physics/constants"
import { atan2 } from "../../utils/utils"
import { Pocket } from "../../model/physics/pocket"
import { PocketGeometry } from "../../view/pocketgeometry"

export class AimCalculator {
  public readonly pockets: Vector3[]

  constructor() {
    this.pockets = this.extractPocketPositions(PocketGeometry.pocketCenters)
  }

  public getAimPoint(
    cuePos: Vector3,
    targetPos: Vector3,
    pockets: Vector3[] = this.pockets
  ): Vector3 {
    const bestPocket = this.findBestPocket(cuePos, targetPos, pockets)
    return this.calculateGhostBallPos(targetPos, bestPocket)
  }

  private extractPocketPositions(pockets: Pocket[]): Vector3[] {
    return pockets.map((pocket) => pocket.pos.clone().multiplyScalar(0.94))
  }

  generateRandomShot(
    table: Table,
    noise: number,
    targetPos?: Vector3
  ): HitEvent {
    const cueball = table.cueball
    const aim = table.cue.aim

    aim.pos.copy(cueball.pos)
    aim.i = table.balls.indexOf(cueball)

    if (!targetPos) {
      targetPos = new Vector3().random()
    }

    const lineTo = targetPos.clone().sub(cueball.pos)
    aim.angle = atan2(lineTo.y, lineTo.x) + (Math.random() - 0.5) * noise
    aim.power = 90 * R
    aim.offset = new Vector3(0, (Math.random() - 0.5) * 0.6)

    if (table.cue.intersectsAnything(table, aim)) {
      aim.offset.set(0, table.cue.offCenterLimit, 0)
    }

    return new HitEvent(table.serialise())
  }

  private findBestPocket(
    cuePos: Vector3,
    targetPos: Vector3,
    pockets: Vector3[]
  ): Vector3 {
    return pockets
      .map((p) => ({ pocket: p, score: this.cutScore(cuePos, targetPos, p) }))
      .sort((a, b) => a.score - b.score)[0].pocket
  }

  private cutScore(
    cuePos: Vector3,
    targetPos: Vector3,
    pocket: Vector3
  ): number {
    const shotLine = this.getDirectionVector(cuePos, targetPos)
    const pocketLine = this.getDirectionVector(targetPos, pocket)
    return 1 - shotLine.dot(pocketLine)
  }

  private calculateGhostBallPos(targetPos: Vector3, pocket: Vector3): Vector3 {
    const incidentVector = this.getDirectionVector(pocket, targetPos)
    return targetPos.clone().add(incidentVector.multiplyScalar(R * 2.001))
  }

  private getDirectionVector(from: Vector3, to: Vector3): Vector3 {
    return new Vector3().subVectors(to, from).normalize()
  }
}
