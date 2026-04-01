import { Container } from "../container/container"
import { getButton } from "../utils/dom"

const EMOJIS = ["🍀", "🐢", "🐑", "👏", "🧸", "🧙‍♂️", "🎖️", "🦈", "👀"]

export class Comment {
  container: Container
  button: HTMLButtonElement
  menu: HTMLDivElement | null = null

  constructor(container: Container) {
    this.container = container

    this.button = getButton("comment")!
    if (this.button) {
      this.button.hidden = true
      this.button.onclick = (_) => {
        this.toggleMenu()
      }
    } else {
      setTimeout(() => {
        const btn = document.getElementById("comment") as HTMLButtonElement
        if (btn) {
          this.button = btn
          this.button.hidden = false
          this.button.onclick = (_) => {
            this.toggleMenu()
          }
        }
      }, 100)
    }
  }

  toggleMenu() {
    if (this.menu) {
      this.hideMenu()
    } else {
      this.showMenu()
    }
  }

  showMenu() {
    this.menu = document.createElement("div")
    this.menu.className = "comment-menu"

    const rect = this.button.getBoundingClientRect()
    this.menu.style.position = "fixed"
    this.menu.style.left = rect.left + rect.width / 2 + "px"
    this.menu.style.top = rect.bottom + 8 + "px"
    this.menu.style.transform = "translateX(-50%)"

    EMOJIS.forEach((emoji) => {
      const btn = document.createElement("button")
      btn.className = "comment-emoji"
      btn.textContent = emoji
      btn.onclick = (_) => {
        this.container.sendChat(emoji)
        this.hideMenu()
      }
      this.menu!.appendChild(btn)
    })

    document.body.appendChild(this.menu)
  }

  hideMenu() {
    if (this.menu) {
      this.menu.remove()
      this.menu = null
    }
  }
}
