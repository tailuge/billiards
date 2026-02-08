import { Container } from "../../container/container"
import { MatchResult } from "../../network/client/matchresult"
import { Session } from "../../network/client/session"
import { End } from "../end"

export class SnookerScoring {
  static presentGameEnd(container: Container, rulename: string): End {
    container.eventQueue.push({
      type: "chat",
      sender: null,
      message: "game over",
    } as any)
    container.recorder.wholeGameLink()

    const session = Session.hasInstance() ? Session.getInstance() : null
    const playerIndex = Session.playerIndex()
    const opponentIndex = 1 - playerIndex
    const myScore = container.scores[playerIndex]
    const opponentScore = container.scores[opponentIndex]

    const actuallyWon = myScore >= opponentScore

    let title: string
    let subtext: string
    let icon: string
    let extraClass = ""

    if (actuallyWon) {
      title = "YOU WON"
      icon = "🏆"
      extraClass = "is-winner"
    } else if (!Session.isSpectator()) {
      title = "YOU LOST"
      icon = "🥈"
      extraClass = "is-loser"
    } else {
      title = "GAME OVER"
      icon = "🏆"
    }

    if (container.isSinglePlayer) {
      subtext = `Score: ${myScore}`
    } else {
      const p0Name =
        playerIndex === 0
          ? session?.playername || "You"
          : session?.opponentName || "Opponent"
      const p1Name =
        playerIndex === 1
          ? session?.playername || "You"
          : session?.opponentName || "Opponent"
      subtext = `${p0Name} ${container.scores[0]} - ${container.scores[1]} ${p1Name}`
    }

    container.notifyLocal({
      type: "GameOver",
      title: title,
      subtext: subtext,
      icon: icon,
      extraClass: extraClass,
      duration: 0,
    })

    const winnerIndex = container.scores[0] >= container.scores[1] ? 0 : 1
    const loserIndex = 1 - winnerIndex

    const winnerName =
      winnerIndex === playerIndex
        ? session?.playername || "Anon"
        : session?.opponentName || "Opponent"
    const loserName =
      loserIndex === playerIndex
        ? session?.playername || "Anon"
        : session?.opponentName || "Opponent"

    const result: MatchResult = {
      winner: winnerName,
      winnerScore: container.scores[winnerIndex],
      gameType: rulename,
    }

    if (session?.opponentName) {
      result.loser = loserName
      result.loserScore = container.scores[loserIndex]
    }

    const amIWinner = winnerIndex === playerIndex
    return new End(container, amIWinner ? result : undefined)
  }
}
