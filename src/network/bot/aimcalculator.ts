import { Vector3 } from "three";
import { HitEvent } from "../../events/hitevent";
import { Table } from "../../model/table";
import { R } from "../../model/physics/constants";
import { atan2 } from "../../utils/utils";
import { Pocket } from "../../model/physics/pocket";

export class AimCalculator {
  private readonly ballRadius: number;

  constructor() {
    this.ballRadius = R;
  }

  public getAimPoint(
    cuePos: Vector3,
    targetPos: Vector3,
    pockets: Vector3[],
  ): Vector3 | null {
    const bestPocket = this.findBestPocket(cuePos, targetPos, pockets);

    if (!bestPocket) return null;
    return this.calculateGhostBallPos(targetPos, bestPocket);
  }

  public extractPocketPositions(pockets: Pocket[]): Vector3[] {
    return pockets.map((pocket) => pocket.pos.clone().multiplyScalar(0.95));
  }

  generateRandomShot(table: Table, noise: number, targetPos?: Vector3): HitEvent {
    const cueball = table.cueball;
    const aim = table.cue.aim;

    if (!targetPos) {
      targetPos = new Vector3().random()
    }

    const lineTo = targetPos.clone().sub(cueball.pos);
    aim.angle = atan2(lineTo.y, lineTo.x) + (Math.random() - 0.5) * noise;
    aim.power = 80 * R;
    aim.offset = new Vector3(0, (Math.random() - 0.5) * 0.6);
    return new HitEvent(table.serialise());
  }

  private findBestPocket(
    cuePos: Vector3,
    targetPos: Vector3,
    pockets: Vector3[],
  ): Vector3 | undefined {
    return pockets
      .filter((pocket) => this.isPocketAhead(cuePos, targetPos, pocket))
      .sort(
        (a, b) => this.distanceSq(targetPos, a) - this.distanceSq(targetPos, b),
      )[0];
  }

  private isPocketAhead(
    cuePos: Vector3,
    targetPos: Vector3,
    pocket: Vector3,
  ): boolean {
    const shotLine = this.getDirectionVector(cuePos, targetPos);
    const pocketLine = this.getDirectionVector(targetPos, pocket);
    return shotLine.dot(pocketLine) > 0;
  }

  private calculateGhostBallPos(targetPos: Vector3, pocket: Vector3): Vector3 {
    const incidentVector = this.getDirectionVector(pocket, targetPos);
    return targetPos
      .clone()
      .add(incidentVector.multiplyScalar(this.ballRadius * 2.01));
  }

  private getDirectionVector(from: Vector3, to: Vector3): Vector3 {
    return new Vector3().subVectors(to, from).normalize();
  }

  private distanceSq(v1: Vector3, v2: Vector3): number {
    return v1.distanceToSquared(v2);
  }
}
