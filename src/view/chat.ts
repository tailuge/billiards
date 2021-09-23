export class Chat {
  chat: HTMLElement | null
  chatInput: HTMLElement | null
  chatSend: HTMLElement | null
  chatInputText: HTMLInputElement | null
  send
  constructor(send) {
    this.chat = document.getElementById("chat")
    this.chatInputText = document.getElementById(
      "chatinputtext"
    ) as HTMLInputElement
    this.chatSend = document.getElementById("chatsend")
    this.chatSend && this.chatSend.addEventListener("click", this.sendClicked)
    this.send = send
  }

  sendClicked = (_) => {
    this.send(this.chatInputText?.value)
  }

  showMessage(msg) {
    this.chat && (this.chat.innerHTML += msg + "<br>")
  }
}
