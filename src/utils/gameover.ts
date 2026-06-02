export const LOBBY_URL = "https://billiards.tailuge.workers.dev/lobby.html"

export const gameOverButtons = {
  lobby: `<button type="button" class="notification-btn" data-notification-action="lobby">Back to Lobby</button>`,
  newGame: `<button type="button" class="notification-btn" data-notification-action="reload">New Game</button>`,
  replay: `<button type="button" class="notification-btn" data-notification-action="replay">Replay</button>`,

  forMode(isSinglePlayer: boolean): string {
    if (isSinglePlayer) {
      return this.newGame + " " + this.lobby
    }
    return this.lobby
  },
}
