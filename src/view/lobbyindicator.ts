import { MessageRelay } from "../network/client/messagerelay"
import { MessagingClient, Lobby } from "@tailuge/messaging"
import { Session } from "../network/client/session"
import { Rules } from "../controller/rules/rules"
import { id } from "../utils/dom"

export class LobbyIndicator {
  private readonly element: HTMLElement | null
  private messagingClient: MessagingClient | null = null
  private lobby: Lobby | null = null
  private hasLiveCount = false
  private count = 0
  private challenger: { userId: string; userName: string } | null = null
  private readonly rules: Rules
  private static readonly LOBBY_URL =
    "https://scoreboard-tailuge.vercel.app/game"
  private static readonly NCHAN_URL = "https://billiards-network.onrender.com"
  private currentTableId: string | null = null

  constructor(
    private readonly relay: MessageRelay | null,
    rules: Rules
  ) {
    this.rules = rules
    this.element = id("lobby")
    this.setupElement()
  }

  private setupElement(): void {
    if (!this.element) return

    if (this.element instanceof HTMLAnchorElement) {
      this.element.setAttribute("target", "_blank")
      this.element.setAttribute("rel", "noopener noreferrer")
    } else {
      this.element.addEventListener("click", () => {
        if (typeof globalThis.open === "function") {
          globalThis.open(this.getLobbyUrl(), "_blank", "noopener,noreferrer")
        }
      })
      this.element.style.cursor = "pointer"
    }
  }

  async init(): Promise<void> {
    if (!this.element) return

    const session = Session.hasInstance() ? Session.getInstance() : undefined
    const userId = session?.clientId ?? "default"
    const userName = session?.playername ?? "Anon"

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
      ruleType: this.rules.rulename,
    }
    if (this.currentTableId) {
      presence.tableId = this.currentTableId
    }

    this.lobby = await this.messagingClient.joinLobby(presence)

    this.lobby.onUsersChange((users) => {
      this.hasLiveCount = true
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

    try {
      const count = await this.relay?.getOnlineCount()
      if (!this.hasLiveCount && count !== null && count !== undefined) {
        this.count = count
        this.updateDisplay()
      }
    } catch {
      // Ignore fallback fetch failures.
    }
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
    if (!this.challenger) {
      return LobbyIndicator.LOBBY_URL
    }

    const url = new URL(LobbyIndicator.LOBBY_URL)
    url.searchParams.set("action", "join")
    url.searchParams.set("ruletype", this.rules.rulename)
    url.searchParams.set("opponentId", this.challenger.userId)
    url.searchParams.set("opponentName", this.challenger.userName)

    const session = Session.hasInstance() ? Session.getInstance() : undefined
    if (session) {
      url.searchParams.set("userName", session.playername)
      url.searchParams.set("userId", session.clientId)
    }

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
