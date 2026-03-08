export const LOBBY_URL = "https://scoreboard-tailuge.vercel.app/"

export const gameOverButtons = {
  lobby: `<button data-notification-action="lobby">Lobby</button>`,
  newGame: `<button data-notification-action="reload">New Game</button>`,
  replay: `<button data-notification-action="replay">Replay</button>`,

  forMode(isSinglePlayer: boolean): string {
    return isSinglePlayer ? this.newGame + this.lobby : this.lobby
  },
}
