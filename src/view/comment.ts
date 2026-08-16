import { Container } from "../container/container"
import { getButton } from "../utils/dom"
import { randomEmojis } from "../utils/utils"

export class Comment {
  container: Container
  button: HTMLButtonElement | null

  constructor(container: Container) {
    this.container = container
    this.button = getButton("comment")

    if (!this.button) {
      return
    }

    this.button.onclick = () => {
      const menuDropdown = document.getElementById(
        "menuDropdown"
      ) as HTMLDetailsElement | null
      if (menuDropdown) {
        menuDropdown.open = false
      }
      this.toggleChat()
    }

    const inputTextDiv = document.getElementById(
      "inputTextDiv"
    ) as HTMLDialogElement
    const inputText = document.getElementById("inputText") as HTMLInputElement
    const emojiList = document.getElementById("chatEmojiList") as HTMLDivElement
    const toggleChatMode = document.getElementById(
      "toggleChatMode"
    ) as HTMLButtonElement

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

    toggleChatMode?.addEventListener("click", () => {
      const emojiMode = inputTextDiv.classList.toggle("emoji-mode")
      toggleChatMode.setAttribute(
        "aria-label",
        emojiMode ? "Switch to text mode" : "Switch to emoji mode"
      )
      if (emojiMode) {
        this.populateEmojiList(emojiList)
      }
    })

    // Esc closes the chat even when focus has moved to the game canvas.
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && inputTextDiv.open) {
        this.closeChat()
      }
    })
  }

  private populateEmojiList(emojiList: HTMLDivElement) {
    const emojiCount = window.matchMedia("(max-width: 500px)").matches ? 6 : 12
    const emojis = randomEmojis(emojiCount)
    emojiList.innerHTML = ""
    emojis.forEach((emoji) => {
      const button = document.createElement("button")
      button.type = "button"
      button.className = "chat-emoji"
      button.textContent = emoji
      button.setAttribute("aria-label", `Send ${emoji}`)
      button.addEventListener("click", () => {
        this.container.chat.showMessage(emoji)
        this.container.sendChat(emoji)
      })
      emojiList.appendChild(button)
    })
  }

  setVisible(visible: boolean) {
    if (this.button) {
      this.button.hidden = !visible
      this.button.disabled = !visible
    }
  }

  toggleChat() {
    const inputTextDiv = document.getElementById(
      "inputTextDiv"
    ) as HTMLDialogElement
    if (inputTextDiv.open) {
      this.closeChat()
    } else {
      this.openChat()
    }
  }

  openChat() {
    const inputTextDiv = document.getElementById(
      "inputTextDiv"
    ) as HTMLDialogElement
    const inputText = document.getElementById("inputText") as HTMLInputElement
    inputTextDiv.classList.add("emoji-mode")
    document
      .getElementById("toggleChatMode")
      ?.setAttribute("aria-label", "Switch to text mode")
    this.populateEmojiList(
      document.getElementById("chatEmojiList") as HTMLDivElement
    )
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
}
