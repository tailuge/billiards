import { Chat } from "../../src/view/chat"
import { initDom } from "./dom"

initDom()

describe("Chat", () => {
  beforeEach(() => {
    initDom()
  })

  it("appends plain text without replacing the lobby link", () => {
    const chat = new Chat(jest.fn())
    const originalLobby = document.getElementById("lobby")

    chat.showMessage("Start")

    const chatoutput = document.getElementById("chatoutput")
    const currentLobby = document.getElementById("lobby")

    expect(chatoutput?.textContent).toContain("Start")
    expect(currentLobby).toBe(originalLobby)
  })

  it("appends html content without replacing the lobby link", () => {
    const chat = new Chat(jest.fn())
    const originalLobby = document.getElementById("lobby")

    chat.showMessage('<a class="pill" href="/test">upload</a>')

    const currentLobby = document.getElementById("lobby")
    const links = document.querySelectorAll("#chatoutput a")

    expect(currentLobby).toBe(originalLobby)
    expect(links.length).toBeGreaterThan(3)
    expect(
      Array.from(links).some((link) => link.getAttribute("href") === "/test")
    ).toBe(true)
  })
})
