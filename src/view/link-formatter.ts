import { Container } from "../container/container"
import { ChatEvent } from "../events/chatevent"
import { ReplayEncoder } from "../utils/replay-encoder"

export class LinkFormatter {
  container: Container
  replayUrl: string = ""
  hiScoreUrl = "https://scoreboard-tailuge.vercel.app/hiscore.html"

  constructor(container: Container) {
    this.container = container
  }

  lastShotLink(isPartOfBreak: boolean, potCount: number, balls: any[], lastShot: any) {
    const pots = potCount > 1 ? potCount - 1 : 0

    let colourString = "#000000"
    if (balls.length > 0) {
      balls.forEach((element) => {
        if (element.ballmesh) {
          colourString = "#" + element.ballmesh.color.getHexString()
        }
      })
    }

    const shotIcon = "⚈".repeat(pots) + (isPartOfBreak ? "⚈" : "⚆")
    const serialisedShot = JSON.stringify(lastShot)
    this.generateLink(shotIcon, serialisedShot, colourString)
  }

  breakLink(currentBreak: any, breakScore: number, includeLastShot: boolean) {
    if (!currentBreak) {
      return
    }
    if (!includeLastShot) {
      currentBreak.shots.pop()
    }
    if (currentBreak.shots.length === 1) {
      return
    }

    currentBreak.score = breakScore
    const text = `break(${breakScore})`
    const serialisedShot = JSON.stringify(currentBreak)
    const compressed = ReplayEncoder.crush(serialisedShot)
    this.generateLink(text, compressed, "black")
    if (breakScore >= 2) {
      this.generateHiScoreLink(compressed)
    }
  }

  wholeGameLink(game: any) {
    const text = `frame(${this.shotCount(game.shots)} shots)`
    const serialisedGame = JSON.stringify(game)
    const compressed = ReplayEncoder.crush(serialisedGame)
    this.generateLink(text, compressed, "black")
  }

  private shotCount(shots: any[]) {
    return shots.filter((shot) => shot.type !== "RERACK").length
  }

  private generateLink(text: string, state: string, colour: string) {
    const shotUri = `${this.replayUrl}${ReplayEncoder.fullyEncodeURI(state)}`
    const shotLink = `<a class="pill" style="color: ${colour}" target="_blank" href="${shotUri}">${text}</a>`
    this.container.eventQueue.push(new ChatEvent(null, `${shotLink}`))
  }

  private generateHiScoreLink(state: string) {
    const text = "hi score 🏆"
    const shotUri = `${this.hiScoreUrl}?ruletype=${
      this.container.rules.rulename
    }&state=${ReplayEncoder.fullyEncodeURI(state)}`
    const shotLink = `<a class="pill" target="_blank" href="${shotUri}">${text}</a>`
    this.container.eventQueue.push(new ChatEvent(null, `${shotLink}`))
  }
}
