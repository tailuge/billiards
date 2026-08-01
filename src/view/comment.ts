import { Container } from "../container/container"
import { getButton } from "../utils/dom"
import { randomEmoji } from "../utils/utils"
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
        this.container.chat.showMessage(text)
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
    this.menu
      .querySelectorAll<HTMLButtonElement>(".comment-random")
      .forEach((btn) => {
        btn.innerHTML = randomEmoji()
      })

    const beverageEmojis = "☕🍵🧃🥤🧋🍶🍺🍻🥂🍷🥃🍸🍹🍾🧉🧊🥛🍼☕️"
    // Split the beverage string into individual emojis, handling variation selectors correctly
    const beverageList: string[] = []
    for (let i = 0; i < beverageEmojis.length; i++) {
      const char = beverageEmojis[i]
      const codePoint = beverageEmojis.codePointAt(i)
      if (codePoint !== undefined && codePoint > 0xffff) {
        beverageList.push(String.fromCodePoint(codePoint))
        i++ // skip the low surrogate
      } else {
        // If next char is variation selector, combine them
        if (
          i + 1 < beverageEmojis.length &&
          beverageEmojis.charCodeAt(i + 1) === 0xfe0f
        ) {
          beverageList.push(char + beverageEmojis[i + 1])
          i++
        } else {
          beverageList.push(char)
        }
      }
    }

    this.menu
      .querySelectorAll<HTMLButtonElement>(".comment-emoji.beverage")
      .forEach((btn) => {
        if (beverageList.length > 0) {
          const randomIndex = Math.floor(Math.random() * beverageList.length)
          btn.innerHTML = beverageList[randomIndex]
        }
      })
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
