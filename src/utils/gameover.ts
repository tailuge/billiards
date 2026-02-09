const LOBBY_URL = "https://scoreboard-tailuge.vercel.app/"

export const gameOverButtons = {
  lobby: `<button onclick="location.href='${LOBBY_URL}'">Lobby</button>`,
  newGame: `<button onclick="location.reload()">New Game</button>`,
  replay: `<button onclick="location.reload()">Replay</button>`,

  forMode(isSinglePlayer: boolean): string {
    return isSinglePlayer ? this.newGame + this.lobby : this.lobby
  },
}
