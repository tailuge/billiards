import { MessageRelay } from "../network/client/messagerelay"
import { PresenceClient } from "../network/client/presenceclient"
import { Session } from "../network/client/session"
import { Rules } from "../controller/rules/rules"
import { id } from "../utils/dom"

export class LobbyIndicator {
  private readonly element: HTMLElement | null
  private readonly presenceClient: PresenceClient
  private hasLiveCount = false
  private count = 0
  private challenged = false
  private static readonly GAME_URL =
    "https://scoreboard-tailuge.vercel.app/game"

  constructor(
    private readonly relay: MessageRelay | null,
    rules: Rules
  ) {
    this.element = id("lobby")
    if (this.element) {
      if (this.element instanceof HTMLAnchorElement) {
        this.element.setAttribute("href", LobbyIndicator.GAME_URL)
        this.element.setAttribute("target", "_blank")
        this.element.setAttribute("rel", "noopener noreferrer")
      } else {
        this.element.addEventListener("click", () => {
          globalThis.open(
            LobbyIndicator.GAME_URL,
            "_blank",
            "noopener,noreferrer"
          )
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
    this.presenceClient.onChallengeChange((challenged) => {
      this.challenged = challenged
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
    const challengeIcon = this.challenged ? " ⚔️" : ""
    this.element.textContent = ` ${this.count} 👥${challengeIcon}`
    if (this.challenged) {
      this.element.setAttribute(
        "aria-label",
        `Multiplayer Lobby - ${this.count} online - YOU ARE CHALLENGED!`
      )
    } else {
      this.element.setAttribute(
        "aria-label",
        `Multiplayer Lobby - ${this.count} online`
      )
    }
  }

  stop(): void {
    try {
      this.presenceClient.stop()
    } catch {
      // Ignore presence shutdown failures.
    }
  }
}
