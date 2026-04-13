import { ClientErrorReporter } from "../../../src/network/client/clienterrorreporter"

describe("ClientErrorReporter", () => {
  let reporter: ClientErrorReporter
  const endpoint = "https://example.com/api/error"

  beforeEach(() => {
    // Set NODE_ENV to something other than "test" to allow start() to work
    // Or we can mock the check in start()
    process.env.NODE_ENV = "development"

    reporter = new ClientErrorReporter(endpoint)
    // Mock fetch and sendBeacon
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock
    global.navigator.sendBeacon = jest.fn(() => true)
  })

  afterEach(() => {
    process.env.NODE_ENV = "test"
    jest.restoreAllMocks()
    reporter.stop()
  })

  it("should capture and flush errors", async () => {
    reporter.start()
    console.error("Test error")

    // Force flush
    ;(reporter as any).flush()

    expect(global.navigator.sendBeacon).toHaveBeenCalled()
    const payload = JSON.parse(
      (global.navigator.sendBeacon as jest.Mock).mock.calls[0][1]
    )
    expect(payload[0].message).toBe("Test error")
    expect(payload[0].type).toBe("error")
  })

  it("should skip 'Backpack' warning if configured or hardcoded", () => {
    reporter.start()
    const backpackMsg = "Backpack couldn't override `window.ether"
    console.warn(backpackMsg)
    ;(reporter as any).flush()

    expect(global.navigator.sendBeacon).not.toHaveBeenCalled()
  })
})
