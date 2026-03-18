import { Container } from "../../container/container"
import { ChatEvent } from "../../events/chatevent"
import { NotificationEvent } from "../../events/notificationevent"
import { End } from "../../controller/end"
import { Session } from "./session"
import { gameOverButtons } from "../../utils/gameover"
import { VERSION } from "../../utils/version"

export interface MatchResult {
  winner: string
  loser?: string
  winnerScore: number
  loserScore?: number
  ruleType: string
  replayData?: string
  version?: string
  userAgent?: string
}

export class MatchResultHelper {
  static presentGameEnd(
    container: Container,
    rulename: string,
    forcedAmIWinner?: boolean,
    endSubtext?: string
  ): End {
    container.eventQueue.push(new ChatEvent(null, "game over"))
    container.recorder.wholeGameLink()

    const session = Session.hasInstance() ? Session.getInstance() : null
    const { p1, p2 } = container.getOrderedScores()
    const winnerIndex = p1 >= p2 ? 0 : 1
    const playerIndex = session?.playerIndex ?? 0
    const amIWinner = forcedAmIWinner ?? winnerIndex === playerIndex

    const subtext = endSubtext ?? this.getScoreSubtext(container)

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
      amIWinner
    )

    return new End(container, amIWinner ? result : undefined)
  }

  static isWinner(result: MatchResult): boolean {
    return result.winner === Session.getInstance()?.playername
  }

  private static notifyWin(container: Container, subtext: string) {
    container.notifyLocal({
      type: "GameOver",
      title: "YOU WON",
      subtext: subtext,
      icon: "🏆",
      extraClass: "is-winner",
      extra: gameOverButtons.forMode(
        container.isSinglePlayer || Session.isBotMode()
      ),
      duration: 0,
    })
  }

  private static notifyLoss(container: Container, subtext: string) {
    container.notifyLocal({
      type: "GameOver",
      title: "YOU LOST",
      subtext: Session.isBotMode() ? "Lostber 🦞" : subtext,
      icon: "🥈",
      extraClass: "is-loser",
      extra: gameOverButtons.forMode(
        container.isSinglePlayer || Session.isBotMode()
      ),
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

  private static getScoreSubtext(container: Container): string {
    if (container.isSinglePlayer) {
      return `Score: ${container.getMyScore()}`
    }

    const { p1Name, p2Name } = container.getOrderedNames()
    const { p1, p2 } = container.getOrderedScores()
    return `${p1Name || "You"} ${p1} - ${p2} ${p2Name || "Opponent"}`
  }

  private static createMatchResult(
    container: Container,
    rulename: string,
    session: Session | null,
    iWon: boolean
  ): MatchResult {
    const myScore = container.getMyScore()
    const opponentScore = container.getOpponentScore()
    const winnerName = iWon
      ? session?.playername || "Anon"
      : session?.opponentName || "Opponent"
    const loserName = iWon
      ? session?.opponentName || "Opponent"
      : session?.playername || "Anon"
    const winnerScore = iWon ? myScore : opponentScore
    const loserScore = iWon ? opponentScore : myScore

    const result: MatchResult = {
      winner: winnerName,
      winnerScore: winnerScore,
      ruleType: rulename,
    }

    if (session?.opponentName) {
      result.loser = loserName
      result.loserScore = loserScore
    }

    result.version = VERSION
    result.userAgent = navigator?.userAgent
    return result
  }
}
