export class Session {
  constructor(
    public playername: string,
    readonly clientId: string,
    readonly tableId: string,
    readonly spectator: boolean,
    readonly botMode: boolean = false
  ) {}

  opponentName?: string
  playerIndex: number = 0

  private static instance: Session | undefined

  static getInstance(): Session {
    if (!Session.instance) {
      throw new Error("Session not initialized")
    }
    return Session.instance
  }

  static hasInstance(): boolean {
    return Session.instance !== undefined
  }

  static playerIndex(): number {
    return Session.instance ? Session.instance.playerIndex : 0
  }

  static isSpectator(): boolean {
    return Session.instance !== undefined && Session.getInstance().spectator
  }

  static isBotMode(): boolean {
    return Session.instance !== undefined && Session.getInstance().botMode
  }

  static reset() {
    Session.instance = undefined
  }

  static init(
    clientId: string,
    playername: string,
    tableId: string,
    spectator: boolean,
    botMode: boolean = false
  ) {
    Session.instance = new Session(
      playername,
      clientId,
      tableId,
      spectator,
      botMode
    )
  }
}
