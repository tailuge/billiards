import { MessagingMessageRelay } from "../../../src/network/client/messagingmessagerelay"
import { MessagingClient } from "@tailuge/messaging"
import { Session } from "../../../src/network/client/session"

// Mock the Table class methods we care about
const mockTable: {
  onOpponentLeft: jest.Mock
  onOpponentRejoined: jest.Mock
  publish: jest.Mock
  bothJoined?: Promise<void>
} = {
  onOpponentLeft: jest.fn(),
  onOpponentRejoined: jest.fn(),
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
    mockTable.onOpponentRejoined.mockClear()
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

  it("delivers messages to subscribers while joinTable is still resolving (construction-time onMessage)", async () => {
    // The library registers onMessage when the table is constructed, so a
    // message arriving during the join handshake must not be dropped to an
    // empty listener list.
    const relay = new MessagingMessageRelay()
    const gameCallback = jest.fn()
    relay.subscribe("test-table", gameCallback)

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

    // Start connect but DON'T await — joinTable has not resolved yet
    const connectPromise = relay.connect(mockClient, "test-table")

    expect(mockClient.joinTable).toHaveBeenCalled()

    // Opponent BeginEvent arrives during the handshake
    capturedOnMessage!({
      type: "BEGIN",
      senderId: "other-client",
      data: { type: "BEGIN", clientId: "other-client" },
    })
    expect(gameCallback).toHaveBeenCalledWith(
      JSON.stringify({ type: "BEGIN", clientId: "other-client" })
    )

    resolveJoin!(mockTable)
    await connectPromise
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

  describe("awaitBothJoined", () => {
    it("resolves when bothJoined resolves during the wait", async () => {
      const relay = new MessagingMessageRelay()
      await relay.connect(mockClient, "test-table")
      let resolveBoth: () => void = () => {}
      mockTable.bothJoined = new Promise<void>((resolve) => {
        resolveBoth = resolve
      })

      const pending = relay.awaitBothJoined()
      resolveBoth()
      await expect(pending).resolves.toBeUndefined()
    })

    it("resolves immediately when bothJoined has already resolved", async () => {
      const relay = new MessagingMessageRelay()
      await relay.connect(mockClient, "test-table")
      mockTable.bothJoined = Promise.resolve()

      await expect(relay.awaitBothJoined()).resolves.toBeUndefined()
    })

    it("is a no-op when the relay has not connected", async () => {
      const relay = new MessagingMessageRelay()

      await expect(relay.awaitBothJoined()).resolves.toBeUndefined()
    })
  })
})
