import { Container } from "../container/container"
import { getButton } from "../utils/dom"
import { ballSvg } from "./chat"

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

    // Hydrate ball-SVG buttons
    this.menu
      .querySelectorAll<HTMLButtonElement>(".comment-emoji[data-angle]")
      .forEach((btn) => {
        const angle = parseInt(btn.dataset.angle ?? "0", 10)
        btn.innerHTML = ballSvg(isNaN(angle) ? 0 : angle)
      })

    this.button.onclick = (_) => {
      this.toggleMenu()
    }

    const inputTextDiv = document.getElementById(
      "inputTextDiv"
    ) as HTMLDialogElement
    const inputText = document.getElementById("inputText") as HTMLInputElement

    const sendText = () => {
      const text = inputText.value.trim()
      inputTextDiv.close()
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
          this.openChat()
          return
        }
        const text = btn.innerHTML ?? ""
        this.container.chat.showMessage(text)
        this.container.sendChat(text)
        this.hideMenu()
      })
    })

    inputText.addEventListener("keydown", (e) => {
      e.stopPropagation()
      if (e.key === "Enter") sendText()
    })

    inputText.addEventListener("keyup", (e) => {
      e.stopPropagation()
    })

    document.getElementById("inputSend")?.addEventListener("click", sendText)
    document.getElementById("inputClose")?.addEventListener("click", () => {
      inputTextDiv.close()
    })

    inputTextDiv.addEventListener("close", () => {})
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

  openChat() {
    const inputTextDiv = document.getElementById(
      "inputTextDiv"
    ) as HTMLDialogElement
    const inputText = document.getElementById("inputText") as HTMLInputElement
    this.hideMenu()
    inputTextDiv.showModal()
    inputText.value = ""
    inputText.focus()
  }

  hideMenu() {
    if (this.menu) {
      this.menu.style.display = "none"
    }
  }
}
