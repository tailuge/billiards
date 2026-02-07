import { ChatEvent } from "../events/chatevent"
import { BeginEvent, Controller } from "./controller"
import { Init } from "./init"
import { Container } from "../container/container"
import { MatchResult } from "../network/client/matchresult"
import { ReplayEncoder } from "../utils/replay-encoder"

export class End extends Controller {
  private result?: MatchResult | undefined

  constructor(container: Container, result?: MatchResult | undefined) {
    super(container)
    this.result = result
  }

  override onFirst(): void {
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
  }

  override handleChat(chatevent: ChatEvent): Controller {
    const sender = chatevent.sender ? `${chatevent.sender}:` : ""
    const message = `${sender} ${chatevent.message}`
    this.container.chat.showMessage(message)
    return this
  }

  override handleBegin(_: BeginEvent): Controller {
    return new Init(this.container)
  }
}
