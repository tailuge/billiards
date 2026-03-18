import { ChatEvent } from "../events/chatevent"
import { BeginEvent, Controller } from "./controller"
import { Init } from "./init"
import { Container } from "../container/container"
import { MatchResult, MatchResultHelper } from "../network/client/matchresult"
import { ReplayEncoder } from "../utils/replay-encoder"
import { Trophy } from "../view/trophy"

export class End extends Controller {
  override get name(): string {
    return "End"
  }

  private readonly result?: MatchResult | undefined
  private trophy?: Trophy

  constructor(container: Container, result?: MatchResult | undefined) {
    super(container)
    this.result = result
  }

  override onFirst(): void {
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
      if (MatchResultHelper.isWinner(this.result)) {
        this.showTrophy()
      }
    }
  }

  private showTrophy() {
    this.trophy = new Trophy(Date.now() % 999999, ["🇬🇧"])
    this.trophy.group.position.set(0, 0, -0.03)
    this.container.view.scene.add(this.trophy.group)
  }

  override handleChat(chatevent: ChatEvent): Controller {
    const sender = chatevent.sender ? `${chatevent.sender}:` : ""
    const message = `${sender} ${chatevent.message}`
    this.container.chat.showMessage(message)
    return this
  }

  override handleBegin(_: BeginEvent): Controller {
    if (this.trophy) {
      this.container.view.scene.remove(this.trophy.group)
      this.trophy.dispose()
    }
    return new Init(this.container)
  }
}
