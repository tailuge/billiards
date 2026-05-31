import { ControllerBase } from "./controllerbase"
import { Controller, Input } from "./controller"
import { Aim } from "./aim"
import { DrillReplay } from "./drillreplay"

export class DrillOptions extends ControllerBase {
  override get name() {
    return "DrillOptions"
  }
  private readonly preShotState: number[]

  constructor(container, preShotState: number[]) {
    super(container)
    this.preShotState = preShotState
  }

  override onFirst() {
    this.container.table.cue.aimInputs.setDisabled(false)
    this.container.table.cue.aimInputs.setButtonText("Continue")
  }

  override handleInput(input: Input): Controller {
    switch (input.key) {
      case "SpaceUp":
        this.container.notification.clear()
        return new Aim(this.container)
      case "KeyRUp":
        this.container.notification.clear()
        this.container.table.updateFromShortSerialised(this.preShotState)
        return new Aim(this.container)
      case "KeyVUp": {
        this.container.notification.clear()
        const recorder = this.container.recorder
        const last = recorder.last()
        if (last >= 0) {
          return new DrillReplay(
            this.container,
            this.preShotState,
            [recorder.entries[last].event]
          )
        }
        return this
      }
      case "KeySUp": {
        const balls = this.container.table.balls
        this.container.rules.cueball =
          this.container.rules.cueball === balls[0] ? balls[1] : balls[0]
        this.container.table.cueball = this.container.rules.cueball
        this.container.table.cue.aim.i = balls.indexOf(
          this.container.table.cueball
        )
        this.container.table.cue.moveTo(this.container.table.cueball.pos)
        break
      }
      default:
        this.commonKeyHandler(input)
    }
    return this
  }
}
