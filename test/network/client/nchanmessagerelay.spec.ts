import { NchanMessageRelay } from "../../../src/network/client/nchanmessagerelay"

describe("NchanMessageRelay", () => {
  let mockFetch: jest.Mock

  beforeEach(() => {
    mockFetch = jest.fn()
    globalThis.fetch = mockFetch
  })

  describe("getOnlineCount", () => {
    it("should return the subscribers count from JSON response", async () => {
      const relay = new NchanMessageRelay("test.com")
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ subscribers: 6 }),
      })

      const count = await relay.getOnlineCount()
      expect(count).toBe(6)
      expect(mockFetch).toHaveBeenCalledWith(
        "https://test.com/publish/presence/lobby",
        { method: "POST", headers: { Accept: "application/json" } }
      )
    })

    it("should return null if subscribers field is missing", async () => {
      const relay = new NchanMessageRelay()
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ messages: 0 }),
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
      expect(spy).toHaveBeenCalledWith(
        "Publication error for",
        "https://billiards-network.onrender.com/publish/table/chan1",
        error
      )
      spy.mockRestore()
    })
  })

  describe("subscribe", () => {
    let mockWS: any

    beforeEach(() => {
      mockWS = jest.fn().mockImplementation(() => ({
        onmessage: jest.fn(),
        onerror: jest.fn(),
        onopen: jest.fn(),
        onclose: jest.fn(),
        close: jest.fn(),
      }))
      globalThis.WebSocket = mockWS
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it("should create a WebSocket connection", () => {
      const relay = new NchanMessageRelay("test.com")
      const callback = jest.fn()
      relay.subscribe("chan1", callback)

      expect(mockWS).toHaveBeenCalledWith(
        "wss://test.com/subscribe/table/chan1"
      )
    })

    it("should deduplicate messages based on meta.ts", async () => {
      const relay = new NchanMessageRelay("test.com")
      const callback = jest.fn()
      relay.subscribe("chan1", callback)

      const ws = mockWS.mock.results[0].value

      // First message
      const msg1 = JSON.stringify({ meta: { ts: 100 }, data: "one" })
      await ws.onmessage({ data: msg1 })
      expect(callback).toHaveBeenCalledWith(msg1)

      // Same timestamp message (still allowed since code uses < not <=)
      const msg2 = JSON.stringify({ meta: { ts: 100 }, data: "duplicate" })
      await ws.onmessage({ data: msg2 })
      expect(callback).toHaveBeenCalledWith(msg2)

      // Older message (should be filtered)
      const msg3 = JSON.stringify({ meta: { ts: 99 }, data: "old" })
      await ws.onmessage({ data: msg3 })
      expect(callback).toHaveBeenCalledTimes(2)

      // Newer message
      const msg4 = JSON.stringify({ meta: { ts: 101 }, data: "new" })
      await ws.onmessage({ data: msg4 })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(msg4)
    })

    it("should reconnect on close with exponential backoff", () => {
      const relay = new NchanMessageRelay("test.com")
      const callback = jest.fn()
      relay.subscribe("chan1", callback)

      expect(mockWS).toHaveBeenCalledTimes(1)
      const ws1 = mockWS.mock.results[0].value

      // Trigger close
      ws1.onclose({ code: 1006, reason: "Abnormal Closure", wasClean: false })

      // Should not have reconnected immediately
      expect(mockWS).toHaveBeenCalledTimes(1)

      // Advance time by 1s (initial backoff)
      jest.advanceTimersByTime(1000)
      expect(mockWS).toHaveBeenCalledTimes(2)

      const ws2 = mockWS.mock.results[1].value
      ws2.onclose({ code: 1006, reason: "Abnormal Closure", wasClean: false })

      // Advance time by 2s (exponential backoff)
      jest.advanceTimersByTime(2000)
      expect(mockWS).toHaveBeenCalledTimes(3)
    })

    it("should stop reconnecting if a newer WebSocket exists for the same key", () => {
      const relay = new NchanMessageRelay("test.com")
      const callback = jest.fn()
      relay.subscribe("chan1", callback)

      const ws1 = mockWS.mock.results[0].value
      const ws1OnClose = ws1.onclose

      // Simulate a second subscription (replaces the first in the map)
      relay.subscribe("chan1", callback)
      expect(mockWS).toHaveBeenCalledTimes(2)

      // Trigger close on the first (stale) WebSocket
      ws1OnClose({ code: 1006, reason: "Abnormal Closure", wasClean: false })

      // Advance time and verify no new connection is made from ws1's close
      jest.advanceTimersByTime(1000)
      expect(mockWS).toHaveBeenCalledTimes(2)
    })
  })
})
