import { ChatEvent } from "../events/chatevent"
import { BeginEvent, Controller } from "./controller"
import { Init } from "./init"
import { Container } from "../container/container"
import { MatchResult, MatchResultHelper } from "../network/client/matchresult"
import { ReplayEncoder } from "../utils/replay-encoder"
import { Session } from "../network/client/session"

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
    this.container.view.camera.forceMode(this.container.view.camera.orbitView)
    this.container.stayActive = true
    this.container.menu?.setConcedeVisible(false)
    console.log("result:", this.result)
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
  }

  override handleChat(chatevent: ChatEvent): Controller {
    const sender = chatevent.sender ? `${chatevent.sender}:` : ""
    const message = `${sender} ${chatevent.message}`
    this.container.chat.showMessage(message)
    return this
  }

  override handleBegin(_: BeginEvent): Controller {
    this.container.particles.dispose()
    return new Init(this.container)
  }
}
