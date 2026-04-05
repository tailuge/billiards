import { Container } from "../container/container"
import { ChatEvent } from "../events/chatevent"
import { EventType } from "../events/eventtype"
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
    const text = `frame(${this.shotCount(game.shots)} shots)`
    const shotUri = this.getReplayUri(game)
    const shotLink = `<a class="pill" style="color: black" target="_blank" href="${shotUri}">${text}</a>`
    this.container.eventQueue.push(new ChatEvent(null, `${shotLink}`))
  }

  private shotCount(shots: any[]) {
    return shots.filter((shot) => shot.type === EventType.AIM).length
  }
}
