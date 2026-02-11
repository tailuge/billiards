const LOBBY_URL = "https://scoreboard-tailuge.vercel.app/"

export interface ButtonConfig {
  text: string
  action: "reload" | "href"
  url?: string
}

export const gameOverButtons = {
  lobby: { text: "Lobby", action: "href", url: LOBBY_URL } as ButtonConfig,
  newGame: { text: "New Game", action: "reload" } as ButtonConfig,
  replay: { text: "Replay", action: "reload" } as ButtonConfig,

  forMode(isSinglePlayer: boolean): ButtonConfig[] {
    return isSinglePlayer ? [this.newGame, this.lobby] : [this.lobby]
  },
}
