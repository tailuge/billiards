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

      const allowedTags = ["a", "br"]

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
      this.openLinksInNewTab(content)
      this.chatoutput.appendChild(content)
    } else {
      if (msg.length > 2) {
        this.chatoutput.appendChild(document.createElement("br"))
      }
      this.chatoutput.appendChild(document.createTextNode(msg))
    }
    this.updateScroll()
  }

  /** Chat lives inside #viewP1, which Keyboard makes contenteditable so it can
   * hold focus for the game keys. Inside an editing host the browser treats a
   * plain click as caret placement and never runs the anchor's default
   * navigation, so open the link ourselves. The href is left in place for the
   * status bar, context menu and any alt-click path that still works. */
  private openLinksInNewTab(content: DocumentFragment) {
    content.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        event.preventDefault()
        globalThis.open(anchor.href, "_blank", "noopener")
      })
    })
  }

  updateScroll() {
    this.chatoutput &&
      (this.chatoutput.scrollTop = this.chatoutput.scrollHeight)
  }
}
