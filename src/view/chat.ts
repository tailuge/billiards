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

  showMessage(msg: string) {
    if (!this.chatoutput || !msg) return

    if (msg.includes("<a ") || msg.includes("<span ")) {
      // System links from link-formatter.ts or browsercontainer.ts
      // We parse these safely to avoid innerHTML
      const template = document.createElement("template")
      template.innerHTML = msg.trim()
      const content = template.content
      this.chatoutput.appendChild(content)
    } else {
      // Pure text (user or system info)
      const div = document.createElement("div")
      div.textContent = msg
      this.chatoutput.appendChild(div)
    }
    this.updateScroll()
  }

  updateScroll() {
    this.chatoutput &&
      (this.chatoutput.scrollTop = this.chatoutput.scrollHeight)
  }
}
