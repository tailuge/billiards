import { Container } from "../container/container"
import { getButton } from "../utils/dom"

export class Comment {
  container: Container
  button: HTMLButtonElement | null
  menu: HTMLDivElement | null

  constructor(container: Container) {
    this.container = container

    this.button = getButton("comment")
    this.menu = document.getElementById("commentMenu") as HTMLDivElement

    if (!this.button || !this.menu) {
      return
    }

    this.button.onclick = (_) => {
      this.toggleMenu()
    }

    const inputTextDiv = document.getElementById("inputTextDiv") as HTMLElement
    const inputText = document.getElementById("inputText") as HTMLInputElement

    const sendText = () => {
      const text = inputText.value.trim()
      inputTextDiv.hidden = true
      if (text) {
        this.container.chat.showMessage("<br>" + text)
        this.container.sendChat(text)
      }
    }

    const emojiButtons = this.menu.querySelectorAll(".comment-emoji")
    emojiButtons.forEach((btn) => {
      if (btn.id === "voice") return
      btn.addEventListener("click", (_) => {
        if (btn.id === "openTextInput") {
          this.hideMenu()
          inputTextDiv.hidden = false
          inputText.value = ""
          inputText.focus()
          return
        }
        const text = btn.textContent ?? ""
        this.container.chat.showMessage(text)
        this.container.sendChat(text)
        this.hideMenu()
      })
    })

    inputText.addEventListener("keydown", (e) => {
      e.stopImmediatePropagation()
      if (e.key === "Enter") sendText()
    })

    document.getElementById("inputSend")?.addEventListener("click", sendText)
    document.getElementById("inputClose")?.addEventListener("click", () => {
      inputTextDiv.hidden = true
    })
  }

  setVisible(visible: boolean) {
    if (this.button) {
      this.button.hidden = !visible
      this.button.disabled = !visible
    }
  }

  toggleMenu() {
    if (!this.menu) return
    if (this.menu.style.display === "none") {
      this.showMenu()
    } else {
      this.hideMenu()
    }
  }

  showMenu() {
    if (!this.menu) return
    this.menu.style.display = "grid"
  }

  hideMenu() {
    if (this.menu) {
      this.menu.style.display = "none"
    }
  }
}
