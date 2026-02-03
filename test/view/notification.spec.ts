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

  it("should show a message", () => {
    notification.show("Test Message")
    const element = document.getElementById("notification")
    expect(element?.innerHTML).toBe("Test Message")
    expect(element?.style.display).toBe("block")
  })

  it("should clear a message", () => {
    notification.show("Test Message")
    notification.clear()
    const element = document.getElementById("notification")
    expect(element?.innerHTML).toBe("")
    expect(element?.style.display).toBe("none")
  })

  it("should clear a message after a duration", () => {
    notification.show("Test Message", 1000)
    const element = document.getElementById("notification")
    expect(element?.innerHTML).toBe("Test Message")
    
    jest.advanceTimersByTime(1000)
    
    expect(element?.innerHTML).toBe("")
    expect(element?.style.display).toBe("none")
  })

  it("should clear existing timeout when showing a new message", () => {
    notification.show("First Message", 1000)
    notification.show("Second Message", 2000)
    
    const element = document.getElementById("notification")
    
    jest.advanceTimersByTime(1000)
    expect(element?.innerHTML).toBe("Second Message")
    
    jest.advanceTimersByTime(1000)
    expect(element?.innerHTML).toBe("")
  })

  it("should not set a timeout if duration is 0", () => {
    notification.show("Persistent Message", 0)
    const element = document.getElementById("notification")
    
    jest.advanceTimersByTime(10000)
    expect(element?.innerHTML).toBe("Persistent Message")
    expect(element?.style.display).toBe("block")
  })
})
