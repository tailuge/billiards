import { ChatEvent } from "../events/chatevent"
import { BeginEvent, Controller } from "./controller"
import { Init } from "./init"

export class End extends Controller {
  override handleChat(chatevent: ChatEvent): Controller {
    const sender = chatevent.sender ? `${chatevent.sender}:` : ""
    const message = `${sender} ${chatevent.message}`
    this.container.chat.showMessage(message)
    return this
  }

  override handleBegin(_: BeginEvent): Controller {
    return new Init(this.container)
  }
}
