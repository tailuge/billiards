import { NchanMessageRelay } from "../../../src/network/client/nchanmessagerelay"

describe("NchanMessageRelay", () => {
  let mockFetch: jest.Mock

  beforeEach(() => {
    mockFetch = jest.fn()
    globalThis.fetch = mockFetch
  })

  describe("getOnlineCount", () => {
    it("should return the number of active connections minus one", async () => {
      const relay = new NchanMessageRelay("test.com")
      mockFetch.mockResolvedValueOnce({
        text: () => Promise.resolve("Active connections: 10"),
      })

      const count = await relay.getOnlineCount()
      expect(count).toBe(9)
      expect(mockFetch).toHaveBeenCalledWith("https://test.com/basic_status")
    })

    it("should return null if no match is found", async () => {
      const relay = new NchanMessageRelay()
      mockFetch.mockResolvedValueOnce({
        text: () => Promise.resolve("Some other text"),
      })

      const count = await relay.getOnlineCount()
      expect(count).toBeNull()
    })

    it("should return null on fetch error", async () => {
      const relay = new NchanMessageRelay()
      mockFetch.mockRejectedValueOnce(new Error("Network error"))

      const count = await relay.getOnlineCount()
      expect(count).toBeNull()
    })
  })

  describe("publish", () => {
    it("should send a POST request to the publish URL", async () => {
      const relay = new NchanMessageRelay("test.com")
      mockFetch.mockResolvedValueOnce({ ok: true })

      relay.publish("chan1", "hello")

      expect(mockFetch).toHaveBeenCalledWith(
        "https://test.com/publish/table/chan1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: "hello",
        }
      )
    })

    it("should log an error on publication failure", async () => {
      const relay = new NchanMessageRelay()
      const error = new Error("Publish failed")
      mockFetch.mockRejectedValueOnce(error)
      const spy = jest.spyOn(console, "error").mockImplementation()

      relay.publish("chan1", "hello")

      // wait for the promise in publish to settle
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(spy).toHaveBeenCalledWith("Publication error:", error)
      spy.mockRestore()
    })
  })

  describe("subscribe", () => {
    it("should create a WebSocket connection", () => {
      const mockWS = jest.fn().mockImplementation(() => ({
        onmessage: jest.fn(),
        onerror: jest.fn(),
        onopen: jest.fn(),
        onclose: jest.fn(),
      }))
      globalThis.WebSocket = mockWS as any

      const relay = new NchanMessageRelay("test.com")
      const callback = jest.fn()
      relay.subscribe("chan1", callback)

      expect(mockWS).toHaveBeenCalledWith(
        "wss://test.com/subscribe/table/chan1"
      )
    })
  })
})
