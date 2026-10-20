import { getLobbyUrl } from "../network/client/constants"

/**
 * Builds a notification footer button. The label stays an English source
 * string: the same markup is shown locally and sent to the opponent, so the
 * Notification view translates it for whoever is looking at it, while the
 * action and any extra attributes stay locale-independent.
 */
function button(action: string, label: string, attributes = ""): string {
  return `<button type="button" class="notification-btn" data-notification-action="${action}"${attributes}>${label}</button>`
}

/**
 * Club id forwarded from the map page's play link (`?club=`), or null when the
 * game was not started from a map challenge.
 */
function clubIdFromUrl(): string | null {
  if (typeof globalThis === "undefined" || !globalThis.location) {
    return null
  }
  return new URLSearchParams(globalThis.location.search).get("club")
}

export const gameOverButtons = {
  lobby: button("lobby", "Back to Lobby"),
  newGame: button("reload", "New Game"),
  replay: button("replay", "Replay"),

  rematch(
    opponentId: string | undefined,
    opponentName: string | undefined,
    ruletype: string,
    nextTurnId: string | undefined
  ): string {
    if (!opponentId || !nextTurnId) return ""

    const url = new URL(getLobbyUrl())
    url.searchParams.set("opponent.userId", opponentId)
    if (opponentName) {
      url.searchParams.set("opponent.userName", opponentName)
    }
    url.searchParams.set("ruletype", ruletype)
    url.searchParams.set("nextTurnId", nextTurnId)

    if (typeof globalThis !== "undefined" && globalThis.location) {
      const systemParams = new Set([
        "userId",
        "userName",
        "tableId",
        "websocketserver",
        "first",
        "spectator",
        "lod",
        "opponent.userId",
        "opponent.userName",
        "ruletype",
        "nextTurnId",
        // The locale is the reader's own: forwarding the sender's would make
        // the opponent's rematch page open in the sender's language.
        "locale",
      ])
      const currentParams = new URLSearchParams(globalThis.location.search)
      for (const [key, val] of currentParams.entries()) {
        if (
          !systemParams.has(key) &&
          !key.startsWith("custom.") &&
          !key.startsWith("opponent.custom.")
        ) {
          url.searchParams.set(key, val)
        }
      }
    }

    return button(
      "rematch",
      "Rematch",
      ` data-notification-url="${url.toString()}"`
    )
  },

  forMode(
    isSinglePlayer: boolean,
    opponentId?: string,
    opponentName?: string,
    ruletype?: string,
    nextTurnId?: string,
    tournamentId?: string,
    won?: boolean
  ): string {
    // Single-player map run: hand control straight back to the map page with
    // the club id it sent us, so it can fill that club's progress star.
    const club = clubIdFromUrl()
    if (club) {
      return button(
        "rematch",
        "Update map",
        ` data-notification-url="./map.html?club=${encodeURIComponent(club)}&won=${
          won ? 1 : 0
        }"`
      )
    }
    if (tournamentId) {
      return button("lobby", "Back to Arena", ' id="arenabutton"')
    }
    if (isSinglePlayer) {
      return this.newGame + " " + this.lobby
    }
    if (!ruletype) return this.lobby
    const rematch = this.rematch(opponentId, opponentName, ruletype, nextTurnId)
    return rematch ? rematch + " " + this.lobby : this.lobby
  },
}
