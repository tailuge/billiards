import { id, getInput } from "../utils/dom"
import { isSafeUrl } from "../utils/security"

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

  sendClicked = (_: Event) => {
    const msg = this.chatInputText?.value
    if (msg) {
      this.send(msg)
      this.showMessage(msg)
    }
  }

  showMessage(msg: string | undefined) {
    if (!msg || !this.chatoutput) {
      return
    }
    const div = document.createElement("div")

    // Match the specific pattern used by LinkFormatter for system links
    // Format: <a class="pill" style="color: ..." target="_blank" href="...">...</a>
    // Or without style: <a class="pill" target="_blank" href="...">...</a>
    // It might be preceded by a space if sender is null in ControllerBase
    const linkMatch = msg.match(
      /^( ?)<a class="pill"(?: style="color: ([^"]*?)")? target="_blank" href="([^"]*?)">([^<]*?)<\/a>$/
    )

    if (linkMatch) {
      this.renderSystemLink(div, linkMatch)
    } else {
      div.appendChild(document.createTextNode(msg))
    }
    this.chatoutput.appendChild(div)
    this.updateScroll()
  }

  private renderSystemLink(div: HTMLElement, match: RegExpMatchArray) {
    const [, prefix, color, href, text] = match
    if (prefix) {
      div.appendChild(document.createTextNode(prefix))
    }
    const a = document.createElement("a")
    a.className = "pill"

    if (color) {
      // Validate color to prevent CSS injection
      if (
        /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color) ||
        /^[a-z]+$/.test(color)
      ) {
        a.style.color = color
      }
    }

    a.target = "_blank"
    if (isSafeUrl(href)) {
      a.href = href
    }

    a.appendChild(document.createTextNode(text))
    div.appendChild(a)
  }

  updateScroll() {
    this.chatoutput &&
      (this.chatoutput.scrollTop = this.chatoutput.scrollHeight)
  }
}
