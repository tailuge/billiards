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

    if (this.button && this.menu) {
      this.button.hidden = true
      this.button.onclick = (_) => {
        this.toggleMenu()
      }

      const emojiButtons = this.menu.querySelectorAll(".comment-emoji")
      emojiButtons.forEach((btn) => {
        btn.addEventListener("click", (_) => {
          this.container.sendChat(btn.textContent)
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
          this.button.hidden = false
          this.button.onclick = (_) => {
            this.toggleMenu()
          }

          const emojiButtons = this.menu.querySelectorAll(".comment-emoji")
          emojiButtons.forEach((btn) => {
            btn.addEventListener("click", (_) => {
              this.container.sendChat(btn.textContent)
              this.hideMenu()
            })
          })
        }
      }, 100)
    }
  }

  toggleMenu() {
    if (!this.menu) {
      return
    }
    if (this.menu.style.display === "none") {
      this.showMenu()
    } else {
      this.hideMenu()
    }
  }

  showMenu() {
    if (this.menu) {
      this.menu.style.display = "grid"
    }
  }

  hideMenu() {
    if (this.menu) {
      this.menu.style.display = "none"
    }
  }
}
