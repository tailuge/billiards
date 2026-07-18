import { Container } from "../../container/container"
import { NotificationEvent } from "../../events/notificationevent"
import { ScoreEvent } from "../../events/scoreevent"
import { End } from "../../controller/end"
import { Session } from "./session"
import { gameOverButtons } from "../../utils/gameover"
import { VERSION } from "../../utils/version"
import { NotificationHighBreak } from "../../view/notification"

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
    container.recorder.wholeGameLink()

    const session = Session.getInstance()
    const amIWinner = this.determineWinner(
      session,
      rulename,
      forcedAmIWinner,
      endSubtext
    )
    const subtext = endSubtext ?? this.getScoreSubtext(container, rulename)

    this.notifyEndState(container, rulename, amIWinner, subtext)

    const result = this.createMatchResult(rulename, session, amIWinner)

    return new End(container, result)
  }

  private static determineWinner(
    session: Session,
    rulename: string,
    forcedAmIWinner?: boolean,
    endSubtext?: string
  ): boolean {
    const { p1, p2 } = session.orderedScoresForHud()

    const winnerIndex = p1 >= p2 ? 0 : 1
    const playerIndex = session.playerIndex

    if (forcedAmIWinner !== undefined) {
      if (endSubtext?.toLowerCase().includes("conceded")) {
        return forcedAmIWinner
      }
      const isWinnerByScore = winnerIndex === playerIndex
      if (Session.isBotMode()) {
        // If it's a natural end (forcedAmIWinner came from rules), score should be considered
        // If it's a concession (forcedAmIWinner=false passed to rules), forcedAmIWinner should be respected.
        // Rules pass false to handleGameEnd when bot wins by score/legal pot.
        // But BotEventHandler should now be passing the correct winner based on score.
        return forcedAmIWinner
      }
      // For games like NineBall/EightBall, forcedAmIWinner (potting 9-ball/8-ball) is king.
      // For Snooker, score is king.
      if (rulename === "snooker") {
        return isWinnerByScore
      }
      return forcedAmIWinner
    }

    return winnerIndex === playerIndex
  }

  private static notifyEndState(
    container: Container,
    rulename: string,
    amIWinner: boolean,
    subtext: string
  ): void {
    if (amIWinner) {
      this.notifyWin(container, rulename, subtext)
      this.sendLossNotification(container, rulename)
    } else if (Session.isSpectator()) {
      this.notifySpectator(container, subtext)
    } else {
      this.notifyLoss(container, rulename, subtext)
      this.sendWinNotification(container, rulename)
    }
  }

  static isWinner(result: MatchResult): boolean {
    return result.winner === Session.getInstance().playername
  }

  private static notifyWin(
    container: Container,
    rulename: string,
    subtext: string
  ) {
    container.notifyLocal({
      type: "GameOver",
      title: "YOU WON",
      subtext: subtext,
      highBreaks: this.getHighBreaks(container),
      icon: "🏆",
      extraClass: "is-winner",
      extra: this.getGameOverButtons(container, rulename),
      duration: 0,
    })
  }

  private static notifyLoss(
    container: Container,
    rulename: string,
    subtext: string
  ) {
    container.notifyLocal({
      type: "GameOver",
      title: "YOU LOST",
      subtext: Session.isBotMode() ? "Lostber 🦞" : subtext,
      highBreaks: this.getHighBreaks(container),
      icon: "🥈",
      extraClass: "is-loser",
      extra: this.getGameOverButtons(container, rulename),
      duration: 0,
    })
  }

  private static notifySpectator(container: Container, subtext: string) {
    container.notifyLocal({
      type: "GameOver",
      title: "GAME OVER",
      subtext: subtext,
      highBreaks: this.getHighBreaks(container),
      icon: "🏆",
      extraClass: "",
      extra: gameOverButtons.lobby,
      duration: 0,
    })
  }

  private static sendLossNotification(container: Container, rulename: string) {
    if (container.isSinglePlayer) return
    const session = Session.getInstance()
    const { p1, p2 } = session.orderedScoresForHud()
    container.sendScoreUpdate(p1, p2, 0)
    container.sendEvent(
      new NotificationEvent({
        type: "GameOver",
        title: "YOU LOST",
        icon: "🥈",
        extraClass: "is-loser",
        extra: this.getRemoteGameOverButtons(rulename),
        duration: 0,
      })
    )
  }

  private static sendWinNotification(container: Container, rulename: string) {
    if (container.isSinglePlayer) return
    const session = Session.getInstance()
    const { p1, p2 } = session.orderedScoresForHud()
    container.sendEvent(new ScoreEvent(p1, p2, 0))
    container.sendEvent(
      new NotificationEvent({
        type: "GameOver",
        title: "YOU WON",
        icon: "🏆",
        extraClass: "is-winner",
        extra: this.getRemoteGameOverButtons(rulename),
        duration: 0,
      })
    )
  }

  private static getGameOverButtons(
    container: Container,
    rulename: string
  ): string {
    const session = Session.getInstance()
    const isSinglePlayer = container.isSinglePlayer || Session.isBotMode()
    const nextTurnId =
      session.playerIndex === 0 ? session.opponentClientId : session.clientId

    return gameOverButtons.forMode(
      isSinglePlayer,
      session.opponentClientId,
      session.opponentName,
      rulename,
      nextTurnId
    )
  }

  private static getRemoteGameOverButtons(rulename: string): string {
    const session = Session.getInstance()
    const nextTurnId =
      session.playerIndex === 0 ? session.opponentClientId : session.clientId

    return gameOverButtons.forMode(
      false,
      session.clientId,
      session.playername,
      rulename,
      nextTurnId
    )
  }

  private static calculateInningsStats(container: Container) {
    const entries = container.recorder.entries
    const shots = entries.filter((e) => e.event && e.event.type === "AIM")

    let whiteInnings = 0
    let yellowInnings = 0

    let previousCueBallIndex: number | null = null

    for (const entry of shots) {
      const currentCueBallIndex = (entry.event as any).i ?? 0

      if (currentCueBallIndex !== previousCueBallIndex) {
        if (currentCueBallIndex === 0) {
          whiteInnings++
        } else {
          yellowInnings++
        }
        previousCueBallIndex = currentCueBallIndex
      }
    }

    return {
      whiteInnings,
      yellowInnings,
    }
  }

  private static getScoreSubtext(
    container: Container,
    rulename: string
  ): string {
    if (rulename === "threecushion" || rulename === "sagu") {
      const stats = this.calculateInningsStats(container)
      if (container.isSinglePlayer) {
        const score = Session.getInstance().myScore()
        const totalInnings = stats.whiteInnings + stats.yellowInnings
        const avg = totalInnings > 0 ? (score / totalInnings).toFixed(2) : "0.00"
        return `Score: ${score} (Avg: ${avg} over ${totalInnings} inn)`
      } else {
        const { p1, p2 } = Session.getInstance().orderedScoresForHud()
        const names = Session.getInstance().orderedNamesForHud()
        const p1Name = names.p1Name || "Player 1"
        const p2Name = names.p2Name || "Player 2"

        const p1Innings = stats.whiteInnings
        const p2Innings = stats.yellowInnings

        const p1Avg = p1Innings > 0 ? (p1 / p1Innings).toFixed(2) : "0.00"
        const p2Avg = p2Innings > 0 ? (p2 / p2Innings).toFixed(2) : "0.00"

        return (
          `${p1Name}: ${p1} (Avg: ${p1Avg} over ${p1Innings} inn)\n` +
          `${p2Name}: ${p2} (Avg: ${p2Avg} over ${p2Innings} inn)`
        )
      }
    }

    if (container.isSinglePlayer) {
      return `Score: ${Session.getInstance().myScore()}`
    }

    const { p1, p2 } = Session.getInstance().orderedScoresForHud()
    return `${p1} - ${p2}`
  }

  public static getHighBreaks(container: Container): NotificationHighBreak[] {
    return container.ballTray
      .getTopBreaks(3)
      .map(({ score, hiScoreUri }) => ({ score, url: hiScoreUri }))
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
      bot: Session.isBotMode(),
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
