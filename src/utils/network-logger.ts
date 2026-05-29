export interface NetworkEvent {
  ts: number
  label: string
}

export class NetworkLogger {
  private static gameLogs: NetworkEvent[] = []
  private static lobbyLogs: NetworkEvent[] = []
  private static readonly MAX_LOGS = 50
  private static initialized = false

  static init() {
    if (this.initialized || typeof window === "undefined") return
    this.initialized = true

    // 1. Visibility
    document.addEventListener("visibilitychange", () => {
      this.logGame(`visibility: ${document.visibilityState}`)
    })

    // 2. Focus/Blur
    window.addEventListener("focus", () => this.logGame("window: focused"))
    window.addEventListener("blur", () => this.logGame("window: blurred"))

    // 3. Page Lifecycle
    window.addEventListener("pagehide", () => this.logGame("page: hide"))
    window.addEventListener("pageshow", () => this.logGame("page: show"))

    // 4. Connectivity
    window.addEventListener("online", () => this.logGame("network: online"))
    window.addEventListener("offline", () => this.logGame("network: offline"))
  }

  static logGame(label: string) {
    this.gameLogs.push({ ts: Date.now(), label })
    if (this.gameLogs.length > this.MAX_LOGS) this.gameLogs.shift()
  }

  static logLobby(label: string) {
    this.lobbyLogs.push({ ts: Date.now(), label })
    if (this.lobbyLogs.length > this.MAX_LOGS) this.lobbyLogs.shift()
  }

  static getGameLogs(): NetworkEvent[] {
    return [...this.gameLogs]
  }

  static getLobbyLogs(): NetworkEvent[] {
    return [...this.lobbyLogs]
  }
}
