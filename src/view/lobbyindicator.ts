import { MessageRelay } from "../network/client/messagerelay"
import {
  ChallengerInfo,
  PresenceClient,
} from "../network/client/presenceclient"
import { Session } from "../network/client/session"
import { Rules } from "../controller/rules/rules"
import { id } from "../utils/dom"

export class LobbyIndicator {
  private readonly element: HTMLElement | null
  private readonly presenceClient: PresenceClient
  private hasLiveCount = false
  private count = 0
  private challenger: ChallengerInfo | null = null
  private readonly rules: Rules
  private static readonly LOBBY_URL =
    "https://scoreboard-tailuge.vercel.app/lobby"

  constructor(
    private readonly relay: MessageRelay | null,
    rules: Rules
  ) {
    this.rules = rules
    this.element = id("lobby")
    if (this.element) {
      if (this.element instanceof HTMLAnchorElement) {
        this.element.setAttribute("href", this.getLobbyUrl())
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
    const session = Session.hasInstance() ? Session.getInstance() : undefined
    const locale = globalThis.navigator?.language ?? undefined
    const originUrl = globalThis.location?.host ?? undefined
    const ua = globalThis.navigator?.userAgent ?? undefined
    this.presenceClient = new PresenceClient(
      session?.clientId ?? "default",
      session?.playername ?? "Anon",
      locale,
      originUrl,
      rules.rulename,
      session?.botMode ?? undefined,
      ua
    )
  }

  async init(): Promise<void> {
    this.presenceClient.onCountChange((count) => {
      this.hasLiveCount = true
      this.count = count
      this.updateDisplay()
    })
    this.presenceClient.onChallengeChange((challenger) => {
      this.challenger = challenger
      this.updateDisplay()
    })
    this.presenceClient.start()
    if (!this.element) return

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
      url.searchParams.set("username", session.playername)
      url.searchParams.set("userId", session.clientId)
    }

    return url.toString()
  }

  stop(): void {
    try {
      this.presenceClient.stop()
    } catch {
      // Ignore presence shutdown failures.
    }
  }
}
