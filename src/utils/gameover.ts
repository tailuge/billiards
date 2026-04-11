export const LOBBY_URL = "https://scoreboard-tailuge.vercel.app/game"

export const gameOverButtons = {
  lobby: `<button type="button" class="notification-btn" data-notification-action="lobby">Back to Lobby</button>`,
  newGame: `<button type="button" class="notification-btn" data-notification-action="reload">New Game</button>`,
  replay: `<button type="button" class="notification-btn" data-notification-action="replay">Replay</button>`,
  rematch: `<button type="button" class="notification-btn" data-notification-action="rematch">Rematch</button>`,

  forMode(isSinglePlayer: boolean, _hasRematch: boolean = false): string {
    if (isSinglePlayer) {
      return this.newGame + " " + this.lobby
    }
    return this.rematch + " " + this.lobby
  },
}
