import { MessagingMessageRelay } from "../../../src/network/client/messagingmessagerelay"
import { MessagingClient } from "@tailuge/messaging"
import { Session } from "../../../src/network/client/session"

// Mock the Table class methods we care about
const mockTable: {
  onOpponentLeft: jest.Mock
  onMessage: jest.Mock
  publish: jest.Mock
  bothJoined?: Promise<void>
} = {
  onOpponentLeft: jest.fn(),
  onMessage: jest.fn(),
  publish: jest.fn().mockResolvedValue(undefined),
}

// Mock MessagingClient so joinTable returns our mock table
jest.mock("@tailuge/messaging", () => {
  return {
    MessagingClient: jest.fn().mockImplementation(() => ({
      joinTable: jest.fn().mockResolvedValue(mockTable),
    })),
    Table: jest.fn(),
  }
})

describe("MessagingMessageRelay", () => {
  let mockClient: jest.Mocked<MessagingClient>

  beforeEach(() => {
    jest.clearAllMocks()
    mockTable.onOpponentLeft.mockClear()
    mockTable.onMessage.mockClear()
    mockTable.publish.mockClear()
    Session.init("test-client", "TestPlayer", "test-table", false)
    mockClient = new (MessagingClient as any)({ baseUrl: "https://test" })
  })

  it("should connect and join the table with the correct tableId and clientId", async () => {
    const relay = new MessagingMessageRelay()
    await relay.connect(mockClient, "test-table")

    expect(mockClient.joinTable).toHaveBeenCalledWith(
      "test-table",
      "test-client",
      { onMessage: expect.any(Function), onBothJoined: expect.any(Function) }
    )
  })

  it("should register onOpponentLeft handler and call callback when opponent leaves", async () => {
    const relay = new MessagingMessageRelay()
    const onOpponentLeft = jest.fn()
    await relay.connect(mockClient, "test-table", onOpponentLeft)

    expect(mockTable.onOpponentLeft).toHaveBeenCalledWith(expect.any(Function))

    // Simulate the library firing the opponent-left event
    const registeredHandler = mockTable.onOpponentLeft.mock.calls[0][0]
    registeredHandler()
    expect(onOpponentLeft).toHaveBeenCalled()
  })

  it("should subscribe to channel and deliver unwrapped message data to callback", async () => {
    const relay = new MessagingMessageRelay()
    await relay.connect(mockClient, "test-table")

    const gameCallback = jest.fn()
    relay.subscribe("test-chan", gameCallback)

    // Simulate the library delivering a TableMessage envelope
    const registeredHandler = mockClient.joinTable.mock.calls[0][2].onMessage
    const envelope = {
      type: "MyEvent",
      senderId: "other-client",
      data: { key: "value" },
    }
    registeredHandler(envelope)

    expect(gameCallback).toHaveBeenCalledWith(JSON.stringify({ key: "value" }))
  })

  it("should deduplicate messages based on meta.ts timestamp", async () => {
    const relay = new MessagingMessageRelay()
    await relay.connect(mockClient, "test-table")

    const gameCallback = jest.fn()
    relay.subscribe("test-chan", gameCallback)

    const registeredHandler = mockClient.joinTable.mock.calls[0][2].onMessage

    // First message with meta.ts = 100
    registeredHandler({
      type: "MyEvent",
      senderId: "other-client",
      data: { key: "one" },
      meta: { ts: 100 },
    })
    expect(gameCallback).toHaveBeenCalledWith(JSON.stringify({ key: "one" }))

    // Message with same timestamp (meta.ts = 100) -> allowed (ts < lastTs check)
    registeredHandler({
      type: "MyEvent",
      senderId: "other-client",
      data: { key: "duplicate" },
      meta: { ts: 100 },
    })
    expect(gameCallback).toHaveBeenCalledWith(
      JSON.stringify({ key: "duplicate" })
    )

    // Older message (meta.ts = 99) -> ignored/filtered
    gameCallback.mockClear()
    registeredHandler({
      type: "MyEvent",
      senderId: "other-client",
      data: { key: "old" },
      meta: { ts: 99 },
    })
    expect(gameCallback).not.toHaveBeenCalled()

    // Newer message (meta.ts = 101) -> allowed
    registeredHandler({
      type: "MyEvent",
      senderId: "other-client",
      data: { key: "new" },
      meta: { ts: 101 },
    })
    expect(gameCallback).toHaveBeenCalledWith(JSON.stringify({ key: "new" }))
  })

  it("should not deliver messages with type 'table:leave' to subscribers", async () => {
    const relay = new MessagingMessageRelay()
    await relay.connect(mockClient, "test-table")

    const gameCallback = jest.fn()
    relay.subscribe("test-chan", gameCallback)

    const registeredHandler = mockClient.joinTable.mock.calls[0][2].onMessage
    registeredHandler({ type: "table:leave", senderId: "other", data: {} })

    expect(gameCallback).not.toHaveBeenCalled()
  })

  it("should publish a JSON message wrapped with its type and data", async () => {
    const relay = new MessagingMessageRelay()
    await relay.connect(mockClient, "test-table")

    const rawMessage = JSON.stringify({ type: "MyEvent", value: 123 })
    relay.publish("test-chan", rawMessage)

    // Allow microtask queue to flush
    await Promise.resolve()

    expect(mockTable.publish).toHaveBeenCalledWith("MyEvent", {
      type: "MyEvent",
      value: 123,
    })
  })

  it("should publish raw strings with 'unknown' type", async () => {
    const relay = new MessagingMessageRelay()
    await relay.connect(mockClient, "test-table")

    relay.publish("test-chan", "raw-text")
    await Promise.resolve()

    expect(mockTable.publish).toHaveBeenCalledWith("unknown", "raw-text")
  })

  it("should not publish if connect has not been called", async () => {
    const relay = new MessagingMessageRelay()

    relay.publish("test-chan", JSON.stringify({ type: "SomeEvent" }))
    await Promise.resolve()

    expect(mockTable.publish).not.toHaveBeenCalled()
  })

  it("should not connect a second time if already connected", async () => {
    const relay = new MessagingMessageRelay()
    await relay.connect(mockClient, "test-table")
    await relay.connect(mockClient, "test-table")

    expect(mockClient.joinTable).toHaveBeenCalledTimes(1)
  })

  it("queues publishes during connect() and flushes them once table is ready (slow-party timing fix)", async () => {
    // This test simulates the scenario where:
    // 1. Slow party (mobile, &first) calls connect(), which calls joinTable()
    // 2. joinTable() internally awaits table.join() which awaits publish("joined")
    // 3. During that await, the WebSocket is live and BeginEvent from fast party arrives
    // 4. handleBegin fires, tries to send WatchEvent via publish()
    // 5. publish() sees this.table is null → queues the publish instead of dropping it
    // 6. Once connect() completes, the queued WatchEvent is flushed → fast party gets it

    const relay = new MessagingMessageRelay()

    // Simulate initGameLoop subscribing the netEvent callback before connectRelay
    const gameCallback = jest.fn()
    relay.subscribe("test-table", gameCallback)

    // Make joinTable capture onMessage but NOT resolve yet (simulating slow "joined" publish)
    let capturedOnMessage: ((message: unknown) => void) | undefined
    let resolveJoin: (value: any) => void
    mockClient.joinTable.mockImplementationOnce(
      (_tableId, _clientId, options) => {
        capturedOnMessage = options.onMessage
        return new Promise((resolve) => {
          resolveJoin = resolve
        })
      }
    )

    // Start connect but DON'T await — leaves this.table null (like slow connection)
    const connectPromise = relay.connect(mockClient, "test-table")

    // joinTable was called, so onMessage was captured (registered with Table's messageListeners)
    expect(mockClient.joinTable).toHaveBeenCalled()

    // Simulate BeginEvent arriving via the Table's WebSocket → onMessage
    // Receiving works fine: onMessage → pendingCallbacks → gameCallback
    capturedOnMessage!({
      type: "BEGIN",
      senderId: "other-client",
      data: { type: "BEGIN", clientId: "other-client" },
    })
    expect(gameCallback).toHaveBeenCalledWith(
      JSON.stringify({ type: "BEGIN", clientId: "other-client" })
    )

    // Game processes BeginEvent, tries to respond with WatchEvent via publish()
    relay.publish(
      "test-table",
      JSON.stringify({ type: "WATCHAIM", json: { balls: [] } })
    )
    await Promise.resolve()

    // publish is queued — this.table is still null, but nothing is dropped
    expect((relay as any).table).toBeNull()
    expect(mockTable.publish).not.toHaveBeenCalled()

    // After connect() resolves, the queued publish is flushed automatically
    resolveJoin!(mockTable)
    await connectPromise

    // The queued WatchEvent from above is now published
    expect(mockTable.publish).toHaveBeenCalledWith("WATCHAIM", {
      type: "WATCHAIM",
      json: { balls: [] },
    })

    // Subsequent publishes work normally
    mockTable.publish.mockClear()
    relay.publish(
      "test-table",
      JSON.stringify({ type: "WATCHAIM", json: { balls: [] } })
    )
    await Promise.resolve()
    expect(mockTable.publish).toHaveBeenCalledWith("WATCHAIM", {
      type: "WATCHAIM",
      json: { balls: [] },
    })
  })

  describe("awaitBothJoined", () => {
    beforeEach(() => {
      mockTable.bothJoined = undefined
    })

    it("resolves immediately when bothJoined has already resolved", async () => {
      const relay = new MessagingMessageRelay()
      await relay.connect(mockClient, "test-table")
      mockTable.bothJoined = Promise.resolve()

      await expect(relay.awaitBothJoined(1000)).resolves.toBeUndefined()
    })

    it("resolves when bothJoined resolves during the wait", async () => {
      const relay = new MessagingMessageRelay()
      await relay.connect(mockClient, "test-table")
      let resolveBoth: () => void = () => {}
      mockTable.bothJoined = new Promise<void>((resolve) => {
        resolveBoth = resolve
      })

      const pending = relay.awaitBothJoined(1000)
      resolveBoth()
      await expect(pending).resolves.toBeUndefined()
    })

    it("rejects with Error when bothJoined does not resolve before timeout", async () => {
      const relay = new MessagingMessageRelay()
      await relay.connect(mockClient, "test-table")
      mockTable.bothJoined = new Promise<void>(() => undefined) // never resolves

      await expect(relay.awaitBothJoined(50)).rejects.toThrow(
        /bothJoined timed out/
      )
    })

    it("is a no-op when the underlying Table has no bothJoined field (older lib)", async () => {
      const relay = new MessagingMessageRelay()
      await relay.connect(mockClient, "test-table")
      mockTable.bothJoined = undefined

      await expect(relay.awaitBothJoined(50)).resolves.toBeUndefined()
    })
  })
})
