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
    const myScore = container.scores[playerIndex]
    const opponentScore = container.scores[1 - playerIndex]

    const actuallyWon = myScore >= opponentScore
    const ui = this.getGameOverUI(actuallyWon, Session.isSpectator())
    const subtext = this.getScoreSubtext(container, session, playerIndex)

    container.notifyLocal({
      type: "GameOver",
      title: ui.title,
      subtext: subtext,
      icon: ui.icon,
      extraClass: ui.extraClass,
      duration: 0,
    })

    const result = this.createMatchResult(container, rulename, session, playerIndex)
    const winnerIndex = container.scores[0] >= container.scores[1] ? 0 : 1
    const amIWinner = winnerIndex === playerIndex

    return new End(container, amIWinner ? result : undefined)
  }

  private static getGameOverUI(actuallyWon: boolean, isSpectator: boolean) {
    if (actuallyWon) {
      return { title: "YOU WON", icon: "🏆", extraClass: "is-winner" }
    } else if (!isSpectator) {
      return { title: "YOU LOST", icon: "🥈", extraClass: "is-loser" }
    } else {
      return { title: "GAME OVER", icon: "🏆", extraClass: "" }
    }
  }

  private static getScoreSubtext(
    container: Container,
    session: Session | null,
    playerIndex: number
  ): string {
    if (container.isSinglePlayer) {
      return `Score: ${container.scores[playerIndex]}`
    }

    const p0Name =
      playerIndex === 0
        ? session?.playername || "You"
        : session?.opponentName || "Opponent"
    const p1Name =
      playerIndex === 1
        ? session?.playername || "You"
        : session?.opponentName || "Opponent"

    return `${p0Name} ${container.scores[0]} - ${container.scores[1]} ${p1Name}`
  }

  private static createMatchResult(
    container: Container,
    rulename: string,
    session: Session | null,
    playerIndex: number
  ): MatchResult {
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

    return result
  }
}
