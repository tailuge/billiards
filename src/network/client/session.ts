import { RematchInfo } from "./rematch"

export class Session {
  constructor(
    public playername: string,
    readonly clientId: string,
    readonly tableId: string,
    readonly spectator: boolean,
    readonly botMode: boolean = false,
    readonly practiceMode: boolean = false
  ) {}

  rematchInfo?: RematchInfo | undefined
  opponentName?: string
  opponentClientId?: string
  spectatedP1Name?: string
  spectatedP2Name?: string
  playerIndex: number = 0
  private scoreByClientId: Record<string, number> = {}
  currentBreak: number = 0

  private static instance: Session | undefined
  private static readonly fallbackOpponentClientId = "opponent"

  static getInstance(): Session {
    if (!Session.instance) {
      throw new Error("Session not initialized")
    }
    return Session.instance
  }

  static playerIndex(): number {
    return Session.getInstance().playerIndex
  }

  static isSpectator(): boolean {
    return Session.getInstance().spectator
  }

  static isBotMode(): boolean {
    return Session.getInstance().botMode
  }

  static isPracticeMode(): boolean {
    return Session.instance?.practiceMode ?? false
  }

  static reset() {
    Session.instance = undefined
  }

  static init(
    clientId: string,
    playername: string,
    tableId: string,
    spectator: boolean,
    botMode: boolean = false,
    practiceMode: boolean = false
  ) {
    Session.instance = new Session(
      playername,
      clientId,
      tableId,
      spectator,
      botMode,
      practiceMode
    )
    Session.instance.initializeScores()
    if (botMode) {
      Session.instance.opponentName = "ClawBreak"
      Session.instance.setOpponentClientId("bot")
    }
  }

  initializeScores(): void {
    this.scoreByClientId = {
      [this.clientId]: 0,
    }
    if (this.opponentClientId) {
      this.scoreByClientId[this.opponentClientId] = 0
    }
  }

  private opponentKey(): string {
    return this.opponentClientId ?? Session.fallbackOpponentClientId
  }

  setOpponentClientId(clientId: string): void {
    const previousOpponentKey = this.opponentKey()
    const previousScore = this.getScoreByClientId(previousOpponentKey)
    this.opponentClientId = clientId
    if (!(clientId in this.scoreByClientId)) {
      this.scoreByClientId[clientId] = previousScore
    }
    if (
      previousOpponentKey !== clientId &&
      previousOpponentKey in this.scoreByClientId
    ) {
      delete this.scoreByClientId[previousOpponentKey]
    }
  }

  myScore(): number {
    return this.getScoreByClientId(this.clientId)
  }

  opponentScore(): number {
    return this.getScoreByClientId(this.opponentKey())
  }

  setMyScore(score: number): void {
    this.setScoreByClientId(this.clientId, score)
  }

  setOpponentScore(score: number): void {
    this.setScoreByClientId(this.opponentKey(), score)
  }

  addMyScore(delta: number): void {
    this.setMyScore(this.myScore() + delta)
  }

  addOpponentScore(delta: number): void {
    this.setOpponentScore(this.opponentScore() + delta)
  }

  getScoreByClientId(clientId: string): number {
    return this.scoreByClientId[clientId] ?? 0
  }

  setScoreByClientId(clientId: string, score: number): void {
    this.scoreByClientId[clientId] = score
  }

  orderedScoresForHud(): { p1: number; p2: number } {
    if (this.playerIndex === 0) {
      return { p1: this.myScore(), p2: this.opponentScore() }
    }
    return { p1: this.opponentScore(), p2: this.myScore() }
  }

  orderedNamesForHud(): { p1Name?: string; p2Name?: string } {
    if (this.spectator) {
      console.log(
        `[Session] orderedNamesForHud spectator mode: spectatedP1Name=${this.spectatedP1Name}, spectatedP2Name=${this.spectatedP2Name}`
      )
      const names: { p1Name?: string; p2Name?: string } = {}
      if (this.spectatedP1Name) {
        names.p1Name = this.spectatedP1Name
      }
      if (this.spectatedP2Name) {
        names.p2Name = this.spectatedP2Name
      }
      return names
    }

    const myName = this.playername || undefined
    const theirName = this.opponentName || undefined
    if (this.playerIndex === 0) {
      const names: { p1Name?: string; p2Name?: string } = {}
      if (myName) {
        names.p1Name = myName
      }
      if (theirName) {
        names.p2Name = theirName
      }
      return names
    }
    const names: { p1Name?: string; p2Name?: string } = {}
    if (theirName) {
      names.p1Name = theirName
    }
    if (myName) {
      names.p2Name = myName
    }
    return names
  }

  updateScoresFromNetwork(p1: number, p2: number, breakScore: number): void {
    if (this.playerIndex === 1) {
      this.setMyScore(p2)
      this.setOpponentScore(p1)
    } else {
      this.setMyScore(p1)
      this.setOpponentScore(p2)
    }
    this.currentBreak = breakScore
  }
}
