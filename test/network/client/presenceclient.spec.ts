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
})
