import { Container } from "../container/container"
import { getButton } from "../utils/dom"

export class Comment {
  container: Container
  button: HTMLButtonElement
  menu: HTMLDivElement

  constructor(container: Container) {
    this.container = container

    this.button = getButton("comment")!
    this.menu = document.getElementById("commentMenu") as HTMLDivElement

    // Initially hide the button, we'll show it only in multiplayer mode
    this.updateButtonVisibility()

    if (this.button && this.menu) {
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
    } else {
      setTimeout(() => {
        const btn = document.getElementById("comment") as HTMLButtonElement
        const menu = document.getElementById("commentMenu") as HTMLDivElement
        if (btn && menu) {
          this.button = btn
          this.menu = menu
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
      }, 100)
    }
  }

  updateButtonVisibility() {
    // Show button only in multiplayer mode (when isSinglePlayer is false)
    this.button.hidden = this.container.isSinglePlayer
  }

  toggleMenu() {
    if (this.menu.style.display === "none") {
      this.showMenu()
    } else {
      this.hideMenu()
    }
  }

  showMenu() {
    this.menu.style.display = "grid"
    // Position the menu vertically above the button
    if (this.button) {
      const buttonRect = this.button.getBoundingClientRect()
      this.menu.style.top = `${buttonRect.top - this.menu.offsetHeight - 8}px`
      this.menu.style.left = `${buttonRect.left}px`
      this.menu.style.position = "fixed"
    }
  }

  hideMenu() {
    this.menu.style.display = "none"
  }
}
