import { MessageRelay } from "../network/client/messagerelay"
import { id } from "../utils/dom"

export class LobbyIndicator {
  private readonly element: HTMLElement | null

  constructor(private readonly relay: MessageRelay | null) {
    this.element = id("lobby")
  }

  async init(): Promise<void> {
    if (!this.relay || !this.element) return

    const refresh = async () => {
      const count = await this.relay?.getOnlineCount()
      if (count !== null && this.element) {
        this.element.textContent = ` ${count} 👥`
      }
    }

    await refresh()
    setInterval(refresh, 5 * 60 * 1000)
  }
}
