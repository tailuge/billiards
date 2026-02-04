import { Notification } from "../../src/view/notification"
import { initDom } from "./dom"

initDom()

describe("Notification", () => {
  let notification: Notification

  beforeEach(() => {
    jest.useFakeTimers()
    notification = new Notification()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should show a message string (legacy support)", () => {
    notification.show("Test Message")
    const element = document.getElementById("notification")
    expect(element?.innerHTML).toContain("Test Message")
    expect(element?.innerHTML).toContain("notification-banner")
    expect(element?.classList.contains("type-Info")).toBe(true)
  })

  it("should show structured notification data", () => {
    notification.show({
      type: "Foul",
      title: "FOUL",
      subtext: "Wrong ball",
      extra: "Ball in hand",
    })
    const element = document.getElementById("notification")
    expect(element?.classList.contains("type-Foul")).toBe(true)
    expect(element?.innerHTML).toContain("FOUL")
    expect(element?.innerHTML).toContain("Wrong ball")
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
