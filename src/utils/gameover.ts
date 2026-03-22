export const LOBBY_URL = "https://scoreboard-tailuge.vercel.app/"

export const gameOverButtons = {
  lobby: `<button data-notification-action="lobby">Lobby</button>`,
  newGame: `<button data-notification-action="reload">New Game</button>`,
  replay: `<button data-notification-action="replay">Replay</button>`,
  rematch: `<button data-notification-action="rematch">Rematch</button>`,

  forMode(isSinglePlayer: boolean, _hasRematch: boolean = false): string {
    if (isSinglePlayer) {
      return this.newGame + this.lobby
    }
    return this.rematch + this.lobby
  },
}
