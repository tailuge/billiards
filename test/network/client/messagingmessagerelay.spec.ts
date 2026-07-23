import { MessagingMessageRelay } from "../../../src/network/client/messagingmessagerelay"
import { MessagingClient, Table } from "@tailuge/messaging"
import { Session } from "../../../src/network/client/session"

// Mock the Table class methods we care about
const mockTable = {
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
    mockClient = new (MessagingClient as any)({ baseUrl: "http://test" })
  })

  it("should connect and join the table with the correct tableId and clientId", async () => {
    const relay = new MessagingMessageRelay()
    await relay.connect(mockClient, "test-table")

    expect(mockClient.joinTable).toHaveBeenCalledWith(
      "test-table",
      "test-client"
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
    const registeredHandler = mockTable.onMessage.mock.calls[0][0]
    const envelope = {
      type: "MyEvent",
      senderId: "other-client",
      data: { key: "value" },
    }
    registeredHandler(envelope)

    expect(gameCallback).toHaveBeenCalledWith(JSON.stringify({ key: "value" }))
  })

  it("should not deliver messages with type 'table:leave' to subscribers", async () => {
    const relay = new MessagingMessageRelay()
    await relay.connect(mockClient, "test-table")

    const gameCallback = jest.fn()
    relay.subscribe("test-chan", gameCallback)

    const registeredHandler = mockTable.onMessage.mock.calls[0][0]
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
})
