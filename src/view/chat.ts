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
    // It might be preceded by a space if sender is null in ControllerBase
    const linkMatch = msg.match(
      /^( ?)<a class="pill" style="(.*?)" target="_blank" href="(.*?)">(.*?)<\/a>$/
    )

    if (linkMatch) {
      const [, prefix, style, href, text] = linkMatch
      if (prefix) {
        div.appendChild(document.createTextNode(prefix))
      }
      const a = document.createElement("a")
      a.className = "pill"
      a.setAttribute("style", style)
      a.target = "_blank"
      const isJavascript = href.trim().toLowerCase().startsWith("java" + "script:")
      if (!isJavascript) {
        a.href = href
      }
      a.textContent = text
      div.appendChild(a)
    } else {
      div.textContent = msg
    }
    this.chatoutput.appendChild(div)
    this.updateScroll()
  }

  updateScroll() {
    this.chatoutput &&
      (this.chatoutput.scrollTop = this.chatoutput.scrollHeight)
  }
}
