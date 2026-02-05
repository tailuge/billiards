export class Chat {
  chatoutput: HTMLElement | null
  chatInput: HTMLElement | null
  chatSend: HTMLElement | null
  chatInputText: HTMLInputElement | null
  send
  constructor(send) {
    this.chatoutput = document.getElementById("chatoutput")
    this.chatInputText = document.getElementById(
      "chatinputtext"
    ) as HTMLInputElement
    this.chatSend = document.getElementById("chatsend")
    this.chatSend?.addEventListener("click", this.sendClicked)
    this.send = send
  }

  sendClicked = (_) => {
    this.send(this.chatInputText?.value)
    this.showMessage(this.chatInputText?.value)
  }

  showMessage(msg) {
    if (!this.chatoutput) return
    const span = document.createElement("span")
    span.textContent = msg
    this.chatoutput.appendChild(span)
    this.updateScroll()
  }

  showHTML(html) {
    if (this.chatoutput) {
      this.chatoutput.insertAdjacentHTML("beforeend", html)
    }
    this.updateScroll()
  }

  updateScroll() {
    this.chatoutput &&
      (this.chatoutput.scrollTop = this.chatoutput.scrollHeight)
  }
}
