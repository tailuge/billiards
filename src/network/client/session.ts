export class Session {
  constructor(
    readonly clientId: string,
    readonly username: string,
    readonly tableId: string
  ) {}

  private static instance: Session

  static getInstance(): Session {
    if (!Session.instance) {
      throw new Error("Session not initialized")
    }
    return Session.instance
  }

  static init(clientId: string, username: string, tableId: string) {
    Session.instance = new Session(clientId, username, tableId)
  }
}
