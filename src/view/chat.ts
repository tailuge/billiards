import { id, getInput } from "../utils/dom"

export class Chat {
  chatoutput: HTMLElement | null
  chatInput: HTMLElement | null
  chatSend: HTMLElement | null
  chatInputText: HTMLInputElement | null
  send
  constructor(send) {
    this.chatoutput = id("chatoutput")
    this.chatInputText = getInput("chatinputtext")
    this.chatSend = id("chatsend")
    this.chatSend?.addEventListener("click", this.sendClicked)
    this.send = send
  }

  sendClicked = (_) => {
    this.send(this.chatInputText?.value)
    this.showMessage(this.chatInputText?.value)
  }

  showMessage(msg) {
    if (!this.chatoutput || msg === undefined || msg === null) {
      this.updateScroll()
      return
    }

    if (msg.includes("<")) {
      const template = document.createElement("template")
      template.innerHTML = msg
      this.chatoutput.appendChild(template.content)
    } else {
      this.chatoutput.appendChild(document.createTextNode(msg))
    }
    this.updateScroll()
  }

  updateScroll() {
    this.chatoutput &&
      (this.chatoutput.scrollTop = this.chatoutput.scrollHeight)
  }
}
