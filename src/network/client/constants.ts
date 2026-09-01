const isLocalhost =
  typeof globalThis !== "undefined" &&
  globalThis.location &&
  (globalThis.location.hostname === "localhost" ||
    globalThis.location.hostname === "127.0.0.1")

const LOBBY_BASE_URL = isLocalhost
  ? "http://localhost"
  : "https://billiards.tailuge.workers.dev"

export const LOBBY_URL = `${LOBBY_BASE_URL}/lobby.html`

export function getLobbyUrl(tournamentId?: string): string {
  if (!tournamentId) return LOBBY_URL

  const url = new URL(`${LOBBY_BASE_URL}/arena.html`)
  url.searchParams.set("tournamentId", tournamentId)
  return url.toString()
}

export const LOBBY_NCHAN_URL = "wss://billiards-network.onrender.com"
export const ARENA_BASE_URL = isLocalhost
  ? "http://localhost"
  : "https://billiards-network.onrender.com"
