import { Logger } from "../../../src/network/bot/logger"
import { initDom } from "../../view/dom"
import { Session } from "../../../src/network/client/session"

initDom()

describe("Logger", () => {
  let logger: Logger

  beforeEach(() => {
    Session.init("test-client", "TestPlayer", "test-table", false)
    jest.spyOn(Session, "isBotMode").mockReturnValue(true)
    logger = new Logger()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should initialize with default values", () => {
    expect(logger.visible).toBe(false)
    expect(logger.expanded).toBe(false)
    expect(logger.entries).toHaveLength(1)
  })

  it("should show and hide the element", () => {
    logger.show()
    expect(logger.visible).toBe(true)
    expect(logger.element.style.display).toBe("block")

    logger.hide()
    expect(logger.visible).toBe(false)
    expect(logger.element.style.display).toBe("none")
  })

  it("should toggle visibility", () => {
    logger.toggle()
    expect(logger.visible).toBe(true)
    logger.toggle()
    expect(logger.visible).toBe(false)
  })

  it("should toggle expanded state", () => {
    logger.toggleExpanded()
    expect(logger.expanded).toBe(true)
    expect(logger.element.classList.contains("compact")).toBe(false)

    logger.toggleExpanded()
    expect(logger.expanded).toBe(false)
    expect(logger.element.classList.contains("compact")).toBe(true)
  })

  it("should log incoming, outgoing and info messages", () => {
    logger.clear()
    logger.incoming("in message")
    logger.outgoing("out message")
    logger.info("info message")

    expect(logger.entries).toHaveLength(3)
    expect(logger.entries[0].direction).toBe("in")
    expect(logger.entries[1].direction).toBe("out")
    expect(logger.entries[2].direction).toBe("info")
  })

  it("should truncate long messages", () => {
    const longMessage = "a".repeat(300)
    logger.info(longMessage)
    const lastEntry = logger.entries[logger.entries.length - 1]
    expect(lastEntry.message.length).toBe(253)
  })

  it("should respect maxEntries", () => {
    logger.maxEntries = 5
    for (let i = 0; i < 10; i++) {
      logger.info(`msg ${i}`)
    }
    expect(logger.entries).toHaveLength(5)
    expect(logger.entries[4].message).toBe("msg 9...")
  })

  it("should clear entries", () => {
    logger.info("msg")
    logger.clear()
    expect(logger.entries).toHaveLength(0)
  })

  it("should handle missing elements gracefully", () => {
    const l = logger as any
    const originalLogElement = l.logElement
    const originalElement = l.element

    l.logElement = null
    logger.render() // Should not throw

    logger.show()
    logger.hide()

    l.element = null
    logger.show()
    logger.hide()

    l.logElement = originalLogElement
    l.element = originalElement

    expect(true).toBe(true)
  })

  it("should handle missing toggle button in constructor", () => {
    const originalGetElementById = document.getElementById.bind(document)
    document.getElementById = jest.fn().mockImplementation((id) => {
      if (id === "botDebugToggle") return null
      return originalGetElementById(id)
    })

    new Logger()

    document.getElementById = originalGetElementById
    expect(true).toBe(true)
  })

  it("should handle missing elements during expanded state update", () => {
    const originalGetElementById = document.getElementById.bind(document)
    document.getElementById = jest.fn().mockImplementation((id) => {
        if (id === "botDebugToggle") return null
        return originalGetElementById(id)
    })

    const l = logger as any
    l.element = null
    logger.toggleExpanded()

    document.getElementById = originalGetElementById
    expect(true).toBe(true)
  })

  it("should respond to button clicks", () => {
    const clearButton = document.getElementById("botDebugClear")
    const toggleButton = document.getElementById("botDebugToggle")

    const clearSpy = jest.spyOn(logger, "clear")
    const toggleExpandedSpy = jest.spyOn(logger, "toggleExpanded")

    clearButton?.click()
    expect(clearSpy).toHaveBeenCalled()

    toggleButton?.click()
    expect(toggleExpandedSpy).toHaveBeenCalled()
  })
})
