import { Notification } from "../../src/view/notification"
import { Chat } from "../../src/view/chat"
import { initDom } from "./dom"

initDom()

describe("XSS Prevention", () => {
  beforeEach(() => {
    initDom()
  })

  it("Chat.showMessage should escape HTML by using textContent", () => {
    const chat = new Chat(() => {})
    const maliciousMsg = "<b id='xss'>XSS</b>"
    chat.showMessage(maliciousMsg)

    const chatOutput = document.getElementById("chatoutput")!
    expect(chatOutput.innerHTML).not.toContain("<b id=\"xss\">")
    expect(chatOutput.textContent).toContain(maliciousMsg)
    expect(document.getElementById("xss")).toBeNull()
  })

  it("Chat.appendElement should allow adding elements (trusted)", () => {
    const chat = new Chat(() => {})
    const trustedEl = document.createElement("b")
    trustedEl.id = "trusted"
    trustedEl.textContent = "Trusted"
    chat.appendElement(trustedEl)

    const chatOutput = document.getElementById("chatoutput")!
    expect(chatOutput.innerHTML).toContain("<b id=\"trusted\">Trusted</b>")
    expect(document.getElementById("trusted")).not.toBeNull()
  })

  it("Notification should escape title and subtext", () => {
    const notification = new Notification()
    notification.show({
      type: "Info",
      title: "<b id='title-xss'>Title</b>",
      subtext: "<b id='subtext-xss'>Subtext</b>",
    })

    expect(document.getElementById("title-xss")).toBeNull()
    expect(document.getElementById("subtext-xss")).toBeNull()

    const element = document.getElementById("notification")!
    expect(element.innerHTML).toContain("&lt;b id='title-xss'&gt;Title&lt;/b&gt;")
    expect(element.innerHTML).toContain("&lt;b id='subtext-xss'&gt;Subtext&lt;/b&gt;")
  })
})

describe("Notification", () => {
  let notification: Notification

  beforeEach(() => {
    jest.useFakeTimers()
    notification = new Notification()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should show a message string (legacy support and escaped)", () => {
    notification.show("Test <b>Message</b>")
    const element = document.getElementById("notification")
    expect(element?.innerHTML).toContain("Test &lt;b&gt;Message&lt;/b&gt;")
    expect(element?.innerHTML).toContain("notification-banner")
    expect(element?.classList.contains("type-Info")).toBe(true)
  })

  it("should show structured notification data and escape title/subtext", () => {
    notification.show({
      type: "Foul",
      title: "<b>FOUL</b>",
      subtext: "<i>Wrong ball</i>",
      extra: "Ball in hand",
    })
    const element = document.getElementById("notification")
    expect(element?.classList.contains("type-Foul")).toBe(true)
    expect(element?.innerHTML).toContain("&lt;b&gt;FOUL&lt;/b&gt;")
    expect(element?.innerHTML).toContain("&lt;i&gt;Wrong ball&lt;/i&gt;")
    expect(element?.innerHTML).toContain("Ball in hand")
    expect(element?.innerHTML).toContain("notification-title")
    expect(element?.innerHTML).toContain("notification-banner")
    expect(element?.innerHTML).toContain("notification-badge")
  })

  it("should clear a message", () => {
    notification.show("Test Message")
    notification.clear()
    const element = document.getElementById("notification")
    expect(element?.innerHTML).toBe("")
  })

  it("should clear a message after a duration", () => {
    notification.show("Test Message", 1000)
    const element = document.getElementById("notification")
    expect(element?.innerHTML).toContain("Test Message")

    jest.advanceTimersByTime(1000)

    expect(element?.innerHTML).toBe("")
  })

  it("should clear existing timeout when showing a new message", () => {
    notification.show("First Message", 1000)
    notification.show("Second Message", 2000)

    const element = document.getElementById("notification")

    jest.advanceTimersByTime(1000)
    expect(element?.innerHTML).toContain("Second Message")

    jest.advanceTimersByTime(1000)
    expect(element?.innerHTML).toBe("")
  })

  it("should not set a timeout if duration is 0", () => {
    notification.show("Persistent Message", 0)
    const element = document.getElementById("notification")

    jest.advanceTimersByTime(10000)
    expect(element?.innerHTML).toContain("Persistent Message")
  })
})
