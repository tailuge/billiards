import { Container } from "../../container/container"
import { ChatEvent } from "../../events/chatevent"
import { NotificationEvent } from "../../events/notificationevent"
import { End } from "../../controller/end"
import { Session } from "./session"
import { Rematch } from "./rematch"
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
  bot?: boolean
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

    const session = Session.getInstance()
    const amIWinner = this.determineWinner(session, forcedAmIWinner)
    const subtext = endSubtext ?? this.getScoreSubtext(container)

    this.updateRematchInfo(container, session, rulename, amIWinner)

    const hasRematch = !!session.rematchInfo

    this.notifyEndState(container, amIWinner, subtext, hasRematch)

    const result = this.createMatchResult(rulename, session, amIWinner)

    return new End(container, amIWinner ? result : undefined)
  }

  private static determineWinner(
    session: Session,
    forcedAmIWinner?: boolean
  ): boolean {
    if (forcedAmIWinner !== undefined) {
      return forcedAmIWinner
    }

    const { p1, p2 } = session.orderedScoresForHud()

    const winnerIndex = p1 >= p2 ? 0 : 1
    const playerIndex = session.playerIndex
    return winnerIndex === playerIndex
  }

  private static updateRematchInfo(
    container: Container,
    session: Session,
    rulename: string,
    amIWinner: boolean
  ): void {
    Rematch.update(session, rulename, amIWinner, container.isSinglePlayer)
  }

  private static notifyEndState(
    container: Container,
    amIWinner: boolean,
    subtext: string,
    hasRematch: boolean
  ): void {
    const session = Session.getInstance()
    const matchScore =
      hasRematch && session.rematchInfo
        ? Rematch.getMatchScoreText(session, session.orderedNamesForHud())
        : undefined

    if (amIWinner) {
      this.notifyWin(container, subtext, matchScore, hasRematch)
      this.sendLossNotification(container, matchScore, hasRematch)
    } else if (Session.isSpectator()) {
      this.notifySpectator(container, subtext, matchScore)
    } else {
      this.notifyLoss(container, subtext, matchScore, hasRematch)
    }
  }

  static isWinner(result: MatchResult): boolean {
    return result.winner === Session.getInstance().playername
  }

  private static notifyWin(
    container: Container,
    subtext: string,
    matchScore: string | undefined,
    hasRematch: boolean = false
  ) {
    container.notifyLocal({
      type: "GameOver",
      title: "YOU WON",
      subtext: subtext,
      matchScore: matchScore,
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
    matchScore: string | undefined,
    hasRematch: boolean = false
  ) {
    container.notifyLocal({
      type: "GameOver",
      title: "YOU LOST",
      subtext: Session.isBotMode() ? "Lostber 🦞" : subtext,
      matchScore: matchScore,
      icon: "🥈",
      extraClass: "is-loser",
      extra: gameOverButtons.forMode(
        container.isSinglePlayer || Session.isBotMode(),
        hasRematch
      ),
      duration: 0,
    })
  }

  private static notifySpectator(
    container: Container,
    subtext: string,
    matchScore: string | undefined
  ) {
    container.notifyLocal({
      type: "GameOver",
      title: "GAME OVER",
      subtext: subtext,
      matchScore: matchScore,
      icon: "🏆",
      extraClass: "",
      extra: gameOverButtons.lobby,
      duration: 0,
    })
  }

  private static sendLossNotification(
    container: Container,
    matchScore: string | undefined,
    hasRematch: boolean = false
  ) {
    if (container.isSinglePlayer) return
    container.sendEvent(
      new NotificationEvent({
        type: "GameOver",
        title: "YOU LOST",
        matchScore: matchScore,
        icon: "🥈",
        extraClass: "is-loser",
        extra: gameOverButtons.forMode(false, hasRematch),
        duration: 0,
      })
    )
  }

  private static getScoreSubtext(container: Container): string {
    if (container.isSinglePlayer) {
      return `Score: ${Session.getInstance().myScore()}`
    }

    const { p1Name, p2Name } = Session.getInstance().orderedNamesForHud()
    const { p1, p2 } = Session.getInstance().orderedScoresForHud()
    return `${p1Name || "You"} ${p1} - ${p2} ${p2Name || "Opponent"}`
  }

  private static createMatchResult(
    rulename: string,
    session: Session,
    iWon: boolean
  ): MatchResult {
    const myScore = session.myScore()
    const opponentScore = session.opponentScore()

    const winnerName = iWon
      ? session.playername || "Anon"
      : session.opponentName || "Opponent"
    const loserName = iWon
      ? session.opponentName || "Opponent"
      : session.playername || "Anon"
    const winnerScore = iWon ? myScore : opponentScore
    const loserScore = iWon ? opponentScore : myScore

    const result: MatchResult = {
      winner: winnerName,
      winnerScore: winnerScore,
      ruleType: rulename,
      bot: session.botMode,
    }

    if (session.opponentName) {
      result.loser = loserName
      result.loserScore = loserScore
    }

    result.version = VERSION
    result.userAgent = navigator?.userAgent
    return result
  }
}
