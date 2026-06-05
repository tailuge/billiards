import { LOBBY_URL } from "../network/client/constants"

export const gameOverButtons = {
  lobby: `<button type="button" class="notification-btn" data-notification-action="lobby">Back to Lobby</button>`,
  newGame: `<button type="button" class="notification-btn" data-notification-action="reload">New Game</button>`,
  replay: `<button type="button" class="notification-btn" data-notification-action="replay">Replay</button>`,

  rematch(
    opponentId: string | undefined,
    opponentName: string | undefined,
    ruletype: string,
    nextTurnId: string | undefined
  ): string {
    if (!opponentId || !nextTurnId) return ""

    const url = new URL(LOBBY_URL)
    url.searchParams.set("opponentId", opponentId)
    if (opponentName) {
      url.searchParams.set("opponentName", opponentName)
    }
    url.searchParams.set("ruletype", ruletype)
    url.searchParams.set("nextTurnId", nextTurnId)

    return `<button type="button" class="notification-btn" data-notification-action="rematch" data-notification-url="${url.toString()}">Rematch</button>`
  },

  forMode(
    isSinglePlayer: boolean,
    opponentId?: string,
    opponentName?: string,
    ruletype?: string,
    nextTurnId?: string
  ): string {
    if (isSinglePlayer) {
      return this.newGame + " " + this.lobby
    }
    if (!ruletype) return this.lobby
    const rematch = this.rematch(opponentId, opponentName, ruletype, nextTurnId)
    return rematch ? rematch + " " + this.lobby : this.lobby
  },
}
