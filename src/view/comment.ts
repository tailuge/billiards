import { Container } from "../container/container"
import { getButton } from "../utils/dom"
import { randomEmojis } from "../utils/utils"
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
      this.openChat()
      this.showMenu()
    }

    const inputTextDiv = document.getElementById(
      "inputTextDiv"
    ) as HTMLDialogElement
    const inputText = document.getElementById("inputText") as HTMLInputElement

    const sendText = () => {
      const text = inputText.value.trim()
      if (text) {
        this.container.chat.showMessage(text)
        this.container.sendChat(text)
        inputText.value = ""
      }
      // Keep the input open so further messages can be typed; close via ✖ or Esc.
      inputText.focus()
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
      if (e.key === "Escape") this.closeChat()
    })

    inputText.addEventListener("keyup", (e) => {
      e.stopPropagation()
    })

    document.getElementById("inputSend")?.addEventListener("click", sendText)
    document.getElementById("inputClose")?.addEventListener("click", () => {
      this.closeChat()
    })

    inputTextDiv.addEventListener("close", () => {})

    // Esc closes the chat even when focus has moved to the game canvas
    // (the input's own keydown handler covers the case where it has focus).
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && inputTextDiv.open) {
        this.closeChat()
      }
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
    const randomButtons =
      this.menu.querySelectorAll<HTMLButtonElement>(".comment-random")
    const emojis = randomEmojis(randomButtons.length)
    randomButtons.forEach((btn, i) => {
      btn.innerHTML = emojis[i]
    })
  }

  openChat() {
    const inputTextDiv = document.getElementById(
      "inputTextDiv"
    ) as HTMLDialogElement
    const inputText = document.getElementById("inputText") as HTMLInputElement
    this.hideMenu()
    inputTextDiv.show()
    inputText.value = ""
    inputText.focus()
  }

  closeChat() {
    const inputTextDiv = document.getElementById(
      "inputTextDiv"
    ) as HTMLDialogElement
    inputTextDiv.close()
    // Non-modal dialogs don't return focus automatically — hand it back to the
    // game canvas so keyboard controls (arrows, F for fullscreen, etc.) resume.
    ;(this.container.view.element as HTMLElement | null)?.focus()
  }

  hideMenu() {
    if (this.menu) {
      this.menu.style.display = "none"
    }
  }
}
