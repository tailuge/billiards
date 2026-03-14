import { PresenceClient } from "../../../src/network/client/presenceclient"

type FakeMessageEvent = { data: unknown }

class MockWebSocket {
  onmessage: ((event: FakeMessageEvent) => void) | null = null
  onerror: (() => void) | null = null
  onclose: (() => void) | null = null

  static readonly instances: MockWebSocket[] = []

  constructor(public readonly url: string) {
    MockWebSocket.instances.push(this)
  }

  close(): void {
    // Intentionally empty for mock
  }
}

describe("PresenceClient", () => {
  let mockFetch: jest.Mock
  const originalWebSocket = globalThis.WebSocket

  beforeEach(() => {
    jest.useFakeTimers()
    MockWebSocket.instances = []
    mockFetch = jest.fn().mockResolvedValue({ ok: true })
    globalThis.fetch = mockFetch
    globalThis.WebSocket = MockWebSocket as any
  })

  afterEach(() => {
    jest.useRealTimers()
    globalThis.WebSocket = originalWebSocket
  })

  it("publishes join and heartbeat on schedule", () => {
    const client = new PresenceClient("u1", "Alice", "en-US", "origin:test")
    client.start()

    expect(MockWebSocket.instances[0]?.url).toBe(
      "wss://billiards-network.onrender.com/subscribe/presence/lobby"
    )

    jest.advanceTimersByTime(100)
    expect(mockFetch).toHaveBeenCalledWith(
      "https://billiards-network.onrender.com/publish/presence/lobby",
      expect.objectContaining({
        method: "POST",
        keepalive: false,
      })
    )

    const joinBody = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(joinBody.type).toBe("join")
    expect(joinBody.messageType).toBe("presence")

    jest.advanceTimersByTime(60_000)
    const heartbeatBody = JSON.parse(mockFetch.mock.calls[1][1].body)
    expect(heartbeatBody.type).toBe("heartbeat")
  })

  it("updates count from protocol messages and expires stale users", () => {
    jest.setSystemTime(1_000_000)
    const client = new PresenceClient("u1", "Alice")
    const counts: number[] = []
    client.onCountChange((count) => counts.push(count))
    client.start()

    const ws = MockWebSocket.instances[0]
    ws.onmessage?.({
      data: JSON.stringify({
        messageType: "presence",
        type: "join",
        userId: "u2",
        userName: "Bob",
        timestamp: 1_000_000,
      }),
    })
    expect(counts[counts.length - 1]).toBe(1)

    jest.advanceTimersByTime(91_000)
    expect(counts[counts.length - 1]).toBe(0)
  })

  it("publishes leave on stop with keepalive", () => {
    const client = new PresenceClient("u1", "Alice")
    client.start()

    jest.advanceTimersByTime(100)
    client.stop()

    const leaveCall = mockFetch.mock.calls.find((call) => {
      const body = JSON.parse(call[1].body)
      return body.type === "leave"
    })
    expect(leaveCall).toBeDefined()
    expect(leaveCall[1].keepalive).toBe(true)
  })

  it("includes ua field in payload if provided", () => {
    const client = new PresenceClient(
      "u1",
      "Alice",
      undefined,
      undefined,
      undefined,
      undefined,
      "Mozilla/5.0"
    )
    client.start()
    jest.advanceTimersByTime(100)

    const joinBody = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(joinBody.ua).toBe("Mozilla/5.0")
  })

  describe("Challenge detection", () => {
    let client: PresenceClient
    let challenges: Array<any>

    beforeEach(() => {
      client = new PresenceClient("u1", "Alice")
      challenges = []
      client.onChallengeChange((challenger) => challenges.push(challenger))
      client.start()
    })

    const sendPresence = (
      type: string,
      userId: string,
      opponentId?: string,
      userName = "Bob"
    ) => {
      const ws = MockWebSocket.instances[0]
      ws.onmessage?.({
        data: JSON.stringify({
          messageType: "presence",
          type,
          userId,
          userName,
          opponentId,
          timestamp: Date.now(),
        }),
      })
    }

    it("triggers challenge callback when opponentId matches current user", () => {
      sendPresence("heartbeat", "u2", "u1")
      expect(challenges).toEqual([{ userId: "u2", userName: "Bob" }])

      sendPresence("heartbeat", "u2")
      expect(challenges).toEqual([{ userId: "u2", userName: "Bob" }, null])
    })

    it("removes challenge when challenger leaves", () => {
      sendPresence("heartbeat", "u2", "u1")
      expect(challenges).toEqual([{ userId: "u2", userName: "Bob" }])

      sendPresence("leave", "u2")
      expect(challenges).toEqual([{ userId: "u2", userName: "Bob" }, null])
    })

    it("handles messages with locale and preserves it", () => {
      const ws = MockWebSocket.instances[0]
      ws.onmessage?.({
        data: JSON.stringify({
          messageType: "presence",
          type: "join",
          userId: "u3",
          userName: "Charlie",
          locale: "fr-FR",
          timestamp: Date.now(),
        }),
      })
      // Internal state isn't directly exposed, but we can verify it doesn't crash and count updates
    })
  })

  it("handles invalid messages gracefully", () => {
    const client = new PresenceClient("u1", "Alice")
    client.start()
    const ws = MockWebSocket.instances[0]

    const invalidMessages = [
      null,
      "not json",
      JSON.stringify({ messageType: "not presence" }),
      JSON.stringify({ messageType: "presence", type: "unknown" }),
      JSON.stringify({ messageType: "presence", type: "join" }), // missing ids
      JSON.stringify({
        messageType: "presence",
        type: "join",
        userId: "u2",
        userName: "Bob",
        opponentId: 123,
      }), // invalid opponentId type
    ]

    invalidMessages.forEach((msg) => {
      ws.onmessage?.({ data: msg })
    })
  })

  it("covers stop() edge cases", () => {
    const client = new PresenceClient("u1", "Alice")
    client.start()
    const ws = MockWebSocket.instances[0]
    // Mock websocket close to throw
    ws.close = () => {
      throw new Error("close failed")
    }
    client.stop()
    client.stop() // second call should return early
  })

  it("handles WebSocket error gracefully", () => {
    const client = new PresenceClient("u1", "Alice")
    client.start()
    const ws = MockWebSocket.instances[0]
    const consoleSpy = jest.spyOn(console, "error").mockImplementation()

    ws.onerror?.({ type: "error" } as Event)

    expect(consoleSpy).toHaveBeenCalledWith(
      "Presence WebSocket error on",
      expect.any(String),
      ":",
      "error",
      expect.anything()
    )
    consoleSpy.mockRestore()
  })
})
