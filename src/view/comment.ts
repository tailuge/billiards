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
