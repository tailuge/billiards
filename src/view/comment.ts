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

    // Initially hide the button, we'll show it only in multiplayer mode
    this.updateButtonVisibility()

    this.button.onclick = (_) => {
      this.toggleMenu()
    }

    const emojiButtons = this.menu.querySelectorAll(".comment-emoji")
    emojiButtons.forEach((btn) => {
      btn.addEventListener("click", (_) => {
        const text = btn.textContent ?? ""
        this.container.chat.showMessage(text)
        this.container.sendChat(text)
        this.hideMenu()
      })
    })
  }

  updateButtonVisibility() {
    // Show button only in multiplayer mode (when isSinglePlayer is false)
    if (this.button) {
      this.button.hidden = this.container.isSinglePlayer
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
