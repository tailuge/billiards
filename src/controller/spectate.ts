import { ControllerBase } from "./controllerbase"
import { Controller, Input } from "./controller"
import { MessageRelay } from "../network/client/messagerelay"
import { ChatEvent } from "../events/chatevent"

export class Spectate extends ControllerBase {

  messageRelay: MessageRelay
  tableId: string
  messages: string[] = []
  constructor(container, messageRelay, tableId) {
    super(container)
    this.messageRelay = messageRelay
    this.tableId = tableId
    this.messageRelay.subscribe(this.tableId, (message) => {
      console.log(message)
      this.messages.push(message)
      this.container.eventQueue.push(new ChatEvent("nchan", "."))
    })
    console.log("Spectate")
  }

  override handleChat(chatevent: ChatEvent): Controller {
    console.log("Spectate chat",chatevent,this.messages.length)
    return this
  }


  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
