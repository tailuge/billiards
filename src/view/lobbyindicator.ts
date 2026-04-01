import { MessagingClient, Lobby } from "@tailuge/messaging"
import { Session } from "../network/client/session"
import { Rules } from "../controller/rules/rules"
import { id } from "../utils/dom"
import { LOBBY_URL } from "../utils/gameover"

export class LobbyIndicator {
  private readonly element: HTMLElement | null
  private messagingClient: MessagingClient | null = null
  private lobby: Lobby | null = null
  private count = 0
  private challenger: { userId: string; userName: string } | null = null
  private readonly rules: Rules
  private readonly ruleType: string
  private static readonly NCHAN_URL = "https://billiards-network.onrender.com"
  private currentTableId: string | null = null

  constructor(botMode: boolean, replayMode: boolean, rules: Rules) {
    this.rules = rules
    if (botMode) {
      this.ruleType = "bot"
    } else if (replayMode) {
      this.ruleType = "replay"
    } else if (Session.isSpectator()) {
      this.ruleType = "spectator"
    } else {
      this.ruleType = this.rules.rulename
    }
    this.element = id("lobbyOverlay")
    this.setupElement()
  }

  private setupElement(): void {
    if (!this.element) return

    if (this.element instanceof HTMLAnchorElement) {
      this.element.setAttribute("target", "_self")
      this.element.setAttribute("rel", "noopener")
    } else {
      this.element.addEventListener("click", () => {
        if (typeof globalThis.open === "function") {
          globalThis.open(this.getLobbyUrl(), "_self")
        }
      })
      this.element.style.cursor = "pointer"
    }
  }

  async init(): Promise<void> {
    if (!this.element) return

    const userId = Session.getInstance().clientId
    const userName = Session.getInstance().playername

    this.messagingClient = new MessagingClient({
      baseUrl: LobbyIndicator.NCHAN_URL,
    })
    this.messagingClient.start()

    const params = new URLSearchParams(globalThis.location?.search ?? "")
    this.currentTableId = params.get("tableId")

    const presence: {
      messageType: "presence"
      type: "join"
      userId: string
      userName: string
      ruleType: string
      tableId?: string
    } = {
      messageType: "presence",
      type: "join",
      userId,
      userName,
      ruleType: this.ruleType,
    }
    if (this.currentTableId) {
      presence.tableId = this.currentTableId
    }

    this.lobby = await this.messagingClient.joinLobby(presence)

    this.lobby.onUsersChange((users) => {
      this.count = users.length
      this.updateDisplay()
    })

    this.lobby.onChallenge((challenge) => {
      if (challenge.type === "offer") {
        this.challenger = {
          userId: challenge.challengerId,
          userName: challenge.challengerName,
        }
      } else if (challenge.type === "decline" || challenge.type === "cancel") {
        this.challenger = null
      }
      this.updateDisplay()
    })

    this.updateDisplay()
  }

  setTableId(tableId: string | null): void {
    this.currentTableId = tableId
    if (this.lobby) {
      if (tableId) {
        this.lobby.updatePresence({ tableId })
      } else {
        this.lobby.updatePresence({})
      }
    }
  }

  private updateDisplay(): void {
    if (!this.element) return
    const challenged = this.challenger !== null
    this.element.textContent = ` ${this.count} 👥`
    if (challenged) {
      const challengeSpan = document.createElement("span")
      challengeSpan.className = "challenge-icon"
      challengeSpan.textContent = " ⚔️"
      this.element.appendChild(challengeSpan)

      const challengePill = document.createElement("span")
      challengePill.className = "challenge-pill"
      challengePill.textContent = `Challenge from ${this.challenger!.userName}`
      this.element.appendChild(challengePill)

      this.element.setAttribute(
        "aria-label",
        `Multiplayer Lobby - ${this.count} online - CHALLENGE FROM ${this.challenger!.userName}!`
      )
    } else {
      this.element.setAttribute(
        "aria-label",
        `Multiplayer Lobby - ${this.count} online`
      )
    }
    if (this.element instanceof HTMLAnchorElement) {
      this.element.setAttribute("href", this.getLobbyUrl())
    }
  }

  private getLobbyUrl(): string {
    const url = new URL(LOBBY_URL)
    const session = Session.getInstance()
    url.searchParams.set("userName", session.playername)
    url.searchParams.set("userId", session.clientId)

    if (!this.challenger) {
      return url.toString()
    }

    url.searchParams.set("action", "join")
    url.searchParams.set("ruletype", this.ruleType)
    url.searchParams.set("opponentId", this.challenger.userId)
    url.searchParams.set("opponentName", this.challenger.userName)

    return url.toString()
  }

  async stop(): Promise<void> {
    try {
      if (this.lobby) {
        await this.lobby.leave()
      }
      if (this.messagingClient) {
        await this.messagingClient.stop()
      }
    } catch {
      // Ignore shutdown failures.
    }
  }
}
