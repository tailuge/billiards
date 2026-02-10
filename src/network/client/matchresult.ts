import { Container } from "../../container/container"
import { ChatEvent } from "../../events/chatevent"
import { NotificationEvent } from "../../events/notificationevent"
import { End } from "../../controller/end"
import { Session } from "./session"
import { gameOverButtons } from "../../utils/gameover"

export interface MatchResult {
  winner: string
  loser?: string
  winnerScore: number
  loserScore?: number
  ruleType: string
  replayData?: string
}

export class MatchResultHelper {
  static presentGameEnd(container: Container, rulename: string): End {
    container.eventQueue.push(new ChatEvent(null, "game over"))
    container.recorder.wholeGameLink()

    const session = Session.hasInstance() ? Session.getInstance() : null
    const playerIndex = Session.playerIndex()
    const winnerIndex = container.scores[0] >= container.scores[1] ? 0 : 1
    const amIWinner = winnerIndex === playerIndex

    const subtext = this.getScoreSubtext(container, session, playerIndex)

    if (amIWinner) {
      this.notifyWin(container, subtext)
      this.sendLossNotification(container)
    } else if (Session.isSpectator()) {
      this.notifySpectator(container, subtext)
    } else {
      this.notifyLoss(container, subtext)
    }

    const result = this.createMatchResult(
      container,
      rulename,
      session,
      playerIndex
    )

    return new End(container, amIWinner ? result : undefined)
  }

  private static notifyWin(container: Container, subtext: string) {
    container.notifyLocal({
      type: "GameOver",
      title: "YOU WON",
      subtext: subtext,
      icon: "🏆",
      extraClass: "is-winner",
      extra: gameOverButtons.forMode(container.isSinglePlayer),
      duration: 0,
    })
  }

  private static notifyLoss(container: Container, subtext: string) {
    container.notifyLocal({
      type: "GameOver",
      title: "YOU LOST",
      subtext: subtext,
      icon: "🥈",
      extraClass: "is-loser",
      extra: gameOverButtons.forMode(container.isSinglePlayer),
      duration: 0,
    })
  }

  private static notifySpectator(container: Container, subtext: string) {
    container.notifyLocal({
      type: "GameOver",
      title: "GAME OVER",
      subtext: subtext,
      icon: "🏆",
      extraClass: "",
      extra: gameOverButtons.lobby,
      duration: 0,
    })
  }

  private static sendLossNotification(container: Container) {
    if (container.isSinglePlayer) return
    container.sendEvent(
      new NotificationEvent({
        type: "GameOver",
        title: "YOU LOST",
        icon: "🥈",
        extraClass: "is-loser",
        extra: gameOverButtons.forMode(false),
        duration: 0,
      })
    )
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
      ruleType: rulename,
    }

    if (session?.opponentName) {
      result.loser = loserName
      result.loserScore = container.scores[loserIndex]
    }

    return result
  }
}
