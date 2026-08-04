import { expect } from "chai"
import { initDom } from "./dom"
import { fireEvent } from "@testing-library/dom"
import { Container } from "../../src/container/container"
import { Assets } from "../../src/view/assets"

initDom()

let container: Container

beforeEach(function (done) {
  initDom()
  const inputTextDiv = document.getElementById(
    "inputTextDiv"
  ) as HTMLDialogElement
  inputTextDiv.open = false
  if (!inputTextDiv.show) {
    inputTextDiv.show = () => {
      inputTextDiv.open = true
    }
  }
  if (!inputTextDiv.close) {
    inputTextDiv.close = () => {
      inputTextDiv.open = false
    }
  }
  container = new Container({
    element: document.getElementById("viewP1"),
    log: (_) => {},
    assets: Assets.localAssets(),
  })
  done()
})

describe("Comment", () => {
  it("comment button toggles the new chat area", () => {
    const commentBtn = document.getElementById("comment") as HTMLButtonElement
    const inputTextDiv = document.getElementById(
      "inputTextDiv"
    ) as HTMLDialogElement

    expect(inputTextDiv.open).to.equal(false)
    fireEvent.click(commentBtn)
    expect(inputTextDiv.open).to.equal(true)
    fireEvent.click(commentBtn)
    expect(inputTextDiv.open).to.equal(false)
  })

  it("does not include the old emoji panel", () => {
    expect(document.getElementById("commentMenu")).to.equal(null)
    expect(document.querySelector(".comment-emoji")).to.equal(null)
  })

  it("toggles the chat input between text and random emoji modes", () => {
    const inputTextDiv = document.getElementById(
      "inputTextDiv"
    ) as HTMLDialogElement
    const toggle = document.getElementById(
      "toggleChatMode"
    ) as HTMLButtonElement
    const emojiList = document.getElementById("chatEmojiList") as HTMLDivElement

    expect(inputTextDiv.classList.contains("emoji-mode")).to.equal(false)
    fireEvent.click(toggle)

    expect(inputTextDiv.classList.contains("emoji-mode")).to.equal(true)
    expect(toggle.getAttribute("aria-label")).to.equal("Switch to text mode")
    expect(emojiList.querySelectorAll(".chat-emoji")).to.have.lengthOf(12)
    const shownEmojis = emojiList.textContent ?? ""
    ;["🚬", "🥃", "🍀", "👏", "🎖️", "👀"].forEach((emoji) => {
      expect(shownEmojis).to.include(emoji)
    })

    fireEvent.click(toggle)
    expect(inputTextDiv.classList.contains("emoji-mode")).to.equal(false)
    expect(toggle.getAttribute("aria-label")).to.equal("Switch to emoji mode")
  })

  it("clicking a chat emoji sends it without closing the picker", () => {
    const toggle = document.getElementById(
      "toggleChatMode"
    ) as HTMLButtonElement
    const emojiList = document.getElementById("chatEmojiList") as HTMLDivElement
    const sendChat = jest.spyOn(container, "sendChat")

    fireEvent.click(toggle)
    const emojiButton = emojiList.querySelector(
      ".chat-emoji"
    ) as HTMLButtonElement
    const emoji = emojiButton.textContent
    fireEvent.click(emojiButton)

    expect(sendChat.mock.calls).to.have.length.greaterThan(0)
    expect(sendChat.mock.calls[0][0]).to.equal(emoji)
    expect(
      (
        document.getElementById("inputTextDiv") as HTMLDialogElement
      ).classList.contains("emoji-mode")
    ).to.equal(true)
    sendChat.mockRestore()
  })
})
