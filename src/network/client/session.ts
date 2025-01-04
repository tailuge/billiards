export class Session {
  constructor(
    readonly clientId: string,
    readonly username: string,
    readonly tableId: string,
    readonly spectator: boolean
  ) {}

  private static instance: Session | undefined

  static getInstance(): Session {
    if (!Session.instance) {
      throw new Error("Session not initialized")
    }
    return Session.instance
  }

  static isSpectator(): boolean {
    return Session.instance !== undefined && Session.getInstance().spectator
  }

  static reset() {
    Session.instance = undefined
  }

  static init(
    clientId: string,
    username: string,
    tableId: string,
    spectator: boolean
  ) {
    Session.instance = new Session(clientId, username, tableId, spectator)
  }
}
