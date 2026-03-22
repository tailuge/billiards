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
    const amIWinner = this.determineWinner(container, session, forcedAmIWinner)
    const subtext = endSubtext ?? this.getScoreSubtext(container)

    this.updateRematchInfo(container, session, rulename, amIWinner)

    const fullSubtext = this.getFullSubtext(container, subtext, session)
    const hasRematch = !!session?.rematchInfo

    this.notifyEndState(container, amIWinner, fullSubtext, hasRematch)

    const result = this.createMatchResult(
      container,
      rulename,
      session,
      amIWinner
    )

    return new End(container, amIWinner ? result : undefined)
  }

  private static determineWinner(
    container: Container,
    session: Session | null,
    forcedAmIWinner?: boolean
  ): boolean {
    if (forcedAmIWinner !== undefined) {
      return forcedAmIWinner
    }

    const { p1, p2 } = container.getOrderedScores()
    const winnerIndex = p1 >= p2 ? 0 : 1
    const playerIndex = session?.playerIndex ?? 0
    return winnerIndex === playerIndex
  }

  private static updateRematchInfo(
    container: Container,
    session: Session | null,
    rulename: string,
    amIWinner: boolean
  ): void {
    if (!session || !session.clientId) return
    if (container.isSinglePlayer || Session.isBotMode()) return

    const opponentId = session.opponentClientId || "opponent"
    const winnerId = amIWinner ? session.clientId : opponentId
    const loserId = amIWinner ? opponentId : session.clientId

    if (!session.rematchInfo) {
      const opponentName = session.opponentName || "Opponent"
      session.rematchInfo = {
        opponentId,
        opponentName,
        ruleType: rulename,
        lastScores: [
          { userId: session.clientId, score: amIWinner ? 1 : 0 },
          { userId: opponentId, score: amIWinner ? 0 : 1 },
        ],
        nextTurnId: loserId,
      }
    } else {
      session.rematchInfo.lastScores.forEach((s) => {
        if (s.userId === winnerId) {
          s.score++
        }
      })
      session.rematchInfo.nextTurnId = loserId
    }
  }

  private static notifyEndState(
    container: Container,
    amIWinner: boolean,
    fullSubtext: string,
    hasRematch: boolean
  ): void {
    if (amIWinner) {
      this.notifyWin(container, fullSubtext, hasRematch)
      this.sendLossNotification(container, hasRematch)
    } else if (Session.isSpectator()) {
      this.notifySpectator(container, fullSubtext)
    } else {
      this.notifyLoss(container, fullSubtext, hasRematch)
    }
  }

  static isWinner(result: MatchResult): boolean {
    return result.winner === Session.getInstance()?.playername
  }

  private static notifyWin(
    container: Container,
    subtext: string,
    hasRematch: boolean = false
  ) {
    container.notifyLocal({
      type: "GameOver",
      title: "YOU WON",
      subtext: subtext,
      icon: "🏆",
      extraClass: "is-winner",
      extra: gameOverButtons.forMode(
        container.isSinglePlayer || Session.isBotMode(),
        hasRematch
      ),
      duration: 0,
    })
  }

  private static notifyLoss(
    container: Container,
    subtext: string,
    hasRematch: boolean = false
  ) {
    container.notifyLocal({
      type: "GameOver",
      title: "YOU LOST",
      subtext: Session.isBotMode() ? "Lostber 🦞" : subtext,
      icon: "🥈",
      extraClass: "is-loser",
      extra: gameOverButtons.forMode(
        container.isSinglePlayer || Session.isBotMode(),
        hasRematch
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

  private static sendLossNotification(
    container: Container,
    hasRematch: boolean = false
  ) {
    if (container.isSinglePlayer) return
    container.sendEvent(
      new NotificationEvent({
        type: "GameOver",
        title: "YOU LOST",
        icon: "🥈",
        extraClass: "is-loser",
        extra: gameOverButtons.forMode(false, hasRematch),
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

  private static getFullSubtext(
    container: Container,
    subtext: string,
    session: Session | null
  ): string {
    if (!session?.rematchInfo) return subtext
    const names = container.getOrderedNames()
    const scores = session.orderedRematchScores()
    return `${subtext} | Match Score: ${names.p1Name || "Player 1"} ${scores.p1} - ${scores.p2} ${names.p2Name || "Player 2"}`
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
