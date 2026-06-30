import { Container } from "../container/container"
import { ReplayEncoder } from "../utils/replay-encoder"
import { Session } from "../network/client/session"

export class LinkFormatter {
  container: Container
  replayUrl: string = ""
  hiScoreUrl = "https://scoreboard-tailuge.vercel.app/hiscore.html"

  constructor(container: Container) {
    this.container = container
  }

  getReplayUri(state: any): string {
    const compressed = ReplayEncoder.crush(state)
    return `${this.replayUrl}${ReplayEncoder.fullyEncodeURI(compressed)}`
  }

  getHiScoreUri(state: any, score: number): string {
    state.score = score
    const compressed = ReplayEncoder.crush(state)
    const session = Session.getInstance()
    return `${this.hiScoreUrl}?ruletype=${
      this.container.rules.rulename
    }&state=${ReplayEncoder.fullyEncodeURI(compressed)}&userId=${
      session.clientId
    }&userName=${encodeURIComponent(session.playername)}`
  }

  wholeGameLink(game: any) {
    this.container.ballTray.addGame(game)
  }
}
