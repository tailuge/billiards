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

  showMessage(msg: string, isTrustedHtml: boolean = false) {
    if (!this.chatoutput || !msg) return

    if (isTrustedHtml) {
      // System links from link-formatter.ts or browsercontainer.ts
      // Trusted HTML strings are parsed into a template to avoid direct innerHTML assignment to the live DOM
      const template = document.createElement("template")
      // Explicitly using a template to parse trusted system HTML
      // This is safer than direct innerHTML assignment on the live output element
      template.innerHTML = msg.trim()
      this.chatoutput.appendChild(document.importNode(template.content, true))
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
