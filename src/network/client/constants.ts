const isLocalhost =
  typeof globalThis !== "undefined" &&
  globalThis.location &&
  (globalThis.location.hostname === "localhost" ||
    globalThis.location.hostname === "127.0.0.1")

export const LOBBY_URL = isLocalhost
  ? "http://localhost/lobby.html"
  : "https://billiards.tailuge.workers.dev/lobby.html"
export const LOBBY_NCHAN_URL = "wss://billiards-network.onrender.com"
