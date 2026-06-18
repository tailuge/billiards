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
      const content = template.content

      const allowedTags = ["svg", "circle", "a", "br"]

      const sanitize = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement
          const tag = el.tagName.toLowerCase()
          if (!allowedTags.includes(tag)) {
            el.remove()
            return
          }
        }
        Array.from(node.childNodes).forEach(sanitize)
      }

      sanitize(content)
      this.chatoutput.appendChild(content)
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
