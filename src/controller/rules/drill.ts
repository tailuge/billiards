import { MathUtils, Vector3 } from "three"
import { Controller } from "../controller"
import { Outcome } from "../../model/outcome"
import { TableGeometry } from "../../view/tablegeometry"
import { ThreeCushion } from "./threecushion"
import { Aim } from "../aim"

export class Drill extends ThreeCushion {
  preShotState: number[] = []

  override allowsPlaceBall(): boolean {
    return true
  }

  override placeBall(target?: Vector3): Vector3 {
    if (!target) return new Vector3(0, 0, 0)
    target.x = MathUtils.clamp(
      target.x,
      -TableGeometry.tableX,
      TableGeometry.tableX
    )
    target.y = MathUtils.clamp(
      target.y,
      -TableGeometry.tableY,
      TableGeometry.tableY
    )
    return target
  }

  override update(outcomes: Outcome[]): Controller {
    const last = this.container.recorder.last()
    this.preShotState = this.container.recorder.entries[last]?.state ?? []

    if (Outcome.isThreeCushionPoint(this.cueball, outcomes)) {
      this.container.sound.playSuccess(outcomes.length / 3)
      this.currentBreak++
    } else {
      this.previousBreak = this.currentBreak
      this.currentBreak = 0
      this.cueball = this.otherPlayersCueBall()
      this.container.table.cueball = this.cueball
      this.container.table.cue.aim.i = this.container.table.balls.indexOf(
        this.cueball
      )
    }
    return new Aim(this.container)
  }

  override isEndOfGame(_outcome: Outcome[]): boolean {
    return false
  }

  initialController(): Controller {
    return new Aim(this.container)
  }
}
