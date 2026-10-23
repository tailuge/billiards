import { expect } from "chai"
import { initDom } from "./dom"
import { fireEvent } from "@testing-library/dom"
import { Container } from "../../src/container/container"
import { Assets } from "../../src/view/assets"

beforeEach(() => {
  initDom()
  new Container({
    element: document.getElementById("viewP1"),
    log: (_) => {},
    assets: Assets.localAssets(),
  })
})

describe("Comment", () => {
  it("focuses the text input when switching from emoji to text mode", () => {
    const dialog = document.getElementById("inputTextDiv") as HTMLDialogElement
    const input = document.getElementById("inputText") as HTMLInputElement
    const toggle = document.getElementById(
      "toggleChatMode"
    ) as HTMLButtonElement

    dialog.classList.add("emoji-mode")
    input.blur()

    fireEvent.click(toggle)

    expect(dialog.classList.contains("emoji-mode")).to.be.false
    expect(document.activeElement).to.equal(input)
  })
})
