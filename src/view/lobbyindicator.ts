import { MessageRelay } from "../network/client/messagerelay"
import { PresenceClient } from "../network/client/presenceclient"
import { Session } from "../network/client/session"
import { Rules } from "../controller/rules/rules"
import { id } from "../utils/dom"

export class LobbyIndicator {
  private readonly element: HTMLElement | null
  private readonly presenceClient: PresenceClient
  private hasLiveCount = false

  constructor(
    private readonly relay: MessageRelay | null,
    rules: Rules
  ) {
    this.element = id("lobby")
    const session = Session.hasInstance() ? Session.getInstance() : undefined
    const locale = globalThis.navigator?.language
    const originUrl = globalThis.location?.host
    this.presenceClient = new PresenceClient(
      session?.clientId ?? "default",
      session?.playername ?? "Anon",
      locale,
      originUrl,
      rules.rulename,
      session?.botMode
    )
  }

  async init(): Promise<void> {
    this.presenceClient.onCountChange((count) => {
      this.hasLiveCount = true
      this.setCount(count)
    })
    this.presenceClient.start()
    if (!this.element) return

    try {
      const count = await this.relay?.getOnlineCount()
      if (!this.hasLiveCount && count !== null && count !== undefined) {
        this.setCount(count)
      }
    } catch {
      // Ignore fallback fetch failures.
    }
  }

  private setCount(count: number): void {
    if (!this.element) return
    this.element.textContent = ` ${count} 👥`
  }

  stop(): void {
    try {
      this.presenceClient.stop()
    } catch {
      // Ignore presence shutdown failures.
    }
  }
}
