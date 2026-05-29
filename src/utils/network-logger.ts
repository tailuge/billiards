export interface NetworkEvent {
  ts: number;
  label: string;
}

export class NetworkLogger {
  private static gameLogs: NetworkEvent[] = [];
  private static lobbyLogs: NetworkEvent[] = [];
  private static readonly MAX_LOGS = 50;

  static logGame(label: string) {
    this.gameLogs.push({ ts: Date.now(), label });
    if (this.gameLogs.length > this.MAX_LOGS) this.gameLogs.shift();
  }

  static logLobby(label: string) {
    this.lobbyLogs.push({ ts: Date.now(), label });
    if (this.lobbyLogs.length > this.MAX_LOGS) this.lobbyLogs.shift();
  }

  static getGameLogs(): NetworkEvent[] {
    return [...this.gameLogs];
  }

  static getLobbyLogs(): NetworkEvent[] {
    return [...this.lobbyLogs];
  }
}
