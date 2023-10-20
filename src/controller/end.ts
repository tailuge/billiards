import { ChatEvent } from "../events/chatevent"
import { Controller } from "./controller"

export class End extends Controller {
  override handleChat(chatevent: ChatEvent): Controller {
    const sender = chatevent.sender ? `${chatevent.sender}:` : ""
    const message = `${sender} ${chatevent.message}`
    this.container.chat.showMessage(message)
    return this
  }
}
