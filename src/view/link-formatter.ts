import { Container } from "../container/container"
import { ReplayEncoder } from "../utils/replay-encoder"

export class LinkFormatter {
  container: Container
  replayUrl: string = ""
  hiScoreUrl = "https://scoreboard-tailuge.vercel.app/hiscore.html"

  constructor(container: Container) {
    this.container = container
  }

  getReplayUri(state: any): string {
    const serialised =
      typeof state === "string" ? state : JSON.stringify(state)
    const compressed = ReplayEncoder.crush(serialised)
    return `${this.replayUrl}${ReplayEncoder.fullyEncodeURI(compressed)}`
  }

  getHiScoreUri(state: any): string {
    const serialised =
      typeof state === "string" ? state : JSON.stringify(state)
    const compressed = ReplayEncoder.crush(serialised)
    return `${this.hiScoreUrl}?ruletype=${
      this.container.rules.rulename
    }&state=${ReplayEncoder.fullyEncodeURI(compressed)}`
  }

  wholeGameLink(game: any) {
    this.container.ballTray.addGame(game)
  }
}
