import { Chat } from "../../src/view/chat"
import { initDom } from "./dom"

initDom()

describe("Chat", () => {
  let chat: Chat
  let sendMock: jest.Mock

  beforeEach(() => {
    sendMock = jest.fn()
    chat = new Chat(sendMock)
    const chatoutput = document.getElementById("chatoutput")
    if (chatoutput) {
      chatoutput.innerHTML = "" // Clear initial links for testing
    }
  })

  it("should render messages as plain text, preventing XSS", () => {
    const maliciousMsg = "<img src=x onerror=alert('XSS')>"
    chat.showMessage(maliciousMsg)
    const chatoutput = document.getElementById("chatoutput")

    // The message should be present in the text content
    expect(chatoutput?.textContent).toContain(maliciousMsg)

    // But it should NOT be rendered as an img tag
    const img = chatoutput?.querySelector("img")
    expect(img).toBeNull()
  })

  it("should still support system-generated links (pills)", () => {
    // This is the format used by LinkFormatter
    const linkHtml = '<a class="pill" style="color: black" target="_blank" href="?ruletype=nineball">test link</a>'
    chat.showMessage(linkHtml)

    const chatoutput = document.getElementById("chatoutput")
    const link = chatoutput?.querySelector("a.pill")
    expect(link).not.toBeNull()
    expect(link?.getAttribute("href")).toBe("?ruletype=nineball")
    expect(link?.textContent).toBe("test link")
  })

  it("should block javascript: URIs even with leading whitespace", () => {
    // Malicious link attempting to bypass check with a space
    const maliciousLink = '<a class="pill" style="color: black" target="_blank" href=" javascript:alert(1)">test link</a>'
    chat.showMessage(maliciousLink)

    const chatoutput = document.getElementById("chatoutput")
    const link = chatoutput?.querySelector("a.pill")

    // The link should be rendered but WITHOUT the href attribute (or with empty/null href)
    expect(link?.hasAttribute("href")).toBe(false)
  })

  it("should block data: and vbscript: URIs", () => {
    const dataLink = '<a class="pill" style="color: black" target="_blank" href="data:text/html,<script>alert(1)</script>">test</a>'
    chat.showMessage(dataLink)
    let link = document.getElementById("chatoutput")?.querySelector("a.pill")
    expect(link?.hasAttribute("href")).toBe(false)

    const vbLink = '<a class="pill" style="color: black" target="_blank" href="vbscript:msgbox(1)">test</a>'
    chat.showMessage(vbLink)
    link = document.getElementById("chatoutput")?.querySelectorAll("a.pill")[1]
    expect(link?.hasAttribute("href")).toBe(false)
  })

  it("should support links without style", () => {
    const noStyleLink = '<a class="pill" target="_blank" href="https://scoreboard-tailuge.vercel.app/hiscore.html">no style</a>'
    chat.showMessage(noStyleLink)
    const link = document.getElementById("chatoutput")?.querySelector("a.pill")
    expect(link).not.toBeNull()
    expect(link?.getAttribute("href")).toBe("https://scoreboard-tailuge.vercel.app/hiscore.html")
    expect(link?.textContent).toBe("no style")
  })
})
