import { MessageRelay } from "../network/client/messagerelay"
import { id } from "../utils/dom"

export class LobbyIndicator {
  private readonly element: HTMLElement | null

  constructor(private readonly relay: MessageRelay | null) {
    this.element = id("lobby")
    if (this.relay && this.element) {
      this.init()
    }
  }

  private async init(): Promise<void> {
    if (!this.relay || !this.element) return

    const refresh = async () => {
      const count = await this.relay?.getOnlineCount()
      if (count !== null && this.element) {
        this.element.textContent = ` ${count} 👥`
      }
    }

    // Initial update
    await refresh()

    // Subscribe to lobby for updates
    this.relay.subscribe(
      "lobby",
      (message) => {
        try {
          const data = JSON.parse(message)
          if (data.action === "connected") {
            refresh()
          }
        } catch {
          // Ignore non-JSON messages
        }
      },
      "lobby"
    )
  }
}
