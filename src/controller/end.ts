import { BeginEvent, Controller } from "./controller"
import { Init } from "./init"
import { Container } from "../container/container"
import { MatchResult, MatchResultHelper } from "../network/client/matchresult"
import { ReplayEncoder } from "../utils/replay-encoder"
import { Session } from "../network/client/session"
import { BreakEvent } from "../events/breakevent"
import { Replay } from "./replay"

export class End extends Controller {
  override get name(): string {
    return "End"
  }

  private readonly result?: MatchResult | undefined

  constructor(container: Container, result?: MatchResult | undefined) {
    super(container)
    this.result = result
  }

  override onFirst(): void {
    const isDiagram = this.container.id === "diagram"
    this.container.view.camera.forceMode(
      isDiagram
        ? this.container.view.camera.topView
        : this.container.view.camera.orbitView
    )
    this.container.menu?.setConcedeVisible(false)
    console.log("result:", this.result)
    if (isDiagram) {
      return
    }
    if (this.result && this.container.scoreReporter) {
      try {
        const gameState = this.container.recorder.wholeGame()
        const jsonState = JSON.stringify(gameState)
        this.result.replayData = ReplayEncoder.crush(jsonState)
      } catch (e) {
        console.error("Failed to encode replay data", e)
      }
      this.container.scoreReporter.submitMatchResult(this.result)
    }

    const wasBotWin = !this.result && Session.isBotMode()
    if (wasBotWin) {
      return
    }

    if (!this.result || MatchResultHelper.isWinner(this.result)) {
      this.container.particles.initParticles(this.container.view.scene)
    }

    const highBreaks = MatchResultHelper.getHighBreaks(this.container)
    this.container.notification?.updateHighBreaks(highBreaks)
  }

  override handleBegin(_: BeginEvent): Controller {
    this.container.particles.dispose()
    return new Init(this.container)
  }

  override handleBreak(event: BreakEvent): Controller {
    if (event.init) {
      this.container.table.updateFromShortSerialised(event.init)
      return new Replay(
        this.container,
        event.init,
        event.shots,
        false,
        1000,
        event.diagram
      )
    }
    return this
  }
}
